
var Trigger = function(raw) {

	this.triggered = false;

	/* Coords */
	this.coord = {x: raw.coord.x, y: raw.coord.y};

	/* Sprite */
	this.sprite = game.add.isoSprite(
			raw.coord.x*game.tile.width,
			raw.coord.y*game.tile.height,
			0,
			'tile-'+(raw.permanent ? Trigger.data.sprite_id_permanent : Trigger.data.sprite_id),
			0,
			game.iso_layers['floor']
		);
	this.sprite.anchor.set(0.5,1);

	/* Misc */
	this.permanent = raw.permanent;
	this.targets = raw.targets;

};

Trigger.data = {
	sprite_id: 15,
	sprite_id_permanent: 14,
	sprite_id_triggered: 16,
	duration: 200
};

Trigger.getTrigger = function(x,y) {

	for(var i = 0; i < game.map.layers.triggers.list.length; i++) {

		var trigger = game.map.layers.triggers.list[i];

		if (trigger.coord.x == x && trigger.coord.y == y) {
			return trigger;
		}

	}

};

Trigger.create = function() {
	var triggers = game.map.layers['triggers'];

	triggers.list = [];

	triggers.list_raw.forEach(function(trigger_raw) {

		var trigger = new Trigger(trigger_raw);

		triggers.list.push(trigger);

	});
};


// PROTOTYPES


Trigger.prototype.trigger = function() {

	if (this.triggered) {
		return;
	}

	this.triggered = true;
	this.sprite.loadTexture('tile-'+Trigger.data.sprite_id_triggered);

	game.jukebox.sound('click');

	this.targets.forEach(function(target) {

		if (target.type == "door") {

			var door = Door.getDoorById(target.id);

			if (door != undefined) {
				door.open();
			}

		} else if (target.type == "boost") {

			var boost = Boost.getBoostById(target.id);

			if (boost != undefined) {
				boost.activate();
			}

		} else if (target.type == "portal") {

			var portal = Portal.getPortalById(target.id);

			if (portal != undefined) {
				portal.activate();
			}

		}

	});

	Enemy.drawLasers();

};

Trigger.prototype.untrigger = function() {

	if (this.permanent || !this.triggered) {
		return;
	}

	var timer = game.time.create(false);

	timer.add(Trigger.data.duration, function() {

		this.triggered = false;
		this.sprite.loadTexture('tile-'+(this.permanent ? Trigger.data.sprite_id_permanent : Trigger.data.sprite_id));

		game.jukebox.sound('clack');

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

			} else if (target.type == "portal") {

				var portal = Portal.getPortalById(target.id);

				if (portal != undefined) {
					portal.deactivate();
				}

			}

		});

		Enemy.drawLasers();

	}.bind(this));

	timer.start();

};