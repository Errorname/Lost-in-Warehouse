

LostInWarehouse.Level = function(game) {};

LostInWarehouse.Level.prototype =
{
	preload: function() {

		console.log('Loading level '+game.id_level);

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

		console.log('Loading level '+game.id_level+' done.');
	},
	update: function() {

		game.player.tick();
		// To make woodbox physics independant
		WoodBox.tick();

		/* Update the z index of the layers */
		game.iso.simpleSort(game.iso_layers['floor']);
		game.iso.simpleSort(game.iso_layers['main']);
	},
	render: function() {

		if(game._debug) {
			game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe");
			game.debug.text(game.player.coord.x+":"+game.player.coord.y,2,28,"#a7aebe");
		}
		
	}
}

game.state.add('Level',LostInWarehouse.Level);