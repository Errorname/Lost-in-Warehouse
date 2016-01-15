
var Portal = function(raw) {

	this.active = raw.active;

	/* Coords */
	this.coord = {x: raw.coord.x, y: raw.coord.y};

	/* Sprite */
	this.sprite = game.add.isoSprite(
			raw.coord.x*game.tile.width,
			raw.coord.y*game.tile.height,
			0,
			'tile-'+(this.active ? Portal.data.sprite_id_activated : Portal.data.sprite_id),
			0,
			game.iso_layers['floor']
		);
	this.sprite.anchor.set(0.5,1);

	/* Other */
	this.id = raw.id;
	this.portal_to = raw.portal_to;
	this.weight = raw.weight;

	this.current_weight = this.active ? this.weight : 0;
}

Portal.data = {
	sprite_id: 19,
	sprite_id_activated: 24
}

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

Portal.create = function() {

	var portals = game.map.layers['portals'];

	portals.list = [];

	portals.list_raw.forEach(function(portal_raw) {

		var portal = new Portal(portal_raw);

		portals.list.push(portal);

	});

};


// PROTOTYPES


Portal.prototype.activate = function() {

	this.current_weight += 1;

	if (!this.active && this.current_weight >= this.weight) {

		this.active = true;
		this.sprite.loadTexture('tile-'+Portal.data.sprite_id_activated);

	}

};

Portal.prototype.deactivate = function() {

	this.current_weight -= 1;

	if (this.active && this.current_weight < this.weight) {

		this.active = false;
		this.sprite.loadTexture('tile-'+Portal.data.sprite_id);

	}

};