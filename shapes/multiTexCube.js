"use strict";

function MultiTexCube(material, flatLighting, invert, texFront, texBack, texLeft, texRight, texBottom, texTop) {
	Cube.call(this, material, null, flatLighting, invert, null);

	var defaultTexture = new Texture();
	
	this.texFront  = texFront  || defaultTexture;
	this.texBack   = texBack   || defaultTexture;
	this.texLeft   = texLeft   || defaultTexture;
	this.texRight  = texRight  || defaultTexture;
	this.texBottom = texBottom || defaultTexture;
	this.texTop    = texTop    || defaultTexture;
}

inheritPrototype(MultiTexCube, Cube);

MultiTexCube.prototype.draw = function(dt, mat) {
	mat = mult(mat, this.getModelMatrix());
	glHelper.setPositionAttrib(this.vbo);
	glHelper.setNormalAttrib(this.nbo);
	glHelper.setTexCoordAttrib(this.tbo);

	glHelper.setModelMatrix(mat);

	glHelper.setAmbientProduct(this.material.ambient);
	glHelper.setDiffuseProduct(this.material.diffuse);

	// FIXME: Known weirdness: shapes don't quite get the same (smooth) lighting if they are scaled
	// Computing the inverse of the model matrix makes the difference pretty minimal...
	if(this.scale[0] != this.scale[1] || this.scale[1] != this.scale[2]) {
		// We shouldn't need to divide by the original matrix's determinant
		// since all the normal values will be re-normalized in the shaders anyway.
		mat = inverse(mat);
	}

	glHelper.setNormalModelMatrix(mat);

	var textures = [
		this.texFront,
		this.texBack,
		this.texLeft,
		this.texRight,
		this.texBottom,
		this.texTop,
	];

	var vertOffset = 0;
	gl.activeTexture(gl.TEXTURE0);
	textures.forEach(function(t) {
		gl.bindTexture(gl.TEXTURE_2D, t);
		glHelper.setTexSampler(0);
		gl.drawArrays(gl.TRIANGLES, vertOffset, 6);
		vertOffset += 6;
	});
}
