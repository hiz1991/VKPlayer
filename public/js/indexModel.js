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