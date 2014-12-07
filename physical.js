var Physical = function(position, velocity, acceleration, bounce, friction)
{
	var m_velocity = velocity;
	var m_acceleration = acceleration;
	var m_bounce = bounce;
	var m_friction = friction;
	var m_isAirborne = false;

	this.impactVelocity = 0.0;

	this.velocity = function() { return m_velocity; }
	this.setYVelocity = function(newYVelocity)
	{
		m_velocity[1] = newYVelocity;
	}
	this.accelerate = function(acceleration)
	{
		m_velocity[0] += acceleration[0];
		m_velocity[1] += acceleration[1];
		m_velocity[2] += acceleration[2];
	}
	this.acceleration = function() { return m_acceleration; }
	this.isAirborne = function() { return m_isAirborne; }
	this.setFlight = function(fly) { m_isAirborne = fly; }

	this.physics = function(startPosition, attemptPosition)
	{
		var x1 = startPosition[0];
		var y1 = startPosition[1];
		var z1 = startPosition[2];

		var x2 = attemptPosition[0];
		var y2 = attemptPosition[1];
		var z2 = attemptPosition[2];

		// Kinematics
		if (this.isAirborne())
			m_velocity[1] += m_acceleration[1];

		var finalX = x2 + this.velocity()[0];
		var finalY = y2 + this.velocity()[1];
		var finalZ = z2 + this.velocity()[2];

		// Terrain collision
		var groundHeight = heightOf(x2, z2);
		if (y2 > groundHeight)
		{
			this.setFlight(true);
		}
		else
		{	
			if (true)
			{
				finalY = groundHeight;
				this.setFlight(false);
				m_velocity[1] = 0.0;
			}	
		}
		return vec3( finalX - x2, finalY - y2, finalZ - z2 );
	}
}