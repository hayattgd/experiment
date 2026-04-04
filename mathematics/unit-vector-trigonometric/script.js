let vec = CreateDraggablePoint();
let angle = CreateAdjustableAngle();

ratio = 0.01;

vec.x = 150;
vec.y = 150;
angle.angle = Math.PI / 4;
angle.radius = 25

function Update() {
	UpdateDraggablePoint(vec);
	UpdateAdjustableAngle(angle);
	if (isNaN(angle.angle)) {
		angle.angle = 0;
	}
	let scalar = GetLength(0, 0, vec.x, vec.y);
	if (angle.dragging) {
		vec.x = Math.cos(angle.angle);
		vec.y = Math.sin(angle.angle);
		vec.x *= scalar;
		vec.y *= scalar;
	}
	DrawXYAxis();
	Circle(0, 0, "#ffffff87", 100);
	let vecn = Normalize(vec.x, vec.y);
	Arrow(0, 0, vecn.x / ratio, vecn.y / ratio);
	Line(0, 0, vec.x, vec.y, "#ffffff7b", 2);
	if (vecn.x > 0) {
		angle.angle = Math.acos(vecn.y);
	} else {
		angle.angle = -Math.acos(vecn.y);
	}
	DrawAdjustableAngle(angle);
	DrawDraggablePoint(vec);
	DrawText(`${(scalar * ratio).toFixed(1)}(${vecn.x.toFixed(1)}, ${vecn.y.toFixed(1)})`, vec.x, vec.y - 50)
}