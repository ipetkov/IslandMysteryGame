"use strict";

var Plane = (function() {
	// Vertices used by each cube instance
	var vbo = null;
	var nbo = null;
	var tbo = null;
	var tanbo = null;
	var tanbo = null;

	var vertices = [
		// Front face
		// X    Y     Z
		-0.5, -0.5,  0.0, // front lower left
		 0.5, -0.5,  0.0, // front lower right
		 0.5,  0.5,  0.0, // front upper right
		 0.5,  0.5,  0.0, // front upper right
		-0.5,  0.5,  0.0, // front upper left
		-0.5, -0.5,  0.0, // front lower left
	];

	var flatNormals = [
		// Front face
		// X    Y     Z
		 0.0,  0.0,  1.0, // front lower left
		 0.0,  0.0,  1.0, // front lower right
		 0.0,  0.0,  1.0, // front upper right
		 0.0,  0.0,  1.0, // front upper right
		 0.0,  0.0,  1.0, // front upper left
		 0.0,  0.0,  1.0, // front lower left

	];

	var texCoordinates = [
		// Front face
		// S    T
		 0.0, 0.0, // front lower left
		 1.0, 0.0, // front lower right
		 1.0, 1.0, // front upper right
		 1.0, 1.0, // front upper right
		 0.0, 1.0, // front upper left
		 0.0, 0.0, // front lower left

	];

	var tangents = [
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0
	];	

	// Method for sending vertex data to GPU a single time
	var initVertexData = function() {
		if(!gl) {
			throw "Unable to init Cube data, gl not defined";
		}

		vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

		nbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, nbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(flatNormals), gl.STATIC_DRAW);

		tbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, tbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordinates), gl.STATIC_DRAW);

		tanbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, tanbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(tangents), gl.STATIC_DRAW);
	};

	var planeConstructor = function(material, texture) {
		if(!vbo || !nbo || !tbo) {
			initVertexData();
		}

		Shape.call(this, vbo, nbo, tanbo, tbo, null, vertices.length / 3, material, texture);
	};

	return planeConstructor;
})();

inheritPrototype(Plane, Shape);
