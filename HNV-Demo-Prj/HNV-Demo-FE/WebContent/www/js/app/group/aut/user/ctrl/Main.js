define([
        'jquery',
        
        'text!group/aut/user/tmpl/Main.html',
        
        'group/aut/user/ctrl/List',
        'group/aut/user/ctrl/Ent'      
      
        ],
        function($,         		
        		Tmpl_Main, 
        		
        		CtrlList, 
        		CtrlEnt
        ) {

	var CtrlMain 	= function (header, content, footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName;
		var pr_grpPath				= 'group/aut/user';
		App.template.names[pr_grpName] = {}; //---init only one time in Main ctrl
		
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
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		//---------------------------------------------------------------
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			App.data["HttpSecuHeader"]				= req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL);
			do_gl_refresh_SecuHeader();
			//---------------------------------------------------------------
			
			tmplName.MAIN					= "Main";
			tmplCtrl.do_lc_put_tmpl(tmplName.MAIN	, Tmpl_Main); 
			
			//---------------------------------------------------------------
			
			if (!App.controller[pr_grpName])				
				 App.controller[pr_grpName]				= {};
			
			if (!App.controller[pr_grpName].Main		)	
				App.controller[pr_grpName].Main 			= this; //important for other controller can get ref, when new this controller,
			
			if (!App.controller[pr_grpName].List		)  
				 App.controller[pr_grpName].List			= new CtrlList				(null, "#div_List", null, pr_grpName);				
			if (!App.controller[pr_grpName].Ent			)  
				 App.controller[pr_grpName].Ent				= new CtrlEnt				(null, "#div_Ent", null, pr_grpName);
		

			pr_ctr_Main 							= App.controller[pr_grpName].Main;
			pr_ctr_List 							= App.controller[pr_grpName].List;
			pr_ctr_Ent								= App.controller[pr_grpName].Ent;
			
			pr_ctr_List								.do_lc_init();
			pr_ctr_Ent								.do_lc_init();
			//--------------------------------------------------------------------------------------------------
		}
		
		this.do_lc_show = function(){
			//------------------ req lst Role for show---------------------------
			do_get_list_roles();
			do_get_list_cats();
			
			//-------------------------------------------------------------------
			do_gl_lang_append (pr_grpPath + '/transl', self.do_lc_show_callback);
		};			
		
		this.do_lc_show_callback = function(){
			try { 
				
				$(pr_divContent)		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAIN, {}));	
				do_gl_apply_right($(pr_divContent));
				
				App.controller[pr_grpName].List	.do_lc_show();
				//-------------------------------------------------------------------
				var params = req_gl_Url_Params(App.data.url);
				if (params.id){
					var mode = params.mode;
					var lang = params.lang
					if (!mode) mode = App['const'].MODE_SEL;
					if (!lang) lang = App.language;
					App.controller[pr_grpName].Ent.do_lc_show_ById({id: params.id}, mode, lang);
				} else {
					App.controller[pr_grpName].Ent.do_lc_show({}, this.var_lc_MODE_INIT);	//init: obj is null
				}
				
						
				//-----------------------------------------------------------------------------------------
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_MaxResize	('#div_List', '#div_Ent');
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_MinResize	('#div_List', '#div_Ent');
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_Minimize	();
			}catch(e) {		
				console.log(e);
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "aut.user", "Main", "do_lc_show", e.toString()) ;
			}
		};
		
		
		//---------get roles list-----------------------------------------------------------------------------
		var do_get_list_roles = function (){
			var ref 			= req_gl_Request_Content_Send("ServiceAutRole", "SVLst");		

			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_get_list_roles_response, []));	

			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_get_list_roles_response = function (sharedJson){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				var data = sharedJson[App['const'].RES_DATA];
				var cache = {};
				$.each(data, function(i, e) {
					if(!cache[e.grp]) {
						cache[e.grp] = {};
						cache[e.grp].label = 'aut_role_grp_'+e.grp;
						cache[e.grp].roles = [];
					}
					cache[e.grp].roles.push(e);
				});
				App.data.AutRoleList = cache;
			}
		}

		//---------get cats list-----------------------------------------------------------------------------
		var do_get_list_cats = function (){
			var ref 			= req_gl_Request_Content_Send("ServiceTpyCategory", "SVLstSearch");		

			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_get_list_cats_response, []));	

			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_get_list_cats_response = function (sharedJson){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				var data = sharedJson[App['const'].RES_DATA];
				var cache = {};
				var grp = "aut_user";
				$.each(data, function(i, e) {
					if(!cache[grp]) {
						cache[grp] = {};
						// cache[e.grp].label = 'aut_role_grp_'+e.grp;
						cache[grp].cats = [];
					}
					cache[grp].cats.push(e);
				});
				App.data.TpyCatList = cache;
			}
		}
		
	};

	return CtrlMain;
  });