var canvas, ctx, state = 0, width, height, width1, height1, x, y, needRedraw = true;
var button_start, button_records, button_about, buttons_themes = [], button_menu;
var image_menu, image_theme, image_playing, image_card, image_cardOpen, image_records, image_gameover, image_cards = [];
var sound_levelUp, sound_correct, sound_error, sound_cardFlip, sound_click, sound_clockTicking, sound_lostGame;

var level, levelInitialized = false, score, score1, canOpen = false, time, timeout, timeoutd, cardX, cardY, card1 = -1, card2 = -1, theme, points = 0;

var lx, ly, ltime, ltime1;

var name;

var done = 0, total = 0;

var levels = [
	{x: 2, y: 2, time: 1, time1: 25},
	{x: 3, y: 2, time: 1.5, time1: 30},
	{x: 4, y: 2, time: 2, time1: 35},
	{x: 5, y: 2, time: 2.5, time1: 40},
	{x: 5, y: 2, time: 2.25, time1: 35},
	{x: 4, y: 3, time: 2.75, time1: 45},
	{x: 4, y: 3, time: 2.5, time1: 40},
	{x: 4, y: 4, time: 3, time1: 55},
	{x: 4, y: 4, time: 2.75, time1: 50},
	{x: 5, y: 4, time: 3.5, time1: 60}];

var cards = [];

function verifyLoaded(i, type, loader){

	if(type==0){
		if(loader.filesObjects[i].complete==true){done+=loader.files[i].size; loader.loaded++; requestRedraw();}else{
		setTimeout(function(){verifyLoaded(i, 0, loader)}, 300);}
	}	
	if(loader.loaded==loader.files.length){
		state = 1; requestRedraw(); setTimeout(function(){sound_levelUp.play();}, 300);
	}
}

function loader(){
	this.files = [];
	this.filesObjects = [];
	this.loaded = 0;
	
	this.load = function(){
		for(var i=0; i<this.files.length; i++){
				this.filesObjects[i].src = this.files[i].url;
				verifyLoaded(i, this.files[i].type, this);
		}
	}
	this.addFile = function(url, type, size){
		var i = this.files.length;
				
		if(type==0){this.files.push({url: url, type: type, size: size}); this.filesObjects[i] = new Image(); total+=size;}
		if(type==1){this.filesObjects[i] = new Audio(url);}
		
		return this.filesObjects[i];
	}
}

function button(posX, posY, width, height, value, style){
	this.x = posX;	this.y = posY;
	this.width = width;	this.height = height;
	this.value = value;	this.style = style;
	this.mode = 0;
		
	this.draw = function(){
		switch(this.style){
			case 0:
				if(this.mode==0){ctx.fillStyle = "red";}else{ctx.fillStyle = "rgb(159, 0, 0)";}
				ctx.fillRect(_x(this.x)+x, _y(this.y)+y, _x(this.width), _y(this.height));
				if(this.mode==0){ctx.fillStyle = "white";}else{ctx.fillStyle = "lightgray";}
				break;
			case 1:
				if(this.mode==0){ctx.fillStyle = "blue";}else{ctx.fillStyle = "darkblue";}
				ctx.fillRect(_x(this.x)+x, _y(this.y)+y, _x(this.width), _y(this.height));
				if(this.mode==0){ctx.fillStyle = "white";}else{ctx.fillStyle = "lightgray";}
				break;
			case 2:
				if(this.mode==0){ctx.fillStyle = "rgb(255, 201, 14)";}else{ctx.fillStyle = "rgb(206, 159, 0)";}
				ctx.fillRect(_x(this.x)+x, _y(this.y)+y, _x(this.width), _y(this.height));
				if(this.mode==0){ctx.fillStyle = "black";}else{ctx.fillStyle = "white";}			
				break;
		}
		ctx.font = (_y(this.height)*0.6)+"px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(this.value, _x(this.x)+x+_x(this.width)/2, _y(this.y)+y+_y(this.height)/2);

	}
	
	this.onclick = function(){};
	
	this.verifyClick = function(posX, posY, type){
		if(posX>_x(this.x)+x && posX<_x(this.x)+x+_x(this.width) && posY>_y(this.y)+y && posY<_y(this.y)+y+_y(this.height)){
			if(type==0){this.mode = 1; this.draw();}
			if(type==1 && this.mode==1){this.mode = 0; this.draw(); sound_click.play(); this.onclick();}
		}else{
			if(type==1 && this.mode==1){this.mode = 0; this.draw();}
		}
	}
}

