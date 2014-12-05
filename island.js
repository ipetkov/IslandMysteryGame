"use strict"

var Island = (function() {
    var vbo = null;
    var nbo = null;
    var tbo = null;
    var invertedFlatNormalsBuffer = null;
    var invertedVerticesBuffer = null;
    
    
    var tempSize = size;
    var quarterSize = Math.trunc(size*.5);
    var eighthSize = Math.trunc(size*.75);
    
    var vertices = [];
    var normals = [];
    var texCoordinates = [];
    
        
    
    
    
    var plane = function(a, b, c) {
        var ab = subtract(b,a);
        var ac = subtract(c,a);
        return cross(ab, ac);
    }
    
    //init vertices and normals
    for(var x=0; x<size; x++) {
        for(var z=0; z<size; z++) {
            var ll = [x, heights[x][z], z];
            var ul = [x, heights[x][z+1], z+1];
            var lr = [x+1, heights[x+1][z], z];
            var ur = [x+1, heights[x+1][z+1], z+1];
        
            vertices.push(ll);
            vertices.push(ul);
            vertices.push(ur);
            vertices.push(ur);
            vertices.push(lr);
            vertices.push(ll);
            
            var n1=plane(ul,ur,ll);
            var n2=plane(lr,ll,ur);
            
            normals.push(n1);
            normals.push(n1);
            normals.push(n1);
            normals.push(n2);
            normals.push(n2);
            normals.push(n2);
            
            texCoordinates.push(0.0, 1.0);
            texCoordinates.push(1.0, 1.0);
            texCoordinates.push(1.0, 0.0);
            texCoordinates.push(1.0, 0.0);
            texCoordinates.push(0.0, 0.0);
            texCoordinates.push(0.0, 1.0);
        }
    }
    
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
		gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

		tbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, tbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordinates), gl.STATIC_DRAW);

		var invertedFlatNormals = normals.map(function(p) {
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
    
    //first four args are corners of square
    var islandConstructor = function(material, texture, flatLighting, invertNormals) {
    
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

		Shape.call(this, vbo, normalBuffer, tbo, null, vertices.length, material, texture);
    };
    
    return islandConstructor;

})();

inheritPrototype(Island, Shape);

