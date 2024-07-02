define([
	'jquery',
	'text!template/shp/per/common/Per_Ent.html'

	],
	function($, 
			Per_Ent) {


	var PerEnt     = function (header,content,footer, grpName) {
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
		var pr_OBJ_TYPE				= 100;

		var pr_SERVICE_CLASS		= "ServicePerPerson";

		var pr_SV_GET				= "SVPersonGet"; 
		var pr_SV_NEW				= "SVPersonNew"; 
		var pr_SV_DEL				= "SVPersonDel"; 

		var pr_SV_MOD				= "SVPersonMod"; 	//if not use lock

		var pr_SV_LCK_REQ			= "SVPersonLckReq";
		var pr_SV_LCK_END			= "SVPersonLckEnd";
		var pr_SV_LCK_DEL			= "SVPersonLckDel";
		
		var use_lock				= false;
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;
		var pr_ctr_List				= null;

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
		}

		//---------SHOW LIST PARTNER / SHOW PARTNER BY ID-------------------------------
		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;

			tmplCtrl.do_lc_put_tmpl(tmplName.PER_ENT	, Per_Ent); 		
			$("#div_Per_Ent"	).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_ENT, {}));
			if (pr_mode == App['const'].MODE_INIT || !obj){
				$("#div_Per_Ent_Header"	).html("");
				$("#div_Per_Ent_Tabs"	).html("");
				pr_ctr_EntBtn		.do_lc_show({}, App['const'].MODE_INIT);
				do_gl_enhance_within($(pr_divContent), {
					obj: pr_obj
				});
				return;
			}
			else
			{
				pr_ctr_EntHeader	.do_lc_show(pr_obj, pr_mode);
				pr_ctr_EntBtn		.do_lc_show(pr_obj, pr_mode);
				pr_ctr_EntTabs		.do_lc_show(pr_obj, pr_mode);
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

			var fSucces		= [];	
			fSucces.push(req_gl_funct(null, do_show_societe, [mode]));	

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;			
		}
		
		const pr_INFO_TYP_01_ADDR 			= 1;
		const pr_INFO_TYP_01_BANK 			= 2;
		const pr_INFO_TYP_01_RESERVATION    = 6;
		function do_show_societe(sharedJson, mode, localObj, objMod, oldObject){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				if(localObj){//le cas de cancel action object
					self.do_lc_show(localObj, mode); 
				}else{
					
					var per = sharedJson[App['const'].RES_DATA];
					if(per == null){
						per = {};
					}
					//--tach tpyInfos => tpyAddr va tpyBank
					per.tpyAddr = [];
					per.tpyBank = [];
					per.tpyReservation = [];
					if (!per.tpyInfos){
						per.tpyInfos = [];
					}
					for (i in per.tpyInfos){
						if (per.tpyInfos[i].typ01 == pr_INFO_TYP_01_ADDR){
							per.tpyAddr.push(per.tpyInfos[i]);
						}else if (per.tpyInfos[i].typ01 == pr_INFO_TYP_01_BANK){
							per.tpyBank.push(per.tpyInfos[i]);
						}else if (per.tpyInfos[i].typ01 == pr_INFO_TYP_01_RESERVATION){
							per.tpyReservation.push(per.tpyInfos[i]);
						}
					}
					
					if (pr_mode == App['const'].MODE_NEW || pr_mode == App['const'].MODE_MOD){
						var typePartner = per.typ02;
						pr_ctr_List.do_lc_show(typePartner);
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
			var per 			= req_gl_data({
				dataZoneDom		: $("#div_Per_Ent"),
				oldObject 		: {"files": obj.files},
				removeDeleted	: true	
			});
			if(per.hasError == true){
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_entity_save'));
				return false;
			}
			per.data.typ02 = 1010011;//cong ty con
			
			//tpy information for reservation
			do_format_tpy_infos_reservation_for_save(per.data);
			
			per.data.tpyInfos	= per.data.tpyAddr.concat(per.data.tpyBank, per.data.tpyReservation);
			
			per.data.files		= obj.files;
			if (!per.data.files && per.data.logo) 	per.data.files = [];
			if (per.data.files && per.data.logo) 	per.data.files.push(per.data.logo);
			
			if(mode==App['const'].MODE_NEW){
				do_send_ajax(per, pr_SV_NEW, mode);
			}else if(mode==App['const'].MODE_MOD){
				//show msgbox for save and exit or save and continue
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("common_msg_mod_confirm"),
					buttons	: {
						SAVE_EXIT: {
							lab		: $.i18n("common_btn_save_exit"),
							funct	: do_send_lock_end,
							param	: [per]							
						},
						SAVE_CONTINUE: {
							lab		:  $.i18n("common_btn_save_continue"),
							funct	: do_send_ajax,
							param	: [per, pr_SV_MOD, mode]	
						}
					}
				});	
			}else{
				do_gl_show_Notify_Msg_Error($.i18n("common_notify_unknown"));
				return;
			}
		}
		
		var do_format_tpy_infos_reservation_for_save = function(obj){
			if(obj.tpyReservation){
				if(obj.tpyReservation.length > 0){
					let items = obj.tpyReservation;
					for(let i = 0; i < items.length; i++){
						items[i].info02 = do_format_string_to_time(items[i].info02);
						items[i].info03 = do_format_string_to_time(items[i].info03);
						items[i].info01 = JSON.stringify({"q01": items[i].info05, "dt01": items[i].info02, "dt02": items[i].info03});
					}
					
					obj.tpyReservation = items;
				}
			}
		}
		
		var do_format_string_to_time = function(str){
			  let normalized      	= str.replace(/[^a-zA-Z0-9]/g, ':');
			  let timeItems       	= normalized.split(':');
		
			  let hour    	= timeItems[0]? timeItems[0] : '00';
			  let minute  	= timeItems[1]? timeItems[1] : '00';
			  let second  	= timeItems[2]? timeItems[2] : '00' ;
		
			  return time = hour + ":" + minute + ":" + second;
		}
		
		function do_send_ajax(per, pr_service, mode) {
			var ref				= req_gl_Request_Content_Send(pr_service);

			App.data.mode		= App['const'].MODE_SEL;
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg	, [null, null, mode])); 
			if(mode==App['const'].MODE_NEW)
				fSucces.push(req_gl_funct(null, do_show_societe	, [App['const'].MODE_SEL]));
			else if(mode==App['const'].MODE_MOD)
				fSucces.push(req_gl_funct(null, do_show_societe	, [App['const'].MODE_MOD]));
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	
			
			per.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}
		
		function req_gl_Request_Content_Send(serviceName){
			var ref 		= {};
			ref[svClass] 	= pr_SERVICE_CLASS; 
			ref[svName]		= serviceName;
			ref[userId]		= App.data.user.id;
			ref[sessId]		= App.data.session_id;
			return ref;
		}
		
		//--------------------------------------------Lock End--------------------------------------------------------
		var do_send_lock_end = function(per) {
			var ref 		= {};
			ref 			= req_gl_Request_Content_Send(pr_SV_LCK_END);
			ref['lock_id'] 	= pr_lock.id;
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg	, [null, null, App['const'].MODE_MOD])); 
			fSucces.push(req_gl_funct(null, do_show_societe	, [App['const'].MODE_SEL]));
