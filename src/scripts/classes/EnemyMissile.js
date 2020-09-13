//import { Missile } from './Missile.js';

class EnemyMissile extends Missile {
	
	constructor(x, y, angle, speed, size, pwr) {
		super(0, x, y, angle, speed, size, pwr);
	}

	draw(ctx){
		this.currentSize += this.pulse;
		if(this.currentSize < this.size*0.75 || this.currentSize > this.size) this.pulse *=-1;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI*2);
		ctx.fillStyle = "#ff"+(this.speed<5?["6666","7777","8888","9999","aaaa"]:["6666","8888","aaaa","cccc","eeee"])[this.currentSize-7];
		ctx.fill();
		ctx.closePath();
	}
}