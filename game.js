var game = new Phaser.Game(1024, 600, Phaser.AUTO, 'test', null, true, false);


game.level = 1;

game.nextLevel = function() {
	game.level++;

	game.state.clearCurrentState();
	game.state.add('Boot',BasicGame.Boot);
	game.state.start('Boot');

}

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
		game.iso.anchor.setTo(0.5, 0.2); // to comment ?
		game.world.setBounds(0, 0, 3072, 2018);
		game.renderer.renderSession.roundPixels = true;
	
		/* Preload Map & Player */
		Map.preload();
		Player.preload();

	},
	create: function() {

		/* Add a group holder for iso layers */
		game.iso_layers = [];
		['background','floor','main'].forEach(function (layer) {
			game.iso_layers[layer] = game.add.group(undefined,layer);
		});

		/* Create Map & Player */
		Map.create();
		Player.create();

	},
	update: function() {

		/* Update Map & Player */
		Map.update();
		Player.update();

		/* Update the z index of the layers */
		game.iso.simpleSort(game.iso_layers['floor']);
		game.iso.simpleSort(game.iso_layers['main']);

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