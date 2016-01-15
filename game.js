var game = new Phaser.Game(1024, 600, Phaser.AUTO, 'game', null, true, false);

var LostInWarehouse = function() {};

/* Some misc data */
game._debug = true;

game.nb_levels = 4;
game.nb_tiles = 29;

game.exit_tile = 18;
game.package_tile = 26;

game.id_level = 3;

game.tile = {width: 67, height: 67};

game.goToNextLevel = function() {
	game.id_level++;
	
	game.state.restart();
}

game.restart = function() {
	game.state.restart();
}