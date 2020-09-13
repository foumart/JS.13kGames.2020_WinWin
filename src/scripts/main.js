// Win/Win/.bin

'use strict';

// elements
let menu = document.getElementById("menu");
let game = document.getElementById("game");
let titletop = document.getElementById("titletop");
let titlebottom = document.getElementById("titlebottom");
let overlay = document.getElementById("overlay");
let central = document.getElementById("central");
let controls = document.getElementById("controls");

let bgrCanvas = document.getElementById("backgroundCanvas");
let gameCanvas = document.getElementById("gameCanvas");
let effectsCanvas = document.getElementById("effectsCanvas");

let bgrContext = bgrCanvas.getContext("2d");
let gameContext = gameCanvas.getContext("2d");
gameContext.imageSmoothingEnabled = false;
let effectsContext = effectsCanvas.getContext("2d");

let leftBtn = document.getElementById("left");
let centralBtn = document.getElementById("center");
let rightBtn = document.getElementById("right");

//let offsetX = parseInt(gameCanvas.getBoundingClientRect().left);
//let offsetY = parseInt(gameCanvas.getBoundingClientRect().top);
//let gameWidth;
//let gameHeight;

let baseWidth = 1080;
let baseHeight = 1920;
let areaHeight = 1620;

let width;
let height;

let state = 0;
let menuID = 0;
let menuCount = 0;

let fff;
let fullscreenCanceled;
let standalone;

let monet = 0;// = true; // monetization : subscribed
//let master;

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
let weaponType = 1;
let secondaryType = 0;	
let globalSpeed = 1;
let invulnerable;// = 100;

let shipX = gameCanvas.width / 2;
let shipY = gameCanvas.height * 0.9;

// movement
let destinationX = -1;
let destinationY = -1;

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;
let spacePressed = false;

// general
let running = true;
let playing;
let step = 0;
let online = (window.location.protocol == "http:" || window.location.protocol == "https:");
let hash;
let straight;

let size = 5;// value in Missile.js as well
let starSize;
let starSpeed;
let level = 0;
let complete = 0;
let score = 0;
//let inscore;
let prescore = 0;

// itteration objects
let missiles = [];
let missile;//tmp object
let enemies = [];
let enemy;//tmp object
let enemyMissiles = [];
let powerups = [];
let powerup;//tmp object
let effects = [];
let effect;//tmp effect
let allSprites = [];

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
	killedArr,
	poweredArr;

let powerupsArray = shuffle([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,5]);
let startArray = shuffle([0,0,1,0,2,0,3,0,4,0,0,0,5]);

function shuffle(array) {
	let currentIndex = array.length, temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

let shipWeapons =           [
	'Cannon',
	'Gun',
	'Laser',
	'ShockWave',
	'Rocket',
	'Blaster',
	'Zapper',
	'X', 'Y', 'F', 'Railgun'];

let shipTitles = [
	'Raptor', 'Rogue', 'Viper', 'Nightflyer', 'Valkyre', 'Hunter', 'Discoverer', 'Scout', 'Wraith', 'Rocinante', 'Phoenix', 'Coil'
];

let shipNames =             ['A', 'G', 'L', 'Y', 'V', 'T', 'X', 'S', 'W', 'O', 'F', 'C'];

function resetStats(arrays) {//    1    2    3    4    5    6    7    8    9    10  11
	arrays = [//              ^    ^^   |    ()   A    8    |    /\   
		indexArr =           [1,   4,   3,   2,   5,   6,   7,  10,   15,  3,   9,  11],
		colorArr =           [1,   1,   3,   1,   4,   2,   3,   4,   1,   1,   4,   1],

		powerArr =           [1,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
		shipradiusArr =      [70,  75,  60,  70,  80,  70,  75,  55,  80,  78,  80,  78],
		shipspeedArr =       [6,   5,   5.5, 5,   4,   4.5, 6,   6.5, 4,   5,   4.5, 7],
		missilespeedArr =    [20,  15,  40,  10,  3,   20,  25,  30,  5,   10,  6,   8],
		missilesizeArr =     [5,   3,   2.5, 8,   12,  6,   4,   5,   6,   7,   10,  7],
		missileintervalArr = [10,  25,  3,   30,  40,  20,  15,  30,  9,   20,  12,   12],
		missiledamageArr =   [0.75,1.5, 0.25,2.5, 25,  2,   1,   1,   2,   2.5, 3,   2],
		healthmaxArr =       [75,  100, 60,  80,  100, 80, 80,  70,   90,  75,  90,  105],
		healthmaxiniArr =    [75,  100, 60,  80,  100, 80, 80,  60,   90,  75,  90,  105],
		shieldmaxArr =       [10,  15,  10,  25,  20,  10,  30,  5,   20,  15,  20,  15],
		shieldmaxiniArr =    [10,  15,  10,  25,  20,  10,  30,  5,   20,  15,  20,  15],
		killedArr =          [0,   0,   0,   0,   0,   0],
		poweredArr =         [0,   0,   0,   0,   0,   0]
	];
	return arrays;
}
arrays = resetStats();

function updateStats(){
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

let effectColors1 = ['yellow', 'yellow', 'cyan', '#66ccff', 'red', 'yellow'];
let effectColors2 = ['red', 'red', 'green', '#4499cc','yellow', 'red'];

//let i,j,k,l;
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
	spriteData += ship1 + ship2 + ship1 + ship2 + ship1 + ship2 + ship1 + ship2 + ship2 + ship1;
	ship1.split('').reverse().join('');
	spriteData += ship1 + ship2 + ship1 + ship2 + ship1 + ship2;
	ship2.split('').reverse().join('');
	spriteData += ship1 + ship2 + ship1 + ship2 + ship1 + ship2 + ship1;

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
	bgrContext.fillStyle = "#ffffff";
	bgrContext.fillRect(star[0], star[1], starSize, starSize);
}

function moveBgr() {
	starSize = 1;
	starSpeed = playing ? 1 : 0.3;
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

function init(){
	if (!window.top.location.hash) {
		writeHash(0);
		location.reload();
		return;
	} else readHash();
	buffer();
	//generateRandomSprites();
	generateMenu();
	generate();
	window.addEventListener("resize", resize, false);
	resize();
	showMenu();
	draw();

	overlay.addEventListener('touchstart', pickMenu);
	overlay.addEventListener('click', pickMenu);

	document.addEventListener("fullscreenchange", fullscreenCheck);
	if (standalone && !fff && !fullscreenCanceled) {
		console.log("[Event] Requesting Fullscreen mode...");
		toggleFullscreen();
	}

	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);

	if(document.monetization){
		console.log("[Event] Web Monetization",document.monetization.state);
		if(document.monetization.state=="started") monet = 1;
		else document.monetization.addEventListener("monetizationstart",
			function(){
				monet = 1;
				//if(lives<0) level = -1;
			}
		);
	} else console.log("[Warning] Web Monetization not found");

	standalone = window.matchMedia('(display-mode: standalone)').matches;
	if(standalone) console.log("[Event] Game is running as Standalone PWA.");
	if(!FX.initialized) FX.start();// start soundFX*/
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
			if(!_vol) return
			if(!i){
				oscillator.connect(modulationGain).connect(audioContext.destination);
				oscillator.start();
				// make sure to stop the sound from playing in the background (when the tab is inactive)
				oscillator.stop(audioContext.currentTime+(_length-i)/60);
			} else modulationGain.gain.value = (i<4?.05*i*i:1-i/_length) * _vol * d.volume;
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
	}}
	
	// stage starting sound, w:length
	d.d=function(w,d){playSound(90, 9, 10+w*10, 1, d||0, 0.05); playSound(30, 3, 20+w*10, 1, d||0, 0.1); playSound(90, 5, 20+w*10, 2, d||0, 0.2)}
	
	// 0:bunny die, 1-4:bunny jump
	d.b=function(w){
		playSound(220, -9 * (w*w||1), 40/w|0||1, 2, w*60, .2 - (w?.14+w/80:0));
		playSound(90*(w||1), -9, 9, 1, w*60, .2 - (w?.14+w/80:0));
	}

	// level complete or super bunny jump
	d.c=function(w,l,d){playSound(300-90*w*w, 9*w, (l||8)*w, 2-(w/2|0), (d||0)+(w-1)*(l/2||8), .1-w*.02);}
	
	// custom //_type, _freq, _incr, _length, _delay, _vol
	d.p=function(w,f,i,l,d,v){playSound(f||120, i||10, l||50, w||0, d, v||0.1);}
	
	return d;	
})();

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

	menu.children[0].style.display = 'none';
	menu.children[1].style.display = 'none';
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

