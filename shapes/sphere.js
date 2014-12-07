var Sphere = (function() {
	var vbo = null;
	var nbo = null;
	var tbo = null;
	var tanbo = null;
	var ebo = null;
	var invertedNbo = null;

	var numElements = 0;

	var vertices  = [];
	var normals   = [];
	var tangents  = [];
	var texCoords = [];
	var elements  = [];
	var invertedNormals = [];

	function init() {
		var numLat = 30;
		var numLon = 30;

		for(var lat = 0; lat <= numLat; lat++) {
			var theta = lat / numLat * Math.PI;
			var sinTheta = Math.sin(theta);
			var cosTheta = Math.cos(theta);

			var v = 1 - (lat / numLat);

			for(var lon = 0; lon <= numLon; lon++) {
				var phi = lon / numLon * 2 * Math.PI;
				var sinPhi = Math.sin(phi);
				var cosPhi = Math.cos(phi);

				var x = cosPhi * sinTheta;
				var y = cosTheta;
				var z = sinPhi * sinTheta;

				var u = 1 - (lon / numLon);

				normals.push(x, y, z);
				tangents.push(0.0, 0.0, 0.0);
				invertedNormals.push(-x, -y, -z);
				texCoords.push(u, v);
				vertices.push(x, y, z); // Assuming radius is 1
			}
		}

		for(var lat = 0; lat < numLat; lat++) {
			for(var lon = 0; lon < numLon; lon++) {
				var first = (lat * (numLon + 1)) + lon;
				var second = first + numLon + 1;
				elements.push(first, second, first + 1);
				elements.push(second, second + 1, first + 1);
			}
		}

		vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

		nbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, nbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

		tanbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, tanbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(tangents), gl.STATIC_DRAW);
		

		tbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, tbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

		ebo = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements), gl.STATIC_DRAW);

		invertedNbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, invertedNbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(invertedNormals), gl.STATIC_DRAW);

		numElements = elements.length;
	}

	function constructor(material, texture, invertNormals, bumpTexture) {
		if(!vbo || !nbo || !tbo || !ebo || !invertedNbo) {
			init();
		}

		this.radius = 1;
		Shape.call(this, vbo, (invertNormals ? invertedNbo : nbo), tanbo, tbo, ebo, numElements, material, texture, bumpTexture);
	}

	return constructor;

}());

inheritPrototype(Sphere, Shape);

Sphere.prototype.draw = function(dt, mat) {
	this.scale = vec3(this.radius, this.radius, this.radius);
	Shape.prototype.draw.call(this, dt, mat);
}

