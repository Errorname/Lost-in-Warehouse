var game = new Phaser.Game(1024, 600, Phaser.AUTO, 'game', null, true, false);

var LostInWarehouse = function() {};

/* Some misc data */
game._debug = true;

game.nb_levels = 3;
game.nb_tiles = 24;

game.exit_tile = 18;

game.id_level = 2;

game.tile = {width: 67, height: 67};

game.goToNextLevel = function() {
	game.id_level++;
	
	game.state.restart();
}

game.restart = function() {
	game.state.restart();
}