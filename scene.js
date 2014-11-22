"use strict";

var canvasId         = 'gl-canvas';
var vertexSourceId   = 'shader-vertex';
var fragmentSourceId = 'shader-fragment';

// Shader attributes/uniforms
var attrPosition           = 'vPosition';
var uniformModelMatrix     = 'modelMatrix';
var uniformProjViewMatrix  = 'projViewMatrix';
var uniformColor           = 'vColor';

var shape;

var gl;	     // WebGL object for the canvas
var canvas;  // HTML canvas element that we are drawing in
var program; // The WebGL linked program
var camera;  // Camera used for navigating the scene
var timer = new Timer();

// Steps in for moving camera
var rotateDegree = 1;
var moveUnit = 0.125;

// Helper to set shader attributes/uniforms
var glHelper = (function() {
	var helper = {};
	function setAttrib(name, vbo) {
		var loc = gl.getAttribLocation(program, name);
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.enableVertexAttribArray(loc);
		gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
	}

	function setUniformMat(name, mat) {
		var loc = gl.getUniformLocation(program, name);
		gl.uniformMatrix4fv(loc, false, flatten(mat));
	}

	function setUniformVec4(name, vec) {
		var loc = gl.getUniformLocation(program, name);
		gl.uniform4fv(loc, flatten(vec));
	}

	helper.setPositionAttrib = function(vbo) {
		setAttrib(attrPosition, vbo);
	}

	helper.setModelMatrix = function(mat) {
		setUniformMat(uniformModelMatrix, mat);
	}

	helper.setProjViewMatrix = function(mat) {
		setUniformMat(uniformProjViewMatrix, mat);
	}

	helper.setColor = function(color) {
		setUniformVec4(uniformColor, color);
	}

	return helper;
})();

// Init function to start GL and draw everything
window.onload = function() {
	canvas = document.getElementById(canvasId);
	gl = WebGLUtils.setupWebGL(canvas);

	if(!gl) {
		var msg = 'Unable to start WebGL!';
		alert(msg);
		throw msg;
	}

	// Compile and load the gl program
	try {
		program = initShaders(gl, vertexSourceId, fragmentSourceId);
		gl.useProgram(program);
		gl.viewport(0, 0, canvas.width, canvas.height);
	} catch(e) {
		alert(e);
		throw e;
	}

	// Initialize the camera
	camera = new Camera(canvas);
	camera.moveBy(0.0, 0.0, -1.0);

	shape = new Cube();
	shape.position = vec3(-1.0, -1.0, -3.0);
	shape.scale = vec3(1.0, 0.25, 2.0);

	// Attach our keyboard listener to the canvas
	window.addEventListener('keydown', handleKey);

	// Set off the draw loop
	draw();
}

// Key handler which will update our camera position
function handleKey(e) {
	switch(e.keyCode) {
                case 37: // Left Arrow - turn left
			camera.yawBy(rotateDegree);
			break;

                case 39: // Right Arrow - turn right
			camera.yawBy(-rotateDegree);
			break;

                case 38: // Up Arrow - raise elevation
			camera.moveBy(0, moveUnit, 0);
			break;

                case 40: // Down Arrow - lower elevation
			camera.moveBy(0, -moveUnit, 0);
			break;

		case 73: // i - move forward
			camera.moveBy(0, 0, moveUnit);
			break;

		case 74: // j - strafe left
			camera.moveBy(-moveUnit, 0, 0);
			break;

		case 75: // k - move backward
			camera.moveBy(0, 0, -moveUnit);
			break;

		case 76: // l - strafe right
		case 77: // m - strafe right (weird key in spec)
			camera.moveBy(moveUnit, 0, 0);
			break;

		case 87: // w - widen horizontal fov, zoom out
			camera.zoomBy(-rotateDegree);
			break;

		case 78: // n - narrow horizontal fov, zoom in
			camera.zoomBy(rotateDegree);
			break;

		case 85: // u - roll left
			camera.rollBy(rotateDegree);
			break;

		case 79: // o - roll right
			camera.rollBy(-rotateDegree);
			break;

		case 59: // ; - pitch up
		case 186: // ; on chrome
			camera.pitchBy(rotateDegree);
			break;

		case 80: // p - pitch down
			camera.pitchBy(-rotateDegree);
			break;
        }
}

// Draws the data in the vertex buffer on the canvas repeatedly
function draw() {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);

	glHelper.setProjViewMatrix(camera.getProjViewMatrix());

	var dt = timer.getElapsedTime();
	shape.draw(dt);

	window.requestAnimationFrame(draw);
}
