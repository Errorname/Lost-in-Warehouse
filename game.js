var game = new Phaser.Game(1024, 600, Phaser.AUTO, 'test', null, true, false);

var BasicGame = function (game) {};

BasicGame.Boot = function(game) {};

var isoSortGroup,
	groups;

var floor, 
	obstacles, 
	character;

var player,
	map,
	tiles;

BasicGame.Boot.prototype = 
{
	preload: function () {
		game.load.image('tile-0', 'assets/tile-0.png');
		game.load.image('tile-1', 'assets/tile-1.png');
		game.load.spritesheet('robot','assets/robot.png',120,105,4);

		game.time.advancedTiming = true;

		game.plugins.add(new Phaser.Plugin.Isometric(game));
		//game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);

		game.iso.anchor.setTo(0.5, 0.2);
		game.world.setBounds(0, 0, 3072, 2048);
		game.renderer.renderSession.roundPixels = true

		// load json map
		game.load.json('map','assets/map.json');
	},
	create: function () {


		isoGroup = game.add.group(undefined,'isoGroup');
		floor = game.add.group(undefined,'floor');
		obstacles = game.add.group(undefined,'obstacles');
		character = game.add.group(undefined,'character');

		game.world.bringToTop(isoGroup);

		groups = [];
		groups['floor'] = floor;
		groups['obstacles'] = obstacles;
		groups['character'] = character;

		map = game.cache.getJSON('map');

		this.spawnTiles();

		this.spawnPlayer();

		game.camera.follow(player);
	},
	update: function () {
		game.iso.simpleSort(isoGroup);
	},
	render: function() {
		game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe");
		game.debug.text(player.coord.x+':'+player.coord.y+":"+player.z, 2, 28, "#a7aebe"); //player.coord.x + ":" + player.coord.y
	},
	spawnTiles: function() {

		var tile;
		tiles = [];
		for (var xx = 0; xx < map.width; xx++) {
			tiles[xx] = [];
			for (var yy = 0; yy < map.height; yy++) {
				var tile_id = map.tiles[yy][xx];
				tile = game.add.isoSprite(xx*map.tile.width, yy*map.tile.height, 0, 'tile-'+tile_id, 0, groups[map.tiles_info[tile_id].group]);
				if (map.tiles_info[tile_id].group != 'floor') {
					isoGroup.add(tile);
				}
				tile.anchor.set(0.5,0.95);
				tile.coord = {x: xx, y:yy};
				tiles[xx][yy] = tile;
			}
		}
		//game.iso.simpleSort(isoGroup);
	},
	spawnPlayer: function() {
		player = game.add.isoSprite(134,134, 0, 'robot', 0, isoGroup);
		player.anchor.set(0.5, 1);

		player.coord = {x: 2, y: 2};

		player.keys = [0,0,0,0,0];

		player.move = function() {
			if (player.canMove()) {
				player.isMoving = true;

				player.frame = player.lastDirection();

				//game.iso.simpleSort(isoGroup);

				/*if (player.frame == 0 || player.frame == 3) {
					player.z = tiles[player.coord.x][player.coord.y].z;
				}*/

				var tween = game.add.tween(player)
							.to({isoX: player.coord.x * 67, isoY: player.coord.y * 67}, 
									200, Phaser.Easing.Linear.None, true, 0, 0, false);
				tween.onComplete.add(function() {
					/*if (player.frame == 1 || player.frame == 2) {
						player.z = tiles[player.coord.x][player.coord.y].z;
					}*/
					//console.log(player.z);
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
			} else if (player.coord.x > map.width-1) {
				player.coord.x = map.width-1;
				isOk = false;
			}
			if (player.coord.y < 0) {
				player.coord.y = 0;
				isOk = false;
			} else if (player.coord.y > map.height-1) {
				player.coord.y = map.height-1;
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
				player.keys[event.keyCode-37] = 0;
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