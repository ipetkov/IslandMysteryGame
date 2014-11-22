"use strict";

// FIXME: add texture coordinates to faces
// FIXME: add normals to faces
var Cube = (function() {
	// Vertices used by each cube instance
	var vbo = null;
	var vertices = [
		// Front face
		// X    Y     Z 
		-0.5, -0.5,  0.5, // front lower left
		 0.5, -0.5,  0.5, // front lower right
		 0.5,  0.5,  0.5, // front upper right
		 0.5,  0.5,  0.5, // front upper right
		-0.5,  0.5,  0.5, // front upper left
		-0.5, -0.5,  0.5, // front lower left

		// Left face
		// X    Y     Z 
		-0.5,  0.5,  0.5, // front upper left
		-0.5,  0.5, -0.5, // back upper left
		-0.5, -0.5, -0.5, // back lower left
		-0.5, -0.5, -0.5, // back lower left
		-0.5, -0.5,  0.5, // front lower left
		-0.5,  0.5,  0.5, // front upper left

		// Right face
		// X    Y     Z 
		 0.5,  0.5,  0.5, // front upper right
		 0.5,  0.5, -0.5, // back upper right
		 0.5, -0.5, -0.5, // back lower right
		 0.5, -0.5, -0.5, // back lower right
		 0.5, -0.5,  0.5, // front lower right
		 0.5,  0.5,  0.5, // front upper right

		// Bottom face
		// X    Y     Z 
		-0.5, -0.5, -0.5, // back lower left
		 0.5, -0.5, -0.5, // back lower right
		 0.5, -0.5,  0.5, // front lower right
		 0.5, -0.5,  0.5, // front lower right
		-0.5, -0.5,  0.5, // front lower left
		-0.5, -0.5, -0.5, // back lower left

		// Top face
		// X    Y     Z 
		-0.5,  0.5, -0.5, // back upper left
		 0.5,  0.5, -0.5, // back upper right
		 0.5,  0.5,  0.5, // front upper right
		 0.5,  0.5,  0.5, // front upper right
		-0.5,  0.5,  0.5, // front upper left
		-0.5,  0.5, -0.5, // back upper left
	];

	// Method for sending vertex data to GPU a single time
	var initVertexData = function() {
		if(!gl) {
			throw "Unable to init Cube data, gl not defined";
		}

		vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
	};

	var cubeConstructor = function() {
		if(!vbo) {
			initVertexData();
		}

		Shape.call(this, vbo, vertices.length / 3);
	};

	return cubeConstructor;
})();

inheritPrototype(Cube, Shape);