function drawUnit(ctx, i, id, clr, spd, x, y, z, s) {
	let S = s || 1;
	let X1 = s ? x-12*S : x-6;
	let X2 = s ? x : x-6;
	let Y1 = y + (!spd ? /*leftPressed?2:rightPressed?-2:*/s==1?0:i<6?S+1:id==7?-2:2 : ((step/spd)|0)%4==0?S:((step/spd)|0)%2==0?-S:0);
	let Y2 = y + (i>7 && id<8? 2 : i<8&&id>6 ? 2 : s==1?0:2) + (!spd ? /*leftPressed?-2:rightPressed?2:*/0 : ((step/spd)|0)%4==0?-S:((step/spd)|0)%2==0?S:0)-1;

	ctx.save();
    if(i>7) ctx.scale(1, -1);console.log(i, id, clr);
	ctx.drawImage(z ? images[id][clr] : imagesMirrored[id][clr], X1, Y1*(i>7?-1:1), 12*S, (i>7?-1:1)*24*S);
	ctx.drawImage(z ? imagesMirrored[id][clr] : images[id][clr], X2, Y2*(i>7?-1:1), 12*S, (i>7?-1:1)*24*S);
	ctx.restore();
}

function drawShip() {
	gameContext.globalAlpha = 0.25;
	gameContext.beginPath();
	gameContext.arc(shipX, shipY, shipRadius, 0, 2 * Math.PI, false);
	gameContext.fillStyle = 'blue';
	gameContext.fill();
	gameContext.lineWidth = 5;
	gameContext.strokeStyle = '#0033ff';
	gameContext.stroke();
	gameContext.closePath();
	gameContext.globalAlpha = 1;

	drawUnit(gameContext, weaponType, indexArr[weaponType], colorArr[weaponType], weaponType==5?10:0, shipX, shipY - shipRadius + (weaponType>8 ? 20 : 0), indexArr[weaponType]>6, size);
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
		if (i > menu.children.length/2-3)
			menu.children[i].style.transform = `translateY(${top}px)`;
		else
			menu.children[i].style.transform = `translateY(${bottom}px)`;
	}
	titletop.style.transform = `translateY(${bottom<-400?bottom-250:bottom==-60?top:bottom+250}px)`;
	titlebottom.style.transform = `translateY(${top>400?top+250:top==60?bottom:top-250}px)`;
}
function showMenu(skip){
	transitionMenu(skip?150:250, skip?-175:-275);
	if(!skip) setTimeout(
		() => {
			titletop.style.zIndex = 1;
			titlebottom.style.zIndex = 1;
			transitionMenu(170, -190);
		}, 750
	);
	if(!skip) setTimeout(
		() => (updatePiece(titlebottom.children[9], 532, 933, 20), updatePiece(titletop.children[8], 480, 865, 20)),
		1000
	);
	if(!skip) setTimeout(
		() => (updatePiece(titletop.children[11], 598, 867, 20), updatePiece(titlebottom.children[12], 650, 935, 20)),
		1150
	);
	setTimeout(
		() => {
			updatePiece(titlebottom.children[9], 525, 930, 40);
			updatePiece(titlebottom.children[12], 645, 930, 40);
			updatePiece(titletop.children[11], 605, 850, 40);
			updatePiece(titletop.children[8], 485, 850, 40);
			transitionMenu(550, -450);

			let brk = '<br>';
			let html = "Pick a ship: &nbsp;<span id=shipname>" + shipTitles[weaponType-1] + "</span>" + brk + brk;
			let cut;
			for(let j = 0; j < 2; j++) {
				for(let i = 0; i < 6; i++) {
					let image = `<img class='brokenimage smalltext' src='./' width='60' height='60'>`;
					html += `<div class='image' style='left:${160*i+60}px;margin-top:${j?220:0}px'>`;
					if (!powerArr[j*6 + i]) {
						if(!cut) cut = j*6 + i;
						html += image.replace("./'", `' style='margin-top:36px;margin-left:36px;' alt=' &nbsp; &nbsp; &nbsp;${shipNames[j*6+i]}\n&nbsp;.png'`) + image + image;
					}
					html += "</div>";
				}
			}
			html += brk+brk+brk+brk+"<div style=position:relative;color:"+(monet?"lightblue":"grey")+";float:right;font-size:32px;line-height:10px>"+brk+brk+"*"+brk+"&nbsp;Coil</div>"+brk+brk+brk+brk+brk+brk+brk+brk;
			html += "<span style='color:red'>***</span>"+brk;
			html += "Error: File "+(cut?shipNames[cut]+".png":monet?'twitter.soc':'coil.sub')+" not found."+brk+brk;
			
			//html += "<div id='hard'></div>"+brk+brk+"&nbsp;Hard drive scan ongoing...";

			//if () {

			//}

			//html += "Error: File C.gif not found on disk."+brk+brk+"<span class='smalltext'>Game not started properly.</span>"+brk+brk+brk+brk+brk;
			//+ "Run Disk Check...";//Certain game features not accessible.

			central.innerHTML = html;

			let divs = central.getElementsByTagName('div');
			for(let i = 0; i < powerArr.length; i++) {
				if (powerArr[i]) {
					drawShipMenu(divs[i], i, indexArr[i], colorArr[i]);
				}
			}
			if(!monet)
				divs[11].className = "saturate";
			

			animateMenuCursor();

		}, !skip ? 1350 : 500
	);
}

