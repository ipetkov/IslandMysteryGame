var Rock = (function() {
	var rockMaterial = new Material(
		vec4(0.6, 0.6, 0.6, 1.0),
		vec4(0.25, 0.33, 0.36, 1.0)
	);

	var rockTex = null;

	function constructor(position, scale)
	{
		this.physical = new Physical(	vec3(0.0, -0.01, 0.0),
										Math.min(0.5 / (scale * scale), 0.5),
										0.05,
										scale);
		if(!rockTex) {
			rockTex = new Texture.fromImageSrc('./images/rock.png');
		}
		
		this.figure = new Sphere(rockMaterial, rockTex, false);
		this.figure.position = position;
		this.figure.radius = scale;	

		this.moveBy = function(distance)
		{
			this.figure.position[0] += distance[0];
			this.figure.position[1] += distance[1];
			this.figure.position[2] += distance[2];
		}	
		this.position = function() { return this.figure.position; }
	}

	return constructor;
})();

Rock.prototype.draw = function(dt, mat) {
	var finalMove = this.physical.physics(	this.position(), this.position());
	var trees = Tree.getTrees();
	var curPos = this.figure.position;
	var velocity = this.physical.velocity();
	var horizontalV = Math.sqrt(velocity[0] * velocity[0] + velocity[2] * velocity[2]);
	for(var i = 0; i < trees.length; i++) {
			if(trees[i].checkCollision(add(curPos, velocity), horizontalV + this.physical.radius())) {
				var d = dot(subtract(trees[i].position, curPos), finalMove);
				if(d < 0) {
					continue;
				}

				//finalMove[0] = 0.0;
				//finalMove[2] = 0.0;
				this.physical.setVelocity(vec3(-velocity[0] / 2, velocity[1], -velocity[2] / 2));
				break;
			}
		}
	this.moveBy(finalMove);
	this.figure.draw(dt, mat);
}
