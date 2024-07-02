define([
        'jquery',
        'text!group/aut/role/tmpl/Ent.html',
        
        'group/aut/role/ctrl/EntBtn',
        'group/aut/role/ctrl/EntHeader',
        'group/aut/role/ctrl/EntTabs',       
        

        ],
        function($, 
        		Tmpl_Ent,
        		
        		CtrlEntBtn, 
        		CtrlEntHeader, 
        		CtrlEntTabs
        		
        ) {


	var CtrlEnt     = function (header,content,footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName;
		//------------------------------------------------------------------------------------
		var tmplName				= App.template.names[pr_grpName];
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
		var pr_OBJ_TYPE				= 1002;// change to adapt with back office for lock tool
		
		var pr_SERVICE_CLASS		= "ServiceAutRole"; //to change by your need
				
		var pr_SV_GET				= "SVGet"; 
		var pr_SV_NEW				= "SVNew"; 
		var pr_SV_DEL				= "SVDel"; 
		
		var pr_SV_MOD				= "SVMod"; 	//if not use lock
				
		var pr_SV_LCK_REQ			= "SVLckReq"; 
		var pr_SV_LCK_SAV			= "SVLckSav";
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
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			//----step 01: load template-----------------------------------------------------------
			tmplName.ENT			= "Ent";
			tmplCtrl.do_lc_put_tmpl(tmplName.ENT	, Tmpl_Ent); 	
			
			//----step 02: load controller------------------------------------------------------------------------------------
			if (!App.controller[pr_grpName].EntBtn		)  
				 App.controller[pr_grpName].EntBtn		= new CtrlEntBtn		(null, "#div_Ent_Btn" 		, null, pr_grpName);
			if (!App.controller[pr_grpName].EntHeader	)  
				 App.controller[pr_grpName].EntHeader	= new CtrlEntHeader		(null, "#div_Ent_Header" 	, null, pr_grpName);
			if (!App.controller[pr_grpName].EntTabs		)  
				 App.controller[pr_grpName].EntTabs		= new CtrlEntTabs		(null, "#div_Ent_Tabs" 		, null, pr_grpName);
			
			pr_ctr_Main 			= App.controller[pr_grpName].Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;
			
			pr_ctr_Ent				= App.controller[pr_grpName].Ent;
			pr_ctr_EntHeader 		= App.controller[pr_grpName].EntHeader;
			pr_ctr_EntBtn 			= App.controller[pr_grpName].EntBtn;
			pr_ctr_EntTabs 			= App.controller[pr_grpName].EntTabs;
			
			pr_ctr_EntBtn			.do_lc_init();
			pr_ctr_EntHeader		.do_lc_init();
			pr_ctr_EntTabs			.do_lc_init();
		}
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show		= function(obj, mode){			
			pr_obj 			= obj?obj:{};
			pr_mode			= (!pr_obj||!mode)?App['const'].MODE_INIT: mode;
			App.data.mode 	= pr_mode;

			if (pr_mode == App['const'].MODE_INIT){
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT, {mode : App['const'].MODE_INIT}));
				pr_ctr_EntBtn		.do_lc_show(obj, App['const'].MODE_INIT);
				return;
			}
			
			$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT, obj));				
			pr_ctr_EntHeader	.do_lc_show(pr_obj, pr_mode);
			pr_ctr_EntBtn		.do_lc_show(pr_obj, pr_mode);
			pr_ctr_EntTabs		.do_lc_show(pr_obj, pr_mode);
			
			if(mode == App['const'].MODE_NEW) {
				
			} else if(mode == App['const'].MODE_MOD) {
				do_gl_enable_edit($(pr_divContent));
			} else {
				do_gl_disable_edit($(pr_divContent));
			}
			
			//-------------------------------------------------------------
			App.controller.DBoard.DBoardMain.do_lc_bind_event_div_Minimize();
			App.controller.DBoard.DBoardMain.do_lc_prevent_winClosing (pr_mode);
			
			do_gl_enhance_within($(pr_divContent));
		}
		
		//---show after ajax request---------------------------
		var do_show_Obj = function (sharedJson, mode, oldObj, langOpt){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
				var object 			= sharedJson[App['const'].RES_DATA];   
				
				if (!object) object = oldObj; //--use in case of  canceling the MOD
				else if (object.rights){
					object.rights = JSON.parse(object.rights);
					do_update_users_rights(object);
				}
				
				self.do_lc_show(object, mode);  
					
			} else if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_ERROR){
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
				return;
			}		
		}
		
		this.do_lc_show_ById = function(obj, mode){
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_GET); 			
			ref.id			= obj.id;
			
			var fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_show_Obj, [mode]));	
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;			
		}
		
		//---------------------------------------------new object-------------------------------------------
		this.do_lc_new = function() {
			self		.do_lc_show({}, App['const'].MODE_NEW);
		}

		//---------------------------------------------clone object-------------------------------------------
		this.do_lc_duplicate = function (obj){
			var newObj 		= $.extend(true, {}, obj);
			newObj.id		= null;

			self			.do_lc_show(newObj, App['const'].MODE_NEW);
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
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg	, [null, null, App['const'].MODE_DEL])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj						, [App['const'].MODE_INIT]));	
			fSucces.push(req_gl_funct(null	, do_refresh_list					, [])); //refresh menu
		
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;			
		}
		
		//---------Lock-----------------------------------------------------------------------------
		this.do_lc_save		= function(obj, mode){	//save new object or save with lock	
			//to comeback on tab curent active
		    do_gl_req_tab_active($(pr_divContent));
		    
			var data = req_gl_data({
				dataZoneDom : $(pr_divContent)
			});
			
			//check data error
			if(data.hasError) {
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_entity_save'));
				return;
			} 
			
			//----- reformat ----------------
			var rights = data.data.rights;
			var r	   = [];
			for (var i in rights){
				if (rights[i]==1) r.push(parseInt(i,10));
			}
			data.data.rights = JSON.stringify(r);
			//--------------------------------
				
			App.MsgboxController.do_lc_show({
				title	: $.i18n("msgbox_save_title"),
				content : $.i18n("msgbox_save_cont"),
				width	: window.innerWidth<1024?"95%":"40%",
				buttons	: {
					SAVE_EXIT: {
						lab		: 	$.i18n("common_btn_save_exit"),
						funct	: 	function(){
									if(mode==App['const'].MODE_MOD){
										do_send_mod_exit(data)
									} else if(mode==App['const'].MODE_NEW){
										do_send_new_exit(data);	
									}
						}							
					},
					SAVE_CONTINUE: {
						lab		:  	$.i18n("common_btn_save_continue"),
						funct	: 	function(){
									if(mode==App['const'].MODE_MOD){
										do_send_mod_continue(data)
									} else if(mode==App['const'].MODE_NEW){
										do_send_new_continue(data);	
									}
						}
					}
				}
			});	
		}
		//-------------------------------------------New-------------------------------------------------------------
		var do_send_new_continue = function(data) {
			var ref		= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);
			ref["lock"]	= 1;
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg, [null, null, App['const'].MODE_NEW])); 
			fSucces.push(req_gl_funct(null	, do_refresh_list				, [data.data]));
			fSucces.push(req_gl_funct(null	, do_show_Obj					, [App['const'].MODE_MOD]));
			fSucces.push(req_gl_funct(null	, do_begin_lock_new				, []));
			
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	
			
			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}
		
		
		var do_send_new_exit = function(data) {
			var ref		= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);
			ref["lock"]	= 0;
			
			var fSucces	= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg	, [null, null, App['const'].MODE_NEW])); 
			fSucces.push(req_gl_funct(null	, do_refresh_list					, [data.data]));
			fSucces.push(req_gl_funct(null	, do_show_Obj						, [App['const'].MODE_SEL]));
			
			var fError 	= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}
		
		//-------------------------------------------Mod-------------------------------------------------------------
		var do_send_mod_continue = function(data) {
			var ref 		= {};
			ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_SAV);
			ref["lock_id"]	= pr_lock.id;
			
			var fSucces	= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg	, [null, null, App['const'].MODE_MOD])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj						, [App['const'].MODE_MOD]));
			fSucces.push(req_gl_funct(null	, do_refresh_list					, [data.data]));

			var fError 	= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}
		
		var do_send_mod_exit = function(data) {
			var ref 		= {};
			ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_END);
			ref["lock_id"]	= pr_lock.id;
			
			var fSucces		= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg	, [null, null, App['const'].MODE_MOD])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj						, [App['const'].MODE_SEL]));
			fSucces.push(req_gl_funct(null	, do_refresh_list					, [data.data]));

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}
		
		//-------------------------------------------------------------------------------------------------------------		
		this.do_lc_Lock_Begin = function (obj){
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_REQ);		
			
			ref.id				= obj.id; 
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_begin_lock, [obj]));
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
				
		
		this.do_lc_Lock_Cancel = function (obj){
			if (!pr_lock){
				do_lc_show ({}, App['const'].MODE_INIT);
				return;
			}
			
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_DEL);		
			ref['lock_id'	]	= pr_lock.id; 
			
			var fSucces			= [];
			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_del_lock		, [obj]									));	
			fSucces.push(req_gl_funct(null, do_show_Obj		, [App['const'].MODE_SEL, obj]	));	
			
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}	
		
			
		//---------private lock-----------------------------------------------------------------------------
		var do_begin_lock_new = function(sharedJson, obj){
			pr_lock 	= null;
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
				pr_lock 		= sharedJson[App['const'].RES_LOCK];   
				do_gl_req_tab_active($(pr_divContent));
			} else{
				do_gl_show_Notify_Msg_Error ($.i18n('lock_err_inconnu'));
			}
		}
		
		var do_begin_lock = function(sharedJson, obj){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
				pr_lock 		= sharedJson[App['const'].RES_DATA];   
								
				pr_ctr_Ent		.do_lc_show			(obj, App['const'].MODE_MOD);
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
			
			pr_ctr_Ent	.do_lc_show			(obj, App['const'].MODE_SEL);
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
		function do_update_users_rights(object){
			if(object.id == App.data.user.id){
				var rightsLen = object.rights.length;
				var rightsListObj = [];
				for(var i = 0; i<rightsLen; i++){
					if(!App.data.user.rights.includes(object.rights[i].id)){
						App.data.user.rights.push(object.rights[i].id);
					}
					rightsListObj.push(object.rights[i].id);
				}
				rightsLen = App.data.user.rights.length;
				for(var i = 0; i<rightsLen; i++){
					if(!rightsListObj.includes(App.data.user.rights[i])){
						App.data.user.rights.splice(i, 1);
						i--;
						rightsLen--;
					}
				}
			}
		}
		
		function do_refresh_list (sharedJSon) {
			if(sharedJSon[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				pr_ctr_List.do_lc_show();
			}
		}
		
		function do_show_success_msg(sharedJson, msg){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) do_gl_show_Notify_Msg_Success (msg);
		}
	}

	return CtrlEnt;
});