var loader = new loader();

window.onload = function(){
	canvas = document.getElementById('game');
	ctx = canvas.getContext('2d');
	
	if(ctx){
		resize();
		window.onresize = resize;
		window.onmousedown = mousedown;
		window.onmouseup = mouseup;
		canvas.ontouchstart = touch;
		canvas.ontouchend = touch;
		canvas.ontouchcancel = touch;
		canvas.ontouchleave = touch;
		canvas.ontouchmove = touch;

		window.oncontextmenu = function(){return false;}

		button_start = new button(30, 40, 40, 16, 'Jogar', 0);
		button_start.onclick = function(){state = 2; requestRedraw();}
		
		button_records = new button(30, 58, 40, 7, 'Records', 1);
		button_records.onclick = function(){state = 3; requestRedraw();}
		

		var themesName = ['Todos', 'Transportes', 'Frutas', 'Animais', 'Objetos', 'Comidas', 'Letras', 'Números'];
		var i = 0;
		
		for(var y = 0; y<4; y++){
			for(var x = 0; x<2; x++){
				buttons_themes[i] = new button(20+30*x, 44+6*y, 29, 5, themesName[i], 2);
				buttons_themes[i].id = i;
				
				buttons_themes[i].onclick = function(){theme = this.id; score = 0; score1 = 0; level = 1; state = 5; initLevel();}
				i++;
			}
		}
		
		button_menu = new button(40.5, 77, 19, 7, 'Voltar', 1);
		button_menu.onclick = function(){state = 1; requestRedraw();}
		
		image_menu = loader.addFile('images/FastMemoryMenu.png', 0, 39);
		image_theme = loader.addFile('images/FastMemoryTheme.png', 0, 26.8);
		image_playing = loader.addFile('images/FastMemoryPlaying.png', 0, 6.23);
		image_records = loader.addFile('images/FastMemoryRecords.png', 0, 27.9);
		image_gameover = loader.addFile('images/FastMemoryGameover.png', 0, 26.4);
		image_card = loader.addFile('images/card.png', 0, 38.3);
		image_cardOpen = loader.addFile('images/cardOpen.png', 0, 12.9);
		
		image_cards[0] = loader.addFile('images/cards15.png', 0, 377);
		image_cards[1] = loader.addFile('images/cards27.png', 0, 76.5);
		image_cards[2] = loader.addFile('images/cards10.png', 0, 38.5);
		
		sound_levelUp = loader.addFile('sounds/levelUp.mp3', 1, 12);
		sound_correct = loader.addFile('sounds/correct.mp3', 1, 4.75);
		sound_error = loader.addFile('sounds/error.mp3', 1, 3.1);
		sound_cardFlip = loader.addFile('sounds/cardFlip.mp3', 1, 12.1);
		sound_click = loader.addFile('sounds/click.mp3', 1, 2.58);
		sound_clockTicking = loader.addFile('sounds/clockTicking.mp3', 1, 312);
		sound_lostGame = loader.addFile('sounds/lostGame.mp3', 1, 17);
			
		loader.load();		
			
	}
}

function _x(x){
	return Math.floor(x/100*width1);
}

function _y(y){
	return Math.floor(y/100*height1);
}

function convertToMin(seg){
	var min = Math.floor(seg/60000);
	var seg1 = seg/1000-min*60;
	
	if(min<10){min = '0'+min;}
	if(seg1<10){seg1 = '0'+seg1;}
	
	return min+':'+seg1;
}

