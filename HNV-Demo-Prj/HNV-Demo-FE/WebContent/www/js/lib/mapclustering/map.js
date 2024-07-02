"use strict";

function do_gl_GoogleMap_init(_map_id, data, location, checkIcon, eventCluster) {
    var dir_status_not_found = 0;
    var dir_status_found     = 1;

    var directory_path     = App.path.BASE_URL_UI + UI_URL_ROOT;
    var _data_list         = data != undefined ? data : PR_DATA_MAP;
    var dir_latitude       = location.lat;
    var dir_longitude      = location.lng;
    var dir_map_type       = 'ROADMAP';
    var dir_close_marker   = directory_path + 'images/icons/close.png';
    var dir_cluster_marker = directory_path + 'images/icons/cluster.png';
    var dir_map_marker     = directory_path + 'images/icons/current-position.png';
    var dir_cluster_color  = '#fff';
    var dir_zoom           = '15';
    var dir_map_scroll     = 'false';
    var gmap_norecord      = '';
    var loader_html        = '<div class="provider-loader-wrap"><div class="provider-loader"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></div>';

//	https://mapstyle.withgoogle.com/
    var style_map = [{"featureType": "poi", "stylers": [{"visibility": "off"}]},
                     {"featureType": "poi.attraction", "stylers": [{"visibility": "off"}]},
                     {"featureType": "poi.business", "stylers": [{"visibility": "off"}]},
                     {"featureType": "poi.government", "stylers": [{"visibility": "off"}]},
                     {"featureType": "poi.medical", "stylers": [{"visibility": "off"}]},
                     {"featureType": "poi.park", "stylers": [{"visibility": "off"}]},
                     {"featureType": "poi.place_of_worship", "stylers": [{"visibility": "off"}]},
                     {"featureType": "poi.school", "stylers": [{"visibility": "off"}]},
                     {"featureType": "poi.sports_complex", "stylers": [{"visibility": "off"}]},
                     {"featureType": "transit.station.bus", "stylers": [{"visibility": "off"}]}];

    if (dir_map_type == 'ROADMAP') {
        var map_id = google.maps.MapTypeId.ROADMAP;
    } else if (dir_map_type == 'SATELLITE') {
        var map_id = google.maps.MapTypeId.SATELLITE;
    } else if (dir_map_type == 'HYBRID') {
        var map_id = google.maps.MapTypeId.HYBRID;
    } else if (dir_map_type == 'TERRAIN') {
        var map_id = google.maps.MapTypeId.TERRAIN;
    } else {
        var map_id = google.maps.MapTypeId.ROADMAP;
    }

    var scrollwheel = true;
    var draggable   = true;
    var lock        = 'unlock';

    if (dir_map_scroll == 'false') {
        scrollwheel = false;
        draggable   = false;
        lock        = 'unlock';
    }

    var mapOptions = {
        zoom           : parseInt(dir_zoom),
        maxZoom        : 20,
        mapTypeId      : map_id,
        scaleControl   : true,
        // scrollwheel    : scrollwheel,
        gestureHandling: 'cooperative',
        draggable      : draggable,
        styles         : style_map,

        disableDefaultUI     : true,
        zoomControl          : true,
        zoomControlOptions   : {position: google.maps.ControlPosition.LEFT_BOTTOM},
        mapTypeControl       : true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        streetViewControl    : false,
        rotateControl        : true,
        fullscreenControl    : true
    }

    var map    = new google.maps.Map(document.getElementById(_map_id), mapOptions);
    var bounds = new google.maps.LatLngBounds();
    var marker = new google.maps.Marker({
        position: location,
        map,
        title   : "Click to zoom",
    });

    google.maps.event.addListener(map, "center_changed", function() {
        const center  = this.getCenter()
        const lat = center.lat();
        const lng = center.lng();
        marker.setOptions({
            position: {lat, lng},
        })
    });

    ////////////////////////////////////////////////////////////////
    //////////////////////BINDING EVENT/////////////////////////////

//Zoom In
//	if(document.getElementById('doc-mapplus') ){ 
//	google.maps.event.addDomListener(document.getElementById('doc-mapplus'), 'click', function () {
//	var current= parseInt( map.getZoom(),10 );
//	current++;
//	if(current>20){
//	current=20;
//	}
//	map.setZoom(current);
//	});
//	}

    //Zoom Out
//	if(document.getElementById('doc-mapminus') ){ 
//	google.maps.event.addDomListener(document.getElementById('doc-mapminus'), 'click', function () {
//	var current= parseInt( map.getZoom(),10);
//	current--;
//	if(current<0){
//	current=0;
//	}
//	map.setZoom(current);
//	});
//	}

    //Lock Map
    if (document.getElementById('doc-lock')) {
        jQuery("#doc-lock").html('<i class="fa fa-unlock-alt" aria-hidden="true"></i>');
        google.maps.event.addDomListener(document.getElementById('doc-lock'), 'click', function () {
            if (lock == 'lock') {
                map.setOptions({
//					scrollwheel: true,
                        gestureHandling: 'cooperative',
                        draggable      : true
                    }
                );
                jQuery("#doc-lock").html('<i class="fa fa-unlock-alt" aria-hidden="true"></i>');
                lock = 'unlock';
            } else if (lock == 'unlock') {
                map.setOptions({
//					scrollwheel: false,
                        draggable: false
                    }
                );
                jQuery("#doc-lock").html('<i class="fa fa-lock" aria-hidden="true"></i>');
                lock = 'lock';
            }
        });
    }

    //Map resize
//	jQuery(document).on("click",'.wygo-btnmapview', function(e){
//	jQuery('.wygo-mapinnerbanner').toggleClass('wygo-open');
//	if( jQuery('.wygo-mapinnerbanner').hasClass('wygo-open') ) {
//	jQuery('.wygo-mapinnerbanner').append(loader_html);
//	}
//	setTimeout(function(){
//	jQuery('.wygo-mapinnerbanner').find('.provider-loader-wrap').remove();
//	google.maps.event.trigger(map,"resize");
//	map.panTo(location_center);
//	},1000);
//	});

    //Geolocation
//	jQuery(document).on("click",'#doc-geolocation', function(e){
//	if (navigator.geolocation) {
//	marker.setMap(null);
//	navigator.geolocation.getCurrentPosition(function(position) {

//	var geo_lat = position.coords.latitude;
//	var geo_lng = position.coords.longitude;

//	map.setZoom(14);

//	var location_center = new google.maps.LatLng(geo_lat, geo_lng);
//	var marker = new google.maps.Marker({
//	position: location_center,
//	map: map,
//	icon: dir_map_marker
//	});

//	map.panTo(location_center);
//	}, function(err) {
//	console.log("error: " + err.code + "; message: " + err.message);
//	}, {
//	enableHighAccuracy: true,
//	timeout: 2000,
//	maximumAge: Infinity //0
//	});
//	}else{
//	console.log("Browser doesn't support geolocation!");
//	}
//	});


    //---------------------------------------------------------------------------------------
    //set marker map by location select in search
    if (!$.isEmptyObject(location)) {
        var mLat     = location.lat == null ? dir_latitude : parseFloat(location.lat);
        var mLng     = location.lng == null ? dir_longitude : parseFloat(location.lng);
        var myLatlng = new google.maps.LatLng(mLat, mLng);

//		var icon = {
//		url: dir_map_marker, // url
//		scaledSize: new google.maps.Size(30, 30), // scaled size
//		origin: new google.maps.Point(0,0), // origin
//		anchor: new google.maps.Point(0, 0) // anchor
//		};

        // var options = {
        //     position: myLatlng,
        //     map     : map,
        // };
        //
        // if (checkIcon) {
        //     options.icon = dir_map_marker;
        //     map.setZoom(9);
        // }
        //
        // marker = new google.maps.Marker(options);

        map.setCenter(myLatlng);
    }

    //---------------------------------------------------------------------------------------
    if (_data_list.sta == dir_status_found) {
        jQuery('#gmap-noresult').html('').hide(); //Hide No Result Div
        var markers      = new Array();
        var info_windows = new Array();

        for (var i = 0; i < response_data.length; i++) {
            markers[i] = new google.maps.Marker({
                position: new google.maps.LatLng(response_data[i].lat, response_data[i].lng),	//reqCodeAddress(response_data[i].adr),
                map     : map,
                icon    : response_data[i].mrk,
                title   : response_data[i].tit,
//				animation: google.maps.Animation.DROP,
                visible: true
            });
            bounds.extend(markers[i].getPosition());
            var boxText       = document.createElement("div");
            boxText.className = 'wygo-infoboxcontent';
//			boxText.id			= 'wygo-infoboxcontent_' + response_data[i].ref;

            var infobox_html = "";

            if (App.template.controller && App.template.names.HOME_MAP_INFOBOX)
                infobox_html = App.template.controller.req_lc_compile_tmpl(App.template.names.HOME_MAP_INFOBOX,
                    response_data[i]);

            if (App.template.controller && App.template.names.PLAN_MAP_INFOBOX)
                infobox_html = App.template.controller.req_lc_compile_tmpl(App.template.names.PLAN_MAP_INFOBOX,
                    response_data[i]);

            boxText.innerHTML = infobox_html;

            var myOptions = {
                content               : boxText,
                disableAutoPan        : true,
                maxWidth              : 0,
                alignBottom           : true,
                pixelOffset           : new google.maps.Size(-150, -90),
                zIndex                : 9999,
                closeBoxMargin        : "0 0 -16px -16px",
                closeBoxURL           : dir_close_marker,
                infoBoxClearance      : new google.maps.Size(1, 1),
                isHidden              : false,
                pane                  : "floatPane",
                enableEventPropagation: false
            };
            var ib        = new InfoBox(myOptions);
            attachInfoBoxToMarker(map, markers[i], ib);
        }
        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds);

        /* Marker Clusters */
        var markerClustererOptions = {
            ignoreHidden: true,
            //maxZoom: 14,
            styles: [{
                textColor: dir_cluster_color,
                url      : dir_cluster_marker,
                width    : 23,
                height   : 30,
            }]
        };
        var markerClusterer        = new MarkerClusterer(map, markers, markerClustererOptions);

        google.maps.event.addListener(markerClusterer, 'clusterclick', function (cluster) {
            var markers = cluster.getMarkers();
            if (eventCluster) {
                eventCluster(map, markers);
            }
        });
    } else {
        jQuery('#gmap-noresult').html(gmap_norecord).show();
    }


    return map;
}


