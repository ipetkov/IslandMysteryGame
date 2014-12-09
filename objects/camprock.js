"use strict";

var CampRock = (function() {
	// Vertices used by each cube instance
	var vbo = null;
	var nbo = null;
	var tbo = null;
	var tanbo = null;
	var invertedFlatNormalsBuffer = null;
	var invertedVerticesBuffer = null;

	var underground = vec3(0.0, -0.1, 0.1);

	var topLeftFloor = vec3(-0.3, 0.0, 0.2);
	var bottomLeftFloor = vec3(-0.3, 0.0, -0.2);
	var bottomCenterFloor = vec3(0.0, 0.1, -0.3);
	var bottomRightFloor = vec3(0.2, 0.0, -0.1);
	var topRightFloor = vec3(0.2, 0.0, 0.2);
	
	var bottomLeftCeiling = vec3(-0.1, 0.2, -0.1);
	var topLeftCeiling = vec3(-0.2, 0.2, 0.2);
	var topRightCeiling = vec3(0.1, 0.2, 0.2);
	

	var vertices = [];
	vertices = vertices.concat(
		topLeftFloor, bottomLeftFloor, bottomRightFloor,
		topRightFloor, topLeftFloor, bottomRightFloor,
		bottomLeftFloor, bottomRightFloor, bottomCenterFloor,
		
		topRightCeiling, bottomLeftCeiling, topLeftCeiling,
		
		bottomLeftFloor, topLeftFloor, topLeftCeiling,

		bottomLeftCeiling, bottomLeftFloor, topLeftCeiling,

		bottomLeftFloor, bottomLeftCeiling, bottomRightFloor,

		bottomLeftCeiling, topRightCeiling, bottomRightFloor,

		topRightCeiling, topRightFloor, bottomRightFloor,

		topRightFloor, topRightCeiling, topLeftCeiling,

		topLeftFloor, topRightFloor, topLeftCeiling,

		topLeftFloor, bottomLeftFloor, underground,

		underground, bottomLeftFloor, bottomCenterFloor,

		bottomRightFloor, underground, bottomCenterFloor, 

		bottomLeftFloor, bottomLeftCeiling, bottomCenterFloor,

		bottomLeftCeiling, bottomRightFloor, bottomCenterFloor,

		bottomRightFloor, topRightFloor, underground,

		topRightFloor, topLeftFloor, underground
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

	var tangents = [];
	for (var i = 0; i < vertices.length; i += 1)
	{
		tangents.push(0.0);
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
			throw "Unable to init CampRock data, gl not defined";
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

	var constructor = function(material, texture, flatLighting, invertNormals) {
		if(!vbo || !nbo || !tbo) {
			initVertexData();
		}

		Shape.call(this, vbo, nbo,tanbo, tbo, null, vertices.length / 3, material, texture);
	};

	return constructor;
})();

inheritPrototype(CampRock, Shape);
