function SPlogin(callback) {
    var CLIENT_ID = '7b3974949bf84ea7bb249665c3eb9d9f';
    // var REDIRECT_URI = 'http://jmperezperez.com/spotify-oauth-jsfiddle-proxy/';
    var REDIRECT_URI = 'http://www.gtplayer.ru/spCallback.html';
    function getLoginURL(scopes) {
        return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
          '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
          '&scope=' + encodeURIComponent(scopes.join(' ')) +
          '&response_type=token';
    }
    
    var url = getLoginURL([
        'user-read-email', 
        "user-library-read"
    ]);
    
    var width = 450,
        height = 730,
        left = (screen.width / 2) - (width / 2),
        top = (screen.height / 2) - (height / 2);

    window.addEventListener("message", function(event) {
        var hash = JSON.parse(event.data);
        if (hash.type == 'access_token') {
            callback(hash.access_token);
        }
    }, false);
    
    var w = window.open(url,
                        'Spotify',
                        'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
                       );
    
}

function SPgetUserData(accessToken) {
    return $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
           'Authorization': 'Bearer ' + accessToken
        }
    });
}
function SPgetAllTracks(accessToken){
    return $.ajax({
        url: 'https://api.spotify.com/v1/me/tracks?limit=50',
        headers: {
           'Authorization': 'Bearer ' + accessToken
        }
    });
}

function SPChangeButton(itemID, spanText, onclick){
    $("#"+itemID+" span").text(spanText)
    $("#"+itemID).click(onclick)
}

function SPlogout(){
    Parse.User.current().set("SPToken",null).save()
    $('#spLoginButton').show()
    $('#spLogOutButton').hide()
}

function SPLoginInit(){
    SPlogin(function(accessToken) {
        Parse.User.current().set("SPToken",accessToken).save()
        $('#spLoginButton').hide()
        $('#spLogOutButton').show()
    });
}    

//###########################################################################

function SPSearchTrack(accessToken, title, artistTested, callback){
    var result=null
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data:{q:title, type:"track", limit:50},
        headers: {
           'Authorization': 'Bearer ' + accessToken
        }
    }).success(function(res){
        console.log(res)
        var tracks  = res.tracks.items
        artistFound = false
        for(el in tracks){
            var foundAllArtist=true
            var currentArtists = tracks[el].artists
            for(artist in currentArtists){
                // console.log(artistTested,currentArtists[artist].name )
                if(artistTested.toUpperCase().indexOf(currentArtists[artist].name.toUpperCase())==-1) foundAllArtist = false
            }
            if(foundAllArtist) {
                result =  tracks[el]
                break
            }
        }
        console.log("success",result)
        if(result==null) {
            result={}
            result.id = null
        }
        callback( result )

    }).fail(function(res) {
       console.log("fail",res)
       result.id = null
       callback( result )
    }).error(function(res) {
       console.log("fail",res)
       result.id = null
       callback( result )
    })
}

function getSPIDForItem(VKMusicItem, i){
    setTimeout(function(){
        SPSearchTrack(SPToken, VKMusicItem.title,VKMusicItem.artist, function(res){
            console.log(res)
            VKMusicItem.spotifyID = res.id
            // return VKMusicItem
            // return VKMusicItem
        })
    }, i*500)
    // console.log(new Date())
}

function getSPIdsForAll(VKMusic){
    var percent = 0
    var items = VKMusic.response.length
    for(var i=0;i<items;i++){
        getSPIDForItem(VKMusic.response[i],i)
    }

}

function saveAllSPIDs(VKMusic){

    arr=[]
    for(var i in VKMusic.response){
        // if(VKMusic.response[i].spotifyID!=null
        arr.push({VKID:VKMusic.response[i].aid, SPID:VKMusic.response[i].spotifyID})
    }
    Parse.User.current().set("SPVKIdsMatches", arr).save()
}

function getFeaturesForAll(accessToken, dictArray){
    var arr=[]
    for(i in dictArray) if(dictArray[i].spotifyID!=null) arr.push(dictArray[i])
    reqStr = ""
    for(i in arr){
        reqStr=reqStr+arr[i].spotifyID+","
    }
    $.ajax({
        url: 'https://api.spotify.com/v1/audio-features',
        data:{ids:reqStr},
        headers: {
           'Authorization': 'Bearer ' + accessToken
        }
    }).success(function(res){
        // console.log(res)
        // var tracks  = res.tracks.items
        // artistFound = false
        // for(el in tracks){
        //     var foundAllArtist=true
        //     var currentArtists = tracks[el].artists
        //     for(artist in currentArtists){
        //         // console.log(artistTested,currentArtists[artist].name )
        //         if(artistTested.toUpperCase().indexOf(currentArtists[artist].name.toUpperCase())==-1) foundAllArtist = false
        //     }
        //     if(foundAllArtist) {
        //         result =  tracks[el]
        //         break
        //     }
        // }
        console.log("success",res)
        // if(result==null) {
        //     result={}
        //     result.id = null
        // }
        // callback( result )
        for(i in arr){
            dictArray[i].af = res.audio_features[i]
        }

    }).fail(function(res) {
       console.log("fail",res)
       // result.id = null
       // callback( result )
    }).error(function(res) {
       console.log("fail",res)
       // result.id = null
       // callback( result )
    })
}
//###########################################################################