function animateMenuCursor(){
	menuCount ++;
	gameContext.clearRect(0, 0, bgrCanvas.width, bgrCanvas.height);
	if(!state) {
		let k = menuID < 6 ? menuID : menuID - 6;
		let l = menuID < 6 ? 664 : 880;
		gameContext.beginPath();
		gameContext.rect(70+k*160, l, 156, 156);
		gameContext.strokeStyle = menuCount%2==0?'white':'grey';
		gameContext.setLineDash([menuCount%(menuCount%2)==0, menuCount%(menuCount%3), menuCount%(menuCount%4)]);
		gameContext.lineWidth = menuCount%2==0?4:6;
		gameContext.stroke();
		gameContext.closePath();

		requestAnimationFrame(animateMenuCursor);
	} else gameContext.setLineDash([]);
}

function updatePiece(element, left, top, height, width){
	element.style.width = width + 'px';
	element.style.height = height + 'px';
	element.style.left = left + 'px';
	element.style.top = top + 'px';
}

function pickMenu(evt) {
	/*if (evt) {
		if(evt.target.id == "back"){
			pickMenu();
			return;
		}
	}*/
	if (!state) {
		let weaponCheck = evt!=-1&&evt ? Array.from(evt.target.parentNode.parentNode.children).indexOf(evt.target.parentNode)-2 : menuID;
		//console.log(weaponCheck, weaponType, menuID);
		if (evt && weaponType != weaponCheck) {
			weaponType = weaponCheck;
			menuID = weaponType-1;
			updateMenuID();
			updateStats();
			return;
		}
		weaponType = menuID;
		updateStats();
		state = 1;
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
		let html = "&nbsp; SHIP:&nbsp <span id=shipname>" + shipTitles[weaponType] + "</span>" + brk;
		html += "&nbsp; ____" + brk + brk;
		html += "Health: "+bar((weaponType == 2 ? 5 : healthMax-60) / 5) + brk;
		html += "Shield: "+bar(1 + shieldMax / 5) + brk;
		html += "&nbsp;Speed: "+bar(parseInt((shipSpeed-3.5))*2, 7) + brk;
		html += "&nbsp; Size: " + bar(1+parseInt((shipRadius-50) / 6), 6) + brk + brk;
		html += "&nbsp; Type: " + shipNames[weaponType] + brk + brk + brk;
		html += "&nbsp;Level: " + powerArr[weaponType] + brk + brk;
		html += "Weapon: " + shipWeapons[weaponType] + brk + brk;
		html += "&nbsp; &nbsp; &nbsp;<div id='buttons'>[ < ][ > ][ ESC ]</div>"+brk+brk+"<div id='proceed'>[ SPACE / ENTER ]</div>";

		central.innerHTML = html;

		let canvas = drawShipMenu(central, weaponType, indexArr[weaponType], colorArr[weaponType])[0];
		canvas.style.left = "55%";
		canvas.style.top = "45%";
		canvas.style.width = "400px";
		canvas.style.height = "400px";
	} else {
		hideMenu();
	}
}

function hideMenu(){
	titletop.style.opacity = 0;
	titlebottom.style.opacity = 0;
	transitionMenu(60, -60);
	central.innerHTML = "";
	playing = true;
	setTimeout(
		()=>{
			transitionMenu(900, -900);
			setTimeout(hideTitle, 250);
		}, 250
	);
}

function hideTitle(){
	menu.style.opacity = 0;
	overlay.style.opacity = 0;
	setTimeout(startGame, 250);
}

function startGame(){
	state = 2;
	menu.innerHTML = '';
	titletop.innerHTML = '';
	titlebottom.innerHTML = '';
	addEventListeners();
	controls.style.display = 'block';
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


function addEventListeners(){
	leftBtn.addEventListener('touchstart', leftTap);
	leftBtn.addEventListener('mousedown', leftTap);
	rightBtn.addEventListener('touchstart', rightTap);
	rightBtn.addEventListener('mousedown', rightTap);
	centralBtn.addEventListener('touchstart', centerTap);
	centralBtn.addEventListener('mousedown', centerTap);

	window.addEventListener('touchend', e => {
		leftPressed = false;
		spacePressed = false;
		rightPressed = false;
	});
	window.addEventListener('mouseup', e => {
		leftPressed = false;
		spacePressed = false;
		rightPressed = false;
	});
}

function fullscreenCheck(e){
	fff = document.fullscreenElement;
	//drawUserInterface();
}

// fullscreen handler
// -----------------
function toggleFullscreen(e){
	if(e==1) fullscreenCanceled = fff;
	let d = document.documentElement;//document.msFullscreenElement
	if (!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement))
		(d.requestFullscreen || d.mozRequestFullScreen || d.webkitRequestFullScreen ||
			d.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)/*|| d.msRequestFullscreen*/).call(d);
	else if(document.exitFullscreen) document.exitFullscreen();
	else if(document.mozCancelFullScreen) document.mozCancelFullScreen();
	else if(document.webkitCancelFullScreen) document.webkitCancelFullScreen();
	//else if(document.msExitFullscreen) document.msExitFullscreen();
}

function resize(e){
	resizeStage(e);
	resizeStage(e);
	//gameWidth = parseInt(game.getBoundingClientRect().width);
	//gameHeight = parseInt(game.getBoundingClientRect().height);
}
function resizeStage(e){
	width = document.documentElement["clientWidth"];
	height = document.documentElement["clientHeight"];
	//offsetX = parseInt(gameCanvas.getBoundingClientRect().left);
	//offsetY = parseInt(gameCanvas.getBoundingClientRect().top);
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
	spacePressed = !spacePressed;
}

function rightTap() {
	rightPressed = true;
}

function updateMenuID(plusOrMinus = 1){
	if(!powerArr[menuID] || (menuID==11 && !monet)) menuID += plusOrMinus;
	if(menuID < 0) menuID = powerArr.length+(menuID==11 && !monet?1:0) + menuID;
	if(menuID > powerArr.length-1) menuID = menuID-powerArr.length+(menuID==11 && !monet?1:0);
	if(!powerArr[menuID]) menuID = 0;
	document.getElementById('shipname').innerHTML = shipTitles[menuID];
}

