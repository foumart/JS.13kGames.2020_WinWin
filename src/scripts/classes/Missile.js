class Missile {

	constructor(type, x, y, angle, speed, size, pwr, darkColor = "109", lightColor = "32c") {
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
		this.darkColor = "#"+darkColor;
		this.lightColor = "#"+lightColor;
		this.s = 5;
	}

	moveByAngle() {
		let rad = Math.radians(this.angle % 360);
		this.x += this.speed*Math.sin(rad);
		this.y -= this.speed*Math.cos(rad);
	}

	blow(drawExplosion, alpha) {
		drawExplosion(
			missile.x/this.s,
			missile.y/this.s,
			missile.size * missile.pulse / this.s,
			this.lightColor,
			this.darkColor,
			alpha
		);
	}
}
