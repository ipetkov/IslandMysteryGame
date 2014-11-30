function Player(glCanvas, pos, speed) {
	this.camera = new Camera(glCanvas);
	this.camera.moveBy(pos[0], pos[1], pos[2]);

	this.forwardVelocity = 0.0;
	this.leftVelocity = 0.0;
	this.backVelocity = 0.0;
	this.rightVelocity = 0.0;
	this.movementSpeed = speed;

	this.yVelocity = 0.0;
	this.yAcceleration = -0.015;

	this.leanLeft = false;
	this.leanRight = false;
	this.leanAngle = 0.0;
	
	this.isRunning = false;
	this.isAirborne = false;

	this.position = function()
	{
		return this.camera.position();
	}

	this.move = function()
	{
		var xV = this.rightVelocity - this.leftVelocity;
		var yV = this.yVelocity;
		var zV = this.forwardVelocity - this.backVelocity;

		// Adjust velocities and lean based on player's state
		if (this.isAirborne)
		{
			if (this.isRunning && zV > 0)
				zV *= 2.5;
			// Adjust camera back to normal
			if (this.leanAngle < 5.0 && this.leanAngle > -5.0)
				this.leanAngle = 0.0;
			else if (this.leanAngle != 0.0)
				this.leanAngle += (this.leanAngle < 0.0) ? 5.0 : -5.0;
		}
		else
		{
			if (this.isRunning && zV > 0)
			{
				zV *= 2.5;
				this.leanAngle = nextLeanAngle(this.leanAngle);
			}
			else
			{
				if (this.leanLeft == this.leanRight)
				{
					// Adjust camera back to normal
					if (this.leanAngle < 5.0 && this.leanAngle > -5.0)
						this.leanAngle = 0.0;
					else if (this.leanAngle != 0.0)
						this.leanAngle += (this.leanAngle < 0.0) ? 5.0 : -5.0;
				}
				else if (this.leanLeft && this.leanAngle <= 45.0)
					this.leanAngle += 5.0;
				else if (this.leanRight && this.leanAngle >= -45.0)
					this.leanAngle -= 5.0;
			}
		}

		this.camera.setLean(this.leanAngle);
		this.camera.moveBy(	xV, yV, zV );
		var terrainHeight = heightOf(this.position()[0], this.position()[2]);
		if ((this.position())[1] > terrainHeight)
		{
			this.isAirborne = true;
			this.yVelocity += this.yAcceleration;
			if (this.yVelocity < -5.0) // Terminal velocity
				this.yVelocity = -5.0;
		}
		else
		{
			this.camera.moveBy(0.0, terrainHeight - this.position()[1], 0.0);
			this.isAirborne = false;
			this.yVelocity = 0.0;
		}
	}

	var blackMaterial = new Material(
		vec4(0.0, 0.0, 0.0, 1.0),
		vec4(0.0, 0.0, 0.0, 1.0)
	);

	var top    = new Cube(blackMaterial, null, true, false);
	var bottom = new Cube(blackMaterial, null, true, false);
	var left   = new Cube(blackMaterial, null, true, false);
	var right  = new Cube(blackMaterial, null, true, false);

	top.position    = vec3(0,  0.75, 0);
	bottom.position = vec3(0, -0.75, 0);
	top.scale = bottom.scale = vec3(0.25, 1.0, 1.0);

	left.position  = vec3(-0.75, 0, 0);
	right.position = vec3( 0.75, 0, 0);
	left.scale = right.scale = vec3(1.0, 0.25, 1.0);

	this.crosshairs = [top, bottom, left, right];
}


function nextLeanAngle(curAngle)
{
	if (!nextLeanAngle.isInitialized)
		nextLeanAngle.isLeft = 1;
	nextLeanAngle.isInitialized = true;
	
	var newAngle = curAngle;
	if (curAngle >= 30.0)
		nextLeanAngle.isLeft = 0;
	else if (curAngle <= -30.0)
		nextLeanAngle.isLeft = 1;
	if (nextLeanAngle.isLeft)
		newAngle += 4.0;
	else
		newAngle -= 4.0;
	return newAngle;
}

Player.prototype.draw = function() {
	// Using a 32x32x32 box seems to make the crosshairs appropriately small
	var ratio = canvas.width / canvas.height;
	var orthoMat = ortho( -32 * ratio,  32 * ratio, -32, 32, -32, 32);
	var identMat = mat4();

	glHelper.setProjViewMatrix(orthoMat);
	this.crosshairs.forEach(function(e) {
		e.draw(0, identMat);
	});
}

// Key handler which will update our camera position
Player.prototype.handleKeyDown = function(e) {
	switch(e.keyCode) {
        case 87: // W - forward
			this.forwardVelocity = this.movementSpeed;
			break;
		case 65: // A - left
			this.leftVelocity = this.movementSpeed;
			break;
		case 83: // S - back
			this.backVelocity = this.movementSpeed;
			break;
		case 68: // D - right
			this.rightVelocity = this.movementSpeed;
			break;
		case 81: // Q - lean left
			this.leanLeft = true;
			break;
		case 69: // E - lean right
			this.leanRight = true;
			break;
		case 16: // SHIFT - run
			this.isRunning = true;
			break;
		case 32: // SPACE - jump
			if (!this.isAirborne)
			{
				this.isAirborne = true;
				this.yVelocity = 0.45;
			}
			break;
    }
}

Player.prototype.handleKeyUp = function(e) {
	switch(e.keyCode) {
        case 87: // W - forward
			this.forwardVelocity = 0.0;
			break;
		case 65: // A - left
			this.leftVelocity = 0.0;
			break;
		case 83: // S - back
			this.backVelocity = 0.0;
			break;
		case 68: // D - right
			this.rightVelocity = 0.0;
			break;
		case 81: // Q - lean left
			this.leanLeft = false;
			break;
		case 69: // E - lean right
			this.leanRight = false;
			break;
		case 16: // SHIFT - run
			this.isRunning = false;
			break;
    }
}


// ignoring for now
function handleKey(e) {
	switch(e.keyCode) {
                case 37: // Left Arrow - turn left
			camera.yawBy(rotateDegree);
			break;

                case 39: // Right Arrow - turn right
			camera.yawBy(-rotateDegree);
			break;

                case 38: // Up Arrow - pitch down
			camera.pitchBy(-rotateDegree);
			break;

                case 40: // Down Arrow - pitch up
			camera.pitchBy(rotateDegree);
			break;

		case 87: // w - move forward
			camera.moveBy(0, 0, moveUnit);
			break;

		case 65: // a - strafe left
			camera.moveBy(-moveUnit, 0, 0);
			break;

		case 83: // s - move backward
			camera.moveBy(0, 0, -moveUnit);
			break;

		case 68: // d - strafe right
			camera.moveBy(moveUnit, 0, 0);
			break;

		case 32: // space - elevate up
			camera.moveBy(0, moveUnit, 0);
			break;

		case 16: // shift - elevate down
			camera.moveBy(0, -moveUnit, 0);
			break;

		case 81: // q - roll left
			// FIXME: implement leaning
			break;

		case 69: // e - roll right
			// FIXME: implement leaning
			break;
        }
}