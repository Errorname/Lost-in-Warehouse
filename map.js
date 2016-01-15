
var Map = function(map_json) {
	this.tiles = [];
	this.width = map_json.width;
	this.height = map_json.height;
	this.tile = map_json.tile;
	this.tiles_info = map_json.tiles_info
};

Map.preload = function() {

	/* Load json map */
	game.load.json('map','assets/maps/1.json');

	/* Load tiles sprites */
	game.load.image('tile-0', 'assets/sprites/tile-0.png');
	game.load.image('tile-1', 'assets/sprites/tile-1.png');

};

Map.create = function() {

	/* Create groups */
	game.groups['floor'] = game.add.group(undefined,'floor');
	game.groups['obstacles'] = game.add.group(undefined,'obstacles');

	/* Bind the map json to the game object */
	game.map_json = game.cache.getJSON('map');

	/* Create the map object */
	game.map = new Map(game.map_json);

	/* Create the tiles */
	Map.createTiles();
};

Map.createTiles = function() {

	var tile;

	var tile_w = game.map.tile.width;
	var tile_h = game.map.tile.height;

	for (var x = 0; x < game.map.width; x++) {

		game.map.tiles[x] = [];

		for (var y = 0; y < game.map.height; y++) {

			var tile_id = game.map_json.tiles[y][x];

			tile = game.add.isoSprite(x*tile_w, y*tile_h, 0, 'tile-'+tile_id, 0, game.groups[game.map.tiles_info[tile_id].group]);
			if (game.map.tiles_info[tile_id].group != 'floor') {
				game.groups['isoGroup'].add(tile);
			}
			tile.anchor.set(0.5,0.95);
			tile.coord = {x: x, y:y};
			game.map.tiles[x][y] = tile;

		}

	}

};

Map.update = function() {

};

Map.render = function() {

};