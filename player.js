// Key handler which will update our camera position
function handleKeyDown(e) {
	switch(e.keyCode) {
        case 87: // W - forward
			forwardVelocity = moveUnit;
			break;
		case 65: // A - left
			leftVelocity = moveUnit;
			break;
		case 83: // S - back
			backVelocity = moveUnit;
			break;
		case 68: // D - right
			rightVelocity = moveUnit;
			break;
        }
}

function handleKeyUp(e) {
	switch(e.keyCode) {
        case 87: // W - forward
			forwardVelocity = 0.0;
			break;
		case 65: // A - left
			leftVelocity = 0.0;
			break;
		case 83: // S - back
			backVelocity = 0.0;
			break;
		case 68: // D - right
			rightVelocity = 0.0;
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