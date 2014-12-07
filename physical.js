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

	this.physics = function(position)
	{
		if (this.isAirborne)
			this.velocity[1] += this.acceleration[1];

		var xPos = this.position[0];
		var yPos = this.position[1];
		var zPos = this.position[2];

		var groundHeight = heightOf(xPos, zPos);
		
		if (yPos > groundHeight)
			this.isAirborne = true;
		else
		{	
			yPos = groundHeight;
			this.isAirborne = false;
		}
		
	}
}