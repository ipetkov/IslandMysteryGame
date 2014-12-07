var Stick = (function() {

	var trunkMaterial = new Material(
		vec4(0.6, 0.5, 0.5, 1.0),
		vec4(0.6, 0.3, 0.1, 1.0)
	);

	var barkTex    = null;

	function constructor(position, theta)
	{
		var posX = position[0];
		var posY = position[1];
		var posZ = position[2];

		this.mainbody = new Cube(trunkMaterial, barkTex, false, false);
		this.mainbody.position = vec3(posX, posY, posZ);

	}

	return constructor;
})();

Stick.prototype.draw = function(dt, mat) {
	this.mainbody.draw(dt, mat);
}
