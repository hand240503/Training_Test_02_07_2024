const FUNCT_SCOPE	= AppCommon['const'].	FUNCT_SCOPE;
const FUNCT_NAME	= AppCommon['const'].	FUNCT_NAME;
const FUNCT_PARAM	= AppCommon['const'].	FUNCT_PARAM;

function req_gl_funct(fScope, fName, fParams){ //fParams must be a array
	var f01 = {}; 	
	f01[FUNCT_SCOPE]	= fScope ; 	
	f01[FUNCT_NAME] 	= fName;				
	f01[FUNCT_PARAM]	= fParams;
	return f01;
} 

function req_gl_Request_Content_Send(serviceClass, serviceName){
	var svClass 	= App['const'].SV_CLASS;
	var svName		= App['const'].SV_NAME;
	var sessId		= App['const'].SESS_ID;
	var userId      = App['const'].USER_ID;

	var ref 		= {};
	ref[svClass] 	= serviceClass; 
	ref[svName]		= serviceName;
	ref[userId]		= App.data.user ? App.data.user.id : -1;
	ref[sessId]		= App.data.session_id;

	return ref;
}

function do_show_Msg_No_Ajax(msg){
	console.log("do_show_Msg_No_Ajax::" + msg);
}

function do_show_Msg_Ajax(sharedJson, msg){
	console.log("do_show_Msg_Ajax::" + msg);
}

/*
var fSucces		= [];        		
fSucces.push(req_funct_after_ajax(App	, App.funct.put		, varname_diffu	));
fSucces.push(req_funct_after_ajax(null	, showDiffusionList	, null			));       

var fError 		= req_funct_after_ajax($.i18n("common_err_ajax"));

App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, url_header, ref, 100000, fSucces, fError) ;	
*/