function drawTimeScore(){
	if(time>0){
		
		time-=1000;
		score+=100;
		
		ctx.drawImage(image_playing, 50, 20, 10, 25, _x(60)+x, _y(4)+y, _x(30), _y(5));
		ctx.drawImage(image_playing, 50, 20, 10, 25, _x(10)+x, _y(4)+y, _x(30), _y(5));
		
		ctx.font = _y(4)+"px Arial";
		ctx.fillStyle = "white";
		ctx.textBaseline = "middle";
		
		ctx.textAlign = "left";
		ctx.fillText(Math.floor(score), _x(11)+x, _y(6.5)+y);
		ctx.textAlign = "right";
		ctx.fillText(convertToMin(time), _x(89)+x, _y(6.5)+y);		
		
	setTimeout(drawTimeScore, 30);}else{sound_clockTicking.pause();  if (!isNaN(sound_clockTicking.duration)){sound_clockTicking.currentTime = 0;}
		setTimeout(function(){if(state==5){sound_levelUp.play(); level++; initLevel();}}, 1000);}	
}

function timeToScore(){
	if(state==5){
		clearTimeout(timeout);
		score1 = score + time/10;
		drawTimeScore();
	}
}

function drawTime(){
	time-=1000;
	
	ctx.drawImage(image_playing, 50, 20, 10, 22, _x(64)+x, _y(4)+y, _x(25), _y(4.5));
	
	ctx.font = _y(4)+"px Arial";
	ctx.fillStyle = "white";
	ctx.textBaseline = "middle";

	ctx.textAlign = "right";
	ctx.fillText(convertToMin(time), _x(89)+x, _y(6.5)+y);	
	
	if(time==10000){sound_clockTicking.play();}
		
	if(time==0){
		clearTimeout(timeout);
		canOpen = false;
		sound_lostGame.play();
		
		setTimeout(function(){
			state = 6;
						
			for(var i = 0; i<=records.length; i++){
				if(!records[i] || score>records[i][1]){
					if(i<10){name = prompt("PARABÉNS! VOCÊ ENTROU PARA O RECORD!! \n\n - Qual é o seu nome?\n ", ""); state = 3;}
					if(name=='null' || name==''){name=convidado;}
					records.splice(i, 0, [name, score]);
					
					document.getElementById('name').value=name;
					document.getElementById('score').value=score;
					document.getElementById('add').submit();
					
					break;
				}
			}
			
			requestRedraw();},1000);}
			
	else{timeout = setTimeout(drawTime, 1000);}
	
}

function flipCard(posX, posY){
	var id = posY*lx+posX;
	
	if(cards[id].state3==1){
		sound_cardFlip.play();	
		cards[id].state1*=-1;
		canOpen = false;
		drawCard(posX, posY);
	}
}

function hideCard(posX, posY){
	var id = posY*lx+posX;

	cards[id].state3=0;
	canOpen = false;
	drawCard(posX, posY);
}

function drawScore(){
	if((score1-score)>5 || (score1-score)<-5){score = score+(score1-score)/2;}else{score = score1;}
	
	ctx.drawImage(image_playing, 50, 20, 10, 22, _x(11)+x, _y(4)+y, _x(25), _y(4.5));
	
	ctx.font = _y(4)+"px Arial";
	ctx.fillStyle = "white";
	ctx.textBaseline = "middle";

	ctx.textAlign = "left";
	ctx.fillText(Math.floor(score), _x(11)+x, _y(6.5)+y);
	
	if(score!=score1){setTimeout(drawScore, 25);}
}

