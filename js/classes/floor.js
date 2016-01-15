
var Floor = function(x,y,sprite_id) {

	/* Coords */
	this.coord = {x: x, y: y};

	/* Sprite */
	this.sprite = game.add.isoSprite(
			x*game.tile.width,
			y*game.tile.height,
			0,
			'tile-'+sprite_id,
			0,
			game.iso_layers['floor']
		);
	this.sprite.anchor.set(0.5,1);
	this.sprite.id = sprite_id;

}

Floor.create = function() {

	var floor = game.map.layers['floor'];

	floor.tiles = [];

	for (var x = 0; x < game.map.width; x++) {

		floor.tiles[x] = [];

		for (var y = 0; y < game.map.height; y++) {

			var sprite_id = floor.tiles_raw[y][x]; // Y,X => not an error

			if (sprite_id > 0) {
				floor.tiles[x][y] = new Floor(x,y,sprite_id);
			}
		}
	}

};