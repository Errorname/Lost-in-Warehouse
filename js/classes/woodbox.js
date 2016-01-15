
var WoodBox = function(x,y) {

	/* Coords */
	this.coord = {x: x, y: y};

	/* Sprite */
	this.sprite = game.add.isoSprite(
			x*game.tile.width,
			y*game.tile.height,
			0,
			'tile-'+WoodBox.data.sprite_id,
			0,
			game.iso_layers['main']
		);
	this.sprite.anchor.set(0.5,1);

	this.isMoving = false;
};

WoodBox.data = {
	sprite_id: 12
};

WoodBox.getWoodBox = function (x,y) {

	for (var i = 0; i < game.map.layers.woodboxes.list.length; i++) {

		var woodbox = game.map.layers.woodboxes.list[i];

		if (woodbox.coord.x == x && woodbox.coord.y == y) {
			return woodbox;
		}

	}

};

WoodBox.create = function() {

	var woodboxes = game.map.layers['woodboxes'];

	woodboxes.list = [];

	woodboxes.coords.forEach(function(coord) {

		var woodbox = new WoodBox(coord.x,coord.y,woodboxes.sprite_id);

		woodboxes.list.push(woodbox);

	});

};

WoodBox.tick = function() {

	// If a woodbox was blocked during a slide on a boost,
	// we need to make him try again to see if he can slide now

	game.map.layers.boosts.list.forEach(function(boost) {

		var direction = (boost.active ? boost.direction_activated : boost.direction);
		if (direction != -1) {
			var woodbox = WoodBox.getWoodBox(boost.coord.x,boost.coord.y);
			if (woodbox != undefined && !woodbox.isMoving) {
				if (woodbox.canMove(direction)) {
					if (woodbox.isNextToPlayer(direction)) {
						if (game.player.canMove(direction)) {
							woodbox.move(direction,200);
							game.player.walk(direction);
						}
					} else {
						woodbox.move(direction,100);
					}
				}
			}
		}

	});

};


// PROTOTYPES


WoodBox.prototype.canMove = function(direction) {

	var coord = Player.directionToCoord(direction);
	coord.x += this.coord.x;
	coord.y += this.coord.y;

	// If outside the map
	if (coord.x < 0 || coord.y < 0 ||
		coord.x > game.map.width-1 ||
		coord.y > game.map.height-1)
	{
		return false;
	}

	// If there is no floor
	var floor_tile = game.map.layers.floor.tiles[coord.x]

	if (floor_tile == undefined || floor_tile[coord.y] == undefined) {
		return false;
	}

	// If there is a wall
	var wall = game.map.layers.walls.tiles[coord.x];

	if (wall != undefined && wall[coord.y] != undefined) {
		return false;
	}

	// If there is a closed door
	var door = Door.getDoor(coord.x,coord.y);

	if (door != undefined && !door.opened) {
		return false;
	}

	// If there is an enemy
	var enemy = Enemy.getEnemy(coord.x,coord.y);

	if (enemy != undefined) {
		return false;
	}

	var woodbox = WoodBox.getWoodBox(coord.x,coord.y);

	if (woodbox != undefined) {
		return false;
	}

	return true;

};

WoodBox.prototype.move = function(direction, duration) {

	this.isMoving = true;
	this.untrigger();

	// Make the coord change
	var coord = Player.directionToCoord(direction);
	this.coord.x += coord.x;
	this.coord.y += coord.y;

	this.moveAnimation(duration);

};

WoodBox.prototype.moveAnimation = function(duration) {

	var tween = game.add.tween(this.sprite).to({isoX: this.coord.x * game.tile.width, isoY: this.coord.y * game.tile.height}, duration, Phaser.Easing.Linear.None, true, 0, 0, false);

	tween.onComplete.add(function() {
		this.isMoving = false;
		this.trigger();
	},this);

	game.time.events.add(duration/2, function() {
		Enemy.drawLasers();
	},this);

};

WoodBox.prototype.trigger = function() {

	var trigger = Trigger.getTrigger(this.coord.x, this.coord.y);

	if (trigger != undefined) {
		trigger.trigger();
	}

};

WoodBox.prototype.untrigger = function() {

	var trigger = Trigger.getTrigger(this.coord.x, this.coord.y);

	if (trigger != undefined) {
		trigger.untrigger();
	}

};

WoodBox.prototype.isNextToPlayer = function(direction) {
	var coord = Player.directionToCoord(direction);
	coord.x += this.coord.x;
	coord.y += this.coord.y;

	return (game.player.coord.x == coord.x && game.player.coord.y == coord.y);
};