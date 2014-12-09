var Campfire = (function() {


	function constructor(position)
	{
		this.numSticks = 0.0;
		this.fireOn = false;
		this.burningTime = 0.0;
		this.timeToBurnOut = 40000;
		this.material = new Material(vec4(0.6, 0.6, 0.6, 1.0), vec4(1.0, 0.27, 0.0, 1.0));

		this.position = new vec3;
		this.position[0] = position[0];
		this.position[1] = position[1];
		this.position[2] = position[2];

		var fireTex = new Texture.fromImageSrc('./images/fire.jpg', gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST);
		var smokeTex = new Texture.fromImageSrc('./images/smoke.jpg', gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST);

		this.stick1 = new Stick(vec3(-0.14 + this.position[0], 0.14 + this.position[1], this.position[2]), 0.0, 0.0, 235.0);
		this.stick2 = new Stick(vec3(0.14 + this.position[0], 0.14 + this.position[1], this.position[2]), 0.0, 0.0, 125.0);

		this.fireplane1 = new Plane(null, fireTex);
		this.fireplane1.position = vec3(0.0 + this.position[0], 0.001 + this.position[1], 0.0 + this.position[2]);
		this.fireplane1.scale = vec3(0.4, 0.4, 0.4);
		this.fireplane1.pitch = 90.0;
		this.fireplane2 = new Plane(null, fireTex);
		this.fireplane2.position = vec3(0.0 + this.position[0], 0.1 + this.position[1], 0.0 + this.position[2]);
		this.fireplane2.scale = vec3(0.32, 0.32, 0.32);
		this.fireplane2.pitch = 90.0;
		this.fireplane3 = new Plane(null, fireTex);
		this.fireplane3.position = vec3(0.0 + this.position[0], 0.15 + this.position[1], 0.0 + this.position[2]);
		this.fireplane3.scale = vec3(0.25, 0.25, 0.25);
		this.fireplane3.pitch = 90.0;
		this.fireplane4 = new Plane(null, fireTex);
		this.fireplane4.position = vec3(0.0 + this.position[0], 0.22 + this.position[1], 0.0 + this.position[2]);
		this.fireplane4.scale = vec3(0.18, 0.18, 0.18);
		this.fireplane4.pitch = 90.0;

		this.smokeplane = [];
		this.smokeplane.push(new Plane(null, smokeTex));
		this.smokeplane[0].position = vec3(0.0 + this.position[0], 0.4 + this.position[1], 0.0 + this.position[2]);
		this.smokeplane[0].scale = vec3(0.05, 0.05, 0.05);
		this.smokeplane[0].pitch = 90.0;

		this.smokeplane.push(new Plane(null, smokeTex));
		this.smokeplane[1].position = vec3(0.0 + this.position[0], 0.45 + this.position[1], 0.05 + this.position[2]);
		this.smokeplane[1].scale = vec3(0.1, 0.1, 0.1);
		this.smokeplane[1].pitch = 90.0;

		this.smokeplane.push(new Plane(null, smokeTex));
		this.smokeplane[2].position = vec3(0.0 + this.position[0], 0.5 + this.position[1], 0.1 + this.position[2]);
		this.smokeplane[2].scale = vec3(0.15, 0.15, 0.15);
		this.smokeplane[2].pitch = 90.0;

		this.smokeplane.push(new Plane(null, smokeTex));
		this.smokeplane[3].position = vec3(0.0 + this.position[0], 0.55 + this.position[1], 0.15 + this.position[2]);
		this.smokeplane[3].scale = vec3(0.2, 0.2, 0.2);
		this.smokeplane[3].pitch = 90.0;

	}

	return constructor;
})();

Campfire.prototype.addStick = function() {
	if(this.numSticks < 4.0){
		this.numSticks++;
		if(this.fireOn)
			this.burningTime = this.burningTime - this.timeToBurnOut / 4;}
}

Campfire.prototype.draw = function(dt, mat) {
	var height = this.position[1];
	var x_dis = this.position[0];
	var z_dis = this.position[2];

	if(this.numSticks > 3.0)
		this.fireOn = true;
	else if(this.numSticks < 1.0)
		this.fireOn = false;

	if(this.fireOn){
		glHelper.enableLighting(false);
		glHelper.setLightPosition(this.position);
		//light position is not reset to sun in campfire.js
		//It is resent in sky.js when sun.draw is called
		glHelper.setLightMaterial(this.material);
		this.burningTime = this.burningTime + dt;
		var timeRatio = (this.burningTime / (this.timeToBurnOut/4.0)) % 1;
		if(timeRatio > 0.99){
			this.numSticks = this.numSticks - 1.0;
			this.burningTime = this.burningTime + 0.02*this.timeToBurnOut/4;}
		if(this.burningTime >= this.timeToBurnOut){
			this.numSticks = 0.0;
			this.burningTime = 0.0;}
	}

	if(this.numSticks > 0.0)
		this.stick1.draw(dt, mat);
	if(this.numSticks > 1.0)
		this.stick2.draw(dt, mat);
	if(this.numSticks > 2.0){

	
		var rotMat = translate(x_dis, height, z_dis); 
		rotMat = mult(rotMat,rotate(90.0, vec3(0,1,0)));
		rotMat = mult(rotMat, translate(-x_dis, -height, -z_dis)); 
	
		this.stick1.draw(dt, rotMat);
	}
	if(this.numSticks > 3.0)
		this.stick2.draw(dt, rotMat);
	if(this.fireOn){
		this.fireplane1.draw(dt, mat);
		this.fireplane2.draw(dt, mat);
		this.fireplane3.draw(dt, mat);
		this.fireplane4.draw(dt, mat);


		var tau = dt/10000;
		for(var i = 0; i < 4; i++){
			tau = tau + timer.getElapsedTime() / 10000;
			this.smokeplane[i].position[1] = this.smokeplane[i].position[1] + tau;
			if(this.smokeplane[i].position[1] > 0.6 + this.position[1]) this.smokeplane[i].position[1] = 0.4 + this.position[1];
		
			var scaler = this.smokeplane[i].position[1] - 0.35 - this.position[1];
			var z_displacer = scaler - 0.05;
			this.smokeplane[i].scale = vec3(scaler, scaler, scaler);
			this.smokeplane[i].position[2] = z_displacer + this.position[2];
	
			tau = tau + timer.getElapsedTime() / 10000;
			this.smokeplane[i].draw(dt,mat);
		}
	}
	glHelper.enableLighting(true);
}
