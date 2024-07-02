define([
        'jquery',
        'text!group/home/tmpl/Home_Ent.html'

        ],
        function($, 
        		Home_Ent) {


	var HomeEnt     = function (header, content, footer, grpName) {
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
			pr_ctr_EntFunct			= App.controller.Home.EntFunct;
			
			tmplName.HOME_ENT			= "Home_Ent";
			tmplCtrl.do_lc_put_tmpl(tmplName.HOME_ENT	, Home_Ent); 		

			
			
		}
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show		= function(obj){			
			pr_obj 	= obj;
			
			
			$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.HOME_ENT, obj));
			
			do_gl_enhance_within($(pr_divContent));
			do_binding_event(obj);
			
			pr_ctr_EntFunct.do_lc_show(obj, obj[0]);
		}
		
		var do_binding_event = function(obj) {
			$(".a_domain").on("click", function(i, e) {
				//apply CSS style
				do_gl_Add_Class_List($(this).parent(), $(this), "selected");
				
				var index = $(this).data("index");
				var domain = obj[index];
				pr_ctr_EntFunct.do_lc_show(obj, domain);
			});
		}
	}

	return HomeEnt;
});