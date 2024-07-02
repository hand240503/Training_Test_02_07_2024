define([
        'jquery',
        
        'text!group/aut/role/tmpl/Main.html',
        
        'group/aut/role/ctrl/List',
        'group/aut/role/ctrl/Ent',
         
       
      
        ],
        function($,         		
        		Tmpl_Main, 
        		
        		CtrlList, 
        		CtrlEnt 
        		
        ) {

	var CtrlMain 	= function (header,content,footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		var pr_grpPath				= 'group/aut/role/';
		var pr_grpName				= grpName;
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
		
		this.var_lc_MODE_INIT 		= 0;
		this.var_lc_MODE_NEW 		= 1; //duplicate is the mode new after clone object
		this.var_lc_MODE_MOD 		= 2;
		this.var_lc_MODE_DEL 		= 3;	
		this.var_lc_MODE_SEL 		= 5;
	
		//-----------------------------------------------------------------------------------
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
					
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			App.data["HttpSecuHeader"]				= req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL);
			do_gl_refresh_SecuHeader();
			
			//---------------------------------------------------------------
			
			//----step 02: load template---------------------------------------------------------------------------------------
			tmplName.MAIN			= "Main";
			tmplCtrl.do_lc_put_tmpl(tmplName.MAIN	, Tmpl_Main); 
			
			//----step 03: load controller------------------------------------------------------------------------------------
			if (!App.controller[pr_grpName])				
				 App.controller[pr_grpName]				= {};
			if (!App.controller[pr_grpName].Main)	
				App.controller[pr_grpName].Main 		= this; //important for other controller can get ref, when new this controller,
			if (!App.controller[pr_grpName].List		)  
				 App.controller[pr_grpName].List		= new CtrlList			(null, "#div_List" 	, null, pr_grpName);				
			if (!App.controller[pr_grpName].Ent			)  
				 App.controller[pr_grpName].Ent			= new CtrlEnt			(null, "#div_Ent" 	, null, pr_grpName);
			
			pr_ctr_Main 							= App.controller[pr_grpName].Main;
			pr_ctr_List 							= App.controller[pr_grpName].List;
			pr_ctr_Ent								= App.controller[pr_grpName].Ent;
			
			pr_ctr_List								.do_lc_init();
			pr_ctr_Ent								.do_lc_init();
			
			//--------------------------------------------------------------------------------------------------
						
		}
		
		
		this.do_lc_show = function(){
			do_get_list_rights();
			//----------------------------------------------------------------
			do_gl_lang_append (pr_grpPath + 'transl', self.do_lc_show_callback);
		};			
		
		this.do_lc_show_callback = function(){
			try { 
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAIN, {}));	
				do_gl_apply_right($(pr_divContent));
				
				App.controller[pr_grpName].List	.do_lc_show();
				App.controller[pr_grpName].Ent	.do_lc_show(undefined, this.var_lc_MODE_INIT);	//init: obj is null	
						
//				do_gl_init_Resizable("#div_List");	
			} catch(e) {
				console.log(e);
//				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "aut.role", "Main", "do_lc_show", e.toString()) ;
			}
		};
		
		//---------private-----------------------------------------------------------------------------
		var do_get_list_rights= function(){
			//ajax to get all fix values here			
			var ref 		= req_gl_Request_Content_Send('ServiceAutRight', 'SVLst');			
		
			var fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_get_list_rights_response, []));	
			
			var fError 		= req_gl_funct(App, self.do_show_Msg, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
		var do_get_list_rights_response = function(sharedJson) {
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				var data = sharedJson[App['const'].RES_DATA];
				var cache = {};
				$.each(data, function(i, e) {
					if(!cache[e.grp]) {
						cache[e.grp] = {};
						cache[e.grp].label = 'aut_right_grp_'+e.grp;
						cache[e.grp].rights = [];
					}
					cache[e.grp].rights.push(e);
				});
				App.data.AutRightList = cache;
			}
		}
		
			
	};

	return CtrlMain;
  });