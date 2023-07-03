// WinWin

//'use strict';

// elements
let menu = document.getElementById("menu");
let game = document.getElementById("game");
let titletop = document.getElementById("titletop");
let titlebottom = document.getElementById("titlebottom");
let overlay = document.getElementById("overlay");
let central = document.getElementById("central");
let controls = document.getElementById("controls");

let bgrCanvas = document.getElementById("bgrCanvas");
let gameCanvas = document.getElementById("gameCanvas");
let effectsCanvas = document.getElementById("effectsCanvas");

let bgrContext = bgrCanvas.getContext("2d");
let gameContext = gameCanvas.getContext("2d");
gameContext.imageSmoothingEnabled = false;
let effectsContext = effectsCanvas.getContext("2d");

let leftBtn = document.getElementById("leftBtn");
let centralBtn = document.getElementById("centralBtn");
let rightBtn = document.getElementById("rightBtn");

let healthbar = document.getElementById("healthbar");
let shieldbar = document.getElementById("shieldbar");

let uiFsc = document.getElementById("uiFsc");
let uiSnd = document.getElementById("uiSnd");

let baseWidth = 1080;
let baseHeight = 1920;
let areaHeight = 1620;

let width;
let height;

let state = 0;
let menuID = 0;
let menuCount;

let fff;
let fullscreenCanceled;
let standalone;

let monet = 0;// monetization
let master;
let perfect;

// ship properties
let shipRadius;
let shipSpeed;
let missileCurrentCount = 0;
let missileInterval;// interval between shots
let missileDamage;
let missileSpeed;
let missileSize;
let changeTime = 0;
let changeTimeLimit = 10;

let health;
let shield;
let healthMax;
let shieldMax;
let pwr;// current weapon level

let shieldGain = 0;
let weaponType = 0;
let secondaryType = 0;
let globalSpeed = 1;
let invulnerable;// = 100;

let shipX = gameCanvas.width / 2;
let shipY = gameCanvas.height * 0.9;

let event = "mousedown";
let eventEnd = "mouseup";
if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
	event = "touchstart";
	eventEnd = "touchend";
}

let rightPressed = false;
let leftPressed = false;
//let upPressed = false;
//let downPressed = false;
let spacePressed = false;
let constantShoot = false;

// general
let running = true;
let playing;
let step = 0;
let slowing = 0;
let slowCount = 0;

let online = (window.location.protocol == "http:" || window.location.protocol == "https:");

let size = 5;// value in Missile.js as well
let starSize;
let starSpeed;
let level = 1;
let complete = 0;
let score = 0;
var gameOver = 0;

// itteration objects
let missiles = [];
let missile;//tmp object
let enemies = [];
let enemy;//tmp object
let powerups = [];
let powerup;//tmp object
let effects = [];
let effect;//tmp effect
let allSprites = [];
let enemyMissiles = [];

let arrays,
	colorArr,
	indexArr,
	powerArr,
	shipradiusArr,
	shipspeedArr,
	missilespeedArr,
	missilesizeArr,
	missileintervalArr,
	missiledamageArr,
	healthmaxArr,
	healthmaxiniArr,
	shieldmaxArr,
	shieldmaxiniArr,
	poweredArr,
	killedArr;

let powerupsArray = shuffle([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,5,6]);
let startArray = shuffle([0,1,0,0,3,0,0,2,0,0,0,4,5]);

