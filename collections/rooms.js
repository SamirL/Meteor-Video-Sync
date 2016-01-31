Rooms = new Mongo.Collection('rooms');

Rooms.allow({
	insert: function(){
		return true;
	},
	update: function() {
		return true;
	}
});