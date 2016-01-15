

LostInWarehouse.Boot = function(game) {};

LostInWarehouse.Boot.prototype =
{
	preload: function() {

		console.log('Boot...');

		/* Enable the Isometric plugin */
		game.plugins.add(new Phaser.Plugin.Isometric(game));

		/* Some misc options */
		game.time.advancedTiming = true;
		game.renderer.renderSession.roundPixels = true;

		game.tweens.frameBased = true;
		game.stage.disableVisibilityChange = true;
		
	},
	create: function() {

		game.state.start('Preload')

	}
}

game.state.add('Boot',LostInWarehouse.Boot);