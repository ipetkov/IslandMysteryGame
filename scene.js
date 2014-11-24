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

var gl;	     // WebGL object for the canvas
var canvas;  // HTML canvas element that we are drawing in
var program; // The WebGL linked program
var camera;  // Camera used for navigating the scene
var timer = new Timer();

var light = {
	position: vec3(0.0, 1000.0, 0.0),
	material: new Material(
		vec4(0.3, 0.3, 0.3, 1.0),
		vec4(0.7, 0.7, 0.7, 1.0)
	),
}

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
		setUniformVec4(uniformAmbientProduct, mult(light.material.ambient, vec));
	}

	helper.setDiffuseProduct = function(vec) {
		setUniformVec4(uniformDiffuseProduct, mult(light.material.diffuse, vec));
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

	var redMaterial = new Material(
		vec4(0.2, 0.2, 0.2, 1.0),
		vec4(0.8, 0.0, 0.0, 1.0)
	);

	var grayMaterial = new Material(
		vec4(0.5, 0.5, 0.5, 1.0),
		vec4(0.0, 0.0, 0.0, 1.0)
	);

	var cube = new Cube(null, false, new Texture.fromImageSrc('./images/chrome.jpg'));
	cube.position = vec3(1.5, 0.5, -3.5);

	var shape = new Cube(redMaterial, false, null);
	shape.position = vec3(0.0, .75, -3.0);
	shape.scale = vec3(1.0, 0.5, 2.0);

	var ground = new Cube(grayMaterial, true);
	ground.position = vec3(0.0, -0.1, 0.0);
	ground.scale = vec3(100.0, 0.1, 100.0);

	shapes = [shape, ground, cube];

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
	glHelper.setLightPosition(light.position);

	var identMat = mat4();
	var dt = 0;
	shapes.forEach(function(e) {
		dt += timer.getElapsedTime();
		e.draw(dt, identMat);
	});

	window.requestAnimationFrame(draw);
}
