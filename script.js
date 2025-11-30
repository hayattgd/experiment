window.onload = () => {
	window.addEventListener("pageshow", ev => {
		document.body.style = "opacity: 1;";
	});

	document.querySelectorAll('a[href]:not([href^="#"])').forEach(link => {
		link.addEventListener("click", ev => {
			ev.preventDefault();
			document.body.style = "opacity: 0;"
			setTimeout(() => {
				window.location = link.href;
			}, 100);
		});
	});
}