function shuffle(array) {
	let currentIndex = array.length, temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

let darkColors = ['f32', 'c60', 'cfc', 'ccf', 'f94', 'f00', 'f00', '6f6', 'd6a','ff0', '36f', 'f00', 'f93', '420'];
let lightColors = ['cb6', 'f92', '9f9', '88d', '952', 'ff0', 'ff0', 'ff0', 'f9e', 'f00', '9cf', 'f90', 'f24', '840'];

let shipWeapons = [
	'Cannon',
	'Gun',
	'Laser',
	'ShockWave',
	'Rocket',
	'Blaster',
	'Zapper',
	'Plasma',
	'Ion',
	'Fusion',
	'Beam',
	'Railgun'
];

let shipTitles = [
	'Raptor', 'Rogue', 'Viper', 'Valkyre', 'Behemoth', 'Hunter', 'Explorer', 'Scout', 'Wraith', 'Specter', 'Phoenix', 'Coil'
];

let shipNames =              ['A', 'G', 'L', 'Y', 'V', 'T', 'X', 'S', 'W', 'R', 'F', 'C'];

function resetStats(arrays) {//    1    2    3    4    5    6    7    8    9    10   11
	arrays = [//              ^    ^^   |    ()   A    8    |    /\
		indexArr =           [1,   4,   3,   2,   5,   11,  13,  6,   12,  9,   3,   8  ],  // 16
		colorArr =           [1,   1,   3,   1,   4,   2,   4,   3,   2,   4,   1,   1  ],  // 4

		powerArr =           [1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1  ],
		shipradiusArr =      [70,  75,  60,  70,  80,  70,  72,  60,  75,  80,  78,  78 ],
		shipspeedArr =       [6,   5,   5.5, 5,   4,   4.5, 6,   6.5, 4.5, 3.5, 5,   7  ],
		missilespeedArr =    [20,  15,  40,  12,  3,   20,  25,  22,  9,   16,  6,   18 ],
		missilesizeArr =     [5,   3,   2.5, 8,   12,  6,   4,   5,   5,   7,   10,  7  ],
		missileintervalArr = [10,  18,  3,   30,  40,  20,  15,  25,  12,  25,  35,  16 ],
		missiledamageArr =   [1,   1.5, 0.5, 3,   5,   2,   1.5, 2.5, 2.75,2.25,3,   2  ],
		healthmaxArr =       [75,  95,  60,  80,  100, 85,  80,  70,  90,  75,  90,  105],
		healthmaxiniArr =    [75,  95,  60,  80,  100, 85,  80,  70,  90,  75,  90,  105],
		shieldmaxArr =       [10,  15,  10,  25,  15,  20,  30,  5,   0,   15,  20,  15 ],
		shieldmaxiniArr =    [10,  15,  10,  25,  20,  20,  30,  5,   0,   15,  20,  15 ],
		poweredArr =         [0,   0,   0,   0,   0,   0,   0],
		killedArr =          []
	];
	return arrays;
}
arrays = resetStats();

function updateStats(){
	if (monet && !powerArr[11]) powerArr[11] = 1;
	pwr =             powerArr[weaponType];
	shipRadius =      shipradiusArr[weaponType];
	shipSpeed =       shipspeedArr[weaponType];
	missileSpeed =    missilespeedArr[weaponType];
	missileSize =     missilesizeArr[weaponType];
	missileInterval = missileintervalArr[weaponType];
	missileDamage =   missiledamageArr[weaponType];
	healthMax =       healthmaxArr[weaponType];
	health =          healthmaxArr[weaponType];
	shield =          shieldmaxArr[weaponType];
	shieldMax =       shieldmaxArr[weaponType];

}
updateStats();

let len;

let spritePixels = [];
let spriteColors = [
	"1d202c585a61878789b8b8b8c6c6c6cececed5d5d5",
	"165b741e78983185a53da2c8aae0f30c4154e5f3f8",
	"6e003978074e8e0a5e9b2d68c96b79db3870ff82a5",
	"1674301e984031a5533dc865aaf3be0c5420e5f8ea",
	"1d6a2f643d166c8d52725419b19a65b5c27ae0dca9",
	"6e003978074e8e0a5e9b2d68c96b79db3870ff82a5",
];
let ship1 = "@@@@@H@@@@@Y@@@@Hc@@@@HL@@@@Yi@@@@ai@@@HKm@@@HK}\`@@Ysb\`@@Ya}Y@@YamY@HcVcV@Hca}V@HbamVAqRJZYNXcsAQcaddMX\\l}\tHcYl}L@cscm\\@X\\e\\C@HckC@@@Y\\@@@@XC@@";
let ship2 = "@@@@@P@@@@@P@@@@@J@@@@Pa@@@@Jt@@@Paf@@BbvT@PUtfJ@jJvTPP|bfBPZ}YV@PboYV@PqwaNRJiobN}My\tNRJiobV@PqwYfBPboJvTPZ}UtfJPlWavT@JlJtf@@bUaR@@PlR@@@@R@@";
let spriteData =  "@@@@@@@@@@@@@@hD@@@@~u@@@@|g@@@X|gC@@P|gB@@P}oB@@K~wY@@Z~wS@@ZvwS@@YvwK@@YunK@@YunK@@ZtfS@@ZtfS@@KlfY@@Pk^B@@\`k]D@@@k]@@@@c]@@@@\`D@@@@@@@@@@@@@@";
for (let i = 0; i < 23; i++){
	spriteData += i%2==0 || i==5 ? ship1 : ship2;
}
// background stars
let bgrSmall = [];
let bgrMiddle = [];
let bgrLarge = [];
for (let i = 0; i < 50; i ++) {
	bgrSmall.push([random()*baseWidth, random()*areaHeight, random()*2]);
	bgrMiddle.push([random()*baseWidth, random()*areaHeight, random()*3]);
	bgrLarge.push([random()*baseWidth, random()*areaHeight, random()*4]);
}

function moveStar(star) {
	star[1] += starSize * starSpeed + star[2] * starSpeed;
	if(star[1] > areaHeight) star[1] = -5;
	bgrContext.fillStyle = "#fff";
	bgrContext.fillRect(star[0], star[1], starSize, starSize);
}

function moveBgr() {
	starSize = 1;
	starSpeed = playing ? 1 - (slowCount*0.035) : 0.3;
	bgrSmall.forEach(moveStar);
	starSize = 2;
	bgrMiddle.forEach(moveStar);
	starSize = 3;
	bgrLarge.forEach(moveStar);
}

// initialize sprites data
let sprites = [];
let spritesMirrored = [];
let images = [];
let imagesMirrored = [];

let stages = [
	[5, 10],
	[50, 10]
];

function init(){
	buffer();
	generateMenu();
	generate();
	resize();
	showMenu();
	draw();

	window.addEventListener("resize", resize);
	overlay.addEventListener(event, pickMenu, {passive: true});
	leftBtn.addEventListener(event, leftTap, {passive: true});
	rightBtn.addEventListener(event, rightTap, {passive: true});
	centralBtn.addEventListener(event, centerTap, {passive: true});
	window.addEventListener(eventEnd, checkTapEnd);

	document.addEventListener("fullscreenchange", fullscreenCheck);
	if (standalone && !fff && !fullscreenCanceled) {
		console.log("[Event] Requesting Fullscreen mode...");
		toggleFullscreen();
	}

	document.addEventListener("keydown", keyDownHandler);
	document.addEventListener("keyup", keyUpHandler);

	//requestAnimationFrame(checkMonetization);
	monet = 1;
	updateStats();
	central.innerHTML = "";
	showMenu(1);

	standalone = window.matchMedia('(display-mode: standalone)').matches;
	if(standalone) console.log("[Event] Game is running as Standalone PWA.");
	if(!FX.initialized) FX.start();
	overlay.focus();
}

// SoundFX, sound effects
let FX = (function(){
	let audioContext;
	let oscTypes = ["sawtooth", "square", "triangle", "sine"];
	let initialized;
	// start frequency HZ
	// frequency change in time + / -
	// length (number of frames taking to play the sound)
	// oscillator type 0 - 3
	// starting delay (milliseconds of timeout before the sound starts)
	// volume 0.0 - 1.0
	function playSound(_freq, _incr, _length, _type, _delay, _vol){

		if(!audioContext) return;

		let oscillator = audioContext.createOscillator(); // instantiate a new oscillator
		oscillator.type = oscTypes[_type];

		let modulationGain = audioContext.createGain(); // instantiate modulation for sound volume control
		modulationGain.gain.value = 0; // set the initial volume to 0 to prevent an ugly tick noise at the beginning

		let i = 0;// frame counter
		if(_delay) setTimeout(playTune, _delay); else playTune();

		function playTune(){
			if(!_vol) return;
			if(!i){
				oscillator.connect(modulationGain).connect(audioContext.destination);
				oscillator.start();
				// make sure to stop the sound from playing in the background (when the tab is inactive)
				oscillator.stop(audioContext.currentTime+(_length-i)/60);
			} else modulationGain.gain.value = (i<4?0.05*i*i:1-i/_length) * _vol * d.volume;
			oscillator.frequency.value = _freq + _incr * i;
			if(i++ < _length) requestAnimationFrame(playTune);
		}
	}

	let d = {volume:1, initialized:initialized, start:function(){
		try {
			audioContext = new (
				window.AudioContext ||
				window.webkitAudioContext ||
				window.mozAudioContext ||
				window.msAudioContext ||
				window.oAudioContext
			)();
			this.initialized = 1;
			console.log("[Event] AudioContext initialized");
		} catch(e){
			console.log("[Warning] AudioContext not found",e);
		}
	}};

	// stage starting sound, w:length
	d.d=function(w,d){playSound(90, 9, 10+w*10, 1, d||0, 0.05); playSound(30, 3, 20+w*10, 1, d||0, 0.1); playSound(90, 5, 20+w*10, 2, d||0, 0.2)};

	// 0:bunny die, 1-4:bunny jump
	d.b=function(w){
		playSound(220, -9 * (w*w||1), 40/w|0||1, 2, w*60, 0.2 - (w?0.14+w/80:0));
		playSound(90*(w||1), -9, 9, 1, w*60, 0.2 - (w?0.14+w/80:0));
	};

	// level complete or super bunny jump
	d.c=function(w,l,d){playSound(300-90*w*w, 9*w, (l||8)*w, 2-(w/2|0), (d||0)+(w-1)*(l/2||8), 0.1-w*0.02);};

	// custom //_type, _freq, _incr, _length, _delay, _vol
	d.p=function(w,f,i,l,d,v){playSound(f||120, i||10, l||50, w||0, d, v||0.1);};

	return d;
})();

/*function checkMonetization() {
	if(document.monetization){
		console.log("[Event] Web Monetization state:", document.monetization.state);
		if(document.monetization.state == "started") monet = 1;
		else document.monetization.addEventListener("monetizationstart",
			evt => {
				console.log("[Event] Monetization event:", document.monetization.state);
				if (!monet) {
					monet = 1;
					updateStats();
					central.innerHTML = "";
					showMenu(1);
				}
			}
		);
	} else {
		//console.log("[Event] Monetization not found");
		if(step < 100)
			requestAnimationFrame(checkMonetization);
	}
}*/

function buffer() {
	let i;
	spriteData.replace(/./g, (a) => {
		i = a.charCodeAt();
		spritePixels.push(i&7);
		spritePixels.push((i>>3)&7);
	});

	len = spritePixels.length / 288;

	for (i = 0; i < len; i++) {
		let data = spritePixels.splice(0, 288);
		spritesMirrored.push(data.slice(0));
		sprites.push(data.reverse());
	}
	for (i = 0; i < len; i++) {
		let colorSprites = [];
		let colorSpritesMirrored = [];
		for (let j = 0; j < spriteColors.length; j++) {
			colorSprites.push(drawImage(i, j, spriteColors, false, true, true));
			colorSpritesMirrored.push(drawImage(i, j, spriteColors, true, false, true));
		}
		images.push(colorSprites);
		imagesMirrored.push(colorSpritesMirrored);
	}
}

function drawImage(id, clr, colors, z, r, a, w) {
	let sprite = getSpriteCanvas(12, 24, a);
	let WW = 12;
	let HH = 24;
	for(let k = r ? HH : 0; r ? k > 0 : k < HH; r ? k-- : k++) {
		for(let l = 0; l < WW; l++) {
			w = (z ? spritesMirrored : sprites)[id][(r ? HH-k : k) * WW + l];
			if (w) {
				sprite[1].fillStyle = "#"+colors[clr].substr(6 * (w - 1), 6);
				sprite[1].fillRect(l, k, 1, 1);
				sprite[1].fillRect(l, k, 1, 1);
			}
		}
	}
	return sprite[0];
}

function getSpriteCanvas(w, h, add){
	let canvas, context;
		canvas = document.createElement('canvas');
		canvas.width = w;
		canvas.height = h;
		context = canvas.getContext('2d');
		if (add) {
			if (menu.children.length == 10) canvas.style.marginTop = '-20px';
			if (menu.children.length > 152) {
				menu.insertBefore(canvas, allSprites[allSprites.length-1].canvas);
			} else {
				menu.appendChild(canvas);
			}
			allSprites.push(context);
			canvas.className = "pixelated list";
		}

	return [canvas, context];
}

/**
 * context
 * type
 * type
 * color
 * animation
 * x
 * y
 * reversed
 * size
 */			
function drawUnit(ctx, i, id, clr, spd, x, y, z, s) {
	let c = i>8 ? -1 : 1;
	let S = s || 1;
	let X1 = s ? x-12*S : x-6;
	let X2 = s ? x : x-6;
	let Y1 = y + (!spd ? s==1?0:i<7?S+1:id==7?-2:2 : ((step/spd)|0)%4==0?S:((step/spd)|0)%2==0?-S:0);
	let Y2 = y + (i>7&&id<8 ? s==1?2:S+2 : i<8&&id>6 ? s==1?2:S*2+2 : s==1?0:i>5?-2:2) + (!spd ? 0 : ((step/spd)|0)%4==0?-S:((step/spd)|0)%2==0?S:0)-1;
	if (!spd && clr && clr != 2) {
		Y1 += leftPressed?2:rightPressed?-2:0;
		Y2 += leftPressed?-2:rightPressed?2:0;
	}
	ctx.save();
	ctx.scale(1, c);
	ctx.drawImage((z || i == 5 || i == 11) && i != 8 ? images[id][clr] : imagesMirrored[id][clr], X1, Y1*c, 12*S, 24*c*S);
	ctx.drawImage((z || i == 5 || i == 11) && i != 8 ? imagesMirrored[id][clr] : images[id][clr], X2, Y2*c, 12*S, 24*c*S);
	ctx.restore();
}

function drawShip() {
	gameContext.globalAlpha = 0.25;
	gameContext.beginPath();
	gameContext.fillStyle = invulnerable && step%2==0 ? '#f00': '#00f';
	gameContext.arc(shipX, shipY, shipRadius, 0, 2 * Math.PI, false);
	gameContext.fill();
	gameContext.lineWidth = 5;
	gameContext.strokeStyle = invulnerable && step%2==0 ? '#f03': '#03f';
	gameContext.stroke();
	gameContext.closePath();
	gameContext.globalAlpha = (invulnerable?(step/2|0)%2?0.25:0.75:1);
	drawUnit(gameContext, weaponType, indexArr[weaponType], colorArr[weaponType], 0, shipX, shipY - shipRadius + (weaponType>8 ? 20 : 0), indexArr[weaponType]>6, size);
	gameContext.globalAlpha = 1;
	// draw explosions if player ship has been destroyed
	if (health <= 0 && invulnerable%2 == 0) {
		addEffect({x:shipX, y:shipY, size:shipRadius}, 12, 9+random(5), 4);
	}
}

function drawShipMenu(container, i = 1, id = 1, clr = 3) {
	let newImage;
	newImage = getSpriteCanvas(24, 23);
	newImage[0].className = "image pixelated";
	container.appendChild(newImage[0]);
	drawUnit(newImage[1], i, id, clr, 0, 12, 0, id>6, 1);
	return newImage;
}

// MENU stuff __________________

function transitionMenu(top, bottom){
	for(let i = 0; i <  menu.children.length; i++){
		if (i > menu.children.length/2-5)
			menu.children[i].style.transform = `translateY(${top}px)`;
		else
			menu.children[i].style.transform = `translateY(${bottom}px)`;
	}
	titletop.style.transform = `translateY(${bottom<-460?bottom-90:!bottom?top:bottom+310}px)`;
	titlebottom.style.transform = `translateY(${top>400?top+210:!top?bottom:top-190}px)`;
}
function showMenu(skip){
	state = 0;
	transitionMenu(skip?90:190, skip?-235:-335);
	if (!skip) setTimeout(
		() => {
			titletop.style.zIndex = 1;
			titlebottom.style.zIndex = 1;
			transitionMenu(110, -250);
		}, 750
	);
	setTimeout(
		() => {
			transitionMenu(550, -510);
/*
let htmlTemp = '';
for(let k = 0; k < 20; k++) {
	for(let j = 0; j < 4; j++) {
		for(let i = 0; i < 6; i++) {
			htmlTemp += `<div class=image style=left:${160*i+60}px;margin-top:${k*900+200*j}px>`;
			htmlTemp += `<span style=margin-top:125px;margin-left:10px;></span>`;
			htmlTemp += "</div>";
		}
	}
}
central.innerHTML = htmlTemp;
central.style.height = "800px";
central.style.overflow = "auto";

let tempDivs = central.getElementsByTagName('div');
console.log(tempDivs);
for(let k = 0; k < 20; k++) {
	for(let j = 0; j < 4; j++) {
		for(let i = 0; i < 6; i++) {
			//drawUnit(gameContext, enemy.type, enemy.type, enemy.color, enemy.animation, enemy.x, enemy.y - enemy.size/2, true, size);
			let newImage;
			newImage = getSpriteCanvas(24, 23);
			newImage[0].className = "image pixelated";
			tempDivs[k*24+j*6+i].appendChild(newImage[0]);
			drawUnit(newImage[1], k, j*6+i, 2, 0, 12, 0, true, 1);//

			tempDivs[k*24+j*6+i].children[0].innerHTML = k + "/" + (j*6+i);
		}
	}
}
return;*/

			let brk = '<br>';
			let html = "Pick a ship: &nbsp;<span id=shipname>" + shipTitles[weaponType] + "</span>" + brk + brk;
			let cut;
			for(let j = 0; j < 2; j++) {
				for(let i = 0; i < 6; i++) {
					let image = `<img class='brokenimage smalltext' src='./' width=60 height=60>`;
					html += `<div class=image style=left:${160*i+60}px;margin-top:${j?220:0}px>`;
					if (!powerArr[j*6 + i]) {
						if(!cut) cut = j*6 + i;
						html += image.replace("./'", `' style=margin-top:36px;margin-left:36px; alt=' &nbsp; &nbsp; &nbsp;${shipNames[j*6+i]}\n&nbsp;.png'`) + image + image;
					}
					html += "</div>";
				}
			}
			html += "<div style=position:relative;top:140px;color:"+(monet?"lightblue":"grey")+";float:right;font-size:32px;line-height:10px>"+brk+brk+"*"+brk+"&nbsp;Coil</div>";
			html += "<div style=top:650px><span style='color:red'>***</span>"+brk;
			html += "Error: File "+(cut?shipNames[cut]+".png":monet?'twitter.soc':'coil.sub')+" not found.</div>";

			html += "<div style=top:1275px;font-size:28px;color:#666>"+"Developed by Noncho Savov. JS13K Games 2020. &nbsp;<a href=https://www.foumartgames.com/ target=_blank>@FoumartGames</a></div>";

			central.innerHTML = html;

			let divs = central.getElementsByTagName('div');
			for(let i = 0; i < powerArr.length; i++) {
				if (powerArr[i]) {
					drawShipMenu(divs[i], i, indexArr[i], colorArr[i]);
				}
			}
			if (!monet)
				divs[11].className = "saturate";

			setTimeout(() => {
				if (!menuCount) menuCount = 1;
				state = 1;
				animateMenuCursor();
			}, 100);

		}, !skip ? 1350 : 500
	);
}

function animateMenuCursor(){
	gameContext.clearRect(0, 0, bgrCanvas.width, bgrCanvas.height);
	if(state == 1) {
		if (menuCount) {
			menuCount ++;
			let k = menuID < 6 ? menuID : menuID - 6;
			let l = menuID < 6 ? 664 : 880;
			gameContext.beginPath();
			gameContext.rect(70+k*160, l, 156, 156);
			gameContext.strokeStyle = menuCount%2==0?'#fff':'#888';
			gameContext.setLineDash([menuCount%(menuCount%2)==0, menuCount%(menuCount%3), menuCount%(menuCount%4)]);
			gameContext.lineWidth = menuCount%2==0?4:6;
			gameContext.stroke();
			gameContext.closePath();
			requestAnimationFrame(animateMenuCursor);
		}
	} else gameContext.setLineDash([]);
}

function pickMenu(evt) {
	reloadOnGameOver();
	if (evt) {
		if(evt.target) {
			let map = {
				btnl: 37,
				btnr: 39,
				esc: 27,
				ent: 13
			};
			if(map[evt.target.id]){
				triggerKey(map[evt.target.id]);
				return;
			}
			if(evt.target.className != "image pixelated") return;
		}
	}
	if (state == 1) {
		let weaponCheck = evt != -1 && evt ? Array.from(evt.target.parentNode.parentNode.children).indexOf(evt.target.parentNode)-3 : menuID;
		if (evt && weaponType != weaponCheck) {
			if(powerArr[weaponCheck]) {
				weaponType = weaponCheck;
				menuID = weaponType;
				updateMenuID();
				updateStats();
			}
			return;
		}
		weaponType = menuID;
		updateStats();
		state = 2;
		let bar = (limit, total = 8) => {
			let lmt = limit;
			let dif = total - limit;
			let str = '[';
			if(!lmt) str += '';
			else while(lmt>0) {
				lmt --;
				str += '[';
			}
			str += ']';
			while(dif>0) {
				dif --;
				str += '_';
			}
			str += '] ';//+limit;//+' / '+total;
			return str;
		};
		let brk = '<br>';
		let html = `<div class=hugetext>SHIP:&nbsp;<span id=shipname>${shipTitles[weaponType]}</span>
						<div style=position:relative;width:420px;float:right;text-align:center>${shipWeapons[weaponType]+brk}<span style=top:40px;position:relative;font-size:50px>Level: ${powerArr[weaponType]}</span></div>
					</div>`;
		html += "<div style=line-height:52px;top:25px;>______" + brk + brk;
		html += "Health: "+bar((healthMax-60) / 5) + brk;
		html += "Shield: "+bar(1 + shieldMax / 5) + brk;
		html += "&nbsp;Speed: "+bar((shipSpeed-3)*2) + brk;
		html += "&nbsp; Size: " + bar(1+parseInt((shipRadius-50) / 6));
		html += "</div>";

		html += "<div style=left:50px;top:650px id='btnl'>[ < ]</div><div style=top:650px;left:174px id='btnr'>[ > ]</div><div style=top:650px;left:297px id='esc'>[ ESC ]</div>";
		html += "<div style=left:50px;top:700px; id='ent'>[ SPACE / ENTER ]</div>";
		html += "</div>";

		central.innerHTML = html;

		let canvas = drawShipMenu(central, weaponType, indexArr[weaponType], colorArr[weaponType])[0];
		canvas.style.left = "58%";
		canvas.style.marginTop = "300px";
		canvas.style.width = "400px";
		canvas.style.height = "400px";
	} else
		hideMenu();
}

function hideMenu(){
	titletop.style.opacity = 0;
	titlebottom.style.opacity = 0;
	transitionMenu(0, -120);
	central.innerHTML = "";
	state = 3;
	setTimeout(
		()=>{
			transitionMenu(840, -960);
			generateButtons();
			controls.style.display = 'block';
			controls.style.bottom = 0;
			generate();
			playing = true;
			setTimeout(hideTitle, 250);
		}, 250
	);
}

function hideTitle(){
	menu.style.opacity = 0;
	overlay.style.opacity = 0;
	setTimeout(startGame, 250);
}

function startGame() {
	playing = true;
	state = 4;
	effectsCanvas.style.opacity = 1;
	bgrCanvas.style.opacity = 1;
	controls.style.display = 'block';
	updateUI();
	//FX.d(5, 1);
}

function updateUI() {
	healthbar.style.width = 100 * (health / healthMax) + '%';
	shieldbar.style.width = 99 * (shield / shieldMax) + '%';
}

function generateMenu() {
	let titleArr = [
		[[2,2], [4,4]],
		[[-1,6], [1,4], [3,2], [5,4], [7,6], [9,4], [11,2]],
		[[-1,6], [1,4], [3,2]],
		[[-1,6], [1,4], [3,2], [5,4], [7,6], [9,4], [11,2]]
	];
	drawTitle(titletop, titleArr, 125, 810, 20, "t r");
	drawTitle(titlebottom, titleArr, 125, 810, 20, "t b");
}

function generateButtons() {
	drawTitle(leftBtn, [[[2,4], [0,6], [2,8]]], 100, 30, 20, "t b");
	drawTitle(rightBtn, [[[2,4], [4,6], [2,8]]], 150, 30, 20, "t b");
	drawTitle(centralBtn, [[[4,2], [6,4], [2,4]]], 60, 70, 20, "t r");
}

function drawTitle(container, titleArr, baseLeft, baseTop, scale, className){
	let piece;
	let segment;
	let pieceWidth;
	for(let i = 0; i < titleArr.length; i++){
		pieceWidth = 0;
		for(let j = 0; j < titleArr[i].length; j++){
			segment = titleArr[i][j];
			if(pieceWidth < 2+(segment[0]||0)) pieceWidth = 2+(segment[0]||0);
			piece = document.createElement("div");
			container.appendChild(piece).className = className;
			piece.style.width = "40px";
			piece.style.height = "40px";
			piece.style.left = (baseLeft+((segment[0]*scale)||0))+"px";
			piece.style.top = (baseTop+((segment[1]*scale)||0))+"px";
		}
		baseLeft += (pieceWidth*scale) + scale;
	}
}
// ____________________________________


function checkTapEnd(evt) {
	if (evt.target == leftBtn) leftPressed = false; else if (evt.target == rightBtn) rightPressed = false;
	else if (evt.offsetX < 420) leftPressed = false; else if (evt.offsetX > 680) rightPressed = false;
		else spacePressed = false;
}

function fullscreenCheck(e){
	fff = document.fullscreenElement;
}

// fullscreen handler
// -----------------
function toggleFullscreen(e){
	if(e==1) fullscreenCanceled = fff;
	let d = document.documentElement;
	if (!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement))
		(d.requestFullscreen || d.mozRequestFullScreen || d.webkitRequestFullScreen ||
			d.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)).call(d);
	else if(document.exitFullscreen) document.exitFullscreen();
	else if(document.mozCancelFullScreen) document.mozCancelFullScreen();
	else if(document.webkitCancelFullScreen) document.webkitCancelFullScreen();
	uiFsc.innerHTML = fff ? '⮔' : '';
}

