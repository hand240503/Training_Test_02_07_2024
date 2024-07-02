/*
var do_gl_LocalStorage_Save  			= function (route, data)
var do_gl_LocalStorage_Remove  			= function (route)
var req_gl_LocalStorage  				= function (route) 

var do_gl_LS_UserProfile_Save  			= function (route, userProfile)
var req_gl_LS_UserProfile 				= function (route)


var do_gl_LS_SecurityInfo_Save  		= function (route, info)
var do_gl_LS_SecurityInfo_Save_Time  	= function (route)
var req_gl_LS_SecurityInfo 				= function (route)
var do_gl_LS_SecurityInfo_Remove  		= function (route)

var req_gl_LS_SecurityHeader 			= function (route)
var req_gl_LS_SecurityHeaderBearer 		= function (route)
 */

var SECU_PREFIX='/hnv/';

var do_gl_LocalStorage_Save  = function (route, data){
	if (!route)	    route = "tmp";
	if (data) 		localStorage.setItem(SECU_PREFIX+route,JSON.stringify(data));	
}
var do_gl_LocalStorage_Remove  = function (route){
	if (!route){
		localStorage.clear();
		return;
	}
	localStorage.removeItem(SECU_PREFIX+route);	
}

//--------------------------------------------------------------
var req_gl_LocalStorage  = function (route){
	if (!route)	    route = "tmp";
	var data		= localStorage.getItem(SECU_PREFIX+route);
	if (data) data  = JSON.parse(data);
	return data;
}

//--------------------------------------------------------------
//--------------------------------------------------------------
var rq_gl_Crypto = function(mdp, method) {
	if (!method)
		return makeCrypto_SHA256(mdp);
	else if (method=="sha256")
		return makeCrypto_SHA256(mdp);
	else if (method=="sha512")
		return makeCrypto_SHA512(mdp);
};

var makeCrypto_SHA256 = function(mdp) {
	//var crypto = CryptoJS.SHA1(CryptoJS.SHA1(mdp).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
	//var crypto = sha256_digest(sha256_digest(mdp).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
	//var crypto = CryptoJS.SHA1(mdp).toString(CryptoJS.enc.Hex);
	var crypto = sha256(mdp);
	return crypto;
};
var makeCrypto_SHA512 = function(mdp) {	
	var crypto = sha512_digest(sha512_digest(mdp).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);	
	return crypto;
};

//------------------------------------------------------------------------------------------------------------
var do_gl_LS_UserProfile_Save  = function (route, userProfile){
	if (userProfile) 	localStorage.setItem(SECU_PREFIX+route+ '/usr',JSON.stringify(userProfile));
}

var req_gl_LS_UserProfile = function (route){
	var userProfile = localStorage.getItem(SECU_PREFIX+route+ '/usr');
	if (!userProfile) return null; 
	return JSON.parse(userProfile);
}

//---------------------------------------------------------------------------------------------
var TIME_SESS_LIM_REM_0 = 1000*60*60*1;
var TIME_SESS_LIM_REM_2 = 1000*60*60*24*365;
var TIME_TOK_REFRESH	= 60000*15;
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
var do_gl_LS_SecurityInfo_Save  = function (route, info){
	saveInfo (route, '/tok'		, info.tok);
	saveInfo (route, '/login'	, info.login);
	saveInfo (route, '/pass'	, info.pass);
	saveInfo (route, '/wHash'	, info.wHash);
	saveInfo (route, '/wSalt'	, info.wSalt);
	saveInfo (route, '/salt'	, info.salt);
	saveInfo (route, '/rem'		, info.rem);
	saveInfo (route, '/time'	, new Date().getTime());
	saveInfo (route, '/count'	, '1');
	saveInfo (route, '/method'	, info.method);
}

var do_gl_LS_SecurityInfo_Save_Time  = function (route){
	saveInfo (route, '/time'	, new Date().getTime());
}

var saveInfo  = function (route, path, obj){
	if (!obj){	
		localStorage.setItem	(SECU_PREFIX+route+ path, JSON.stringify(0));
	}else{		
		localStorage.setItem	(SECU_PREFIX+route+ path, obj);	
	}
}

var req_gl_LS_SecurityInfo = function (route){
		
	var tok			= req_gl_LS_SecurityToken (route); //check time+rem
	
	route			= SECU_PREFIX+route;
	var login		= localStorage.getItem(route+'/login');
	var pass		= localStorage.getItem(route+'/pass');
	var wHash		= localStorage.getItem(route+'/wHash');
	var wSalt		= localStorage.getItem(route+'/wSalt');
	var salt		= localStorage.getItem(route+'/salt');
	var rem			= localStorage.getItem(route+'/rem');
	var time		= localStorage.getItem(route+'/time');
	var count		= localStorage.getItem(route+'/count');
	var method		= localStorage.getItem(route+'/method');
	return {tok, login, pass, wHash, wSalt, salt, rem, time, count, method}
}

var do_gl_LS_SecurityInfo_Remove  = function (route){
	route		= SECU_PREFIX+route;
	localStorage.removeItem(route+'/tok');
	localStorage.removeItem(route+'/login');
	localStorage.removeItem(route+'/pass');
	localStorage.removeItem(route+'/wHash');
	localStorage.removeItem(route+'/wSalt');
	localStorage.removeItem(route+'/salt');
	localStorage.removeItem(route+'/rem');
	localStorage.removeItem(route+'/time');
	localStorage.removeItem(route+'/count');
	localStorage.removeItem(route+'/usr');
	localStorage.removeItem(route+'/method');
}

var TIME_SESS_LIM = 30*60*1000;//30minutes;
var req_gl_LS_SecurityToken = function (route){
		route	= SECU_PREFIX+route;
	var tok 	= localStorage.getItem(route+'/tok');

	if (!tok){
		do_gl_LS_SecurityInfo_Remove(route);
		return null;	
	}
	var rem 	= localStorage.getItem(route+'/rem');
	var time 	= localStorage.getItem(route+'/time');
	var now 	= new Date().getTime();	
	
	if (!rem) 	rem 	= 0; else rem	= parseInt(rem	, 10);
	if (!time) 	time 	= 0; else time	= parseInt(time	, 10);

	if (!rem && now-time>TIME_SESS_LIM){
		do_gl_LocalStorage_Remove();
		return null;	
	}
	return tok;
}

var req_gl_LS_SecurityHeaderBearer = function (route){
	let tok			= req_gl_LS_SecurityToken (route);
	
	if (!tok) return null;
	
	let aut_Header	= {
			Authorization	: "Bearer " + tok,
			'Content-Type'	: 'application/json',
			'Accept'		: 'application/json',
		}
	return aut_Header;
}