//---------------------------------------------------------------------------------------
function reqCodeAddress(address) {
    var geocoder = new google.maps.Geocoder();
    var gOptions = {'address': address};

    geocoder.geocode(gOptions, function (results, status) {
        if (status == 'OK') {
            return results[0].geometry.location;
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });

    return null;
}

function reqCoordinatesAddress(address) {
    var geocoder = new google.maps.Geocoder();
    var gOptions = {'address': address};

    geocoder.geocode(gOptions, function (results, status) {
        if (status == 'OK') {
            return {
                latitude: results[0].geometry.location.latitude,
                long    : results[0].geometry.location.longitude,
            };
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });

    return null;
}

function do_bindingEvent() {
    //doi thay chut
    $("#btn_map_show").on("click", function () {
        var loc01 = $("#loc01").val();
        var loc02 = $("#loc02").val();

        if (!loc01 || !loc02) return;

        var location = {"lat": loc01, "lng": loc02};
        openNewMap(location);
    });
    $("#btn_map_location").on("click", function () {
        var addr = $("#addr").val();

        if (!addr) return;

        getLocation(addr);
    });


}

function openNewMap(location) {
    var siteURL = 'https://www.google.com/maps?q=' + location.lat + "," + location.lng;
    var appURI  = App.data.currentUrl;

    var isiOS     = (navigator.userAgent.match('iPad') || navigator.userAgent.match(
        'iPhone') || navigator.userAgent.match('iPod'));
    var isAndroid = navigator.userAgent.match('Android');
    var isWP      = navigator.userAgent.match('Windows Phone') || navigator.userAgent.match('IEMobile');

    if (isiOS) {
        setTimeout(function () {
            window.location = siteURL;
        }, 25);     //fall back url
        $('body').append('<iframe style="visibility: hidden;" src="' + appURI + '" />');

    } else if ((isAndroid) || (isWP)) {
        setTimeout(function () {
            window.location = siteURL;
        }, 25);     //fall back url
        window.location = appURI;

    } else {    // if (isOtherPlatform)
        window.open(siteURL);
    }
}

function getLocation(strAddr) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({"address": strAddr}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
            var location = results[0].geometry.location,
                lat      = location.lat(),
                lng      = location.lng();

            lat = parseFloat((lat).toFixed(5));
            lng = parseFloat((lng).toFixed(5));

            $("#loc01").val(lat);
            $("#loc02").val(lng);
        } else {
            pr_ctr_Main.do_show_Notify_Msg();
        }
    });
}


