class PlayerLaser extends Missile {

	constructor(x, y, angle, speed, size, pwr, id, clr1, clr2) {
		super(id, x, y, angle, speed, size, pwr, clr1, clr2);
		this.blowSize = 6;
		this.img = id==6;
	}

	draw(drawUnit, ctx, id, effectsCtx){
		ctx.save();
		ctx.translate(this.x, this.y - (this.pulse>-1 ? 20 : 0));
		if (this.pulse>-1) ctx.rotate(Math.random()*360);
		drawUnit(ctx, 0, id, id, 0, Math.random()*size*2 - this.size, -Math.random()*this.size*this.size + this.size*this.size, true);
		ctx.rotate(Math.radians(Math.random() * 360));
		ctx.beginPath();
		ctx.globalAlpha = 0.5 + Math.random()/2;
		ctx.fillStyle = this.lightColor;
		ctx.rect(-this.size*Math.random()*3, -this.size*2*Math.random()*4, this.size*3+this.size*Math.random(), this.size*3+this.size*Math.random());
		ctx.fill();
		ctx.closePath();

		if(this.img)
			drawUnit(ctx, 0, id, !this.type ? 1+parseInt(pwr/2) : id, 0, 0, 12, true);

		ctx.globalAlpha = 1;
		ctx.translate(0,0);
		ctx.restore();

		effectsCtx.globalAlpha = 0.2 + Math.random() / 4;
		effectsCtx.beginPath();
		effectsCtx.fillStyle = this.lightColor;
		effectsCtx.rect(this.x/5-Math.random()*pwr/2, this.y/5-Math.random()*5 - (this.pulse==-1 ? 0 : 6), pwr/2, (this.pulse==-1 ? 9 : 3) + Math.random()*5);
		effectsCtx.rect(this.x/5-Math.random()*pwr/4, this.y/5-Math.random()*5 - (this.pulse==-1 ? 0 : 6), pwr/4, (this.pulse==-1 ? 9 : 3) + Math.random()*5);

		effectsCtx.fill();
		effectsCtx.strokeStyle = this.darkColor;
		effectsCtx.lineWidth = 2;
		effectsCtx.stroke();
		effectsCtx.globalAlpha = 1;
		effectsCtx.closePath();
	}
}
