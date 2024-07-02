define([
		'require','jquery',
        
        'text!group/home/tmpl/Home_Main.html',
        
        'group/home/ctrl/HomeList',
        'group/home/ctrl/HomeEnt',
        'group/home/ctrl/HomeEntFunction'
        ],
        function(	require, $,    
        		
        			Home_Main, 
        			
        			HomeList, 
        			HomeEnt, 
        			HomeEntFunction
        ) {

	var HomeMain 	= function (header, content, footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpPath				= 'main/home/';
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
					
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			App.data["HttpSecuHeader"]				= req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL);
			do_gl_refresh_SecuHeader();
			//---------------------------------------------------------------
			
			tmplName.HOME_MAIN			= "Home_Main";
			tmplCtrl.do_lc_put_tmpl(tmplName.HOME_MAIN	, Home_Main); 
			//---------------------------------------------------------------
			if (!App.controller.Home)				
				 App.controller.Home			= {};
			
			if (!App.controller.Home.Main)	
				App.controller.Home.Main 		= this; //important for other controller can get ref, when new this controller,
			
			if (!App.controller.Home.List		)  
				 App.controller.Home.List		= new HomeList			(null, "#div_Home_List_Bookmark" 	, null, grpName);				
			if (!App.controller.Home.Ent		)  
				 App.controller.Home.Ent		= new HomeEnt			(null, "#div_Home_Ent" 				, null, grpName);
			if (!App.controller.Home.EntFunct	)  
				 App.controller.Home.EntFunct	= new HomeEntFunction	(null, "#div_Home_Ent_Function" 	, null, grpName);

			//--------------------------------------------------------------------------------------------------
			
			App.data["HttpSecuHeader"]		= req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL);
			
			App.controller.Home.List		.do_lc_init();
			App.controller.Home.Ent			.do_lc_init();
			App.controller.Home.EntFunct	.do_lc_init();
			
			
		}
		
		
		this.do_lc_show = function(){
			try { 
				
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.HOME_MAIN, {}));	
				
//				do_get_list_domain();
				
				if(App.data.domains) {
					App.controller.Home.Ent	.do_lc_show(App.data.domains);
					App.controller.Home.List.do_lc_show(App.data.domains);
				}else{
					if (pr_domain_requesting){
						setTimeout(function(){
							self.do_lc_show();
						},200);
					}else{
						self.req_domain_list (self.do_lc_show);
					}
				}
	
			} catch(e) {
				console.log(e);
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "home", "HomeMain", "do_lc_show", e.toString()) ;
			}
		};
		
		this.req_domain_list = function(callback) {
			
			if(App.data.domains) {
				callback(App.data.domains);
			} else {
				var data = req_gl_LocalStorage("app_domains");
				if (data){
					App.data.domains = data;
					callback(App.data.domains);
				}else{
					do_get_list_domain(callback);
				}				
			}
		}
		
		var pr_domain_requesting = false;
		//---------private-----------------------------------------------------------------------------
		var do_get_list_domain= function(callback){
			//ajax to get all fix values here			
			var ref 		= req_gl_Request_Content_Send('ServiceSysHome', 'SVSysDomainLst');			
		
			var fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_get_list_domain_response, [callback]));	
			
			var fError 		= req_gl_funct(App, self.do_show_Msg, [$.i18n("common_err_ajax")]);	
			
			pr_domain_requesting = true;
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
		var do_get_list_domain_response = function(sharedJson, callback) {
			pr_domain_requesting = false;
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				var data = sharedJson[App['const'].RES_DATA];
				App.data.domains = data;
				do_gl_LocalStorage_Save("app_domains", data);
				
				if(callback) {
					callback(data);
				} 
			}
		}

		//--------------------------------------------------------------------------------------------
		this.do_show_Msg= function(sharedJson, msg){
			//alert(msg);
			console.log("do_show_Msg::" + msg);
		}		
			
	};

	return HomeMain;
  });