function drawCard(posX, posY){
	
	var id = posY*lx+posX;

	if(cards[id].state!=cards[id].state1 || cards[id].state2!=cards[id].state3){
		if(cards[id].state<cards[id].state1){cards[id].state+=0.1;if(cards[id].state>cards[id].state1){cards[id].state = cards[id].state1}}
		if(cards[id].state>cards[id].state1){cards[id].state-=0.1;if(cards[id].state<cards[id].state1){cards[id].state = cards[id].state1}}		
		
		if(cards[id].state2>cards[id].state3){cards[id].state2-=0.1;}
		if(cards[id].state2<0){cards[id] = 0;}
		
		ctx.fillStyle = "rgb(230, 230, 230)";
		
		var x1 = (100-16.25*lx)/2;
		var y1 = (102-18.75*ly)/2;

		ctx.fillRect(_x(x1+posX*16.25-0.625)+x, _y(y1+posY*20-0.625)+y, _x(16.25), _y(20));

		if(cards[id].state<0){
			ctx.drawImage(image_card, _x(x1+posX*16.25+7.5*(cards[id].state+1))+x, _y(y1+posY*20)+y, _x(-15*cards[id].state), _y(18.75));
		}else{
			if(cards[id].card<75){i = 0; cy = Math.floor(cards[id].card/15); cx = cards[id].card-cy*15;}
			else if(cards[id].card<102){i = 1; cy = 0; cx = cards[id].card-75;}
			else {i = 2; cy = 0; cx = cards[id].card-102;}
					
			ctx.drawImage(image_cardOpen, _x(x1+posX*16.25+7.5*(1-cards[id].state)+7.5*(1-cards[id].state2))+x, _y(y1+posY*20+9.375*(1-cards[id].state2))+y, _x(15*cards[id].state*cards[id].state2), _y(18.75*cards[id].state2));
			ctx.drawImage(image_cards[i], 200*cx, 250*cy, 200, 250, _x(x1+posX*16.25+7.5*(1-cards[id].state)+7.5*(1-cards[id].state2))+x, _y(y1+posY*20+9.375*(1-cards[id].state2))+y, _x(15*cards[id].state*cards[id].state2), _y(18.75*cards[id].state2));
		}
		
		timeoutd = setTimeout(function(){drawCard(posX, posY);}, 10);
	}else{
		if(!canOpen){
			if(card1 != -1 && card2 != -1){
				if(cards[card1].card == cards[card2].card){
					setTimeout(function(){
						var posY1 = Math.floor(card1/lx);
						var posX1 = (card1/lx-posY1)*lx;

						var posY2 = Math.floor(card2/lx);
						var posX2 = (card2/lx-posY2)*lx;							
						hideCard(posX1, posY1); hideCard(posX2, posY2);
						sound_correct.play();
						
						score1 = score+1000; drawScore(); points++; if(points==(lx*ly)/2){setTimeout(timeToScore, 1000);}else{canOpen = true;}
						
						card1 = -1; card2 = -1;
						
					}, 200);}
				else{
					setTimeout(function(){
						var posY1 = Math.floor(card1/lx);
						var posX1 = (card1/lx-posY1)*lx;

						var posY2 = Math.floor(card2/lx);
						var posX2 = (card2/lx-posY2)*lx;	
						sound_error.play();
						
						score1 = score - 500; drawScore();
						
						flipCard(posX1, posY1);	flipCard(posX2, posY2);
						card1 = -1; card2 = -1;
						canOpen = true;
					}, 500);
				}
			}else{if(points!=(lx*ly)/2){canOpen = true;}}
		}
	}

}

function initLevel(){
	canOpen = false;
	card1 = -1; card2 = -1;
	levelInitialized = false;
	points = 0;
	
	cards = [];

	if(level<11){
		lx = levels[level-1].x; ly = levels[level-1].y;
		ltime = levels[level-1].time; ltime1 = levels[level-1].time1;}
	else {
		lx = 5; ly = 4;
		ltime = 3.5-0.25*(level-10); ltime1 = 60-5*(level-10);}
	
	requestRedraw();
	
	var q = lx * ly;

	var cardsD = [];
	var cardsF = [];
	var min, max;
	
	if(theme==0){min = 0; max = 112;}
	else if(theme<6){min = (theme-1)*15; max = min+15;}
	else if(theme==6){min = 75; max = 102;}
	else {min = 102; max = 112;}
	
	for(var c = min; c<max; c++){
		cardsD.push(c);
	}

	max = cardsD.length;

	for(var c1 = 0; c1<q/2; c1++){
		var rnd = Math.floor(Math.random() * max);
		cardsF.push(cardsD[rnd]);
		cardsF.push(cardsD[rnd]);
		cardsD.splice(rnd, 1);
		max--;
	}

	max = q;

	for(var c2 = 0; c2<q; c2++){
		var rnd = Math.floor(Math.random() * max);
		cards.push({card: cardsF[rnd], state: 1, state1: 1, state2: 1, state3: 1});
		cardsF.splice(rnd, 1);
		max--;
	}

	setTimeout(function(){
		levelInitialized = true;
		time = ltime1*1000;
		requestRedraw();
		setTimeout(function(){
			drawTime();
			for(var x = 0; x<lx; x++){
				for(var y = 0; y<ly; y++){			
					flipCard(x, y);
				}
			}}, ltime*1000);
		}, 2000);
}