function mute(){
	if(FX.volume){
		FX.volume=0;
		uiSnd.innerHTML = '🔈';
	} else {
		FX.volume=1;
		FX.c(3,2);
		uiSnd.innerHTML = '🔉';
	}
}

function resize(e){
	resizeStage(e);
	resizeStage(e);
}
function resizeStage(e){
	width = document.documentElement.clientWidth;
	height = document.documentElement.clientHeight;
	game.style.transform = "scale("+getScale()+")";
	game.style.width = baseWidth + "px";
	game.style.height = baseHeight + "px";
	game.style.top = ((height-baseHeight)/2)+"px";
	game.style.left = ((width-baseWidth)/2)+"px";

	effectsCanvas.style.width = baseWidth + "px";
	effectsCanvas.style.height = areaHeight + "px";
}

function getScale(h, w){
	h = (height/baseHeight);
	w = (width/baseWidth);
	return h < w ? h : w;
}

function leftTap() {
	leftPressed = true;
}

function centerTap() {
	spacePressed = true;
	constantShoot = !constantShoot;
}

function rightTap() {
	rightPressed = true;
}

function updateMenuID(plusOrMinus = 1){
	if(!powerArr[menuID] || (menuID==11 && !monet)) menuID += plusOrMinus;
	if(menuID < 0) menuID = powerArr.length+(menuID==11 && !monet?1:0) + menuID;
	if(menuID > powerArr.length-1) menuID = menuID-powerArr.length+(menuID==11 && !monet?1:0);
	if(!powerArr[menuID]) menuID = 0;
	let shipname = document.getElementById('shipname');
	if (shipname)
		shipname.innerHTML = shipTitles[menuID];
}

