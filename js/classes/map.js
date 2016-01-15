
var Map = function() {};

Map.create = function() {

	var level_json = game.cache.getJSON('level-'+game.id_level);

	/* Create the map object */
	game.map = new Map();
	game.map.width = level_json.width;
	game.map.height = level_json.height;
	game.map.layers = level_json.layers;

	game.map.createLayers();

};

Map.prototype.createLayers = function() {

	Background.create();
	Floor.create();
	Wall.create();
	Trigger.create();
	Door.create();
	Boost.create();
	Portal.create();
	WoodBox.create();
	Laser.create();
	Enemy.create();

};