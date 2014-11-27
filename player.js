function Player(glCanvas, pos, speed) {
	this.camera = new Camera(glCanvas);
	this.camera.moveBy(pos[0], pos[1], pos[2]);

	this.forwardVelocity = 0.0;
	this.leftVelocity = 0.0;
	this.backVelocity = 0.0;
	this.rightVelocity = 0.0;

	this.movementSpeed = speed;

	this.position = function()
	{
		return this.camera.position();
	}

	this.move = function()
	{
		var xV = this.rightVelocity - this.leftVelocity;
		var zV = this.forwardVelocity - this.backVelocity;

		this.camera.moveBy(	xV,
							0.0,
							zV );
	}
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