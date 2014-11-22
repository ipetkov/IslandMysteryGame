"use strict";

function inheritPrototype(subType, superType) {
	var proto = Object.create(superType.prototype);
	proto.constructor = subType;
	subType.prototype = proto;
}

// FIXME: add normals and texture parameters
// FIXME: implement clipping
function Shape(verticesBuffer, numVertices) {
	this.vbo = verticesBuffer;
	this.numVertices = numVertices;

	this.position = vec3(0.0, 0.0, 0.0);
	this.scale    = vec3(1.0, 1.0, 1.0);
	this.color    = vec4(1.0, 1.0, 1.0, 1.0);
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

	return mult(transMat, mult(scaleMat, rotMat));
}

Shape.prototype.draw = function(dt) {
	glHelper.setPositionAttrib(this.vbo);
	glHelper.setModelMatrix(this.getModelMatrix());
	glHelper.setColor(this.color);
	gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);
}

