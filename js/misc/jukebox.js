
game.jukebox = {
	playing: true,
	nb_music: 2,
	id_music: 0,
	music: null,
	next: function() {
		console.log('next!');
		this.id_music = this.id_music == this.nb_music ? 1 : this.id_music + 1;
		this.music = game.add.audio('music'+this.id_music);
		if (this.playing) {
			this.music.play('',0,0.2);
		}

		this.music.onStop.add(function() {
			game.jukebox.next();
		});
	},
	off: function() {
		this.playing = false;

		if (this.music != null) {
			if (this.music.isPlaying) {
				this.music.pause();
			} else {
				this.music.onPlay.add(function() {
					this.music.pause();
				},this)
			}
		}
	},
	on: function() {
		this.playing = true;
		this.music.resume();
	},
	putSoundButton: function(coord) {
		this.sound_button_on = game.add.button(coord.x,coord.y, 'sound',function() {
			this.off();
			this.sound_button_on.kill();
			this.sound_button_off.revive();
		},this,2,2,3,2);
		this.sound_button_on.fixedToCamera = true;
		this.sound_button_off = game.add.button(coord.x,coord.y, 'sound',function() {
			this.on();
			this.sound_button_off.kill();
			this.sound_button_on.revive();
		},this,0,0,1,0);
		this.sound_button_off.fixedToCamera = true;

		if (this.playing) {
			this.sound_button_off.kill();
		} else {
			this.sound_button_on.kill();
		}
	},
	sound: function(key,volume) {
		if(this.playing) {
			if (volume != undefined) {
				game.add.audio(key).play('',0,volume);
			} else {
				game.add.audio(key).play();
			}
		}
	}
};