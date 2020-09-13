//import { Missile } from './Missile.js';

class PlayerCannon extends Missile {
	
	constructor(x, y, angle, speed, size, pwr, id) {
		super(id, x, y, angle, speed, size, pwr);
		this.lightColor = !this.type ? "#ffdd33" : "#cc9900";
		this.darkColor = !this.type ? "#6688bb" : "#ffbb22";
		this.blowSize = 8;
	}

	draw(drawUnit, ctx, id, effectsCtx){
		ctx.save();
		ctx.translate(this.x, this.y);

		effectsCtx.beginPath();
		effectsCtx.globalAlpha = 0.1*(this.pulse>-1?this.pulse:10);
		effectsCtx.arc(this.x/this.s, this.y/this.s+(this.pulse>-1?this.pulse:this.blowSize), 1+Math.random(), 0, Math.PI*2);
		effectsCtx.fillStyle = this.lightColor;
		effectsCtx.fill();
		effectsCtx.closePath();
		effectsCtx.strokeStyle = this.darkColor;
		effectsCtx.stroke();
		effectsCtx.globalAlpha = 1;

		ctx.rotate(Math.radians((this.pulse>-1 ? random()*360 : this.angle) % 360));
		drawUnit(ctx, 0, id, !this.type ? 1+parseInt(pwr/2) : id, 0, 0, 12, true);
		ctx.translate(0,0);
		ctx.restore();

	}
}