function reset(nextLevel) {
	if (nextLevel) level ++;
	playing = false;
	central.innerHTML = '';
	titletop.style.opacity = 1;
	titlebottom.style.opacity = 1;
	menu.style.opacity = 1;
	overlay.style.opacity = 1;
	controls.style.display = 'none';
	effectsCanvas.style.opacity = 0;
	bgrCanvas.style.opacity = 0.5;
	showMenu(1);
}

function togglePause(forcePause) {
	if(running || forcePause)
		running = false;
	else if(!forcePause) {
		running = true;
		requestAnimationFrame(draw);
	}
}

function keyDownHandler(e) {//console.log(state, e.keyCode);
	triggerKey(e.keyCode);
}

function triggerKey(key) {
	// F
	if(key == 70){
		toggleFullscreen();
	}

	// ENTER/ SPACE
	if(key == 13 || key == 32) {
		reloadOnGameOver();
		if(state == 1 || state == 2)
			pickMenu();
	}

	if (gameOver) return;

	// R
	if(state == 5 || key == 82) {
		if(!running) togglePause();
		else if(key == 82 || key == 13 || key == 80 || key == 27) {
			reset(state == 5);
		}
		return;
	}

	// 1
	if(key == 49) {
		if(pwr<6) {
			pwr ++;
			powerArr[weaponType] ++;
			//console.log("pwr:"+pwr);
		}
		updateStats();
	}

	// 2
	if(key == 50) {
		changeWeapons();
	}

	/*if(key == 51) {
		debugger;
	}*/

	// SPACE
	if(key == 32 && state == 4) {
		spacePressed = true;
	}

	// C
	if(key == 67 && state == 4) {
		constantShoot = !constantShoot;
	}

	// D - right
	if(key == 39 || key == 68) {
		if(state<3) {
			menuID ++;
			updateMenuID();
			updateStats();
			if(state==2) {state=1;pickMenu();}
		} else
			rightPressed = true;
	}

	// A - left
	if(key == 37 || key == 65) {
		if(state<3) {
			menuID --;
			updateMenuID(-1);
			updateStats();
			if(state==2) {state=1;pickMenu();}
		} else
			leftPressed = true;
	}

	// W - up
	if(key == 38 || key == 87) {
		if(state<3) {
			menuID -=6;
			updateMenuID(-1);
			updateStats();
			if(state==2) {state=1;pickMenu();}
		}// else upPressed = true;
	}

	// S - down
	if(key == 40 || key == 83) {
		if(state<3) {
			menuID += 6;
			updateMenuID();
			updateStats();
			if(state==2) {state=1;pickMenu();}
		}// else downPressed = true;
	}

	// P, ESC
	if(key == 80 || key == 27) {
		if(state == 2){
			central.innerHTML = '';
			showMenu(1);
		} else if (state > 3) {
			reloadOnGameOver();
			if(running)
				running = false;
			else {
				running = true;
				requestAnimationFrame(draw);
			}
		}
	}
}

