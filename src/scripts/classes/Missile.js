class Missile {

	constructor(type, x, y, angle, speed, size, pwr) {
		this.type = type;
		this.pwr = pwr;
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.speed = speed;
		this.size = size;
		this.currentSize = size;
		this.pulse = -1;
		this.blowSize = 10;
		this.darkColor = "#110099";
		this.lightColor = "#3322cc";
		this.s = 5;
	}

	moveByAngle() {
		let rad = Math.radians(this.angle % 360);
		this.x += this.speed*Math.sin(rad);
		this.y -= this.speed*Math.cos(rad);
	}

	blow(drawExplosion, alpha) {
		drawExplosion(
			missile.x/this.s,// - missile.size/this.s*2,
			missile.y/this.s,// - missile.size/this.s*2,
			missile.size * missile.pulse / this.s,
			['yellow', 'cyan', '#66ccff', 'yellow'][missile.type],
			['red', 'green', '#4499cc', 'red'][missile.type],
			alpha
		);
	}
}
