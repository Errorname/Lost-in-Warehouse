

LostInWarehouse.Title = function(game) {};

LostInWarehouse.Title.prototype =
{
	preload: function() {
	},
	create: function() {

		console.log('Title Screen (TODO)');

		game.state.start('Level')

	}
}

game.state.add('Title',LostInWarehouse.Title);