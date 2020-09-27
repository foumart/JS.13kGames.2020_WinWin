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
let online = (window.location.protocol == "http:" || window.location.protocol == "https:");

let size = 5;// value in Missile.js as well
let starSize;
let starSpeed;
let level = 0;
let complete = 0;
let score = 0;

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
	poweredArr;

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

let shipWeapons =           [
	'Cannon',
	'Gun',
	'Laser',
	'ShockWave',
	'Rocket',
	'Blaster',
	'Zapper',
	'Beam', 'Plasma', 'Fusion', 'Launcher', 'Railgun'];

let shipTitles = [
	'Raptor', 'Rogue', 'Viper', 'Nightflyer', 'Valkyre', 'Hunter', 'Discoverer', 'Scout', 'Wraith', 'Rocinante', 'Phoenix', 'Coil'
];

let shipNames =             ['A', 'G', 'L', 'Y', 'V', 'T', 'X', 'S', 'W', 'O', 'F', 'C'];

function resetStats(arrays) {//    1    2    3    4    5    6    7    8    9    10   11
	arrays = [//              ^    ^^   |    ()   A    8    |    /\
		indexArr =           [1,   4,   3,   2,   5,   6,   7,  10,   15,  3,   9,   11 ],
		colorArr =           [1,   1,   3,   1,   4,   2,   3,   4,   1,   1,   4,   1  ],

		powerArr =           [1,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   1  ],
		shipradiusArr =      [70,  75,  60,  70,  80,  70,  75,  60,  80,  78,  80,  78 ],
		shipspeedArr =       [6,   5,   5.5, 5,   4,   4.5, 6,   6.5, 4,   5,   4.5, 7  ],
		missilespeedArr =    [20,  15,  40,  12,  3,   20,  25,  30,  8,   16,  6,   18 ],
		missilesizeArr =     [5,   3,   2.5, 8,   12,  6,   4,   5,   6,   7,   10,  7  ],
		missileintervalArr = [10,  18,  3,   30,  40,  20,  15,  25,  8,   25,  35,  16 ],
		missiledamageArr =   [1,   1.5, 0.5, 3,   5,   2,   1.5, 2.5, 2.75,2.25,3,   2  ],
		healthmaxArr =       [75,  100, 60,  80,  100, 80,  80,  70,  90,  75,  90,  105],
		healthmaxiniArr =    [75,  100, 60,  80,  100, 80,  80,  60,  90,  75,  90,  105],
		shieldmaxArr =       [10,  15,  10,  25,  20,  10,  30,  5,   20,  15,  20,  15 ],
		shieldmaxiniArr =    [10,  15,  10,  25,  20,  10,  30,  5,   20,  15,  20,  15 ],
		poweredArr =         [0,   0,   0,   0,   0,   0,   0]
	];
	return arrays;
}
arrays = resetStats();

function updateStats(){
	if(monet && !powerArr[11]) powerArr[11] = 1;
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
	spriteData += ship1 + ship2 + ship1 + ship2 + ship1 + ship2 + ship1 + ship2 + ship1 + ship2 + ship1 + ship2 + ship1;

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
	buffer();
	generateMenu();
	generate();
	window.addEventListener("resize", resize, false);
	resize();
	showMenu();
	draw();

	overlay.addEventListener(event, pickMenu, {passive: true});

	document.addEventListener("fullscreenchange", fullscreenCheck);
	if (standalone && !fff && !fullscreenCanceled) {
		console.log("[Event] Requesting Fullscreen mode...");
		toggleFullscreen();
	}

	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);

	requestAnimationFrame(checkMonetization);

	standalone = window.matchMedia('(display-mode: standalone)').matches;
	if(standalone) console.log("[Event] Game is running as Standalone PWA.");

	overlay.focus();
}