//			fSucces.push(req_gl_funct(null, do_refresh_list		, []));

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
			fSucces.push(req_gl_funct(null, do_del_lock		, []));	
			fSucces.push(req_gl_funct(null, do_show_societe, [App['const'].MODE_SEL, obj]	));	

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}	

		//---------private lock-----------------------------------------------------------------------------
		function do_begin_lock(sharedJson, obj){
			//to comeback on tab curent active
		    do_gl_req_tab_active($(pr_divContent));
		    
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
				pr_lock 		= sharedJson[App['const'].RES_DATA];   
				App.data.mode 	= App['const'].MODE_MOD;				
				pr_ctr_EntBtn	.do_lc_show(obj, App.data.mode);
				self			.do_lc_show(obj, App.data.mode);
				do_Enabled_Edit();
			} else if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_NO) {
				pr_lock 	= null;
				var uName 	= sharedJson[App['const'].RES_DATA].username;
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

		this.can_lc_have_lock = function (){
			if (this.pr_lock!=null)
				App.msgBox.show({
					title	: $.i18n('lock_err_title') ,
					content	: $.i18n('lock_err_msg')
				});	
			return this.pr_lock!=null;
		}

		var do_Enabled_Edit = function(){
			$("#div_frm_per_header").find("input, select, textarea").removeAttr("disabled");
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
			fSucces.push(req_gl_funct(null, doAfterDelete, obj));	

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;			
		}
		
		function doAfterDelete(sharedJson, obj){
			self.do_lc_show({}, App['const'].MODE_INIT);
			pr_ctr_List.do_lc_show(obj.typ02);			
		}
		//-----------------------------------------------------------------------------------------
		function do_refresh_list (sharedJSon) {
			if(sharedJSon[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				pr_ctr_List.do_lc_show();
			}
		}
		
		function do_show_success_msg(sharedJson, msg){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) do_gl_show_Notify_Msg_Success (msg);
		}
	}
	
	return PerEnt;
});