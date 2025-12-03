const code = document.getElementById("code");
const script = document.getElementById("user-script");
const error = document.getElementById("error");
const errorText = document.getElementById("error-text");

document.body.style.transition = "none";
document.body.style.opacity = "1";

script.innerHTML = code.value;
Tick();

code.onchange = ev => {
	window.location.reload();
};