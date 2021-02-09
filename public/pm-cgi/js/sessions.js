var addproto = url => {
		if (!/^(?:f|ht)tps?\:\/\//.test(url))url = 'https://' + url;
		return url;
	},
	log_msg = document.querySelector('.log-msg'),
	url_bar = document.querySelector('.input-url');

document.querySelector('.field').addEventListener('submit', event=>{
	// add protocol on the client first, server does this too
	url_bar.value = addproto(url_bar.value);
	try{ new URL(url_bar.value);
	}catch(err){
		event.preventDefault();
		log_msg.innerHTML = err.message;
	}
});