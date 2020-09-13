//import { Missile } from './Missile.js';

class PlayerLaser extends Missile {
	
	constructor(x, y, angle, speed, size, pwr, id) {
		super(id, x, y, angle, speed, size, pwr);
		this.lightColor = "#99ff99";
		this.darkColor = "#ccffcc";
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
		ctx.rect(-this.size*Math.random()*3, -this.size*2*Math.random()*4, this.size*3+this.size*Math.random(), this.size*3+this.size*Math.random());
		ctx.fillStyle = this.lightColor;
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
		if (!this.angle) { // |
			effectsCtx.rect(this.x/5-Math.random()*pwr/2, this.y/5-Math.random()*5 - (this.pulse==-1 ? 0 : 6), pwr/2, (this.pulse==-1 ? 9 : 3) + Math.random()*5);
			effectsCtx.rect(this.x/5-Math.random()*pwr/4, this.y/5-Math.random()*5 - (this.pulse==-1 ? 0 : 6), pwr/4, (this.pulse==-1 ? 9 : 3) + Math.random()*5);
		} else if ((this.angle==-30 && this.type!=8) || (this.angle==30 && this.type==8)) {
			effectsCtx.rect(this.x/5-(this.pulse==-1?6:3)+Math.random()*3, this.y/5-(this.pulse==-1?6:3)+Math.random()*3, 1+Math.random()*3, 1+Math.random()*3);
			effectsCtx.rect(this.x/5+(this.pulse==-1?6:3)+Math.random()*3, this.y/5+(this.pulse==-1?6:3)+Math.random()*3, 1+Math.random()*3, 1+Math.random()*3);
		} else if (this.angle==30 || (this.angle==-30 && this.type==8)) {
			effectsCtx.rect(this.x/5+(this.pulse==-1?6:3)+Math.random()*3, this.y/5-(this.pulse==-1?6:3)+Math.random()*3, 1+Math.random()*3, 1+Math.random()*3);
			effectsCtx.rect(this.x/5-(this.pulse==-1?6:3)+Math.random()*3, this.y/5+(this.pulse==-1?6:3)+Math.random()*3, 1+Math.random()*3, 1+Math.random()*3);
		} else { // ---
			effectsCtx.rect(this.x/5-Math.random()*5 - (this.pulse==-1 ? 0 : 6), this.y/5-Math.random()*pwr/2, (this.pulse==-1 ? 9 : 3) + Math.random()*5, pwr/2);
			effectsCtx.rect(this.x/5-Math.random()*5 - (this.pulse==-1 ? 0 : 6), this.y/5-Math.random()*pwr/4, (this.pulse==-1 ? 9 : 3) + Math.random()*5, pwr/4);
		}
		
		effectsCtx.fill();
		effectsCtx.closePath();
		effectsCtx.strokeStyle = this.darkColor;
		effectsCtx.lineWidth = 2;
		effectsCtx.stroke();
		effectsCtx.globalAlpha = 1;
	}
}
