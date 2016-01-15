
var Boost = function(raw) {

	this.active = raw.active;

	/* Coords */
	this.coord = {x: raw.coord.x, y: raw.coord.y};

	/* Sprite */
	this.sprite = game.add.isoSprite(
			raw.coord.x*Tile.width,
			raw.coord.y*Tile.height,
			0,
			'tile-'+(this.active ? raw.sprite_id_activated : raw.sprite_id),
			0,
			game.iso_layers['floor']
		);
	this.sprite.anchor.set(0.5,1);
	this.sprite.id = raw.sprite_id;
	this.sprite.id_activated = raw.sprite_id_activated;

	/* Other */
	this.id = raw.id;
	this.direction = raw.direction;
	this.direction_activated = raw.direction_activated;
	this.weight = raw.weight;

	this.current_weight = this.active ? this.weight : 0;
	
};

Boost.getBoost = function(x,y) {

	for(var i = 0; i < game.map.layers.boosts.list.length; i++) {

		var boost = game.map.layers.boosts.list[i];

		if (boost.coord.x == x && boost.coord.y == y) {
			return boost;
		}

	}

};

Boost.getBoostById = function(id) {


	for (var i = 0; i < game.map.layers.boosts.list.length; i++) {

		var boost = game.map.layers.boosts.list[i];

		if (boost.id == id) {
			return boost;
		}

	}

};


// Prototypes


Boost.prototype.activate = function() {

	this.current_weight += 1;

	if (!this.active && this.current_weight >= this.weight) {

		this.active = true;
		this.sprite.loadTexture('tile-'+this.sprite.id_activated);

		// If there is a woodbox on it, make it slide
		var woodbox = WoodBox.getWoodBox(this.coord.x,this.coord.y);

		if (woodbox != undefined &&!woodbox.isSliding) {
			woodbox.slide();
		}

	}

};

Boost.prototype.deactivate = function() {

	this.current_weight -= 1;

	if (this.active && this.current_weight < this.weight) {

		this.active = false;
		this.sprite.loadTexture('tile-'+this.sprite.id);

	}

};