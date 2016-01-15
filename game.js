var game = new Phaser.Game(1024, 600, Phaser.AUTO, 'test', null, true, false);

var BasicGame = function (game) {};

BasicGame.Boot = function(game) {};

var map, isoGroup, player;

BasicGame.Boot.prototype = 
{
	preload: function () {
		game.load.image('tile', 'assets/tile.png');
		game.load.image('robot', 'assets/robot.png');

		game.time.advancedTiming = true;

		game.plugins.add(new Phaser.Plugin.Isometric(game));

		game.iso.anchor.setTo(0.5, 0.16);
	},
	create: function () {
		map = game.add.group();
		isoGroup = game.add.group();

		this.spawnTiles();

		this.spawnPlayer();
	},
	update: function () {

		//

	},
	render: function() {
		game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe");

		game.debug.text(player.coord.x+':'+player.coord.y, 2, 28, "#a7aebe"); //player.coord.x + ":" + player.coord.y
	},
	spawnTiles: function() {
		var tile;
		for (var xx = 0; xx < 8; xx++) {
			for (var yy = 0; yy < 8; yy++) {
				tile = game.add.isoSprite(xx*67, yy*67, 0, 'tile', 0, map);
				tile.anchor.set(0.5,0);
				tile.coord = {x: xx, y:yy};
			}
		}
	},
	spawnPlayer: function() {
		player = game.add.isoSprite(134,134, 0, 'robot', 0, isoGroup);
		player.anchor.set(0.5, 0.45);

		player.coord = {x: 2, y: 2};

		player.keys = [0,0,0,0,0];

		player.move = function() {
			if (player.canMove()) {
				player.isMoving = true;

				var tween = game.add.tween(player)
							.to({isoX: player.coord.x * 67, isoY: player.coord.y * 67}, 
									//200, Phaser.Easing.Quadratic.InOut, true, 0, 0, false);
									200, Phaser.Easing.Linear.None, true, 0, 0, false);
				tween.onComplete.add(function() {
					player.move();
				},this)
			} else {
				player.isMoving = false;
			}
		}

		player.canMove = function() {

			var k = player.lastDirection();

			if (k == -1)
				return false;

			var x = k == 1 ? -1 : ( k == 3 ? 1 : 0 );
			var y = k == 2 ? -1 : ( k == 0 ? 1 : 0 );

			player.coord.x += x;
			player.coord.y += y;

			var isOk = true;
			if (player.coord.x < 0) {
				player.coord.x = 0;
				isOk = false;
			} else if (player.coord.x > 7) {
				player.coord.x = 7;
				isOk = false;
			}
			if (player.coord.y < 0) {
				player.coord.y = 0;
				isOk = false;
			} else if (player.coord.y > 7) {
				player.coord.y = 7
				isOk = false;
			}
			return isOk;
		}

		player.lastDirection = function() {
			for (var i = 0; i < 4; i++) {
				if (player.keys[i] == 2) {
					return i;
				}
			}
			for (var i = 0; i < 4; i++) {
				if (player.keys[i] == 1) {
					return i;
				}
			}
			return -1;
		}

		player.registerDirection = function(keyCode) {
			for (var i = 0; i < 4; i++) {
				if (player.keys[i] == 2) {
					player.keys[i] = 1;
				}
			}
			player.keys[keyCode] = 2;
		}

		game.input.keyboard.onDownCallback = function(event) {
			// 37 left, 38 up, 39 right, 40 down
			if (event.keyCode >= 37 && event.keyCode <= 40) {

				player.registerDirection(event.keyCode-37);

				if (!player.isMoving) {

					player.move();
				}
			}
		};

		game.input.keyboard.onUpCallback = function(event) {
			// 37 left, 38 up, 39 right, 40 down
			if (event.keyCode >= 37 && event.keyCode <= 40) {
				player.	keys[event.keyCode-37] = 0;
			}
		};

		this.game.input.keyboard.addKeyCapture([
			Phaser.Keyboard.LEFT,
			Phaser.Keyboard.RIGHT,
			Phaser.Keyboard.UP,
			Phaser.Keyboard.DOWN
		]);
	}
};

game.state.add('Boot',BasicGame.Boot);
game.state.start('Boot');