function drawLoading(){
	ctx.fillStyle = "rgb(112, 146, 190)"
	ctx.fillRect(0, 0, width, height);
	
	ctx.fillStyle = "white"
	ctx.font = _y(10)+"px Arial";
	ctx.textAlign = "center";

	ctx.fillText("Carregando...", _x(50)+x, _y(45)+y);
	
	ctx.font = _y(4)+"px Arial";
	ctx.fillText(done.toFixed(2)+"KB/"+total.toFixed(2)+"KB", _x(50)+x, _y(55)+y);
	
}

function drawMenu(){
	ctx.fillStyle = "rgb(73, 46, 184)";
	ctx.fillRect(0, 0, width, height);
	
	ctx.drawImage(image_menu, _x(0)+x, _y(0)+y, _x(100), _y(100));

	ctx.font = _y(2.2)+"px Arial";
	ctx.fillStyle = "white";
	ctx.textBaseline = "middle";

	ctx.textAlign = "left";
	ctx.fillText("COPYRIGHT © 2017", _x(2), height-_y(6));
	ctx.fillText("FASTMEMORY por GUILHERME MARCELINO", _x(2), height-_y(3));
	
	button_start.draw();
	button_records.draw();
}

function drawTheme(){
	ctx.fillStyle = "rgb(73, 46, 184)";
	ctx.fillRect(0, 0, width, height);
	
	ctx.drawImage(image_theme, _x(0)+x, _y(0)+y, _x(100), _y(100));
	
	for(var i = 0; i<8; i++){
		buttons_themes[i].draw();
	}
	
	ctx.font = _y(2.2)+"px Arial";
	ctx.fillStyle = "white";
	ctx.textBaseline = "middle";
	
	ctx.textAlign = "left";
	ctx.fillText("COPYRIGHT © 2017", _x(2), height-_y(6));
	ctx.fillText("FASTMEMORY por GUILHERME MARCELINO", _x(2), height-_y(3));
	
	button_menu.draw();
}

function drawGameover(){
	ctx.fillStyle = "rgb(73, 46, 184)";
	ctx.fillRect(0, 0, width, height);
	
	ctx.drawImage(image_gameover, _x(0)+x, _y(0)+y, _x(100), _y(100));
	
	ctx.font = "Bold "+_y(9)+"px Arial";
	ctx.fillStyle = "black";
	ctx.textBaseline = "middle";
	
	ctx.textAlign = "center";
	ctx.fillText(Math.floor(score), _x(50)+x, _y(58)+y);	
	
	ctx.font = _y(2.2)+"px Arial";
	ctx.fillStyle = "white";
	ctx.textBaseline = "middle";

	ctx.textAlign = "left";
	ctx.fillText("COPYRIGHT © 2017", _x(2), height-_y(6));
	ctx.fillText("FASTMEMORY por GUILHERME MARCELINO", _x(2), height-_y(3));
	
	button_menu.draw();	
}

