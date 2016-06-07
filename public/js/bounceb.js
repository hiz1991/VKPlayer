function initBounceButtons(selector){
	try { 
	    if(!TweenMax){}
	}
	catch(err) {
	    console.error('bounceb missing tweenlite. '+err)
	    return
	}
	try { 
	    if(!$){}
	}
	catch(err) {
	    console.error('bounceb missing jquery. '+err)
	    return
	}
	$button = $(selector)
	$button.click(function(e) {
	  e.preventDefault()
	  var button = e.currentTarget
	  console.log(e)
	  var duration = 0.3,
	      delay = 0.08;
	  TweenMax.to(button, duration, {scaleY: 1.1, ease: Expo.easeOut});
	  TweenMax.to(button, duration, {scaleX: 1.05, scaleY: 1, ease: Back.easeOut, easeParams: [3], delay: delay});
	  TweenMax.to(button, duration * 1.25, {scaleX: 1, scaleY: 1, ease: Back.easeOut, easeParams: [6], delay: delay * 3 });
	});
}