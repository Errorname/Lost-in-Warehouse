
var Tile = function(x, y, sprite_id, iso_layer) {

	/* Coords */
	this.coord = {x: x, y: y};

	/* Sprite */
	this.sprite = game.add.isoSprite(
			x*Tile.width,
			y*Tile.height,
			0,
			'tile-'+sprite_id,
			0,
			game.iso_layers[iso_layer]
		);
	this.sprite.anchor.set(0.5,1);
	this.sprite.id = sprite_id;

};

/* Tile dimension */

Tile.width = 67;
Tile.height = 67;
