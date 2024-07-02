define([
	'jquery',
	'text!template/shp/per/common/Per_Ent.html'
	],
	function($, 
			Per_Ent) {

	var PerPartnerEnt     = function (header,content,footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;

		//------------------------------------------------------------------------------------
		var tmplName				= App.template.names;
		var tmplCtrl				= App.template.controller;

		var svClass 				= App['const'].SV_CLASS;
		var svName					= App['const'].SV_NAME;
		var sessId					= App['const'].SESS_ID;
		var userId          		= App['const'].USER_ID;

		var fVar					= App['const'].FUNCT_SCOPE;
		var fName					= App['const'].FUNCT_NAME;
		var fParam					= App['const'].FUNCT_PARAM;		

		var self 					= this;		
		//------------------------------------------------------------------------------------
		var pr_OBJ_TYPE				= 30000;

		var pr_SERVICE_CLASS		= "ServicePerPerson";

		var pr_SV_GET				= "SVPersonGet"; 
		var pr_SV_NEW				= "SVPersonNew"; 
		var pr_SV_DEL				= "SVPersonDel"; 

		var pr_SV_MOD				= "SVPersonMod"; 	//if not use lock

		var pr_SV_LCK_REQ			= "SVPersonLckReq";
		var pr_SV_LCK_END			= "SVPersonLckEnd";
		var pr_SV_LCK_DEL			= "SVPersonLckDel";
		
		var pr_SV_VALIDATE			= "SVPersonValidate";
		
		var use_lock				= false;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;
		var pr_ctr_List				= null;
		//-----------------------------------------------------------------------------------
		var pr_typ_new				= null;
		var pr_typ_new_exit			= 1;
		var pr_typ_new_continue		= 2;
		
		var typePartnerNew		    = 3;
		
		var typePartnerClient		= 1010002;
		var typePartnerProspect		= 1010007;
		
		var typePartnerSupplier		= 1010003;
		var typePartnerProducer		= 1010004;
		var typePartnerDoctor		= 1010005;
		var typePartnerThirdparty	= 1010006;
		
		var typePersonMoral			= 1000001;
		var typePersonNatural		= 1000002;
		//-----------------------------------------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		var pr_lock					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.Per.Main;
			pr_ctr_List				= App.controller.Per.List;
			pr_ctr_Ent				= App.controller.Per.Ent;
			pr_ctr_EntHeader 		= App.controller.Per.EntHeader;
			pr_ctr_EntBtn 			= App.controller.Per.EntBtn;
			pr_ctr_EntTabs 			= App.controller.Per.EntTabs;
			
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_ENT	, Per_Ent);
		}

		//---------SHOW LIST PARTNER / SHOW PARTNER BY ID-------------------------------
		this.do_lc_show		= function(obj, mode, typePartner){			
			pr_obj 	= obj;
			pr_mode		= mode;
			App.data.mode = mode;
			 		
			$("#div_Per_Ent"	).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_ENT, {}));
			if (pr_mode == App['const'].MODE_INIT){
				$("#div_Per_Ent_Header"	).html("");
				$("#div_Per_Ent_Tabs"	).html("");
				pr_ctr_EntBtn		.do_lc_show({}, App['const'].MODE_INIT);
				return;
			}
			if (!obj){
				pr_ctr_EntBtn		.do_lc_show({}, App['const'].MODE_INIT);
			}else{
				pr_ctr_EntHeader	.do_lc_show(obj, mode, typePartner);
				pr_ctr_EntBtn		.do_lc_show(obj, mode, typePartner);
				pr_ctr_EntTabs		.do_lc_show(obj, mode, typePartner);
			}
			
			do_gl_enhance_within($(pr_divContent), {
				obj: pr_obj
			});
			
			if(mode == App['const'].MODE_NEW || mode == App['const'].MODE_MOD) {
				do_gl_enable_edit($(pr_divContent), ".objData", mode);
			} else {
				do_gl_disable_edit($(pr_divContent));
			}
		}
		
		this.do_lc_show_ById = function(objId, mode){
			var svName 		= pr_SV_GET;
			if (pr_mode == App['const'].MODE_MOD){
				if(use_lock){
					svName = pr_SV_LCK_REQ;
				}
			}
			var ref 		= req_gl_Request_Content_Send(svName);			
			ref["id"]		= objId;
			ref["forced"]	= true;

			var fSucces		= [];	
			fSucces.push(req_gl_funct(null, do_show_partner, [mode]));	

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;			
		}
		
		var pr_INFO_TYP_01_ADDR 		= 1;
		var pr_INFO_TYP_01_BANK 		= 2;
		var pr_INFO_TYP_01_OBSERVATION 	= 3;
		
		function do_show_partner(sharedJson, mode, localObj, objMod, oldObject){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				if(localObj){//le cas de cancel action object
					self.do_lc_show(localObj, mode); 
				}else{					
					var per = sharedJson[App['const'].RES_DATA];
					if(per == null){
						per = {};
					}
					
					var lock = sharedJson.lock;
					if(lock != null)	pr_lock = lock;
					//--tach tpyInfos => tpyAddr va tpyBank
					per.tpyAddr = [];
					per.tpyBank = [];
					per.tpyObser = [];
					if (per.tpyInfos){
						for (i in per.tpyInfos){
							if (per.tpyInfos[i].typ01 == pr_INFO_TYP_01_ADDR){
								per.tpyAddr.push(per.tpyInfos[i]);
							}else if (per.tpyInfos[i].typ01 == pr_INFO_TYP_01_BANK){
								per.tpyBank.push(per.tpyInfos[i]);
							}else if (per.tpyInfos[i].typ01 == pr_INFO_TYP_01_OBSERVATION){
								per.tpyObser.push(per.tpyInfos[i]);
							}
						}
					}
					self.do_lc_show(per, mode);
				}			     		
			} else {
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}
		}

		//---------Save: Send request to server----------------------------------
		this.do_lc_save		= function(obj, mode){	//save new object or save with lock		
			//to comeback on tab curent active
		    do_gl_req_tab_active($(pr_divContent));
		    
		    if(!obj.files) obj.files = [];
		    var	per 				= req_gl_data({
					dataZoneDom		: $("#div_Per_Ent"),
					oldObject 		: {"files": obj.files},
					removeDeleted	: true				
				});
		    
			if(per.hasError == true){
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_entity_save'));
				return false;
			}
			per.data.tpyInfos	= per.data.tpyAddr.concat(per.data.tpyBank);
			if(per.data.tpyObser)
				per.data.tpyInfos	= per.data.tpyInfos.concat(per.data.tpyObser);
			
			per.data.files		= obj.files;
			if (!per.data.files && per.data.logo) 	per.data.files = [];
			if (per.data.files && per.data.logo) 	per.data.files.push(per.data.logo);
			
			App.MsgboxController.do_lc_show({
				title	: $.i18n("msgbox_confirm_title"),
				content : $.i18n("common_msg_mod_confirm"),
				buttons	: {
					SAVE_EXIT: {
						lab		: $.i18n("common_btn_save_exit"),
						funct	: function(){
							if(mode==App['const'].MODE_MOD){
								do_send_lock_end(per)
							} else if(mode==App['const'].MODE_NEW){
								pr_typ_new	= pr_typ_new_exit;
								do_send_new(per, pr_typ_new);	
							}
						}
					},
					SAVE_CONTINUE: {
						lab		:  $.i18n("common_btn_save_continue"),
						funct	: function() {
							if(mode==App['const'].MODE_MOD){
								do_send_mod(per);
							} else if(mode==App['const'].MODE_NEW){
								pr_typ_new	= pr_typ_new_continue;
								do_send_new(per, pr_typ_new);	
							}
						}
					}
				}
			});	
		}
		//-------------------------------------------New-------------------------------------------------------------
		var do_send_new = function(per, typ) {
			var mode			= null;
			if(typ == pr_typ_new_exit){
				mode = App['const'].MODE_SEL;
			} else if(typ == pr_typ_new_continue){
				mode = App['const'].MODE_MOD;
			}
			
			var ref				= {};
			ref 				= req_gl_Request_Content_Send(pr_SV_NEW);
			ref["lock"]			= typ;

			var fSucces			= [];
			
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg	, [null, null, App['const'].MODE_NEW])); 
			fSucces.push(req_gl_funct(null	, do_show_partner					, [mode]));
			fSucces.push(req_gl_funct(null	, do_refresh_list					, []));

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);

			per.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}
		//-------------------------------------------Mod-------------------------------------------------------------
		var do_send_mod = function(per) {
			var ref 		= {};
			ref 			= req_gl_Request_Content_Send(pr_SV_MOD);

			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg	, [null, null, App['const'].MODE_MOD])); 
			fSucces.push(req_gl_funct(null	, do_show_partner					, [App['const'].MODE_MOD]));
			fSucces.push(req_gl_funct(null	, do_refresh_list					, []));

			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax")]);	

			per.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}
		//--------------------------------------------Lock End--------------------------------------------------------
		var do_send_lock_end = function(per) {
			var ref 			= {};
			ref 				= req_gl_Request_Content_Send(pr_SV_LCK_END);
			ref['lock_id'] 		= pr_lock.id;
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg	, [null, null, App['const'].MODE_MOD])); 
			fSucces.push(req_gl_funct(null	, do_show_partner					, [App['const'].MODE_SEL]));
			fSucces.push(req_gl_funct(null	, do_refresh_list					, []));

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

			per.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}
		//----------------LOCK-------------------------------------------------------------------------------	
		this.do_lc_Lock_Begin = function (obj){
			var ref 			= req_gl_Request_Content_Send(pr_SV_LCK_REQ);
			var lock 			= {};			
			lock.objectType 	= pr_OBJ_TYPE; 	//integer
			lock.objectKey 		= obj.id; 		//integer
			ref['req_data'	]	= JSON.stringify(lock); 
			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_begin_lock, [obj]));
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}

		this.do_lc_Lock_Cancel = function (obj){
			if (!pr_lock){
				App.data.mode = App['const'].MODE_INIT;
				do_lc_show ({}, App.data.mode);
				return;
			}
			
			var ref 			= req_gl_Request_Content_Send(pr_SV_LCK_DEL);
			ref['lock_id'	]	= pr_lock.id;
			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_del_lock		, [obj]));	

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
		
		//---------------------------------------------------------------------------------------------
		//VALIDATE PARTNER----VALIDATE PARTNER-----VALIDATE PARTNER-----VALIDATE PARTNER-----VALIDATE P
		//---------------------------------------------------------------------------------------------
		
		this.do_validate_partner = function(objId, stat){
			var ref 	= req_gl_Request_Content_Send(pr_SV_VALIDATE);
			ref["objId"]	= objId;
			ref["stat"]		= stat;
			var fSucces		= [];
			fSucces.push	( req_gl_funct(this, do_callback_validate, [true, stat] ));
			var fError 		= req_gl_funct(this, do_callback_validate,[false, stat]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		var do_callback_validate = function(sharedJson, ajaxStat, stat){
			if(!ajaxStat){
				do_gl_show_Notify_Msg_Error($.i18n("common_err_ajax"));
				return;
			}
			var code = sharedJson[App['const'].SV_CODE];
			if(code == App['const'].SV_CODE_API_YES) {
				var per = sharedJson.res_data;
				do_gl_show_Notify_Msg_Success($.i18n("Operation OK"));
				self.do_lc_show(per, App['const'].MODE_SEL);
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("Error update order status: SV Code:" + code));
			}
		}
		

		//---------private lock-----------------------------------------------------------------------------
		function do_begin_lock(sharedJson, obj){
			//to comeback on tab curent active
		    do_gl_req_tab_active($(pr_divContent));
		    
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
				pr_lock 		= sharedJson[App['const'].RES_DATA];   
				App.data.mode 	= App['const'].MODE_MOD;				
				self			.do_lc_show(obj, App.data.mode);
			} else if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_NO) {
				pr_lock 	= null;
				var uName 	= " " + sharedJson[App['const'].RES_DATA].userName;
				do_gl_show_Notify_Msg_Error ($.i18n('lock_err_begin') + uName);
			}else{
				pr_lock = null;
				do_gl_show_Notify_Msg_Error ($.i18n('lock_err_inconnu'));
				//notify something if the lock is taken by other person
				//show lock.information
			}		
		}

		function do_del_lock(sharedJson, obj){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
				pr_lock = null;				
			} else {   
				pr_lock = null;
				//notify something
				do_gl_show_Notify_Msg_Error ($.i18n('lock_err_inconnu') );
			}

			App.data.mode 	= App['const'].MODE_SEL;				

			pr_ctr_EntBtn.do_lc_show(obj, App.data.mode);
			self.do_lc_show			(obj, App.data.mode);
		}

		this.do_lc_delete 	= function (obj){
			var ref 		= req_gl_Request_Content_Send(pr_SV_DEL);

			var lock 			= {};			
			lock.objectType 	= pr_OBJ_TYPE; 	//integer
			lock.objectKey 		= obj.id; 		//integer
			ref['lock'	]		= JSON.stringify(lock);
			ref["id"]			= obj.id;

			var fSucces		= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg	, [null, null, App['const'].MODE_DEL])); 
			fSucces.push(req_gl_funct(null	, do_show_partner					, [App['const'].MODE_INIT]));	
			fSucces.push(req_gl_funct(null	, do_refresh_list					, [obj]));

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;			
		}
		//-----------------------------------------------------------------------------------------
		function do_refresh_list (sharedJSon, localObj) {
			if(sharedJSon[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				var per = sharedJSon[App['const'].RES_DATA];
				var typPartner = per!= null? per.typ02 : localObj.typ02;
				pr_ctr_List.do_lc_show(typPartner);
				pr_ctr_List.do_lc_show(typePartnerNew, typePersonMoral, null, typePartnerSupplier+","+typePartnerThirdparty+ ","+typePartnerProducer );
			}
		}
		
		function req_gl_Request_Content_Send(serviceName){
			var ref 		= {};
			ref[svClass] 	= pr_SERVICE_CLASS; 
			ref[svName]		= serviceName;
			ref[userId]		= App.data.user.id;
			ref[sessId]		= App.data.session_id;
			return ref;
		}
	}
	
	return PerPartnerEnt;
});