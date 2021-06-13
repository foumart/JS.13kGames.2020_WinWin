class PlayerLaser extends Missile {

	constructor(x, y, angle, speed, size, pwr, id, clr1, clr2) {
		super(id, x, y, angle, speed, size, pwr, clr1, clr2);
		this.blowSize = 6;
		this.img = id==6;
	}

	draw(drawUnit, ctx, effectsCtx, addEffect, random){
		if (this.pulse==-1) {
			effectsCtx.globalAlpha = 0.2 + random() / 4;
			effectsCtx.beginPath();
			effectsCtx.fillStyle = this.lightColor;
			effectsCtx.rect(this.x/5-random()*this.pwr/2, this.y/5-random()*5, this.pwr/2, 9 + random()*5);
			effectsCtx.rect(this.x/5-random()*this.pwr/4, this.y/5-random()*5, this.pwr/4, 9 + random()*5);
			effectsCtx.fill();
			effectsCtx.strokeStyle = this.darkColor;
			effectsCtx.lineWidth = 2;
			effectsCtx.stroke();
			effectsCtx.closePath();
			effectsCtx.globalAlpha = 1;
		}

		ctx.save();
		ctx.translate(this.x, this.y);
		if (this.pulse>-1) {
			ctx.rotate(random()*360);
		}

		drawUnit(ctx, 0, 0, 0, 0, random()*this.size*2 - this.size, -random()*this.size*this.size + this.size*this.size, true);
		ctx.rotate(Math.radians(random() * 360));
		ctx.beginPath();
		ctx.globalAlpha = 0.5 + random()/2;
		ctx.fillStyle = this.lightColor;
		ctx.rect(-this.size*random()*3, -this.size*2*random()*4, this.size*3+this.size*random(), this.size*3+this.size*random());
		ctx.fill();
		ctx.closePath();

		if(this.img) {
			drawUnit(ctx, 0, 0, !this.type ? 1+parseInt(this.pwr/2) : 0, 0, 0, 12, true);
		}

		ctx.globalAlpha = 1;
		ctx.translate(0,0);
		ctx.restore();
	}
}