function keyUpHandler(e) {
	if(e.keyCode == 39 || e.keyCode == 68) {
		rightPressed = false;
	}
	if(e.keyCode == 37 || e.keyCode == 65) {
		leftPressed = false;
	}
	/*if(e.keyCode == 38 || e.keyCode == 87) {
		upPressed = false;
	}
	if(e.keyCode == 40 || e.keyCode == 83) {
		downPressed = false;
	}*/
	if(e.keyCode == 32) {
		spacePressed = false;
	}
}

function changeWeapons(){
	if(!changeTime){
		changeTime = changeTimeLimit;
		weaponType ++;
		if(weaponType>=powerArr.length) weaponType = 0;
		missileSpeed = missilespeedArr[weaponType];
		missileSize = missilesizeArr[weaponType];
		missileInterval = missileintervalArr[weaponType];
		missileDamage = missiledamageArr[weaponType];
		shipSpeed = shipspeedArr[weaponType];
		shipRadius = shipradiusArr[weaponType];
		pwr = powerArr[weaponType];
		healthMax = healthmaxArr[weaponType];
		shieldMax = shieldmaxArr[weaponType];
		health = healthMax;
		shield = shieldMax;
		missileCurrentCount = missileInterval;
	}
}

function generate() {

	step = 0;
	missiles = [];
	enemies = [];
	powerups = [];
	effects = [];
	master = true;
	perfect = true;

	let count = 0;
	for(let j = 0; j < 2; j++) {
		for(let i = 0; i < stages[level][0]; i++) {
			let x = ((i % 10) > 5 ? -600 + (i % 10) * 120 : 0) * (!j?1:-1) + (!j?0:1080);
			let t = parseInt(i/10) * 50 + ((i % 10) > 8 ? 500 : 100);
			let a = (i % 10) > 7 ? i%3==0 ? 1 : 0.1 : 0.1;
			let type = 2;//(i % 10) > 7 ? 8 : 2;
			let poly = 0;
			let hp = 50;
			let size = 10;
			let collision = 10;
			let anim = 10;
			let speed = 2;
			/*if (!level) {
				if (!j) {
					type = i % 2 == 0 ? 0 : i % 4 == 0 ? 0 : 1 + parseInt(random()*4) - 1;
					poly = (!type) ? 5 + parseInt(random()*3) : 1;
					hp = (!type) ? poly==5 ? 2 : 4 : 5*type + type * type;
					size = (!type) ? poly==5 ? 25 : 35 : 70;
					collision = size + (!type ? poly==5 ? 10 : 5 : 0);
					speed = type>2 ? 1.5 : type == 2 ? 1.5 : type + 2 + (poly==5 ? 2+random()*3 : 0);
					anim = 5 + type*2;
					a = 1;
					x = (type > 2) ? 50 + (count++)*60 : parseInt(gameCanvas.width*0.05+random() * gameCanvas.width * 0.9);
					t = (type > 2) ? 1000 + count*2 : 10 * i * 5;
					if (type>2) {
						powerup = {
							a:       0,
							type:    (powerups.length<startArray.length ? startArray[powerups.length] : powerupsArray[powerups.length-startArray.length] || 0),
							size:    40,
							speed:   2+random()*2
						};
						powerups.push(powerup);
					}
					if(type > 2) count ++;
				}
			}*/
			//else if (level==2)
				//type = 8;

			if (j < 3) {// || level
				//if(random() > 0.25)
					enemies.push({
					a:         0,     // enemy exploding counter
					type:      type,  // type
					x:         x,
					y:         -120,
					z:         poly,  // for mines - the number of polygons
					health:    hp,
					maxHealth: hp,
					size:      (i % 10) > 5 ? 5 : 1 * size,
					collision: (i % 10) > 5 ? 5 : 1 * collision,
					speed:     speed,
					animation: anim * 3,
					timeout:   t,
					color:     (i % 10) > 5 ? 0 : 2,//!level ? 2 : 0,
					alpha:     a,
					cargo:     false// && !j && type>2 ? powerups.length-1 : 0
				});
			}

			if (a == 1) {// red enemy behind
				enemies.push({
					a:         0,     // enemy exploding counter
					type:      (i % 10) > 7 ? 8 : 2,  // type
					x:         x,
					y:         -190,
					z:         poly,  // for mines - the number of polygons
					health:    hp,
					maxHealth: hp,
					size:      size,
					collision: collision,
					speed:     speed,
					animation: anim,
					timeout:   t,
					color:     2,
					alpha:     a,
					cargo:     !j && type>2 ? powerups.length-1 : 0
				});
			}
		}
	}

	// boss
	for(let j = 0; j < 4; j++) {
		for(let i = 0; i < 3; i++) {
			if (j==1 || (!j&&(!i||i==2)) || (j==2&&(i==1)))
				enemies.push({
					a:         0,             // enemy exploding counter
					type:      j==2?7:i%2==0&&j%2!=0 ? 12 : 6,      // type
					x:         400 + i * 120,
					y:         -300 + j * 80,
					z:         0,
					health:    j==2?100:1000,//i==1&&j==1?1500:500,
					maxHealth: j==2?100:1000,//i==1&&j==1?1500:500,
					size:      75,
					collision: 0,
					speed:     6,
					animation: 100,//100
					timeout:   200,
					color:     5,
					alpha:     j!=2?1:1,
					cargo:     j
				});
		}
	}
}

Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
};
Math.degrees = function(radians) {
	return radians * 180 / Math.PI;
};

function random() {
	return Math.random();
}





function moveMissiles(){
	len = missiles.length - 1;
	for(let i = len; i >= 0; i--){
		missile = missiles[i];
		if(missile.pulse != -1) {
			if (missile.pulse > 0) {
				missile.pulse --;
			} else {
				missiles.splice(i,1);
				len = missiles.length-1;
			}
		} else {
			missile.moveByAngle();
			if (missile.y < -40 || missile.y > gameCanvas.height || missile.x < 0 || missile.x > gameCanvas.width) {
				missiles.splice(i,1);
				len = missiles.length-1;
			}
			else if (missile.type==1 || missile.type==4 || missile.type==10) {
				missile.speed*=1.01;
				missile.angle*=0.9;
			}

			if (missile.type == 1 && missile.pulse > -1) {
				missile.angle=360*random();
			}
		}
	}
}
function drawMissiles() {
	if (missiles.length) {
		len = missiles.length;
		for(let i = 0; i < len; i++) {
			if (missiles[i].pulse > -1) {
				missiles[i].blow(drawExplosion, 0.5);// consider clouds
			}
			missiles[i].draw(drawUnit, gameContext, effectsContext, addEffect, random);
		}
	}
}

