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

	this.daySky     = vec4(0.54, 0.81, 0.94, 1.0);
	this.settingSky = vec4(0.82, 0.53, 0.42, 1.0);
	this.nightSky   = vec4(0.19, 0.17, 0.21, 1.0);

	this.skyColor = this.daySky;

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

	var rad = radians(this.angle);
	var sin = Math.sin(rad);
	var cos = Math.cos(rad);
	var posCos = this.distFromOrigin * cos;
	var posSin = this.distFromOrigin * sin;

	var lightAlpha = Math.abs(sin); // Amount of light (from day to night) that the scene gets
	var epsilon = 5;
	var envLight = this.daylight;
	var oldLight = this.lightMaterial;

	glHelper.setLightPosition(vec3(posCos, posSin, 0));

	// The sun and the moon get lit using full day light no matter what
	this.lightMaterial = this.daylight;

	// If the sun is rising/setting, still draw the moon to avoid it
	// jumping in/out when it is around the horizon.
	if(this.angle > 180 - epsilon || this.angle < epsilon ) {
		// Sun's light position already set
		this.moon.draw(dt, rotate(this.angle + 180, vec3(0, 0, 1)));
	}

	// Draw the sun around the horizon to avoid it jumping in/out of view
	if(this.angle > 360 - epsilon || this.angle < 180 + epsilon) {
		this.sun.draw(dt, rotate(this.angle, vec3(0, 0, 1)));
	}

	// Restore the light material for the rest of the scene
	this.lightMaterial = oldLight;

	// Leaving these values hardcoded becuase the result looks decent enough
	// and this should never have to change at run time.
	if(this.angle < 160 && this.angle > 140) {
		// Start setting, go from daytime to setting sky
		this.skyColor = mix(this.settingSky, this.daySky, (this.angle - 140)/20);

	} else if(this.angle >= 160 && this.angle < 200) {
		// Start darkening, from setting sky to night time
		this.skyColor = mix(this.nightSky, this.settingSky, (this.angle - 160)/40);

	} else if(this.angle >= 200 && this.angle < 340) {
		// Stay at night time
		this.skyColor = this.nightSky;

	} else if(this.angle >= 340) {
		// Sunrise, start going from dark to the sunset/sunrise color
		this.skyColor = mix(this.settingSky, this.nightSky, (this.angle - 340)/40);
	} else if(this.angle < 20) {
		// Finish transitioning from night to sunrise sky
		this.skyColor = mix(this.settingSky, this.nightSky, (this.angle+20)/40);

	} else if(this.angle >= 20 && this.angle < 40) {
		// Transition from sunrise to day time sky
		this.skyColor = mix(this.daySky, this.settingSky, (this.angle - 20)/20);

	} else {
		// Default day sky
		this.skyColor = this.daySky;
	}

	// If the sun is "gone", use the moon's position as a light source
	// and moonlight for the rest of the scene
	if(this.angle > 180) {
		glHelper.setLightPosition(vec3(-posCos, -posSin, 0));
		envLight = this.moonlight;
	}

	this.lightMaterial = new Material(
		mix(envLight.ambient, this.darkness.ambient, lightAlpha),
		mix(envLight.diffuse, this.darkness.diffuse, lightAlpha)
	);
}
