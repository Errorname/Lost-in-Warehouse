
var Door = function (raw) {

	this.opened = raw.opened;

	/* Coords */
	this.coord = {x: raw.coord.x, y: raw.coord.y};

	/* Sprite */
	this.sprite = game.add.isoSprite(
			raw.coord.x*Tile.width,
			raw.coord.y*Tile.height,
			0,
			'tile-'+(this.opened ? raw.sprite_id_opened : raw.sprite_id),
			0,
			game.iso_layers[(this.opened ? 'floor' : 'main')]
		);
	this.sprite.anchor.set(0.5,1);
	this.sprite.id = raw.sprite_id;
	this.sprite.id_opened = raw.sprite_id_opened;

	/* Other */
	this.id = raw.id;
	this.weight = raw.weight;

	this.current_weight = this.opened ? this.weight : 0;

};

Door.getDoor = function(x, y) {

	for(var i = 0; i < game.map.layers.doors.list.length; i++) {
		var door = game.map.layers.doors.list[i];

		if (door.coord.x == x && door.coord.y == y) {
			return door;
		}
	}

};

Door.getDoorById = function(id) {

	for (var i = 0; i < game.map.layers.doors.list.length; i++) {
		var door = game.map.layers.doors.list[i];

		if (door.id == id) {
			return door;
		}
	}
}


// Prototypes


Door.prototype.open = function() {

	// So, the thing is: Some door may need to be open by 2 triggers
	this.current_weight += 1;

	if (!this.opened && this.current_weight >= this.weight) {

		this.opened = true;
		this.sprite.loadTexture('tile-'+this.sprite.id_opened);

		// An open door goes to the floor
		game.iso_layers['main'].remove(this.sprite);
		game.iso_layers['floor'].add(this.sprite);

	}

}

Door.prototype.close = function() {

	this.current_weight -= 1;

	if (this.opened && this.current_weight < this.weight) {

		this.opened = false;
		this.sprite.loadTexture('tile-'+this.sprite.id);

		// A closed door goes to the main layer
		game.iso_layers['floor'].remove(this.sprite);
		game.iso_layers['main'].add(this.sprite);

	}

}