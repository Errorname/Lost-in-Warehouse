
var Trigger = function(raw, iso_layer) {
	
	this.triggered = false;

	/* Coords */
	this.coord = {x: raw.coord.x, y: raw.coord.y};

	/* Sprite */
	this.sprite = game.add.isoSprite(
			raw.coord.x*Tile.width,
			raw.coord.y*Tile.height,
			0,
			'tile-'+raw.sprite_id,
			0,
			game.iso_layers[iso_layer]
		);
	this.sprite.anchor.set(0.5,1);
	this.sprite.id = raw.sprite_id;
	this.sprite.id_triggered = raw.sprite_id_triggered;

	/* Other */
	this.permanent = raw.permanent;
	this.duration = raw.duration;
	this.targets = raw.targets;

};

Trigger.getTrigger = function(x,y) {

	for(var i = 0; i < game.map.layers.triggers.list.length; i++) {

		var trigger = game.map.layers.triggers.list[i];

		if (trigger.coord.x == x && trigger.coord.y == y) {
			return trigger;
		}

	}

};


// Prototypes


Trigger.prototype.trigger = function() {

	if (this.triggered) {
		return;
	}

	this.triggered = true;
	this.sprite.loadTexture('tile-'+this.sprite.id_triggered);

	this.targets.forEach(function(target) {

		if (target.type == "door") {

			var door = Door.getDoorById(target.id);

			if (door != undefined) {
				door.open(); // If it's a big door, it may not open
			}

		} else if (target.type == "boost") {

			var boost = Boost.getBoostById(target.id);

			if (boost != undefined) {
				boost.activate();
			}
		}

	});

};

Trigger.prototype.untrigger = function() {

	if (this.permanent || !this.triggered) {
		return;
	}

	var timer = game.time.create(false);

	timer.add(this.duration, function() {

		this.triggered = false;
		this.sprite.loadTexture('tile-'+this.sprite.id);

		this.targets.forEach(function(target) {

			if (target.type == "door") {

				var door = Door.getDoorById(target.id);

				if (door != undefined) {
					door.close();
				}

			} else if (target.type == "boost") {

				var boost = Boost.getBoostById(target.id);

				if (boost != undefined) {
					boost.deactivate();
				}
			}

		});

	}.bind(this));

	timer.start();

};