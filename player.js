function Player(glCanvas, pos, speed) {
	this.camera = new Camera(glCanvas);
	this.camera.moveBy(pos[0], pos[1], pos[2]);

	this.forwardVelocity = 0.0;
	this.leftVelocity = 0.0;
	this.backVelocity = 0.0;
	this.rightVelocity = 0.0;
	this.movementSpeed = speed;

	this.leanLeft = false;
	this.leanRight = false;
	this.leanAngle = 0.0;
	
	this.isRunning = false;
	
	this.physical = new Physical(	vec3(0.0, -0.01, 0.0),	//acceleration
									0.1,					//bounce
									0.0,					//friction
									0.0);					//radius
	this.position = function()
	{
		return this.camera.position();
	}

	this.testMove = function(testX, testY, testZ)
	{
		var curHeight = this.position()[1];
		this.camera.moveBy(testX, testY, testZ);
		var testHeight = heightOf(this.position()[0], this.position()[2]);
		this.camera.moveBy(-testX, -testY, -testZ);
		
		//EDIT to accomodate collision?
		return (testHeight - curHeight <= 0.2);
	}

	this.move = function()
	{
		var startPosition = this.position();

		// Movement based on keyboard keys
		var xV = this.rightVelocity - this.leftVelocity;
		var yV = this.physical.velocity()[1];
		var zV = this.forwardVelocity - this.backVelocity;

		// Adjust velocities and lean based on player's state
		if (this.physical.isAirborne())
		{
			if (this.isRunning && zV > 0)
				zV *= 1.5;
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
				zV *= 1.5;
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
		
		if (this.testMove(xV, 0.0, 0.0))
			this.camera.moveBy(xV, 0.0, 0.0);
		else if (this.testMove(xV * Math.sqrt(3) / 2, 0.0, xV / 2))
			this.camera.moveBy(xV * Math.sqrt(3) / 2, 0.0, xV / 2);
		else if (this.testMove(xV * Math.sqrt(3) / 2, 0.0, -xV / 2))
			this.camera.moveBy(xV * Math.sqrt(3) / 2, 0.0, -xV / 2);
		else if (this.testMove(xV / 2, 0.0, xV * Math.sqrt(3) / 2))
			this.camera.moveBy(xV / 2, 0.0, xV * Math.sqrt(3) / 2);
		else if (this.testMove(xV / 2, 0.0, -xV * Math.sqrt(3) / 2))
			this.camera.moveBy(xV / 2, 0.0, -xV * Math.sqrt(3) / 2);

		if (this.testMove(0.0, 0.0, zV))
			this.camera.moveBy(0.0, 0.0, zV);
		else if (this.testMove(zV / 2, 0.0, zV * Math.sqrt(3) / 2))
			this.camera.moveBy(zV / 2, 0.0, zV * Math.sqrt(3) / 2);
		else if (this.testMove(-zV / 2, 0.0, zV * Math.sqrt(3) / 2))
			this.camera.moveBy(-zV / 2, 0.0, zV * Math.sqrt(3) / 2);
		else if (this.testMove(zV * Math.sqrt(3) / 2, 0.0, zV / 2))
			this.camera.moveBy(zV * Math.sqrt(3) / 2, 0.0, zV / 2);
		else if (this.testMove(-zV * Math.sqrt(3) / 2, 0.0, zV / 2))
			this.camera.moveBy(-zV * Math.sqrt(3) / 2, 0.0, zV / 2);

		this.camera.moveBy( 0.0, yV, 0.0);

		var attemptPosition = this.position();
		
		//Movement adjustment according to physics
		var finalMove = this.physical.physics(startPosition, attemptPosition);
		this.camera.moveBy(finalMove[0], finalMove[1], finalMove[2]);
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

	var orthoMat = ortho( -.5,  .5, -.5, .5, -.5, .5);
	var leftTex  = new Texture.fromImageSrc('./images/arm-left.png',  gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR);
	var rightTex = new Texture.fromImageSrc('./images/arm-right.png', gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR);

	this.leftArm          = new Cube(null, leftTex, false, false);
	this.leftArm.scale    = vec3(0.0625, 0.75, 0.0625);
	this.leftArm.position = vec3(-0.35, -0.45, 0);
	this.leftArm.pitch    = -70;
	this.leftArm.yaw      = -10;

	this.leftArm.draw = function(dt, mat) {
		glHelper.enableLighting(false);
		glHelper.setProjViewMatrix(orthoMat);
		Cube.prototype.draw.call(this, dt, mat);
		glHelper.setProjViewMatrix(player.camera.getProjViewMatrix()); // Reset the proj matrix
		glHelper.enableLighting(true);
	}

	this.rightArm              = new Cube(null, rightTex, false, false);
	this.rightArm.scale        = this.leftArm.scale;
	this.rightArm.position     = scaleVec(-1, this.leftArm.position);
	this.rightArm.position[1] *= -1;
	this.rightArm.pitch        = this.leftArm.pitch;
	this.rightArm.yaw          = -this.leftArm.yaw;
	this.rightArm.draw         = this.leftArm.draw;
}

function nextLeanAngle(curAngle)
{
	if (!nextLeanAngle.isInitialized)
		nextLeanAngle.isLeft = 1;
	nextLeanAngle.isInitialized = true;
	
	var newAngle = curAngle;
	if (curAngle >= 7.0)
		nextLeanAngle.isLeft = 0;
	else if (curAngle <= -7.0)
		nextLeanAngle.isLeft = 1;
	if (nextLeanAngle.isLeft)
		newAngle += 1.0;
	else
		newAngle -= 1.0;
	return newAngle;
}

Player.prototype.draw = function(dt) {
	// Using a 32x32x32 box seems to make the crosshairs appropriately small
	var ratio = canvas.width / canvas.height;
	var orthoMat = ortho( -32 * ratio,  32 * ratio, -32, 32, -32, 32);
	var identMat = mat4();

	glHelper.setProjViewMatrix(orthoMat);
	this.crosshairs.forEach(function(e) {
		e.draw(0, identMat);
	});

	this.leftArm.draw(dt, identMat);
	this.rightArm.draw(dt, identMat);
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
			if (!this.physical.isAirborne())
			{
				this.physical.setFlight(true);
				this.physical.accelerate(vec3(0.0, 0.20, 0.0));
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

