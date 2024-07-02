function do_gl_statistic_new(url, url_header, NetworkController, entTyp, entId) {
	var svClass 			= App['const'].SV_CLASS;
	var svName				= App['const'].SV_NAME;
	var sessId				= App['const'].SESS_ID;
	var fVar				= App['const'].FUNCT_SCOPE;
	var fName				= App['const'].FUNCT_NAME;
	var fParam				= App['const'].FUNCT_PARAM;
	var ref					= {};
	ref[svClass		] 		= "ServiceStatistic"; 
	ref[svName		]		= "SVStNew"; 
	ref[sessId		]		= App.data.session_id;
	
	if (App.data.user) uId = App.data.user.id; else  uId = -1;	
	ref['json_obj'	] 	= JSON.stringify({
							"uId" 		: uId,
							"entTyp"	: entTyp,							
							"entId"		: entId,
							"dt"		: reg_gl_DateStr_From_DateObj(new Date()),
							"time"		: 0,
							});
	
	var fSucces		= [];		
	fSucces.push(req_gl_funct(null, do_gl_statistic_period_check, [url, url_header, NetworkController, null, 0]));	
	NetworkController.do_lc_ajax(url, url_header, ref, 100000, fSucces, null);
}

var var_gl_statistic_time = 20000;
function do_gl_statistic_period_check (sharedJson, url, url_header, NetworkController, statisticId, time, ratio){
	if (!ratio) ratio=1;
	if (ratio>10) return;
	if(sharedJson[App['const'].SV_CODE]==App['const'].SV_CODE_API_YES){
		if (!statisticId){
			var data 	= sharedJson.res_data;
			statisticId	= data.id;
		}
		if (!statisticId) return;
		
		setTimeout(function(){
			do_gl_statistic_mod (url, url_header, NetworkController, statisticId, time+var_gl_statistic_time*ratio, ratio+1)
		}, var_gl_statistic_time*ratio);	
	} 
}

function do_gl_statistic_mod(url, url_header, NetworkController, statisticId, time, ratio) {
	var svClass 			= App['const'].SV_CLASS;
	var svName				= App['const'].SV_NAME;
	var sessId				= App['const'].SESS_ID;
	var fVar				= App['const'].FUNCT_SCOPE;
	var fName				= App['const'].FUNCT_NAME;
	var fParam				= App['const'].FUNCT_PARAM;
	var ref					= {};
	ref[svClass		] 		= "ServiceStatistic"; 
	ref[svName		]		= "SVStMod"; 
	ref[sessId		]		= App.data.session_id;
	
	if (App.data.user) uId = App.data.user.id; else  uId = -1;	
	ref['json_obj'	] 	= JSON.stringify({
							"uId" 		: uId,
							"id"		: statisticId,
							"time"		: time,
							});
	var fSucces		= [];		
	fSucces.push(req_gl_funct(null, do_gl_statistic_period_check, [url, url_header, NetworkController, statisticId, time, ratio]));	
	NetworkController.ajaxBackground(url, url_header, ref, 100000, fSucces, null);
}