"use strict"

var Island = (function() {
    var vbo = null;
    var nbo = null;
    var tbo = null;

    var groundTexture;
    var groundMaterial = new Material(
        vec4(0.8, 0.9, 0.5, 1.0),
        vec4(0.8, 0.7, 0.7, 1.0)
    );
    
    var vertices = [];
    var normals = [];
    var texCoordinates = [];

    var plane = function(a, b, c) {
        var ab = subtract(b,a);
        var ac = subtract(c,a);
        return cross(ab, ac);
    }
    
    //init vertices and normals
    for(var x=0; x<islandSize; x++) {
        for(var z=0; z<islandSize; z++) {
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
			throw "Unable to init Island data, gl not defined";
		}

        groundTexture = new Texture.fromImageSrc('images/sand.jpg')

		vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

		nbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, nbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

		tbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, tbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordinates), gl.STATIC_DRAW);
	};
    
    //first four args are corners of square
    var islandConstructor = function() {
    
        if(!vbo || !nbo || !tbo) {
			initVertexData();
		}

		Shape.call(this, vbo, nbo, tbo, null, vertices.length, groundMaterial, groundTexture);
    };
    
    return islandConstructor;

})();

inheritPrototype(Island, Shape);

