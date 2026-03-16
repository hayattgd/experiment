const resultOutput = document.getElementById("result");
const swap = document.getElementById("swap");

var vec1 = CreateDraggablePoint();
var vec2 = CreateDraggablePoint();

vec1.x = 100;
vec1.y = 50;

vec2.x = 100;
vec2.y = -50;

function Update() {
	UpdateDraggablePoint(vec1);
	UpdateDraggablePoint(vec2);
	DrawXYZAxis();
	Arrow(0, 0, vec1.x, vec1.y, "#40a5e8");
	Arrow(0, 0, vec2.x, vec2.y, "#e44444");
	var vec1t = XYtoXYZWithYLock(vec1.x, vec1.y);
	var vec2t = XYtoXYZWithYLock(vec2.x, vec2.y);
	var cross = {
		x: (vec1t.y * vec2t.z - vec1t.z * vec2t.y) * ratio ** 2,
		y: (vec1t.z * vec2t.x - vec1t.x * vec2t.z) * ratio ** 2,
		z: (vec1t.x * vec2t.y - vec1t.y * vec2t.x) * ratio ** 2
	}
	var crossxy = XYZtoXY(cross.x, cross.y, cross.z);
	Arrow(0, 0, crossxy.x, crossxy.y, "#75d65d")

	resultOutput.textContent = `${(cross.x * ratio).toFixed(1)} ${(cross.y * ratio).toFixed(1)} ${(cross.z * ratio).toFixed(1)}`
	DrawDraggablePoint3D(vec1);
	DrawDraggablePoint3D(vec2);
}