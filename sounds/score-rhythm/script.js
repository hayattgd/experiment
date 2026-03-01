const score = document.getElementById("score");
const bpm = document.getElementById("bpm");

const tupletNumber = document.getElementById("tuplet-number");
const addTuplet = document.getElementById("add-tuplet");

let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let currentPosition = 100;

function Tone(frequency, duration) {
	if (!audioCtx) {
		audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	}
	const oscillator = audioCtx.createOscillator();
	oscillator.type = "sine";
	oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
	oscillator.connect(audioCtx.destination);
	oscillator.start();
	oscillator.stop(audioCtx.currentTime + duration);
	oscillator.onended = ev => {
		oscillator.disconnect();
	}
}

function HighlightNote(idx, duration, isInt) {
	const note = GetNote(idx);
	let classname = "highlight";
	if (isInt) { classname = "highlight-int"; }
	if (note.textContent == ".") {
		const realnote = GetNote(idx - 1);
		note.classList.add(classname);
		realnote.classList.add(classname);
		setTimeout(() => {
			note.classList.remove(classname);
			realnote.classList.remove(classname);
		}, duration * 1000);
	} else {
		note.classList.add(classname);
		setTimeout(() => {
			note.classList.remove(classname);
		}, duration * 1000);
	}
}

function GetLengthOfSingle(note) {
	switch (note) {
		case "𝅝":
			return 4;

		case "𝅗𝅥":
			return 2;

		case "𝅘𝅥":
			return 1;

		case "𝅘𝅥𝅮":
			return 0.5;

		case "𝅘𝅥𝅯":
			return 0.25;

		case "𝅘𝅥𝅰":
			return 0.125;

		case "𝅘𝅥𝅱":
			return 0.0625;

		// whole rest is half length
		case "𝄻":
			return 2;

		case "𝄼":
			return 2;

		case "𝄽":
			return 1;

		case "𝄾":
			return 0.5;

		case "𝄿":
			return 0.25;

		case "𝅀":
			return 0.125;

		case "𝅁":
			return 0.0625;

		default:
			return 0;
	}
}

function IsRest(note) {
	switch (note) {
		case "𝄻":
			return true;

		case "𝄼":
			return true;

		case "𝄽":
			return true;

		case "𝄾":
			return true;

		case "𝄿":
			return true;

		case "𝅀":
			return true;

		case "𝅁":
			return true;

		default:
			return false;
	}
}

function GetVisualLengthOfSingle(note) {
	switch (note) {
		case "𝅝":
			return 200;

		case "𝅗𝅥":
			return 100;

		case "𝅘𝅥":
			return 50;

		case "𝅘𝅥𝅮":
			return 25;

		case "𝅘𝅥𝅯":
			return 18;

		case "𝅘𝅥𝅰":
			return 18;

		case "𝅘𝅥𝅱":
			return 18;

		case "𝄻":
			currentPosition += 100;
			return 100;

		case "𝄼":
			currentPosition += 50;
			return 50;

		case "𝄽":
			currentPosition += 25;
			return 25;

		case "𝄾":
			currentPosition += 15;
			return 10;

		case "𝄿":
			currentPosition += 15;
			return 10;

		case "𝅀":
			currentPosition += 15;
			return 10;

		case "𝅁":
			currentPosition += 15;
			return 10;

		default:
			return 0;
	}
}

function GetNoteLengthVisually(idx) {
	const note = GetNote(idx);
	if (note.textContent == ".") {
		return GetVisualLengthOfSingle(GetNote(idx - 1)) * 1.5;
	} else {
		return GetVisualLengthOfSingle(note.textContent);
	}
}

function GetNoteLength(idx) {
	const note = GetNote(idx);
	if (note.textContent == ".") {
		return GetLengthOfSingle(GetNote(idx - 1).textContent) * 1.5;
	} else {
		return GetLengthOfSingle(note.textContent);
	}
}

function GetNote(idx) {
	return score.children[idx];
}

function AddNote(note) {
	const element = document.createElement("span");
	element.classList.add("musical-note");
	element.textContent = `${note}`;
	element.style.position = "absolute";
	if (note == ".") {
		const lastlength = GetVisualLengthOfSingle(GetNote(score.children.length - 1).textContent);
		element.style.left = `${currentPosition - lastlength + 25}px`;
		element.style.bottom = "25px";
		currentPosition += lastlength * 0.5;
	} else {
		const length = GetVisualLengthOfSingle(note);
		element.style.left = `${currentPosition}px`;
		currentPosition += length;
	}
	score.appendChild(element);
	score.style.paddingRight = `${currentPosition}px`;
}

function AddTuplet(divider) {
	const element = document.createElement("span");
	element.classList.add("musical-note");
	element.classList.add("musical-tuplet-divider");
	element.textContent = `${divider}`;
	element.style.left = `${currentPosition + 5}px`;
	currentPosition += 12.5;
	score.appendChild(element);
}

function floorPow2(n) {
	if (n <= 0) throw new RangeError("n must be > 0");
	const p = Math.floor(Math.log2(n));
	return Math.pow(2, p);
}

