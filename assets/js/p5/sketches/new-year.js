var bgColor = 0;
var strokeColor = 255;
var center = { x:0, y:0 };

var angle = 0.0;
var angularVelocity = 0.1;

var baseRadius = 0.0;
var amplitude  = 0.0;

var ampOscilateAngle = 0.0;
var ampOscilateAngularVelocity = 0.1;

var geishun;

var canvasWidth  = 600;
var canvasHeight = 600;

function setup() {
	geishun = loadImage('/images/sketches/geishun.png');

	var canvas = createCanvas(canvasWidth, canvasHeight);
	canvas.parent('canvasPlaceHolder');

	center.x = canvasWidth * 0.5;
	center.y = canvasHeight * 0.5;

	reset();
}

function reset() {
	background(bgColor);

	angularVelocity = 0.1 * Math.random();
	ampOscilateAngularVelocity = 0.1 * Math.random();

	size = canvasWidth < canvasHeight ? canvasWidth : canvasHeight;
	baseRadius = size * 0.3 * 0.9;
	amplitude  = size * 0.2 * 0.9;
}

function draw() {

	if (!geishun) return;

	angle += angularVelocity;
	ampOscilateAngle += ampOscilateAngularVelocity;

	radius = baseRadius + cos(ampOscilateAngle) * amplitude;

	diff = { x:0.0, y:0.0 };
	diff.x = cos(angle) * radius;
	diff.y = sin(angle) * radius;

	stroke(255, 255, 255, 128);
	line(center.x, center.y, center.x + diff.x, center.y + diff.y);

	radius = baseRadius + sin(ampOscilateAngle) * amplitude;

	diff = { x:0.0, y:0.0 };
	diff.x = cos(angle) * radius;
	diff.y = sin(angle) * radius;

	stroke(255, 0, 0, 128);
	line(center.x, center.y, center.x - diff.x, center.y - diff.y);

	var geishunResizeRate = canvasHeight / geishun.height * 0.5;
	var geishunWidth = geishun.width * geishunResizeRate;
	var geishunHeight = geishun.height * geishunResizeRate;

	image(geishun, center.x - geishunWidth * 0.5 , center.y - geishunHeight * 0.5, geishunWidth, geishunHeight); 
}

function mousePressed() {
	reset();
}