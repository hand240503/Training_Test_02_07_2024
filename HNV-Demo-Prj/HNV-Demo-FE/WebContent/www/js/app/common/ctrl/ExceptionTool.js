var do_gl_exception_send = function(url, moduleName, className, functionName, msg) {
	var svClass 			= App['const'].SV_CLASS;
	var svName				= App['const'].SV_NAME;
	var sessId				= App['const'].SESS_ID;
	var fVar				= App['const'].FUNCT_SCOPE;
	var fName				= App['const'].FUNCT_NAME;
	var fParam				= App['const'].FUNCT_PARAM;
	var ref					= {};
	ref[svClass		] 		= "ServiceSysException"; 
	ref[svName		]		= "SVNew"; 
	
	if (App.data.user) uId = App.data.user.id; else  uId = -1;	
	ref['obj'	] 	= {
							"uId" 		: uId,
							"dt"		: DateFormat(new Date(), DateFormat.masks.dbLongDate),
							"inf01"		: moduleName,
							"inf02"		: className,
							"inf03"		: functionName,
							"inf04"		: msg};
	App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, null, null) ;			
}

