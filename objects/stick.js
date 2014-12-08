var Stick = (function() {

	var trunkMaterial = new Material(
		vec4(0.55, 0.27, 0.07, 1.0),
		vec4(0.8, 0.4, 0.2, 1.0)
	);

	var woodTex = null;

	function constructor(position, yaw, pitch, roll)
	{
		if(!woodTex) {
			woodTex = new Texture.fromImageSrc('./images/wood.jpg', gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST);
		}

		this.position = position;
		this.yaw = yaw;
		this.roll = roll;
		this.pitch = pitch;
	
		this.mainbody = new Cube(trunkMaterial, woodTex, false, false);
		this.mainbody.position = position;
		this.mainbody.scale = vec3(0.5, 0.05, 0.05);
		this.mainbody.yaw = yaw;
		this.mainbody.roll = roll;

		this.sidebranch = new Cube(trunkMaterial, woodTex, false, false);
		this.sidebranch.position = add(position, vec3(0.15, 0, -0.05));
		this.sidebranch.scale = vec3(0.15, 0.05, 0.05);
		this.sidebranch.yaw = 40.0;
		this.tree = null;
	}

	return constructor;
})();

Stick.prototype.draw = function(dt, mat) {
	this.mainbody.position = this.position;
	this.mainbody.yaw = this.yaw;
	this.mainbody.roll = this.roll;
	this.mainbody.pitch = this.pitch;

//	this.mainbody.pitch = this.mainbody.pitch + dt/10;
	var height = this.mainbody.position[1];
	var x_dis = this.mainbody.position[0];
	var z_dis = this.mainbody.position[2];
	this.mainbody.draw(dt, mat);

    var rotMat = translate(x_dis, height, z_dis); 
	rotMat = mult(rotMat, rotate(this.mainbody.roll, vec3(0, 0, 1)));
	rotMat = mult(rotMat,rotate(this.mainbody.yaw, vec3(0,1,0)));
	rotMat = mult(rotMat, translate(-x_dis, -height, -z_dis)); 
//	rotMat = mult(rotMat, translate(x_dis, 0.0, 0.0)); 
//	rotMat = mult(rotMat,rotate(this.mainbody.yaw, vec3(0,1,0)));
//	rotMat = mult(rotMat, translate(-x_dis, 0.0, 0.0)); 

	this.sidebranch.draw(dt, rotMat);
}

Stick.prototype.checkCollision = function(pos, radius) {
	var stickRadius = this.mainbody.scale[0] * 1.5;

	var dist = subtract(pos, this.mainbody.position);
	var distSq = 0;
	dist.forEach(function(d) {
		distSq += d*d;
	});

	var radiusSq = radius + stickRadius;
	radiusSq *= radiusSq;

	return distSq <= radiusSq;
}
