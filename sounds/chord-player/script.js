const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const thinLines = document.getElementById("thin-lines");
const adjustChord = document.getElementById("adjust-chord");

let thinline = false;

thinLines.checked = false;
thinLines.onchange = ev => {
	thinline = thinLines.checked;
}

const start = performance.now() / 1000;

const Controls = document.getElementById("controls");

adjustChord.onclick = ev => {
	if (Controls.children.length < 3) { return; }
	const first = Controls.children[0].lastChild.firstChild.value;
	const second = first * 3 / 2;
	const third = first * 5 / 4;
	Controls.children[1].lastChild.childNodes[1].value = second;
	Controls.children[1].lastChild.childNodes[1].onchange();
	Controls.children[2].lastChild.childNodes[1].value = third;
	Controls.children[2].lastChild.childNodes[1].onchange();
}

function CreateControl() {
	const root = document.createElement("div");
	root.classList.add("panel");
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.classList.add("panel");
	svg.setAttribute("width", "600");
	svg.setAttribute("height", "200");
	svg.setAttribute("viewBox", "0 -210 2000 500");
	root.appendChild(svg);
	const hz = document.createElement("p");
	hz.classList.add("multiple-control");
	const playing = document.createElement("input");
	playing.type = "checkbox"
	const number = document.createElement("input");
	number.classList.add("input-but-output");
	number.style = "width: 65px; text-align: right;";
	number.type = "number";
	number.value = 1024;
	number.max = 2000;
	const label = document.createElement("p");
	label.textContent = "Hz";
	const slider = document.createElement("input");
	slider.type = "range";
	slider.max = 2000;
	slider.value = number.value;
	hz.appendChild(slider);
	hz.appendChild(number);
	hz.appendChild(label);
	hz.appendChild(playing);
	root.appendChild(hz);

	let tone;

	number.onchange = ev => {
		if (parseFloat(number.value) > 4500) { number.value = 4500; }
		slider.value = number.value;
		if (!tone) { return; }
		tone.frequency.setValueAtTime(number.value, audioCtx.currentTime);
	};

	slider.addEventListener("input", ev => {
		number.value = slider.value;
		if (!tone) { return; }
		tone.frequency.setValueAtTime(number.value, audioCtx.currentTime);
	});

	playing.onchange = ev => {
		if (playing.checked) {
			if (tone) { return; }
			tone = Tone(number.value);
		} else {
			if (!tone) { return; }
			tone.stop();
			tone = null;
		}
	}

	return root;
}

Controls.appendChild(CreateControl());
Controls.appendChild(CreateControl());
Controls.appendChild(CreateControl());

function Tone(frequency) {
	const oscillator = audioCtx.createOscillator();
	oscillator.type = "sine";
	oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
	oscillator.connect(audioCtx.destination);

	oscillator.start();
	return oscillator;
}

function DrawWave(svg, amplitude = 20, frequency = 0.01, phase = 0, points = 1200) {
	let pathData = "";

	const cyclesPerPixel = frequency / points;
	const angularFreq = 2 * Math.PI * cyclesPerPixel;

	for (let x = 0; x <= points; x += 2) {
		const y = 50 + amplitude * Math.sin(angularFreq * x + phase);
		if (x == 0) {
			pathData += `M 0 ${y} `;
		}
		pathData += `L ${x} ${y} `;
	}

	const path = svg.querySelector("path") || document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.setAttribute("d", pathData);
	path.setAttribute("stroke", "#00a2ffff");
	if (thinline) {
		path.setAttribute("stroke-width", "1");
	} else {
		path.setAttribute("stroke-width", "24");
	}
	path.setAttribute("fill", "none");
	path.setAttribute("stroke-linecap", "round");
	svg.appendChild(path);
}

setInterval(() => {
	for (let i = 0; i < Controls.children.length; i++) {
		const element = Controls.children[i];
		const svg = element.firstChild;
		const hznum = element.lastChild.firstChild;
		const now = performance.now() / 1000;
		const elapsed = now - start;
		const phase = 2 * Math.PI * hznum.value * elapsed - 0.05 * elapsed;
		DrawWave(svg, 300, hznum.value, phase, 2000);
	}
}, 0);

document.addEventListener("keydown", ev => {
	if (ev.target.tagName == "INPUT") {
		return;
	}

	if (ev.key == "1") {
		Controls.children[0].lastChild.lastChild.checked = !Controls.children[0].lastChild.lastChild.checked;
		Controls.children[0].lastChild.lastChild.onchange();
	}

	if (ev.key == "2") {
		Controls.children[1].lastChild.lastChild.checked = !Controls.children[1].lastChild.lastChild.checked;
		Controls.children[1].lastChild.lastChild.onchange();
	}

	if (ev.key == "3") {
		Controls.children[2].lastChild.lastChild.checked = !Controls.children[2].lastChild.lastChild.checked;
		Controls.children[2].lastChild.lastChild.onchange();
	}
});