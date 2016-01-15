
var Map = function() {};

Map.preload = function() {

	/* Load json map */
	game.load.json('map', 'assets/maps/'+game.level+'.json');

	/* Load tiles sprites */
	for (var i = 1; i <= 23; i++) {
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

	game.map.winning_tile = 18;

	/* Create layers */
	Map.createLayer();

};

Map.update = function() {

	// If a woodbox was blocked during a slide on a boost,
	// we need to make him try again to see if he can slide now

	game.map.layers.boosts.list.forEach(function(boost) {

		if ((boost.active && boost.direction_activated >= 0) || (!boost.active && boost.direction >= 0)) {
			var woodbox = WoodBox.getWoodBox(boost.coord.x,boost.coord.y);
			if (woodbox != undefined && woodbox.blockedOnBoost) {
				woodbox.blockedOnBoost = false;
				woodbox.slide();
			}
		}

	});

};

Map.render = function() {

};