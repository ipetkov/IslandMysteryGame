var Stick = (function() {

	var trunkMaterial = new Material(
		vec4(0.55, 0.27, 0.07, 1.0),
		vec4(0.8, 0.4, 0.2, 1.0)
	);

	function constructor(position, yaw, roll)
	{
		var woodTex = new Texture.fromImageSrc('./images/wood.jpg', gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST);
	
		var posX = position[0];
		var posY = position[1];
		var posZ = position[2];

		this.mainbody = new Cube(trunkMaterial, woodTex, false, false);
		this.mainbody.position = vec3(posX, posY, posZ);
		this.mainbody.scale = vec3(0.5, 0.05, 0.05);
		this.mainbody.yaw = yaw;
		this.mainbody.roll = roll;

		this.sidebranch = new Cube(trunkMaterial, woodTex, false, false);
		this.sidebranch.position = vec3(posX + 0.15, posY, posZ-0.05);
		this.sidebranch.scale = vec3(0.15, 0.05, 0.05);
		this.sidebranch.yaw = 40.0;

		

	}

	return constructor;
})();

Stick.prototype.draw = function(dt, mat) {
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
