define([
	'jquery',
	'text!template/per/contract/PerContract_Ent.html'

	],
	function($, 
			PerContract_Ent) {


	var PerContractEnt     = function (header,content,footer, grpName) {
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
		var pr_OBJ_TYPE				= 30001;// change to adapt with back office for lock tool

		var pr_SERVICE_CLASS		= "ServicePerContract"; //to change by your need

		var pr_SV_GET				= "SVPerContractGet"; 
		var pr_SV_NEW				= "SVPerContractNew"; 
		var pr_SV_DEL				= "SVPerContractDel"; 

		var pr_SV_MOD				= "SVPerContractMod"; 	//if not use lock

		var pr_SV_LCK_REQ			= "SVPerContractLckReq"; 
		var pr_SV_LCK_SAV			= "SVPerContractLckSav"; 
		var pr_SV_LCK_END			= "SVPerContractLckEnd"; 
		var pr_SV_LCK_DEL			= "SVPerContractLckDel"; 
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;


		//-----------------------------------------------------------------------------------
		var pr_prev_object			= null;
		var pr_obj					= null;
		var pr_mode					= null;
		var pr_lock					= null;
		//-----------------------------------------------------------------------------------
		var pr_typ_new				= null;
		var pr_typ_new_exit			= 1;
		var pr_typ_new_continue		= 2;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.PerContract.Main;
			pr_ctr_List 			= App.controller.PerContract.List;

			pr_ctr_Ent				= App.controller.PerContract.Ent;
			pr_ctr_EntHeader 		= App.controller.PerContract.EntHeader;
			pr_ctr_EntBtn 			= App.controller.PerContract.EntBtn;
			pr_ctr_EntTabs 			= App.controller.PerContract.EntTabs;


		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show		= function(obj, mode){			
//			if(pr_prev_object){
//				obj 			= $.extend(true, {}, pr_prev_object);
//				pr_prev_object	= null;
//			}
			pr_obj			= obj;
			pr_mode				= mode;

			tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_ENT	, PerContract_Ent); 	
			$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_ENT, {}));
			
			if (!obj){
				obj = {};
				pr_ctr_EntBtn		.do_lc_show({}, App['const'].MODE_INIT);
			}else{
				pr_ctr_EntHeader	.do_lc_show(pr_obj, pr_mode);
				pr_ctr_EntBtn		.do_lc_show(pr_obj, pr_mode);
				pr_ctr_EntTabs		.do_lc_show(pr_obj, pr_mode);
			}	

			do_gl_enhance_within($(pr_divContent), {
				obj: pr_obj
			});

			if(mode == App['const'].MODE_NEW || mode == App['const'].MODE_MOD) {
				do_gl_enable_edit($(pr_divContent));
				if(mode == App['const'].MODE_NEW)
					pr_lock = {};
			} else {
				do_gl_disable_edit($(pr_divContent));
			}
		}

		//---show after ajax request---------------------------
		function do_show_Obj(sharedJson, mode, localObj){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
				if(localObj){//le cas de calcel action object
					self.do_lc_show(localObj, mode); 
				}else{					
					var cont = sharedJson[App['const'].RES_DATA];
					if(cont == null && mode !=App['const'].MODE_INIT ){
						cont = {} ;//le cas de delete object
					}
					var lock = sharedJson.lock;
					if(lock != null)	pr_lock = lock;
					self.do_lc_show(cont, mode);
				}
				App.data.mode = mode;
			} else {
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
			}			
		}


		this.do_lc_show_ById = function(objId, mode){
			var svName 		= pr_SV_GET;
			if (pr_mode == App['const'].MODE_MOD){
				//not use lock
				svName = pr_SV_GET

				//use lock
				//svName = pr_SV_LCK_REQ
			}

			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_GET); 			
			ref.id			= objId;

			var fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_show_Obj, [mode]));	

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;			
		}

		//---------------------------------------------new object-------------------------------------------
		this.do_lc_new = function() {

			var newObj				= {};
			newObj.order			= {};
			newObj.order.details	= [];
			//action mode
			App.data.mode 	= App['const'].MODE_NEW;

			self		.do_lc_show(newObj, App.data.mode);
		}

		//---------------------------------------------clone object-------------------------------------------
		this.do_lc_duplicate = function (obj){
			var newObj 	= $.extend(true, {}, obj);
			newObj.id	= null;
			newObj.dt01	= null;
			newObj.dt02	= null;
			if(!newObj.order)
				newObj.order	= {};
			else 
				newObj.order.id = null;
			
			if(!newObj.order.details)
				newObj.order.details	= [];
			else{
				for(var i=0; i<newObj.order.details.length; i++){
					newObj.order.details[i].id = null;
				}
			}

			App.data.mode 	= App['const'].MODE_NEW;

			self		.do_lc_show(newObj, App.data.mode);
			pr_prev_object 	= $.extend(true, {}, obj);
		}

		//---------del obj-----------------------------------------------------------------------------
		this.do_lc_delete 	= function (obj){
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_DEL);	
			ref.id			= obj.id;

			var lock 		= {};			
			lock.objectType = pr_OBJ_TYPE; 	//integer
			lock.objectKey 	= obj.id; 		//integer
			ref['lock'	]	= JSON.stringify(lock);

			var fSucces			= [];
			fSucces.push(req_gl_funct(App			, do_gl_show_Notify_Msg	, [null, null, App['const'].MODE_DEL]));
			fSucces.push(req_gl_funct(null			, do_show_Obj						, [App['const'].MODE_INIT]));	
			fSucces.push(req_gl_funct(pr_ctr_List	, pr_ctr_List.do_lc_refresh			, []));	

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;			
		}

		//---------Lock-----------------------------------------------------------------------------
		this.do_lc_save		= function(obj, mode){	//save new object or save with lock		
			//to comeback on tab curent active
			do_gl_req_tab_active($(pr_divContent));
			
			var ent	= pr_ctr_EntHeader.do_lc_save(obj, mode);
			var ord	= pr_ctr_EntTabs.do_lc_save(obj, mode);

			if(ent.hasError || ord.hasError) {
				do_gl_show_Notify_Msg_Error ($.i18n('common_error_msg'));
				return false;
			}
			
			var content = ord.data.content;
			ent.data = $.extend(true, {}, ent.data, content);
			
			ent.data.order		= ord.data;
			
			App.MsgboxController.do_lc_show({
				title	: $.i18n("msgbox_confirm_title"),
				content : $.i18n("msgbox_confirm_common_msg"),
				buttons	: {
					SAVE_EXIT: {
						lab		: $.i18n("common_btn_save_exit"),
						funct	: function(){
							if(mode==App['const'].MODE_MOD){
								do_send_lock_end(ent)
							} else if(mode==App['const'].MODE_NEW){
								pr_typ_new	= pr_typ_new_exit;
								do_send_new(ent, pr_typ_new);	
							}
						}
					},
					SAVE_CONTINUE: {
						lab		:  $.i18n("common_btn_save_continue"),
						funct	: function() {
							if(mode==App['const'].MODE_MOD){
								do_send_mod(ent);
							} else if(mode==App['const'].MODE_NEW){
								pr_typ_new	= pr_typ_new_continue;
								do_send_new(ent, pr_typ_new);	
							}
						}
					}
				}
			});	
		}
		
		//-------------------------------------------New-------------------------------------------------------------
		var do_send_new = function(data, typ) {
			var mode			= null;
			if(typ == pr_typ_new_exit){
				mode = App['const'].MODE_SEL;
			} else if(typ == pr_typ_new_continue){
				mode = App['const'].MODE_MOD;
			}

			var ref				= {};
			ref 				= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);	
			ref["lock"]			= typ;

			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg	, [null, null, App['const'].MODE_NEW]));
			fSucces.push(req_gl_funct(null	, do_show_Obj						, [mode]));
			fSucces.push(req_gl_funct(null	, do_refresh_list					, []));

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}
		
		//-------------------------------------------Mod-------------------------------------------------------------
		var do_send_mod = function(data) {
			var ref 	= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_MOD);

			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg	, [null, null, App['const'].MODE_MOD]));
			fSucces.push(req_gl_funct(null, do_show_Obj		, [App['const'].MODE_MOD]));

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}

		//--------------------------------------------Lock End--------------------------------------------------------
		var do_send_lock_end = function(data) {
			var ref 			= {};
			ref 				= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_END);
			ref["lock_id"]		= pr_lock.id;

			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg	, [null, null, App['const'].MODE_MOD]));
			fSucces.push(req_gl_funct(null	, do_show_Obj						, [App['const'].MODE_SEL]));
			fSucces.push(req_gl_funct(null	, do_refresh_list					, []));

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}

		//-------------------------------------------------------------------------------------------------------------		
		this.do_lc_Lock_Begin = function (obj){
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_REQ);		

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
			
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_DEL);		
			ref['lock_id'	]	= pr_lock.id; 

			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_del_lock, [obj]	));	

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

				pr_ctr_EntBtn.do_lc_show(obj, App.data.mode);
				self.do_lc_show			(obj, App.data.mode);

//				pr_prev_object 		= $.extend(true, {}, obj);
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
				do_gl_show_Notify_Msg_Error ($.i18n('lock_err_inconnu') );
			}

			App.data.mode 	= App['const'].MODE_SEL;				
			self.do_lc_show			(obj, App.data.mode);	
		}

		this.can_lc_have_lock = function (){
			if (this.pr_lock!=null)
				App.MsgboxController.do_lc_show({
					title	: $.i18n('lock_err_title') ,
					content	: $.i18n('lock_err_msg')
				});	
			return this.pr_lock!=null;
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

	return PerContractEnt;
});