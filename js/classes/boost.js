
var Boost = function(raw) {

	this.active = raw.active;

	/* Coords */
	this.coord = {x: raw.coord.x, y: raw.coord.y};

	/* Sprite */
	this.sprite = game.add.isoSprite(
			raw.coord.x*game.tile.width,
			raw.coord.y*game.tile.height,
			0,
			'tile-'+(Boost.data.base_sprite_id+(this.active ? raw.direction_activated : raw.direction)),
			0,
			game.iso_layers['floor']
		);
	this.sprite.anchor.set(0.5,1);

	/* Misc */
	this.id = raw.id;
	this.direction = raw.direction;
	this.direction_activated = raw.direction_activated;
	this.weight = raw.weight;

	this.current_weight = this.active ? this.weight : 0;
};

Boost.data = {
	base_sprite_id: 20
};

Boost.create = function() {

	var boosts = game.map.layers['boosts'];

	boosts.list = [];

	boosts.list_raw.forEach(function(boost_raw) {

		var boost = new Boost(boost_raw);

		boosts.list.push(boost);

	});

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


// PROTOTYPES


Boost.prototype.activate = function() {

	this.current_weight += 1;

	if (!this.active && this.current_weight >= this.weight) {

		this.active = true;
		this.sprite.loadTexture('tile-'+(Boost.data.base_sprite_id+this.direction_activated));

		// If there is a woodbox on it, make it slide
		/*var woodbox = WoodBox.getWoodBox(this.coord.x,this.coord.y);

		if (woodbox != undefined &&!woodbox.isSliding) {
			woodbox.slide();
		}*/

	}

};

Boost.prototype.deactivate = function() {

	this.current_weight -= 1;

	if (this.active && this.current_weight < this.weight) {

		this.active = false;
		this.sprite.loadTexture('tile-'+(Boost.data.base_sprite_id+this.direction));

	}

};