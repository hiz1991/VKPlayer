getUniqueArray = function(arr){
   var u = {}, a = [];
   for(var i = 0, l = arr.length; i < l; ++i){
      if(u.hasOwnProperty(arr[i])) {
         continue;
      }
      a.push(arr[i]);
      u[arr[i]] = 1;
   }
   return a;
}
function checkTime(date, hours){
  if(!date) date = new Date()
  var opens = hours[date.getDay()].open;
  var closes = hours[date.getDay()].close;
  var yesterdayClose=hours[((date.getDay()>0)?date.getDay()-1:6)].close;
  var yesCloseDate = new Date(null, null, null, yesterdayClose.substr(0,2), yesterdayClose.substr(3,5));      
  var openDate = new Date(null, null, null, opens.substr(0,2), opens.substr(3,5));
  var closeDate = new Date(null, null, null, closes.substr(0,2), closes.substr(3,5));
  var currentDate = new Date(null, null, null, date.getHours(), date.getMinutes());
  var nowOpen =( (currentDate>=openDate && currentDate.getHours()<=23) || currentDate<yesCloseDate && (currentDate.getHours()<6 && yesCloseDate.getHours()<6)) ;
  if(nowOpen){
    if(currentDate.getHours()<=23&&currentDate.getHours()>6) return [true,closeDate.toLocaleTimeString()]
    else return [true,yesCloseDate.toLocaleTimeString()]
  }else{
    var tomorrOpen = hours[((date.getDay()<6)?date.getDay()+1:0)].open;
    tomorrOpen = new Date(null, null, null, tomorrOpen.substr(0,2), tomorrOpen.substr(3,5));
    if(currentDate.getHours()<=23&&currentDate.getHours()>yesCloseDate.getHours()) return [false, openDate.toLocaleTimeString()]
    else return [false,tomorrOpen.toLocaleTimeString()]
  }
}
function checkDistPC(postcode, thresh, toBeAnimatedJQDiv, classAdd){
      toBeAnimatedJQDiv.addClass(classAdd);
      Parse.Cloud.run('checkDistance', {destinationPC:postcode.replace(" ","")}, {
        success: function (result) {
                 toBeAnimatedJQDiv.removeClass(classAdd);
                 result = JSON.parse(result)
                 if(result.status == "INVALID_REQUEST" || result.rows[0].elements[0].status=="ZERO_RESULTS" || result.rows[0].elements[0].status=="NOT_FOUND"){
                  swal("Error!", "The postcode is not found", "error");
                    return;
                 }
                 var distance = result.rows[0].elements[0].distance.value*0.000621371192;
                 console.log(distance)
                 if(distance>thresh){
                    swal("Error!", "We don't deliver beyond 3 miles from NE37 2SY", "error");
                    return;
                  }else{
                    swal("Success", "We deliver to your postcode", "success");
                  }

        }, 
        error:function(res){toBeAnimatedJQDiv.removeClass(classAdd);}})
}

function searchForPropertyInObjectArray(objArray, term, value) {
  var result = base.Offers.filter(function( obj ) {
    return obj[term] == value;
  });
  return result
}

function isArray(prop){
  if(!prop) return false
  return prop.constructor === Array
}
function findAndRemove(array, property, value) {
    array.forEach(function(result, index) {
        if (result[property] === value) {
            //Remove from array
            array.splice(index, 1);
        }
    });
}

