
var Layers = function() {};

Layers.load = function() {};

Layers.load.background = function() {
	// Still no background !
};

Layers.load.floor = function() {

	var floor = game.map.layers['floor'];

	floor.tiles = [];

	for (var x = 0; x < game.map.width; x++) {

		floor.tiles[x] = [];

		for (var y = 0; y < game.map.height; y++) {

			var sprite_id = floor.tiles_raw[y][x];

			if (sprite_id > 0) {
				floor.tiles[x][y] = new Tile(x,y,sprite_id,'floor');
			}

		}
	}

};

Layers.load.walls = function() {

	var walls = game.map.layers['walls'];

	walls.tiles = [];

	for (var x = 0; x < game.map.width; x++) {

		walls.tiles[x] = [];

		for (var y = 0; y < game.map.height; y++) {

			var sprite_id = walls.tiles_raw[y][x];

			if (sprite_id > 0) {
				walls.tiles[x][y] = new Tile(x,y,sprite_id,'main');
			}
		}
	}

};

Layers.load.triggers = function() {

	var triggers = game.map.layers['triggers'];

	triggers.tiles = [];

	triggers.tiles_raw.forEach(function(tile_raw) {

		if (triggers.tiles[tile_raw.coord.x] == undefined) {
			triggers.tiles[tile_raw.coord.x] = [];
		}

		var tile = new Tile(tile_raw.coord.x,tile_raw.coord.y,tile_raw.sprite_id,'floor');

		triggers.tiles[tile_raw.coord.x][tile_raw.coord.y] = tile;

		tile.sprite.id_triggered = tile_raw.sprite_id_triggered;
		tile.permanent = tile_raw.permanent;
		tile.duration = tile_raw.duration;
		tile.tiles_to_action = tile_raw.tiles_to_action;
		tile.triggered = false;

		Tile.addTriggerCallbacks(tile);
		
	});
};

Layers.load.action_tiles = function() {

	var action_tiles = game.map.layers['action_tiles'];

	action_tiles.tiles = [];
	action_tiles.tiles_by_id = [];

	action_tiles.tiles_raw.forEach(function(tile_raw) {

		if (action_tiles.tiles[tile_raw.coord.x] == undefined) {
			action_tiles.tiles[tile_raw.coord.x] = [];
		}

		var iso_layer = ['boost'].indexOf(tile_raw.type) >= 0 ? 'floor' : 'main';

		var tile = new Tile(tile_raw.coord.x,tile_raw.coord.y,tile_raw.sprite_id,iso_layer);
	
		action_tiles.tiles[tile_raw.coord.x][tile_raw.coord.y] = tile;
		action_tiles.tiles_by_id[tile_raw.id] = tile;

		tile.id = tile_raw.id;
		tile.active = tile_raw.active;
		tile.sprite.id_activated = tile_raw.sprite_id_activated;
		tile.type = tile_raw.type;
		tile.weight = tile_raw.weight;
		tile.current_weight = tile.active ? tile.weight : 0;
		tile.direction = tile_raw.direction;

		Tile.addActionCallbacks(tile);

		if (tile.active) {
			tile.active = false; // bug fix, look away.
			tile.activate(tile.weight);
		}
	});

};

Layers.load.woodboxes = function() {

	var woodboxes = game.map.layers['woodboxes'];

	woodboxes.tiles = [];

	woodboxes.coords.forEach(function(coord) {

		if(woodboxes.tiles[coord.x] == undefined) {
			woodboxes.tiles[coord.x] = [];
		}

		var tile = new Tile(coord.x,coord.y,woodboxes.sprite_id,'main');

		woodboxes.tiles[coord.x][coord.y] = tile;
		tile.type = "woodbox";

		Tile.addWoodboxCallbacks(tile);

	});

};