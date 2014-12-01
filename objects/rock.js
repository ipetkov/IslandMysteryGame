"use strict";

var plane = function(a, b, c)
{
	var ab = subtract(b, a);
	var ac = subtract(c, a);
	return cross(ab, ac);
}

var Rock = (function() {
	// Vertices used by each cube instance
	var vbo = null;
	var nbo = null;
	var tbo = null;
	var invertedFlatNormalsBuffer = null;
	var invertedVerticesBuffer = null;

	var topLeftFloor = vec3(-0.5, 0.0, 0.0);
	var bottomLeftFloor = vec3(-0.4, 0.0, -0.3);
	var bottomRightFloor = vec3(0.4, 0.0, -0.4);
	var topRightFloor = vec3(0.2, 0.0, 0.1);
	var bottomLeftCeiling = vec3(-0.1, 0.3, -0.2);
	var topLeftCeiling = vec3(-0.3, 0.2, 0.1);
	var topRightCeiling = vec3(0.1, 0.2, 0.1);

	var vertices = [];
	vertices = vertices.concat(
		topLeftFloor, bottomLeftFloor, bottomRightFloor,
		bottomRightFloor, topRightFloor, topLeftFloor,
		
		bottomLeftCeiling, topLeftCeiling, topRightCeiling,
		
		topLeftFloor, topLeftCeiling, bottomLeftFloor,

		bottomLeftFloor, topLeftCeiling, bottomLeftCeiling,

		bottomLeftFloor, bottomLeftCeiling, bottomRightFloor,

		bottomRightFloor, bottomLeftCeiling, topRightCeiling,

		bottomRightFloor, topRightCeiling, topRightFloor,

		topRightFloor, topRightCeiling, topLeftCeiling,

		topRightFloor, topLeftCeiling, topLeftFloor
		);

	var flatNormals = [];
	for (var i = 0; i < vertices.length; i += 9)
	{
		var norm = plane(	vec3(vertices[i], vertices[i+1], vertices[i+2]),
							vec3(vertices[i+3], vertices[i+4], vertices[i+5]),
							vec3(vertices[i+6], vertices[i+7], vertices[i+8])
		);
		flatNormals = flatNormals.concat(norm, norm, norm);
	}

	var texCoordinates = [];
	for (var i = 0; i < vertices.length; i += 9)
	{
		texCoordinates = texCoordinates.concat(
			vec2(0.0, 0.0),
			vec2(1.0, 0.0),
			vec2(0.5, 1.0)
		);
	}
	

	// Method for sending vertex data to GPU a single time
	var initVertexData = function() {
		if(!gl) {
			throw "Unable to init Rock data, gl not defined";
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

	var constructor = function(material, texture, flatLighting, invertNormals) {
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

		Shape.call(this, vbo, normalBuffer, tbo, null, vertices.length / 3, material, texture);
	};

	return constructor;
})();

inheritPrototype(Rock, Shape);
