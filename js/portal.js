
var Portal = function(raw) {

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
	this.portal_to = raw.portal_to;
	this.weight = raw.weight;

	this.current_weight = this.active ? this.weight : 0;
	
};

Portal.getPortal = function(x,y) {

	for(var i = 0; i < game.map.layers.portals.list.length; i++) {

		var portal = game.map.layers.portals.list[i];

		if (portal.coord.x == x && portal.coord.y == y) {
			return portal;
		}

	}

};

Portal.getPortalById = function(id) {


	for (var i = 0; i < game.map.layers.portals.list.length; i++) {

		var portal = game.map.layers.portals.list[i];

		if (portal.id == id) {
			return portal;
		}

	}

};


// Prototypes


Portal.prototype.activate = function() {

	this.current_weight += 1;

	if (!this.active && this.current_weight >= this.weight) {

		this.active = true;
		this.sprite.loadTexture('tile-'+this.sprite.id_activated);

	}

};

Portal.prototype.deactivate = function() {

	this.current_weight -= 1;

	if (this.active && this.current_weight < this.weight) {

		this.active = false;
		this.sprite.loadTexture('tile-'+this.sprite.id);

	}

};