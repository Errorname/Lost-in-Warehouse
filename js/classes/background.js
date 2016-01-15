
var Background = function(x,y,sprite_id) {

	/* Coords */
	this.coord = {x: x, y: y};

	/* Sprite */
	this.sprite = game.add.isoSprite(
			x*game.tile.width,
			y*game.tile.height,
			0,
			'tile-'+sprite_id,
			0,
			game.iso_layers['background']
		);
	this.sprite.anchor.set(0.5,1);
	this.sprite.id = sprite_id;

}

Background.create = function() {

	var background = game.map.layers['background'];

	background.tiles = [];

	for (var x = 0; x < game.map.width; x++) {

		background.tiles[x] = [];

		for (var y = 0; y < game.map.height; y++) {

			var sprite_id = background.tiles_raw[y][x]; // Y,X => not an error

			if (sprite_id > 0) {
				background.tiles[x][y] = new Background(x,y,sprite_id);
			}
		}
	}

};