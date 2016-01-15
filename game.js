var game = new Phaser.Game(1024, 600, Phaser.AUTO, 'test', null, true, false);

var BasicGame = function (game) {};

BasicGame.Boot = function(game) {
	game._debug = true;
};

BasicGame.Boot.prototype = 
{
	preload: function () {

		/* Enable the Isometric plugin */
		game.plugins.add(new Phaser.Plugin.Isometric(game));

		/* Some misc options */
		game.time.advancedTiming = true;
		game.iso.anchor.setTo(0.5, 0.2);
		game.world.setBounds(0, 0, 3072, 2048);
		game.renderer.renderSession.roundPixels = true

		/* Preload Objects */
		Map.preload();
		Player.preload();
		
	},
	create: function() {

		/* Add a group holder */
		game.groups = [];

		/* Create the isoGroup for isoDepths */
		game.groups['isoGroup'] = game.add.group(undefined,'isoGroup');

		/* Create Objects */
		Map.create();
		Player.create();

		/* Make sure that isoGroup is on top of the floor */
		game.world.bringToTop(game.groups['isoGroup']);

	},
	update: function() {

		Map.update();
		Player.update();

		/* Update the z index of the element of the scene */
		game.iso.simpleSort(game.groups['isoGroup']);

	},
	render: function() {

		if(game._debug)
			game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe");

		Map.render();
		Player.render();

	}
};

game.state.add('Boot',BasicGame.Boot);
game.state.start('Boot');