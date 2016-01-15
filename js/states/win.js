

LostInWarehouse.Win = function(game) {};

LostInWarehouse.Win.prototype =
{
	init: function(pos,time) {
		this.pos = pos;

		this.time = game.time.now-time
	},
	preload: function() {
		console.log('Loading Win Screen');
	},
	create: function() {

		/* Add the HUD */
		game.camera.setPosition(this.pos.x-512,this.pos.y-350);
		var awesome = game.add.sprite(0,0, 'awesome');
		awesome.fixedToCamera = true;
		this.box = game.add.button(540,350, 'box',this.showItem,this,0,0,0,0);
		this.box.fixedToCamera = true;
		var text = game.add.text(360,300, 'You delivered the package in '+(Math.floor(this.time/1000))+'\' '+( Math.floor((this.time%1000)/10) )+'"',{fontSize: '16px', fill: "#ffffff"});
		text.fixedToCamera = true;

		game.progress.unlockLevel(game.id_level+1);

		console.log('Loading Title Screen done.');

	},
	showItem: function() {

		game.jukebox.sound('cluck',0.5);

		this.box.kill();

		var item_menu = game.add.sprite(0,0, 'item');
		item_menu.fixedToCamera = true;
		var back = game.add.button(540,470, 'back',game.backToMenu,this,0,0,1,0);
		back.fixedToCamera = true;
		var next = game.add.button(640,470, 'next',game.goToNextLevel,this,0,0,1,0);
		next.fixedToCamera = true;

		var id_item = game.progress.randomItem();

		var item = game.add.sprite(240,200, 'item-'+id_item);
		item.fixedToCamera = true;

		var text = game.add.text(500,300, game.progress.itemText(id_item),{fontSize: '16px', fill: "#ffffff"});
		text.fixedToCamera = true;
	}
}

game.state.add('Win',LostInWarehouse.Win);