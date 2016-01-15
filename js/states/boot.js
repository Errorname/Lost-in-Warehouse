

LostInWarehouse.Boot = function(game) {};

LostInWarehouse.Boot.prototype =
{
	preload: function() {
		
	},
	create: function() {

		console.log('Boot...');

		game.state.start('Preload')

	}
}

game.state.add('Boot',LostInWarehouse.Boot);