function checkMonetization() {
	if(document.monetization){
		console.log("[Event] Web Monetization state:", document.monetization.state);
		if(document.monetization.state == "started") monet = 1;
		else document.monetization.addEventListener("monetizationstart",
			evt => {
				console.log("[Event] Monetization event:", document.monetization.state);
				if (!monet) {
					monet = 1;
					updateStats();
					state = 0;
					central.innerHTML = "";
					showMenu(1);
				}
			}
		);
	} else {
		console.log("[Event] Monetization not found");
		if(step < 100)
			requestAnimationFrame(checkMonetization);
	}
}

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
	let Y1 = y + (!spd ? s==1?0:i<6?S+1:id==7?-2:2 : ((step/spd)|0)%4==0?S:((step/spd)|0)%2==0?-S:0);
	let Y2 = y + (i>7 && id<8? 2 : i<8&&id>6 ? 2 : s==1?0:2) + (!spd ? 0 : ((step/spd)|0)%4==0?-S:((step/spd)|0)%2==0?S:0)-1;

	ctx.save();
    if(i>7) ctx.scale(1, -1);
	ctx.drawImage(z ? images[id][clr] : imagesMirrored[id][clr], X1, Y1*(i>7?-1:1), 12*S, (i>7?-1:1)*24*S);
	ctx.drawImage(z ? imagesMirrored[id][clr] : images[id][clr], X2, Y2*(i>7?-1:1), 12*S, (i>7?-1:1)*24*S);
	ctx.restore();
}

function drawShip() {
	gameContext.globalAlpha = 0.25;
	gameContext.beginPath();
	gameContext.fillStyle = invulnerable && step%2==0 ? 'red': 'blue';
	gameContext.arc(shipX, shipY, shipRadius, 0, 2 * Math.PI, false);
	gameContext.fill();
	gameContext.lineWidth = 5;
	gameContext.strokeStyle = invulnerable && step%2==0 ? '#f03': '#03f';
	gameContext.stroke();
	gameContext.closePath();
	gameContext.globalAlpha = 1;
	drawUnit(gameContext, weaponType, indexArr[weaponType], colorArr[weaponType], 0, shipX, shipY - shipRadius + (weaponType>8 ? 20 : 0), indexArr[weaponType]>6, size);
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
	if (skip) menuCount = 0;
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
			let html = "Pick a ship: &nbsp;<span id=shipname>" + shipTitles[weaponType] + "</span>" + brk + brk;
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
			if(!monet)
				divs[11].className = "saturate";

			setTimeout(() => {
				if(!menuCount) menuCount = 1;
				animateMenuCursor();
			}, 100);

		}, !skip ? 1350 : 500
	);
}

function animateMenuCursor(){
	gameContext.clearRect(0, 0, bgrCanvas.width, bgrCanvas.height);
	if(!state) {
		if (menuCount) {
			menuCount ++;
			let k = menuID < 6 ? menuID : menuID - 6;
			let l = menuID < 6 ? 664 : 880;
			gameContext.beginPath();
			gameContext.rect(70+k*160, l, 156, 156);
			gameContext.strokeStyle = menuCount%2==0?'#fff':'grey';
			gameContext.setLineDash([menuCount%(menuCount%2)==0, menuCount%(menuCount%3), menuCount%(menuCount%4)]);
			gameContext.lineWidth = menuCount%2==0?4:6;
			gameContext.stroke();
			gameContext.closePath();
			requestAnimationFrame(animateMenuCursor);
		}
	} else gameContext.setLineDash([]);
}

function updatePiece(element, left, top, height, width){
	if (width) {
		element.style.width = width + 'px';
		element.style.height = height + 'px';
		element.style.left = left + 'px';
		element.style.top = top + 'px';
	}
}

