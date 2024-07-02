define([
        'jquery',
        'text!group/aut/user/tmpl/Aut_User_Ent_Tabs.html'
        


        ],
        function($, 
        		AutUser_Ent_Tabs        		
        		) {


	var AutUserEntTabs     = function (header,content,footer, grpName) {
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

		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;
		var pr_ctr_EntTab01         = null;
		var pr_ctr_EntTab02         = null;
		var pr_ctr_EntTabFiles      = null;
		var pr_ctr_EntTabPost       = null;
		var pr_ctr_EntTabCat      	= null;
		
		//-------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.AutUser.Main;
			pr_ctr_List 			= App.controller.AutUser.List;
			
			pr_ctr_Ent				= App.controller.AutUser.Ent;
			pr_ctr_EntHeader 		= App.controller.AutUser.EntHeader;
			pr_ctr_EntBtn 			= App.controller.AutUser.EntBtn;
			pr_ctr_EntTabs 			= App.controller.AutUser.EntTabs;
			pr_ctr_EntTab01			= App.controller.AutUser.EntTab01;
//			pr_ctr_EntTab02			= App.controller.AutUser.EntTab02;
			pr_ctr_EntTabFiles		= App.controller.AutUser.EntTabFiles;
//			pr_ctr_EntTabPost		= App.controller.AutUser.EntTabPost;
//			pr_ctr_EntTabCat		= App.controller.AutUser.EntTabCat;
//			pr_ctr_EntTabContact	= App.controller.AutUser.EntTabContact;
			
		}     
		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;
			
			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.AUT_USER_ENT_TABS, AutUser_Ent_Tabs); 			
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.AUT_USER_ENT_TABS, obj));
				
				//fixed max-height scroll of % height div_ContentView
				//do_gl_calculateScrollBody(pr_divContent + " .custom-scroll-tab", 43.6);
							
				pr_ctr_EntTab01			.do_lc_show(pr_obj, pr_mode);
//				pr_ctr_EntTab02			.do_lc_show(pr_obj, pr_mode);
				pr_ctr_EntTabFiles		.do_lc_show(pr_obj, pr_mode);
//				pr_ctr_EntTabContact	.do_lc_show(pr_obj, pr_mode);
//				if(mode != App['const'].MODE_NEW)
//					pr_ctr_EntTabPost	.do_lc_show(pr_obj, pr_mode);
//				if(obj.typ==6){			// for mentor
//					
//				}
//				if(obj.typ==6){
//					$("#li_AutUser_Ent_Tab_Cat		, #div_AutUser_Ent_Tab_Cat"		)	.removeClass("hide"		);
//					pr_ctr_EntTabCat	.do_lc_show(pr_obj, pr_mode);	
//				}
//				else{
//					$("#li_AutUser_Ent_Tab_Cat		, #li_AutUser_Ent_Tab_Cat"		)	.addClass	("hide"		);
//				}
				do_bind_event(obj, mode);
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_Minimize();
			
			}catch(e) {				
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "aut.user", "AutUserEntTabs", "do_lc_show", e.toString()) ;
			}
		};
		

		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			
		}

	};


	return AutUserEntTabs;
});