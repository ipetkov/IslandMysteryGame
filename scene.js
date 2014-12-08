"use strict";

var canvasId         = 'gl-canvas';
var vertexSourceId   = 'shader-vertex';
var fragmentSourceId = 'shader-fragment';

// Shader attributes/uniforms
var attrPosition           = 'vPosition';
var attrNormal             = 'vNormal';
var attrTexCoord           = 'texCoord';
var attrTangent            = 'objTangent';
var uniformModelMatrix     = 'modelMatrix';
var uniformProjViewMatrix  = 'projViewMatrix';
var uniformAmbientProduct  = 'ambientProduct';
var uniformDiffuseProduct  = 'diffuseProduct';
var uniformNormalMat       = 'normalMat';
var uniformLightPosition   = 'lightPosition';
var uniformTexSampler      = 'uSampler';
var uniformBumpTexSampler  = 'nSampler';
var uniformEnableLighting  = 'enableLighting';

var shapes = [];
var sun;
var rock;

var gl;	     // WebGL object for the canvas
var canvas;  // HTML canvas element that we are drawing in
var program; // The WebGL linked program
var camera;  // Camera used for navigating the scene
var player;

var timer = new Timer();

// Steps in for moving camera
var rotateDegree = 1;
var moveUnit = 0.075;
var mouseSensitivity = 0.1;
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

	helper.setTangentAttrib = function(vbo) {
		setAttrib(attrTangent, vbo);
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
	
	helper.setBumpTexSampler = function(arg) {
		var loc = gl.getUniformLocation(program, uniformBumpTexSampler);
		gl.uniform1i(loc, arg);
	}

	helper.enableLighting = function(arg) {
		var loc = gl.getUniformLocation(program, uniformEnableLighting);
		gl.uniform1i(loc, (arg ? 1 : 0));
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

	// Initialize the player
	player = new Player(canvas, vec3(80.0, 0.0, -100.0), moveUnit);
    player.camera.yawBy(-45);

	pointerLock(canvas, function(x, y) {
		player.camera.yawBy(-x * mouseSensitivity);
		player.camera.pitchBy(-y * mouseSensitivity);
	}, null);


	var waterMaterial = new Material(
		vec4(0.2, 0.2, 0.5, 0.8),
		vec4(0.2, 0.2, 0.7, 0.8)
	);

    
	var water = new Cube(waterMaterial, null, true, false);
	water.position = vec3(islandSize/2, 0.0, islandSize/2);
	water.scale = vec3(islandSize*2, 0.1, islandSize*2);
    
    var theIsland = new Island();

	sun = new Sun(300, 1/dayDuration);

	rock = new Rock(vec3(40.0, 0.0, 20.0), 0.15);
	rock.physical.accelerate(vec3(0.0, 0.0, 0.0));

	shapes = [water, theIsland, sun, rock];

    
	for (var x=1; x<quarterSize; x+=5)
	{
        for(var z=1; z<quarterSize; z+=5)
        {
            var kXZ = 2.5 * (Math.random() + 1.5);
            var kY = 4.0 * (Math.random() * 0.3 + 1.0);
            var age = Math.random();
            var rand = Math.random();
            if(heights[x][z]>0.21 && rand<=0.09) {
                shapes.push(new Tree(
                    vec3(x, heights[x][z]-0.5, z),
		    kXZ, kY,
                    age));
            }
        }
	}

	var bumpMap = new Texture.fromImageSrc('./images/balls.png',gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR);
	var newcube = new Cube(null, null, true, false, bumpMap);
	newcube.position = vec3(1.0, 1.0, 0.0);
	shapes.push(newcube);

	// Attach our keyboard listener to the canvas
	var playerHandleKeyDown = function(e){ return player.handleKeyDown(e); }
	var playerHandleKeyUp = function(e){ return player.handleKeyUp(e); }
	var playerHandleMouseDown = function(){ return player.handleMouseDown(); }
	var playerHandleMouseUp = function(){ return player.handleMouseUp(); }
	
	window.addEventListener('keydown', playerHandleKeyDown);
	window.addEventListener('keyup', playerHandleKeyUp);
	window.addEventListener('mousedown', playerHandleMouseDown);
	window.addEventListener('mouseup', playerHandleMouseUp);


	// Set off the draw loop
	draw();
}


// Draws the data in the vertex buffer on the canvas repeatedly
function draw() {
	var skyColor = sun.skyColor;
	gl.clearColor(skyColor[0], skyColor[1], skyColor[2], 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);

	glHelper.enableLighting(true);
	player.move(); // This will set our camera in the world
	glHelper.setProjViewMatrix(player.camera.getProjViewMatrix());

	var identMat = mat4();
	var dt = timer.getElapsedTime();

	sun.draw(dt);  // This will set our light position and material
	Tree.drawTrees(dt);

	shapes.forEach(function(e) {
		dt += timer.getElapsedTime();
		e.draw(dt, identMat);
	});

	player.draw(); // This will draw the crosshairs and arms on the screen
	window.requestAnimFrame(draw);
}
