
var Laser = function (x,y,direction) {

	/* Coords */
	this.coord = {x: x, y: y};

	/* Sprite */
	this.sprite = game.add.isoSprite(
			x*game.tile.width,
			y*game.tile.height,
			0,
			'tile-'+(direction == 0 || direction == 2 ? 27 : 28),
			0,
			game.iso_layers['main']
		);
	this.sprite.anchor.set(0.5,1.0);

};

Laser.getLaser = function(x, y) {

	for(var i = 0; i < game.map.layers.lasers.list.length; i++) {
		var laser = game.map.layers.lasers.list[i];

		if (laser.coord.x == x && laser.coord.y == y) {
			return laser;
		}
	}

};

Laser.create = function() {

	game.map.layers['lasers'] = {list:[]};

};

Laser.dumpLasers = function() {

	game.map.layers.lasers.list.forEach(function(laser) {
		game.iso_layers['main'].remove(laser.sprite);
		laser.sprite.destroy();
	});

	game.map.layers['lasers'] = {list:[]};

};