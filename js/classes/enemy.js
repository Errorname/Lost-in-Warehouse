
var Enemy = function (x,y,frame) {

	/* Coords */
	this.coord = {x: x, y: y};

	/* Sprite */
	this.sprite = game.add.isoSprite(
			x*game.tile.width,
			y*game.tile.height,
			0,
			'enemy',
			0,
			game.iso_layers['main']
		);
	this.sprite.anchor.set(0.5,1.0);
	this.sprite.frame = frame;

	/* Misc */
	this.direction = frame;

};

Enemy.getEnemy = function(x, y) {

	for(var i = 0; i < game.map.layers.enemies.list.length; i++) {
		var enemy = game.map.layers.enemies.list[i];

		if (enemy.coord.x == x && enemy.coord.y == y) {
			return enemy;
		}
	}

};

Enemy.create = function() {

	var enemies = game.map.layers['enemies'];

	enemies.list = [];

	enemies.list_raw.forEach(function(enemy_raw) {

		var enemy = new Enemy(enemy_raw.coord.x,enemy_raw.coord.y,enemy_raw.direction);

		enemies.list.push(enemy);

	});

	Enemy.drawLasers();

};

Enemy.drawLasers = function() {

	Laser.dumpLasers();

	var enemies = game.map.layers.enemies.list.forEach(function(enemy) {
		enemy.drawLasers();
	});
}


// PROTOTYPES


Enemy.prototype.drawLasers = function() {

	var vector = Player.directionToCoord(this.direction);

	var coord_laser = {x: this.coord.x, y: this.coord.y};

	while(coord_laser.x >= 0 && coord_laser.y >= 0 && coord_laser.x < game.map.width && coord_laser.y < game.map.height) {
		coord_laser.x += vector.x;
		coord_laser.y += vector.y;

		// If obstacle, stop drawing
		var door = Door.getDoor(coord_laser.x,coord_laser.y);
		var enemy = Enemy.getEnemy(coord_laser.x,coord_laser.y);
		var wall = Wall.getWall(coord_laser.x,coord_laser.y);
		var woodbox = WoodBox.getWoodBox(coord_laser.x,coord_laser.y);

		if ( (door != undefined && !door.opened) ||
			 (enemy != undefined) ||
			 (wall != undefined) ||
			 (woodbox != undefined)
			){
			break;
		}

		var laser = Laser.getLaser(coord_laser.x,coord_laser.y);

		if (laser != undefined) {
			// If already a laser in this direction
			if (laser.sprite.key == 'tile-29' || laser.sprite.key == 'tile-'+(this.direction == 0 || this.direction == 2 ? 27 : 28))
				break;
			laser.sprite.loadTexture('tile-29');
		} else {
			var laser = new Laser(coord_laser.x,coord_laser.y,this.direction);
			game.map.layers.lasers.list.push(laser);
		}
	}
};

/*Door.prototype.open = function() {

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

Door.prototype.close = function() {

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
};*/