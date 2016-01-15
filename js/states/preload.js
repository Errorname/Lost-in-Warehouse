

LostInWarehouse.Preload = function(game) {};

LostInWarehouse.Preload.prototype =
{
	preload: function() {

		/* Enable the Isometric plugin */
		game.plugins.add(new Phaser.Plugin.Isometric(game));

		/* Some misc options */
		game.time.advancedTiming = true;
		game.renderer.renderSession.roundPixels = true;

		game.tweens.frameBased = true;

		game.load.onLoadStart.add(function() {
			console.log('Loading assets');
		},this);

		game.load.onFileComplete.add(function(progress, cacheKey, success, totalLoaded, totalFiles) {
			console.log("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);
		},this);

		game.load.onLoadComplete.add(function() {
			console.log('Loading assets done.');

			game.state.start('Title')
		},this);

	},
	create: function() {

		/* Loading levels */
		for (var i = 0; i <= game.nb_levels; i++) {
			game.load.json('level-'+i, 'assets/levels/'+i+'.json');
		}

		/* Loading tiles sprites */
		for (var i = 1; i <= game.nb_tiles; i++) {
			game.load.image('tile-'+i, 'assets/sprites/tile-'+i+'.png');
		}

		/* Loading robot spritesheet */
		game.load.spritesheet('robot','assets/sprites/robot.png',120,105,8);

		/* Loading enemy spritesheet */
		game.load.spritesheet('enemy','assets/sprites/enemy.png',120,105,8);

		/* Loading HUD */
		game.load.spritesheet('replay','assets/hud/replay.png',69,71,2);
		game.load.spritesheet('start','assets/hud/start.png',247,60,2);
		game.load.image('title','assets/hud/title.png');
		game.load.image('menu','assets/hud/menu.png');
		game.load.spritesheet('levels','assets/hud/levels.png',110,148,3);
		game.load.spritesheet('numbers','assets/hud/numbers.png',48,60,20);
		game.load.spritesheet('exit','assets/hud/exit.png',69,71,2);
		game.load.image('awesome','assets/hud/awesome.png');
		game.load.image('box','assets/hud/box.png');
		game.load.spritesheet('next','assets/hud/next.png',69,71,2);
		game.load.spritesheet('back','assets/hud/back.png',69,71,2);
		game.load.image('item','assets/hud/item.png');


		game.load.start();
	}
}

game.state.add('Preload',LostInWarehouse.Preload);