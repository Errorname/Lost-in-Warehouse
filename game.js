var game = new Phaser.Game(1024, 600, Phaser.AUTO, 'test', null, true, false);

var BasicGame = function (game) { };

BasicGame.Boot = function (game) { };

var map, cursorPos, cursor;

BasicGame.Boot.prototype = 
{
	preload: function () {
		game.load.image('tile', 'assets/tile.png');

		game.time.advancedTiming = true;

		game.plugins.add(new Phaser.Plugin.Isometric(game));

		game.iso.anchor.setTo(0.5, 0.16);
	},
	create: function () {
		map = game.add.group();

		this.spawnTiles();

		cursorPos = new Phaser.Plugin.Isometric.Point3();
	},
	update: function () {
		game.iso.unproject(game.input.activePointer.position, cursorPos);

		game.iso.simpleSort(map);
		map.forEach(function (tile) {
			var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);

			if (!tile.selected && inBounds) {
				tile.selected = true;
				tile.tint = 0x86bfda;
				game.add.tween(tile).to({isoZ: 0},200, Phaser.Easing.Quadratic.InOut,true);

				console.log(tile.coord.x+":"+tile.coord.y+":"+tile.z);
			}
			else if (tile.selected && !inBounds) {
				tile.selected = false;
				tile.tint = 0xffffff;
				game.add.tween(tile).to({isoZ: 0},200, Phaser.Easing.Quadratic.inOut,true);
			}
		});
	},
	render: function() {
		game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe");
	},
	spawnTiles: function() {
		var tile;
		for (var xx = 0; xx < 8; xx += 1) {
			for (var yy = 0; yy < 8; yy += 1) {
				tile = game.add.isoSprite(xx*67, yy*67, 0, 'tile', 0, map);
				tile.anchor.set(0.5,0);
				tile.coord = {x:xx,y:yy};
			}
		}
	}
};

game.state.add('Boot',BasicGame.Boot);
game.state.start('Boot');