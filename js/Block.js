function Block(opts) {
	this.state = 0;
	this.angle = 0;
	this.initTime = 25;
	this.counter = 0;
	this.blockHeight = 20;
	this.endTime = 10;
	this.iter = 5;
	this.color = '#f1c40f';
	this.angularWidth = Math.PI/5;
	this.distFromCenter = 400;
	for (var i in opts) {
		this[i] = opts[i];
	}

	this.draw = function() {
		switch (this.state) {
			case 0:
				drawConeSectionFromCenter(trueCanvas.width/2, trueCanvas.height/2, (this.angle - this.angularWidth/2) + (this.angularWidth) * (this.counter/this.initTime), (this.angle - this.angularWidth/2), this.blockHeight, this.distFromCenter, '#1abc9c');
				var op = (1 - (this.counter)/this.initTime);
				if (op > 0) {
					drawConeSectionFromCenter(trueCanvas.width/2, trueCanvas.height/2, (this.angle - this.angularWidth/2) + (this.angularWidth) * (this.counter/this.initTime), (this.angle - this.angularWidth/2), this.blockHeight, this.distFromCenter, '#FFFFFF', op);
				}
				break;

			case 1:
				drawConeSectionFromCenter(trueCanvas.width/2, trueCanvas.height/2, this.angle + this.angularWidth/2, this.angle - this.angularWidth/2, this.blockHeight, this.distFromCenter, '#1abc9c');
				break;

			case 2:
				drawConeSectionFromCenter(trueCanvas.width/2, trueCanvas.height/2, this.angle + this.angularWidth/2, this.angle - this.angularWidth/2, this.blockHeight, this.distFromCenter, '#FFFFFF', 1 - ((this.counter)/this.endTime));
				break;
		}
	};

	this.update = function(dt) {
		switch (this.state) {
			case 0:
				this.counter += dt;
				if (this.counter >= this.initTime) {
					this.state = 1;
					this.counter = 0;
				}
				break;

			case 1:
				this.distFromCenter -= this.iter * dt * settings.scale;
				if (this.distFromCenter * settings.scale <= settings.baseRadius * settings.scale) {
					this.distFromCenter = settings.baseRadius;
					shakes.push({a:this.angle, m:settings.shakeMagnitude});
					this.state = 2;
				}
				break;

			case 2:
				this.counter += dt;
				if (this.counter > this.endTime) {
					blocks.splice(blocks.indexOf(this), 1);
				}
				break;
		}
	};
}