"use strict";

function Material(ambient, diffuse) {
	// Default material is all white, thus the object's texture will dominate
	var whiteColor = vec4(1.0, 1.0, 1.0, 1.0);
	this.ambient = ambient || whiteColor;
	this.diffuse = diffuse || whiteColor;
}

// FIXME: implement clipping
function Shape(verticesBuffer, normalsBuffer, tangentBuffer, texCoordBufffer, elementBuffer, numVertices, material, texture, bumpTexture) {
	this.vbo = verticesBuffer;
	this.nbo = normalsBuffer;
	this.tbo = texCoordBufffer;
	this.ebo = elementBuffer;
	this.tanbo = tangentBuffer;
	this.numVertices = numVertices;

	this.material = material || new Material();
	this.texture  = texture || new Texture();
	this.bumpTexture = bumpTexture || new Texture.defaultBump();
	this.position = vec3(0.0, 0.0, 0.0);
	this.scale    = vec3(1.0, 1.0, 1.0);
	this.yaw      = 0;
	this.pitch    = 0;
	this.roll     = 0;
}

Shape.prototype.getModelMatrix = function() {
	var transMat = translate(this.position);
	var scaleMat = scale(this.scale);

	var rotMat = mat4();
	rotMat = mult(rotate(this.pitch, vec3(1, 0, 0)), rotMat);
	rotMat = mult(rotate(this.yaw,   vec3(0, 1, 0)), rotMat);
	rotMat = mult(rotate(this.roll,  vec3(0, 0, 1)), rotMat);

	return mult(transMat, mult(rotMat, scaleMat));
}

Shape.prototype.draw = function(dt, mat) {
	mat = mult(mat, this.getModelMatrix());
	glHelper.setPositionAttrib(this.vbo);
	glHelper.setNormalAttrib(this.nbo);
	glHelper.setTangentAttrib(this.tanbo);
	glHelper.setTexCoordAttrib(this.tbo);

	// If this object has no elements buffer, the previously
	// used buffer will be unbound, which is what we want.
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	glHelper.setTexSampler(0);

	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, this.bumpTexture);
	glHelper.setBumpTexSampler(1);

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

	if(this.ebo) {
		gl.drawElements(gl.TRIANGLES, this.numVertices, gl.UNSIGNED_SHORT, 0);
	} else {
		gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);
	}
}

function inverse(m) {
   var a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3];
   var a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3];
   var a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3];
   var a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3];

   // Cache the matrix values (makes for huge speed increases!)
   a00 = a12*a23*a31 - a13*a22*a31 + a13*a21*a32 - a11*a23*a32 - a12*a21*a33 + a11*a22*a33;
   a01 = a03*a22*a31 - a02*a23*a31 - a03*a21*a32 + a01*a23*a32 + a02*a21*a33 - a01*a22*a33;
   a02 = a02*a13*a31 - a03*a12*a31 + a03*a11*a32 - a01*a13*a32 - a02*a11*a33 + a01*a12*a33;
   a03 = a03*a12*a21 - a02*a13*a21 - a03*a11*a22 + a01*a13*a22 + a02*a11*a23 - a01*a12*a23;
   a10 = a13*a22*a30 - a12*a23*a30 - a13*a20*a32 + a10*a23*a32 + a12*a20*a33 - a10*a22*a33;
   a11 = a02*a23*a30 - a03*a22*a30 + a03*a20*a32 - a00*a23*a32 - a02*a20*a33 + a00*a22*a33;
   a12 = a03*a12*a30 - a02*a13*a30 - a03*a10*a32 + a00*a13*a32 + a02*a10*a33 - a00*a12*a33;
   a13 = a02*a13*a20 - a03*a12*a20 + a03*a10*a22 - a00*a13*a22 - a02*a10*a23 + a00*a12*a23;
   a20 = a11*a23*a30 - a13*a21*a30 + a13*a20*a31 - a10*a23*a31 - a11*a20*a33 + a10*a21*a33;
   a21 = a03*a21*a30 - a01*a23*a30 - a03*a20*a31 + a00*a23*a31 + a01*a20*a33 - a00*a21*a33;
   a22 = a01*a13*a30 - a03*a11*a30 + a03*a10*a31 - a00*a13*a31 - a01*a10*a33 + a00*a11*a33;
   a23 = a03*a11*a20 - a01*a13*a20 - a03*a10*a21 + a00*a13*a21 + a01*a10*a23 - a00*a11*a23;
   a30 = a12*a21*a30 - a11*a22*a30 - a12*a20*a31 + a10*a22*a31 + a11*a20*a32 - a10*a21*a32;
   a31 = a01*a22*a30 - a02*a21*a30 + a02*a20*a31 - a00*a22*a31 - a01*a20*a32 + a00*a21*a32;
   a32 = a02*a11*a30 - a01*a12*a30 - a02*a10*a31 + a00*a12*a31 + a01*a10*a32 - a00*a11*a32;
   a33 = a01*a12*a20 - a02*a11*a20 + a02*a10*a21 - a00*a12*a21 - a01*a10*a22 + a00*a11*a22;

   return mat4(
      a00, a01, a02, a03,
      a10, a11, a12, a13,
      a20, a21, a22, a23,
      a30, a31, a32, a33
   );
}
