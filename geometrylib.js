const canvas = document.getElementsByTagName("canvas")[0];
const container = document.getElementsByClassName("canvas-container")[0];

const ctx = canvas.getContext("2d");

const defaultColor = "white";
const defaultWidth = 3;

const ratio = 0.1;

let _text_current_id = 0;

let pointer = {
	x: 0,
	y: 0,
	lastX: 0,
	lastY: 0,
	relativeX: 0,
	relativeY: 0,
	down: false,
	downnow: false,
	clickProcessed: false,
	moveProcessed: false,
	cursor: "default"
}

function SetCursor(cursor) {
	if (pointer.cursor == "default") {
		pointer.cursor = cursor;
	}
}

function GetCenter() {
	return { x: canvas.width / 2, y: canvas.height / 2 }
}

function FullLength() {
	return Math.max(canvas.width * 4, canvas.height * 4);
}

function DrawXYAxis() {
	Line(-canvas.width, 0, canvas.width, 0, "#eb5c5c70", 2);
	Line(0, -canvas.height, 0, canvas.height, "#86e08370", 2);
}

function CanvasToGeometry(x, y) {
	const center = GetCenter();
	return { x: x - center.x, y: -y + center.y };
}

function GeometryToCanvas(x, y) {
	const center = GetCenter();
	return { x: x + center.x, y: -y + center.y };
}

function Resize() {
	canvas.width = container.clientWidth;
	canvas.height = container.clientHeight;
	Tick();
}

function Line(x1, y1, x2, y2, color = defaultColor, width = defaultWidth, string) {
	const a = GeometryToCanvas(x1, y1);
	const b = GeometryToCanvas(x2, y2);
	ctx.beginPath();
	ctx.moveTo(a.x, a.y);
	ctx.lineTo(b.x, b.y);
	ctx.strokeStyle = color;
	ctx.lineWidth = width;
	ctx.stroke();
	if (string) {
		DrawText(string, (x1 + x2) / 2 + 20, (y1 + y2) / 2 - 10);
	}
}

function Point(x, y, color = defaultColor, radius = 5) {
	const p = GeometryToCanvas(x, y);
	ctx.beginPath();
	ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
}

function Circle(x, y, color = defaultColor, radius = 5, fillColor) {
	const p = GeometryToCanvas(x, y);
	ctx.beginPath();
	ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
	if (fillColor) {
		ctx.fillStyle = fillColor;
		ctx.fill();
	}
	ctx.strokeStyle = color;
	ctx.stroke();
}

function DrawText(string, x, y, size = 27, font = "serif", color = defaultColor) {
	const id = `canvas-text-${_text_current_id}`;
	const pos = GeometryToCanvas(x, y);
	let element = document.getElementById(id);
	if (!element) {
		element = document.createElement("span");
		element.id = id;
		element.style.position = "absolute";
		element.style.font = `${size}px ${font}`;
		element.style.color = color;
		container.appendChild(element);
	}
	if (!(element.textContent === string)) {
		element.innerHTML = string;
	}
	element.style.left = `${pos.x}px`;
	element.style.top = `${pos.y}px`;
	_text_current_id += 1;
}

function ArrowHead(x, y, angle, length, color = defaultColor, width = defaultWidth) {
	Line(
		x,
		y,
		x - length * Math.cos(angle - Math.PI / 5.5),
		y - length * Math.sin(angle - Math.PI / 5.5),
		color,
		width
	);
	Line(
		x,
		y,
		x - length * Math.cos(angle + Math.PI / 5.5),
		y - length * Math.sin(angle + Math.PI / 5.5),
		color,
		width
	);
}

function Arrow(x1, y1, x2, y2, color = defaultColor, width = defaultWidth) {
	const headLength = Math.min(40, Math.hypot(x2 - x1, y2 - y1));
	Line(x1, y1, x2, y2, color, width);

	const angle = GetAngle(x1, y1, x2, y2);
	ArrowHead(x2, y2, angle, headLength, color, width);
}

function Direction(angle, x, y, color = defaultColor, length = 100, width = defaultWidth) {
	if (x == undefined || y == undefined) {
		x = GetCenter().x;
		y = GetCenter().y;
	}
	Arrow(x, y, x + length * Math.cos(angle), y + length * Math.sin(angle), color, width);
}

function Plane(normal, x, y, color = defaultColor, length = 300, width = defaultWidth) {
	if (x == undefined || y == undefined) {
		x = 0;
		y = 0;
	}
	const xoffset = length / 2 * Math.cos(normal + Math.PI / 2);
	const yoffset = length / 2 * Math.sin(normal + Math.PI / 2);
	Line(x - xoffset, y - yoffset, x + xoffset, y + yoffset, color, width);
}

