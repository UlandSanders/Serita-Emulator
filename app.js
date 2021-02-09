'use strict';
var fs = require('fs'),
	os = require('os'),
	path = require('path'),
	util = require('util'),
	stream = require('stream'),
	cluster = require('cluster'),
	fetch = require('node-fetch'),
	config = JSON.parse(fs.readFileSync('config.json','utf8')),
	cluster_stderr = new stream.Transform({ decodeStrings: false }),
	workers = {
		broadcast: data => workers.instances.filter(worker => worker.exitCode).forEach(worker => worker.send(data)),
		instances: [],
		online: 0,
		count: 0, // this gets set later, the amount of instances to create
		sessions: {},
		data: {
			type: 'worker_data',
			port: process.env.PORT || config.webserver.port,
		}
	},
	make_worker = () =>{
		var worker = cluster.fork(),
			id = workers.instances.push(worker);
		
		worker.send(workers.data);
		worker.process.stderr.pipe(cluster_stderr); // pipe errors
		
		worker.on('message', data => {
			switch(data.type){
				case'started': // webserver initated on server.js instance
					
					workers.online++
					
					// all workers active
					if(workers.online == workers.count)console.log(workers.online + '/' + workers.count + ' workers started, ' + data.msg); // listening on https://localhost:7080
					
					break
				case'store_set':
					workers.sessions[data.sid] = data.session;
					
					workers.broadcast({ type: 'update_session', sessions: workers.sessions });
					
					break
				case'store_get':
					workers.sessions[data.sid].__lastAccess = Date.now();
					
					worker.postMessage({ to: 'store_get', session: workers.sessions[data.sid] })
					
					break
				case'store_del':
					workers.sessions[data.sid] = null;
					
					break
			}
		});
		
		worker.once('exit', code => { // exit will only be called once
			cluster_stderr.eventNames().forEach(event_name =>{
				if(cluster_stderr.listeners(event_name).length >= 6)cluster_stderr.listeners(event_name).forEach((event, event_index)=>{
					if(event_index == id){
						cluster_stderr.off(event_name, event);
					}
				});
			});
			
			if(code){
				workers.instances.splice(id, 1);
				
				// remove from online array
				workers.online--
				
				make_worker(); // make a new worker in its place
			}
		});
	};

if(process.env.REPL_OWNER != null)workers.data.port = null; // on repl.it

setInterval(()=>{
	Object.entries(workers.sessions).filter(([ index, session ]) => session).forEach(([ index, session ]) => {
		var expires = session.__lastAccess + config.proxy.session_timeout; // the time this session should go away
		
		// if expired
		if(expires - Date.now() <= 0){
			workers.sessions[index] = null;
			workers.broadcast({ type: 'update_session', sessions: workers.sessions }); // send updated worker sessions
		}
	});
}, 5000);

fetch('https://api.ipify.org/').then(res => res.text()).catch(err => '127.0.0.1').then(ip => {
	workers.data.ip = ip;
	
	process.env.NODE_ENV = 'production';
	
	cluster.setupMaster({
		exec: 'server.js',
		args: ['--use', 'http', '--use', 'http'],
		stdio: ['ignore', process.stdout, 'pipe', 'ipc'],
	});
	
	// amount was manually set
	if(config.workers.manual_amount.enabled)workers.count = config.workers.manual_amount.count
	// normal, use amount of cpu threads
	else if(config.workers.enabled)workers.count = os.cpus().length
	// workers disabled
	else workers.count = 1
	
	for(var i = 0; i < workers.count; i++)make_worker(i);
});

['SIGTERM', 'SIGHUP', 'SIGINT', 'SIGBREAK'].forEach(signal => process.on(signal, _ => process.exit(0)));

require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
}).on('line', line => {
	var args = line.split(' '),
		mts = args.slice(1).join(' ');
	
	if(args[0])switch(args[0]){
		case'run': // debugging
			var out;
			
			try{ out = eval(mts) }catch(err){ out = err }
			
			console.log(util.format(out));
			
			break
		case'stop':
		case'exit':
			
			process.exit(0);
			
			break
		default:
			console.log(path.basename(__filename) + ' ' + args[0] + ': command not found');
			
			break
	}
});

cluster_stderr._transform = (chunk, encoding, done) => {
	var data = chunk.toString(),
		timestamp = new Date();
	
	fs.appendFileSync('./error.log', timestamp + '\n' + data);
	console.log(timestamp.toUTCString() + ' : encountered error, check error.log\n' + data);
	
	done(null, data);
}