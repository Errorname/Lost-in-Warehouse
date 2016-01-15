
var Wall = function(x,y,sprite_id) {

	/* Coords */
	this.coord = {x: x, y: y};

	/* Sprite */
	this.sprite = game.add.isoSprite(
			x*game.tile.width,
			y*game.tile.height,
			0,
			'tile-'+sprite_id,
			0,
			game.iso_layers['main']
		);
	this.sprite.anchor.set(0.5,1);
	this.sprite.id = sprite_id;

}

Wall.getWall = function(x,y) {

	if (game.map.layers.walls.tiles[x] != undefined)
		return game.map.layers.walls.tiles[x][y];

};

Wall.create = function() {

	var walls = game.map.layers['walls'];

	walls.tiles = [];

	for (var x = 0; x < game.map.width; x++) {

		walls.tiles[x] = [];

		for (var y = 0; y < game.map.height; y++) {

			var sprite_id = walls.tiles_raw[y][x]; // Y,X => not an error

			if (sprite_id > 0) {
				walls.tiles[x][y] = new Wall(x,y,sprite_id);
			}
		}
	}

};