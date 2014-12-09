var footstepSound = new Audio("sounds/footstep.wav");
footstepSound.volume = .9;

var musicOn = true;

var windSound = new Audio("sounds/wind.mp3");
windSound.loop=true;

var waveSound = new Audio("sounds/wave.mp3");
waveSound.loop=true;
waveSound.volume=.2;

var ITBURNS = new Audio("sounds/oink.wav");
ITBURNS.volume=0.5;

var fireSound = new Audio("sounds/fire.wav");
fireSound.loop=true;
fireSound.volume=0.5;

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
		var thisPos = this.position();
		var xV = this.rightVelocity - this.leftVelocity;
		var yV = this.yVelocity;
		var zV = this.forwardVelocity - this.backVelocity;

		var newPos = add(thisPos, vec3(xV, yV, zV));
		var trees = Tree.getTrees();

		var rad = radians(this.camera.yaw());
		var sin = Math.sin(rad);
		var cos = Math.cos(rad);

		var heading = vec3(
			(zV * sin) - (xV * cos),
			0,
			(zV * cos) + (xV * sin)
		);

		for(var i = 0; i < trees.length; i++) {
			if(trees[i].checkCollide(newPos, this.movementSpeed)) {
				var d = dot(subtract(trees[i].position, thisPos), heading);
				if(d > 0) {
					continue;
				}

				zV = 0;
				xV = 0;
				break;
			}
		}

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

		//footsteps
		if(yV!=0) {
		    footstepSound.pause();
		}

		else if(xV!=0 || zV!=0) {
		    footstepSound.play();
		}
		else {
		    footstepSound.pause();
		}

		this.camera.moveBy(xV, yV, zV );
		thisPos = this.position();
		var terrainHeight = heightOf(thisPos[0], thisPos[2]);
		if (thisPos[1] > terrainHeight)
		{
			this.isAirborne = true;
			this.yVelocity += this.yAcceleration;
			if (this.yVelocity < -5.0) // Terminal velocity
				this.yVelocity = -5.0;
		}
		else
		{
			this.camera.moveBy(0.0, terrainHeight - thisPos[1], 0.0);
			this.isAirborne = false;
			this.yVelocity = 0.0;
		}
        
        //sounds
        //fire
        var vectorFromFire = subtract(this.position(), fire.position);
        var distanceFromFire = vectorFromFire[0]*vectorFromFire[0] +
                               vectorFromFire[1]*vectorFromFire[1] +
                               vectorFromFire[2]*vectorFromFire[2];
        if(distanceFromFire<=16 && fire.fireOn) {
            fireSound.play();
        }
        else {
            fireSound.pause();
        }
        if(distanceFromFire<=.05 && fire.fireOn) {
            ITBURNS.play();
        }
        //wind
        if(this.position()[1]>=maxIslandHeight-2) {
            music.volume=0.01;
            windSound.volume=0.5;
            windSound.play();
        }
        else if (this.position()[1]>=maxIslandHeight-10) {
            music.volume=0.05;
            windSound.volume=0.2;
            windSound.play();
        }
        else if (this.position()[1]>=maxIslandHeight-15) {
            music.volume=0.07;
            windSound.volume=0.1;
            windSound.play();
        }
        else if (this.position()[1]>=maxIslandHeight-20) {
            music.volume=0.09;
            windSound.volume=0.05;
            windSound.play();
        }
        else if (this.position()[1]>=maxIslandHeight-25) {
            music.volume=0.1;
            windSound.volume=0.02;
            windSound.play();
        }
        else {
            music.volume=0.15;
            windSound.pause();
            windSound.currentTime=0;
        }
        //waves
        if(this.position()[1]<1.5) {
            waveSound.volume=.2;
            waveSound.play();
        }
        else if(this.position()[1]<8.0) {
            waveSound.volume=.1;
            waveSound.play();
        }
        else {
            waveSound.volume=.01;
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

	this.leftArm          = new Cube(null, leftTex, false, false, null);
	this.leftArm.scale    = vec3(0.0625, 0.75, 0.0625);
	this.leftArm.position = vec3(-0.35, -0.45, 0);
	this.leftArm.pitch    = -70;
	this.leftArm.yaw      = -10;

	this.leftArm.draw = function(dt, mat) {
		glHelper.uniformLighting(false);
		glHelper.setProjViewMatrix(orthoMat);
		Cube.prototype.draw.call(this, dt, mat);
		glHelper.setProjViewMatrix(player.camera.getProjViewMatrix()); // Reset the proj matrix
		glHelper.uniformLighting(true);
	}

	this.rightArm              = new Cube(null, rightTex, false, false, false);
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
            footstepSound.playbackRate=2.0;
			break;
		case 84: //T - add a stick to the fire if you are at camp
			var x = this.position()[0];
			var z = this.position()[2];
            var fx = fire.position[0];
            var fz = fire.position[2];
			if(x > fx-1 && x < fx+1 && z > fz-1 && z <fz+1) {
				fire.addStick();
                var stickSound = new Audio("sounds/wood.wav");
                stickSound.volume=0.2;
                stickSound.play();
            }
			break;
		case 32: // SPACE - jump
			if (!this.isAirborne)
			{
				this.isAirborne = true;
				this.yVelocity = 0.45;
            }
			break;
        case 77: // M music on/off
            musicOn=!musicOn;
            if(musicOn && isNighttime){music.play();}
            else{music.pause();}
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
            footstepSound.playbackRate=1.0;
			break;
        case 32: // SPACE - jump
			break;
    }
}

