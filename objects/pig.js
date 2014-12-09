"use strict";

var Pig = (function() {
	// Vertices used by each cube instance
	var vbo = null;
	var nbo = null;
	var tbo = null;
	var tanbo = null;
	var numVertices = 0;	//generate trianglar
	function tri(trianglar, points, normals)
	{
	    trip(trianglar, points, normals, 0, 2, 1, vec3(0, 0, 1)); //front face
	    trip(trianglar, points, normals, 0, 3, 5, vec3(1, 1, 0)); //left face
	    trip(trianglar, points, normals, 0, 5, 2, vec3(1, 1, 0)); //left face
	    trip(trianglar, points, normals, 3, 4, 5, vec3(0, 0, 1)); //back face
	    trip(trianglar, points, normals, 0, 1, 4, vec3(1, 1, 0)); //right face
	    trip(trianglar, points, normals, 0, 4, 3, vec3(1, 1, 0)); //right face
	    trip(trianglar, points, normals, 2, 5, 4, vec3(0, 1, 0)); //button face
	    trip(trianglar, points, normals, 2, 4, 1, vec3(0, 1, 0)); //button face
	}

	function trip( trianglar, points, normals, v1, v2, v3, normal )
	{
	    normals.push(normal);
	    normals.push(normal);
	    normals.push(normal);

	    points.push(trianglar[v1 ]);
	    points.push(trianglar[v2 ]);
	    points.push(trianglar[v3 ]);
	}

	//trianglar for ears and legs
	var feet_trianglar = [
		vec3( 0.0, -0.25,  0.0 ), //vertex 0
		vec3( 0.2,  0.0 ,  0.0 ), //vertex 1
		vec3(-0.2,  0.0 ,  0.0 ), //vertex 2
		vec3( 0.0, -0.25, -0.15), //vertex 3 
		vec3( 0.2,  0.0 , -0.15), //vertex 4
		vec3(-0.2,  0.0 , -0.15), //vertex 5
	];

	function initVertexData() {
		var vertices = [];
		var normals  = [];
		
		var feet_translation = [
			vec3( -0.7, -0.3,  0.4 ), //[0] right front leg
			vec3( -0.6, -0.3,  0.4 ), //[1] right front leg
			vec3(  0.7, -0.3,  0.4 ), //[2] left front leg
			vec3(  0.6, -0.3,  0.4 ), //[3] left front leg
			vec3(  0.7, -0.3, -0.4 ), //[4] right rear leg
			vec3(  0.6, -0.3, -0.4 ), //[5] right rear leg
			vec3( -0.7, -0.3, -0.4 ), //[6] left rear leg
			vec3( -0.6, -0.3, -0.4 )  //[7] left rear leg
		];

		var legPoints = [];
		var triangleNormals = [];
		tri(feet_trianglar, legPoints, triangleNormals);

		for(var i = 0; i < feet_translation.length; i++){
			for(var j = 0; j < legPoints.length; j++){
				vertices.push(add(legPoints[j], feet_translation[i]));
			}

			for(var j = 0; j < triangleNormals.length; j++){
				normals.push(add(legPoints[j], triangleNormals[i]));
			}
		}

		var ear_trianglar = [
			vec3( 0.0, 0.25,  0.0 ), //vertex 0
			vec3( 0.2, 0.0 ,  0.0 ), //vertex 1
			vec3(-0.2, 0.0 ,  0.0 ), //vertex 2
			vec3( 0.0, 0.25, -0.15), //vertex 3 
			vec3( 0.2, 0.0 , -0.15), //vertex 4
			vec3(-0.2, 0.0 , -0.15), //vertex 5
		];

		var earPoints = [];
		var earNormals = [];
		tri(ear_trianglar, earPoints, earNormals);
		
		var ear_translation = [
			vec3(-0.7, 0.45	, 0.5),
			vec3( 0.7, 0.45	, 0.5)
		];

		for(var i = 0; i < ear_translation.length; i++){
			for(var j = 0; j < earPoints.length; j++){
				vertices.push(add(earPoints[j], ear_translation[i]));
			}

			for(var j = 0; j < earNormals.length; j++){
				normals.push(add(earPoints[j], triangleNormals[i]));
			}
		}

		vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

		nbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, nbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);
		
		var texCoords = vertices.map(function() {return vec2();});

		tbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, tbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

		var tanVerts = vertices.map(function() {return vec3();});
		tanbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, tanbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(tanVerts), gl.STATIC_DRAW);



		numVertices = vertices.length;

	}

	var constructor = function() {
		if(!vbo || !nbo || !tbo) {
			initVertexData();
		}

		this.material = new Material(
			vec4(0.8215, 0.6019, 0.8490),
			vec4(0.7755, 0.5433, 0.8202)
		);
		this.texture = new Texture();
		this.position = vec3(0, 0, 0);
		this.yaw   = 0;
		this.pitch = 0;
		this.roll  = 0;
		this.angle = 0;

		this.body = new MultiTexCube(this.material, false, false, new Texture.fromImageSrc('./images/pigface.png'), null, null, null, null, null);
		// this.nose = new MultiTexCube(this.material, false, false, new Texture.fromImageSrc('./images/pignose.png'), null, null, null, null, null);
		// this.tri  = new Shape(vbo, nbo, tbo, null, numVertices, null, null);
		this.pig  = new Shape(vbo, nbo, tanbo, tbo, null, numVertices, null, null);
		this.moveCount = 0;
		this.nextDir = 0;
	};
	return constructor;
})();

