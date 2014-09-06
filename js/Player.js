function Player(opts) {
	this.renderColor = "#232323";
	this.sideLength = 22;
	this.keyBindings = [37, 39, 38]; //left / right arrow keys
	this.jumps = 0;
	this.angle = 0;
	this.angularVelocity = 0;
	this.yOffset = 0;
	this.yVelocity = 0;
	this.numBodies = 1;
	this.acceleration = (1/180) * Math.PI;
	this.bodies = [];

	this.init = function(opts) {
		for (var i in opts) {
			this[i] = opts[i];
		}

		var angleDiff = (Math.PI * 2) / this.numBodies;
		for (var i = 0; i < this.numBodies; i++) {
			this.bodies.push(angleDiff * i);
		}
	};

	this.update = function(dt) {
		var normalizedAcceleration = dt * this.acceleration;

		for (var x = 0; x < blocks.length; x++ ){
			// console.log(blocks[x].distFromCenter)
			if (isPlayerTouchingBlock(this, blocks[x])){
				//console.log("touch!");
			}			
			else {
				//console.log("no touch!");
			}
		}

		if (keys[this.keyBindings[2]]) {
			if (this.jumps < this.maxJumps) {
				this.jumps += 1;
				this.yVelocity = this.jumpForce;
			}

			keys[this.keyBindings[2]] = 0;
		}

		if (keys[this.keyBindings[0]]) {
			if (this.angularVelocity > 4 * normalizedAcceleration) {
				this.angularVelocity -= 4 * normalizedAcceleration;
			} else if (this.angularVelocity > 0) {
				this.angularVelocity = (this.angularVelocity - 4 * normalizedAcceleration)/4;
			} else {
				this.angularVelocity -= normalizedAcceleration;
			}
		}

		if (keys[this.keyBindings[1]]) {
			if (this.angularVelocity < -4 * normalizedAcceleration) {
				this.angularVelocity += 4 * normalizedAcceleration;
			} else if (this.angularVelocity < 0) {
				this.angularVelocity = (this.angularVelocity + 4 * normalizedAcceleration)/4;
			} else {
				this.angularVelocity += normalizedAcceleration;
			}
		}

		if (!keys[this.keyBindings[1]] && !keys[this.keyBindings[0]]) {
			if (this.angularVelocity < -4 * normalizedAcceleration) {
				this.angularVelocity += 4 * normalizedAcceleration;
			} else if (this.angularVelocity > 4 * normalizedAcceleration) {
				this.angularVelocity -= 4 * normalizedAcceleration
			} else {
				this.angularVelocity = 0;
			}
		}

		if (Math.abs(this.angularVelocity) > (5/180) * Math.PI) {
			this.angularVelocity = (5/180) * Math.PI * (this.angularVelocity < 0 ? -1 : 1);
		}

		this.yVelocity -= settings.gravity * dt;
		this.yOffset += this.yVelocity * dt;
		if (this.yOffset <= 0) {
			this.yOffset = 0;
			this.jumps = 0;
			this.yVelocity = 0;
		}
		
		this.angle += this.angularVelocity * dt;
		this.radius = settings.baseRadius + this.yOffset;
	};

	this.draw = function() {
		for (var i = 0; i < this.bodies.length; i++) {
			var angle = this.bodies[i] + this.angle;
			var ss = settings.scale;
			/*
			console.log("Begin Draw Cone");
			drawConeSectionFromCenter(trueCanvas.width/2, trueCanvas.height/2, (this.angle + .5), (this.angle - .5), this.sideLength, this.yOffset + gdr, "#FFFFFF");
			console.log("End Draw Cone");
			*/
			drawRect(trueCanvas.width/2 + ss * Math.cos(angle) * this.radius + (-this.sideLength/2) * Math.sin(2 * Math.PI - angle) * ss, trueCanvas.height/2 + Math.sin(angle) * this.radius * ss + (-this.sideLength/2) * Math.cos(2 * Math.PI - angle) * ss, this.sideLength, this.color, angle, (this.yOffset == 0));
		}
	};

	this.init(opts);
}

Player.prototype.jumpForce = 16;
Player.prototype.maxJumps = 3;