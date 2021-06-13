class PlayerBlob extends Missile {

	constructor(x, y, angle, speed, size, pwr, id, clr1, clr2) {
		super(id, x, y, angle, speed, size, pwr, clr1, clr2);
		this.blowSize = this.type == 3 ? 8 : 12;
		this.currentSize = this.type == 3 ? 5+size/5+pwr/5 : size;
	}

	draw(drawUnit, ctx, effectsCtx, addEffect, random) {

		effectsCtx.globalAlpha = 0.5;
		effectsCtx.beginPath();
		effectsCtx.fillStyle = this.darkColor;
		effectsCtx.arc(this.x/5, this.y/5, this.currentSize/2+this.pwr/5, 0, Math.PI*2);
		effectsCtx.fill();
		effectsCtx.strokeStyle = this.lightColor;
		effectsCtx.lineWidth = 1+this.pwr/2;
		effectsCtx.stroke();
		effectsCtx.closePath();
		effectsCtx.globalAlpha = 1;

		if (this.pulse == -1) {
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.rotate(Math.radians(this.angle % 360));
			drawUnit(ctx, 0, 0, 0, 0, 0, 0 - this.currentSize/2);
			ctx.restore();
		}
	}
}
