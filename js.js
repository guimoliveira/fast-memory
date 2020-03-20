new (function() {

	var width, height, x, y;
	var dimension;

	var canvas, ctx;
	var scene;

	var assets;

	var colors = {
		background: "rgb(112, 146, 190)",
		darkBackground: "rgb(73, 46, 184)",
		foreground: "white",
		darkForeground: "black",
		loadingBar: "rgb(129, 150, 255)",
		button1: "red",
		button1Over: "#c80000",
		button1Click: "darkred",
		button2: "blue",
		button2Over: "#0000c8",
		button2Click: "darkblue",
		button3: "rgb(255, 201, 14)",
		button3Over: "rgb(226, 189, 0)",
		button3Click: "rgb(206, 159, 0)"
	};

	var font = "Arial, Sans Serif";

	var langs = {
		pt: {
			play: "Jogar",
			records: "Recordes",
			back: "Voltar",
			addRecord: "Adicionar aos recordes",
			level: "LEVEL",
			levelText: "Encontre todos os pares em ",
			levelText1: " segundos.",
			namePrompt: "Como vocÃª deseja ser conhecido?",
			nameOrNickname: "Nome ou apelido",
			loading: "Carregando...",
			failed: "Algo deu errado. ðŸ˜”",
			more: "Lista completa",
			all: "Todos",
			transport: "Transporte",
			fruits: "Frutas",
			animals: "Animais",
			objects: "Objetos",
			food: "Comidas",
			letters: "Letras",
			numbers: "NÃºmeros"
		},

		en: {
			play: "Play",
			records: "Records",
			back: "Back",
			addRecord: "Add to records",
			level: "LEVEL",
			levelText: "Find all pairs in ",
			levelText1: " seconds.",
			namePrompt: "How do you want to be known?",
			nameOrNickname: "Name or nickname",
			loading: "Loading...",
			failed: "Something went wrong. ðŸ˜”",
			more: "Full list",
			all: "All",
			transport: "Transport",
			fruits: "Fruits",
			animals: "Animals",
			objects: "Objects",
			food: "Food",
			letters: "Letters",
			numbers: "Numbers"
		},

		es: {
			play: "Jugar",
			records: "RÃ©cords",
			back: "Volver",
			addRecord: "Agregar a los rÃ©cords",
			level: "LEVEL",
			levelText: "Encuentre todos los pares en ",
			levelText1: " segundos.",
			namePrompt: "Â¿CÃ³mo quieres ser conocido?",
			nameOrNickname: "Nombre o apodo",
			loading: "Cargando...",
			failed: "Algo saliÃ³ mal. ðŸ˜”",
			more: "Lista completa",
			all: "Todos",
			transport: "Transporte",
			fruits: "Frutas",
			animals: "Animales",
			objects: "Objetos",
			food: "Comidas",
			letters: "Letras",
			numbers: "Numeros"
		}
	}

	var strings = langs[lang];

	var themes = [
		{name: strings.all,        begin: 0,   end: 112},
		{name: strings.transport,  begin: 0,   end: 15},
		{name: strings.fruits,     begin: 15,  end: 30},
		{name: strings.animals,    begin: 30,  end: 45},
		{name: strings.objects,    begin: 45,  end: 60},
		{name: strings.food,       begin: 60,  end: 75},
		{name: strings.letters,    begin: 75,  end: 102},
		{name: strings.numbers,    begin: 102, end: 112}
	];

	var levels = new (function(){

		var settings = [{width: 2, height: 2, levelTime: 25, openTime: 1},
						{width: 3, height: 2, levelTime: 30, openTime: 1.5},
						{width: 4, height: 2, levelTime: 35, openTime: 2},
						{width: 5, height: 2, levelTime: 40, openTime: 2.5},
						{width: 5, height: 2, levelTime: 35, openTime: 2.25},
						{width: 4, height: 3, levelTime: 45, openTime: 2.75},
						{width: 4, height: 3, levelTime: 40, openTime: 2.5},
						{width: 4, height: 4, levelTime: 55, openTime: 3},
						{width: 4, height: 4, levelTime: 50, openTime: 2.75},
						{width: 5, height: 4, levelTime: 60, openTime: 3.5}
				       ];

		this.get = function(i) {
			if (i < 10) return settings[i]; else {
				return {width: 5, height: 4, 
					   levelTime: Math.max(60 - 3 * (i - 9), 10), 
					   openTime: Math.max(3.5 - 0.2 * (i - 9), 1)};
			}
		};

	})();

	function _(i) {
		return Math.ceil(i / 100 * dimension);
	}

	function shuffleArray(array) {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
	}

	function getRandomNumbers(amount, min, max) {
		var array = [];
		var result = [];
		for (var i = min; i < max; i++) array.push(i);
		for (var j = 0; j < amount; j++) {
			result.push(array.splice(Math.floor(Math.random() * array.length), 1)[0]);
		}
		return result;
	}

	function getHex(num, padding) {
		var hex = num.toString(16);
		while (hex.length < padding) 
			hex = "0" + hex;
		return hex;
	}

	// Draw methods

	function drawRect(_x, _y, width, height, style, fill, relative) {
		if (relative) {
			_x = x + _(_x); _y = y + _(_y); 
			width = _(width); height = _(height);
		}
		if (fill) {
			ctx.fillStyle = style;
			ctx.fillRect(_x, _y, width, height);
		} else {
			ctx.strokeStyle = style;
			ctx.strokeRect(_x, _y, width, height);
		}
	}

	function drawText(text, _x, _y, size, maxWidth, style, align, baseline, color, fill, relative) {
		if (relative) {
			_x = x + _(_x); _y = y + _(_y); 
			size = _(size);
			if (maxWidth) maxWidth = _(maxWidth);
		}
		if (!maxWidth) maxWidth = undefined;
		ctx.font = style + " " + size + "px " + font;
		ctx.textAlign = align;
		ctx.textBaseline = baseline;
		if (fill) {
			ctx.fillStyle = color;
			ctx.fillText(text, _x, _y, maxWidth)
		} else {
			ctx.strokeStyle = color;
			ctx.strokeText(text, _x, _y, maxWidth);
		}
	}

	function drawLine(x1, y1, x2, y2, size, cap, join, style, relative) {
		if (relative) {
			x1 = x + _(x1); y1 = y + _(y1); 
			x2 = x + _(x2); y2 = y + _(y2); 
			size = _(size);
		}
		ctx.lineWidth = size;
		ctx.lineCap = cap ? cap : "butt";
		ctx.lineJoin = join ? joing : "miter";
		ctx.strokeStyle = style;

		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}

	function drawImage(img, x1, y1, width1, height1, x2, y2, width2, height2, relative1, relative2) {
		if (relative1) {
			if (x1 !== null) x1 = x1 / 100 * img.width;
			if (y1 !== null) y1 = y1 / 100 * img.height;
			if (width1 !== null) width1 = width1 / 100 * img.width;
			if (height1 !== null) height1 = height1 / 100 * img.height;
		}
		if (relative2) {
			x2 = x + _(x2); y2 = y + _(y2);
			if (width2 !== null) width2 = _(width2);
			if (height2 !== null) height2 = _(height2);
		}

		if (x1 === null) x1 = 0;
		if (y1 === null) y1 = 0;
		if (width1 === null) width1 = img.width - x1;
		if (height1 === null) height1 = img.height - y1;

		if (width2 === null && height2 === null) {
			width2 = width1;
			height2 = height1;
		} else if (width2 !== null && height2 === null) {
			height2 = width2 / width1 * height1;
		} else if (height2 !== null && width2 === null) {
			width2 = height2 / height1 * width1;
		}

		ctx.drawImage(img, x1, y1, width1, height1, x2, y2, width2, height2);
	}

	// Elements

	function Button(_x, _y, width, height, text, foreground, background, overBackground, clickBackground) {

		var state = 0;

		this.onClick = null;

		this.setPosition = function(x, y) {
			_x = x;
			_y = y;
		};

		this.setDimension = function(_width, _height) {
			width = _width;
			height = _height;
		};

		this.setText = function(_text) {
			text = _text;
		};

		this.setColors = function(_foreground, _background, _overBackground, _clickBackground) {
			foreground = _foreground;
			background = _background;
			overBackground = _overBackground;
			clickBackground = _clickBackground;
		};

		this.draw = function() {

			var style = state == 0 ? background : (state == 1 ? overBackground : clickBackground);

			drawRect(_x, _y, width, height, style, true, true);
			drawText(text, _x + width / 2, _y + height / 2, height / 2, width, 
				    "", "center", "middle", foreground, true, true);
		};

		function isIn(__x, __y) {
			var x1 = x + _(_x), y1 = y + _(_y), x2 = x1 + _(width), y2 = y1 + _(height);
			return (__x >= x1 && __x <= x2 &&
				    __y >= y1 && __y <= y2);
		}

		this.handleEvt = function(evt) {

			var x = evt.clientX, y = evt.clientY;
			var lastState = state;
			var click = false;

			switch (evt.type) {
				case "mousedown":
					if (isIn(x, y)) state = 2;
					break;
				case "mouseup":
					if (state == 2 && isIn(x, y)) click = true;
				case "mouseleave":
					state = 0;
					break;
				case "mousemove":
					if (state != 2) {
						state = isIn(x, y);
					} 
					break;
			}
 
			if (lastState != state) this.draw();
			if (click && this.onClick) {
				if (assets.sounds) assets.sounds.click.play();
				this.onClick(this);
			}

		};

	}

	function Card(card, _x, _y, width, height) {

		var self = this;

		var state = 0;
		var open = true;
		var hidden = false;
		var scaleX = 100, scaleY = 100;
		var direction = 0;

		this.onClick = null;
		this.onFlip = null;
		this.onHide = null;

		this.isOpen = function() {
			return open;
		}

		this.isHidden = function() {
			return hidden;
		}

		this.getId = function() {
			return card;
		}

		this.draw = function() {

			var __x = _x + ((100 - scaleX) / 200) * width;
			var _width = width * scaleX / 100;

			var __y = _y + ((100 - scaleY) / 200) * height;
			var _height = height * scaleY / 100;

			drawRect(_x, _y, width, height, "rgb(230, 230, 230)", true, true);

			if (hidden) return;

			if (!open) {
				drawImage(assets.images.closedCard, null, null, null, null, __x, __y, _width, _height, false, true);
			} else {
				drawImage(assets.images.openCard, null, null, null, null, __x, __y, _width, _height, false, true);

				var image;
				var dx, dy;

				if (card < 75) {
					image = assets.images.cards15;
					dx = card % 15; dy = Math.floor(card / 15);
				} else if (card < 102) {
					image = assets.images.cards27;
					dx = card - 75; dy = 0;
				} else {
					image = assets.images.cards10;
					dx = card - 102; dy = 0;
				}

				drawImage(image, dx * 200, dy * 250, 200, 250, __x, __y, _width, _height, false, true);
			}

		};

		function flipLoop() {
			scaleX += direction;

			if (scaleX <= 0) {
				open = !open;
				direction *= -1;
				scaleX = 0;
			}
			if (scaleX >= 100) {
				direction = 0;
				scaleX = 100;
			} else {
				requestAnimationFrame(flipLoop);
			}

			self.draw();

			if (scaleX == 100 && self.onFlip) self.onFlip(self);
		}

		this.flip = function() {
			if (document.hasFocus()) {
				direction = -20;
				flipLoop();
			} else {
				open = !open;
				this.draw();
				if (this.onFlip) this.onFlip(this);
			}
		}

		function hideLoop() {
			scaleX -= 20;
			scaleY -= 20;

			if (scaleX <= 0) {
				hidden = true;
				scaleX = scaleY = 0;
			} else {
				requestAnimationFrame(hideLoop);
			}

			self.draw();

			if (scaleX == 0 && self.onHide) self.onHide(self);
		}

		this.hide = function() {
			hideLoop();
		}

		function isIn(__x, __y) {
			var x1 = x + _(_x), y1 = y + _(_y), x2 = x1 + _(width), y2 = y1 + _(height);
			return (__x >= x1 && __x <= x2 &&
				    __y >= y1 && __y <= y2);
		}

		this.handleEvt = function(evt) {
			var x = evt.clientX, y = evt.clientY;

			switch (evt.type) {
				case "mousedown":
					if (isIn(x, y)) state = 1;
					break;
				case "mouseup":
					if (state == 1 && this.onClick && isIn(x, y)) this.onClick(this);
				case "mouseleave":
					state = 0;
					break;
			}
		};

	}

	function Circle(_x, _y, radius) {

		this.setPosition = function(x, y) {
			_x = x;
			_y = y;
		};

		this.setRadius = function(_radius) {
			radius = _radius;
		};

		this.draw = function() {
			ctx.save();
			
			ctx.translate(x + _(_x), y + _(_y));

			var _radius = _(radius);

			for (var i = 0; i < 4; i++) {
				ctx.translate(_radius * 2, 0);
				ctx.rotate(Math.PI / 2);
				ctx.drawImage(assets.images.circle, 0, 0, _radius, _radius)
			}

			ctx.restore();
		};

	}

	function Square(_x, _y, width, height, radius) {

		this.setPosition = function(x, y) {
			_x = x;
			_y = y;
		};

		this.setDimension = function(_width, _height) {
			width = _width;
			height = _height;
		};

		this.setRadius = function(_radius) {
			radius = _radius;
		};

		this.draw = function() {
			ctx.save();

			ctx.translate(x + _(_x), y + _(_y));

			var _width = _(width), _height = _(height), _radius = _(radius);

			for (var i = 0; i < 4; i++) {
				if (i == 0 || i == 2) {
					ctx.drawImage(assets.images.square, 50, 0, 10, 50, _radius, 0, _width - 2 * _radius, _radius);
					ctx.translate(_width, 0);
				} else {
					ctx.drawImage(assets.images.square, 50, 0, 10, 50, _radius, 0, _height - 2 * _radius, _radius);
					ctx.translate(_height, 0);
				}	

				ctx.rotate(Math.PI / 2);
				ctx.drawImage(assets.images.square, 0, 0, 50, 50, 0, 0, _radius, _radius);
			}

			ctx.drawImage(assets.images.square, 50, 50, 10, 10, _radius, _radius, _width - 2 * _radius, _height - 2 * _radius);

			ctx.restore();

		};

	}

	function Box(title, points, time, _x, _y, width, height) {

		time = formatTime(time);

		this.setPoints = function(_points) {
			points = _points;
			drawBar();
		}

		function formatTime(time) {
			var min = Math.floor(time / 60);
			var sec = time % 60;

			if (min < 10) min = "0" + min;
			if (sec < 10) sec = "0" + sec;

			return min + ":" + sec;
		}

		this.setTime = function(_time) {
			time = formatTime(_time);
			drawBar();
		}

		this.setValues = function(_points, _time) {
			points = _points;
			time = formatTime(_time);
			drawBar();
		}

		this.setPosition = function(x, y) {
			_x = x;
			_y = y;
		};

		this.setDimension = function(_width, _height) {
			width = _width;
			height = _height;
		};

		function drawBar() {
			drawImage(assets.images.box, 0, 0, 80, 100, _x, _y, 10, 12.5, false, true);
			drawImage(assets.images.box, 100, 0, 20, 100, _x + 10, _y, width - 20, 12.5, false, true);
			drawImage(assets.images.box, 133, 0, 80, 100, _x + width - 10, _y, 10, 12.5, false, true);

			drawText(title, _x + width / 2, _y + 5.5, 4, width / 2, "bold", "center", "middle",  colors.foreground, true, true);
			drawText(points, _x + 11, _y + 5.5, 4, width / 4, "", "left", "middle",  colors.foreground, true, true);
			drawText(time, _x + width - 11, _y + 5.5, 4, width / 4, "", "right", "middle",  colors.foreground, true, true);
		}

		this.draw = function() {
			drawBar();

			drawImage(assets.images.box, 0, 100, 80, 20, _x, _y + 12.5, 10, height - 22.5, false, true);
			drawImage(assets.images.box, 0, 97, 80, 80, _x, _y + height - 10, 10, 10, false, true);
			drawImage(assets.images.box, 100, 97, 20, 80, _x + 10, _y + height - 10, width - 20, 10, false, true);
			drawImage(assets.images.box, 133, 100, 80, 20, _x + width - 10, _y + 12.5, 10, height - 22.5, false, true);
			drawImage(assets.images.box, 133, 97, 80, 80, _x + width - 10, _y + height - 10, 10, 10, false, true);
			drawImage(assets.images.box, 60, 100, 90, 20, _x + 10, _y + 12.5, width - 20, height - 22.5, false, true);

		};

	}

	// Scenes

	function LoadingScene() {

		var done = 0;

		function drawBar() {
			var text = done !== false ? (done * 100).toFixed(0) + "%" : strings.failed;

			drawLine(30, 50, 70, 50, 3, "round", null, colors.darkBackground, true);
		
			if (done > 0) drawLine(30, 50, 30 + done * 40, 50, 3, "round", null, colors.loadingBar, true);
		
			drawText(text, 50, 50, 2, 0, "", "center", "middle", colors.foreground, true, true);
		}

		this.update = function(per) {
			done = per;
			drawBar();
		};

		this.draw = function() {
			drawRect(0, 0, width, height, colors.background, true);
			drawBar();
		};

		this.handleEvt = function(evt) {

		};

		this.draw();

	}

	function MenuScene() {

		var circle = new Circle(0, 0, 50);
		var square = new Square(27, 37, 46, 30, 5);
		var playButton = new Button(30, 40, 40, 15, strings.play, colors.foreground, colors.button1, colors.button1Over, colors.button1Click);
		var recordsButton = new Button(30, 56, 40, 8, strings.records, colors.foreground, colors.button2, colors.button2Over, colors.button2Click);

		playButton.onClick = function() {
			scene = new ThemeScene();
		};

		recordsButton.onClick = function() {
			scene = new RecordsScene();
		};

		this.draw = function() {

			drawRect(0, 0, width, height, colors.darkBackground, true);

			circle.draw();
			square.draw();
			playButton.draw();
			recordsButton.draw();

			drawImage(assets.images.title, null, null, null, null, 10, 15, 75, null, false, true);
			drawImage(assets.images.texts, 0, 0, 310, 60, 30, 70, 40, null, false, true);
			drawImage(assets.images.texts, 310, 0, null, 60, 38, 76, 24, null, false, true);

		};

		this.handleEvt = function(evt) {
			playButton.handleEvt(evt);
			recordsButton.handleEvt(evt);
		};

		this.draw();

	}

	function ThemeScene() {

		var circle = new Circle(0, 0, 50);
		var square = new Square(19, 43, 63, 29, 5);
		var backButton = new Button(40, 75, 20, 6, strings.back, colors.foreground, colors.button2, colors.button2Over, colors.button2Click);
		var themesButton = [];

		themes.forEach(function(t, i) {
			themesButton[i] = new Button(22 + (i % 2) * 29, 46 + parseInt(i / 2) * 6, 28, 5, t.name, 
								  colors.darkForeground, colors.button3, colors.button3Over, colors.button3Click);

			themesButton[i].onClick = function() {
				scene = new IntroScene(i);
			}
			
		});

		backButton.onClick = function() {
			scene = new MenuScene();
		};

		this.draw = function() {

			drawRect(0, 0, width, height, colors.darkBackground, true);

			circle.draw();
			square.draw();
			backButton.draw();

			for (var i = 0; i < themesButton.length; i++) {
				themesButton[i].draw();
			}
			
			drawImage(assets.images.title, null, null, null, null, 10, 15, 75, null, false, true);
			drawImage(assets.images.texts, 0, 60, 310, 60, 31, 33, 38, null, false, true);

		};

		this.handleEvt = function(evt) {
			backButton.handleEvt(evt);

			for (var i = 0; i < themesButton.length; i++) {
				themesButton[i].handleEvt(evt);
			}
		};

		this.draw();

	}

	function RecordsScene() {

		var self = this;

		var circle = new Circle(0, 0, 50);
		var square = new Square(26, 23, 48, 52, 5);
		var backButton = new Button(40, 78, 20, 6, strings.back, colors.foreground, colors.button2, colors.button2Over, colors.button2Click);
		var moreButton = new Button(29, 67, 42, 5, strings.more, colors.darkForeground, colors.button3, colors.button3Over, colors.button3Click);

		backButton.onClick = function() {
			scene = new MenuScene();
		};

		moreButton.onClick = function() {
			window.open("records.php?lang=" + lang);
		}

		var records = null;
		var failed = false;

		server.getRecords(function(data){records = data; self.draw();}, function(){failed = true; self.draw();});

		this.draw = function(forced) {

			if (!forced && scene != this) return;

			drawRect(0, 0, width, height, colors.darkBackground, true);

			circle.draw();
			square.draw();
			backButton.draw();
			moreButton.draw();
		
			drawImage(assets.images.texts, 310, 60, null, 60, 38, 14, 24, null, false, true);

			if (failed) {
				drawText(strings.failed, 50, 46, 3, 0, "", "center", "middle", colors.darkForeground, true, true);
			} else {
				if (records === null) {
					drawText(strings.loading, 50, 46, 3, 0, "", "center", "middle", colors.darkForeground, true, true);
				} else {
					for (var i = 0; i < records.length; i++) {
						drawText((i + 1) + ". " + records[i].name, 30, 28 + i * 4, 3, 29, "", "left", "middle", colors.darkForeground, true, true);
						drawText(records[i].points, 70, 28 + i * 4, 3, 10, "", "right", "middle", colors.darkForeground, true, true);
					}
				}
			}

		};

		this.handleEvt = function(evt) {
			backButton.handleEvt(evt);
			moreButton.handleEvt(evt);
		};

		this.draw(true);

	}

	function IntroScene(t, level, points, gd, bd, tl) {

		theme = themes[t];

		if (!level) level = 0;
		if (!points) points = 0;
		if (!gd) gd = 0;
		if (!bd) bd = 0;
		if (!tl) tl = 0;

		var cards = [];
		var levelInfo = levels.get(level);
		var numPairs = levelInfo.width * levelInfo.height / 2;
		
		cards = getRandomNumbers(numPairs, theme.begin, theme.end);
		cards = cards.concat(cards);

		shuffleArray(cards);

		setTimeout(function(){
			scene = new GameScene(cards, t, level, points, gd, bd, tl);
		}, 2000);

		this.draw = function() {

			drawRect(0, 0, width, height, colors.background, true);		
			
			drawText(strings.level + " " + (level + 1), 50, 40, 7, 0, "bold", "center", "middle", colors.foreground, true, true);
			drawText(strings.levelText + levelInfo.levelTime + strings.levelText1, 50, 50, 4, 0,
				     "", "center", "middle", colors.foreground, true, true);

		};

		this.handleEvt = function(evt) {
			
		};

		this.draw();

	}

	function GameScene(cardsId, theme, level, points, gd, bd, tl) {

		var levelInfo = levels.get(level);
		var time = levelInfo.levelTime, timeInterval, canFlip = false, started = false, lost = false;
		var cards = [], flippedCard = null, cardsFlipped = 0;

		var box = new Box(strings.level + " " + (level + 1), points, time, 3, 1, 94, 98);
		
		var ox = (5 - levelInfo.width) / 2 * 17 + 10;
		var oy = (4 - levelInfo.height) / 2 * 20 + 13.5;

		cardsId.forEach(function(c, i){
			var x = i % levelInfo.width;
			var y = Math.floor(i / levelInfo.width);

			var card = new Card(c, ox + 16 * x + 0.25, oy + 19.7 * y + 0.25, 15.5, 19.2);
			card.onClick = onClick;
			card.onFlip = onFlip;
			card.onHide = onHide;

			cards.push(card);
		});

		function onClick(card) {
			if (!lost && canFlip && !card.isHidden() && card != flippedCard) {
			    if (assets.sounds) {
				    if (assets.sounds.flip.currentTime) assets.sounds.flip.currentTime = 0;
				    assets.sounds.flip.play();
			    }

				card.flip();
				canFlip = false;
			}
		}

		function onHide(card) {
			canFlip = true;
			if (++cardsFlipped == levelInfo.width * levelInfo.height) {
				clearInterval(timeInterval);
				if (assets.sounds) assets.sounds.clock.pause();

				timeToPoints();
			}
		}

		function onFlip(card) {

			if (lost) {
				setTimeout(lose, 1000);
				return;
			}

			canFlip = true;

			if (!started) {
				timeInterval = setInterval(tick, 1000);
				started = true;
				return;
			}
			if (card.isOpen()) {
				if (!flippedCard) {
					flippedCard = card;
				} else {
					canFlip = false;
					if (card.getId() == flippedCard.getId()) {
						setTimeout(function(){
							addPoints(1000);
							gd++;
							if (assets.sounds) assets.sounds.correct.play();
							card.hide(); 
							flippedCard.hide();
							flippedCard = null;
						}, 500);
					} else {
						setTimeout(function(){
							if (points >= 500) {
								addPoints(-500);
								bd++;
							}
							if (assets.sounds) assets.sounds.wrong.play();
							card.flip(); 
							flippedCard.flip();
							flippedCard = null;
						}, 500);
					}
					
				}
			}
		}

		function addPoints(amount) {
			var i = 0, ratio = Math.floor(amount / 10);

			function add() {
				box.setPoints(points + ratio * i);
				if (++i == 10) {
					points += amount;
					box.setPoints(points);
				} else {
					setTimeout(add, 20);
				}
			}

			add();
		}

		function nextLevel() {
			scene = new IntroScene(theme, level + 1, points, gd, bd, tl);
		}
		
		function lose() {
		    scene = new GameOverScene(theme, level, points, gd, bd, tl);
		}

		function timeToPoints() {
			function add() {
				if (--time < 0) {
					setTimeout(nextLevel, 500);
				} else {
					box.setValues(points += 100, time);
					setTimeout(add, 50);
				}
			}
			tl += time;
			add();
		}

		function tick() {
			time--;
			
			if (time == 9) {
			    if (assets.sounds) {
				    if (assets.sounds.clock.currentTime) assets.sounds.clock.currentTime = 0;
				    assets.sounds.clock.play();
			    }
			} else if (time < 0) {
				if (assets.sounds) assets.sounds.lost.play();
				clearInterval(timeInterval);
				lost = true;

				if (canFlip) {
					setTimeout(lose, 1000);
				}
				return;
			}

			box.setTime(time);
		}

		setTimeout(function() {
			for (var i = 0; i < cards.length; i++) {
				cards[i].flip();
			}
			if (assets.sounds) assets.sounds.flip.play();

		}, levelInfo.openTime * 1000);

		this.draw = function() {

			drawRect(0, 0, width, height, colors.darkBackground, true);		
			
			box.draw();

			for (var i = 0; i < cards.length; i++) {
				cards[i].draw();
			}
			
		};

		this.handleEvt = function(evt) {
			for (var i = 0; i < cards.length; i++) {
				cards[i].handleEvt(evt);
			}
		};

		this.draw();

	}

	function GameOverScene(theme, level, points, gd, bd, tl) {

		var circle = new Circle(0, 0, 50);
		var square = new Square(19, 43, 63, 22, 5);
		var addButton = new Button(30, 69, 40, 6, strings.addRecord, colors.darkForeground, colors.button3, colors.button3Over, colors.button3Click);
		var backButton = new Button(40, 78, 20, 6, strings.back, colors.foreground, colors.button2, colors.button2Over, colors.button2Click);

		console.log(gd,bd,tl);

		addButton.onClick = function() {
			var name = prompt(strings.namePrompt, strings.nameOrNickname);
			
			if (name && name != strings.nameOrNickname) {
				server.saveRecord(name, theme, level, points, gd, bd, tl);
				scene = new RecordsScene();
			}
		};

		backButton.onClick = function() {
			scene = new MenuScene();
		};

		this.draw = function() {
			drawRect(0, 0, width, height, colors.darkBackground, true);

			circle.draw();
			square.draw();
			addButton.draw();
			backButton.draw();

			drawImage(assets.images.title, null, null, null, null, 10, 15, 75, null, false, true);
			drawImage(assets.images.texts, 310, 120, null, 60, 38, 33, 24, null, false, true);
			drawImage(assets.images.texts, 0, 120, 310, 60, 32, 45, 38, null, false, true);

			drawText(points, 50, 58, 7, null, "bold", "center", "middle", colors.darkForeground, true, true);
		};

		this.handleEvt = function(evt) {
			addButton.handleEvt(evt);
			backButton.handleEvt(evt);
		};

		this.draw();

	}

	// Assets loader (images and sounds)

	function Loader(images, sounds, onProgress, onError) {

        var self = this;

		var loaded = 0;
		var total = 0;
		var failed = false;

		this.images = images;
		this.sounds = sounds;

		for (var image in this.images) {
			let img = new Image();
			img.onload = function() {
				loaded++;
				if (!failed && onProgress) onProgress(loaded / total);
			};
			img.onerror = function() {
			    if (!failed && onError) {
			        self.images = null; 
			        if (onError()) {
			            total--;
			            if (onProgress) onProgress(loaded / total);
			            return;
			        }
			    }
				failed = true;
			};
			img.src = this.images[image];
			this.images[image] = img;
			total++;
		}

		for (var sound in this.sounds) {
			let audio = new Audio();
			audio.oncanplaythrough = function() {
				this.oncanplaythrough = null;
				loaded++;
				if (!failed && onProgress) onProgress(loaded / total);
			};
			audio.onerror = function() {
			    if (!failed && onError) {
			        self.sounds = null; 
			        if (onError()) {
			            total--;
			            if (onProgress) onProgress(loaded / total);
			            return;
			        }
			    }
				failed = true;
			};
			audio.src = this.sounds[sound];
			audio.load();
			this.sounds[sound] = audio;
			total++;
		}

	}

	var server = new (function() {
		
		function createResult(l, gd, bd, tl, pt) {
			return (getHex(l, 2) + getHex(gd, 2) + getHex(bd, 2) + getHex(tl, 3) + getHex(pt, 5)).toUpperCase();
		}

		this.getRecords = function(onSuccess, onError) {

			var xhr = new XMLHttpRequest();
			xhr.open('GET', 'server.php?action=get&amount=10', true);

			xhr.onload = function() {
				try {
					onSuccess(JSON.parse(xhr.responseText));
				} catch (evt) {
					if (onError) onError();
				}
			};

			xhr.onerror = function() {
				if (onError) onError();
			};

			xhr.send();

		};

		this.saveRecord = function(name, theme, level, points, gd, bd, tl) {

			var xhr = new XMLHttpRequest();
			xhr.open('POST', 'server.php?action=save', false);

			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

			xhr.send("name=" + name + "&theme=" + theme + "&record=" + createResult(level, gd, bd, tl, points));

		};

	})();

	// Methods

	function resize() {
		canvas.width = width = document.body.clientWidth;
		canvas.height = height = document.body.clientHeight;

		dimension = (width > height) ? height : width;

		x = (width - dimension) / 2;
		y = (height - dimension) / 2;

		scene.draw();
	}

	function handleMouseEvt(evt) {
		scene.handleEvt(evt);
	}

	function handleTouchEvt(evt) {

	}

	function loadAssets() {
		scene = new LoadingScene();

		var images = {cards10: "images/cards10.png",
					  cards15: "images/cards15" + lang + ".png",
					  cards27: "images/cards27.png",
					  closedCard: "images/closedCard.png",
					  openCard: "images/openCard.png",
					  title: "images/title.png",
					  texts: "images/texts_" + lang + ".png",	
					  circle: "images/circle.png",
					  square: "images/square.png",
					  box: "images/box.png"};

		var sounds = {welcome: "sounds/welcome.mp3",
				      click: "sounds/click.mp3",
					  flip: "sounds/flip.mp3",
					  correct: "sounds/correct.mp3",
					  wrong: "sounds/wrong.mp3",
					  clock: "sounds/clock.mp3",
					  lost: "sounds/lost.mp3"};

		function onProgress(per) {
			scene.update(per);
			if (per == 1) {
				scene = new MenuScene();
				if (assets.sounds) assets.sounds.welcome.play();
			}
		}

		function onError() {
		    if (assets.images) return true;
			scene.update(false);
			return false;
		}

		assets = new Loader(images, sounds, onProgress, onError);
	}

	function setup() {
		canvas = document.getElementById("game");
		ctx = canvas.getContext("2d");

		window.addEventListener("resize", resize);
		window.addEventListener("focus", resize);
		window.addEventListener("contextmenu", function(){return false;});

		canvas.addEventListener("mousedown", handleMouseEvt);
		canvas.addEventListener("mouseup", handleMouseEvt);
		canvas.addEventListener("mousemove", handleMouseEvt);
		canvas.addEventListener("mouseleave", handleMouseEvt);

		canvas.addEventListener("touchstart", handleTouchEvt);
		canvas.addEventListener("touchend", handleTouchEvt);
		canvas.addEventListener("touchcancel", handleTouchEvt);
		canvas.addEventListener("touchmove", handleTouchEvt);

		loadAssets();

		resize();
	}

	setup();

})();
