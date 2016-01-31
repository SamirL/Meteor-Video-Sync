Template.homepage.events({
	
	'submit form': function(e) {
		e.preventDefault();
		var name = $(e.target).find('[name=room_name]').val();
		var video = $(e.target).find('[name=video_link]').val();
		var newVideo;
		if(video.length > 0)
		{
			video = video.replace('https', 'http');
			newVideo = video.replace('/watch?v=', '/embed/');
		}else {
			newVideo = "http://www.youtube.com/embed/zHIVeWhCMU8";
		}
		
		var newRoom = {

			room_name : name + '_' + Math.floor(Math.random() * 10000),
			video_link: newVideo,
			has_changed: false
		}

		// alert(newVideo)
		Rooms.insert(newRoom);
	}

})