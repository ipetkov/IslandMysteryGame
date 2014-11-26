var HexagonalPrism = (function() {

	var vbo = null;
	var nbo = null;
	var tbo = null;
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
		0.5,	1.0,	0.87,
		0.5,	1.0,	0.87,
		1.0,	1.0,	0.0,
		1.0,	0.0,	0.0,

		//60-120˚
		0.5,	0.0,	0.87,
		-0.5,	0.0,	0.87,
		-0.5,	1.0,	0.87,
		-0.5,	1.0,	0.87,
		0.5,	1.0,	0.87,
		0.5,	0.0,	0.87,

		//120-180˚
		-0.5,	0.0,	0.87,
		-1.0,	0.0,	0.0,
		-1.0,	1.0,	0.0,
		-1.0,	1.0,	0.0,
		-0.5,	1.0,	0.87,
		-0.5,	0.0,	0.87,

		//180-240˚
		-1.0,	0.0,	0.0,
		-0.5,	0.0,	-0.87,
		-0.5,	1.0,	-0.87,
		-0.5,	1.0,	-0.87,
		-1.0,	1.0,	0.0,
		-1.0,	0.0,	0.0,

		//240-300˚
		-0.5,	0.0,	-0.87,
		0.5,	0.0,	-0.87,
		0.5,	1.0,	-0.87,
		0.5,	1.0,	-0.87,
		-0.5,	1.0,	-0.87,
		-0.5,	0.0,	-0.87,
		
		//300-360˚
		0.5,	0.0,	-0.87,
		1.0,	0.0,	0.0,
		1.0,	1.0,	0.0,
		1.0,	1.0,	0.0,
		0.5,	1.0,	-0.87,
		0.5,	0.0,	-0.87
	];

	var flatNormals = [

		//30˚
		0.87,	0.0,	0.5,
		0.87,	0.0,	0.5,
		0.87,	0.0,	0.5,
		0.87,	0.0,	0.5,
		0.87,	0.0,	0.5,
		0.87,	0.0,	0.5,
		
		//90˚
		0.0,	0.0,	1.0,
		0.0,	0.0,	1.0,
		0.0,	0.0,	1.0,
		0.0,	0.0,	1.0,
		0.0,	0.0,	1.0,
		0.0,	0.0,	1.0,

		//150˚
		-0.87,	0.0,	0.5,
		-0.87,	0.0,	0.5,
		-0.87,	0.0,	0.5,
		-0.87,	0.0,	0.5,
		-0.87,	0.0,	0.5,
		-0.87,	0.0,	0.5,

		//210˚
		-0.87,	0.0,	-0.5,
		-0.87,	0.0,	-0.5,
		-0.87,	0.0,	-0.5,
		-0.87,	0.0,	-0.5,
		-0.87,	0.0,	-0.5,
		-0.87,	0.0,	-0.5,
		
		//270˚
		0.0,	0.0,	-1.0,
		0.0,	0.0,	-1.0,
		0.0,	0.0,	-1.0,
		0.0,	0.0,	-1.0,
		0.0,	0.0,	-1.0,
		0.0,	0.0,	-1.0,

		//330˚
		0.87,	0.0,	-0.5,
		0.87,	0.0,	-0.5,
		0.87,	0.0,	-0.5,
		0.87,	0.0,	-0.5,
		0.87,	0.0,	-0.5,
		0.87,	0.0,	-0.5
	];

	var texCoordinates = [

		//for 0-60˚
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,

		//for 60-120˚
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,

		//for 120-180˚
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,

		//for 180-240˚
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,

		//for 240-300˚
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,

		//for 300-360˚
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0
	];




	var initVertexData = function() {
		if(!gl) {
			throw "Unable to init Tree data, gl not defined";
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

	//remove "texture" parameter when constant texture is found
	var hexagonalPrismConstructor = function(material, flatLighting, texture) {
		if(!vbo || !nbo || !tbo) {
			initVertexData();
		}

		Shape.call(this, vbo, (flatLighting ? nbo : vbo), tbo, vertices.length / 3, material, texture);
	};

	return hexagonalPrismConstructor;

})();

inheritPrototype(HexagonalPrism, Shape);


