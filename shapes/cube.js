"use strict";

var Cube = (function() {
	// Vertices used by each cube instance
	var vbo = null;
	var nbo = null;
	var tbo = null;
	var vertices = [
		// Front face
		// X    Y     Z
		-0.5, -0.5,  0.5, // front lower left
		 0.5, -0.5,  0.5, // front lower right
		 0.5,  0.5,  0.5, // front upper right
		 0.5,  0.5,  0.5, // front upper right
		-0.5,  0.5,  0.5, // front upper left
		-0.5, -0.5,  0.5, // front lower left

		// Back face
		// X    Y     Z
		-0.5, -0.5, -0.5, // back lower left
		 0.5, -0.5, -0.5, // back lower right
		 0.5,  0.5, -0.5, // back upper right
		 0.5,  0.5, -0.5, // back upper right
		-0.5,  0.5, -0.5, // back upper left
		-0.5, -0.5, -0.5, // back lower left

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

	var flatNormals = [
		// Front face
		// X    Y     Z
		 0.0,  0.0,  1.0, // front lower left
		 0.0,  0.0,  1.0, // front lower right
		 0.0,  0.0,  1.0, // front upper right
		 0.0,  0.0,  1.0, // front upper right
		 0.0,  0.0,  1.0, // front upper left
		 0.0,  0.0,  1.0, // front lower left

		// Back face
		// X    Y     Z
		 0.0,  0.0, -1.0, // back lower left
		 0.0,  0.0, -1.0, // back lower right
		 0.0,  0.0, -1.0, // back upper right
		 0.0,  0.0, -1.0, // back upper right
		 0.0,  0.0, -1.0, // back upper left
		 0.0,  0.0, -1.0, // back lower left

		// Left face
		// X    Y     Z
		-1.0,  0.0,  0.0, // front upper left
		-1.0,  0.0,  0.0, // back upper left
		-1.0,  0.0,  0.0, // back lower left
		-1.0,  0.0,  0.0, // back lower left
		-1.0,  0.0,  0.0, // front lower left
		-1.0,  0.0,  0.0, // front upper left

		// Right face
		// X    Y     Z
		 1.0,  0.0,  0.0, // front upper right
		 1.0,  0.0,  0.0, // back upper right
		 1.0,  0.0,  0.0, // back lower right
		 1.0,  0.0,  0.0, // back lower right
		 1.0,  0.0,  0.0, // front lower right
		 1.0,  0.0,  0.0, // front upper right

		// Bottom face
		// X    Y     Z
		 0.0, -1.0,  0.0, // back lower left
		 0.0, -1.0,  0.0, // back lower right
		 0.0, -1.0,  0.0, // front lower right
		 0.0, -1.0,  0.0, // front lower right
		 0.0, -1.0,  0.0, // front lower left
		 0.0, -1.0,  0.0, // back lower left

		// Top face
		// X    Y     Z
		 0.0,  1.0,  0.0, // back upper left;
		 0.0,  1.0,  0.0, // back upper right
		 0.0,  1.0,  0.0, // front upper right
		 0.0,  1.0,  0.0, // front upper right
		 0.0,  1.0,  0.0, // front upper left
		 0.0,  1.0,  0.0, // back upper left
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

		// Back face
		// S    T
		 1.0, 0.0, // back lower left
		 0.0, 0.0, // back lower right
		 0.0, 1.0, // back upper right
		 0.0, 1.0, // back upper right
		 1.0, 1.0, // back upper left
		 1.0, 0.0, // back lower left

		// Left face
		// S    T
		 1.0, 1.0, // front upper left
		 0.0, 1.0, // back upper left
		 0.0, 0.0, // back lower left
		 0.0, 0.0, // back lower left
		 1.0, 0.0, // front lower left
		 1.0, 1.0, // front upper left

		// Right face
		// S    T
		 0.0, 1.0, // front upper right
		 1.0, 1.0, // back upper right
		 1.0, 0.0, // back lower right
		 1.0, 0.0, // back lower right
		 0.0, 0.0, // front lower right
		 0.0, 1.0, // front upper right

		// Bottom face
		// S    T
		 0.0, 1.0, // back lower left
		 1.0, 1.0, // back lower right
		 1.0, 0.0, // front lower right
		 1.0, 0.0, // front lower right
		 0.0, 0.0, // front lower left
		 0.0, 1.0, // back lower left

		// Top face
		// S    T
		 0.0, 1.0, // back upper left
		 1.0, 1.0, // back upper right
		 1.0, 0.0, // front upper right
		 1.0, 0.0, // front upper right
		 0.0, 0.0, // front upper left
		 0.0, 1.0, // back upper left
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
	};

	var cubeConstructor = function(material, flatLighting, texture) {
		if(!vbo || !nbo || !tbo) {
			initVertexData();
		}

		material = material || new Material(
			vec4(0.2, 0.2, 0.2, 1.0),
			vec4(0.8, 0.8, 0.8, 1.0)
		);

		// For non-flat lighting, the cube's vertices are conveniently
		// also its normal vectors, if we approximate it as a sphere.
		Shape.call(this, vbo, (flatLighting ? nbo : vbo), tbo, vertices.length / 3, material, texture);
	};

	return cubeConstructor;
})();

inheritPrototype(Cube, Shape);
