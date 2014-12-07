"use strict";

var PaperFoliage = (function() {
	// Vertices used by each cube instance
	var vbo = null;
	var nbo = null;
	var tbo = null;
	var vertices = [
		// z normal
		-1.0,	0.0,	0.0,
		0.0,	-1.0,	0.0,
		1.0,	0.0,	0.0,
		1.0,	0.0,	0.0,
		0.0,	2.0,	0.0,
		-1.0,	0.0,	0.0,

		// x normal
		0.0,	0.0,	-1.0,
		0.0,	-1.0,	0.0,
		0.0,	0.0,	1.0,
		0.0,	0.0,	1.0,
		0.0,	0.0,	2.0,
		0.0,	0.0,	-1.0
	];

	var flatNormals = [
		// z normal
		 0.0,  0.0,  1.0,
		 0.0,  0.0,  1.0,
		 0.0,  0.0,  1.0,
		 0.0,  0.0,  1.0,
		 0.0,  0.0,  1.0,
		 0.0,  0.0,  1.0,

		// x normal
		 0.0,  0.0, -1.0,
		 0.0,  0.0, -1.0,
		 0.0,  0.0, -1.0,
		 0.0,  0.0, -1.0,
		 0.0,  0.0, -1.0,
		 0.0,  0.0, -1.0
	];

	var texCoordinates = [
		// z normal
		0.0, 1.0,
		0.5, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		0.5, 0.0,
		1.0, 1.0,

		// x normal
		0.0, 1.0,
		0.5, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		0.5, 0.0,
		1.0, 1.0
	];

	// Method for sending vertex data to GPU a single time
	var initVertexData = function() {
		if(!gl) {
			throw "Unable to init PaperFoliage data, gl not defined";
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

	var paperFoliageConstructor = function(material, texture, flatLighting, invertNormals, bumpTexture) {
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


		Shape.call(this, vbo, (flatLighting ? nbo : vbo), tbo, null, vertices.length / 3, material, texture, bumpTexture);
	};

	return paperFoliageConstructor;
})();

inheritPrototype(PaperFoliage, Shape);
