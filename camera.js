"use strict";

/**
 * Camera will rotate about three axes: yaw, pitch, and roll.
 * Although this implementation is more complicated than repeatedly
 * multiplying into an orientation matrix, it allows us to ask the
 * camera questions like "where are you?" and "which direction are you
 * looking at?", which will be useful for moving the plaer over hills,
 * as well as implementing clipping of objects that are not visible.
 *
 * This also makes it that all movements are NOT relative to the camera's
 * current position, e.g. if the camera has rolled to the side, pitching
 * is done relative to the xz-plane, and not the camera's orientation.
 * This makes the camera behave in a way that is expected of first person
 * games that navigate with a mouse.
 *
 * This implementation IS vulnerable to gimbal lock.
 */
function Camera(glCanvas) {
	var fovx = 90;
	var canvas = glCanvas;
	var position = vec3(0.0, 0.0, 0.0);
	var yaw = 0;
	var pitch = 0;
	var roll = 0;
	var lean = 0;

	// Positve right strafes camera right
	// Positve up lifts camera up
	// Positive forward strafes camera forward
	this.moveBy = function(right, up, forward) {
		var rad = radians(yaw);
		var sin = Math.sin(rad);
		var cos = Math.cos(rad);

		var translation = vec3(
			(forward * sin) + (right * cos),
			up,
			(forward * cos) - (right * sin)
		);

		position = add(position, translation);
	};

	this.yaw = function() {
		return -yaw;
	}

	this.pitch = function() {
		return pitch;
	}

	this.position = function()
	{
		return vec3(position[0], position[1], -position[2]);
	}

	// Positive angle corresponds to yawing left
	this.yawBy = function(angle) {
		yaw = (yaw - angle) % 360;
	}

	// Positive angle corresponds to pitching up
	this.pitchBy = function(angle) {
		pitch = Math.max(-90, Math.min(90, (pitch - angle)));
	}

	// Positive angle corresponds to rolling camera left
	// (world rotates to the right)
	this.rollBy = function(angle) {
		roll = (roll - angle) % 360;
	}
    
    this.getRoll = function() {
        return roll;
    }

	this.getProjViewMatrix = function() {
		var hwRatio = canvas.height / canvas.width;
		var fovy = 2 * Math.atan(hwRatio * Math.tan(radians(fovx) / 2));
		var fovyDegree = fovy * 180 / Math.PI;
		var proj = perspective(fovyDegree, canvas.width / canvas.height, .05, 500);
		var leanRad = radians(lean);

		// Set pitch
		var orientation = rotate(pitch, vec3(1, 0, 0));

		// Set lean
		orientation = mult(orientation, translate(-Math.sin(leanRad), -Math.cos(leanRad), 0));

		// Set heading
		orientation = mult(orientation, rotate(roll,  vec3(0, 0, 1)));
		orientation = mult(orientation, rotate(yaw,   vec3(0, 1, 0)));

		// Set position
		orientation = mult(orientation, translate(-position[0], -position[1], position[2]));

		return mult(proj, orientation);
	};

	this.setFovx = function(f) {
		fovx = Math.max(30, Math.min(150, f));
	};

	// A positive angle zooms in
	this.zoomBy = function(angle) {
		this.setFovx(fovx - angle);
	};

	// Lean's camera left/right, e.g. when walking
	this.setLean = function(angle) {
		lean = Math.min(45, Math.max(-45, -angle));
	}

	this.leanBy = function(angle) {
		this.setLean(-lean + angle);
	}
}
