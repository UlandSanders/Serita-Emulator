const ws = require('ws'),
	fs = require('fs'),
	util = require('util'),
	valid_url = url => { try{ return new URL(url) }catch(err){ return null } },
	btoa = (str, encoding = 'base64') => Buffer.from(str, 'utf8').toString(encoding),
	atob = (str, encoding = 'base64') => Buffer.from(str, encoding).toString('utf8'),
	valid_b64_atob = data => { try{ return atob(data) }catch(err){ return null } };

module.exports = server => { try { // server is passed from the require('')(server) in module.exports
	var wss = new ws.Server({ server: server });
	
	wss.on('error', err => console.error('catched: \n\n' + util.format(err)));
	wss.on('connection', (client, req) => {
		req.query = (()=>{ var a = req.url.replace(/[\s\S]*?\?/i, '').replace(/\?/gi, '&').split('&'), b = {}; a.forEach(e => { var c = e.split('='); if(c[1] == null)b[c[0]] = null; else b[c[0]] = c[1] });return b })();
		
		if(!req.query.ws){
			client.send('Missing URL Flag `ws`!');
			return client.close(1008);
		}
		
		var ws_url = valid_b64_atob(req.query.ws);
		
		if(!ws_url || !valid_url(ws_url)) {
			client.send('your url is garbage!!!');
			return client.close(1008);
		}
		
		var server = new ws(ws_url);
		
		server.on('error', err =>{
			console.error('caught:\n\n' + util.format(err));
			
			try{
				client.close(1011);
			}catch(err){
				server.close(1006);
			}
		});
		
		server.on('open', () => {
			client.on('error', err =>{
				try{
					server.close(1001);
				}catch(err){
					server.close(1006);
				}
			});
			
			server.on('message', msg => {
				try{
					client.send(msg);
				}catch(err){}
			});
			
			client.on('message', msg => {
				try{
					server.send(msg);
				}catch(err){}
			});
			
			server.on('close', code => {
				try{
					client.close(code);
				}catch(err){
					client.close(1006);
				}
			});
			
			client.on('close', code => {
				try{
					server.close(code);
				}catch(err){
					server.close(1006);
				}
			});
		});
	});
}catch(err){ } }