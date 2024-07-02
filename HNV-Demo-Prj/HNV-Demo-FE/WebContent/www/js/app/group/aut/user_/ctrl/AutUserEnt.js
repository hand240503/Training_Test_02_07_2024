define([
        'jquery',
        'text!group/aut/user/tmpl/Aut_User_Ent.html'

        ],
        function($, 
        		AutUser_Ent) {


	var AutUserEnt     = function (header,content,footer, grpName) {
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

		var self 						= this;		
		//------------------------------------------------------------------------------------
		var pr_OBJ_TYPE				= 1000;// change to adapt with back office for lock tool
		
		var pr_SERVICE_CLASS		= "ServiceAutUser"; //to change by your need
				
		var pr_SV_GET				= "SVGet"; 
		var pr_SV_NEW				= "SVNew"; 
		var pr_SV_DEL				= "SVDel"; 
		
		var pr_SV_MOD				= "SVMod"; 	//if not use lock
				
		var pr_SV_LCK_REQ			= "SVLckReq"; 
		var pr_SV_LCK_END			= "SVLckEnd"; 
		var pr_SV_LCK_DEL			= "SVLckDel"; 
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;
		
	
		//-----------------------------------------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		var pr_lock					= null;
		
		var pr_new_obj_default		= {
				typ : 3,
				per : {
					typ01 : 100,
					typ02 : 0
				}
		}
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.AutUser.Main;
			pr_ctr_List 			= App.controller.AutUser.List;
			
			pr_ctr_Ent				= App.controller.AutUser.Ent;
			pr_ctr_EntHeader 		= App.controller.AutUser.EntHeader;
			pr_ctr_EntBtn 			= App.controller.AutUser.EntBtn;
			pr_ctr_EntTabs 			= App.controller.AutUser.EntTabs;
			
			
		}
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show		= function(obj, mode){			
			pr_obj 	= obj;
			pr_mode		= mode;
			
			tmplCtrl.do_lc_put_tmpl(tmplName.AUT_USER_ENT	, AutUser_Ent); 		
			
			if (pr_mode == App['const'].MODE_INIT){
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.AUT_USER_ENT, {mode : App['const'].MODE_INIT}));
				pr_ctr_EntBtn		.do_lc_show(obj, App['const'].MODE_INIT);
				return;
			}
			
			if (!obj){
				$(pr_divContent).html("");		
				pr_ctr_EntBtn		.do_lc_show(null, App['const'].MODE_INIT);
			}else{
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.AUT_USER_ENT, obj));				
				pr_ctr_EntHeader	.do_lc_show(pr_obj, pr_mode);
				pr_ctr_EntBtn		.do_lc_show(pr_obj, pr_mode);
				pr_ctr_EntTabs		.do_lc_show(pr_obj, pr_mode);
			}
			
			do_gl_enhance_within($(pr_divContent), {
				obj: pr_obj
			});
		}
		
		//--------------------------------------------------------------------------------------
		this.do_lc_style_pages= function(div, mode){
			if(mode == App['const'].MODE_NEW || mode == App['const'].MODE_MOD) {
				do_gl_enable_edit(div);
			} else {
				do_gl_disable_edit(div);
			}
		}
		
		//---show after ajax request---------------------------
		function do_show_Obj(sharedJson, mode, localObj){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
				if (localObj){
					self.do_lc_show(localObj, mode); 
				}else{					
					var object = sharedJson[App['const'].RES_DATA];
					localObj = object;
					self.do_lc_show(object, mode);  
				}
				App.data.mode = mode;
				
				var params = req_gl_Url_Params(App.data.url);
				if (params.uId || params.id){
					pr_ctr_List.do_lc_show_list_ById(localObj);
				}
        	} else {
        		do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
        	}		
		}
		
			
		this.do_lc_show_ById = function(obj, mode){
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_GET); 			
			ref["id"]		= JSON.stringify(obj.id);
			
			var fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_show_Obj, [mode]));	
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;			
		}
		
		//---------------------------------------------new object-------------------------------------------
		this.do_lc_new = function() {

			var newObj		 = $.extend(true, {}, pr_new_obj_default);		
			//action mode
			App.data.mode 	= App['const'].MODE_NEW;
			
			self		.do_lc_show(newObj, App.data.mode);
			pr_ctr_Ent	.do_lc_show(newObj, App.data.mode);
		}
		
		//---------------------------------------------clone object-------------------------------------------
		this.do_lc_duplicate = function (obj){
			var newObj 	= $.extend(true, {}, obj);
			newObj.id	= null;
			App.data.mode 	= App['const'].MODE_NEW;
			
			self		.do_lc_show(newObj, App.data.mode);
			pr_ctr_Ent	.do_lc_show(newObj, App.data.mode);
		}
			
		//---------del obj-----------------------------------------------------------------------------
		this.do_lc_delete 	= function (obj){
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_DEL);	
			ref.id				= obj.id;
			
			var lock 			= {};			
			lock.objectType 	= pr_OBJ_TYPE; 	//integer
			lock.objectKey 		= obj.id; 		//integer
			ref['lock'	]		= JSON.stringify(lock);
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg	, [null, null, App['const'].MODE_DEL])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj						, [App['const'].MODE_INIT]));	
			fSucces.push(req_gl_funct(null	, do_refresh_list					, [])); //refresh menu
		
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;			
		}
		this.do_lc_duplicate = function (obj){
			var newObj 	= $.extend(true,{},obj);
			newObj.id	= null;
			App.data.mode 	= App['const'].MODE_NEW;
			
			self		.do_lc_show(newObj, App.data.mode);
			pr_ctr_Ent	.do_lc_show(newObj, App.data.mode);	
		}
		
		//---------Lock-----------------------------------------------------------------------------
		this.do_lc_save		= function(obj, mode){	//save new object or save with lock	
			//to comeback on tab curent active
		    do_gl_req_tab_active($(pr_divContent));
		    if(!obj.files) obj.files = [];
			var data = req_gl_data({
				dataZoneDom : $(pr_divContent),
				exclSelector : ".noData",
				oldObject 		: {'files': obj.files},
			});
			
			//check data error
			if(data.hasError) {
				do_gl_show_Notify_Msg_Error ($.i18n('common_data_error_msg'));
			} else {
//				data.data.right = do_lc_modify_data(data);
				data.data = do_lc_check_right(data.data);
				
				if(obj.id)	data.data.id = obj.id;
				if(mode == App['const'].MODE_NEW){ 	
					do_send_new(data);
				}else if(mode == App['const'].MODE_MOD){
					//show msgbox for save and exit or save and continue
					App.MsgboxController.do_lc_show({
						title	: $.i18n("msgbox_confirm_title"),
						content : $.i18n("msgbox_confirm_common_msg"),
						buttons	: {
							SAVE_EXIT: {
								lab		: $.i18n("common_btn_save_exit"),
								funct	: do_send_mod_end,
								param	: [data]							
							},
							SAVE_CONTINUE: {
								lab		:  $.i18n("common_btn_save_continue"),
								funct	: do_send_mod_continue,
								param	: [data]	
							}
						}
					});	
				}else{
					//do_notify_error here
					return;
				}
			}	
		}
		var do_generate_cats = function(data){
			var dataGenerated=[];
			for(var o in data){
				if(data[o]==1){
					dataGenerated.push({"catId" : o})
				}
			}
			return dataGenerated;
		}
		
		var do_lc_check_right = function(data) {
			let roles = data.roles;
			
			let rights = roles.filter(role => role.r1 == 1 || role.r2 == 1 || role.r3 == 1 || role.r4 == 1 || role.r5 == 1);
			
			if(rights.length == 0) data.stat = "2" // waiting
				
			return 	data;
		}
		
		var do_lc_modify_data = function(data) {
			var data = data.data;
			var arr_role = {};
			if(data.right){
				for(var k in data.right){
					if(data.right[k] == 0)	delete data.right[k];
				}
				for(var k in data.right){
					var roleId = k.split(/_(.+)/)[0];
					var action = k.split(/_(.+)/)[1];	//r1,r2,r3,r4,r5
					var value  = data.right[k];
					if(arr_role[roleId]){
						if(!arr_role[roleId][action]){
							arr_role[roleId][action] = value;
						}
					}
					else{
						arr_role[roleId] = {[action] : value};
					}
				}
			}
			return arr_role;
		}
		//-------------------------------------------New-------------------------------------------------------------
		var do_send_new = function(data) {
			var ref			= {};
			ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);
			ref["forPublic"]= 0;
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg	, [null, null, App['const'].MODE_NEW])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj						, [App['const'].MODE_SEL]));
			fSucces.push(req_gl_funct(null	, do_refresh_list					, []));
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	
			
			data.data.pass 		= do_encryt_password(data.data.pass);
			
			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError,"obj");
		}
		
		//--------------------------------------------Lock End or continue--------------------------------------------------------
		//-------------------------------------------Mod-------------------------------------------------------------
		var do_send_mod_continue = function(data) {
			var ref 			= {};
			ref 				= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_MOD);
			ref['lock_id'] 		= pr_lock.id;
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg	, [null, null, App['const'].MODE_MOD])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj						, [App['const'].MODE_MOD]));
		
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	
			
			if(data.data.pass !== undefined) {
				data.data.pass = do_encryt_password(data.data.pass);
			}			
			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError,"obj");
		}
		
		var do_encryt_password = function(password) {
			return rq_gl_Crypto(password);
		}
		
		
		var do_send_mod_end = function(data) {
			var ref 		= {};
			ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_END);
			ref["lock_id"]	= pr_lock.id;

			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg	, [null, null, App['const'].MODE_MOD])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj						, [App['const'].MODE_SEL]));
		
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	
			
			if(data.data.pass !== undefined) {
				data.data.pass = do_encryt_password(data.data.pass);
			}
			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError,"obj");
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
			fSucces.push(req_gl_funct(null, do_del_lock, []									));	
			fSucces.push(req_gl_funct(null, do_show_Obj, [App['const'].MODE_SEL, obj]	));	
			
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

	return AutUserEnt;
});