//---------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------
//Assign Info window to marker
function attachInfoBoxToMarker(map, marker, infoBox) {
    google.maps.event.addListener(marker, 'click', function () {
        popup(map, marker, infoBox);

    });

    if (!can_gl_MobileOrTablet()) {
        // Events
        google.maps.event.addListener(marker, 'mouseover', function () {
//			popup(map, marker, infoBox);
        });

        google.maps.event.addListener(marker, 'mouseout', function () {
//			setTimeout(function() {
//			infoBox.close();
//			}, 3000);
        });
    }

    function popup(map, marker, infoBox) {
        var scale                = Math.pow(2, map.getZoom());
        var offsety              = ((100 / scale) || 0);
        var projection           = map.getProjection();
        var markerPosition       = marker.getPosition();
        var markerScreenPosition = projection.fromLatLngToPoint(markerPosition);
        var pointHalfScreenAbove = new google.maps.Point(markerScreenPosition.x, markerScreenPosition.y - offsety);
        var aboveMarkerLatLng    = projection.fromPointToLatLng(pointHalfScreenAbove);

        map.panTo(aboveMarkerLatLng);

        if (!App.data.refInfoboxMap) App.data.refInfoboxMap = null;
        if (App.data.refInfoboxMap != infoBox) {
            if (jQuery(".wygo-infoBox").length > 0)
                App.data.refInfoboxMap.close();

            App.data.refInfoboxMap = infoBox;
        }

        infoBox.open(map, marker);

        google.maps.event.addListener(infoBox, 'domready', function () {
            if (App.controller.Area.List)
                App.controller.Area.List.do_bind_list_map_event();

            //Have to put this within the domready or else it can't find the div element (it's null until the InfoBox is opened)

            $(infoBox.div_).hover(
                function () {
                    //This is called when the mouse enters the element
                },
                function () {
                    //This is called when the mouse leaves the element
//						infoBox.close();
                }
            );
        });
    }
}