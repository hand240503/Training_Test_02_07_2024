define([
        'jquery',
        'text!group/nso/post/tmpl/Ent.html',

        'group/nso/post/ctrl/EntHeader',
        'group/nso/post/ctrl/EntBtn',
        'group/nso/post/ctrl/EntTabs', 
//        'group/nso/post/ctrl/EntTabRating',
        'group/nso/post/ctrl/EntTabDoc',
        ],
        function($, 
        		Tmpl_Ent,
        		
        		CtrlEntHeader, 
        		CtrlEntBtn,
        		CtrlEntTabs, 
//        		CtrlEntTabRating,
        		CtrlEntTabDoc
        ) {


	var CtrlEnt     = function (header, content, footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;

		//------------------------------------------------------------------------------------
		var pr_lock_type			= -1; //--const based on BO
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

		var self 						= this;		
		//------------------------------------------------------------------------------------
		var pr_OBJ_TYPE				= 17000;// change to adapt with back office for lock tool
		
		var pr_SERVICE_CLASS		= "ServiceNsoPost"; //to change by your need
				
		var pr_SV_GET				= "SVGet"; 
		var pr_SV_NEW				= "SVNew"; 
		
		var pr_SV_DEL				= "SVDel"; 
		
		var pr_SV_LCK_REQ			= "SVLckReq"; 
		var pr_SV_LCK_SAV			= "SVLckSav"; 	//if not use lock
		var pr_SV_LCK_END			= "SVLckEnd"; 
		var pr_SV_LCK_DEL			= "SVLckDel"; 
		
		var pr_SV_UPDATE_STAT		= "SVUpdateStat"; //Quick Validate / Deny		
		var pr_SV_MOD_TRANSL		= "SVModTransl";
		
		
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
		
		var pr_typ_new				= null;
		var pr_typ_new_exit			= 1;
		var pr_typ_new_continue		= 2;
		
		var POST_STAT_ACCEPTED	 	= 100;
		var POST_STAT_DENIED		= 101;
		
		var pr_default_new_obj	= {
			}
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			tmplName.ENT				= "Tmpl_Ent";
			tmplCtrl.do_lc_put_tmpl(tmplName.ENT	, Tmpl_Ent); 
			//------------------------------------------------------------------------
			if (!App.controller[pr_grpName].EntBtn		)  
				 App.controller[pr_grpName].EntBtn		= new CtrlEntBtn			(null, "#div_Ent_Btn"	, null, pr_grpName);
			if (!App.controller[pr_grpName].EntHeader	)  
				 App.controller[pr_grpName].EntHeader	= new CtrlEntHeader			(null, "#div_Ent_Header", null, pr_grpName);
			if (!App.controller[pr_grpName].EntTabs		)  
				 App.controller[pr_grpName].EntTabs		= new CtrlEntTabs			(null, "#div_Ent_Tabs"	, null, pr_grpName);
			
			//----------tab name----------------------------------------------------------------------------------------
//			if (!App.controller[pr_grpName].EntTabRating)  
//				 App.controller[pr_grpName].EntTabRating = new CtrlEntTabRating	(null, "#div_Ent_Tab_Rating", null);
			if (!App.controller[pr_grpName].EntTabDoc)  
				 App.controller[pr_grpName].EntTabDoc	= new CtrlEntTabDoc			(null, "#div_Ent_Tab_Doc", null , pr_grpName);
			
			App.controller[pr_grpName].EntBtn		.do_lc_init();
			App.controller[pr_grpName].EntHeader	.do_lc_init();
			App.controller[pr_grpName].EntTabs		.do_lc_init();
//			App.controller[pr_grpName].EntTabRating	.do_lc_init();
			App.controller[pr_grpName].EntTabDoc	.do_lc_init();
			
			//------------------------------------------------------------------------
			pr_ctr_Main 			= App.controller[pr_grpName].Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;
			
			pr_ctr_Ent				= App.controller[pr_grpName].Ent;
			pr_ctr_EntHeader 		= App.controller[pr_grpName].EntHeader;
			pr_ctr_EntBtn 			= App.controller[pr_grpName].EntBtn;
			pr_ctr_EntTabs 			= App.controller[pr_grpName].EntTabs;
			
		}
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show		= function(obj, mode, langOpt){			
			try { 
				pr_obj 			= obj?obj:{};
				pr_mode			= (!pr_obj||!mode)?App['const'].MODE_INIT: mode;
				App.data.mode 	= pr_mode;

				if (pr_mode == App['const'].MODE_INIT){
					$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT, {mode : App['const'].MODE_INIT}));
					pr_ctr_EntBtn		.do_lc_show(obj, App['const'].MODE_INIT);
					return;
				}		
				
				obj = req_gl_Translation_Obj(obj, langOpt); 

				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT, obj));				

				pr_ctr_EntBtn		.do_lc_show(pr_obj, pr_mode);
				pr_ctr_EntHeader	.do_lc_show(pr_obj, pr_mode);			
				pr_ctr_EntTabs		.do_lc_show(pr_obj, pr_mode);
				
				//-------------------------------------------------------------
				do_gl_enhance_within($(pr_divContent),{
					obj: pr_obj
				});
				
				//-------------------------------------------------------------
				if(mode == App['const'].MODE_NEW) {
					do_gl_enable_edit($(pr_divContent), ".objData", mode);
				
				} else if(mode == App['const'].MODE_MOD) {
					do_gl_enable_edit($(pr_divContent), ".objData", mode);
//					do_gl_disable_edit($(pr_divContent), ".objData", mode);
//					$("#stat").prop('disabled', false);
//					$("#nso_post_tab_doc_file_input").fileinput("enable");;
				
				} else if(mode == App['const'].MODE_TRANSL) {
					do_gl_disable_edit($(pr_divContent));
					do_gl_enable_edit($(pr_divContent), ".transl", mode);

				} else {
					do_gl_disable_edit($(pr_divContent));
				}
				//-------------------------------------------------------------
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_Minimize	();
				App.controller.DBoard.DBoardMain.do_lc_prevent_winClosing (pr_mode);

			}catch(e){
				console.log(e);
				do_gl_exception_send(App.path.BASE_URL_API_PRIV, "nso.post", "Ent", "do_lc_show", e.toString()) ;
			}
		}
		
		//---show after ajax request---------------------------
		var do_show_Obj = function(sharedJson, mode, localObj, langOpt){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {		
				App.data.mode = mode;
				var object = sharedJson[App['const'].RES_DATA]; 
				if (!object)
					object = localObj;
				self.do_lc_show(object, mode, langOpt);  

			} else {
        		//TODO do something here
        		//notify here
        		do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
        	}		
		}
		
			
		this.do_lc_show_ById = function(obj, mode, langOpt){
			var svName 		= pr_SV_GET;
			if (pr_mode == App['const'].MODE_MOD){
				//not use lock
				svName = pr_SV_GET
				
				//use lock
				//svName = pr_SV_LCK_REQ
			}
		
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_GET); 			
			ref.id			= obj.id;
			ref["forManager"]	= true;
			ref["forced"	]	= true;
			
			var fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_show_Obj, [mode, null, langOpt]));	
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;			
		}
		
		function do_upd_TranslId(sharedJson, mode, localObj,langOpt){
			var code = sharedJson[App['const'].SV_CODE];
			if(code == App['const'].SV_CODE_API_YES) {		
				var translId = sharedJson[App['const'].RES_DATA];  
				$("#inp_translId").val(translId);
        	} else {
        	}

		}
		
		//---------------------------------------------new object-------------------------------------------
		this.do_lc_new = function() {

			var newObj		 = $.extend(true, {}, pr_default_new_obj);	
			//action mode
			App.data.mode 	= App['const'].MODE_NEW;
			
			self		.do_lc_show(newObj, App.data.mode);
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
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_DEL);	
			ref.id			= obj.id;
			
			var lock 		= {};			
			lock.objectType = pr_OBJ_TYPE; 	//integer
			lock.objectKey 	= obj.id; 		//integer
			ref['lock'	]	= JSON.stringify(lock);
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_gl_show_Notify_Msg		, [null, null, App['const'].MODE_DEL])); 
			fSucces.push(req_gl_funct(null, do_show_Obj, [App['const'].MODE_INIT]));	
			fSucces.push(req_gl_funct(null, do_refresh_list, [])); //refresh menu
		
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
		    var 	data	 			= req_gl_data({
					dataZoneDom		: $(pr_divContent),
					oldObject 		: {'files': obj.files},
					removeDeleted	: true				
				});
			
