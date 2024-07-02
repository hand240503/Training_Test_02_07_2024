define([
        'jquery',
        
        'text!group/cfg/value/tmpl/Main.html',
        
        'group/cfg/value/ctrl/List',
        'group/cfg/value/ctrl/Ent'      
      
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
		var pr_grpPath				= 'group/cfg/value';
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
			do_gl_lang_append (pr_grpPath + '/transl', self.do_lc_show_callback);
		};			
		
		this.do_lc_show_callback = function(){
			try { 
				
				$(pr_divContent)		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAIN, {}));	
//				do_gl_apply_right($(pr_divContent));
				
				App.controller[pr_grpName].List	.do_lc_show();
				
				var params = req_gl_Url_Params(App.data.url);
				if (params.id){
					var mode = params.mode;
					var lang = params.lang
					if (!mode) mode = App['const'].MODE_SEL;
					if (!lang) lang = App.language;
					App.controller[pr_grpName].Ent.do_lc_show_ById({id: params.id}, mode, lang);
				} else {
					App.controller[pr_grpName].Ent.do_lc_show(null);//init: obj is null	
				}
						
				//-----------------------------------------------------------------------------------------
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_MaxResize	('#div_List', '#div_Ent');
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_MinResize	('#div_List', '#div_Ent');
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_Minimize	();
			}catch(e) {		
				console.log(e);
				do_gl_exception_send(App.path.BASE_URL_API,  "cfg.", "Main", "do_lc_show", e.toString()) ;
			}
		};
	};

	return CtrlMain;
  });