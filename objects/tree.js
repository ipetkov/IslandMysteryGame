var Tree = (function() {
	var groundMaterial = new Material(
		vec4(0.8, 0.9, 0.5, 1.0),
		vec4(0.8, 0.7, 0.7, 1.0)
	);

	var trunkMaterial = new Material(
		vec4(0.5, 0.4, 0.1, 1.0),
		vec4(0.6, 0.3, 0.1, 1.0)
	);

	var barkTex    = null;
	var foliageTex = null;
	var barkBumpMap = null;

	function constructor(position, scale, age)
	{
		if(!barkTex) {
			barkTex = new Texture.fromImageSrc('./images/treebark.jpg');
		}

		if(!foliageTex) {
			foliageTex = new Texture.fromImageSrc('./images/foliage.png');
		}

		if(!barkBumpMap) {
			barkBumpMap = new Texture.fromImageSrc('./images/waves.jpg',gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR);
		}

		var foliageMaterial = new Material(
			vec4(0.8, 1.0 - 0.7 * age, 1.0 - 0.7 * age, 1.0),
			vec4(0.3 + 0.7 * age, 0.3, 0.3, 1.0)
		);

		this.position = position;
		this.scale    = scale;

		this.trunk         = new HexagonalPrism(trunkMaterial, null, barkBumpMap);
		this.foliageTop    = new HexagonalPyramid(foliageMaterial, foliageTex, null);
		this.foliageMiddle = new HexagonalPrism(foliageMaterial, foliageTex, null);
		this.foliageBottom = new HexagonalPyramid(foliageMaterial, foliageTex, null);

	}

	return constructor;
})();

Tree.prototype.draw = function(dt, mat) {
	var pos = this.position;

	var kX = this.scale[0];
	var kY = this.scale[1];
	var kZ = this.scale[2];

	this.trunk.position = pos;
	this.trunk.scale = vec3(kX * 0.15, 2.0 * kY, kZ * 0.15);

	this.foliageTop.position = add(pos, vec3(0.0, 2.5 * kY, 0.0));
	this.foliageTop.scale    = vec3(0.7 * kX, 1.5 * kY, 0.7 * kZ);

	this.foliageMiddle.position = add(pos, vec3(0.0, 2.0 * kY, 0.0));
	this.foliageMiddle.scale    = vec3(0.7 * kX, 0.5 * kY, 0.7 * kZ);

	this.foliageBottom.position = add(pos, vec3(0.0, 2.0 * kY, 0.0));
	this.foliageBottom.scale    = vec3(0.7 * kX, -0.3 * kY, 0.7 * kZ);

	this.trunk.draw(dt, mat);
	this.foliageTop.draw(dt, mat);
	this.foliageMiddle.draw(dt, mat);
	this.foliageBottom.draw(dt, mat);
}
