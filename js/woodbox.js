
var WoodBox = function(x,y,sprite_id) {

	/* Coords */
	this.coord = {x: x, y: y};

	/* Sprite */
	this.sprite = game.add.isoSprite(
			x*Tile.width,
			y*Tile.height,
			0,
			'tile-'+sprite_id,
			0,
			game.iso_layers['main']
		);
	this.sprite.anchor.set(0.5,1);
	this.sprite.id = sprite_id;

};

WoodBox.getWoodBox = function (x,y) {

	for (var i = 0; i < game.map.layers.woodboxes.list.length; i++) {

		var woodbox = game.map.layers.woodboxes.list[i];

		if (woodbox.coord.x == x && woodbox.coord.y == y) {
			return woodbox;
		}

	}

};


// Prototypes


WoodBox.prototype.move = function(direction) {

	this.untrigger();

	// Make the coord change
	var coord = Player.directionToCoord(direction);
	this.coord.x += coord.x;
	this.coord.y += coord.y;

	this.moveAnimation(400, function() {

		this.trigger();

		if (this.isOnBoost()) {
			this.slide();
		}

	});

};

WoodBox.prototype.slide = function() {

	this.untrigger();
	
	var boost = Boost.getBoost(this.coord.x,this.coord.y);

	var coord = Player.directionToCoord(boost.active ? boost.direction_activated : boost.direction);
	this.coord.x += coord.x;
	this.coord.y += coord.y;

	this.moveAnimation(100, function() {

		this.trigger();

		if (this.isOnBoost()) {
			this.slide();
		}

	});

};

WoodBox.prototype.isOnBoost = function() {

	var boost = Boost.getBoost(this.coord.x, this.coord.y);

	if (boost == undefined) {
		return false;
	}

	var direction = boost.active ? boost.direction_activated : boost.direction;

	return direction != -1;

};

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

	var woodbox = WoodBox.getWoodBox(coord.x,coord.y);

	if (woodbox != undefined) {
		return false;
	}

	return true;

};

WoodBox.prototype.moveAnimation = function(duration,endCallback) {

	var tween = game.add.tween(this.sprite).to({isoX: this.coord.x * Tile.width, isoY: this.coord.y * Tile.height}, duration, Phaser.Easing.Linear.None, true, 0, 0, false);

	tween.onComplete.add(endCallback,this);

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