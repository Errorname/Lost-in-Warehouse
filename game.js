var game = new Phaser.Game(1024, 700, Phaser.AUTO, 'game', null, true, false);

var LostInWarehouse = function() {};

/* Some misc data */
game._debug = true;

game.nb_levels = 7;
game.nb_tiles = 29;

game.exit_tile = 18;
game.package_tile = 26;

game.id_level = 0;

game.tile = {width: 67, height: 67};

game.goToNextLevel = function() {
	game.id_level++;
	
	if (game.id_level > game.nb_levels) {
		game.backToMenu();
	} else {
		game.state.start('Level');
		game.jukebox.sound('cluck');
	}
}

game.restart = function() {
	game.state.restart();
}

game.chooseLevel = function(id_level) {
	game.id_level = id_level;

	game.state.start('Level');
	game.jukebox.sound('cluck');
}

game.backToTitle = function() {
	game.state.start('Title');
	game.jukebox.sound('cluck');
}

game.backToMenu = function() {
	game.state.start('Menu');
	game.jukebox.sound('cluck');
}

game.endLevel = function() {
	var pos = game.camera.position;
	var level = game.state.getCurrentState()
	level.disableUI();
	game.state.start('Win',false,false,pos,level.startTime);
}