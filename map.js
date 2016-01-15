
var Map = function(map_json) {
	this.width = map_json.width;
	this.height = map_json.height;
	this.layers = map_json.layers;
};

Map.preload = function() {

	/* Load json map */
	game.load.json('map','assets/maps/1.json');

	/* Load tiles sprites */
	for (var i = 1; i <= 14; i++) {
		game.load.image('tile-'+i, 'assets/sprites/tile-'+i+'.png');
	}

};

Map.create = function() {

	/* Create the map object */
	game.map = new Map(game.cache.getJSON('map'));

	/* Create iso-layers*/
	['background','floor','main','roof'].forEach(function (group) {
		game.iso_layers[group] = game.add.group(undefined,group);
	});

	/* Create the tiles */
	Map.createTiles();

};

Map.createTiles = function() {

	Layers.load.background();
	Layers.load.floor();
	Layers.load.walls();
	Layers.load.triggers();
	Layers.load.action_tiles();

};

Map.update = function() {

};

Map.render = function() {

};