function movePowerups() {
	for(let i = 0; i < powerups.length; i++) {
		powerup = powerups[i];
		if (powerup.type) {
			if (powerup.a) {
				powerup.y += powerup.speed*globalSpeed;
				if (powerup.y > gameCanvas.height+powerup.size) {
					powerup.type = 0;
					powerup.a = 0;
				}
			}
		}
		if (powerup.a) {
			if (powerup.type<1)
				powerup.a++;

			powerup.y += powerup.speed*globalSpeed;
			if (powerup.y > gameCanvas.height+powerup.size || powerup.a > 100) {
				powerup.type = 0;
				powerup.a = 0;
			}
		}
	}
}
function drawPowerups(){
	for(let i = 0; i<powerups.length; i++){
		powerup = powerups[i];
		if(powerup.a){
			if(powerup.type){
				gameContext.beginPath();
				gameContext.fillStyle = (powerup.type==1) ? "#cb4" : (powerup.type==2) ? "#292" : (powerup.type==5) ? "#09d" : "#5a8";
				gameContext.arc(powerup.x-powerup.size/(powerup.type==2||powerup.type==5?4:3), powerup.y-powerup.size/2, powerup.size, 0, Math.PI*2);
				gameContext.fill();
				gameContext.globalAlpha = 0.5;
				gameContext.strokeStyle = "#000";
				gameContext.lineWidth = 20;
				gameContext.stroke();
				gameContext.globalAlpha = 1;
				gameContext.closePath();
			}

			gameContext.font = "bold 28px Arial";
			gameContext.fillStyle = powerup.type ? "#000" : powerup.a> 125 ? powerup.a> 140 ? "#888" : "#aaa" : "#ccc";
			gameContext.fillText([powerup.txt,".Att",".Hp+",".Sh+",".Sp+",".Sz+",".Ms"][powerup.type+1], powerup.x-powerup.size, powerup.y-powerup.size*0.25);
		}
	}
}

function moveEnemies() {
	len = enemies.length;
	for(let i = 0; i < len; i++) {
		enemy = enemies[i];
		if(enemy.health){
			if(step > enemy.timeout){
				if (enemy.type >= 5 && enemy.size == 75) {
					// boss enter move left/right
					let slowing = enemy.timeout / step;
					if (slowing > 0.5) {
						slowing = ((slowing - 0.5) * 20 | 0) / 10;
						enemy.y += enemy.speed * globalSpeed * slowing;
					} else {
						if (slowing > 0.4) {
							slowing = ((slowing - 0.4) * 100 | 0) / 10;
						} else slowing = 0;
						enemy.x += ((step / 300 | 0) % 2) * 2 - 1 - slowing;
					}
				} else {
					// normal enemy
					enemy.y += enemy.speed*globalSpeed;
					if(enemy.y > gameCanvas.height+enemy.size && enemy.type < 3) {
						// an enemy has passed the full height of the screen
						if(enemy.type) perfect = false;
						enemy.y = -200;
						enemy.timeout += 1000-level*(level < 5 ? 100 : 50);
						enemy.health = enemy.maxHealth;
						enemy.x = parseInt(gameCanvas.width*0.05+random()*gameCanvas.width*0.9);
					}
				}
			}
		}
	}
}

function drawEnemies() {
	for(let i = 0; i < enemies.length; i++){
		enemy = enemies[i];
		if(enemy.y > -149 && (enemy.health || enemy.a>1)){
			// draw meteor mine
			if(!enemy.type) {
				gameContext.save();
				gameContext.translate(enemy.x, enemy.y);
				gameContext.globalAlpha = enemy.alpha;
				let k = (enemy.z==5) ?  1 : 2;
				if (k==1 && step%2==0) gameContext.scale(-1, 1);
				gameContext.rotate(Math.radians(k-1 ? (enemy.x%2==0 ? step : -step) % 360 : 235));
				gameContext.beginPath();
				gameContext.strokeStyle = "#900";
				gameContext.lineWidth = 10*k - parseInt((enemy.size-25)/2);
				gameContext.moveTo(enemy.size/2 * Math.cos(0), enemy.size/2 * Math.sin(0));
				for (let j = 1; j <= enemy.z; j ++) {
					gameContext.lineTo(enemy.size/k*Math.cos(j*2*Math.PI/enemy.z), enemy.size/k*Math.sin(j*2*Math.PI/enemy.z));
				}
				gameContext.closePath();
				gameContext.stroke();
				gameContext.fillStyle = "#d33";
				gameContext.fill();
				
				gameContext.globalAlpha = 1/k*enemy.alpha;
				gameContext.beginPath();
				gameContext.fillStyle = "#f88";
				gameContext.moveTo(0, 0);
				if(enemy.health>0) {
					gameContext.lineTo(0, -6*k);
					gameContext.lineTo(6*k, 0);
				}
				if(enemy.health>1){
					gameContext.lineTo(-6*k, 0);
					gameContext.lineTo(0, 6*k);
				}
				if(enemy.health>2) {
					gameContext.lineTo(0, -6*k);
					gameContext.lineTo(-6*k, 0);
				}
				if(enemy.health>3){
					gameContext.lineTo(0, 6*k);
					gameContext.lineTo(6*k, 0);
				}
				if (k == 1) {
					// add trail particles on the faster meteors (pentagon shaped)
					gameContext.strokeStyle = "#b30";
					gameContext.stroke();
					addEffect(enemy, 12, 4, 1, 2, 0, -10);
				}
				gameContext.fill();
				gameContext.closePath();
				gameContext.globalAlpha = 1;
				gameContext.translate(0,0);
				gameContext.restore();
			} else {
				gameContext.globalAlpha = enemy.alpha * (enemy.a ? enemy.a/30 : 1);
				drawUnit(gameContext, enemy.type, enemy.type, enemy.color, enemy.animation, enemy.x, enemy.y - enemy.size/2, true, size);
				gameContext.globalAlpha = 1;

				if(enemy.type >= 2) {
					// draw health bar
					gameContext.beginPath();
					gameContext.rect(enemy.x-2, enemy.y + 5, 4, ((enemy.size/enemy.maxHealth)*enemy.maxHealth)/2);
					gameContext.fillStyle = "#900";
					gameContext.fill();
					gameContext.closePath();
					gameContext.beginPath();
					gameContext.rect(enemy.x-2, enemy.y + 5 + ((enemy.size/enemy.maxHealth)*(enemy.maxHealth-enemy.health))/2, 4, ((enemy.size/enemy.maxHealth)*enemy.health)*0.9/2);
					gameContext.fillStyle = "#fff";
					gameContext.fill();
					gameContext.closePath();
				}
			}

			// enemy is exploding
			if(enemy.a>1){
				enemy.a--;
				if(enemy.a < 20){
					enemy.y += enemy.speed*0.75;
					enemy.size += 1;
					enemy.alpha -= 0.05;
					addEffect(enemy, 12, (enemy.a%2==0 && enemy.a>8 ? 10 : 6), (enemy.a>8 ? enemy.a<16 ? enemy.a - 4 : 5 : 1 + enemy.a));
				} else if(enemy.a < 40){
					enemy.y += enemy.speed*0.9;
					enemy.x += random()*4-2;
					enemy.y += random()*4-2;
					addEffect(enemy, 12, 6, 3 + random() * 3);
				} else if(enemy.a == 40 || enemy.a == 41){
					enemy.y += enemy.speed*0.9;
					enemy.x += random()*8-4;
					enemy.y += random()*8-4;
					addEffect(enemy, 6, 9, enemy.size/(4+(42 - enemy.a)*2), 1, 10, 25);
				} else {
					enemy.y += enemy.speed*0.9;
					enemy.x += random()*2-1;
					enemy.y += random()*2-1;
					addEffect(enemy, 11 + (enemy.a%2), 3 + random() * 4, 15);
				}
			}
		}
	}
}

function addEffect(element, type, total, size, spread = 1, offsetx = 0, offsety = 0) {
	effects.push({
		x:     element.x + offsetx + ((element.size*random()*2)-element.size) / spread,
		y:     element.y + offsety + ((element.size*random()*2)-element.size) / spread,
		frame: 0,
		total: total,
		size:  size,
		type:  type
	});
}

function drawEffects() {
	for(let i = effects.length-1; i >= 0; i--) {
		effect = effects[i];
		if(step%2==0) effect.frame++;
		drawExplosion(
			effect.x/size-effect.size/size*2,
			effect.y/size-effect.size/size*2,
			effect.size*effect.frame/size,
			lightColors[effect.type],
			darkColors[effect.type],
			1.5 - effect.frame / effect.total
		);

		if(effect.frame >= effect.total) {
			effect.frame = 0;
			effects.splice(i, 1);
		}
	}
}

