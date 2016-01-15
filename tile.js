
var Tile = function(x, y, sprite_id, iso_layer) {

	/* Coords */
	this.coord = {x: x, y: y};

	/* Sprite */
	this.sprite = game.add.isoSprite(
			x*Tile.width,
			y*Tile.height,
			0,
			'tile-'+sprite_id,
			0,
			game.iso_layers[iso_layer]
		);
	this.sprite.anchor.set(0.5,1);
	this.sprite.id = sprite_id;

};

Tile.width = 67;
Tile.height = 67;

Tile.addTriggerCallbacks = function(tile) {

	tile.trigger = function() {

		tile.triggered = true;
		tile.sprite.loadTexture('tile-'+tile.sprite.id_triggered);

		tile.tiles_to_action.forEach(function (id) {
			// activate action-tiles
			game.map.layers['action_tiles'].tiles_by_id[id].activate(1);
		});

	};

	tile.untrigger = function() {

		var timer = game.time.create(false);

		timer.add(tile.duration, function() {
			
			tile.triggered = false;
			tile.sprite.loadTexture('tile-'+tile.sprite.id);

			tile.tiles_to_action.forEach(function (id) {
				// activate action-tiles
				game.map.layers['action_tiles'].tiles_by_id[id].activate(-1);
			});
		});

		timer.start();

	};
};

Tile.addActionCallbacks = function(tile) {

	tile.activate = function(weight) {

		tile.current_weight += weight;

		if (!tile.active && tile.current_weight >= tile.weight) {

			tile.active = true;
			tile.sprite.loadTexture('tile-'+tile.sprite.id_activated);

			if (tile.type == 'obstacle') {
				game.iso_layers['main'].remove(tile.sprite);
				game.iso_layers['floor'].add(tile.sprite);
			}

		} else if (tile.active) {

			tile.active = false;
			tile.sprite.loadTexture('tile-'+tile.sprite.id);

			if (tile.type == 'obstacle') {
				game.iso_layers['floor'].remove(tile.sprite);
				game.iso_layers['main'].add(tile.sprite);
			}
		}

	};
};

Tile.addWoodboxCallbacks = function(tile) {

	tile.canMove = Misc.canMove;

	tile.move = function(key) {

		this.untrigger();

		var coord = Player.directionToCoord(key);

		game.map.layers.woodboxes.tiles[this.coord.x][this.coord.y] = undefined;

		this.coord.x += coord.x;
		this.coord.y += coord.y;

		if (game.map.layers.woodboxes.tiles[this.coord.x] == undefined) {
			game.map.layers.woodboxes.tiles[this.coord.x] = [];
		}
		game.map.layers.woodboxes.tiles[this.coord.x][this.coord.y] = this;

		var tween = game.add.tween(this.sprite).to({isoX: this.coord.x * Tile.width, isoY: this.coord.y * Tile.height}, 400, Phaser.Easing.Linear.None, true, 0, 0, false);
		
		tween.onComplete.add(function() {

				this.trigger();

			},this);

	};

	tile.trigger = function() {
		var trigger_tile = game.map.layers.triggers.tiles[this.coord.x];

		if (trigger_tile != undefined && trigger_tile[this.coord.y] != undefined) {
			trigger_tile = trigger_tile[this.coord.y];

			if (!trigger_tile.triggered) {
				if (!trigger_tile.permanent) {
					this.tile_triggered = trigger_tile;
				}
				
				trigger_tile.trigger();
			}
		}
	};

	tile.untrigger = function() {
		if (this.tile_triggered != undefined) {
			this.tile_triggered.untrigger();
			this.tile_triggered = undefined;
		}
	};

};