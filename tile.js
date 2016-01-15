
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