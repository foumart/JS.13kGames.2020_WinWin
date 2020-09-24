//import { Missile } from './Missile.js';

class PlayerBlob extends Missile {
	
	constructor(x, y, angle, speed, size, pwr, id) {
		super(id, x, y, angle, speed, size, pwr);
		this.lightColor = "#ccccff";
		this.darkColor = "#8888dd";
		this.blowSize = this.type == 3 ? 8 : 12;
	}

	draw(drawUnit, ctx,id, effectsCtx){
		
		if (this.pulse == -1) {
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.rotate(Math.radians(this.angle % 360));
			drawUnit(ctx, 0, id, id, 0, 0, 0 - this.size/2);
			ctx.restore();
		}

		effectsCtx.globalAlpha = 0.5;
		effectsCtx.fillStyle = this.darkColor;
		effectsCtx.beginPath();
		effectsCtx.arc(this.x/5, this.y/5, this.size/2+pwr/5, 0, Math.PI*2);
		effectsCtx.fill();
		effectsCtx.strokeStyle = this.lightColor;
		effectsCtx.lineWidth = 1+pwr/2;
		effectsCtx.stroke();
		effectsCtx.closePath();
		effectsCtx.globalAlpha = 1;
	}
}
