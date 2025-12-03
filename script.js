window.onload = () => {
	const qs = window.location.search.substring(1);
	const queries = qs.split("&");

	if (queries.indexOf("noback") > -1) {
		const back = document.getElementById("back");
		if (back) {
			back.innerHTML = "";
		}
	}

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