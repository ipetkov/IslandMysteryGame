var Physical = (function()
{
	function constructor(acceleration, bounce, friction, objectRadius)
	{
		var m_velocity = vec3(0.0, 0.0, 0.0);
		var m_acceleration = acceleration;
		var m_bounce = bounce;
		var m_friction = friction;
		var m_isAirborne = false;
		var m_radius = objectRadius;

		this.impactVelocity = 0.0;

		this.radius = function() { return m_radius; }
		this.velocity = function() { return m_velocity; }
		this.setVelocity = function(newVelocity)
		{
			m_velocity[0] = newVelocity[0];
			m_velocity[1] = newVelocity[1];
			m_velocity[2] = newVelocity[2];
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

		this.isMoving = function()
		{
			var vel = magnitude(m_velocity);
			return (vel > 0.02 || vel < -0.02);
			//return m_velocity[0] != 0 || m_velocity[1] != 0 || m_velocity[2] != 0;
		}

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

			var finalX = x2 + m_velocity[0];
			var finalY = y2 + m_velocity[1];
			var finalZ = z2 + m_velocity[2];

			// Terrain collision
			var groundHeight = heightOf(x2, z2);
			if (y2 > groundHeight + m_radius || m_velocity[1] > 0.0)
			{
				this.setFlight(true);
			}
			else
			{	
				finalY = groundHeight + m_radius + 0.001;
				// Bouncing
				var coord1 = vec3(x2 + 0.2, heightOf(x2 + 0.2, z2 - 0.2), z2 - 0.2);
				var coord2 = vec3(x2, heightOf(x2, z2 + 0.2), z2 + 0.2);
				var coord3 = vec3(x2 - 0.2, heightOf(x2 - 0.2, z2 - 0.2), z2 - 0.2);
				var terrainNormal = plane(coord1, coord2, coord3);

				var projNV = scaleVec(dot(scaleVec(-1, m_velocity), terrainNormal), terrainNormal);
				m_velocity = add(scaleVec(2, projNV), m_velocity);
				m_velocity[1] *= bounce;

				if (m_velocity[1] < 0.03)
				{
					finalY = groundHeight + m_radius;
					this.setFlight(false);
					m_velocity[1] = 0.0;
				}

				// Friction
				m_velocity[0] *= (1.0 - m_friction);
				m_velocity[2] *= (1.0 - m_friction);

				var xVel = m_velocity[0];
				var zVel = m_velocity[2];
				if (Math.sqrt(xVel * xVel + zVel * zVel) < 0.01)
				{
					m_velocity[0] = 0.0;
					m_velocity[2] = 0.0;
				}
			}
			return vec3( finalX - x2, finalY - y2, finalZ - z2 );
		}
	}

	return constructor;
})();
