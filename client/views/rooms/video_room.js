var intervalId;

Template.videoroom.helpers({
  'youtubeResults': function() {
    return Session.get('youtubeResults');
  }
});

Template.videoroom.events({
  'click .select_video': function(e) {
    var videoId = Session.get('sVideoId');
    var target_id = $(e.target).closest('.contain').find('.select_video').attr('id');
    // console.log(target_id)
    var video_link = "http://www.youtube.com/embed/" + target_id;


    Rooms.update(videoId, {
      $set: {
        video_link: video_link,
        status: 'playing',
        time: '0.0',
        has_changed: true
      }
    });

    Session.set('youtubeResults', []);
    $('.list-group').css('overflow', 'hidden');


  },
  'keyup .search_bar, focus .search_bar': function(e) {
      e.preventDefault();
      var mySearch = $(e.target).val();


      console.log(mySearch);

      if (mySearch.length > 1) {
        $('.list-group').css('overflow', 'scroll');
        Meteor.call('youtubeSearch', mySearch, function(error, result) {
          if (result) {
            Session.set('youtubeResults', result.items);
            // Session.set('isSearch', 'true')
          }
        });
      }


    }
    // 'blur .search_bar' : function(e) {
    // 	// $('.list-group').css('overflow','hidden');
    // 	// Session.set('youtubeResults', []);

  // }
})

Template.videoroom.rendered = function() {

  if (!this.rendered) {

    this.rendered = true;
  }

  if (this.rendered === true) {

    if (this.data) {


      var videoId = this.data._id;
      var started = false;
      var player;
      var time;

      // $('.playerYT').append('<iframe id="ytvideo" width="300" height="200" src="'+ this.data.video_link +'?enablejsapi=1&autoplay=1" frameborder="0" allowfullscreen></iframe>');

      function onYouTubeIframeAPIReady() {
        player = new YT.Player('ytvideo', {
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
        // started = true;
      }

      function onPlayerReady(event) {
        var video = Rooms.findOne(videoId);
        if (video.status === 'playing') {
          event.target.seekTo(video.time, true);
          event.target.playVideo();

        } else if (video.status === 'paused') {
          event.target.seekTo(video.time, true);
          event.target.pauseVideo();

        }

        player.loadVideoByUrl(video.video_link, video.time);

        fautoRun();
        interval();

      }

      function onPlayerStateChange(event) {
        var video = Rooms.findOne(videoId);
        var time = event.target.getCurrentTime();

        if (event.data === 2) {
          Rooms.update(videoId, {
            $set: {
              status: 'paused',
              time: time
            }
          });
          console.log('pause')

        } else if (event.data === 1) {
          Rooms.update(videoId, {
            $set: {
              status: 'playing',
              time: time
            }
          });
          console.log('play')

        }


      }
      (function() {
        setTimeout(onYouTubeIframeAPIReady(), 2000)

      }());

      interval = function() {
          intervalId = Meteor.setInterval(function() {
            time = player.getCurrentTime();
            video = Rooms.findOne(videoId);
            Rooms.update(videoId, {
              $set: {
                time: time
              }
            });
          }, 1000);

        }
        // var videoTest = Rooms.findOne(videoId);
        // var videoTestDep = new Deps.Dependency;
        // var getVideo = function(){
        // 	videoTestDep.depend();
        // 	return videoTest;
        // };

      // var setVideo = function(){
      // 	videoTestDep.changed();
      // };
      fautoRun = function() {
        Tracker.autorun(function() {
          var video = Rooms.findOne(videoId);
          console.log("The video status is ", video.status);
          // console.log(-(time - video.time));
          if (video.status === 'playing') {

            if (time - video.time > 3 || time - video.time < -3) {
              player.seekTo(video.time, true);
            }
            player.playVideo();


          } else if (video.status === 'paused') {
            if (time - video.time > 3 || time - video.time < -3) {
              player.seekTo(video.time, true);
            }
            player.pauseVideo();


          }

          if (video.has_changed === true) {
            console.log('video loaded')
            Rooms.update(videoId, {
              $set: {
                has_changed: false
              }
            });
            player.loadVideoByUrl(video.video_link);

          }

        });

      }
    }


  }

};

Template.videoroom.destroyed = function() {
  Meteor.clearInterval(intervalId);
};
