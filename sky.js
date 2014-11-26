function Sun(distFromOrigin, omega) {
	// The light the scene will get at day time
	this.daylight = new Material(
		vec4(0.3, 0.3, 0.3, 1.0),
		vec4(0.7, 0.7, 0.7, 1.0)
	);

	// The light the scene will get if the sun has set
	this.darkness = new Material(
		vec4(0.2, 0.2, 0.2, 1.0),
		vec4(0.0, 0.0, 0.0, 1.0)
	);

	// The light the scene will get at night time from the moon
	this.moonlight = new Material(
		vec4(0.2, 0.2, 0.2, 1.0),
		vec4(0.25, 0.33, 0.36, 1.0)
	);

	// The material the glHelper will use for calculating light products
	this.lightMaterial = this.daylight;

	this.angle = 0;      // Stores the time of day
	this.omega = omega;  // Determines how fast the day is
	this.distFromOrigin = distFromOrigin;

	this.sun = new Cube(new Material(
		vec4(1.0, 1.0, 0.0, 1.0),
		vec4(1.0, 1.0, 0.0, 1.0)
	), null, true, true);
	this.sun.scale = vec3(10.0, 10.0, 10.0);

	this.moon = new Cube(new Material(
		vec4(0.3, 0.3, 0.3, 1.0),
		vec4(0.65, 0.65, 0.65, 1.0)
	), null, false, false);
	this.moon.scale = vec3(6.0, 6.0, 6.0);
}

Sun.prototype.draw = function(dt) {
	this.angle = (this.angle + dt * this.omega) % 360;
	this.sun.position = this.moon.position = vec3(this.distFromOrigin, 0.0, 0.0);

	// Position of light where the sun is, regardless if under the horizon
	var rad = radians(this.angle);
	var sin = Math.sin(rad);
	var cos = Math.cos(rad);
	var posCos = this.distFromOrigin * cos;
	var posSin = this.distFromOrigin * sin;
	var sunLightPosition = vec3(posCos, posSin, 0);

	var alpha = Math.abs(sin);
	var epsilon = 5;
	var envLight = this.daylight;
	var oldLight = this.lightMaterial;

	glHelper.setLightPosition(sunLightPosition);

	// If the sun is rising/setting, still draw the moon to avoid it
	// jumping in/out when it is around the horizon.
	if(this.angle > 180 - epsilon || this.angle < epsilon ) {
		// Sun's light position already set
		oldLight = this.lightMaterial;      // Back up whatever the current light to avoid
						    // light jitter when drawing sun.
		this.lightMaterial = this.daylight; // The moon gets the sun's full light no matter what
		this.moon.draw(dt, rotate(this.angle + 180, vec3(0, 0, 1)));
		this.lightMaterial = oldLight;
	}

	// Draw the sun around the horizon to avoid it jumping in/out of view
	if(this.angle > 360 - epsilon || this.angle < 180 + epsilon) {
		this.sun.draw(dt, rotate(this.angle, vec3(0, 0, 1)));
	}

	// If the sun is "gone", use the moon's position as a light source
	// and moonlight for the rest of the scene
	if(this.angle > 180) {
		glHelper.setLightPosition(vec3(-posCos, -posSin, 0));
		envLight = this.moonlight;
	}

	this.lightMaterial = new Material(
		mix(envLight.ambient, this.darkness.ambient, alpha),
		mix(envLight.diffuse, this.darkness.diffuse, alpha)
	);
}
