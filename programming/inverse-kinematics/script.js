const length = document.getElementById("length");
const iterations = document.getElementById("iterations");

let root = CreateDraggablePoint();
let target = CreateDraggablePoint();

root.x = 0;
root.y = 0;

target.x = 200;
target.y = 130;

let t1 = 0;
let t2 = 0;

function DoIK() {
	let joint = { x: root.x + Math.cos(t1) * length.value / ratio, y: root.y + Math.sin(t1) * length.value / ratio };
	t2 = GetAngle(joint.x, joint.y, target.x, target.y);
	t1 += GetAngle(root.x, root.y, target.x, target.y) - GetAngle(root.x, root.y, joint.x + Math.cos(t2) * length.value / ratio, joint.y + Math.sin(t2) * length.value / ratio);
	console.log(GetAngle(root.x, root.y, target.x, target.y));
	console.log(GetAngle(root.x, root.y, joint.x + Math.cos(t2) * length.value / ratio, joint.y + Math.sin(t2) * length.value / ratio));
}

function Update() {
	UpdateDraggablePoint(target);
	UpdateDraggablePoint(root);

	DrawXYAxis();

	for (let i = 0; i < iterations.value; i++) {
		DoIK();
	}

	Line(root.x, root.y, target.x, target.y, "#ffffff55", 2);
	let joint = { x: root.x + Math.cos(t1) * length.value / ratio, y: root.y + Math.sin(t1) * length.value / ratio };
	Line(root.x, root.y, joint.x + Math.cos(t2) * length.value / ratio, joint.y + Math.sin(t2) * length.value / ratio, "#ffffff55", 2);
	Line(root.x, root.y, joint.x, joint.y, "#dddddd", 4);
	Line(joint.x, joint.y, joint.x + Math.cos(t2) * length.value / ratio, joint.y + Math.sin(t2) * length.value / ratio, "#dddddd", 4);
	Circle(joint.x, joint.y, "#777", 5, "#777");

	DrawDraggablePoint(root, "#eee");
	DrawDraggablePoint(target, "#0f83ff");
}