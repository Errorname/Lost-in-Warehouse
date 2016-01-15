
game.progress = {
	available_levels: 1,
	unlockLevel: function(level) {
		if (level > this.available_levels && level <= game.nb_levels) {
			this.available_levels = level;
			this.saveProgress();
		}
	},
	saveProgress: function() {
		this.setCookie('progress',this.available_levels,365);
	},
	loadProgress: function() {
		this.available_levels = this.getCookie('progress');
	},
	setCookie: function(cname, cvalue, exdays) {
	    var d = new Date();
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    var expires = "expires="+d.toUTCString();
	    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
	},
	getCookie: function(cname) {
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1);
	        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	    }
	    return 1;
	},

	items: [
		"A gorgeous Keyboard-Rose",
		"An Illuminati Tears brick",
		"A timeless Octopus Sandglass",
		"The Secrets of the Universe",
		"A Rainbow Cake Mushroom",
		"A Unicorn-Tomatoe",
		"Some NightSky in Bottle",
		"A cubic-shaped Watermelon"
	],
	owned_items: [],
	randomItem: function() {
		var id_item = Math.floor(Math.random()*this.items.length);
		if (this.owned_items.indexOf(id_item) == -1) {
			this.owned_items.push(id_item);
			this.saveItems();
		}
		return id_item;
	},
	itemText: function(id_item) {
		return this.items[id_item];
	},
	saveItems: function() {
		this.setCookie('items',this.owned_items.join(),365);
	},
	loadItems: function() {
		var text = this.getCookie('items');
		if (text != 1) {
			this.owned_items = text.split(',');
			for(var i = 0; i < this.owned_items.length; i++) {
				this.owned_items[i] = parseInt(this.owned_items[i]);
			}
		}
	}
}