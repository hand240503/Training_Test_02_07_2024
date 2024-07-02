define([
        'jquery',
        'text!group/per/producer/tmpl/Ent_Tab_Doc.html'  

        ],
        function($,
        		Tmpl_Ent_Tab_Doc    		
        		) {


	var CtrlEntTabDoc     = function (header, content, footer, grpName) {
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

		var self 					= this;
		//------------------------------------------------------------------------------------
		//--------------------Cache-------------------------------------
		var pr_cache_post_by_search_key = {};
		var pr_cache_unit_by_nso_id = {};
		
		
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntTabs 			= null;
		
		//-----------------------------------------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller[pr_grpName].Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;

			pr_ctr_Ent				= App.controller[pr_grpName].Ent;
			pr_ctr_EntTabs 			= App.controller[pr_grpName].EntTabs;
			
			tmplName.ENT_TAB_DOC	= "Tmpl_Ent_Tab_Doc";
			tmplCtrl.do_lc_put_tmpl(tmplName.ENT_TAB_DOC, Tmpl_Ent_Tab_Doc); 		
		}
		
		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;
			
			try{
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_TAB_DOC, obj));
				do_bind_event (obj, mode);
			}catch(e) {
				console.log(e);
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.producer", "EntTabDoc", "do_lc_show", e.toString()) ;
			}
		};


		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			
			pr_mode = mode;
			if(mode == App['const'].MODE_NEW) {
			} else {
			}
		}.bind(this);
	};
	
	return CtrlEntTabDoc;
});