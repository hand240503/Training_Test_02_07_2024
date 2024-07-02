define([
        'jquery',
        
        'text!group/aut/user/tmpl/Aut_User_Main.html',
        'text!group/aut/user/tmpl/Aut_User_Sel_List_Legal_Status.html',
        
        'group/aut/user/ctrl/AutUserList',
        'group/aut/user/ctrl/AutUserEnt',
        'group/aut/user/ctrl/AutUserEntHeader',
        'group/aut/user/ctrl/AutUserEntBtn',
        'group/aut/user/ctrl/AutUserEntTabs',       
        'group/aut/user/ctrl/AutUserEntTabRoles',
        
//        'group/aut/user/ctrl/AutUserEntTab02',
        'group/aut/user/ctrl/AutUserEntTabFiles',
//        'group/aut/user/ctrl/AutUserEntTabCat',
//        'group/aut/user/ctrl/AutUserEntTabPost',
//        'group/aut/user/ctrl/AutUserEntTabContact'
        'group/aut/user/ctrl/AutUserRights'
       
      
        ],
        function($,
        		AutUser_Main, 
        		AutUser_LegalStat,
        		AutUserList, 
        		AutUserEnt, 
        		AutUserEntHeader, 
        		AutUserEntBtn, 
        		AutUserEntTabs, 
        		AutUserEntTabRoles,
//        		AutUserEntTab02,
        		AutUserEntTabFiles,
//        		AutUserEntTabCat,
//        		AutUserEntTabPost,
//        		AutUserEntTabContact
        		AutUserRights
        ) {

	var AutUserMain 	= function (header,content,footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		var pr_type_adm      		= 2;
		var pr_type_emp      		= 3;
		var pr_type_client   		= 4;
		var pr_type_client_public 	= 5;
		var pr_type_adm_all    		= 10;
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
		
		this.var_lc_MODE_INIT 		= 0;
		this.var_lc_MODE_NEW 		= 1; //duplicate is the mode new after clone object
		this.var_lc_MODE_MOD 		= 2;
		this.var_lc_MODE_DEL 		= 3;	
		this.var_lc_MODE_SEL 		= 5;
	
		//-----------------------------------------------------------------------------------
		this.pr_right_soc_manage	= [30002001, 30002002, 30002003, 30002004, 30002005];
		//---------------------------------------------------------------
		var societeListChild		= 1010011;
		var societeCompany			= 1010010;
		
		var societePartnerSupp		= 1010003;
		var societePartnerOther		= 1010006;
		
		var typePersonMoral			= 1000001;
		var typePersonNatural		= 1000002;
		
		var var_lc_PAR_TYPE_MENTOR		= 1100;	
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			if (!App.controller.AutUser)				
				 App.controller.AutUser				= {};
			
			if (!App.controller.AutUser.Main)	
				App.controller.AutUser.Main 		= self; //important for other controller can get ref, when new this controller,
			
			if (!App.controller.AutUser.Rights)	
				App.controller.AutUser.Rights 			= new AutUserRights();
			
			if (!App.controller.AutUser.List		)  
				 App.controller.AutUser.List		= new AutUserList			(null, "#div_AutUser_List" , null);				
			if (!App.controller.AutUser.Ent			)  
				 App.controller.AutUser.Ent			= new AutUserEnt			(null, "#div_AutUser_Ent" , null);
			if (!App.controller.AutUser.EntBtn		)  
				 App.controller.AutUser.EntBtn		= new AutUserEntBtn			(null, "#div_AutUser_Ent_Btn" , null);
			if (!App.controller.AutUser.EntHeader	)  
				 App.controller.AutUser.EntHeader	= new AutUserEntHeader		(null, "#div_AutUser_Ent_Header" , null);
			if (!App.controller.AutUser.EntTabs		)  
				 App.controller.AutUser.EntTabs		= new AutUserEntTabs		(null, "#div_AutUser_Ent_Tabs" , null);
			
			//----------tab name----------------------------------------------------------------------------------------
			if (!App.controller.AutUser.EntTab01)  
				 App.controller.AutUser.EntTab01= new AutUserEntTabRoles	(null, "#div_AutUser_Ent_Tab_Roles", null);
//			if (!App.controller.AutUser.EntTab02)  
//				 App.controller.AutUser.EntTab02= new AutUserEntTab02	(null, "#div_AutUser_Ent_Tab_02", null);
			if (!App.controller.AutUser.EntTabFiles)  
				 App.controller.AutUser.EntTabFiles = new AutUserEntTabFiles	(null, "#div_AutUser_Ent_Tab_Files", null);
//			if (!App.controller.AutUser.EntTabCat)  
//				 App.controller.AutUser.EntTabCat = new AutUserEntTabCat	(null, "#div_AutUser_Ent_Tab_Cat", null);
//			if (!App.controller.AutUser.EntTabPost)  
//				 App.controller.AutUser.EntTabPost = new AutUserEntTabPost	(null, "#div_AutUser_Ent_Tab_Post", null);
//			if (!App.controller.AutUser.EntTabContact)  
//				 App.controller.AutUser.EntTabContact = new AutUserEntTabContact	(null, "#div_AutUser_Ent_Tab_Contact", null);
			//--------------------------------------------------------------------------------------------------
			
			App.data["HttpSecuHeader"]				= {
					Authorization: "Bearer " + req_gl_Security_HttpHeader(App.keys.KEY_STORAGE_CREDENTIAL),
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				};
			
			App.controller.AutUser.List			.do_lc_init();
			App.controller.AutUser.Ent			.do_lc_init();
			App.controller.AutUser.EntBtn		.do_lc_init();
			App.controller.AutUser.EntHeader	.do_lc_init();
			App.controller.AutUser.EntTabs		.do_lc_init();
			App.controller.AutUser.EntTab01		.do_lc_init();
//			App.controller.AutUser.EntTab02		.do_lc_init();
			App.controller.AutUser.EntTabFiles	.do_lc_init();
//			App.controller.AutUser.EntTabPost	.do_lc_init();
//			App.controller.AutUser.EntTabCat	.do_lc_init();
//			App.controller.AutUser.EntTabContact.do_lc_init();
							
			
			tmplName.AUT_USER_MAIN			= "Aut_User_Main";
			tmplName.AUT_USER_LIST			= "Aut_User_List";
			tmplName.AUT_USER_LIST_HEADER	= "Aut_User_List_Header";
			tmplName.AUT_USER_LIST_CONTENT	= "Aut_User_List_Content";
			tmplName.AUT_USER_ENT			= "Aut_User_Ent";
			tmplName.AUT_USER_ENT_BTN		= "Aut_User_Ent_Btn";
			tmplName.AUT_USER_ENT_HEADER	= "Aut_User_Ent_Header";
			tmplName.AUT_USER_ENT_TABS		= "Aut_User_Ent_Tabs";
			tmplName.AUT_USER_ENT_TAB_ROLES	= "Aut_User_Ent_Tab_Roles";
			
//			tmplName.AUT_USER_ENT_TAB_02	= "Aut_User_Ent_Tab_02";
			tmplName.AUT_USER_ENT_TAB_FILES	= "Aut_User_Ent_Tab_Files";
//			tmplName.AUT_USER_ENT_TAB_POST	= "Aut_User_Ent_Tab_Post";
//			tmplName.AUT_USER_ENT_TAB_CAT	= "Aut_User_Ent_Tab_Cat";
			
			tmplName.AUT_USER_ENT_TAB_CONTACT   = "Aut_User_Ent_Tab_Contact";
			
			tmplName.AUT_USER_LEGAL_STAT		= "Aut_User_Legal_Stat";
			tmplName.AUT_USER_ENT_HEADER_PASS	= "Aut_User_Ent_Header_Pass";
			
			tmplName.AUT_USER_LIST_BY_ID					= "Aut_User_List_By_Id";
			tmplName.AUT_USER_LIST_BY_ID_HEADER				= "Aut_User_List_By_Id_Header";
			tmplName.AUT_USER_LIST_BY_ID_CONTENT			= "Aut_User_List_By_Id_Content";
			
			tmplName.AUT_USER_LIST_FILTER_BOX				= "Aut_User_List_Filter_Box";
			tmplName.AUT_USER_LIST_FILTER_HEADER			= "Aut_User_List_Filter_Header";
			tmplName.AUT_USER_LIST_FILTER_CONTENT			= "Aut_User_List_Filter_Content";
			
			//do_get_per_societe(societeCompany);
			//do_get_per_societe(societeListChild);
		}
		
		this.do_lc_show = function(){
			try {
				App.data["HttpSecuHeader"]				= {
						Authorization: "Bearer " + req_gl_Security_HttpHeader(App.keys.KEY_STORAGE_CREDENTIAL),
						'Content-Type': 'application/json',
						'Accept': 'application/json',
					};
				
//				do_Get_Pos_Position(); //begin by fetching all mandatory values 
//				do_Get_Per_LegalStat();
//				do_Get_Mentor_Cat();
//				do_get_per_societe(societePartnerSupp+","+societePartnerOther);
			
				
				tmplCtrl.do_lc_put_tmpl(tmplName.AUT_USER_MAIN	, AutUser_Main); 
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.AUT_USER_MAIN, {}));	
//				do_gl_apply_right($(pr_divContent));
				
				var params = req_gl_Url_Params(App.data.url);
				if(params.uId || params.id){
					App.controller.AutUser.List	.do_lc_show();
					do_get_user_related(params.uId?params.uId: params.id);
				}else{
					App.controller.AutUser.List	.do_lc_show();
					App.controller.AutUser.Ent	.do_lc_show(undefined, this.var_lc_MODE_INIT);	//init: obj is null	
				}
				
				do_gl_init_Resizable("#div_AutUser_List");
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_MaxResize('#div_AutUser_List', '#div_AutUser_Ent');
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_Minimize();
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_MinResize('#div_AutUser_List', '#div_AutUser_Ent');
							
			} catch(e) {
				console.log(e);
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "aut.user", "AutUserMain", "do_lc_show", e.toString()) ;
			}
		};
		
		this.do_verify_user_right_soc_manage = function(){
			for(var i = 0; i< this.pr_right_soc_manage.length; i++){
				if(App.data.user.rights.includes(this.pr_right_soc_manage[i]))
					return true;
			}
			
			if (App.data.user.typ == pr_type_adm_all || (App.data.user.typ == pr_type_adm|| App.data.user.manId == 1))
				return true;
			
			return false;
		}

		//---------private-----------------------------------------------------------------------------
		var do_Get_Pos_Position = function() {
			//ajax to get all fix values here
			var ref 		= req_gl_Request_Content_Send('ServiceJobPosition', 'SVJobPositionLst');
			
			var fSucces		= [];
			fSucces.push(req_gl_funct(App, App.funct.put, ['JobPositions']));	
			
			var fError 		= req_gl_funct(App, self.do_show_Msg, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}	
		
		var do_Get_Per_LegalStat = function() {
			//ajax to get all fix values here
			var ref 		= req_gl_Request_Content_Send('ServiceCfgValue', 'SVCfgGroupGet');
			ref["id"]		= 102;
			ref["withValue"]= "true";
			var fSucces		= [];
			fSucces.push(req_gl_funct(null, do_Get_Per_LegalStat_response, []));	
			
			var fError 		= req_gl_funct(App, self.do_show_Msg, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
		var do_Get_Per_LegalStat_response = function(sharedJson) {
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				var data = sharedJson[App['const'].RES_DATA];
				App.data["PerLegalStat"] = [];
				$.each(data.vals, function(i, e) {
					if(e.val02 == 1) {
						App.data["PerLegalStat"].push(e);
					}
				});
				tmplCtrl.do_lc_put_tmpl(tmplName.AUT_USER_LEGAL_STAT		, AutUser_LegalStat); 
				tmplCtrl.req_lc_compile_tmpl(tmplName.AUT_USER_LEGAL_STAT	, App.data["PerLegalStat"]);
			}
		}
		
		var do_Get_Mentor_Cat = function() {
			//ajax to get all fix values here
			var ref 		= req_gl_Request_Content_Send('ServiceTpyCategory', 'SVTpyCategoryLstCat');
			ref["parTyp"]		= var_lc_PAR_TYPE_MENTOR;
			
			var fSucces		= [];
			fSucces.push(req_gl_funct(null, do_Get_Mentor_Cat_response, []));	
			
			var fError 		= req_gl_funct(App, self.do_show_Msg, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
		var do_Get_Mentor_Cat_response = function(sharedJson) {
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				var data = sharedJson[App['const'].RES_DATA];
				if(!App.data["AutUserListCats"])
					App.data["AutUserListCats"] = [];
				App.data["AutUserListCats"]=data;
			}
			else{
				App.data["AutUserListCats"] = [];
			}
		}
		
		var do_get_per_societe = function(typeSoc) {
			//ajax to get all fix values here
			var ref 		= req_gl_Request_Content_Send('ServicePerPerson', 'SVPerPersonLst');
			ref["typ01"]	= typePersonMoral;
			ref["typ02"]	= typeSoc;
			
			var fSucces		= [];
			if(typeSoc == societeCompany)
				fSucces.push(req_gl_funct(App, App.funct.put, ['LstSociete']));
			else if(typeSoc == societeListChild)
				fSucces.push(req_gl_funct(App, App.funct.put, ['LstSocieteChild']));
			else
				fSucces.push(req_gl_funct(App, App.funct.put, ['LstPartner']));
			
			var fError 		= req_gl_funct(App, self.do_show_Msg, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
		var do_get_user_related = function(userId){
			var ref 		= req_gl_Request_Content_Send('ServiceAutUser', 'SVAutUserGet');			
			ref.id			= userId;
			ref.forManager	= true;
			
			var fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_show_user_related, []));	
			
			var fError 		= req_gl_funct(App, self.do_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;			
		}
		
		var do_show_user_related = function(sharedJson){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				var obj = {};
				obj = sharedJson.res_data;
				App.controller.AutUser.Ent	.do_lc_show(obj, self.var_lc_MODE_SEL);
			}else{
				do_gl_show_Notify_Msg_Error ($.i18n('common_err_ajax'));
			}
		}
		
		//--------------------------------------------------------------------------------------------
		this.do_show_Notify_Msg  = function (sharedJson, msg, typeNotify, modeOld, modeNew){
			if (typeNotify){				
				if (typeNotify == 1 ){
					if (!msg) msg = "OK";
					do_gl_show_Notify_Msg_Success 	(msg);
				} else if (typeNotify == 0){
					if (!msg) msg = "Err";
					do_gl_show_Notify_Msg_Error 	(msg);
				}
			}else{
				var code 		= sharedJson[App['const'].SV_CODE];
				var pr_ctr_Main	= App.controller.AutUser.Main;
				if(code == App['const'].SV_CODE_API_YES) {
					
					if (modeOld == App['const'].MODE_NEW || modeOld == App['const'].MODE_MOD){
						if (!msg){
							msg = $.i18n('common_ok_msg_save');
						}
					}else if (modeOld == App['const'].MODE_DEL){
						if (!msg) msg = $.i18n('common_ok_msg_del');		  
					}
					
					do_gl_show_Notify_Msg_Success 	(msg);
					
				}else if (code== App['const'].SV_CODE_API_NO){
					if (modeOld == App['const'].MODE_INIT || modeOld == App['const'].MODE_SEL){
						if (!msg) msg = $.i18n('common_err_msg_get');		        		
					}else if (modeOld == App['const'].MODE_NEW || modeOld == App['const'].MODE_MOD){
						if (!msg) msg = $.i18n('common_err_msg_save');		        		
					}else if (modeOld == App['const'].MODE_DEL){
						if (!msg) msg = $.i18n('common_err_msg_del');		  
					}
					
					do_gl_show_Notify_Msg_Error 	(msg);
					
	        	} else {
	        		if (!msg) msg = $.i18n('common_err_msg_unknow');
	        		do_gl_show_Notify_Msg_Error 	(msg);
	        	}	
			}			
		}	

		//--------------------------------------------------------------------------------------------
		this.do_show_Msg= function(sharedJson, msg){
			//alert(msg);
			console.log("do_show_Msg::" + msg);
		}		
			
	};

	return AutUserMain;
  });