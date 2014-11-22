function Camera(glCanvas) {
	var fovx = 90;
	var canvas = glCanvas;
	var orientation = mat4();

	// Positve right strafes camera right
	// Positve up lifts camera up
	// Positive forward strafes camera forward
	this.moveBy = function(right, up, forward) {
		orientation = mult(translate(-right, -up, forward), orientation);
	};

	// Positive angle corresponds to yawing left
	this.yawBy = function(angle) {
		orientation = mult(rotate(-angle, vec3(0, 1, 0)), orientation);
	}

	// Positive angle corresponds to pitching up
	this.pitchBy = function(angle) {
		orientation = mult(rotate(-angle, vec3(1, 0, 0)), orientation);
	}

	// Positive angle corresponds to rolling camera left
	// (world rotates to the right)
	this.rollBy = function(angle) {
		orientation = mult(rotate(-angle, vec3(0, 0, 1)), orientation);
	}

	this.getProjViewMatrix = function() {
		var hwRatio = canvas.height / canvas.width;
		var fovy = 2 * Math.atan(hwRatio * Math.tan(radians(fovx) / 2));
		var fovyDegree = fovy * 180 / Math.PI;
		var proj = perspective(fovyDegree, canvas.width / canvas.height, .001, 500);
		return mult(proj, orientation);
	};

	this.setFovx = function(f) {
		fovx = Math.max(30, Math.min(150, f));
	};

	// A positive angle zooms in
	this.zoomBy = function(angle) {
		this.setFovx(fovx - angle);
	};

	this.lookAt = function(eye, at, up) {
		orientation = lookAt(eye, at, up);
	};
}