function Play() {
	console.log("========================================");
	let Bbfreq = 466.16;
	let Ffreq = 698.46;
	let HiDfreq = 1174.66;
	let time = 0;
	let lastInt = 0;
	let currentTuplet = 0;
	let tuplet = 1;
	for (let i = 0; i < score.children.length; i++) {
		const note = GetNote(i);

		if (note.classList.contains("musical-tuplet-divider")) {
			tuplet = Number(note.textContent);
			currentTuplet = tuplet;
			continue;
		}

		if (i + 1 < score.children.length) {
			if (GetNote(i + 1).textContent == ".") {
				continue;
			}
		}

		const note_length = GetNoteLength(i);
		let formula = "";
		if (note.textContent == ".") {
			formula += `${GetLengthOfSingle(GetNote(i - 1).textContent)} * 1.5`;
		} else {
			formula += `${GetLengthOfSingle(note.textContent)}`;
		}

		let multiplier = 1;

		if (currentTuplet > 0) {
			currentTuplet -= 1;
			if (floorPow2(tuplet) == tuplet) {
				multiplier = 1.5 / tuplet;
				formula += ` * 1.5 / ${tuplet}`;
			} else {
				multiplier = floorPow2(tuplet) / tuplet;
				formula += ` * ${floorPow2(tuplet)} / ${tuplet}`;
			}
		}

		const length = note_length * multiplier;

		const length_with_bpm = length * (60 / bpm.value);
		if (!(formula == length)) {
			formula += ` = ${length}`;
		}
		console.log(`(${time / (60 / bpm.value)}) ${formula}`);
		const isint = Number.isInteger(Math.round(time / (60 / bpm.value) * 10000000) / 10000000);
		if (IsRest(note.textContent)) {
			setTimeout(() => {
				HighlightNote(i, length_with_bpm, isint);
			}, time * 1000);
			time += length_with_bpm;
		} else {
			let freq = Bbfreq;
			if (isint) {
				freq = Ffreq;
			}
			setTimeout(() => {
				Tone(freq, Math.max(length_with_bpm - 0.01, 0));
				HighlightNote(i, length_with_bpm, isint);
			}, time * 1000);
			time += length_with_bpm;
		}
		if (time > lastInt) {
			for (let i = 0; i < (time - lastInt) / (60 / bpm.value); i++) {
				setTimeout(() => {
					Tone(HiDfreq, 0.1);
				}, lastInt * 1000);
				lastInt += 60 / bpm.value;
			}
		}
	}
}

function Reset() {
	score.innerHTML = "";
	currentPosition = 100;
	score.style.paddingRight = "100px";
}

document.getElementById("reset").onclick = ev => {
	Reset();
}

document.getElementById("play").onclick = ev => {
	Play();
}

document.getElementById("note-whole").onclick = ev => {
	AddNote("𝅝");
};

document.getElementById("note-half").onclick = ev => {
	AddNote("𝅗𝅥");
};

document.getElementById("note-quarter").onclick = ev => {
	AddNote("𝅘𝅥");
};

document.getElementById("note-eighth").onclick = ev => {
	AddNote("𝅘𝅥𝅮");
};

document.getElementById("note-sixteenth").onclick = ev => {
	AddNote("𝅘𝅥𝅯");
};

document.getElementById("note-thirty-second").onclick = ev => {
	AddNote("𝅘𝅥𝅰");
};

document.getElementById("note-sixty-fourth").onclick = ev => {
	AddNote("𝅘𝅥𝅱");
};

document.getElementById("rest-whole").onclick = ev => {
	AddNote("𝄻");
};

document.getElementById("rest-half").onclick = ev => {
	AddNote("𝄼");
};

document.getElementById("rest-quarter").onclick = ev => {
	AddNote("𝄽");
};

document.getElementById("rest-eighth").onclick = ev => {
	AddNote("𝄾");
};

document.getElementById("rest-sixteenth").onclick = ev => {
	AddNote("𝄿");
};

document.getElementById("rest-thirty-second").onclick = ev => {
	AddNote("𝅀");
};

document.getElementById("rest-sixty-fourth").onclick = ev => {
	AddNote("𝅁");
};

document.getElementById("dot").onclick = ev => {
	AddNote(".");
};

addTuplet.onclick = ev => {
	AddTuplet(tupletNumber.value);
}

document.addEventListener("keydown", ev => {
	if (ev.target.tagName == "INPUT") {
		return;
	}

	if (ev.key == "1") {
		AddNote("𝅝");
	} else if (ev.key == "2") {
		AddNote("𝅗𝅥");
	} else if (ev.key == "3") {
		AddNote("𝅘𝅥");
	} else if (ev.key == "4") {
		AddNote("𝅘𝅥𝅮");
	} else if (ev.key == "5") {
		AddNote("𝅘𝅥𝅯");
	} else if (ev.key == "6") {
		AddNote("𝄻");
	} else if (ev.key == "7") {
		AddNote("𝄼");
	} else if (ev.key == "8") {
		AddNote("𝄽");
	} else if (ev.key == "9") {
		AddNote("𝄾");
	} else if (ev.key == "0") {
		AddNote("𝄿");
	} else if (ev.key == ".") {
		AddNote(".");
	} else if (ev.key == "Backspace") {
		Reset();
	} else if (ev.key == "Enter" || ev.key == " ") {
		Play();
	}
})

Reset();
