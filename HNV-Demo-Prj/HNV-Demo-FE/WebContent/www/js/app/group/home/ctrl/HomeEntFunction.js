define([
        'jquery',
        'text!group/home/tmpl/Home_Ent_Function.html'

        ],
        function($, 
        		Home_Ent_Funct) {


	var HomeEntFunction     = function (header, content, footer, grpName) {
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
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		
		//-----------------------------------------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		var pr_lock					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.Home.Main;
			pr_ctr_List 			= App.controller.Home.List;
			pr_ctr_Ent				= App.controller.Home.Ent;	
			
			tmplName.HOME_ENT_FUNCTION	= "Home_Ent_Function";
			tmplCtrl.do_lc_put_tmpl(tmplName.HOME_ENT_FUNCTION	, Home_Ent_Funct); 		
		}
		
		//---------show-----------------------------------------------------------------------------	
		this.do_lc_show		= function(obj, selectedDomain){			
			pr_obj 	= obj;
			
			if(!selectedDomain) return;
			
			functs = selectedDomain.child;
			if(!functs)			return;
			
			

			$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.HOME_ENT_FUNCTION, functs));
			
			do_gl_enhance_within($(pr_divContent));
			do_binding_event(obj);
		}
		
		var do_binding_event = function(obj) {
			$(".sp_favorite").on("click", function(event) {
				var id = $(this).data("id");
				if($(this).hasClass("star-off")) {
					do_add_remove_favorite($(this), id, 1, obj);
				} else {
					do_add_remove_favorite($(this), id, 2, obj);
				}
			});
		}
		
		/**
		 * mode 1: add, 2: remove
		 */
		var do_add_remove_favorite = function(abtn, functId, mode, obj) {
			
			ref = req_gl_Request_Content_Send("ServiceSysHome", "SVSysFunctFavoriteMod");
			ref.mode 	= mode;
			ref.id 		= functId;
			
			var fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_add_remove_favorite_response, [mode, functId, abtn, obj]));	
			
			var fError 		= req_gl_funct(App, self.do_show_Msg, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
			
		}
		
		var do_add_remove_favorite_response = function(sharedJson, mode, functId, abtn, obj) {
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				if(mode == 1) {
					abtn.removeClass("star-off");
					abtn.addClass("star-on");
					$.each(obj, function(i, e) {
						var children = e.child;
						$.each(children, function(ic, ec){
							if(ec.id == functId) {
								ec.val04 = 1;
							}
						});
					});
				} else {
					abtn.removeClass("star-on");
					abtn.addClass("star-off");
					var children = obj.child;
					$.each(obj, function(i, e) {
						var children = e.child;
						$.each(children, function(ic, ec){
							if(ec.id == functId) {
								ec.val04 = undefined;
							}
						});
					});
				}
				
				pr_ctr_List.do_lc_show(obj);
				App.data.domains = obj;
				do_gl_LocalStorage_Save("app_domains", obj);
			}
		}
	}

	return HomeEntFunction;
});