function CreateDraggablePoint() {
	return { x: 0, y: 0, radius: 6, dragging: false };
}

function DrawDraggablePoint(point, color = defaultColor, drawInfo = true) {
	Point(point.x, point.y, color, point.radius);
	if (drawInfo) {
		DrawText(
			`(${(point.x * ratio).toFixed(1)}, ${(point.y * ratio).toFixed(1)})`,
			point.x + 20, point.y - 10
		);
	}
}

function UpdateDraggablePoint(point) {
	if (!pointer.down) {
		point.dragging = false;
	}

	if (point.dragging) {
		SetCursor("grabbing");
		point.x += pointer.relativeX;
		point.y -= pointer.relativeY;
		pointer.moveProcessed = true;
	}

	const p = GeometryToCanvas(point.x, point.y);

	if (GetLength(p.x, p.y, pointer.x, pointer.y) <= point.radius + 1) {
		SetCursor("grab");
		if (!pointer.clickProcessed && pointer.downnow) {
			point.dragging = true;
			pointer.clickProcessed = true;
		}
	}
}

function CreateDraggableCircle() {
	return { x: 0, y: 0, pointRadius: 6, radius: 50, pdragging: false, rdragging: false };
}

function DrawDraggableCircle(circle, color = defaultColor, fillColor, drawInfo = true) {
	Point(circle.x, circle.y, color, circle.pointRadius);
	Point(circle.x + circle.radius, circle.y, color, circle.pointRadius);
	Circle(circle.x, circle.y, color, circle.radius, fillColor);
	if (drawInfo) {
		DrawText(
			`(${(circle.x * ratio).toFixed(1)}, ${(circle.y * ratio).toFixed(1)})<br>r=${(circle.radius * ratio).toFixed(1)}`,
			circle.x + circle.radius + 5, circle.y - 10
		);
	}
}

function UpdateDraggableCircle(circle) {
	if (!pointer.down) {
		circle.pdragging = false;
		circle.rdragging = false;
	}

	if (circle.pdragging) {
		SetCursor("grabbing");
		circle.x += pointer.relativeX;
		circle.y -= pointer.relativeY;
		pointer.moveProcessed = true;
	}

	if (circle.rdragging) {
		SetCursor("grabbing");
		circle.radius = Math.max(circle.radius + pointer.relativeX, 10);
		pointer.moveProcessed = true;
	}

	const p = GeometryToCanvas(circle.x, circle.y);

	if (GetLength(p.x, p.y, pointer.x, pointer.y) <= circle.pointRadius + 1) {
		SetCursor("grab");
		if (!pointer.clickProcessed && pointer.downnow) {
			circle.pdragging = true;
			pointer.clickProcessed = true;
		}
	}

	if (GetLength(p.x + circle.radius, p.y, pointer.x, pointer.y) <= circle.pointRadius + 1) {
		SetCursor("grab");
		if (!pointer.clickProcessed && pointer.downnow) {
			circle.rdragging = true;
			pointer.clickProcessed = true;
		}
	}
}

function Tick() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	pointer.moveProcessed = false;
	Update();
	pointer.downnow = false;
	pointer.relativeX = 0;
	pointer.relativeY = 0;
	pointer.clickProcessed = false;
	canvas.style.cursor = pointer.cursor;
	pointer.cursor = "default";
	_text_current_id = 0;
}

function GetAngle(x1, y1, x2, y2) {
	return Math.atan2(y2 - y1, x2 - x1);
}

function GetLength(x1, y1, x2, y2) {
	return Math.hypot(x1 - x2, y1 - y2);
}

function CalcDot(x1, y1, x2, y2) {
	return x1 * x2 + y1 * y2;
}

function Normalize(x, y) {
	const length = GetLength(0, 0, x, y);
	return { x: x / length, y: y / length };
}

window.onresize = Resize;

container.addEventListener("pointerdown", ev => {
	pointer.down = true;
	pointer.downnow = true;
	Tick();
});

container.addEventListener("pointerup", ev => {
	pointer.down = false;
	Tick();
});

container.addEventListener("pointermove", ev => {
	if (ev.target.tagName === "SPAN") {
		return;
	}
	pointer.x = ev.offsetX;
	pointer.y = ev.offsetY;
	pointer.relativeX = pointer.x - pointer.lastX;
	pointer.relativeY = pointer.y - pointer.lastY;
	pointer.lastX = ev.offsetX;
	pointer.lastY = ev.offsetY;
	Tick();
});

window.onpageshow = Resize;