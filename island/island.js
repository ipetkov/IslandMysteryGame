"use strict"

var Island = (function() {
    var vbo = null;
    var nbo = null;
    var tbo = null;
	var tanbo = null;
    
    var mtnvbo = null;
    var mtnnbo = null;
    var mtntbo = null;
    var mtntanbo = null;

    var mtn2vbo = null;
    var mtn2nbo = null;
    var mtn2tbo = null;
    var mtn2tanbo = null;

    var sandvbo = null;
    var sandnbo = null;
    var sandtbo = null;
    var sandtanbo = null;


    var groundTexture;
    var groundMaterial = new Material(
        vec4(0.8, 0.9, 0.5, 1.0),
        vec4(0.8, 0.7, 0.7, 1.0)
    );
    
    var mtnTexture;
    var mtn2Texture;
    var sandTexture;
    
    var vertices = [];
    var normals = [];
    var texCoordinates = [];
	var tangents = [];
    
    var mtnVertices = [];
    var mtnNormals = [];
    var mtnTexCoordinates = [];
    var mtnTangents = [];
    
    var mtn2Vertices = [];
    var mtn2Normals = [];
    var mtn2TexCoordinates = [];
    var mtn2Tangents = [];
    
    var sandVertices = [];
    var sandNormals = [];
    var sandTexCoordinates = [];
    var sandTangents = [];

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
        
            if(ul[1]>=7 && ul[1]<15) {
            
                mtnVertices.push(ll);
                mtnVertices.push(ul);
                mtnVertices.push(ur);
                mtnVertices.push(ur);
                mtnVertices.push(lr);
                mtnVertices.push(ll);
              
                var n1=plane(ul,ur,ll);
                var n2=plane(lr,ll,ur);
            
                mtnNormals.push(n1);
                mtnNormals.push(n1);
                mtnNormals.push(n1);
                mtnNormals.push(n2);
                mtnNormals.push(n2);
                mtnNormals.push(n2);
            
                mtnTexCoordinates.push(0.0, 1.0);
                mtnTexCoordinates.push(1.0, 1.0);
                mtnTexCoordinates.push(1.0, 0.0);
                mtnTexCoordinates.push(1.0, 0.0);
                mtnTexCoordinates.push(0.0, 0.0);
                mtnTexCoordinates.push(0.0, 1.0);
              
                mtnTangents.push(0.0, 0.0, 0.0);
                mtnTangents.push(0.0, 0.0, 0.0);
                mtnTangents.push(0.0, 0.0, 0.0);
                mtnTangents.push(0.0, 0.0, 0.0);
                mtnTangents.push(0.0, 0.0, 0.0);
                mtnTangents.push(0.0, 0.0, 0.0);
            }
            
            else if(ul[1]>=15) {
                mtn2Vertices.push(ll);
                mtn2Vertices.push(ul);
                mtn2Vertices.push(ur);
                mtn2Vertices.push(ur);
                mtn2Vertices.push(lr);
                mtn2Vertices.push(ll);
              
                var n1=plane(ul,ur,ll);
                var n2=plane(lr,ll,ur);
            
                mtn2Normals.push(n1);
                mtn2Normals.push(n1);
                mtn2Normals.push(n1);
                mtn2Normals.push(n2);
                mtn2Normals.push(n2);
                mtn2Normals.push(n2);
            
                mtn2TexCoordinates.push(0.0, 1.0);
                mtn2TexCoordinates.push(1.0, 1.0);
                mtn2TexCoordinates.push(1.0, 0.0);
                mtn2TexCoordinates.push(1.0, 0.0);
                mtn2TexCoordinates.push(0.0, 0.0);
                mtn2TexCoordinates.push(0.0, 1.0);
              
                mtn2Tangents.push(0.0, 0.0, 0.0);
                mtn2Tangents.push(0.0, 0.0, 0.0);
                mtn2Tangents.push(0.0, 0.0, 0.0);
                mtn2Tangents.push(0.0, 0.0, 0.0);
                mtn2Tangents.push(0.0, 0.0, 0.0);
                mtn2Tangents.push(0.0, 0.0, 0.0);
            }
            
            else if(ul[1]<=0.2) {
                sandVertices.push(ll);
                sandVertices.push(ul);
                sandVertices.push(ur);
                sandVertices.push(ur);
                sandVertices.push(lr);
                sandVertices.push(ll);
              
                var n1=plane(ul,ur,ll);
                var n2=plane(lr,ll,ur);
            
                sandNormals.push(n1);
                sandNormals.push(n1);
                sandNormals.push(n1);
                sandNormals.push(n2);
                sandNormals.push(n2);
                sandNormals.push(n2);
            
                sandTexCoordinates.push(0.0, 1.0);
                sandTexCoordinates.push(1.0, 1.0);
                sandTexCoordinates.push(1.0, 0.0);
                sandTexCoordinates.push(1.0, 0.0);
                sandTexCoordinates.push(0.0, 0.0);
                sandTexCoordinates.push(0.0, 1.0);
              
                sandTangents.push(0.0, 0.0, 0.0);
                sandTangents.push(0.0, 0.0, 0.0);
                sandTangents.push(0.0, 0.0, 0.0);
                sandTangents.push(0.0, 0.0, 0.0);
                sandTangents.push(0.0, 0.0, 0.0);
                sandTangents.push(0.0, 0.0, 0.0);
            }
            
            else {
            
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
              
                tangents.push(0.0, 0.0, 0.0);
                tangents.push(0.0, 0.0, 0.0);
                tangents.push(0.0, 0.0, 0.0);
                tangents.push(0.0, 0.0, 0.0);
                tangents.push(0.0, 0.0, 0.0);
                tangents.push(0.0, 0.0, 0.0);
            }
            
        }
    }
    
    // Method for sending vertex data to GPU a single time
	var initVertexData = function() {
		if(!gl) {
			throw "Unable to init Island data, gl not defined";
		}

        groundTexture = new Texture.fromImageSrc('images/grass2.jpg');
        mtnTexture = new Texture.fromImageSrc('images/rock.jpg');
        mtn2Texture = new Texture.fromImageSrc('images/rock2.jpg');
        sandTexture = new Texture.fromImageSrc('images/sand.jpg');

		vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

		nbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, nbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

		tbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, tbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordinates), gl.STATIC_DRAW);

		tanbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, tanbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(tangents), gl.STATIC_DRAW);

        
        mtnvbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, mtnvbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(mtnVertices), gl.STATIC_DRAW);

		mtnnbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, mtnnbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(mtnNormals), gl.STATIC_DRAW);

		mtntbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, mtntbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(mtnTexCoordinates), gl.STATIC_DRAW);
        
        mtntanbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, mtntanbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(mtnTangents), gl.STATIC_DRAW);
        
        
        mtn2vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, mtn2vbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(mtn2Vertices), gl.STATIC_DRAW);

		mtn2nbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, mtn2nbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(mtn2Normals), gl.STATIC_DRAW);

		mtn2tbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, mtn2tbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(mtn2TexCoordinates), gl.STATIC_DRAW);
        
        mtn2tanbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, mtn2tanbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(mtn2Tangents), gl.STATIC_DRAW);
        
        
        sandvbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, sandvbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(sandVertices), gl.STATIC_DRAW);

		sandnbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, sandnbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(sandNormals), gl.STATIC_DRAW);

		sandtbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, sandtbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(sandTexCoordinates), gl.STATIC_DRAW);
        
        sandtanbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, sandtanbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(sandTangents), gl.STATIC_DRAW);

	};
    
    //first four args are corners of square
    var islandConstructor = function() {
    
        if(!vbo || !nbo || !tbo || !mtnvbo || !mtnnbo || !mtntbo || !mtn2vbo || !mtn2nbo || !mtn2tbo) {
			initVertexData();
		}
        
        this.grass=new Shape(vbo, nbo, tanbo, tbo, null, vertices.length, groundMaterial, groundTexture, null);
        this.mtn=new Shape(mtnvbo, mtnnbo, mtntanbo, mtntbo, null, mtnVertices.length, null, mtnTexture, null);
        this.mtn2=new Shape(mtn2vbo, mtn2nbo, mtn2tanbo, mtn2tbo, null, mtn2Vertices.length, null, mtn2Texture, null);
        this.sand=new Shape(sandvbo, sandnbo, sandtanbo, sandtbo, null, sandVertices.length, null, sandTexture, null);
        
    };
    
    return islandConstructor;

})();

inheritPrototype(Island, Shape);

Island.prototype.draw = function(dt, mat) {
    this.grass.draw(dt, mat);
    this.mtn.draw(dt, mat);
    this.mtn2.draw(dt, mat);
    this.sand.draw(dt, mat);
}

