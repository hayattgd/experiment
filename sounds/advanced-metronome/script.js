const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let isRunning = false;
let nextNoteTime = 0;
let interval = null;
let startTime = 0;

const Play = document.getElementById("play");
const Stop = document.getElementById("stop");
const Bpm = document.getElementById("bpm");

let divider;
let beat;
let ctx;
let circle_size = 5;

const Controls = document.getElementById("controls");

function CreateMetronome() {
	const root = document.createElement("div");
	root.classList.add("panel");

	beat = document.createElement("canvas");
	beat.width = 500;
	beat.height = 100;
	beat.classList.add("panel");

	ctx = beat.getContext("2d");

	const inputs = document.createElement("p");
	inputs.classList.add("multiple-control");

	const divider_name = document.createElement("p");
	divider_name.textContent = "Divide:";

	divider = document.createElement("input");
	divider.classList.add("input-but-output");
	divider.style = "width: 50px; text-align: left;";
	divider.type = "number";
	divider.value = 4;
	divider.max = 100;

	inputs.appendChild(divider_name);
	inputs.appendChild(divider);

	root.appendChild(beat);
	root.appendChild(inputs);

	return root;
}

function PlayClick(time) {
	const osc = audioCtx.createOscillator();

	osc.type = "sine";
	osc.frequency.value = 1024;
	osc.connect(audioCtx.destination);

	osc.start(time);
	osc.stop(time + 0.055);
}

Play.onclick = () => {
	if (isRunning) return;

	startTime = audioCtx.currentTime;
	nextNoteTime = audioCtx.currentTime;
	interval = setInterval(() => {
		while (nextNoteTime < audioCtx.currentTime + 0.1) {
			PlayClick(nextNoteTime);

			const secondsPerBeat = 60.0 / Bpm.value * 4 / divider.value;
			nextNoteTime += secondsPerBeat;
			circle_size = 10;
		}
	}, 25);
	isRunning = true;
}

Stop.onclick = () => {
	if (!isRunning) return;

	clearInterval(interval);
	isRunning = false;
}

Controls.appendChild(CreateMetronome());

function lerp(v0, v1, t) {
	return (1 - t) * v0 + t * v1;
}

function draw() {
	circle_size = lerp(circle_size, 5, 0.1);
	ctx.clearRect(0, 0, 500, 100);
	ctx.strokeStyle = "white";
	ctx.lineWidth = "3px";
	ctx.fillStyle = "white";
	ctx.beginPath();
	ctx.moveTo(0, 50);
	ctx.lineTo(500, 50);
	ctx.closePath();
	ctx.stroke();

	const interval = 500 / divider.value;
	for (let i = 0; i < divider.value; i++) {
		ctx.beginPath();
		ctx.moveTo(i * interval, 0);
		ctx.lineTo(i * interval, 100);
		ctx.closePath();
		ctx.stroke();
	}

	if (isRunning) {
		ctx.beginPath();
		ctx.arc((audioCtx.currentTime - startTime) * 500 / 4 * Bpm.value / 60 % 500 + 5, 50, circle_size, 0, Math.PI * 2);
		ctx.fill();
	}

	requestAnimationFrame(draw);
}

requestAnimationFrame(draw);