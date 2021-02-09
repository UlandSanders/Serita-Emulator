var fancyButtons = JSON.parse(atob('W1siUmVkZGl0Iiwib2xkLnJlZGRpdC5jb20iLCJvcmFuZ2UiXSxbIkdvb2dsZSIsInd3dy5nb29nbGUuY29tIiwiZ3JlZW4iXSxbIllvdVR1YmUiLCJ3d3cueW91dHViZS5jb20iLCJyZWQiXSxbIkRpc2NvcmQiLCJ3d3cuZGlzY29yZC5jb20vbG9naW4iLCJibHVlIl1d')),
	char_insert = str => { var output = ''; str.split(' ').forEach((word, word_index) => (word.split('').forEach((chr, chr_index) => output += (!chr_index || chr_index == word.length) ? '<span style="white-space: nowrap">&#' + chr.charCodeAt() + '</span>' : '<span style="white-space: nowrap">&#8203;<span style="display:none;font-size:0px;">&#8203;...</span>&#' + chr.charCodeAt() + '&#8203;</span>'), output += word_index != str.split(' ').length - 1 ? ' ' : '')); return output },
	url_bar = document.querySelector('.input-url'),
	url_fill = document.querySelector('.tld-autofill'),
	activeElement = prevActiveEle = document.body,
	buttons_container = document.querySelector('.button_container'),
	time_str = ud => ud.getUTCHours().toFixed() + ' hours, ' + ud.getMinutes().toFixed() + ' minutes, ' + ud.getSeconds().toFixed() + ' seconds';

fancyButtons.forEach(([ label, url, color ]) => {
	var button = document.createElement('div');
	buttons_container.appendChild(button); // apend to container
	
	button.setAttribute('class','ns btn-fancy bnt-' + color);
	button.innerHTML = char_insert(label) // set contents of button
	
	button.addEventListener('click', ()=>{ // dont use a hrefs becaus that will show up in the document
		location.href = '/prox?url=' + url;
	});
});

window.addEventListener('load', fetch('stats').then(res => res.json()).then(stats => {
	var uptime_value = stats.uptime, uptime_init = Date.now(), // keep these static
		uptime_element = document.querySelector('#uptime');
	
	// set this before the interval as the interval doesnt start instantly
	
	uptime_element.innerHTML = time_str(new Date(stats.uptime * 1000 + (Date.now() - uptime_init)));
	
	// getting stuff like memory per second, not in use anymore
	// setInterval(() => fetch('stats').then(res => res.json()).then(json => stats = json), 1000);
	
	setInterval(() => uptime_element.innerHTML = time_str(new Date(uptime_value * 1000 + (Date.now() - uptime_init))), 100);
}));

document.addEventListener('click', e=>{ // set the previous and active element as for the url selectors
	prevActiveEle = activeElement
	activeElement = e.target
});