// Pig.prototype.randomPig = function(){
// 	var randomX;
// 	var randomZ;
// 	var rdmX = Math.random();
// 	var rdmZ = Math.random();
// 	if(rdmX < 0.35)
// 		randomX = -0.01;
// 	else if(rdmX < 0.7)
// 		randomX = 0.0;
// 	else
// 		randomX = 0.01;
// 	if(rdmZ < 0.35)
// 		randomZ = -0.01;
// 	else if(rdmZ < 0.7)
// 		randomZ = 0.0;
// 	else
// 		randomZ = 0.01;
// 	var temPos = vec3(randomX, 0.0, randomZ);
// 	return temPos;
// }

Pig.prototype.randomDirction = function(){
	var rdir = Math.floor(Math.random() * 1000 % 361);
	return rdir;
}

Pig.prototype.draw = function(dt, mat) {
	//facing direction
	var omega = 0.13;

	// 0 <= moveCount < 500
	// pig pick random direction when moveCount = 0
	// pig turns to direction 0 <= moveCount < 100
	// pig moving when 100 < moveCount < 500
	//============= if(livePig === true){
	if(this.moveCount === 0){
		this.nextDir = Math.floor(this.randomDirction());
	}
	
	if(this.yaw != this.nextDir && this.moveCount < 100){
		if(this.nextDir > 180)
			this.yaw = Math.floor((this.yaw - dt * omega) % 360);
		if(this.nextDir < 180)
			this.yaw = Math.floor((this.yaw + dt * omega) % 360);
	}
	this.moveCount++;
	if(this.moveCount === 300 /*|| collision detection*/)
		this.moveCount = 0;

	if(this.moveCount > 99){
		var rad = radians(this.yaw);
		var moveAmt = vec3(dt * 0.00045 * Math.sin(rad), 0, dt * 0.00045 * Math.cos(rad));
		var fakePoint1 =  Math.cos( 90) * moveAmt[0] + Math.sin( 90) * moveAmt[2];
		var fakePoint2 = -Math.sin( 90) * moveAmt[0] + Math.cos( 90) * moveAmt[2];
		var fakePoint3 =  Math.cos(-90) * moveAmt[0] + Math.sin(-90) * moveAmt[2];
		var fakePoint4 = -Math.sin(-90) * moveAmt[0] + Math.cos(-90) * moveAmt[2];
		var fakeMove1 = vec3(fakePoint1, 0, fakePoint2);
		var fakeMove2 = vec3(fakePoint3, 0, fakePoint4);
		var previousPosition = this.position;
		var nextPosition = add(this.position, moveAmt);
		var distancePosition = Math.sqrt(moveAmt[0] * moveAmt[0] + moveAmt[2] * moveAmt[2]);
		var heighPosition = heightOf(nextPosition[0], nextPosition[2]) - heightOf(previousPosition[0], previousPosition[2]);
		var fakeHeigh = heightOf(fakeMove2[0], fakeMove2[2]) - heightOf(fakeMove1[0, fakeMove1[2]]);
		this.pitch = - 180 / Math.PI * (Math.atan(heighPosition / distancePosition));
		this.roll =   45 / Math.PI * (Math.atan(fakeHeigh / distancePosition));
		this.position = nextPosition;
		this.position[1] = heightOf(nextPosition[0], nextPosition[2]) + 0.4;
	}
	//}
	//else //dead pig
		// {
		// 	this.roll = 180;
		// }
	//position of pig
	this.pig.position  = this.position;
	this.body.position = add(this.pig.position, vec3(0, 0.03, 0));
	this.pig.material  = this.body.material = this.material;
	this.pig.texture   = this.body.texture  = this.texture;
	this.pig.yaw       = this.body.yaw      = this.yaw;
	this.pig.pitch     = this.body.pitch    = this.pitch;
	this.pig.roll      = this.body.roll     = this.roll;

	this.pig.scale = vec3(0.11,0.4,0.3);
	this.body.scale = vec3(0.3, 0.3, 0.6);

	this.pig.draw(dt, mat);
	this.body.draw(dt, mat);

}
