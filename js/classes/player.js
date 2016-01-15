
var Player = function(x,y,frame) {

	/* Coord */
	this.coord = {x: x, y: y};

	/* Sprite */
	this.sprite = game.add.isoSprite(
			x*game.tile.width,
			y*game.tile.height,
			0,
			'robot',
			0,
			game.iso_layers['main']
		);
	this.sprite.anchor.set(0.5,1.0);
	this.sprite.frame = frame;

	/* Misc */
	this.keys_down = [0,0,0,0];
	this.isMoving = false;
	this.usedPortal = false;
	this.carryPackage = false;
	
};

Player.create = function() {

	var level_json = game.cache.getJSON('level-'+game.id_level);

	/* Create the player object */
	game.player = new Player(level_json.player.x,level_json.player.y,level_json.player.frame);

	/* Make the camera follow the player */
	game.camera.follow(game.player.sprite);

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

	game.onResume.add(function() {
		game.player.refreshKeyUp();
	},this);

};

Player.directionToCoord = function (direction) {

	var x = direction == 1 ? -1 : ( direction == 3 ? 1 : 0 );
	var y = direction == 2 ? -1 : ( direction == 0 ? 1 : 0 );

	return {x: x, y: y};

};


/* PROTOTYPES */


Player.prototype.registerKeyDown = function(keyCode) {
	// if direction key
	if (keyCode >= 37 && keyCode <= 40) {
		// Older direction are set to 1
		for (var i = 0; i < 4; i++) {
			if (this.keys_down[i] == 2) {
				this.keys_down[i] = 1;
			}
		}
		// The last direction down is set to 2
		this.keys_down[keyCode-37] = 2; // -37 because directions start at 37
	}
};

Player.prototype.registerKeyUp = function(keyCode) {
	// if direction key
	if (keyCode >= 37 && keyCode <= 40) {
		this.keys_down[keyCode-37] = 0;
	}
};

