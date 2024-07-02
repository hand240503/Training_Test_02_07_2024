//import notify.js

//---------------------------------------------------------------------------------------
function do_gl_show_Notify_Msg_Default (msg, layout, type, eleParent){
	if (!layout) layout = "topLeft";
	if (!type) type = "info";
	if(eleParent)
		$(eleParent).notify(msg, {className: type, position: layout});
	else
		$.notify(msg, {className: type, position: layout});	
};

function do_gl_show_Notify_Msg_Info (msg, layout, eleParent){
	if (!layout) layout = "topLeft";
	var type = "info";
	if(eleParent)
		$(eleParent).notify(msg, {className: type, position: layout});
	else
		$.notify(msg, {className: type, position: layout});	
};

function do_gl_show_Notify_Msg_Error (msg, layout, eleParent){
	if (!layout) layout = "topLeft";
	var type = "error";
	if(eleParent)
		$(eleParent).notify(msg, {className: type, position: layout});
	else
		$.notify(msg, {className: type, position: layout});
};

function do_gl_show_Notify_Msg_Warn (msg, layout, eleParent){
	if (!layout) layout = "topLeft";
	var type = "warn";
	if(eleParent)
		$(eleParent).notify(msg, {className: type, position: layout});
	else
		$.notify(msg, {className: type, position: layout});
};

function do_gl_show_Notify_Msg_Success (msg, layout, eleParent){
	if (!layout) layout = "topLeft";
	var type = "success";
	if(eleParent)
		$(eleParent).notify(msg, {className: type, position: layout});
	else
		$.notify(msg, {className: type, position: layout});
};

//---API---------------------------------------------------------------------------------
/*
$.notify( string|object, [ options ])
	string|object - global notification data
	options - an options object or class name string

$.notify( element, string|object, [ options ])
	element - a jquery element
	string|object - element notification data
	options - an options object or class name string

$( selector ).notify( string|object, [ options ])
	selector - jquery selector
	string|object - element notification data
	options - an options object or class name string

$.notify.addStyle( styleName, styleDefinition )
	styleName - string (the style option references this name)
	styleDefinition - style definition object (see Styling below)

$.notify.defaults( options )
	options - an options object (updates the defaults listed below)
*/

function do_gl_show_Notify_Global(strOrObj, options){
	$.notify(strOrObj, options);
}

function do_gl_show_Notify_Element(element, strOrObj, options){
	$.notify(element, strOrObj, options);
}

function do_gl_show_Notify_Selector(selector, strOrObj, options){
	$(selector).notify(strOrObj, options);
}

function do_gl_show_Notify_Style(styleName, styleDef){
	$.notify.addStyle(styleName, styleDef);
}

function do_gl_show_Notify_Defaults(options){
	$.notify.defaults(options);
}

//--------OPTIONS PARAMS----------------------------------------------------------------
/*
{
  // whether to hide the notification on click
  clickToHide: true,
  // whether to auto-hide the notification
  autoHide: true,
  // if autoHide, hide after milliseconds
  autoHideDelay: 5000,
  // show the arrow pointing at the element
  arrowShow: true,
  // arrow size in pixels
  arrowSize: 5,
  // position defines the notification position though uses the defaults below
  position: '...',
  // default positions
  elementPosition: 'bottom left',
  globalPosition: 'top right',
  // default style
  style: 'bootstrap',
  // default class (string or [string])
  className: 'error',
  // show animation
  showAnimation: 'slideDown',
  // show animation duration
  showDuration: 400,
  // hide animation
  hideAnimation: 'slideUp',
  // hide animation duration
  hideDuration: 200,
  // padding between element and notification
  gap: 2
}
*/

function req_gl_set_Notify_Options(	className,
									position,
									elementPosition,
									globalPosition,
									style,
									clickToHide,
									autoHide,
									autoHideDelay,
									arrowShow,
									arrowSize,
									showAnimation,
									showDuration,
									hideAnimation,
									hideDuration,
									gap){
	var options = {};
	
	if(className)		options["className"] 		= className;
	if(position)		options["position"] 		= position;
	if(elementPosition)	options["elementPosition"] 	= elementPosition;
	if(globalPosition)	options["globalPosition"] 	= globalPosition;
	if(style)			options["style"] 			= style;
	if(clickToHide)		options["clickToHide"] 		= clickToHide;
	if(autoHide)		options["autoHide"] 		= autoHide;
	if(autoHideDelay)	options["autoHideDelay"] 	= autoHideDelay;
	if(arrowShow)		options["arrowShow"] 		= arrowShow;
	if(arrowSize)		options["arrowSize"] 		= arrowSize;
	if(showAnimation)	options["showAnimation"] 	= showAnimation;
	if(showDuration)	options["showDuration"] 	= showDuration;
	if(hideAnimation)	options["hideAnimation"] 	= hideAnimation;
	if(hideDuration)	options["hideDuration"] 	= hideDuration;
	if(gap)				options["gap"] 				= gap;
	
	return options;
}








