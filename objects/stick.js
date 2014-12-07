var Stick = (function() {

	var trunkMaterial = new Material(
		vec4(0.6, 0.5, 0.5, 1.0),
		vec4(0.6, 0.3, 0.1, 1.0)
	);

	var barkTex    = null;

	function constructor(position, yaw, roll)
	{
		var posX = position[0];
		var posY = position[1];
		var posZ = position[2];

		this.mainbody = new Cube(trunkMaterial, barkTex, false, false);
		this.mainbody.position = vec3(posX, posY, posZ);
		this.mainbody.scale = vec3(0.5, 0.05, 0.05);
		this.mainbody.yaw = yaw;
		this.mainbody.roll = roll;

		this.sidebranch = new Cube(trunkMaterial, barkTex, false, false);
		this.sidebranch.position = vec3(posX + 0.15, posY, posZ-0.05);
		this.sidebranch.scale = vec3(0.15, 0.05, 0.05);
		this.sidebranch.yaw = 40.0;

		

	}

	return constructor;
})();

Stick.prototype.draw = function(dt, mat) {
	this.mainbody.roll = this.mainbody.roll + dt/10;
	this.mainbody.draw(dt, mat);
	
	var rotMat = mat4(); //rotate(this.mainbody.yaw,   vec3(0, 1, 0));
	rotMat = rotate(this.mainbody.roll, vec3(0, 0, 1));
	this.sidebranch.draw(dt, rotMat);
}
