const sign = document.getElementById("binary-interactive-sign");
const exponent = document.getElementById("binary-interactive-exponent");
const mantissa = document.getElementById("binary-interactive-mantissa");

const decimalSign = document.getElementById("sn-decimal-sign");
const decimalExponent = document.getElementById("sn-decimal-exponent");
const decimalMantissa = document.getElementById("sn-decimal-mantissa");
const decimalResult = document.getElementById("decimal-result");
const simplifiedDecimalSign = document.getElementById("ssn-decimal-sign");
const simplifiedDecimalExponent = document.getElementById("ssn-decimal-exponent");
const simplifieddecimalMantissa = document.getElementById("ssn-decimal-mantissa");

function HtmlBinaryDigit(n, v) {
	const button = document.createElement("button");
	button.id = `binary-digit-${n}`;
	button.className = "no-decoration";
	button.textContent = v;
	button.onclick = function () {
		if (button.textContent == "0") {
			button.textContent = "1";
		} else {
			button.textContent = "0";
		}
		UpdateDecimal();
	}
	return button;
}

function GetBinaryDigit(n) {
	return document.getElementById(`binary-digit-${n}`);
}

sign.appendChild(HtmlBinaryDigit(0, 0));
for (let i = 1; i < 9; i++) {
	exponent.appendChild(HtmlBinaryDigit(i, 0));
}
for (let i = 9; i < 32; i++) {
	mantissa.appendChild(HtmlBinaryDigit(i, 0));
}

function UpdateDecimal() {
	decimalSign.textContent = GetBinaryDigit(0).textContent;
	if (decimalSign.textContent == "0") {
		simplifiedDecimalSign.textContent = "";
		decimalResult.value = "";
	} else {
		simplifiedDecimalSign.textContent = "-";
		decimalResult.value = "-";
	}

	let binaryExponent = "";
	for (let i = 1; i < 9; i++) {
		binaryExponent += GetBinaryDigit(i).textContent;
	}
	const exponent = parseInt(binaryExponent, 2);
	decimalExponent.textContent = exponent;
	simplifiedDecimalExponent.textContent = exponent - 127;

	let mantissa = 1.0;
	for (let i = 9; i < 32; i++) {
		if (GetBinaryDigit(i).textContent == "1") {
			mantissa += 1 / 2 ** (i - 8);
		}
	}
	decimalMantissa.textContent = mantissa;
	simplifieddecimalMantissa.textContent = mantissa;

	decimalResult.value += (mantissa * 2 ** (exponent - 127)).toFixed(20);
}

function UpdateBinary() {
	const decimalValue = parseFloat(decimalResult.value);
	const flaotArray = new Float32Array(1);
	flaotArray[0] = decimalValue;
	const bytes = new Uint8Array(flaotArray.buffer);
	let bits = "";
	for (let i = bytes.length - 1; i >= 0; i--) {
		bits += bytes[i].toString(2).padStart(8, '0');
	}
	for (let i = 0; i < bits.length; i++) {
		const bit = bits.at(i);
		GetBinaryDigit(i).textContent = bit;
	}
	UpdateDecimal();
}

decimalResult.addEventListener("change", ev => {
	UpdateBinary();
});

UpdateDecimal();