function drawExplosion(x, y, s, c1, c2, a = 1) {
	effectsContext.beginPath();
	effectsContext.fillStyle = '#'+c1;
	effectsContext.globalAlpha = a;
	effectsContext.arc(x, y, s, 0, 2 * Math.PI, false);
	effectsContext.fill();
	effectsContext.lineWidth = 2;
	effectsContext.strokeStyle = '#'+c2;
	effectsContext.stroke();
	effectsContext.closePath();
	effectsContext.globalAlpha = 1;
}

function draw() {
	bgrContext.clearRect(0, 0, bgrCanvas.width, bgrCanvas.height);
	moveBgr();
	if(playing) {
		if(slowing) slowing --;
		else {
			step++;
			if(changeTime) changeTime --;

			if(invulnerable) invulnerable--;
			else if(step%(30-shieldGain)==0 && shield < shieldMax) {
				shield++;
				updateUI();
			}

			gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
			effectsContext.clearRect(0, 0, bgrCanvas.width/5, bgrCanvas.height/5);
			drawEffects();

			moveMissiles();
			drawMissiles();
			//drawEnemyMissiles();

			moveEnemies();
			drawEnemies();

			movePowerups();
			drawPowerups();

			drawShip();

			collisionDetection();

			let pwrstep;
			if(missileCurrentCount) {
				missileCurrentCount ++;
				if(missileCurrentCount >= missileInterval) missileCurrentCount = 0;
			}
			if((spacePressed || constantShoot) && !complete && health > 0 && !missileCurrentCount) {
				missileCurrentCount = 1;

				if(!weaponType) {
					missiles.push(getShot(PlayerCannon, 0, -38));
				}

				else
				if(weaponType == 1) {
					if(!pwr || pwr % 2 == 0) {
						missiles.push(getShot(PlayerCannon, 0, -38));
						for(pwrstep = 2; pwrstep <= 1+pwr/2; pwrstep++) {
							let offsetY = (pwrstep-1)*(pwrstep-1) * 2;
							missiles.push(getShot(PlayerCannon, -16*pwrstep+16, -40 + offsetY));
							missiles.push(getShot(PlayerCannon, 16*pwrstep-16, -40 + offsetY));
						}
					} else if(pwr == 1 || pwr % 2 != 0) {
						for(pwrstep = 1; pwrstep <= 1+pwr/2; pwrstep++) {
							let offsetY = pwrstep*pwrstep * 2;
							missiles.push(getShot(PlayerCannon, -16*pwrstep+8, -40 + offsetY));
							missiles.push(getShot(PlayerCannon, 16*pwrstep-8, -40 + offsetY));
						}
					}
				}
				else
				if(weaponType == 2 || weaponType == 6 || weaponType == 8) {
					if (weaponType != 8 || (step%8>6-pwr || missiles.length < 1)) {
						missiles.push(getShot(PlayerLaser,
							weaponType == 8 ? step % 2 == 0 ? -50 : 50 : random()*pwr - pwr/2,
							-shipRadius,
							invulnerable || weaponType == 8 ? (random()*2)-1 : 0
						));
					}
				}
				else
				if(weaponType == 3 || weaponType == 11){
					missileCurrentCount += (weaponType == 11 ? pwr : pwr*2);
					missiles.push(getShot(PlayerBlob, 0, -22, weaponType == 11 ? (leftPressed ? 5 : rightPressed ? -5 : 0) + pwr - random()*pwr*2 : 0, missileSpeed-1 + (weaponType==3?0.5:0.2)*pwr));
				}
				else
				if(weaponType == 4 || weaponType == 10){
					if(weaponType == 4) missileCurrentCount += pwr*3;
					missiles.push(getShot(PlayerMissile, 0, -30));
					if(weaponType == 10) {
						for(pwrstep = 0; pwrstep < parseInt(pwr/2); pwrstep++) {
							let r = random();
							missiles.push(getShot(PlayerMissile, r<0.5?-30:30, -20, (r<0.5?-pwrstep:pwrstep)*20*r, missileSpeed/2+missileSpeed*parseInt(r*10)/20));
						}
					}
				}
				else
				if(weaponType == 5 || weaponType == 9){
					if(!pwr || pwr % 2 == 0 || weaponType == 9) {
						if(weaponType == 9 && pwr > 3){
							missiles.push(getShot(PlayerBlob, -30, 0, -1));
							missiles.push(getShot(PlayerBlob, 30, 0, 1));
						} else {
							missiles.push(getShot(PlayerBlob));
						}
						for(pwrstep = 2; pwrstep <= 1+pwr/2; pwrstep++) {
							missiles.push(getShot(PlayerBlob, weaponType==9 ? -40 : 0, 0, -15*pwrstep+16));
							missiles.push(getShot(PlayerBlob, weaponType==9 ? 40 : 0, 0, 15*pwrstep-16));
							if(weaponType == 9) break;
						}
					} else if(pwr == 1 || pwr % 2 != 0) {
						for(pwrstep = 1; pwrstep <= 1+pwr/2; pwrstep++) {
							missiles.push(getShot(PlayerBlob, 0, 0, -15*pwrstep+7.5));
							missiles.push(getShot(PlayerBlob, 0, 0, 15*pwrstep-7.5));
						}
					}
					if(weaponType == 9 || pwr > 4) {
						missiles.push(getShot(PlayerBlob, 0, 0, -90));
						missiles.push(getShot(PlayerBlob, 0, 0, 90));
					}
				}
				else
				if(weaponType == 7){
					if (pwr==2 || pwr >= 4) {
						missiles.push(getShot(PlayerMissile, -30+(pwr==3||pwr==4?8:0), -50));
						missiles.push(getShot(PlayerMissile, 30-(pwr==3||pwr==4?8:0), -50));
					}
					if (pwr >= 3) {
						missiles.push(getShot(PlayerMissile, -60, -20));
						missiles.push(getShot(PlayerMissile, 60, -20));
					}
					if(pwr == 1 || pwr==3 || pwr>4) missiles.push(getShot(PlayerMissile, 0, -80));
				}
			}

			if(rightPressed && shipX < gameCanvas.width-shipRadius) {
				shipX += shipSpeed;
			}
			if(leftPressed && shipX > shipRadius) {
				shipX -= shipSpeed;
			}
			/*if(upPressed && shipY > gameCanvas.height/6) {
				shipY -= shipSpeed;
			}
			if(downPressed && shipY < gameCanvas.height-shipRadius*1.5) {
				shipY += shipSpeed;
			}*/
		}
	}

	drawFPS();
	if (running) requestAnimationFrame(draw);
	else if (!gameOver) {
		//fadePixelatedOverlay();
		addPixelatedOverlay("Game paused", 55, 160);
	}
}
function fadePixelatedOverlay() {
	effectsContext.globalAlpha = 0.6;
	effectsContext.fillStyle = "#000";
	effectsContext.rect(0, 0, gameCanvas.width/5, gameCanvas.height/5);
	effectsContext.fill();
}
function addPixelatedOverlay(txt, x, y, font = "bold 16") {
	effectsContext.globalAlpha = 1;
	effectsContext.font = font + "px Arial";
	effectsContext.fillStyle = "#fff";
	effectsContext.fillText(txt, x, y);
}

function getShot(missileClass, x = 0, y = 0, r = 0, s = 0, baseX = shipX, baseY = shipY) {
	return new missileClass(baseX+x, baseY+y, r, s || missileSpeed, missileSize, pwr, weaponType, lightColors[weaponType], darkColors[weaponType]);
}

function checkForDeath(enemy, missile) {
	let type;
	if (!missile) type = 1;
	if (enemy.health < 0) enemy.health = 0;
	if (!enemy.health) {
		enemy.a = 43 + (enemy.type>2 ? (enemy.type-2)*2 : 0);
		if (enemy.cargo) {
			powerups[enemy.cargo].x = enemy.x;
			powerups[enemy.cargo].y = enemy.y;
			powerups[enemy.cargo].a = 1;
			powerups[enemy.cargo].txt = shipNames[enemy.type]+".png";
		}
	}

	if (!enemy.health) {
		score += (enemy.maxHealth>5?parseInt(enemy.maxHealth/5)+4:2)*5;
	}

	checkGameOver();
}

function reloadOnGameOver(){
	if(gameOver == 3) {
		//writeHash(0);
		location.reload();
	}
}