function keyDownHandler(e) {
	destinationX = -1;
	destinationY = -1;
	if(!state || state == 1) {
		if(e.keyCode == 13 || e.keyCode == 32) pickMenu();
	}

	/*if(e.keyCode == 49) {
		if(pwr<6) pwr ++;
		//console.log("pwr:"+pwr);
	}*/

	/*if(e.keyCode == 50) {
		changeWeapons();
	}*/

	/*if(e.keyCode == 51) {
		debugger;
	}*/
	
	if(e.keyCode == 32) {
		spacePressed = true;
	}
	
	if(e.keyCode == 39 || e.keyCode == 68) {
		rightPressed = true;
		if(state<2) {
			menuID ++;
			updateMenuID();
			updateStats();
			if(state==1) {state=0;pickMenu();}
		}
	}
	if(e.keyCode == 37 || e.keyCode == 65) {
		leftPressed = true;
		if(state<2) {
			menuID --;
			updateMenuID(-1);
			updateStats();
			if(state==1) {state=0;pickMenu();}
		}
	}
	if(e.keyCode == 38 || e.keyCode == 87) {
		upPressed = true;
		if(state<2) {
			menuID -=6;
			updateMenuID(-1);
			updateStats();
			if(state==1) {state=0;pickMenu();}
		}
	}
	if(e.keyCode == 40 || e.keyCode == 83) {
		downPressed = true;
		if(state<2) {
			menuID += 6;
			updateMenuID();
			updateStats();
			if(state==1) {state=0;pickMenu();}
		}
	}
	if(e.keyCode == 80 || e.keyCode == 27) {
		if(state == 1) {
			state = 0;
			showMenu(1);
		} else 
		if(running)
			running = false;
		else {
			running = true;
			requestAnimationFrame(draw);
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
	if(e.keyCode == 38 || e.keyCode == 87) {
		upPressed = false;
	}
	if(e.keyCode == 40 || e.keyCode == 83) {
		downPressed = false;
	}
	if(e.keyCode == 32) {
		spacePressed = false;
	}
}

/*function changeWeapons(){
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
}*/

function generate() {
	for(let i = 0; i < 1000; i++) {

		let type = i % 2 ? 0 : 1 + parseInt(random()*4) - 1;
		let poly = (!type) ? 5 + parseInt(random()*3) : 1;
		let enemy = [
			parseInt(type),                                // enemy type
			poly,                                          // for mines - number of polygons
			(!type) ? poly==5 ? 2 : 4 : 5*type + type * type,   // health
			(!type) ? 25 : 70,                             // size
			type == 2 ? 1.5 : type + 2 + (poly==5 ? 2+random()*3 : 0)        // speed
		];

		if (enemy[0]) {
			powerup = {
				a:       0,
				x:       parseInt(gameCanvas.width*.05+random()*gameCanvas.width*0.9),
				y:      -50,
				type:    1+(i<startArray.length?startArray[i]:powerupsArray[i-startArray.length]),
				size:    40,
				timeout: parseInt((i*500)+100*Math.random()*i),
				speed:   1+Math.random()*2,
				offset:  random()-0.5
			};
			powerups.push(powerup);
		}

		enemies.push({
			a:         0,         // enemy exploding
			type:      enemy[0],  // type
			x:         parseInt(gameCanvas.width*0.05+random() * gameCanvas.width * 0.9),
			y:        -150,
			z:         enemy[1],  // for mines - the number of polygons
			health:    enemy[2],
			maxHealth: enemy[2],
			size:      enemy[3],
			speed:     enemy[4],
			animation: 5 + enemy[0]*2,
			timeout:   10* i * 5,
			alpha:     1,
			cargo:     enemy[0] ? [powerups.length-1] : []
		});
	}

	//for(let i=1; i<level*10; i++) {
		
		/*for(let i = 0; i < enemies.length; i++){
			enemy = enemies[i];
			if(enemy.size==60 && !enemy.cargo.length && enemy.timeout>=powerup.timeout){
				enemy.cargo.push(c-1);
				enemy.health*=level;
				enemy.maxHealth*=level;
				enemy.speed*=.75;
				break;
			}
		}*/
	//}
}

/*function addShadow(ctx, y, x, c){
	ctx.shadowColor = c || "#000";
	ctx.shadowOffsetY = y || 0;
	ctx.shadowOffsetX = x || 0;
}*/

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
	len = missiles.length-1;
	for(let i = len; i >= 0; i--){
		missile = missiles[i];
		if(missile.pulse != -1) {
			if (missile.pulse > 0) {
				missile.pulse --;
			} else {
				missiles.splice(i,1);
				len = missiles.length-1;
			}
		}
		if (missile.pulse == -1) {
			missile.moveByAngle();
			if (missile.y < 0 || missile.y > gameCanvas.height || missile.x < 0 || missile.x > gameCanvas.width) {
				missiles.splice(i,1);
				len = missiles.length-1;
			} else
			if (!missile.type) {
				if(missile.angle>0.1||missile.angle<-0.1) missile.angle*=0.5;
			} else
			if (missile.type==4 || missile.type==1) {
				missile.speed*=1.01;
				missile.angle*=0.9;
			}
			if(missile.type == 1 && missile.pulse > -1) missile.angle=360*random();
		}
	}
	len = enemyMissiles.length-1;
	for(let i = len; i >= 0; i--){
		missile = enemyMissiles[i];
		missile.moveByAngle();
		if(missile.y < 0 || missile.y > gameCanvas.height || missile.x < 0 || missile.x > gameCanvas.width) {
			enemyMissiles.splice(i,1);
			len = enemyMissiles.length-1;
		}
	}
}
function drawMissiles(){
	if(missiles.length){
		len = missiles.length;
		for(let i = 0; i < len; i++){
			drawMissile(i);
		}
	}
}
function drawEnemyMissiles(){
	if(enemyMissiles.length){
		len = enemyMissiles.length;
		for(let i = 0; i < len; i++){
			drawEnemyMissile(i);
		}
	}
}
function drawMissile(i){
	missile = missiles[i];
	if(missile.pulse > -1) missile.blow(drawExplosion, missile.type==3 ? missile.pulse / missile.blowSize < .25 ? .5 : 0.1+missile.pulse / missile.blowSize : 0.1+missile.pulse / missile.blowSize);
	missile.draw(drawUnit, gameContext, 0, effectsContext);
}
function drawEnemyMissile(i){
	missile = enemyMissiles[i];
	missile.draw(drawUnit, gameContext, 0, effectsContext);
}

function movePowerups(){
	for(let i = 0; i<powerups.length; i++){
		powerup = powerups[i];
		if(powerup.type){
			if(powerup.a){
				powerup.y += powerup.speed*globalSpeed;
				if(powerup.y > gameCanvas.height+powerup.size){
					powerup.type=0;
					powerup.a=0;
				}
			}
		}
	}
}
function drawPowerups(){
	for(let i = 0; i<powerups.length; i++){
		powerup = powerups[i];
		if(powerup.type && powerup.a){
			gameContext.beginPath();
			gameContext.arc(powerup.x-powerup.size/(powerup.type==2||powerup.type==5?4:3), powerup.y-powerup.size/2, powerup.size/(powerup.type==2||powerup.type==5?1.75:1.5), 0, Math.PI*2);
			gameContext.fillStyle = (powerup.type==1) ? "#CC2939" : (powerup.type==2) ? "#199919" : (powerup.type==5) ? "#0095DD" : "#59aa89";
			gameContext.fill();
			gameContext.closePath();
			gameContext.font = "bold 28px Arial";
			gameContext.fillStyle = "#ffffff";
 			gameContext.fillText(["A","+","+","S","M","R"][powerup.type-1], powerup.x-powerup.size*[.54,.51,.52,.62,.51][powerup.type-1], powerup.y-powerup.size*.25);
		}
	}
}

function moveEnemies() {
	len = enemies.length;
	for(let i = 0; i < len; i++) {
		enemy = enemies[i];
		if(enemy.health){
			if(step > enemy.timeout){
				enemy.y += enemy.speed*globalSpeed;
				if(enemy.y > gameCanvas.height+enemy.size){// an enemy has passed the full height of the screen
					enemy.y = -200;
					enemy.timeout += 500+level*100;
					enemy.health = enemy.maxHealth;
					enemy.x = parseInt(gameCanvas.width*0.05+random()*gameCanvas.width*0.9);
				}
			}
		}
	}
}

function drawEnemies() {
	for(let i = 0; i < enemies.length; i++){
		enemy = enemies[i];
		if(enemy.y > -149 && (enemy.health || enemy.a>1)){
			// enemy is exploding
			if(!enemy.type) {//console.log(enemy.)
				gameContext.save();
				gameContext.translate(enemy.x, enemy.y);
				gameContext.globalAlpha = enemy.alpha;
				let k = (enemy.z==5) ?  1 : 2;
				if (k==1 && step%2==0) gameContext.scale(-1, 1);
				gameContext.rotate(Math.radians(k-1 ? (enemy.x%2==0 ? step : -step) % 360 : 230 + (step%2==0 ? random()*20 : 10)));
				gameContext.beginPath();
				gameContext.moveTo(enemy.size/2 * Math.cos(0), enemy.size/2 * Math.sin(0));
				for (let j = 1; j <= enemy.z; j ++) {
					gameContext.lineTo(enemy.size/k*Math.cos(j*2*Math.PI/enemy.z), enemy.size/k*Math.sin(j*2*Math.PI/enemy.z));
				}
				gameContext.closePath();
				gameContext.strokeStyle = "#990000";
				gameContext.lineWidth = 10*k - parseInt((enemy.size-25)/2);
				gameContext.stroke();
				gameContext.fillStyle = "#DD3333";
				gameContext.fill();
				gameContext.closePath();
				gameContext.globalAlpha = 1/k*enemy.alpha;
				gameContext.fillStyle = "#ff8888";
				gameContext.beginPath();
				gameContext.moveTo(0, 0);
				if(enemy.health>0) {
					gameContext.lineTo(0, -10*k);
					gameContext.lineTo(10*k, 0);
				}
				if(enemy.health>1){
					gameContext.lineTo(-10*k, 0);
					gameContext.lineTo(0, 10*k);
				}
				if(enemy.health>2) {
					gameContext.lineTo(0, -10*k);
					gameContext.lineTo(-10*k, 0);
				}
				if(enemy.health>3){
					gameContext.lineTo(0, 10*k);
					gameContext.lineTo(10*k, 0);
				}
				gameContext.fill();
				gameContext.closePath();
				gameContext.globalAlpha = 1;
				gameContext.translate(0,0);
				gameContext.restore();
			} else {
				if (enemy.a>0) gameContext.globalAlpha = enemy.a/30;
				drawUnit(gameContext, enemy.type, enemy.type, 2, enemy.animation, enemy.x, enemy.y - enemy.size/2, true, size);
				gameContext.globalAlpha = 1;

				// draw health bar
				gameContext.rect(enemy.x-2, enemy.y + 5, 4, ((enemy.size/enemy.maxHealth)*enemy.maxHealth)/2);
				gameContext.fillStyle = "#990000";
				gameContext.fill();
				gameContext.closePath();
				gameContext.beginPath();
				gameContext.rect(enemy.x-2, enemy.y + 5 + ((enemy.size/enemy.maxHealth)*(enemy.maxHealth-enemy.health))/2, 4, ((enemy.size/enemy.maxHealth)*enemy.health)*.9/2);
				gameContext.fillStyle = "#ffffff";
				gameContext.fill();
				gameContext.closePath();
			}
			
			// enemy is exploding
			if(enemy.a>1){
				enemy.a--;
				if(enemy.a<20){
					enemy.y += enemy.speed*0.75;
					enemy.size += 1;
					enemy.alpha -= 0.05;
					addEffect(enemy, weaponType, 1, (enemy.a%2==0 && enemy.a>8 ? 10 : 6), (enemy.a>8 ? enemy.a<16 ? enemy.a - 4 : 5 : 1 + enemy.a));
				} else {
					enemy.y+=enemy.speed*0.9;
					enemy.x+=random()*4-2;
					enemy.y+=random()*4-2;
					if(enemy.a%2==0) addEffect(enemy, weaponType, 2, 6, 3 + random() * 3);
				}
			}
		}
	}
}

function addEffect(element, type, del, total, size, offsetx = 0, offsety = 0){
	effects.push({
		x:     offsetx+element.x+10+(element.size*random()*2)-element.size/del,
		y:     offsety+element.y+(element.size*random()*2)-element.size/del,
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
			effectColors1[effect.type],
			effectColors2[effect.type],
			1.5 - effect.frame / effect.total
		);

		if(effect.frame >= effect.total) {
			effect.frame = 0;
			effects.splice(i, 1);
		}
	}
}

function drawExplosion(x, y, s, c1 = 'yellow', c2 = 'red', a = 1) {
	effectsContext.beginPath();
	effectsContext.globalAlpha = a;
	effectsContext.arc(x, y, s, 0, 2 * Math.PI, false);
	effectsContext.fillStyle = c1;
	effectsContext.fill();
	effectsContext.lineWidth = 2;
	effectsContext.strokeStyle = c2;
	effectsContext.stroke();
	effectsContext.closePath();
	effectsContext.globalAlpha = 1;
}

function draw() {
	bgrContext.clearRect(0, 0, bgrCanvas.width, bgrCanvas.height);
	moveBgr();
	if(playing) {
		if(destinationX > -1){
			if(destinationX - shipX < -shipSpeed/2) {
				leftPressed = true;
				rightPressed = false;
			} else if(destinationX - shipX > shipSpeed/2) {
				leftPressed = false;
				rightPressed = true;
			} else {
				destinationX = -1;
				leftPressed = false;
				rightPressed = false;
			}
		}
		if(destinationY > -1){
			if(destinationY - shipY < -shipSpeed/2) {
				upPressed = true;
				downPressed = false;
			} else if(destinationY - shipY > shipSpeed/2) {
				upPressed = false;
				downPressed = true;
			} else {
				destinationY = -1;
				upPressed = false;
				downPressed = false;
			}
		}
		step++;
		if(changeTime) changeTime --;

		gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
		effectsContext.clearRect(0, 0, bgrCanvas.width/5, bgrCanvas.height/5);
		drawEffects();

		moveMissiles();
		drawMissiles();
		drawEnemyMissiles();

		moveEnemies();
		drawEnemies();

		movePowerups();
		drawPowerups();

		drawShip();

		collisionDetection();

		drawFPS();
		let pwrstep;
		if(missileCurrentCount) {
			missileCurrentCount ++;
			if(missileCurrentCount >= missileInterval) missileCurrentCount = 0;
		}
		if(spacePressed && !complete && health > 0 && !missileCurrentCount) {
			missileCurrentCount = 1;
			if(!weaponType) {
				missiles.push(getCannon(0, -38, weaponType));
			}
			else
			if(weaponType == 1) {
				if(!pwr || pwr % 2 == 0) {
					missiles.push(getCannon(0, -38, weaponType));
					for(pwrstep = 2; pwrstep <= 1+pwr/2; pwrstep++) {
						let offsetY = (pwrstep-1)*(pwrstep-1) * 2;
						missiles.push(getCannon(-16*pwrstep+16, -40 + offsetY, weaponType));
						missiles.push(getCannon(16*pwrstep-16, -40 + offsetY, weaponType));
					}
				} else if(pwr == 1 || pwr % 2 != 0) {
					for(pwrstep = 1; pwrstep <= 1+pwr/2; pwrstep++) {
						let offsetY = pwrstep*pwrstep * 2;
						missiles.push(getCannon(-16*pwrstep+8, -40 + offsetY, weaponType));
						missiles.push(getCannon(16*pwrstep-8, -40 + offsetY, weaponType));
					}
				}
			}
			else
			if(weaponType == 2 || weaponType == 6) {
				missiles.push(new PlayerLaser(
										shipX + random()*pwr - pwr/2,
										shipY-shipRadius,
										0,
										missileSpeed,
										missileSize,
										pwr,
										weaponType
									)
				);
			}
			else 
			if(weaponType == 3 || weaponType == 11){
				missiles.push(new PlayerBlob(shipX, shipY-22, 0, missileSpeed, missileSize, pwr, 3));
			}
			
			else 
			if(weaponType == 4 || weaponType == 10){
				for(pwrstep = 0; pwrstep < pwr; pwrstep++){
					missiles.push(new PlayerMissile(shipX - (weaponType == 10?10:0), shipY, (pwrstep%2?-pwrstep:pwrstep)*20*random(), missileSpeed+missileSpeed*parseInt(random()*20)/20, missileSize, pwr));
					if(weaponType == 10) missiles.push(new PlayerMissile(shipX + (weaponType == 10?10:0), shipY, (pwrstep%2?-pwrstep:pwrstep)*20*random(), missileSpeed+missileSpeed*parseInt(random()*20)/20, missileSize, pwr));
				}
			}
			else
			if(weaponType == 5 || weaponType == 9){
				if(!pwr || pwr % 2 == 0 || weaponType == 9) {
					missiles.push(getBlob(0,0,0));
					for(pwrstep = 2; pwrstep <= 1+pwr/2; pwrstep++) {
						missiles.push(getBlob(0,0, -15*pwrstep+16));
						missiles.push(getBlob(0,0, 15*pwrstep-16));
						if(weaponType == 9) break;
					}
				} else if(pwr == 1 || pwr % 2 != 0) {
					for(pwrstep = 1; pwrstep <= 1+pwr/2; pwrstep++) {
						missiles.push(getBlob(0,0, -15*pwrstep+7.5));
						missiles.push(getBlob(0,0, 15*pwrstep-7.5));
					}
				}
			}
			else 
			if(weaponType == 7){
				missiles.push(new PlayerMissile(shipX-20, shipY, 0, missileSpeed, missileSize, pwr));
				missiles.push(new PlayerMissile(shipX+20, shipY, 0, missileSpeed, missileSize, pwr));
				if (pwr>1) {
					missiles.push(new PlayerMissile(shipX-60, shipY+30, 0, missileSpeed, missileSize, pwr));
					missiles.push(new PlayerMissile(shipX+60, shipY+30, 0, missileSpeed, missileSize, pwr));
				}
			}
			else 
			if(weaponType == 8){
				missiles.push(new PlayerLaser(
										shipX + random()*pwr - pwr/2,
										shipY-shipRadius,
										leftPressed ? -30 : rightPressed ? 30 : 0,
										missileSpeed,
										missileSize,
										pwr,
										weaponType
									)
				);
			}
		}

		if(rightPressed && shipX < gameCanvas.width-shipRadius) {
			shipX += shipSpeed;
		}
		if(leftPressed && shipX > shipRadius) {
			shipX -= shipSpeed;
		}
		if(upPressed && shipY > gameCanvas.height/6) {
			shipY -= shipSpeed;
		}
		if(downPressed && shipY < gameCanvas.height-shipRadius*1.5) {
			shipY += shipSpeed;
		}
	}

	if(running) requestAnimationFrame(draw);
}

function getCannon(x, y, weaponType, r){
	return new PlayerCannon(shipX+x, shipY+y, r || 0, missileSpeed, missileSize, pwr, weaponType);
}

function getBlob(x, y, r){
	return new PlayerBlob(shipX+x, shipY+y, r, missileSpeed, missileSize, pwr, 5);
}

function checkForDeath(enemy, missile) {
	let type;
	if (!missile) type = 1;
	if(enemy.health < 0) enemy.health = 0;
	if(!enemy.health) {
		enemy.a = (type == 3 && enemy.type) || (!enemy.type && !type) ? 50 : 30;
		if(enemy.cargo.length) {
			powerups[enemy.cargo[0]].x = enemy.x;
			powerups[enemy.cargo[0]].y = enemy.y;
			powerups[enemy.cargo[0]].a = 1;
		}
	}
	
	if(!enemy.health) {
		score+=(enemy.maxHealth>5?parseInt(enemy.maxHealth/5)+4:2)*5;
	}

	//checkGameOver();
}

function collisionDetection(i, len2, len) {
	len = enemies.length;
	for(let i = 0; i < len; i++) {
		enemy = enemies[i];
		if(enemy.health && !invulnerable){
			if(circlesColliding(enemy.x, enemy.y, enemy.size, shipX, shipY, shipRadius)) {
				enemy.health = 0;
				enemy.a = 25;
				checkForDeath(enemy);
			}
		}
	}
	len2 = missiles.length - 1;
	for(let i = len2; i >= 0; i--) {
		missile = missiles[i];
		for(let j = 0; j < len; j++) {
			enemy = enemies[j];
			if(enemy.health && missile.pulse == -1) {
				if(circlesColliding(missile.x, missile.y - (missile.type==2 ? 60 : missile.type==26 ? 40 : 20), missile.size, enemy.x, enemy.y, enemy.size)) {
					enemy.health -= missileDamage + (missile.type == 1 ? 0 : missileDamage*pwr);
					missile.pulse = missile.blowSize;

					if (missile.type == 3 || missile.type == 4) {
						for(let k = 0; k < len; k++) {
							let enemy2 = enemies[k];
							if (enemy2.health) {
								if (circlesColliding(missile.x, missile.y - 20, missile.size*5*pwr/(missile.type==4?2:1), enemy2.x, enemy2.y, enemy2.size)) {
									enemy2.health -= missileDamage + (missile.type == 1 ? 0 : missileDamage*pwr/4);
									checkForDeath(enemy2, missile);
								}
							}
						}
					}
					
					addEffect(missile, weaponType, 1, 6, 4 + random() * 2, 0, missile.type==1 ? random()*-40 : 0);

					if(missile.type == 3) {
						addEffect(missile, weaponType, 1, 6, 4 + random()*4, -2 + random()*4, -2 + random()*4);
						addEffect(missile, weaponType, 1, 6, 4 + random()*4, -2 + random()*4, -2 + random()*4);
					}
					
					if(enemy.health<=0 && missile.type==6) {
						addEffect(missile, weaponType, 1, 6, 9 + random() * 2, 0, missile.type==1 ? random()*-40 : 0);
						missiles.push(new PlayerLaser(
								missile.x,
								missile.y-shipRadius/2,
								-30,
								missileSpeed,
								missileSize,
								pwr * (5+enemy.maxHealth+pwr) / 5,
								6
							)
						);
						missiles.push(new PlayerLaser(
								missile.x,
								missile.y-shipRadius/2,
								30,
								missileSpeed,
								missileSize,
								pwr * (5+enemy.maxHealth+pwr) / 5,
								6
							)
						);
					}

					checkForDeath(enemy, missile);
				}
			}
		}
	}

	for(let i = enemyMissiles.length-1; i >= 0; i--){
		missile = enemyMissiles[i];
		if(!invulnerable){
			/*if(circlesColliding(missile.x, missile.y, missile.size, shipX, shipY, shipRadius*.8)){
				if(shield>10) {
					shield-= 10;
					invulnerable = 5;
					enemyMissiles.splice(i,1);
					shielded = true;
				}
			}*/
			if(circlesColliding(missile.x, missile.y, missile.size, shipX, shipY, shipRadius*0.6)) {
				health -= 10;//-=(10 - shield);
				//hurt = true;
				//shielded = true;
				//shield = 0;
				//invulnerable = 5;
				enemyMissiles.splice(i, 1);
				//checkGameOver();
			}
		}
	}

	for(let i = 0; i < powerups.length; i++) {
		powerup = powerups[i];
		if(powerup.type){
			if(isColliding(powerup.x, powerup.y, powerup.size, shipX, shipY, shipRadius*2)) {
				if(powerup.type==1){//P
					if(powerArr[weaponType]<6) powerArr[weaponType] ++;
					pwr = powerArr[weaponType];
					poweredArr[0]++;
				} else if(powerup.type==2){//H
					if(health == healthMax && health < 99) {
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
					poweredArr[1]++;
				} else if(powerup.type==3){//M
					if(shield == shieldMax && shield < 99) {
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
					poweredArr[4]++;
				} else if(powerup.type==4){//S
					shipspeedArr[weaponType] += 0.5;
					shipSpeed = shipspeedArr[weaponType];
					poweredArr[2]++;
				} else if(powerup.type==5){//M
					missilesizeArr[weaponType] += 0.5;
					missileSize = missilesizeArr[weaponType];
					poweredArr[3]++;
				} else if(powerup.type==6){//M
					missilespeedArr[weaponType] += 0.5;
					missileSpeed = missilespeedArr[weaponType];
					if(missileintervalArr[weaponType]>2) missileintervalArr[weaponType] -= 0.5;
					missileInterval = missileintervalArr[weaponType];
					poweredArr[5]++;
				}
				powerup.type=0;
				score+=50;
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

/*function generateRandomSprites() {
	for(i = 0; i < 38; i++) getRandomSprite();
}

function getRandomSprite() {
	// Tiny Sprite Sheet Generator by KilledByAPixel
	// https://codepen.io/KilledByAPixel/pen/ZEWyRwO
	let seed, x, R, i, j, pass, s, X, Y;
	seed = Date.now(); // seed for random generaton, can be replaced with hardcoded value

	let context = getSpriteCanvas(16, 16)[1];
	allSprites.push(context);
	context.lineWidth = 2;

	R = () => (Math.sin(++s + i*i) + 1)*1e9 % 256 | 0; // get a seeded random integer between 0-256
	i = Math.random();
	pass = 1;
	for(pass = 4; pass--;)                                // 4 passes, outline left/right and fill left/right
	for(s = seed, j = R()/5 + 50|0; j--;)                 // set seed, randomize max sprite pixels, 50-101
	  X = j&7, Y = j>>3,                                  // X & Y pixel index in sprite
	  R() < 19 ?                                          // small chance of new color
	    context.fillStyle = `rgb(${R()},${R()},${R()})` : // randomize color
	    Math.pow(R(), 2) / 2e3 > X*X +  Math.pow(Y-5, 2) &&                  // distance from center vs random number
	       context[pass&2 ? 'strokeRect' : 'fillRect'](   // stroke first for outline then fill with color
	          7 - pass%2*2*X + X,                         // x pos, flipped if pass is even
	          2 + (i>>5)*16 + Y,                          // y pos
	          1, 1);
}*/

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
	bgrContext.fillStyle = "#33aaDD";
	bgrContext.fillText("FPS: "+fps, 10, 22);
	bgrContext.font = "bold 32px Arial";
	bgrContext.fillText("SPEED: "+globalSpeed.toFixed(2), 175, 22);
	bgrContext.font = "bold 32px Arial";
	bgrContext.fillText("SCORE: "+score, 425, 22);
}




/*function writeNextLevel(){
	score = inscore;// + bonus;
	prescore = score;
	//console.log(score, bonus, inscore)
	menuCanvas.removeEventListener("click", writeNextLevel);
	writeHash(level+=1);
	location.reload();
}*/

function getValue(i) {
	return parseInt(i/16).toString(16) + (i%16).toString(16);
}

function readHash() {
	try {
		hash = online?window.top.location.hash:window.location.hash;
		//console.log(hash);
		if (hash) {return
			straight = !parseInt(hash.charAt(3));
			level = parseInt(hash.charAt(4), 16);
			weaponType = parseInt(hash.charAt(5), 16);
			changeTime = parseInt(hash.charAt(6) + hash.charAt(7), 16);
			shieldGain = parseInt(hash.charAt(8), 16);
			arrays = [];
			for(let i = 9; i < hash.length; i += powerArr.length*2) {
				//console.log(i, hash.substr(i, powerArr.length*2));
				let arr = [];
				for(let j = 0; j < powerArr.length*2; j += 2) {
					//console.log(hash.substr(i + j, 2));
					arr.push(parseInt(hash.substr(i + j, 2), 16) );// / 4
				}
				arrays.push(arr);
				let len = arrays.length;
				if(!len) powerArr = arr;
				else if(len==1) shipradiusArr = arr;
				else if(len==2) shipspeedArr = arr;
				else if(len==3) missilespeedArr = arr;
				else if(len==4) missilesizeArr = arr;
				else if(len==5) missileintervalArr = arr;
				else if(len==6) missiledamageArr = arr;
				else if(len==7) healthmaxArr = arr;
				else if(len==8) healthmaxiniArr = arr;
				else if(len==9) shieldmaxArr = arr;
				else if(len==10) shieldmaxiniArr = arr;
				//else if(len==11) killedArr = arr;
				//else if(len==12) poweredArr = arr;
			}
			console.log(arrays);

			/*
			straight = !parseInt(hash.charAt(3));
			level = parseInt(hash.charAt(4));
			weaponType = parseInt(hash.charAt(5));
			changeTime = parseInt(hash.charAt(6) + hash.charAt(7), 16);
			shieldGain = parseInt(hash.charAt(8), 16);
			power = [parseInt(hash.charAt(12), 16), parseInt(hash.charAt(13), 16), parseInt(hash.charAt(14), 16), parseInt(hash.charAt(15), 16)];
			shipspeed = [parseInt(hash.charAt(16) + hash.charAt(17), 16)/4, parseInt(hash.charAt(18) + hash.charAt(19), 16)/4, parseInt(hash.charAt(20) + hash.charAt(21), 16)/4, parseInt(hash.charAt(22) + hash.charAt(23), 16)/4];
			shipradius = [parseInt(hash.charAt(24) + hash.charAt(25), 16), parseInt(hash.charAt(26) + hash.charAt(27), 16), parseInt(hash.charAt(28) + hash.charAt(29), 16), parseInt(hash.charAt(30) + hash.charAt(31), 16)];
			misslespeed = [parseInt(hash.charAt(32) + hash.charAt(33), 16)/4, parseInt(hash.charAt(34) + hash.charAt(35), 16)/4, parseInt(hash.charAt(36) + hash.charAt(37), 16)/4, parseInt(hash.charAt(38) + hash.charAt(39), 16)/4];
			missleinterval = [parseInt(hash.charAt(40) + hash.charAt(41), 16)/4, parseInt(hash.charAt(42) + hash.charAt(43), 16)/4, parseInt(hash.charAt(44) + hash.charAt(45), 16)/4, parseInt(hash.charAt(46) + hash.charAt(47), 16)/4];
			misslesize = [parseInt(hash.charAt(48) + hash.charAt(49), 16)/4, parseInt(hash.charAt(50) + hash.charAt(51), 16)/4, parseInt(hash.charAt(52) + hash.charAt(53), 16)/4, parseInt(hash.charAt(54) + hash.charAt(55), 16)/4];
			healthmax = [parseInt(hash.charAt(56) + hash.charAt(57), 16), parseInt(hash.charAt(58) + hash.charAt(59), 16), parseInt(hash.charAt(60) + hash.charAt(61), 16), parseInt(hash.charAt(62) + hash.charAt(63), 16)];
			shieldmax = [parseInt(hash.charAt(64) + hash.charAt(65), 16), parseInt(hash.charAt(66) + hash.charAt(67), 16), parseInt(hash.charAt(68) + hash.charAt(69), 16), parseInt(hash.charAt(70) + hash.charAt(71), 16)];
			healthmaxini = [parseInt(hash.charAt(56) + hash.charAt(57), 16), parseInt(hash.charAt(58) + hash.charAt(59), 16), parseInt(hash.charAt(60) + hash.charAt(61), 16), parseInt(hash.charAt(62) + hash.charAt(63), 16)];
			shieldmaxini = [parseInt(hash.charAt(64) + hash.charAt(65), 16), parseInt(hash.charAt(66) + hash.charAt(67), 16), parseInt(hash.charAt(68) + hash.charAt(69), 16), parseInt(hash.charAt(70) + hash.charAt(71), 16)];
			updateStats();*/
			

			//score = parseInt(hash.substr(72));
			//prescore = score;
			//console.log(weaponType,"\npower:\n", power, "\nshipspeed:\n", shipspeed, "\nmisslespeed:\n", misslespeed, "\nmissleinterval:\n", missleinterval, "\nmisslesize:\n", misslesize, healthmax, shieldmax);

		} else level = 1;
	} catch(err){console.log(err)}
}

function writeHash(newlevel) {
	//if(inscore + bonus) score = parseInt(inscore + bonus);
	if(!newlevel){} else {
		if(newlevel>0) level = newlevel;
	}
	try {
		let newHash = 'a='+(newlevel>0?'0':'1') + level + weaponType + getValue(changeTimeLimit*2) + shieldGain.toString(16);
		
		for(let j = 0; j < arrays.length; j++) {
			for(let i = 0; i < powerArr.length; i++) {
				let value = arrays[j][i];//*4;
				if(value > 255) value = 255;
				newHash += getValue(value);
			}
		}
		//newHash += parseInt(prescore).toString();
		if(online) window.top.location.hash = newHash; else window.location.hash = newHash;
	} catch(err){console.log(err);}
}
