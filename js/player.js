
var Player = function(x,y) {

	/* Coord */
	this.coord = {x: x, y: y};

	/* Sprite */
	this.sprite = game.add.isoSprite(
			x*Tile.width,
			y*Tile.height,
			0,
			'robot',
			0,
			game.iso_layers['main']
		);
	this.sprite.anchor.set(0.5,1.0);

	/* Other */
	this.keys_down = [0,0,0,0,0]; // 4 direction + (maybe) 1 action key
	this.isMoving = false;

};

Player.preload = function() {

	/* Load spritesheet */
	game.load.spritesheet('robot','assets/sprites/robot.png',120,105,4);

};

Player.create = function() {

	/* Create the player object */
	game.player = new Player(game.map.player_coord.x,game.map.player_coord.y);

	/* Make Phaser capture the keys */
	game.input.keyboard.addKeyCapture([
		Phaser.Keyboard.LEFT,
		Phaser.Keyboard.RIGHT,
		Phaser.Keyboard.UP,
		Phaser.Keyboard.DOWN,
		Phaser.Keyboard.SPACEBAR
	]);

	/* Add callbacks for key up and down */
	game.input.keyboard.onDownCallback = function(event) {
		game.player.registerKeyDown(event.keyCode);
	};

	game.input.keyboard.onUpCallback = function(event) {
		game.player.registerKeyUp(event.keyCode);
	};

	/* Make the camera follow the player */
	game.camera.follow(game.player.sprite);

	game.camera.deadzone = new Phaser.Rectangle(412, 300, 200, 100);

};

Player.update = function() {

};

Player.render = function() {

	if (game._debug) 
		game.debug.text(game.player.coord.x+":"+game.player.coord.y,2,28,"#a7aebe");
	
};

// functions

Player.directionToCoord = function(direction) {

	var x = direction == 1 ? -1 : ( direction == 3 ? 1 : 0 );
	var y = direction == 2 ? -1 : ( direction == 0 ? 1 : 0 );

	return {x: x, y: y};

};


// Prototypes


Player.prototype.registerKeyDown = function(keyCode) {

	// id direction key
	if (keyCode >= 37 && keyCode <= 40) {
		
		// Older direction are set to 1
		for (var i = 0; i < 4; i++) {
			if (this.keys_down[i] == 2) {
				this.keys_down[i] = 1;
			}

			// The last direction down is set to 2
			this.keys_down[keyCode-37] = 2; // -37 because directions start at 37
		}

		/* If player isn't moving, make him move */
		if (!game.player.isMoving) {
			game.player.move();
		}

	}
	// if ctrl key (maybe it will be useful later)
	else if (keyCode == 17) {
		this.keys_down[4] = 1;
	}

};

Player.prototype.registerKeyUp = function(keyCode) {

	// if direction key
	if (keyCode >= 37 && keyCode <= 40) {
		this.keys_down[keyCode-37] = 0;
	}
	// if ctrl key
	else if (keyCode == 17) {
		this.keys_down[4] = 0;
	}

};

Player.prototype.lastDirectionDown = function() {

	// Get last key down
	for (var i = 0; i < 4; i++) {
		if (this.keys_down[i] == 2) {
			return i;
		}
	}

	// If we don't know, take the first one currently down
	for (var i = 0; i < 4; i++) {
		if (this.keys_down[i] == 1) {
			return i;
		}
	}

	// If no direction down, return -1
	return -1;

};

Player.prototype.move = function() {


	// Is the player on boost and can slide
	if (this.isOnBoost() && this.canSlide()) {
		
		this.slide();
		return

	}

	var lastDirection = this.lastDirectionDown();

	// Change the sprite orientation
	this.sprite.frame = lastDirection;

	if (this.canMove()) {

		this.isMoving = true;
		this.untrigger();

		// Make the coord change
		var coord = Player.directionToCoord(lastDirection);
		this.coord.x += coord.x;
		this.coord.y += coord.y;

		// If there is a woodbox, move it
		var woodbox = WoodBox.getWoodBox(this.coord.x,this.coord.y);
		if (woodbox != undefined) {
			
			woodbox.move(lastDirection);
			this.moveAnimation(400);

		} else {

			this.moveAnimation(200);

		}

	} else {
		this.isMoving = false;
	}

};

Player.prototype.slide = function() {

	this.isMoving = true;
	this.untrigger();

	var boost = Boost.getBoost(this.coord.x,this.coord.y);
	var direction = boost.active ? boost.direction_activated : boost.direction;
	
	if (this.canMove(direction)) {
		var coord = Player.directionToCoord(direction);
		this.coord.x += coord.x;
		this.coord.y += coord.y;

		// If there is a woodbox, move it
		var woodbox = WoodBox.getWoodBox(this.coord.x,this.coord.y);
		if (woodbox != undefined) {
			
			woodbox.move(direction);
			this.moveAnimation(400);

		} else {

			this.moveAnimation(100);

		}
	} else {
		this.isMoving = false;
	}

};

Player.prototype.isOnBoost = function() {

	var boost = Boost.getBoost(this.coord.x,this.coord.y);

	if (boost == undefined) {
		return false;
	}

	var direction = boost.active ? boost.direction_activated : boost.direction;
	
	return direction != -1;

};

Player.prototype.canSlide = function() {
	var boost = Boost.getBoost(this.coord.x,this.coord.y);

	if (boost == undefined) {
		return false;
	}

	var direction = boost.active ? boost.direction_activated : boost.direction;

	if (direction == -1) {
		return false;
	}

	return this.canMove(direction);
}

Player.prototype.canMove = function(key) {

	if (key == undefined)
		key = this.lastDirectionDown();

	// If no direction down
	if (key == -1)
		return false;

	var coord = Player.directionToCoord(key);
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
	var floor_tile = game.map.layers.floor.tiles[coord.x];

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

	// If there is a wood box
	var woodbox = WoodBox.getWoodBox(coord.x,coord.y);

	if (woodbox != undefined) {
		return woodbox.canMove(key);
	}

	return true;

};

Player.prototype.moveAnimation = function(duration) {

	var tween = game.add.tween(this.sprite).to({isoX: this.coord.x * Tile.width, isoY: this.coord.y * Tile.height}, duration, Phaser.Easing.Linear.None, true, 0, 0, false);

	tween.onComplete.add(function() {
		this.trigger();
		this.move();
	},this);

};

Player.prototype.trigger = function() {

	var trigger = Trigger.getTrigger(this.coord.x,this.coord.y);

	if (trigger != undefined) {
		trigger.trigger();
	}

};

Player.prototype.untrigger = function() {

	var trigger = Trigger.getTrigger(this.coord.x,this.coord.y);

	if (trigger != undefined) {
		trigger.untrigger();
	}

}