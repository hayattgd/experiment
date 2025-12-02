const resultOutput = document.getElementById("result");
const swap = document.getElementById("swap");

let vec1 = CreateDraggablePoint();
let vec2 = CreateDraggablePoint();

vec1.x = -30;
vec1.y = 120;

vec2.x = 90;
vec2.y = -120;

swap.onclick = ev => {
	const temp = vec1;
	vec1 = vec2;
	vec2 = temp;
}

function Update() {
	UpdateDraggablePoint(vec2);
	UpdateDraggablePoint(vec1);
	const vec1n = Normalize(vec1.x, vec1.y);
	const result = CalcDot(vec1n.x, vec1n.y, vec2.x, vec2.y);
	resultOutput.textContent = (result * ratio).toFixed(1);
	const angle = Math.atan2(-vec1.y, -vec1.x);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	DrawXYAxis();

	DrawDraggablePoint(vec1, "#1067e9ff");
	Arrow(0, 0, vec1.x, vec1.y, "#4c90f7ff");
	Plane(angle, 0, 0, "#4c90f7ff", FullLength());

	DrawDraggablePoint(vec2, "#ff9100ff");

	Line(
		vec2.x - result * Math.cos(angle + Math.PI),
		vec2.y - result * Math.sin(angle + Math.PI),
		vec2.x,
		vec2.y,
		"#f17c0eff",
		undefined,
		`Distance = ${(result * ratio).toFixed(1)}`
	);
}