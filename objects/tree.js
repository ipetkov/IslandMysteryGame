var TreeShapes = function(position, scale, age)
{
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

	var foliageMaterial = new Material(
		vec4(0.8, 1.0 - 0.7 * age, 1.0 - 0.7 * age, 1.0),
		vec4(0.3 + 0.7 * age, 0.3, 0.3, 1.0)
	);

	var posX = position[0];
	var posY = position[1];
	var posZ = position[2];

	var kX = scale[0];
	var kY = scale[1];
	var kZ = scale[2];

	var treeTrunk = new HexagonalPrism(trunkMaterial, new Texture.fromImageSrc('./images/treebark.jpg'), false, false);
	treeTrunk.position = vec3(posX, posY, posZ);
	treeTrunk.scale = vec3(0.15, 2.0 * kY, 0.15);

	var foliageTop = new HexagonalPyramid(foliageMaterial, new Texture.fromImageSrc('./images/foliage.png'), true, false);
	foliageTop.position = vec3(posX, posY + 2.5 * kY, posZ);
	foliageTop.scale = vec3(0.7 * kX, 1.5 * kY, 0.7 * kZ);
	
	var foliageMiddle = new HexagonalPrism(foliageMaterial, new Texture.fromImageSrc('./images/foliage.png'), false, false);
	foliageMiddle.position = vec3(posX, posY + 2.0 * kY, posZ);
	foliageMiddle.scale = vec3(0.7 * kX, 0.5 * kY, 0.7 * kZ);

	var foliageBottom = new HexagonalPyramid(foliageMaterial, new Texture.fromImageSrc('./images/foliage.png'), false, false);
	foliageBottom.position = vec3(posX, posY + 2.0 * kY, posZ);
	foliageBottom.scale = vec3(0.7 * kX, -0.3 * kY, 0.7 * kZ);

	return [treeTrunk, foliageTop, foliageMiddle, foliageBottom];
}