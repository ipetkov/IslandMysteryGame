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

	var orthoMat = ortho( -.5,  .5, -.5, .5, -.5, .5);
	var identMat = mat4();
	var leftTex  = new Texture.fromImageSrc('./images/arm-left.png',  gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR);
	var rightTex = new Texture.fromImageSrc('./images/arm-right.png', gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR);
	var armBump = new Texture.fromImageSrc('./images/balls.png',gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR);

	this.leftArm          = new Cube(null, leftTex, false, false, armBump);
	this.leftArm.scale    = vec3(0.0625, 0.75, 0.0625);
	this.leftArm.position = vec3(-0.35, -0.45, 0);
	this.leftArm.pitch    = -70;
	this.leftArm.yaw      = -10;

	this.leftArm.draw = function(dt, mat) {
		glHelper.enableLighting(false);
		glHelper.setProjMatrix(orthoMat);
		glHelper.setViewMatrix(identMat);
		Cube.prototype.draw.call(this, dt, mat);
		var ProjAndView = player.camera.getProjViewMatrix();//reset proj adn view matrixes
		glHelper.setProjMatrix(ProjAndView[0]);
		glHelper.setViewMatrix(ProjAndView[1]);
		glHelper.enableLighting(true);
	}

	this.rightArm              = new Cube(null, rightTex, false, false, armBump);
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

Player.prototype.draw = function(dt) {
	// Using a 32x32x32 box seems to make the crosshairs appropriately small
	var ratio = canvas.width / canvas.height;
	var orthoMat = ortho( -32 * ratio,  32 * ratio, -32, 32, -32, 32);
	var identMat = mat4();

	glHelper.setProjMatrix(orthoMat);
	glHelper.setViewMatrix(identMat);
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

