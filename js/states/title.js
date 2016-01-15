

LostInWarehouse.Title = function(game) {};

LostInWarehouse.Title.prototype =
{
	preload: function() {
		console.log('Loading Title Screen');
		game.id_level = 0;
	},
	create: function() {

		// Set special config
		game.iso.anchor.setTo(0.7, 0.5);
		game.world.setBounds(0, 0, 1024, 700);

		/* Add a group holder for iso layers */
		game.iso_layers = [];
		['background','floor','main'].forEach(function (layer) {
			game.iso_layers[layer] = game.add.group(undefined,layer);
		});

		/* Create Map & Player */
		Map.create();
		Player.create();

		/* Add the HUD */
		var title = game.add.sprite(212,10, 'title');
		var start = game.add.button(670,350, 'start',this.makeRobotWalk,this,0,0,1,0);

		game.jukebox.putSoundButton({x:945,y:10});

		console.log('Loading Title Screen done.');

	},
	goToMenu: function() {

		// Set true config back
		game.iso.anchor.setTo(0.5, 0.2);
		game.world.setBounds(0, 0, 10000, 7000);

		game.id_level = 1;

		game.state.start('Menu');
	},
	makeRobotWalk: function() {
	
		game.jukebox.sound('cluck');

		game.player.sprite.frame = 2;
		var tween = game.add.tween(game.player.sprite).to({isoY: 4*game.tile.height}, 1400, Phaser.Easing.Linear.None, true, 0, 0, false);
	
		tween.onComplete.add(function() {

			game.time.events.add(200, function() {
				this.goToMenu();
			},this);
			
		},this);

	}
}

game.state.add('Title',LostInWarehouse.Title);