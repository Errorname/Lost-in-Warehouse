

LostInWarehouse.Preload = function(game) {};

LostInWarehouse.Preload.prototype =
{
	preload: function() {

		text = game.add.text(400, 330, 'Loading: 0%', { fill: '#000000' });

		game.load.onLoadStart.add(function() {
			console.log('Loading assets');
		},this);

		game.load.onFileComplete.add(function(progress, cacheKey, success, totalLoaded, totalFiles) {
			console.log("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);
			text.setText('Loading: '+progress+'%');
		},this);

		game.load.onLoadComplete.add(function() {

			game.load.onLoadStart.removeAll();
			game.load.onFileComplete.removeAll();
			game.load.onLoadComplete.removeAll();
			console.log('Loading assets done.');

		},this);

		/* Loading levels */
		for (var i = 0; i <= game.nb_levels; i++) {
			game.load.json('level-'+i, 'assets/levels/'+i+'.json');
		}

		/* Loading tiles sprites */
		for (var i = 1; i <= game.nb_tiles; i++) {
			game.load.image('tile-'+i, 'assets/sprites/tile-'+i+'.png');
		}

		/* Loading robot spritesheet */
		game.load.spritesheet('robot','assets/sprites/robot.png',120,105,8);

		/* Loading enemy spritesheet */
		game.load.spritesheet('enemy','assets/sprites/enemy.png',120,105,8);

		/* Loading HUD */
		game.load.spritesheet('replay','assets/hud/replay.png',69,71,2);
		game.load.spritesheet('start','assets/hud/start.png',247,60,2);
		game.load.image('title','assets/hud/title.png');
		game.load.image('menu','assets/hud/menu.png');
		game.load.spritesheet('levels','assets/hud/levels.png',110,148,3);
		game.load.spritesheet('numbers','assets/hud/numbers.png',48,60,20);
		game.load.spritesheet('exit','assets/hud/exit.png',69,71,2);
		game.load.image('awesome','assets/hud/awesome.png');
		game.load.image('box','assets/hud/box.png');
		game.load.spritesheet('next','assets/hud/next.png',69,71,2);
		game.load.spritesheet('back','assets/hud/back.png',69,71,2);
		game.load.image('item','assets/hud/item.png');
		game.load.spritesheet('sound','assets/hud/sound.png',69,71,4);

		/* Loading Music & Sounds */
		game.load.audio('click','assets/music/click.ogg');
		game.load.audio('clack','assets/music/clack.ogg');
		game.load.audio('cluck','assets/music/cluck.wav');
		game.load.audio('open','assets/music/open.ogg');
		game.load.audio('push','assets/music/push.wav');
		game.load.audio('box','assets/music/box.ogg');
		game.load.audio('win','assets/music/win.mp3');
		game.load.audio('tp','assets/music/tp.mp3');
		game.load.audio('lose','assets/music/lose.wav');

		/* Loading Items */
		for (var i=0; i<8; i++) {
			game.load.image('item-'+i,'assets/items/'+i+'.jpg');
		}

	},
	create: function() {

		game.load.audio("music1","assets/music/Thinking.mp3");
		game.load.audio("music2","assets/music/Anticipation.mp3");
		//game.load.audio("music3","assets/music/Thinking - Alternative.mp3");
		//game.load.audio("music4","assets/music/Anticipation - Alternative.mp3");

		game.load.onLoadComplete.add(function() {

			console.log('starting music');

			game.jukebox.next();
		},this);

		game.load.start();

		game.state.start('Title');
	}
}

game.state.add('Preload',LostInWarehouse.Preload);