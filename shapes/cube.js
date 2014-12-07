"use strict";

var Cube = (function() {
	// Vertices used by each cube instance
	var vbo = null;
	var nbo = null;
	var tbo = null;
	var tanbo = null;
	var invertedFlatNormalsBuffer = null;
	var invertedVerticesBuffer = null;

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

var tangents = [
		// Front face
		// X    Y     Z
		 1.0,  0.0,  0.0, // front lower left
		 1.0,  0.0,  0.0, // front lower right
		 1.0,  0.0,  0.0, // front upper right
		 1.0,  0.0,  0.0, // front upper right
		 1.0,  0.0,  0.0, // front upper left
		 1.0,  0.0,  0.0, // front lower left

		// Back face
		// X    Y     Z
		 -1.0,  0.0, 0.0, // back lower left
		 -1.0,  0.0, 0.0, // back lower right
		 -1.0,  0.0, 0.0, // back upper right
		 -1.0,  0.0, 0.0, // back upper right
		 -1.0,  0.0, 0.0, // back upper left
		 -1.0,  0.0, 0.0, // back lower left

		// Left face
		// X    Y     Z
		0.0,  0.0,  1.0, // front upper left
		0.0,  0.0,  1.0, // back upper left
		0.0,  0.0,  1.0, // back lower left
		0.0,  0.0,  1.0, // back lower left
		0.0,  0.0,  1.0, // front lower left
		0.0,  0.0,  1.0, // front upper left

		// Right face
		// X    Y     Z
		 0.0,  0.0,  -1.0, // front upper right
		 0.0,  0.0,  -1.0, // back upper right
		 0.0,  0.0,  -1.0, // back lower right
		 0.0,  0.0,  -1.0, // back lower right
		 0.0,  0.0,  -1.0, // front lower right
		 0.0,  0.0,  -1.0, // front upper right

		// Bottom face
		// X    Y     Z
		 1.0, 0.0,  0.0, // back lower left
		 1.0, 0.0,  0.0, // back lower right
		 1.0, 0.0,  0.0, // front lower right
		 1.0, 0.0,  0.0, // front lower right
		 1.0, 0.0,  0.0, // front lower left
		 1.0, 0.0,  0.0, // back lower left

		// Top face
		// X    Y     Z
		 1.0,  0.0,  0.0, // back upper left;
		 1.0,  0.0,  0.0, // back upper right
		 1.0,  0.0,  0.0, // front upper right
		 1.0,  0.0,  0.0, // front upper right
		 1.0,  0.0,  0.0, // front upper left
		 1.0,  0.0,  0.0, // back upper left
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

		var invertedFlatNormals = flatNormals.map(function(p) {
			return -p;
		});

		invertedFlatNormalsBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, invertedFlatNormalsBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(invertedFlatNormals), gl.STATIC_DRAW);

		var invertedVertices = vertices.map(function(p) {
			return -p;
		});

		invertedVerticesBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, invertedVerticesBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(invertedVertices), gl.STATIC_DRAW);
	};

	var cubeConstructor = function(material, texture, flatLighting, invertNormals, bumpTexture) {
		if(!vbo || !nbo || !tbo) {
			initVertexData();
		}

		// For non-flat lighting, the cube's vertices are conveniently
		// also its normal vectors, if we approximate it as a sphere.
		var normalBuffer = vbo;
		if(flatLighting && invertNormals) {
			normalBuffer = invertedFlatNormalsBuffer;
		} else if(flatLighting) {
			normalBuffer = nbo;
		} else if(invertNormals) {
			normalBuffer = invertedVerticesBuffer;
		} else {
			normalBuffer = vbo;
		}

		Shape.call(this, vbo, normalBuffer, tanbo, tbo, null, vertices.length / 3, material, texture, bumpTexture);
	};

	return cubeConstructor;
})();

inheritPrototype(Cube, Shape);
