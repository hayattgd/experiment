const result = document.getElementById("result");
const formula = document.getElementById("formula");

let c1 = CreateDraggableCircle();
let c2 = CreateDraggableCircle();

c1.x = -130;
c1.y = -60;
c2.x = 120;
c2.y = 140;

function Update() {
	UpdateDraggableCircle(c1);
	UpdateDraggableCircle(c2);
	DrawXYAxis();
	let color = "#fff";
	const distance = GetLength(c1.x, c1.y, c2.x, c2.y);
	if (distance <= c1.radius + c2.radius) {
		color = "#df7f40ff";
	}
	const angle = GetAngle(c1.x, c1.y, c2.x, c2.y) + 0.5 * Math.PI;
	const planeX = (c1.x + c2.x) / 2;
	const planeY = (c1.y + c2.y) / 2;
	Plane(angle, planeX, planeY, "#498fdfff", distance);
	DrawText(`Distance = ${(distance * ratio).toFixed(1)}`, planeX + 20, planeY);
	DrawDraggableCircle(c1, color, "#ffffff15");
	DrawDraggableCircle(c2, color, "#ffffff15");

	formula.innerHTML = `${(distance * ratio).toFixed(1)} &le; ${(c1.radius * ratio).toFixed(1)} + ${(c2.radius * ratio).toFixed(1)}`
	result.textContent = distance <= c1.radius + c2.radius;
}