function checkGameOver(_force){
	if (!gameOver) {
		if(health <= 0 || _force) {
			gameOver = 1;
			invulnerable = 900;
			healthbar.style.width = 0;
		} else {
			let hasEnemies;
			let len = enemies.length;
			for(let i = 0; i < len; i++) {
				enemy = enemies[i];
				if (enemy.health) {
					hasEnemies = true;
					break;
				}
			}
			if (!hasEnemies) {
				gameOver = 2;
				health = healthMax;
				shield = shieldMax;
				updateUI();
			}
		}
		if (gameOver) {
			leftPressed = false;
			rightPressed = false;
			slowCount = 0;
			let interval = setInterval(
				()=> {
					slowCount ++;
					slowing = Math.ceil(slowCount / 5);
					if (slowCount == 20) {
						clearInterval(interval);
						running = false;
						fadePixelatedOverlay();
						if (gameOver == 1) {
							addPixelatedOverlay("Game Over", 70, 140);
						} else {
							let bonus = -1;
							let hidden = [];
							for(let i = 0; i < powerArr.length; i++) {
								if (!powerArr[i]) {
									bonus = i;
									hidden.push(i);
								}
							}

							if (hidden.length > 6) {
								bonus = hidden[parseInt(random()*hidden.length-1)];
							}

							if (bonus > -1) {
								let canvas = drawShipMenu(central, bonus, indexArr[bonus], colorArr[bonus])[0];
								canvas.style.left = "34%";
								canvas.style.width = "320px";
								canvas.style.height = "320px";
								overlay.style.opacity = 1;
								addPixelatedOverlay("Stage Cleared!", 50, 80);
								if (master) addPixelatedOverlay("Master!", 20, 160, 10);
								if (perfect) addPixelatedOverlay("Perfect!", 164, 160, 10);
								addPixelatedOverlay("You found a missing game file!", 40, 220, 10);
								addPixelatedOverlay(shipNames[bonus]+".png", 86, 240);

								powerArr[bonus] = 1;
							}
						}
						gameOver = 3;
						addPixelatedOverlay("Tap screen for Menu", 64, 310, 10);
					}
				}, 120
			);
		}
	}
}

function collisionDetection(i, len2, len) {
	// check for player ship vs enemy ship collision
	len = enemies.length;
	for(let i = 0; i < len; i++) {
		enemy = enemies[i];
		if (enemy.type < 5 && enemy.health && !invulnerable && enemy.y < shipY && enemy.alpha == 1) {
			if (circlesColliding(enemy.x, enemy.y, enemy.collision, shipX, shipY, shipRadius)) {
				enemy.health = 0;
				enemy.a = 60;
				killedArr[enemy.type] ++;
				let damage = [25, 30, 50, 100][enemy.type];
				if (shield>damage) {
					shield-=damage;
					invulnerable = 5;
					//shielded = true;
				} else {
					health -= (damage - shield);
					shield = 0;
					invulnerable = 50;
					//hurt = true;
					//shielded = true;
				}
				updateUI();
				checkForDeath(enemy);
			}
		}
	}

	// check for player missile vs enemy ship collision
	len2 = missiles.length - 1;
	for(let i = len2; i >= 0; i--) {
		missile = missiles[i];
		for(let j = 0; j < len; j++) {
			enemy = enemies[j];
			if (enemy.y > -50 && enemy.health && missile.pulse == -1) {
				if (circlesColliding(missile.x, missile.y, missile.size + (missile.type == 3 ? pwr*2:0), enemy.x, enemy.y, enemy.size)) {
					enemy.health -= missileDamage + (pwr-1)*missileDamage/(!missile.type||missile.type==6?0.3:missile.type==9||missile.type==11?0.5:2) + missileDamage*missileDamage;
					missile.pulse = missile.blowSize;

					if ((missile.type == 3 || missile.type == 4) && missile.y>100) {
						for(let k = 0; k < len; k++) {
							let enemy2 = enemies[k];
							if (enemy2.health) {
								if (circlesColliding(missile.x, missile.y, missile.size*2*pwr*(missile.type==3?2:1), enemy2.x, enemy2.y, enemy2.size)) {
									// add detonation explosion when multiple targets blow
									addEffect(missile, weaponType, 6, (missile.type==3?missile.size+pwr:2+pwr), 2, 10);
									enemy2.health -= missileDamage + (missile.type == 1 ? 0 : missileDamage*pwr/4);
									checkForDeath(enemy2, missile);
								}
							}
						}
					}

					// add small explosion when the bullet (beam,rocket,etc.) hits the target
					addEffect(missile, weaponType, 4 + random() * 2, 2 + pwr/2 + random() * 4, missile.size/2, 10);

					/*if(missile.type == 3) {debugger
						addEffect(missile, weaponType, 6, 4 + random()*4, 1, -2 + random()*4, -2 + random()*4);
						addEffect(missile, weaponType, 6, 4 + random()*4, 1, -2 + random()*4, -2 + random()*4);
					}*/

					if (missile.type == 8) {
						missiles.push(getShot(PlayerLaser, 0, -shipRadius/3, -40 + random()*80, 0, missile.x, missile.y));
						enemy.health += missileDamage;
					}

					if (enemy.health <= 0) {
						if (missile.type == 6) {
							//addEffect(missile, weaponType, 6, 9, 1);
							missiles.push(getShot(PlayerLaser, 0, -shipRadius/2, -30, 0, missile.x, missile.y));
							missiles.push(getShot(PlayerLaser, 0, -shipRadius/2, 30, 0, missile.x, missile.y));
						}
					}
					checkForDeath(enemy, missile);
				}
			}
		}
	}

	// check powerup takeup
	for(let i = 0; i < powerups.length; i++) {
		powerup = powerups[i];
		if(powerup.a){
			if(isColliding(powerup.x, powerup.y, powerup.size, shipX, shipY, shipRadius*1.75)) {
				if(!powerup.type){
					score+=50;
					poweredArr[0]++;
				} else if(powerup.type==1){//.Att
					if(powerArr[weaponType]<6) powerArr[weaponType] ++;
					pwr = powerArr[weaponType];
					poweredArr[1]++;
				} else if(powerup.type==2){//.Hp
					if(health == healthMax) {
						healthmaxArr[weaponType] += 5;
						healthMax += 5;
						health = healthMax;
						score+=50;
					} else {
						health+=50;
						if(health > healthMax)
							health = healthMax;
						score+=parseInt(health-healthMax);
					}
					poweredArr[2]++;
				} else if(powerup.type==3){//.Shd
					if(shield == shieldMax) {
						shieldmaxArr[weaponType] += 5;
						shieldMax += 5;
						shield = shieldMax;
						score+=50;
					} else {
						shield+=25;
						if(shield > shieldMax) {
							shield = shieldMax;
						}
						score+=parseInt(shield-shieldMax);
					}
					poweredArr[3]++;
				} else if(powerup.type==4){//.Spd
					shipspeedArr[weaponType] += 0.5;
					shipSpeed = shipspeedArr[weaponType];
					poweredArr[4]++;
				} else if(powerup.type==5){//.Sze
					missilesizeArr[weaponType] += 0.5;
					missileSize = missilesizeArr[weaponType];
					poweredArr[5]++;
				} else if(powerup.type==6){//.Msp
					missilespeedArr[weaponType] += 0.5;
					missileSpeed = missilespeedArr[weaponType];
					if(missileintervalArr[weaponType]>2) missileintervalArr[weaponType] -= 0.5;
					missileInterval = missileintervalArr[weaponType];
					poweredArr[6]++;
				}
				powerup.a = 0;
				powerup.type=0;
				updateStats();
			}
		}
	}
}
function circlesColliding(x1,y1,radius1,x2,y2,radius2){
	let dx = x2 - x1;
	let dy = y2 - y1;
	let radii = radius1 + radius2;
	if ( ( dx * dx )  + ( dy * dy ) < radii * radii ) {
	    return true;
	} else {
	    return false;
	}
}
function isColliding(ax, ay, as, bx, by, bs) {
	return !(((ay + as) < by) || (ay > (by + bs)) || ((ax + as) < bx) || (ax > (bx + bs)));
}

// FPS metter
const times = [];
let fps;
function drawFPS(){
	const now = performance.now();
	while (times.length > 0 && times[0] <= now - 1000) {
		times.shift();
	}
	times.push(now);
	fps = times.length;
	bgrContext.font = "bold 32px Arial";
	bgrContext.fillStyle = "#3ad";
	bgrContext.fillText("FPS: "+fps, 10, 22);
	bgrContext.fillText("SCORE: "+score, 440, 22);
	bgrContext.fillText("STAGE: "+(level+1), 900, 22);
}