function drawRecords(){
	ctx.fillStyle = "rgb(73, 46, 184)";
	ctx.fillRect(0, 0, width, height);
	
	ctx.drawImage(image_records, _x(0)+x, _y(0)+y, _x(100), _y(100));
	
	ctx.font = _y(2.6)+"px Arial";
	ctx.fillStyle = "black";
	ctx.textBaseline = "middle";

	for(var i = 0; i<10; i++){
		if(records[i][0]==name){ctx.font = "Bold "+_y(2.6)+"px Arial";}else{ctx.font = _y(2.6)+"px Arial";}
		ctx.textAlign = "left";
		ctx.fillText((i+1)+" - "+records[i][0], _x(31)+x, _y(28+4.6*i)+y);
		ctx.textAlign = "right";
		ctx.fillText(records[i][1], _x(69)+x, _y(28+4.6*i)+y);
	}
	
	ctx.font = _y(2.2)+"px Arial";
	ctx.fillStyle = "white";

	ctx.textAlign = "left";
	ctx.fillText("COPYRIGHT © 2017", _x(2), height-_y(6));
	ctx.fillText("FASTMEMORY por GUILHERME MARCELINO", _x(2), height-_y(3));
	
	button_menu.draw();	
}

function drawGame(){

	if(levelInitialized){
		ctx.fillStyle = "rgb(73, 46, 184)";
		ctx.fillRect(0, 0, width, height);
	
		ctx.drawImage(image_playing, _x(0)+x, _y(0)+y, _x(100), _y(100));
	
		var x1 = (100-16.25*lx)/2;
		var y1 = (102-18.75*ly)/2;

		var id = 0;
		
		for(var cY = 0; cY<ly; cY++){
			for(var cX = 0; cX<lx; cX++){
				if(cards[id].state<0){
					ctx.drawImage(image_card, _x(x1+cX*16.25+7.5*(cards[id].state+1))+x, _y(y1+cY*20)+y, _x(-15*cards[id].state), _y(18.75));
				}else{
					if(cards[id].card<75){i = 0; cy = Math.floor(cards[id].card/15); cx = cards[id].card-cy*15;}
					else if(cards[id].card<102){i = 1; cy = 0; cx = cards[id].card-75;}
					else {i = 2; cy = 0; cx = cards[id].card-102;}
					
					ctx.drawImage(image_cardOpen, _x(x1+cX*16.25+7.5*(1-cards[id].state)+7.5*(1-cards[id].state2))+x, _y(y1+cY*20+9.375*(1-cards[id].state2))+y, _x(15*cards[id].state*cards[id].state2), _y(18.75*cards[id].state2));
					ctx.drawImage(image_cards[i], 200*cx, 250*cy, 200, 250, _x(x1+cX*16.25+7.5*(1-cards[id].state)+7.5*(1-cards[id].state2))+x, _y(y1+cY*20+9.375*(1-cards[id].state2))+y, _x(15*cards[id].state*cards[id].state2), _y(18.75*cards[id].state2));
				}
				id++;
			}
		}
		
		ctx.font = _y(4)+"px Arial";
		ctx.fillStyle = "white";
		ctx.textBaseline = "middle";
		
		ctx.textAlign = "left";
		ctx.fillText(Math.floor(score), _x(11)+x, _y(6.5)+y);
		ctx.textAlign = "right";
		ctx.fillText(convertToMin(time), _x(89)+x, _y(6.5)+y);
		ctx.font = "Bold "+_y(4)+"px Arial";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.fillText("LEVEL "+level, _x(50)+x, _y(6.5)+y);
	}else{
		ctx.fillStyle = "rgb(112, 146, 190)";
		ctx.fillRect(0, 0, width, height);

		ctx.fillStyle = "white"
		ctx.font = "Bold "+_y(7)+"px Arial";
		ctx.textAlign = "center";
		ctx.fillText("LEVEL "+level, _x(50)+x, _y(45)+y);
		ctx.font = _y(4)+"px Arial";
		ctx.fillText("Encontre todos os pares em "+ltime1+" segundos!", _x(50)+x, _y(55)+y);
	}

}

function redraw(){
	switch(state){
		case 0:
			drawLoading();
			break;
		case 1:
			drawMenu();
			break;
		case 2:
			drawTheme();
			break;
		case 3:
			drawRecords();
			break;
		case 5:
			drawGame();
			break;
		case 6:
			drawGameover();
			break;
	}
	needRedraw = true;
}

