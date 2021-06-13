class PlayerCannon extends Missile {

	constructor(x, y, angle, speed, size, pwr, id, clr1, clr2) {
		super(id, x, y, angle, speed, size, pwr, clr1, clr2);
		this.blowSize = 8;
	}

	draw(drawUnit, ctx, effectsCtx, addEffect, random) {
		
		let pulsing = this.pulse > -1 ? this.pulse : this.blowSize;
		effectsCtx.fillStyle = this.lightColor;
		for (let count = 0; count <= this.pwr; count ++) {
			effectsCtx.globalAlpha = 0.1 * pulsing * (0.1+(6-count)/6);
			effectsCtx.beginPath();
			effectsCtx.arc(this.x/this.s, this.y/this.s + pulsing + count*random(), 1 + this.pwr/(6-count)/2, 0, Math.PI*2);
			effectsCtx.fill();
			effectsCtx.strokeStyle = this.darkColor;
			effectsCtx.stroke();
			effectsCtx.closePath();
			if (this.type) break;
		}
		
		effectsCtx.globalAlpha = 1;

		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(Math.radians((this.pulse>-1 ? random()*360 : this.angle) % 360));
		drawUnit(ctx, 0, 0, !this.type ? 1+parseInt(this.pwr/2) : 0, 0, 0, 12, true);
		ctx.translate(0,0);
		ctx.restore();

	}
}
