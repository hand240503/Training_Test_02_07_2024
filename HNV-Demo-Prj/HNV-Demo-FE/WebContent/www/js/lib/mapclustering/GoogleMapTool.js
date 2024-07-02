//---phai nho import bib map truoc trong app_.js
function do_gl_openNewMap(location){
	var siteURL	= 'https://www.google.com/maps?q='+location.lat + "," + location.lng;
	var appURI	= App.data.currentUrl;

	var isiOS = (navigator.userAgent.match('iPad') || navigator.userAgent.match('iPhone') || navigator.userAgent.match('iPod'));
	var isAndroid = navigator.userAgent.match('Android');
	var isWP = navigator.userAgent.match('Windows Phone') || navigator.userAgent.match('IEMobile');

	if (isiOS){
		setTimeout(function () { window.location = siteURL; }, 25);     //fall back url
		$('body').append('<iframe style="visibility: hidden;" src="'+ appURI +'" />');

	} else if ((isAndroid) || (isWP)){
		setTimeout(function () { window.location = siteURL; }, 25);     //fall back url
		window.location = appURI;

	} else {    // if (isOtherPlatform)
		window.open(siteURL);
	}

}

function do_gl_showGoogleMap(div, location) {
	if(!$.isEmptyObject(location)){
		return do_gl_GoogleMap_init(div, [], location);
	}
}