function requestRedraw(){
	if(needRedraw){needRedraw = false; redraw();}
}

function resize(){	
	width = document.body.clientWidth;
	height = document.body.clientHeight;
	
	if(width>height){
		width1 = height; x = (width-height)/2
	}else{
		width1 = width;	x = 0;}
		
	if(width<height){
		height1 = width; y = (height-width)/2
	}else{
		height1 = height; y = 0;}
		
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	
	requestRedraw();
}

function mousedown(event){
	event.preventDefault();
	
	var mouseX = event.x | event.pageX;
	var mouseY = event.y | event.pageY;

	switch(state){
		case 1:
			button_start.verifyClick(mouseX, mouseY, 0);
			button_records.verifyClick(mouseX, mouseY, 0);
			break;
		case 2:
			for(var i = 0; i<8; i++){
				buttons_themes[i].verifyClick(mouseX, mouseY, 0);
			}
		case 3:
		case 6:
		case 4:
			button_menu.verifyClick(mouseX, mouseY, 0);
			break;
		case 5:
			if(canOpen && levelInitialized){
				var x1 = (100-16.25*lx)/2;
				var y1 = (102-18.75*ly)/2;
				if(mouseX>=_x(x1)+x && mouseY>=_y(y1) && mouseX<=_x(x1+16.25*lx)+x && mouseY<=_y(y1+20*ly)+y){
					cardX = Math.floor((mouseX-_x(x1)-x-0.625)/_x(16.25));
					cardY = Math.floor((mouseY-_y(y1)-y-0.625)/_y(20));
				}
			}
			break;
	}
}

function mouseup(event){
	event.preventDefault();
	
	var mouseX = event.x | event.pageX;
	var mouseY = event.y | event.pageY;
	
	switch(state){
		case 1:
			button_start.verifyClick(mouseX, mouseY, 1);
			button_records.verifyClick(mouseX, mouseY, 1);
			break;
		case 2:
			for(var i = 0; i<8; i++){
				buttons_themes[i].verifyClick(mouseX, mouseY, 1);
			}
		case 3:
		case 6:
		case 4:
			button_menu.verifyClick(mouseX, mouseY, 1);
			break;
		case 5:
			if(canOpen && levelInitialized){
				var x1 = (100-16.25*lx)/2;
				var y1 = (102-18.75*ly)/2;
				if(mouseX>=_x(x1)+x && mouseY>=_y(y1) && mouseX<=_x(x1+16.25*lx)+x && mouseY<=_y(y1+20*ly)+y){
					var cardX1 = Math.floor((mouseX-_x(x1)-x-0.625)/_x(16.25));
					var cardY1 = Math.floor((mouseY-_y(y1)-y-0.625)/_y(20));

					if(cardX == cardX1 && cardY == cardY1 && cardX>=0 && cardX<lx  && cardY>=0 && cardY<ly){
						var id = cardY*lx+cardX;
						if(id!=card1 && cards[id].state2==1){
							if(card1==-1){card1 = id;}
								else{card2 = id;}
							flipCard(cardX, cardY);}
						}
			}}
			break;
	}
}	

function touch(evt) {
  evt.preventDefault();
  if (evt.touches.length > 1 || (evt.type == "touchend" && evt.touches.length > 0))
    return;

  var newEvt = document.createEvent("MouseEvents");
  var type = null;
  var touch = null;
  switch (evt.type) {
    case "touchstart":    type = "mousedown";    touch = evt.changedTouches[0];break;
    case "touchmove":        type = "mousemove";    touch = evt.changedTouches[0];break;
    case "touchend":        type = "mouseup";    touch = evt.changedTouches[0];break;
  }
  newEvt.initMouseEvent(type, true, true, window, 0,
    touch.screenX, touch.screenY, touch.clientX, touch.clientY,
    evt.ctrlKey, evt.altKey, evt.shirtKey, evt.metaKey, 0, null);
  canvas.dispatchEvent(newEvt);
}