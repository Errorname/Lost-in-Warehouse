

var Misc = function() {};

Misc.canMove = function (key) {

	if (key == undefined) {
		key = this.lastDirectionDown();

		// No key currently down
		if (key == -1)
			return false;
	}
	
	var coord = Player.directionToCoord(key);

	coord.x += this.coord.x;
	coord.y += this.coord.y;

	if (coord.x < 0) {
		return false;
	} else if (coord.x > game.map.width-1) {
		return false;
	}

	if (coord.y < 0) {
		return false;
	} else if (coord.y > game.map.height-1) {
		return false;
	}

	// If there is no floor
	var floor_tile = game.map.layers.floor.tiles[coord.x];

	if (floor_tile == undefined || floor_tile[coord.y] == undefined) {
		return false;
	}

	// If there is a wall
	var wall_tile = game.map.layers.walls.tiles[coord.x];

	if (wall_tile != undefined && wall_tile[coord.y] != undefined) {
		return false;
	}

	// If there is an action tile of type obstacle
	var action_tile = game.map.layers.action_tiles.tiles[coord.x];

	if (action_tile != undefined && action_tile[coord.y] != undefined) {
		action_tile = action_tile[coord.y];

		if (action_tile.type == "obstacle" && !action_tile.active) {
			return false;
		}
	}

	// If there is a wood box
	var woodbox = game.map.layers.woodboxes.tiles[coord.x];

	if (woodbox != undefined && woodbox[coord.y] != undefined) {
		
		return this.type == "woodbox" ? false : woodbox[coord.y].canMove(key);
	}

	return true;
};