//		    if(App.data.linkYtb && Object.keys(App.data.linkYtb).length > 0){
//		    	obj.files.push(App.data.linkYtb);
//		    }
		    if(data.hasError == true){
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_entity_save'));
			} else {
//				reform category
				data = do_lc_reform_sending_data(data);
				
				//-----mod-transltion------------------------
				if(mode == App['const'].MODE_TRANSL) {
					do_gl_Del_ObjAttrLst(data.data, App['const'].TRANSL_FILTER_ATTR_LEV_1		, false);
					do_gl_Del_ObjAttrLst(data.data, App['const'].TRANSL_FILTER_ATTR_LEV_ALL	, true);
					do_send_mod_transl(data);
					return;
				}
				
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("common_msg_mod_confirm"),
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
		}
		
		//--------------------------------------------------------------------------------------------------------
		function do_lc_reform_sending_data(originalData) {
			var dataResult = originalData;
			
			if(originalData.data.topicOpt01){
				var cats01 	= do_generate_topic(originalData.data.topicOpt01,originalData.data.id);
			}else{
				return dataResult;
			}
			
			if(originalData.data.topicOpt02){
				var cats02 	= do_generate_topic(originalData.data.topicOpt02,originalData.data.id);
			}
			
			dataResult.data.cats =  cats01.concat(cats02);
			
			return dataResult;
		}
		
		//-------------------------------------------------------------------------------------------------------
		
		var do_generate_topic = function(data,objId){
			var dataGenerated=[];
			if(data){
				for(var o in data){
					if(data[o]==1){
						dataGenerated.push({"catId" : o})
					}
				}
			}
			return dataGenerated;
		}
		//-------------------------------------------------------------------------------------------------------
		var do_send_new_continue = function(data) {
			var ref		= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);
			ref["lock"]	= 1;
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg, [null, null, App['const'].MODE_NEW])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj					, [App['const'].MODE_MOD]));
			fSucces.push(req_gl_funct(null	, do_refresh_list				, []));
			fSucces.push(req_gl_funct(null	, do_lock_begin					, []));
			
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	
			
			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}
		
		var do_send_new_exit = function(data) {
			var ref		= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_NEW);
			ref["lock"]	= 0;
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg, [null, null, App['const'].MODE_NEW])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj					, [App['const'].MODE_SEL]));
			fSucces.push(req_gl_funct(null	, do_refresh_list				, []));
		
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	
			
			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}
		
		var do_send_mod_continue = function(data) {
			var ref 			= {};
			ref 				= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_SAV);
			ref['lock_id'] 		= pr_lock.id;
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg, [null, null, App['const'].MODE_MOD])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj					, [App['const'].MODE_MOD]));
//			fSucces.push(req_gl_funct(null	, do_refresh_list				, []));
			
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	
			
			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}
		
		var do_send_mod_exit = function(data) {
			var ref 			= {};
			ref 				= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_END);
			ref['lock_id'] 		= pr_lock.id;
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg, [null, null, App['const'].MODE_MOD])); 
			fSucces.push(req_gl_funct(null	, do_show_Obj					, [App['const'].MODE_SEL]));
			fSucces.push(req_gl_funct(null	, do_refresh_list				, []));

			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}
		
		//-------------------------------------------------------------------------------------------------------
		var do_send_mod_transl = function(data) {
			var ref 	= {};
			ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_MOD_TRANSL);
			ref["forManager"]	= true;
			ref["forced"	]	= true;
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg, [null, null, App['const'].MODE_MOD])); 
			fSucces.push(req_gl_funct(null	, do_upd_TranslId				, []));
			
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	
			
			data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
		}
				
		//-------------------------------------------------------------------------------------------------------------	
		this.do_lc_Lock_Begin = function (obj){			
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_REQ);		
			
			ref.id				= obj.id; 
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_lock_begin, [obj]));
			
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
				
		
		this.do_lc_Lock_Cancel = function (obj){
			var ref 			= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_LCK_DEL);		
			ref['lock_id'	]	= pr_lock.id; 
			
			var fSucces			= [];
			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_lock_del		, [obj]									));	
			fSucces.push(req_gl_funct(null, do_show_Obj		, [App['const'].MODE_SEL, obj]	));	
			
			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
			
		//---------private lock-----------------------------------------------------------------------------
		var do_lock_begin = function(sharedJson, obj){
			//to comeback on tab curent active
			pr_lock 	= null;
			
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {					
				pr_lock 		= sharedJson[App['const'].RES_DATA];   
				App.data.mode 	= App['const'].MODE_MOD;	
				do_gl_req_tab_active($(pr_divContent));
				
				if (obj){
					pr_ctr_EntBtn.do_lc_show(obj, App.data.mode);
					self.do_lc_show			(obj, App.data.mode);
				}
			
			} else if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_NO) {
				var uName 	= sharedJson[App['const'].RES_DATA].inf01;
        		do_gl_show_Notify_Msg_Error ($.i18n('lock_err_begin') + uName);
			
			}else{
        		do_gl_show_Notify_Msg_Error ($.i18n('lock_err_inconnu'));
        		//notify something if the lock is taken by other person
        		//show lock.information
        	}		
		}
		
		var do_lock_del = function (sharedJson, obj){
			if(sharedJson[App['const'].SV_CODE] != App['const'].SV_CODE_API_YES) {					
				//notify something
				do_gl_show_Notify_Msg_Error ($.i18n('lock_err_inconnu') );
			}
			
			pr_lock = null;
			if (obj){
				self.do_lc_show			(obj, App['const'].MODE_SEL);	
			}
        			
		}
		
		
		//-------------------------------------------------------------------------------------------------------------		
		this.can_lc_have_lock = function (){
			if (this.pr_lock!=null)
				App.MsgboxController.do_lc_show({
					title	: $.i18n('lock_err_title') ,
					content	: $.i18n('lock_err_msg'),
					width	: window.innerWidth<1024?"95%":"40%",
				});	
			return this.pr_lock!=null;
		}
		
		


		//---------private lock-----------------------------------------------------------------------------
		var do_refresh_list = function(sharedJSon, obj) {
			if(sharedJSon[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
//				pr_ctr_List.do_lc_show_byType(obj.typ00);
			}
		}
		//---------------------------------------------------------------------------------------------
		//UPDATE ORDER STATUS-----UPDATE ORDER STATUS-----UPDATE ORDER STATUS-----UPDATE ORDER STATUS--
		//---------------------------------------------------------------------------------------------
		
		this.do_update_post_status = function(obj, newStat) {
			var ref 	= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_UPDATE_STAT);
			ref["stat"]		= newStat;
			ref["postId"]	= obj.id;
			var fSucces		= [];
			fSucces.push	( req_gl_funct(this, do_callback_update_stat, [true] ));
			var fError 		= req_gl_funct(this, do_callback_update_stat, [false]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		var do_callback_update_stat = function(sharedJson, ajaxStat){
			if(!ajaxStat){
				do_gl_show_Notify_Msg_Error($.i18n("common_err_ajax"));
				return;
			}
			var code = sharedJson[App['const'].SV_CODE];
			if(code == App['const'].SV_CODE_API_YES) {
				var order = sharedJson.res_data;
				pr_ctr_List.do_lc_show();
				pr_ctr_Ent.do_lc_show(order, App['const'].MODE_SEL);
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("Error update order status: SV Code:" + code));
			}
		}
	}

	return CtrlEnt;
});