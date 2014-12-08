var Rock = (function() {
	var rockMaterial = new Material(
		vec4(0.2, 0.2, 0.2, 1.0),
		vec4(0.25, 0.33, 0.36, 1.0)
	);

	var rockTex = null;


	function constructor(position, scale)
	{
		var m_position;
		this.position = function() { return m_position; }

		this.physical = new Physical(	vec3(0.0, -0.01, 0.0),
										0.5,
										0.0,
										scale);

		if(!rockTex) {
			rockTex = new Texture.fromImageSrc('./images/grass.jpg');
		}

		m_position = position;
		
		this.figure = new Sphere(rockMaterial, rockTex, false);
		this.figure.position = vec3(m_position);
		this.figure.scale = vec3(scale, scale, scale);	

		this.moveBy = function(x, y, z)
		{
			m_position[0] += x;
			m_position[1] += y;
			m_position[2] += z;
		}	
	}

	return constructor;
})();

Rock.prototype.draw = function(dt, mat) {
	var finalMove = this.physical.physics(	this.position(),
											this.position());
	this.moveBy(finalMove[0], finalMove[1], finalMove[2]);
	this.figure.position = this.position();
	this.figure.draw(dt, mat);
}
