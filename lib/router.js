Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
});

Router.map(function() {
  this.route('homepage', {
  	path: '/',
  	waitOn: function(){
  		return Meteor.subscribe('rooms');
  	},
  	data: function(){
  		return Rooms.find();
  	}
  });
  this.route('videoroom', {
  	path: '/video/:_id',
  	waitOn: function(){
  		return [
        Meteor.subscribe('rooms', this.params._id),
        Session.set('sVideoId', this.params._id)
        ]
    },
  	data: function(){
  		return Rooms.findOne(this.params._id);
  	}
  })
});

Router.onBeforeAction('loading');