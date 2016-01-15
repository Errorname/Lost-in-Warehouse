
var Map = function(map_json) {
	this.width = map_json.width;
	this.height = map_json.height;
	this.layers = map_json.layers;
};

Map.preload = function() {

	/* Load json map */
	game.load.json('map','assets/maps/1.json');

	/* Load json map info */
	game.load.json('map-info','assets/maps/info.json');

	/* Load tiles sprites */
	for (var i = 1; i <= 2; i++) {
		game.load.image('tile-'+i, 'assets/sprites/tile-'+i+'.png');
	}

};

Map.create = function() {

	/* Bind the map json to the game object */
	game.map_info = game.cache.getJSON('map-info');

	/* Create groups */
	game.map_info.groups.forEach(function(group) {
		game.groups[group] = game.add.group(undefined,group);
	});

	/* Create the map object */
	game.map = new Map(game.cache.getJSON('map'));

	/* Create the tiles */
	Map.createTiles();

};

Map.createTiles = function() {

	var tile;

	var tile_w = game.map_info.tile.width;
	var tile_h = game.map_info.tile.height;

	var layers = game.map_info.layers;

	layers.forEach(function (layer_raw) {
		var layer = game.map.layers[layer_raw.name];

		if (layer == undefined)
			return;

		layer.tiles = [];

		if (layer.method == "grid") {

			for (var x = 0; x < game.map.width; x++) {

				layer.tiles[x] = [];

				for (var y = 0; y < game.map.height; y++) {

					var tile_id = layer.tiles_raw[y][x];

					if (tile_id > 0) {
						var tile = game.add.isoSprite(
								x*tile_w,
								y*tile_h,
								0,
								'tile-'+tile_id,
								0,
								game.groups[layer_raw.group]
							);

						tile.anchor.set(0.5,1);

						tile.coord = {x: x, y: y};
						layer.tiles[x][y] = tile;
					}
				}
			}

		}
		else if (layer.method == "list") {

			layer.tiles_raw.forEach(function(tile_raw) {

				if (layer.tiles[tile_raw.coord.x] == undefined) {
					layer.tiles[tile_raw.coord.x] = [];
				}

				var tile = game.add.isoSprite(
						tile_raw.coord.x*tile_w,
						tile_raw.coord.y*tile_h,
						0,
						'tile-'+tile_raw.id,
						0,
						game.groups[layer_raw.group]
					);

				tile.anchor.set(0.5,1);

				tile.coord = tile_raw.coord;
				layer.tiles[tile_raw.coord.x][tile_raw.coord.y] = tile;
			});

		}
	});

};

Map.update = function() {

};

Map.render = function() {

};