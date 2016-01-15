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

		game.debug.text('', 2, 28, "#a7aebe"); //player.coord.x + ":" + player.coord.y
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
		player.anchor.set(0.5);

		player.coord = {x: 2, y: 2};

		this.cursors = game.input.keyboard.createCursorKeys();

		this.game.input.keyboard.addKeyCapture([
			Phaser.Keyboard.LEFT,
			Phaser.Keyboard.RIGHT,
			Phaser.Keyboard.UP,
			Phaser.Keyboard.DOWN
		]);

		var up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		var down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		var left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		var right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

		up.onDown.add(function() {
			player.coord.x = player.coord.x > 0 ? player.coord.x-1 : 0;

            player.isoX = player.coord.x * 67;
		},this);

		down.onDown.add(function() {
			player.coord.x = player.coord.x < 7 ? player.coord.x+1 : 7;

            player.isoX = player.coord.x * 67;
		},this);

		left.onDown.add(function() {
			player.coord.y = player.coord.y < 7 ? player.coord.y+1 : 7;

            player.isoY = player.coord.y * 67;
		},this);

		right.onDown.add(function() {
			player.coord.y = player.coord.y > 0 ? player.coord.y-1 : 0;

            player.isoY = player.coord.y * 67;
		},this);

	}
};

game.state.add('Boot',BasicGame.Boot);
game.state.start('Boot');