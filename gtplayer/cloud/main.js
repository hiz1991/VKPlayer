
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("getUploads", function(request, response) {
  Parse.Cloud.useMasterKey();
  var Uploads = Parse.Object.extend("Uploads")
  var query = new Parse.Query(Uploads);
  query.equalTo("username", Parse.User.current().get("username"))
  query.find({
    success:function(res){
    	var respArray=[]
    	for(var thing in res){
    		respArray.push(JSON.parse(res[thing].get("data")))
    	}
      response.success({"response":respArray})
    },
    error:function(e){response.error(JSON.stringify(e))}
  })
});

Parse.Cloud.define("searchArtist", function(request, response) {
  Parse.Cloud.httpRequest({
      url: 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist='+request.params.artist.replace(" ","+")+'&api_key=70e2ee3030d785ca59d8fbcb17c36e2d&format=json',
      success: function(httpResponse) {
        console.log(httpResponse.text);
        console.log(JSON.parse(httpResponse.text));
        console.log(JSON.parse(httpResponse.text.replace(/(\r\n|\n|\r)/gm,"")));
        var obj = JSON.parse(httpResponse.text);
        console.log(obj.rows);
        response.success(httpResponse.text);
      },
      error: function(httpResponse) {
        console.log('Request failed with response code ' + httpResponse.status);
        // errRespon =  httpResponse.text;
        response.error(httpResponse.text);
      }
    });
})