

LostInWarehouse.Preload = function(game) {};

LostInWarehouse.Preload.prototype =
{
	preload: function() {

		/* Enable the Isometric plugin */
		game.plugins.add(new Phaser.Plugin.Isometric(game));

		/* Some misc options */
		game.time.advancedTiming = true;
		game.iso.anchor.setTo(0.5, 0.2);
		game.world.setBounds(0, 0, 3072, 2018);
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
		for (var i = 1; i <= game.nb_levels; i++) {
			game.load.json('level-'+i, 'assets/levels/'+i+'.json');
		}

		/* Loading tiles sprites */
		for (var i = 1; i <= game.nb_tiles; i++) {
			game.load.image('tile-'+i, 'assets/sprites/tile-'+i+'.png');
		}

		/* Loading robot spritesheet */
		game.load.spritesheet('robot','assets/sprites/robot.png',120,105,4);

		/* Loading HUD */
		game.load.spritesheet('replay','assets/hud/replay.png',69,71,2);

		game.load.start();
	}
}

game.state.add('Preload',LostInWarehouse.Preload);