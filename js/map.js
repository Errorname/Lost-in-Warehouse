
var Map = function() {};

Map.preload = function() {

	/* Load json map */
	game.load.json('map', 'assets/maps/1.json');

	/* Load tiles sprites */
	for (var i = 1; i <= 14; i++) {
		game.load.image('tile-'+i, 'assets/sprites/tile-'+i+'.png');
	}

};

Map.create = function() {

	var map_json = game.cache.getJSON('map');
	
	/* Create the map object */
	game.map = new Map();
	game.map.width = map_json.width;
	game.map.height = map_json.height;
	game.map.layers = map_json.layers;
	game.map.player_coord = map_json.player;

	/* Create layers */
	Map.createLayer();

};

Map.update = function() {

};

Map.render = function() {

};