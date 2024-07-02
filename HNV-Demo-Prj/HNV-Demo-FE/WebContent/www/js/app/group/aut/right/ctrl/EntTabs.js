define([
        'jquery',
        'text!group/aut/right/tmpl/Ent_Tabs.html'

//		'group/aut/right/ctrl/EntTab01' 
        ],
        function($, 
        		Tmpl_Ent_Tabs      
        		
//        		CtrlEntTab01
        		) {


	var CtrlEntTabs     = function (header, content, footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;

		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName;
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

		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntTabs 			= null;
		
		//-------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			tmplName.ENT_TABS					= "EntTabs";
			tmplCtrl.do_lc_put_tmpl(tmplName.ENT_TABS, Tmpl_Ent_Tabs); 	
			
//			if (!App.controller[pr_grpName].EntTab01	)  
//			 App.controller[pr_grpName].EntTab01= new CtrlEntTab01			(null, "#div_Ent_Tab_01", null, pr_grpName);
			
			pr_ctr_Main 			= App.controller[pr_grpName].Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;
			
			pr_ctr_Ent				= App.controller[pr_grpName].Ent;
			pr_ctr_EntTabs 			= App.controller[pr_grpName].EntTabs;
//			pr_ctr_EntTab_01		= App.controller[pr_grpName].EntTab01;
			
		}     
		this.do_lc_show		= function(obj, mode){
			try{
				pr_obj 	= obj;
				pr_mode		= mode;
				
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_TABS, obj));
				
				//fixed max-height scroll of % height div_ContentView
//				do_gl_calculateScrollBody(pr_divContent + " .custom-scroll-tab", 43.6);
							
//				pr_ctr_EntTab_01.do_lc_show(pr_obj, pr_mode);
				
				do_bind_event(obj, mode);
			}catch(e) {			
				console.log(e);
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "aut.right", "EntTabs", "do_lc_show", e.toString()) ;
			}
		};
		

		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			
		}

	};


	return CtrlEntTabs;
});