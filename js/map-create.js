
Map.createLayer = function(){

	/* Create the different layers */
	Map.createLayer.background();
	Map.createLayer.floor();
	Map.createLayer.walls();
	Map.createLayer.triggers();
	Map.createLayer.boosts();
	Map.createLayer.doors();
	Map.createLayer.woodboxes();

};

Map.createLayer.background = function () {

	var background = game.map.layers['background'];

	background.tiles = [];

	for (var x = 0; x < game.map.width; x++) {

		background.tiles[x] = [];

		for (var y = 0; y < game.map.height; y++) {

			var sprite_id = background.tiles_raw[y][x]; // Y,X => not an error

			if (sprite_id > 0) {
				background.tiles[x][y] = game.add.isoSprite(
					x*Tile.width,
					y*Tile.height,
					0,
					'tile-'+sprite_id,
					0,
					game.iso_layers['background']
				);
				background.tiles[x][y].anchor.set(0.5,1);
			}

		}
	}

};

Map.createLayer.floor = function() {

	var floor = game.map.layers['floor'];

	floor.tiles = [];

	for (var x = 0; x < game.map.width; x++) {

		floor.tiles[x] = [];

		for (var y = 0; y < game.map.height; y++) {

			var sprite_id = floor.tiles_raw[y][x]; // Y,X => not an error

			if (sprite_id > 0) {
				floor.tiles[x][y] = new Tile(x,y,sprite_id,'floor');
			}

		}

	}

};

Map.createLayer.walls = function() {

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

Map.createLayer.triggers = function() {

	var triggers = game.map.layers['triggers'];

	triggers.list = [];

	triggers.list_raw.forEach(function(trigger_raw) {

		var trigger = new Trigger(trigger_raw, 'floor');

		triggers.list.push(trigger);

	});

};

Map.createLayer.boosts = function() {

	var boosts = game.map.layers['boosts'];

	boosts.list = [];

	boosts.list_raw.forEach(function(boost_raw) {

		var boost = new Boost(boost_raw);

		boosts.list.push(boost);

	});

}

Map.createLayer.doors = function() {

	var doors = game.map.layers['doors'];

	doors.list = [];

	doors.list_raw.forEach(function(door_raw) {

		var door = new Door(door_raw);

		doors.list.push(door);

	});

};

Map.createLayer.woodboxes = function() {

	var woodboxes = game.map.layers['woodboxes'];

	woodboxes.list = [];

	woodboxes.coords.forEach(function(coord) {

		var woodbox = new WoodBox(coord.x,coord.y,woodboxes.sprite_id);

		woodboxes.list.push(woodbox);

	});

};