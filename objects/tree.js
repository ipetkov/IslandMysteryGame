var Tree = (function() {
	var groundMaterial = new Material(
		vec4(0.8, 0.9, 0.5, 1.0),
		vec4(0.8, 0.7, 0.7, 1.0)
	);

	var trunkMaterial = new Material(
		vec4(0.6, 0.5, 0.5, 1.0),
		vec4(0.6, 0.3, 0.1, 1.0)
	);
/*
	var foliageMaterial = new Material(
		vec4(0.8, 0.3, 0.3, 1.0),
		vec4(1.0, 0.3, 0.3, 1.0)
	);
*/

	var barkTex    = null;
	var foliageTex = null;

	function constructor(position, scale, age)
	{
		if(!barkTex) {
			barkTex = new Texture.fromImageSrc('./images/treebark.jpg');
		}

		if(!foliageTex) {
			foliageTex = new Texture.fromImageSrc('./images/foliage.png');
		}

		var posX = position[0];
		var posY = position[1];
		var posZ = position[2];

		var kX = scale[0];
		var kY = scale[1];
		var kZ = scale[2];

		var foliageMaterial = new Material(
			vec4(0.8, 1.0 - 0.7 * age, 1.0 - 0.7 * age, 1.0),
			vec4(0.3 + 0.7 * age, 0.3, 0.3, 1.0)
		);

		this.trunk = new HexagonalPrism(trunkMaterial, barkTex, false, false);
		this.trunk.position = vec3(posX, posY, posZ);
		this.trunk.scale = vec3(0.15, 2.0 * kY, 0.15);

		this.foliageTop          = new HexagonalPyramid(foliageMaterial, foliageTex, true, false);
		this.foliageTop.position = vec3(posX, posY + 2.5 * kY, posZ);
		this.foliageTop.scale    = vec3(0.7 * kX, 1.5 * kY, 0.7 * kZ);
		
		this.foliageMiddle          = new HexagonalPrism(foliageMaterial, foliageTex, false, false);
		this.foliageMiddle.position = vec3(posX, posY + 2.0 * kY, posZ);
		this.foliageMiddle.scale    = vec3(0.7 * kX, 0.5 * kY, 0.7 * kZ);

		this.foliageBottom          = new HexagonalPyramid(foliageMaterial, foliageTex, false, false);
		this.foliageBottom.position = vec3(posX, posY + 2.0 * kY, posZ);
		this.foliageBottom.scale    = vec3(0.7 * kX, -0.3 * kY, 0.7 * kZ);
	}

	return constructor;
})();

Tree.prototype.draw = function(dt, mat) {
	this.trunk.draw(dt, mat);
	this.foliageTop.draw(dt, mat);
	this.foliageMiddle.draw(dt, mat);
	this.foliageBottom.draw(dt, mat);
}
