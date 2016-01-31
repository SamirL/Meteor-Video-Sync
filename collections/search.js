Meteor.methods({

	youtubeSearch: function(search) {

		var apiKey = ""
		var mySearch = "https://www.googleapis.com/youtube/v3/search?part=id,snippet&videoEmbeddable=true&maxResults=50&q="+encodeURIComponent(search)+"&type=video&key="+apiKey;

		try{
			var result = Meteor.http.get(mySearch).data;
			return result;
		}catch(e){
			// throw new Meteor.Error(400, 'An error has occured');
		}

	}

});
