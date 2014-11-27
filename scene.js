"use strict";

var canvasId         = 'gl-canvas';
var vertexSourceId   = 'shader-vertex';
var fragmentSourceId = 'shader-fragment';

// Shader attributes/uniforms
var attrPosition           = 'vPosition';
var attrNormal             = 'vNormal';
var attrTexCoord           = 'texCoord';
var uniformModelMatrix     = 'modelMatrix';
var uniformProjViewMatrix  = 'projViewMatrix';
var uniformAmbientProduct  = 'ambientProduct';
var uniformDiffuseProduct  = 'diffuseProduct';
var uniformNormalMat       = 'normalMat';
var uniformLightPosition   = 'lightPosition';
var uniformTexSampler      = 'uSampler';

var shapes = [];
var sun;

var gl;	     // WebGL object for the canvas
var canvas;  // HTML canvas element that we are drawing in
var program; // The WebGL linked program
var camera;  // Camera used for navigating the scene
var timer = new Timer();

// Steps in for moving camera
var rotateDegree = 1;
var moveUnit = 0.125;
var mouseSensitivity = 1/10;
var dayDuration = 1000;

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

	helper.setNormalAttrib = function(vbo) {
		setAttrib(attrNormal, vbo);
	}

	helper.setTexCoordAttrib = function(vbo) {
		var loc = gl.getAttribLocation(program, attrTexCoord);
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.enableVertexAttribArray(loc);
		gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
	}

	helper.setNormalModelMatrix = function(mat) {
		setUniformMat(uniformNormalMat, mat);
	}

	helper.setModelMatrix = function(mat) {
		setUniformMat(uniformModelMatrix, mat);
	}

	helper.setProjViewMatrix = function(mat) {
		setUniformMat(uniformProjViewMatrix, mat);
	}

	helper.setTexSampler = function(arg) {
		var loc = gl.getUniformLocation(program, uniformTexSampler);
		gl.uniform1i(loc, arg);
	}

	helper.setAmbientProduct = function(vec) {
		setUniformVec4(uniformAmbientProduct, mult(sun.lightMaterial.ambient, vec));
	}

	helper.setDiffuseProduct = function(vec) {
		setUniformVec4(uniformDiffuseProduct, mult(sun.lightMaterial.diffuse, vec));
	}

	helper.setLightPosition = function(vec) {
		var loc = gl.getUniformLocation(program, uniformLightPosition);
		gl.uniform3fv(loc, flatten(vec));
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
	camera.moveBy(0.0, 2.0, -1.0);

	pointerLock(canvas, function(x, y) {
		camera.yawBy(-x * mouseSensitivity);
		camera.pitchBy(-y * mouseSensitivity);
	});

	var redMaterial = new Material(
		vec4(0.4, 0.3, 0.3, 1.0),
		vec4(0.8, 0.0, 0.0, 1.0)
	);

	var grayMaterial = new Material(
		vec4(0.5, 0.5, 0.5, 1.0),
		vec4(0.2, 0.2, 0.2, 1.0)
	);

	var cube = new Cube(null, new Texture.fromImageSrc('./images/chrome.jpg'), false, false);
	cube.position = vec3(1.5, 0.5, -3.5);

	var shape = new Cube(redMaterial, null, false, false);
	shape.position = vec3(0.0, .75, -3.0);
	shape.scale = vec3(1.0, 0.5, 2.0);

	var ground = new Cube(grayMaterial, null, true, false);
	ground.position = vec3(0.0, -0.1, 0.0);
	ground.scale = vec3(100.0, 0.1, 100.0);

	sun = new Sun(100, 1/dayDuration);

	shapes = [shape, ground, cube];

	// Attach our keyboard listener to the canvas
	window.addEventListener('keydown', handleKey);

	// Set off the draw loop
	draw();
}

// Key handler which will update our camera position
// FIXME: implement moving camera with mouse
function handleKey(e) {
	switch(e.keyCode) {
                case 37: // Left Arrow - turn left
			camera.yawBy(rotateDegree);
			break;

                case 39: // Right Arrow - turn right
			camera.yawBy(-rotateDegree);
			break;

                case 38: // Up Arrow - pitch down
			camera.pitchBy(-rotateDegree);
			break;

                case 40: // Down Arrow - pitch up
			camera.pitchBy(rotateDegree);
			break;

		case 87: // w - move forward
			camera.moveBy(0, 0, moveUnit);
			break;

		case 65: // a - strafe left
			camera.moveBy(-moveUnit, 0, 0);
			break;

		case 83: // s - move backward
			camera.moveBy(0, 0, -moveUnit);
			break;

		case 68: // d - strafe right
			camera.moveBy(moveUnit, 0, 0);
			break;

		case 32: // space - elevate up
			camera.moveBy(0, moveUnit, 0);
			break;

		case 16: // shift - elevate down
			camera.moveBy(0, -moveUnit, 0);
			break;

		case 81: // q - roll left
			// FIXME: implement leaning
			break;

		case 69: // e - roll right
			// FIXME: implement leaning
			break;
        }
}

// Draws the data in the vertex buffer on the canvas repeatedly
function draw() {
	var skyColor = sun.skyColor;
	gl.clearColor(skyColor[0], skyColor[1], skyColor[2], 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);

	glHelper.setProjViewMatrix(camera.getProjViewMatrix());

	var identMat = mat4();
	var dt = timer.getElapsedTime();

	sun.draw(dt);

	shapes.forEach(function(e) {
		dt += timer.getElapsedTime();
		e.draw(dt, identMat);
	});

	window.requestAnimFrame(draw);
}
