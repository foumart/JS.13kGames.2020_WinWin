class PlayerMissile extends Missile {

	constructor(x, y, angle, speed, size, pwr, id, clr1, clr2) {
		super(id, x, y, angle, speed, size, pwr, clr1, clr2);
		this.blowSize = 8;
	}

	draw(drawUnit, ctx, effectsCtx, addEffect, random) {
		effectsCtx.globalAlpha = 0.75;
		effectsCtx.beginPath();
		effectsCtx.fillStyle = this.lightColor;
		effectsCtx.ellipse(this.x/this.s - 1 + random()*2, this.y/this.s + 9, 0.5+random(), 2+random()*3, 0, 0, Math.PI*2);
		effectsCtx.fill();
		effectsCtx.strokeStyle = this.lightColor;
		effectsCtx.lineWidth = 1+this.pwr/2;
		effectsCtx.stroke();
		effectsCtx.closePath();
		effectsCtx.globalAlpha = 1;

		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.pulse > -1 ? random() * 360 : Math.radians(this.angle % 360));
		drawUnit(ctx, 0, 0, 0, 0, 0, 0 - this.size/2*(this.pulse>-1?this.blowSize-this.pulse:0.5), true);
		if (this.pulse > -1) ctx.rotate(random() * 360);
		drawUnit(ctx, 0, 0, 0,  0, 0 - this.size/2*(this.pulse>-1?this.blowSize-this.pulse:0.5), 0, true);
		if (this.pulse > -1) ctx.rotate(random() * 360);
		drawUnit(ctx, 0, 0, 0, 0, this.size/2*(this.pulse>-1?this.blowSize-this.pulse:0.5), 0, true);
		ctx.translate(0,0);
		ctx.restore();

		addEffect({x:this.x, y:this.y+this.size, size:this.size}, this.type, this.type == 7 ? 3 : 4, 2+this.pulse, 2+this.pulse, 4, 15+random()*5);
	}
}
