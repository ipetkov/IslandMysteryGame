"use strict"

var HexagonalPyramid = (function() {

	var vbo = null;
	var nbo = null;
	var tbo = null;
	var tanbo = null;
	var vertices = [
		/* 2D base
		(1.0, 0.0)
		(0.5, 0.87)
		(-0.5, 0.87)
		(-1.0, 0.0)
		(-0.5, -0.87)
		(0.5, -0.87)
		*/

		//0-60˚
		1.0,	0.0,	0.0,
		0.5,	0.0,	0.87,
		0.0,	1.0,	0.0,


		//60-120˚
		0.5,	0.0,	0.87,
		-0.5,	0.0,	0.87,
		0.0,	1.0,	0.0,

		//120-180˚
		-0.5,	0.0,	0.87,
		-1.0,	0.0,	0.0,
		0.0,	1.0,	0.0,

		//180-240˚
		-1.0,	0.0,	0.0,
		-0.5,	0.0,	-0.87,
		0.0,	1.0,	0.0,

		//240-300˚
		-0.5,	0.0,	-0.87,
		0.5,	0.0,	-0.87,
		0.0,	1.0,	0.0,
		
		//300-360˚
		0.5,	0.0,	-0.87,
		1.0,	0.0,	0.0,
		0.0,	1.0,	0.0
	];

	var flatNormals = [

		//30˚
		0.87,	1.41,	0.5,
		0.87,	1.41,	0.5,
		0.87,	1.41,	0.5,

		
		//90˚
		0.0,	1.41,	1.0,
		0.0,	1.41,	1.0,
		0.0,	1.41,	1.0,


		//150˚
		-0.87,	1.41,	0.5,
		-0.87,	1.41,	0.5,
		-0.87,	1.41,	0.5,


		//210˚
		-0.87,	1.41,	-0.5,
		-0.87,	1.41,	-0.5,
		-0.87,	1.41,	-0.5,

		
		//270˚
		0.0,	1.41,	-1.0,
		0.0,	1.41,	-1.0,
		0.0,	1.41,	-1.0,


		//330˚
		0.87,	1.41,	-0.5,
		0.87,	1.41,	-0.5,
		0.87,	1.41,	-0.5
	];

	var texCoordinates = [

		//for 0-60˚
		0.0, 0.0,
		1.0, 0.0,
		0.5, 1.0,


		//for 60-120˚
		0.0, 0.0,
		1.0, 0.0,
		0.5, 1.0,


		//for 120-180˚
		0.0, 0.0,
		1.0, 0.0,
		0.5, 1.0,


		//for 180-240˚
		0.0, 0.0,
		1.0, 0.0,
		0.5, 1.0,


		//for 240-300˚
		0.0, 0.0,
		1.0, 0.0,
		0.5, 1.0,


		//for 300-360˚
		0.0, 0.0,
		1.0, 0.0,
		0.5, 1.0
	];

	var tangents = [

		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,

		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,

		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,

		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,

		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,

		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0
	];


	var initVertexData = function() {
		if(!gl) {
			throw "Unable to init HexagonalPyramid data, gl not defined";
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

	//remove "texture" parameter when constant texture is found
	var hexagonalPyramidConstructor = function(material, texture,bumpTexture) {
		if(!vbo || !nbo || !tbo) {
			initVertexData();
		}

		Shape.call(this, vbo, nbo, tanbo, tbo, null, vertices.length / 3, material, texture, bumpTexture);
	};

	return hexagonalPyramidConstructor;
})();

inheritPrototype(HexagonalPyramid, Shape);


