class PlayerMissile extends Missile {

	constructor(x, y, angle, speed, size, pwr, id, clr1, clr2) {
		super(4, x, y, angle, speed, size, pwr, clr1, clr2);
		this.blowSize = 8;
	}

	draw(drawUnit, ctx, id, effectsCtx){
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.pulse > -1 ? Math.random() * 360 : Math.radians(this.angle % 360));
		drawUnit(ctx, 0, id, id, 0, 0, 0 - this.size/2*(this.pulse>-1?this.blowSize-this.pulse:0.5), true);
		if (this.pulse > -1) ctx.rotate(Math.random() * 360);
		drawUnit(ctx, 0, id,id,  0, 0 - this.size/2*(this.pulse>-1?this.blowSize-this.pulse:0.5), 0, true);
		if (this.pulse > -1) ctx.rotate(Math.random() * 360);
		drawUnit(ctx, 0, id, id, 0, this.size/2*(this.pulse>-1?this.blowSize-this.pulse:0.5), 0, true);
		ctx.translate(0,0);
		ctx.restore();

		effectsCtx.beginPath();
		effectsCtx.globalAlpha = 0.75;
		effectsCtx.fillStyle = this.lightColor;
		//effectsCtx.arc(this.x/this.s + (this.pulse>-1?-4+Math.random()*8:0), this.y/this.s + 8 + (this.pulse>-1?-4+Math.random()*8:0), 2+Math.random()*2, 0, Math.PI*2);
		effectsCtx.arc(this.pulse>-1?-4+Math.random()*8:this.x/size, this.pulse>-1?-4+Math.random()*8:this.y/size+8, 2+Math.random()*2, 0, Math.PI*2);
		effectsCtx.fill();
		effectsCtx.strokeStyle = this.darkColor;
		effectsCtx.stroke();
		effectsCtx.globalAlpha=1;
		effectsCtx.closePath();
	}
}