Player.prototype.refreshKeyUp = function() {

	for (var i=37; i<=40; i++) {
		if(game.input.keyboard._keys[i] && game.input.keyboard._keys[i].isUp) {
			this.registerKeyUp(i)
		}
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
	// If no direction down, return -1;
	return -1;
};

////////

Player.prototype.tick = function() {

	if (this.isMoving)
		return;

	// Portal
	if (this.isOnPortal() && this.canUsePortal() && !this.usedPortal) {
		this.usedPortal = true;
		this.usePortal();
		return;
	}

	// Boost
	if (this.isOnBoost() && this.canUseBoost()) {
		this.useBoost();
		return;
	}

	this.refreshFrame();

	if (this.canMove()) {

		this.usedPortal = false;
		this.isMoving = true;
		this.untrigger();
		this.walk();

	} else {

		this.isMoving = false;

	}

};

//////////

Player.prototype.isOnExit = function() {

	var floor_tile = game.map.layers['floor'].tiles[this.coord.x][this.coord.y];

	return floor_tile != undefined && floor_tile.sprite.id == game.exit_tile;

};

//////////

Player.prototype.isOnLaser = function() {

	var laser = Laser.getLaser(this.coord.x,this.coord.y);

	return laser != undefined;

};

//////////

Player.prototype.isOnPackage = function() {

	var floor_tile = game.map.layers['floor'].tiles[this.coord.x][this.coord.y];

	return floor_tile != undefined && floor_tile.sprite.id == game.package_tile;

};

Player.prototype.takePackage = function() {

	this.carryPackage = true;

	game.jukebox.sound('box');

	var direction = this.lastDirectionDown();

	game.time.events.add(100, function() {
		this.sprite.frame = direction >= 0 ? direction + 4 : direction;
		var tile = game.map.layers['floor'].tiles[this.coord.x][this.coord.y];
		tile.sprite.loadTexture('tile-'+(game.package_tile-1));
		tile.sprite.id = game.package_tile-1;
	},this);
	
}

//////////

Player.prototype.isOnPortal = function() {

	var portal = Portal.getPortal(this.coord.x,this.coord.y);

	return portal != undefined && portal.active;

};

Player.prototype.canUsePortal = function() {

	var portal = Portal.getPortal(this.coord.x,this.coord.y);
	var portal_dest = Portal.getPortalById(portal.portal_to);

	if (portal_dest != undefined && portal_dest.active) {
		var woodbox = WoodBox.getWoodBox(portal_dest.coord.x,portal_dest.coord.y);
		return woodbox == undefined;
	}

	return false

};

Player.prototype.usePortal = function() {
	var portal_dest = Portal.getPortalById(Portal.getPortal(this.coord.x,this.coord.y).portal_to);

	game.jukebox.sound('tp');

	this.coord.x = portal_dest.coord.x;
	this.coord.y = portal_dest.coord.y;

	this.sprite.isoX = this.coord.x * game.tile.width;
	this.sprite.isoY = this.coord.y * game.tile.height;
};

//////////

Player.prototype.isOnBoost = function() {

	return Boost.getBoost(this.coord.x,this.coord.y) != undefined;

};

Player.prototype.canUseBoost = function() {

	var boost = Boost.getBoost(this.coord.x,this.coord.y);

	var direction = boost.active ? boost.direction_activated : boost.direction;

	if (direction == -1) {
		return false;
	}

	return this.canMove(direction);

};

Player.prototype.useBoost = function() {
	
	this.isMoving = true;

	var boost = Boost.getBoost(this.coord.x,this.coord.y);
	var direction = boost.active ? boost.direction_activated : boost.direction;
	var coord = Player.directionToCoord(direction);
	this.coord.x += coord.x;
	this.coord.y += coord.y;

	// If there is a package, take it
	if (this.isOnPackage()) {
		this.takePackage();
	}

	// If there is a woodbox, move it
	var woodbox = WoodBox.getWoodBox(this.coord.x,this.coord.y);
	if (woodbox != undefined) {
		
		woodbox.move(direction,400);
		this.moveAnimation(400);

	} else {

		this.moveAnimation(100);

	}

};

//////////

Player.prototype.walk = function(direction) {

	if (direction == null)
		direction = this.lastDirectionDown()

	// Make the coord change
	var coord = Player.directionToCoord(direction);
	this.coord.x += coord.x;
	this.coord.y += coord.y;

	this.isMoving = true;

	// If there is a package, take it
	if (this.isOnPackage()) {
		this.takePackage();
	}

	// If there is a woodbox, move it
	var woodbox = WoodBox.getWoodBox(this.coord.x,this.coord.y);
	if (woodbox != undefined) {

		game.jukebox.sound('push');
		
		woodbox.move(direction,400);
		this.moveAnimation(400);

	} else {

		this.moveAnimation(200);

	}
};

Player.prototype.moveAnimation = function(duration) {

	var tween = game.add.tween(this.sprite).to({isoX: this.coord.x*game.tile.width, isoY: this.coord.y*game.tile.height}, duration, Phaser.Easing.Linear.None, true, 0, 0, false);

	tween.onComplete.add(function() {

		if (this.isOnExit() && this.carryPackage) {
			this.win();
			return;
		} else if (this.isOnLaser()) {
			this.lose();
			return;
		}

		this.isMoving = false;
		this.trigger();
		
	},this);

	game.time.events.add(duration/2, function() {
		Enemy.drawLasers();
	},this);

};

//////////

Player.prototype.canMove = function(direction) {

	var key = (direction != undefined ? direction : this.lastDirectionDown());

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

	// If there is an enemy
	var enemy = Enemy.getEnemy(coord.x,coord.y);

	if (enemy != undefined) {
		return false;
	}

	// If there is a wood box
	var woodbox = WoodBox.getWoodBox(coord.x,coord.y);

	if (woodbox != undefined) {
		return woodbox.canMove(key);
	}

	return true;

}

//////////

Player.prototype.refreshFrame = function() {

	// Change the sprite orientation
	var lastDirection = this.lastDirectionDown();
	this.sprite.frame = lastDirection >= 0 ? lastDirection+(this.carryPackage ? 4 : 0) : lastDirection;

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

};

//////////

Player.prototype.lose = function() {

	game.jukebox.sound('lose');

	game.time.events.add(1500, function() {
		Enemy.drawLasers();
		game.restart();
	},this);

};

Player.prototype.win = function() {
	game.jukebox.sound('win');
	game.endLevel();
};