function pickMenu(evt) {
	if (!state) {
		let weaponCheck = evt!=-1&&evt ? Array.from(evt.target.parentNode.parentNode.children).indexOf(evt.target.parentNode)-3 : menuID;
		if (evt && weaponType != weaponCheck) {
			weaponType = weaponCheck;
			menuID = weaponType;
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
		html += "&nbsp; ____ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Stage: " + (level+1) + brk + brk;
		html += "Health: "+bar((weaponType == 2 ? 5 : healthMax-60) / 5) + brk;
		html += "Shield: "+bar(1 + shieldMax / 5) + brk;
		html += "&nbsp;Speed: "+bar(parseInt((shipSpeed-3.5))*2) + brk;
		html += "&nbsp; Size: " + bar(1+parseInt((shipRadius-50) / 6)) + brk + brk + brk + brk + brk;
		html += "Weapon: " + shipWeapons[weaponType] + brk + brk;
		html += "Level: " + powerArr[weaponType] + " / 6" + brk + brk;
		html += "&nbsp; &nbsp; &nbsp;<div id='buttons'>[ < ][ > ][ ESC ]</div>"+brk+brk+"<div id='proceed'>[ SPACE / ENTER ]</div>";

		central.innerHTML = html;

		let canvas = drawShipMenu(central, weaponType, indexArr[weaponType], colorArr[weaponType])[0];
		canvas.style.left = "55%";
		canvas.style.top = "45%";
		canvas.style.width = "400px";
		canvas.style.height = "400px";

	} else if(state == 4 && !playing)
		reset(true);
	else if(state == 3) {
		if (evt && evt.offsetX < 420) leftTap(); else if (evt && evt.offsetX > 680) rightTap();
	}
	else
		hideMenu();
}

function hideMenu(){
	state = 2;
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

function startGame() {
	generate();
	state = 3;
	effectsCanvas.style.opacity = 1;
	bgrCanvas.style.opacity = 1;
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
	leftBtn.addEventListener(event, leftTap, {passive: true});
	rightBtn.addEventListener(event, rightTap, {passive: true});
	centralBtn.addEventListener(event, centerTap, {passive: true});

	window.addEventListener(eventEnd, checkTapEnd);
}

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
}
function resizeStage(e){
	width = document.documentElement["clientWidth"];
	height = document.documentElement["clientHeight"];
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
	let count = 50;
	while(!powerArr[menuID] && count>0){
		if(menuID!= 11 || (menuID==11 && !monet))
			menuID += plusOrMinus;
		if(menuID < 0) menuID = powerArr.length-(monet?1:2);
		if(menuID > powerArr.length-1) menuID = 0;
		count--;
	}
	let shipname = document.getElementById('shipname');
	if (shipname)
		shipname.innerHTML = shipTitles[menuID];
}

function reset(nextLevel) {
	if (nextLevel) level ++;
	playing = false;
	state = 0;
	central.innerHTML = '';
	titletop.style.opacity = 1;
	titlebottom.style.opacity = 1;
	menu.style.opacity = 1;
	overlay.style.opacity = 1;
	controls.style.display = 'none';
	effectsCanvas.style.opacity = 0.5;
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

function keyDownHandler(e) {

	if(e.keyCode == 70){
		toggleFullscreen();
	}

	if(!state || state == 1) {
		if(e.keyCode == 13 || e.keyCode == 32) pickMenu();
	}

	// R
	if(state == 4 || e.keyCode == 82) {
		if(!running) togglePause();
		if(e.keyCode == 82 || e.keyCode == 13 || e.keyCode == 80 || e.keyCode == 27) {
			reset(state == 4);
		}
		return;
	}

	/*if(e.keyCode == 49) {
		if(pwr<6) {
			pwr ++;
			powerArr[weaponType] ++;
			console.log("pwr:"+pwr);
		}
		updateStats();
	}*/

	/*if(e.keyCode == 50) {
		changeWeapons();
	}*/

	/*if(e.keyCode == 51) {
		debugger;
	}*/

	if(e.keyCode == 32 && state == 3) {
		spacePressed = true;
	}

	if(e.keyCode == 67) {
		constantShoot = !constantShoot;
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
		//upPressed = true;
		if(state<2) {
			menuID -=6;
			updateMenuID(-1);
			updateStats();
			if(state==1) {state=0;pickMenu();}
		}
	}
	if(e.keyCode == 40 || e.keyCode == 83) {
		//downPressed = true;
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
			central.innerHTML = '';
			showMenu(1);
		} else if(state == 3) {
			togglePause();
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

	step = 0;
	missiles = [];
	enemies = [];
	powerups = [];
	effects = [];
	master = true;
	perfect = true;

	let count = 0;
	let limit = (pwr<3?1:level);
	let high, type, poly, enemy;

	for(let i = 0; i < 100+50*limit; i++) {
		high = i<75 ? 1+parseInt(random()*2) : 1 + parseInt(random()*(1+limit));
		type = i % 2 || i < 20 || (i>90&&i%3==0) ? 0 : high;
		poly = (!type) ? 5 + parseInt(random()*3) : 1;
		enemy = [
			parseInt(type),                                // enemy type
			poly,                                          // for mines - number of polygons
			(!type) ? poly==5 ? 2 : 4 : type + 5*type + type * type,   // health
			(!type) ? 25 : 70,                             // size
			type == 2 ? 1.5 : (limit==1?1:type) + 1 + level*0.2 + (poly==5 ? 2+random()*3 : 1)        // speed
		];

		if (enemy[0] && count-startArray.length < powerupsArray.length) {
			high = (count<startArray.length ? startArray[count++] : powerupsArray[count++-startArray.length]);
			powerup = {
				txt:     "."+['png','mov','jpg','doc','gif','avi','mp3','wav','rar','zip','bin','iso','dat','mp4','ico','bmp','txt','pdf','exe'][parseInt(random()*17.9)],
				a:       0,
				type:    high,
				size:    40,
				speed:   high ? 2+random()*2 : 1
			};
			powerups.push(powerup);
		}

		enemies.push({
			a:         0,         // enemy exploding
			type:      enemy[0],  // type
			x:         parseInt(gameCanvas.width*0.05+random() * gameCanvas.width * 0.9),
			y:        -150,
			z:         enemy[1],  // for mines - the number of polygons
			color:     2,
			health:    enemy[2],
			maxHealth: enemy[2],
			size:      enemy[3],
			speed:     enemy[4],
			animation: 5 + enemy[0]*2,
			timeout:   10 * i * 5 * (i > 100 ? 0.75 : 1),
			alpha:     1,
			cargo:     enemy[0] ? count-startArray.length < powerupsArray.length ? powerups.length-1 : 0 : 0
		});
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
	len = missiles.length;
	let missilesToRemove = [];
	for(let i = 0; i < len; i++){
		missile = missiles[i];
		if(missile.pulse != -1) {
			if (missile.pulse > 0) {
				missile.pulse --;
			} else
				missilesToRemove.push(missile);
		} else {
			missile.moveByAngle();
			if (missile.y < 0 || missile.y > gameCanvas.height || missile.x < 0 || missile.x > gameCanvas.width)
				missilesToRemove.push(missile);

			if (!missile.type) {
				if(missile.angle>0.1||missile.angle<-0.1)
					missile.angle*=0.5;
			} else
			if (missile.type==4 || missile.type==1) {
				missile.speed*=1.01;
				missile.angle*=0.9;
			}

			if(missile.type == 1 && missile.pulse > -1)
				missile.angle=360*random();
		}
	}
	for(let i = 0; i < missilesToRemove.length; i++){
		missiles.splice(missiles.indexOf(missilesToRemove[i]), 1);
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
function drawMissile(i){
	missile = missiles[i];
	if(missile.pulse > -1) missile.blow(drawExplosion, missile.type==3 ? missile.pulse / missile.blowSize < 0.25 ? 0.5 : 0.1+missile.pulse / missile.blowSize : 0.1+missile.pulse / missile.blowSize);
	missile.draw(drawUnit, gameContext, 0, effectsContext);
}

function movePowerups(){
	for(let i = 0; i<powerups.length; i++){
		powerup = powerups[i];
		if(powerup.a){
			if(powerup.type<1)
				powerup.a++;
			powerup.y += powerup.speed*globalSpeed;
			if(powerup.y > gameCanvas.height+powerup.size || powerup.a>150){
				powerup.type=0;
				powerup.a=0;
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
 			gameContext.fillText([powerup.txt,".Att",".Hp+",".Sh+",".Sp+",".Sz+",".Ms"][powerup.type], powerup.x-powerup.size, powerup.y-powerup.size*0.25);
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

function drawEnemies() {
	for(let i = 0; i < enemies.length; i++){
		enemy = enemies[i];
		if(enemy.y > -149 && (enemy.health || enemy.a>1)){
			if(!enemy.type) {
				gameContext.save();
				gameContext.translate(enemy.x, enemy.y);
				gameContext.globalAlpha = enemy.alpha;
				let k = (enemy.z==5) ?  1 : 2;
				if (k==1 && step%2==0) gameContext.scale(-1, 1);
				gameContext.rotate(Math.radians(k-1 ? (enemy.x%2==0 ? step : -step) % 360 : 230 + (step%2==0 ? random()*20 : 10)));
				gameContext.beginPath();
				gameContext.strokeStyle = "#900";
				gameContext.lineWidth = 10*k - parseInt((enemy.size-25)/2);
				gameContext.moveTo(enemy.size/2 * Math.cos(0), enemy.size/2 * Math.sin(0));
				for (let j = 1; j <= enemy.z; j ++) {
					gameContext.lineTo(enemy.size/k*Math.cos(j*2*Math.PI/enemy.z), enemy.size/k*Math.sin(j*2*Math.PI/enemy.z));
				}
				gameContext.stroke();
				gameContext.fillStyle = "#d33";
				gameContext.fill();
				gameContext.closePath();
				gameContext.globalAlpha = 1/k*enemy.alpha;
				gameContext.beginPath();
				gameContext.fillStyle = "#f88";
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
				gameContext.globalAlpha = enemy.alpha * (enemy.a ? enemy.a/30 : 1);
				drawUnit(gameContext, enemy.type, enemy.type, enemy.color, enemy.animation, enemy.x, enemy.y - enemy.size/2, true, size);
				gameContext.globalAlpha = 1;

				// draw health bar
				gameContext.beginPath();
				gameContext.fillStyle = "#900";
				gameContext.rect(enemy.x-2, enemy.y + 5, 4, ((enemy.size/enemy.maxHealth)*enemy.maxHealth)/2);
				gameContext.fill();
				gameContext.closePath();
				gameContext.beginPath();
				gameContext.fillStyle = "#fff";
				gameContext.rect(enemy.x-2, enemy.y + 5 + ((enemy.size/enemy.maxHealth)*(enemy.maxHealth-enemy.health))/2, 4, ((enemy.size/enemy.maxHealth)*enemy.health)*0.9/2);
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
		step++;
		if(changeTime) changeTime --;
		if(invulnerable) invulnerable--;

		gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
		effectsContext.clearRect(0, 0, bgrCanvas.width/5, bgrCanvas.height/5);
		drawEffects();

		moveMissiles();
		drawMissiles();

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
		if((spacePressed || constantShoot) && !complete && health > 0 && !missileCurrentCount && state == 3) {
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
				missileCurrentCount += (weaponType == 11 ? pwr : pwr*2);
				missiles.push(new PlayerBlob(shipX, shipY-22, weaponType == 11 ? (leftPressed ? 5 : rightPressed ? -5 : 0) + pwr - random()*pwr*2 : 0, missileSpeed-1 + (weaponType==3?0.5:0.2)*pwr, missileSize, pwr, 3));
			}

			else
			if(weaponType == 4 || weaponType == 10){
				if(weaponType == 4) missileCurrentCount += pwr*3;
				missiles.push(new PlayerMissile(shipX, shipY-30, 0, missileSpeed, missileSize, pwr));
				if(weaponType == 10) {
					for(pwrstep = 0; pwrstep < parseInt(pwr/2); pwrstep++) {
						let r = random();
						missiles.push(new PlayerMissile(shipX + (r<0.5?-30:30), shipY-20, (r<0.5?-pwrstep:pwrstep)*20*r, missileSpeed/2+missileSpeed*parseInt(r*10)/20, missileSize, pwr));
					}
				}
			}
			else
			if(weaponType == 5 || weaponType == 9){
				if(!pwr || pwr % 2 == 0 || weaponType == 9) {
					if(weaponType == 9 && pwr > 3){
						missiles.push(getBlob(-30,0,-1));
						missiles.push(getBlob(30,0,1));
					} else {
						missiles.push(getBlob(0,0,0));
					}
					for(pwrstep = 2; pwrstep <= 1+pwr/2; pwrstep++) {
						missiles.push(getBlob(weaponType==9 ? -40 : 0, 0, -15*pwrstep+16));
						missiles.push(getBlob(weaponType==9 ? 40 : 0,0, 15*pwrstep-16));
						if(weaponType == 9) break;
					}
				} else if(pwr == 1 || pwr % 2 != 0) {
					for(pwrstep = 1; pwrstep <= 1+pwr/2; pwrstep++) {
						missiles.push(getBlob(0,0, -15*pwrstep+7.5));
						missiles.push(getBlob(0,0, 15*pwrstep-7.5));
					}
				}
				if(weaponType == 9 || pwr > 4) {
					missiles.push(getBlob(0,0, -90));
					missiles.push(getBlob(0,0, 90));
				}
			}
			else
			if(weaponType == 7){
				if (pwr==1 || pwr >= 3) {
					missiles.push(new PlayerMissile(shipX-30+(pwr==3||pwr==4?8:0), shipY, 0, missileSpeed, missileSize, pwr));
					missiles.push(new PlayerMissile(shipX+30-(pwr==3||pwr==4?8:0), shipY, 0, missileSpeed, missileSize, pwr));
				}
				if (pwr==2 || pwr>=3 ) {
					missiles.push(new PlayerMissile(shipX-60, shipY+30, 0, missileSpeed, missileSize, pwr));
					missiles.push(new PlayerMissile(shipX+60, shipY+30, 0, missileSpeed, missileSize, pwr));
				}
				if(pwr==2 || pwr>4) missiles.push(new PlayerMissile(shipX, shipY-30, 0, missileSpeed, missileSize, pwr));
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
		/*if(upPressed && shipY > gameCanvas.height/6) {
			shipY -= shipSpeed;
		}
		if(downPressed && shipY < gameCanvas.height-shipRadius*1.5) {
			shipY += shipSpeed;
		}*/
	}

	if(running) requestAnimationFrame(draw);
	else {// paused
		effectsContext.globalAlpha = 0.6;
		effectsContext.fillStyle = "#000";
		effectsContext.rect(0, 0, gameCanvas.width/5, gameCanvas.height/5);
		effectsContext.fill();
		effectsContext.globalAlpha = 1;
		effectsContext.font = "bold 12px Arial";
		effectsContext.fillStyle = "#fff";
 		effectsContext.fillText("Game paused", 72, 160);
	}
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
		if(enemy.cargo) {
			powerups[enemy.cargo].x = enemy.x;
			powerups[enemy.cargo].y = enemy.y;
			powerups[enemy.cargo].a = 1;
		}
	}

	if(!enemy.health) {
		score+=(enemy.maxHealth>5?parseInt(enemy.maxHealth/5)+4:2)*5;
	}

	checkGameOver();
}

function checkGameOver(){
	let hasEnemies;
	let len = enemies.length;
	for(let i = 0; i < len; i++) {
		enemy = enemies[i];
		if(enemy.health) {
			hasEnemies = true;
			break;
		}
	}
	if(health <= 0 || !hasEnemies) {
		state = 4;
		let timeout = setTimeout(
			()=> {
				clearTimeout(timeout);
				if (playing) {
					central.innerHTML = "";
					playing = false;
					leftPressed = false;
					rightPressed = false;
					spacePressed = false;
					gameContext.beginPath();
					gameContext.globalAlpha = 0.6;
					gameContext.fillStyle = "#000";
					gameContext.rect(0, 0, gameCanvas.width, gameCanvas.height);
					gameContext.fill();
					gameContext.globalAlpha = 1;
					gameContext.closePath();
					gameContext.font = "92px Arial";
					gameContext.fillStyle = "#fff";
					gameContext.fillText("Stage Cleared!", 230, 460);
					gameContext.font = "64px Arial";
					let bonus = -1;
					let hidden = [];
					for(let i = 0; i < powerArr.length; i++){
						if (!powerArr[i]) {
							bonus = i;
							hidden.push(i);
						}
					}

					if(hidden.length>6) {
						bonus = hidden[parseInt(random()*hidden.length-1)];
					}
					if(bonus > -1) {
						let canvas = drawShipMenu(central, bonus, indexArr[bonus], colorArr[bonus])[0];
						canvas.style.left = "36%";
						canvas.style.top = "240px";
						canvas.style.width = "320px";
						canvas.style.height = "320px";
						overlay.style.opacity = 1;
						if (master) gameContext.fillText("Master!", 50, 1000);
						if (perfect) gameContext.fillText("Perfect!", 800, 1000);
						gameContext.fillText("You found a missing game file!", 115, 650);
						gameContext.fillText(shipNames[bonus]+".png", 440, 750);
						powerArr[bonus] = 1;
					}
					gameContext.fillText("Tap screen for Menu", 255, 1400);
					effectsCanvas.style.opacity = 0.5;
					bgrCanvas.style.opacity = 0.5;
				}
			}, 3000
		);
	}
}

function collisionDetection(i, len2, len) {
	len = enemies.length;
	for(let i = 0; i < len; i++) {
		enemy = enemies[i];
		if(enemy.y > 800 && enemy.health && !invulnerable){
			if(circlesColliding(enemy.x, enemy.y, enemy.size, shipX, shipY, shipRadius)) {
				master = false;
				enemy.health = 0;
				enemy.a = 50;
				checkForDeath(enemy);
				invulnerable = 50;
			}
		}
	}
	len2 = missiles.length - 1;
	for(let i = len2; i >= 0; i--) {
		missile = missiles[i];
		for(let j = 0; j < len; j++) {
			enemy = enemies[j];
			if(enemy.y > -50 && enemy.health && missile.pulse == -1) {
				if(circlesColliding(missile.x, missile.y - (missile.type==2 ? 60 : missile.type==6 ? 40 : 20), missile.size + (missile.type%3==0?missile.type+pwr:missile.type==11?2*pwr:0), enemy.x, enemy.y, enemy.size)) {
					enemy.health -= missileDamage + (pwr-1)*missileDamage/(!missile.type||missile.type==6?0.3:missile.type==9||missile.type==11?0.5:2) + missileDamage*missileDamage;
					missile.pulse = missile.blowSize;

					if (missile.type > 2 && missile.type < 5 && missile.y>100) {
						for(let k = 0; k < len; k++) {
							let enemy2 = enemies[k];
							if (enemy2.health) {
								if (circlesColliding(missile.x, missile.y - 20, missile.size*5*pwr/(missile.type==4?3:1), enemy2.x, enemy2.y, enemy2.size)) {
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