function decodeHTMLEntities(text) {
    var entities = [
        ['apos', '\''],
        ['amp', '&'],
        ['lt', '<'],
        ['gt', '>']
    ];

    for (var i = 0, max = entities.length; i < max; ++i) 
        text = text.replace(new RegExp('&'+entities[i][0]+';', 'g'), entities[i][1]);

    return text;
}








    Parse.initialize("S3FAzGmZtzGPwZrieqcDcdzdGrN9nTEYLLIFdkAY", "P2CcIuM1V7fPaEUzXnqHejLkdmKaFrMv7aXxHkz3");
  
  var VKId;
  var VKMusic={}
  var testVar;
  var toggleVKSearchEnabled=false;
  var $animation;
  var SPToken;
  var SPMusic;

  mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"
  // $(".playlist, #youtube, #stats, #bgChanger, #uploadFrameDisplayer").on(mousewheelevt, function(e) {
  //     e.stopPropagation();
  // });
  // $("#lyricsHolder").on(mousewheelevt, function(e) {
  //     e.stopPropagation();
  // });
  function initiateVK() {
      VK.init({
        apiId: 4152682
      });
      loginVK(); //alert("wonder");
    };
    // setTimeout(function() {
    //   loginVK();
    // }, 8000);
    function loginVK(){//window.scrollTo(0, 1);//alert("triggered"); 
    VK.Auth.getLoginStatus(function(answer){console.log(answer);
    if(answer.status=="connected" && answer.session!=null)
    {
      VKgetMusic(answer);
    }
      else
        {
          VK.Auth.login(authInfoVK,8); //alert("hi");
        }
    });
  }
    function authInfoVK(response) { console.log(response);
    if (response.session) {
        testVar = response
      //alert('user: '+response.session.mid);console.log(response.settings);
          setTimeout(function() 
                    {
                       VKId=response.session.mid;
                       VKgetMusic(response);
                     }, 0)
          }
     else {
      //alert('not auth');
    }
  }
  function VKgetMusic(source)
  {
    loginSuccessful()
    VK.api("audio.get", {uid:VKId}, function(data) {console.log(data);
      VKMusic = JSON.parse(decodeHTMLEntities(JSON.stringify(data))); 
      refreshAngular(VKMusic);
      fireEvent("VKLoaded")
   })
  }

  function searchMusic(name){
    VK.api("audio.search", {q:name, auto_complete:1, lyrics:0, performer_only:0, sort:2, search_own:0, offset:0,count:10}, function(response){
          console.log(response); 
          if(response.response.length==1){
          return {"response":[328053,{"aid":420270844,"artist":"Lx24 ","duration":218,"lyrics_id":"193532162","owner_id":230246713,"title":"Ты мой Космос  ","url":"http://cs9-11v6.v"}]}
         }else{
          // return response
          var res = response
          for(var i=1; i<res.response.length; i++){
            $("#searchList").append('<li class="list-group-item vkSearchItemContainer"><a class="btn btn-default btn-sm firstChild" onclick="playFromSearch('+i+',`'+res.response[i].url+'`,this)"><i class="fa fa-fw fa-play"></i></a><a class="btn btn-default btn-sm" onclick="handleVKAdding('+res.response[i].aid+','+res.response[i].owner_id+',this)"><i class="fa fa-fw fa-plus"></i></a><span class="VKSearchSpan">'+res.response[i].artist+' - '+res.response[i].title+'</span></li>')
          }

         }
      })

    // return {"response":[328053,{"aid":420270844,"artist":"Lx24 ","duration":218,"lyrics_id":"193532162","owner_id":230246713,"title":"Ты мой Космос  ","url":"http://cs9-11v6.v"}]}
  }

  function playFromSearch(index, url, el){
    if(Player.audio) Player.audio.pause()
    Player.audio = new Audio(url);
    Player.audio.play()

    var parent = $(el.parentNode)
    // var children = btn.find("i")
    var btn = $(el)
    var children = btn.find("i")
    $(children[0]).removeClass("fa-play").addClass("fa-pause")
  }

  function VKSearchAction(){
    var term = $("#termInput").val()
    $("#searchList").empty()
    var res = searchMusic(term)
    // console.log(res.response)

  }

   function searchLyricsVK(name, source)
   {
     VK.api("audio.search", {q:name, auto_complete:1, lyrics:1, performer_only:0, sort:2, search_own:0, offset:0,count:10}, function(response){
        console.log(response); 
            function displayNoLyrics()
            {
             $("#lyricsContainer").empty(); 
             strTempTemp='No Lyrics found. Sorry(:';
             $("#lyricsContainer").append(strTempTemp); 
             console.log('No Lyrics found. Sorry(:')
             $("#lyricsShowButton").addClass("disabled")
            }
            if(response.response.length==1)//not found
            {
               displayNoLyrics();
            }
            else if(response.response[1].lyrics_id!=null && response.response.length>=2)//found
            {
             //console.log(response.response);
                var foundLongLyrics=false;
                //for(var i=0, l=response.response.length; i<l;i++)
                var count=0;
                function fetchLyrics()
                {
                  if(count<response.response.length)
                  { 
                    if(foundLongLyrics){}
                    else
                    {
                      VK.api("audio.getLyrics", {lyrics_id:response.response[count+1].lyrics_id}, checkLength);
                      count++;
                    }
                  }
                } 
                fetchLyrics();
                function checkLength(lyrResp)
                {//console.log(lyrResp);//alert("called");
                if(lyrResp.response)
                 { 
                    if(lyrResp.response.text.length>500)
                    {
                      console.log(foundLongLyrics);
                      foundLongLyrics=true;
                     $("#lyricsContainer").empty();
                     $("#lyricsContainer").append(lyrResp.response.text.replace(/\n/g, '<br />'));
                     console.log(lyrResp.response.text.replace(/\n/g, '<br />'))
                     // console.log(lyrResp.response.text.length);
                     // $(".lyricsHolder").animate({ scrollTop: 0}, 'slow');
                     scrollTo(lyricsContainer, 0)
                     $("#lyricsShowButton").removeClass("disabled")
                    }
                    else fetchLyrics();
                  }
                else return false;//error received
                }
                setTimeout(function(){ 
                                      console.log("found",foundLongLyrics);
                                      if(!foundLongLyrics)
                                      {
                                        displayNoLyrics();
                                      }
                        }
                , 1000);
            }
    }) //http://vk.com/dev/audio.search
       
   }
  function toggleVKSearchEnabler()
  { 
    if(!toggleVKSearchEnabled)
    {
    toggleVKSearchEnabled=true;
    $("#VKSearchEnabler").addClass("buttonPressed");
    $( "#tags" ).autocomplete({
        source: "VK"//$.merge(forMerge, cleanedArr)
      });
    }
    else
    {
      toggleVKSearchEnabled=false; 
      $("#VKSearchEnabler").removeClass("buttonPressed");
      feedAutoComplete();
    }
  }
  function handleVKAdding(id,owner_id, el)
  {//alert('handleVKAdding');
    testVar = el
    console.log(id, owner_id, el)
    VK.api("audio.add", {aid:id, oid:owner_id}, function(data){
      // VKgetMusic("handleVKAdding");
      // 
      var btn = $(el)
      btn.attr('disabled', true);
      var children = btn.find("i")
      $(children[0]).removeClass("fa-plus").addClass("fa-check")
    });

    // var btn = $(el)
    // btn.attr('disabled', true);
    // var children = btn.find("i")
    // $(children[0]).removeClass("fa-plus").addClass("fa-check")
  }



  var playerApp = angular.module('playerApp', []);

  // Define the `PhoneListController` controller on the `playerApp` module
  playerApp.controller('playerController', function playerController($scope) {
    $scope.response = [
      {
        artist: 'Johann Sebastian Bach',
        title: 'Prelude in C major',
        url:'https://www.dropbox.com/s/kavovoai0jwpj38/amclassical_prelude_in_c_major_bwv_846a.mp3?dl=1'
      }, {
        artist: 'Wolfgang Mozart',
        title: 'Adagio for Glass Harmonica',
        url:'https://www.dropbox.com/s/wiap2pkf6344obr/amclassical_mozart_adagio.mp3?dl=1'
      }, {
        artist: 'Johann Sebastian Bach',
        title: ' Jesu Joy of Man\'s Desiring',
        url:'https://www.dropbox.com/s/l3mpp1awychq2h4/amclassical_jesu_joy_of_mans_desiring.mp3?dl=1'
      }
    ];
    $scope.refresh = function(value){
      $scope.response=value;
      $scope.$apply();
      // $scope.response = Storage.get();
    }
    $scope.getPictureAndPlay = function(value,el){
      changeActive(el.$index)
      Player.play(el.music.url, el.$index)
      searchLyricsVK(el.music.artist+" "+el.music.title)
      Loader.showLoader()
      getPictureAndPlay(value);
    }
    $scope.playAt=function(index){
      var first = $scope.response[index]
      $scope.getPictureAndPlay(first.artist, {music:{url:first.url},$index:index})
    }
    $scope.orderList = "artist";
  });

  function refreshAngular(VKMusic){
    // VKMusic.response.shift()
    angular
            .element(document.querySelector('[ng-controller="playerController"]'))
            .scope().refresh(VKMusic.response)
  }
  function getPictureAndPlay(artist) {
     Parse.Cloud.run('searchArtist', {artist:encodeURIComponent(artist)}, { 
      success: function (result) {
        // console.log(result)
        var parsed = JSON.parse(result)
        console.log(parsed)
        if(!parsed.artist){
          $("#image img").attr("src", "player.svg")
          return
        }
        var url = parsed.artist.image[4]
          console.log(url)   
           if(url["#text"] && url["#text"].length>1) $("#image img").attr("src", url["#text"])
           else $("#image img").attr("src", "player.svg")
        } ,
        error:function (result) {
          console.log(result)   
        }
       });
  }

  function loginSuccessful(){
    VK.api('users.get', {
           user_ids: VK._session.mid,
           fields: "photo_50,city,verified"
       }, function(data) {
          console.log(data)
           $("#logoutButton span").text('Log out'+" "+data.response[0].first_name+" "+data.response[0].last_name);
       });

    $("#logoutButton").css("display","block")
    $("#loginButton").hide()
  }
  function logoutSuccessful(){
    $("#loginButton").show()
    $("#logoutButton").hide()
  }

  var Loader={
    img:null,
    showLoader:function(){
      Loader.img.attr("src", "circle.svg")

    }
  }

  var Player={
    playing:false,
    index:0,
    audio:null,
    position:0,
    autoNext:true,
    pause:function(){
      Player.position = Player.audio.currentTime;
      Player.audio.pause(); 
      showPlayIcon(null,true) 
      Player.playing=false
    },
    play:function(url,indx){
      if(Player.audio) Player.audio.src=url
        else Player.audio = new Audio(url);
      Player.audio.addEventListener("progress", Player.progressUpdate, false);
      Player.audio.addEventListener("timeupdate", Player.timeupdateSong, false);
      Player.audio.addEventListener("ended", Player.songEnded, false);
      Player.audio.addEventListener("error", Player.errorLoading, false)
      Player.audio.play(); 
      showPlayIcon(null,false)
      $("#barsCont").click(Player.seekbarMouseUp)
      Player.playing=true
      Player.index = indx
    },
    continue:function(){
      Player.audio.play(Player.position);
      Player.playing=true
      showPlayIcon(null,false)
    }, 
    bufferBar: "#buffer .progress-bar",
    currentProgress:"#currentProgress .progress-bar",
    progressUpdate:function(){
        if (Player.audio.buffered.length > 0) {
            var percent = (Player.audio.buffered.end(0) / Player.audio.duration) * 100;
            $(Player.bufferBar).css({
                width: percent + "%"
            });
        }
    },
    isBeingAnimated:false,
    seeking:false,
    timeupdateSong:function() {
            if (!Player.isBeingAnimated) {
                if (Player.seeking == false) {
                    var timePercent = (Player.audio.currentTime / Player.audio.duration) * 100;
                    $(Player.currentProgress).css({
                        width: timePercent + "%"
                    });
                    timePercent=Math.floor( timePercent );
                    if(timePercent/10 % 2 === 0 && timePercent>1) lyricsScroll(timePercent)
                }
            }
            // if (controls.timeProgress != null || controls.timeProgress != undefined) {
            //     $(controls.timeProgress).text(((Math.floor(this.currentTime / 60)) < 10 ? "0" + Math.floor(this.currentTime / 60) : Math.floor(this.currentTime / 60)) + ":" + ((this.currentTime - (Math.floor(this.currentTime / 60)) * 60) < 10 ? "0" + Math.floor(this.currentTime - (Math.floor(this.currentTime / 60)) * 60) : Math.floor(this.currentTime - (Math.floor(this.currentTime / 60)) * 60)));
            // }
    }, 
    errorLoading:function(e){
      console.log(e)
      Player.songEnded()
    },
    seekbarMouseUp:function(e) {
        var relX = Math.round(((e.pageX - $("#barsCont").offset().left) / $("#barsCont").width()) * 100);
        relX = relX > 100 ? 100 : relX;

        try {
            Player.audio.currentTime = (relX * Player.audio.duration) / 100;
        } catch (e) {
            console.log("Please wait until music is loaded");
        }
        //------------------------------------------------------------------------
        $(Player.currentProgress).css({
            width: relX + "%"
        });

        Player.isBeingAnimated = true;
        setTimeout(function() {
            Player.isBeingAnimated = false;
        }, 350);

        Player.seeking = false;
        if (Player.audio.paused) {
            Player.continue()
        }
        // document.removeEventListener("mousemove", seekbarMouseMove, false);
        // document.removeEventListener("mouseup", seekbarMouseUp, false);
        // // $(controls.indicator).css('z-index', -100);
        // $(controls.indicator).hide();
    },
    songEnded:function(){
        // console.log("song ended");
        if (Player.repeat == 0 && Player.index >= VKMusic.response.length - 1) {
            Player.pause()
        } else if (Player.repeat == 1) {
            Player.audio.currentTime = 0;
            Player.play();
        } else {
            if (!Player.autoNext) {
                Player.pause();
                return
            }
            Player.index = (Player.index >= VKMusic.response.length - 1)?0:Player.index+1
            // Player.play(VKMusic.response[Player.index].url, Player.index)
            angular
              .element(document.querySelector('[ng-controller="playerController"]'))
                .scope().playAt(Player.index)
            console.log(VKMusic.response[Player.index], Player.index)
        }
    }
  }

  function scrollTo(div, y){
    return TweenMax.to(div, 2, {scrollTo:{y:y}, ease:Power2.easeOut});
  }
  function lyricsScroll(percent) {
    console.log("lyricsScroll",percent)
    if($('#lyricsContainer:hover').length==0) scrollTo(lyricsContainer, (lyricsContainer.scrollHeight/100*percent-lyricsContainer.offsetHeight/2))
  }
  function flipArtwork(toShow, toHide){
    $("#"+toShow).css("transform", "")
    TweenMax.to(document.getElementById(toHide), 0.5, {x:-100, opacity:0 , ease:Power1.easeInOut ,repeat:0,
    onComplete:function(){
      $("#"+toHide).hide();
      TweenMax.to(document.getElementById(toHide), 0.1, {x:0, opacity:1 , ease:Power1.easeInOut ,repeat:0})
      // $("#"+toHide).css("transform", "")
      // $("#"+toHide).css("opacity", "1")
      // $("#"+toShow).fadeIn("slow");
      $("#"+toShow).show();
      TweenMax.fromTo(document.getElementById(toShow), 0.5, {x:100, opacity:0}, {x:0, opacity:1});
    }
      });

  }

  function playOrPause(){
    // if(playShown)
    playShown = !playShown;
    showPlayIcon($animation, playShown)
    if(playShown) Player.pause()
    else Player.continue()
  }

  function showPlayIcon($animation,bool){
    if(!$animation) $animation = $("#animation")
    playShown = bool
    $animation.attr({
       "from": bool ? play : pause,
       "to": bool ? pause : play
    }).get(0).beginElement();
  }

  var playShown = false
  function initiMorphPlayPause(classReceived, animation){
     pause = "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28",
     play = "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26",
     $animation = $(animation);

     showPlayIcon($animation, true)

    $("."+classReceived).on('click', playOrPause);

  }
  function progressCircle(percent){
      var val = percent;
      var $circle = $('#svg #bar');
      
      if (isNaN(val)) {
       val = 100; 
      }
      else{
        var r = $circle.attr('r');
        var c = Math.PI*(r*2);
       
        if (val < 0) { val = 0;}
        if (val > 100) { val = 100;}
        
        var pct = ((100-val)/100)*c;
        
        $circle.css({ strokeDashoffset: pct});
        
        $('#cont').attr('data-pct',Math.floor(val));
      }
  }

  function volume(vol) {
      vol = vol > 100 ? 100 : vol < 0 ? 0 : vol;
      Player.audio.volume = vol / 100;
      progressCircle(vol)
      console.log(vol)
      // volumePercent = vol;
      // $(controls.volumeLevel).css({
      //     width: vol + "%"
      // });
      // setCookie("volumeOfPlayer", vol, 365);
  }
  function volumeScroll(e) {
      if(!Player.audio) return
      // if (scrollVolumeOn) {
          scrollVolControl = Player.audio.volume * 100;
          var e = window.event || e;
          var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
          delta > 0 ? scrollVolControl += 1 : scrollVolControl -= 1;
          volume(scrollVolControl);
      // }
  }

  function changeActive(index){
    $(".listItem").removeClass("activeItem")
    var item = $(".listItem")[index]
    $(item).addClass("activeItem")
  }
  jQuery(document).ready(function() {
      setTimeout(function() {
        var el = document.createElement("script");
        el.type = "text/javascript";
        el.src = "https://vk.com/js/api/openapi.js";
        el.async = true;
        el.id="vkscript"
        el.onload=function(){
          initiateVK()
        };
        document.getElementsByTagName('body')[0].appendChild(el);
      }, 0);

      try{
        if(!VK){
          console.log("VK", angular.element(document.querySelector('[ng-controller="playerController"]')).scope().response)
          VKMusic.response=angular
                    .element(document.querySelector('[ng-controller="playerController"]'))
                    .scope().response
        }
      }
      catch(e){
        console.log(e)
        VKMusic.response=angular
                  .element(document.querySelector('[ng-controller="playerController"]'))
                  .scope().response
      }
      // initiateVK()
      initBounceButtons("#image img")
      // initToggling({class:"toggPlay"})
      initiMorphPlayPause("ytp-play-button", "#animation")
      $(document).dblclick(function() {
          playOrPause();
      });
      Loader.img = $("#image img")
      $('#cont').on(mousewheelevt, volumeScroll);
      var lock=false;
      var timer;
      $('body').on(mousewheelevt, function(){
        if(timer){timer.clear()}
        if(!lock){
          lock=true
          $('#cont').fadeIn();
          time = setTimeout(function(){
            $('#cont').fadeOut(function(){lock=false});
          }, 3000)
          
        }
      });
      $("#ulMain, #cont, #lyricsContainer").on(mousewheelevt, function(e){e.stopPropagation()});
      //____________________________
        $('.search-panel .dropdown-menu').find('a').click(function(e) {
        e.preventDefault();
        var param = $(this).attr("href").replace("#","");
        var concept = $(this).text();
        $('.search-panel span#search_concept').text(concept);
        $('.input-group #search_param').val(param);
      });
      
        //____________________________
      $( "#query" ).on('input',function() {
        console.log($( this ).val().length)
        if($( this ).val().length>0){

          $( this ).addClass("opacityFull")
          Player.autoNext=false
          $(".searchSourceRadio").removeClass("closed")
          $("#searchclear").show()

        } else{
          //When no input
          $( this ).removeClass("opacityFull")
          Player.autoNext=true
          $(".searchSourceRadio").addClass("closed")
          $("#searchclear").hide()

        }
      });


      $( "#termInput" ).on("input", function() {
        VKSearchAction()
      });

      window.addEventListener('keydown',function(e,val){
         if(e.ctrlKey && e.code=="KeyF") {
          //action
          $('#searchPanel').modal('toggle');
         }
      });

      $("#searchclear").click(function(){
          $("#query").val('');
          $("#query").trigger( "input" );
      });

      // SC.initialize({
      //   client_id: 'bd00189db2bc8ba23deb78a1dd2a7120',

      //   redirect_uri: "http://www.gtplayer.ru/sclogin.html"
      // });

      //SPotify login
      SPToken = Parse.User.current().get("SPToken")
      // if(SPToken){
      //  SPgetAllTracks(SPToken).then(function(res){
      //    SPMusic = res
      //  })
      //  SPChangeButton("spLoginButton", "Log out Spotify", function(){
      //    Parse.User.current().set("SPToken", null).save();
      //    SPChangeButton("spLoginButton", "Link Spotify", SPlogin)
      //  })
      // }else{
      //  SPChangeButton("spLoginButton", "Link Spotify", function(){
      //    SPlogin(function(accessToken) {
      //      Parse.User.current().set("SPToken", accessToken).save()
      //      SPgetAllTracks(SPToken).then(function(res){
      //        SPMusic = res
      //      })
      //     });
      //  })
      // }
      if(SPToken){
        $('#spLoginButton').hide()
        $('#spLogOutButton').show()
        // SPlogin(function(accessToken) {
        //   SPToken = accessToken
        //   Parse.User.current().set("SPToken", SPToken).save()
        // })
        document.addEventListener("VKLoaded",getSPIDSForVK)
      }else{
        $('#spLoginButton').show()
        $('#spLogOutButton').hide()
      }


    }
  );
  function loadUploads(){
    Parse.Cloud.run('getUploads', {}, {
        success: function(result) {
              console.log(result)
              refreshAngular(result);
        }, 
        error:function(e){
            console.log(e)
      }
    })
  }

  function launchVKSearch(){
    var term = $("#query").val()
    $('#searchPanel').modal('toggle');
    $("#termInput").val(term)
    $("#termInput").trigger( "input" );
    $("#termInput").focus()
  }

  function getSPIDSForVK(){
    var matches = Parse.User.current().get("SPVKIdsMatches")
    for(i in VKMusic.response){
      for(m in matches){
        if(VKMusic.response[i].aid==matches[m].VKID && matches[m].SPID!=null) VKMusic.response[i].spotifyID = matches[m].SPID
      }
      if(!VKMusic.response[i].spotifyID) VKMusic.response[i].spotifyID=null
    }
    if(SPToken) getFeaturesForAll(SPToken, VKMusic.response)
  }

  function fireEvent(name){
    var event; // The custom event that will be created

    if (document.createEvent) {
      event = document.createEvent("HTMLEvents");
      event.initEvent(name, true, true);
    } else {
      event = document.createEventObject();
      event.eventType = name;
    }

    event.eventName = name;

    if (document.createEvent) {
      document.dispatchEvent(event);
    } else {
      document.fireEvent("on" + event.eventType, event);
    }
  }