

LostInWarehouse.Menu = function(game) {};

LostInWarehouse.Menu.prototype =
{
	preload: function() {
		console.log('Loading Menu Screen');

		game.progress.loadProgress();
		game.progress.loadItems();
	},
	create: function() {

		/* Add the HUD */
		var menu = game.add.sprite(0,0, 'menu');
		var exit = game.add.button(20,25, 'exit',game.backToTitle,this,0,0,1,0);
		game.jukebox.putSoundButton({x:935,y:25});

		var available_levels = game.progress.available_levels;

		for (var y = 0; y < 2; y++) {
			for (var x = 0; x < 4; x++) {
				var id = y*4+x+1;
				if (y*4+x+1 <= available_levels) {
					var button = null;
					button = game.add.button(150+(x*200)+(y*100),100+(y*200), 'levels', function() {game.chooseLevel(this.id)},button, 1, 2, 1, 1);
					button.id = id;
					game.add.sprite(180+(x*200)+(y*100),140+(y*200), 'numbers',10+(y*4+x+1));
				} else if (y*4+x+1 <= game.nb_levels) {
					game.add.button(150+(x*200)+(y*100),100+(y*200), 'levels', function() {console.log('clic');}, 0, 0, 0, 0);
				}
			}
		}

		console.log('Loading Menu Screen done.');

	}
}

game.state.add('Menu',LostInWarehouse.Menu);