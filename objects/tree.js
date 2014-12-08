var Tree = (function() {
	var trees = [];

	var trunkMaterial = new Material(
		vec4(0.5, 0.4, 0.1, 1.0),
		vec4(0.6, 0.3, 0.1, 1.0)
	);

	var foliageTex = null;
	var barkBumpMap = null;

	function constructor(position, radius, height, age)
	{
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
		this.radius   = radius;
		this.height   = height;

		this.trunk         = new HexagonalPrism(trunkMaterial, null, barkBumpMap);
		this.foliageTop    = new HexagonalPyramid(foliageMaterial, foliageTex, null);
		this.foliageMiddle = new HexagonalPrism(foliageMaterial, foliageTex, null);
		this.foliageBottom = new HexagonalPyramid(foliageMaterial, foliageTex, null);

		trees.push(this);
	}

	constructor.getTrees = function() {
		return trees;
	}

	constructor.drawTrees = function(dt) {
		var identMat = mat4();

		glHelper.enableBumping(true);
		trees.forEach(function(e) {
				e.draw(dt, mat4());
		});
		glHelper.enableBumping(false);
	}

	return constructor;
})();

Tree.prototype.checkCollide = function(pos, otherRadius) {
	var treeRadius = 0.17 * this.radius;
	var treeHeight = 4 * this.height;

	if(pos[1] > treeHeight) {
		return false;
	}

	var dist = subtract(pos, this.trunk.position);

	// Ignore y-component, approximate using cylinder
	var distSq = (dist[0] * dist[0]) + (dist[2] * dist[2]);
	var radiusSq = otherRadius + treeRadius;
	radiusSq *= radiusSq;

	return distSq <= radiusSq;
}

Tree.prototype.draw = function(dt, mat) {
	var pos = this.position;

	var kX = this.radius;
	var kY = this.height;
	var kZ = this.radius;

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
