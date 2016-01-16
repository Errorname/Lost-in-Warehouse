
var Door = function (raw) {

	this.inversed = raw.inversed == undefined ? false : raw.inversed;

	//console.log(raw.inversed);
	//console.log(raw.opened?"truex":"falsex");

	this.opened = this.inversed ? !raw.opened : raw.opened;

	//console.log(this.opened?"true":"false");

	/* Coords */
	this.coord = {x: raw.coord.x, y: raw.coord.y};

	/* Sprite */
	this.sprite = game.add.isoSprite(
			raw.coord.x*game.tile.width,
			raw.coord.y*game.tile.height,
			0,
			'tile-'+(this.opened ? Door.data.sprite_id_opened : Door.data.sprite_id),
			0,
			game.iso_layers[(this.opened ? 'floor' : 'main')]
		);
	this.sprite.anchor.set(0.5,1);

	/* Misc */
	this.id = raw.id;
	this.weight = raw.weight;

	this.current_weight = this.opened ? this.weight : 0;
};

Door.data = {
	sprite_id: 13,
	sprite_id_opened: 17
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
};

Door.create = function() {

	var doors = game.map.layers['doors'];

	doors.list = [];

	doors.list_raw.forEach(function(door_raw) {

		var door = new Door(door_raw);

		doors.list.push(door);

	});

};


// PROTOTYPES


Door.prototype.open = function(inv) {

	inv = inv == undefined ? false : inv;
	if (this.inversed && !inv && this.opened) {
		this.close(true);
		return;
	}

	// So, the thing is: Some door may need to be open by 2 triggers
	this.current_weight += 1;

	if (!this.opened && this.current_weight >= this.weight) {

		this.opened = true;
		this.sprite.loadTexture('tile-'+Door.data.sprite_id_opened);

		this.liftBox(false);

		// An open door goes to the floor
		game.iso_layers['main'].remove(this.sprite);
		game.iso_layers['floor'].add(this.sprite);

	}

};

Door.prototype.close = function(inv) {

	inv = inv == undefined ? false : inv;
	if (this.inversed && !inv && !this.opened) {
		this.open(true);
		return;
	}

	this.current_weight -= 1;

	if (this.opened && this.current_weight < this.weight) {

		this.opened = false;
		this.sprite.loadTexture('tile-'+Door.data.sprite_id);

		this.liftBox(true);

		// A closed door goes to the main layer
		game.iso_layers['floor'].remove(this.sprite);
		game.iso_layers['main'].add(this.sprite);

	}

};

Door.prototype.liftBox = function(lift) {
	var woodbox = WoodBox.getWoodBox(this.coord.x,this.coord.y)
	if(woodbox) {
		woodbox.sprite.isoZ = lift ? 30 : 0;
	}
};