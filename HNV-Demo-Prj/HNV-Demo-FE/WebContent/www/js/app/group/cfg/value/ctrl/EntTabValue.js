define([
        'jquery',
        'text!group/cfg/value/tmpl/Ent_Tab_Value.html'

        ],
        function($,
        		Tmpl_Ent_Tab_Value    		
        		) {


	var CtrlEntTab01     = function (header, content, footer, grpName) {
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
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		
		var pr_default_new_line	= {
				id		: 0,
				code	: null,
				v01		: null,
				v02		: null,
				v03		: null,
				v04		: null,
				v05		: null
		};
		//-----------------------------------------------------------------------------------
		var pr_obj				= null;
		var pr_mode					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			tmplName.ENT_TAB_VALUE 	= "ENT_TAB_VALUE";
			tmplCtrl.do_lc_put_tmpl(tmplName.ENT_TAB_VALUE, Tmpl_Ent_Tab_Value); 	
			
			pr_ctr_Main 			= App.controller[pr_grpName].Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;
			pr_ctr_Ent				= App.controller[pr_grpName].Ent;
		}
		
		this.do_lc_show		= function(obj, mode){
			try{
				pr_obj 		= obj;
				pr_mode		= mode;	
				
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_TAB_VALUE, obj));
				
				do_show_values_table(obj);
				do_bind_event (obj, mode);
			}catch(e) {	
				console.log(e);
				//do_gl_exception_send(App.path.BASE_URL_API_PRIV, "cfg.", "EntTabValue", "do_lc_show", e.toString()) ;
			}
		};


		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			
		}
		
		//-------------------------------------------------------------------
		var do_show_values_table = function(obj) {
			req_gl_datatable ({
				tabData		: obj,
				tabId 		: "#tab_CfgGroup_Values",
				tabColConf 	: {},
				tabLineDef	: pr_default_new_line,
				tabFCallback: do_TabBuilt_callback
			});
			
//			var oTable 		= req_gl_create_datatable(obj, "#tab_CfgGroup_Values", {}, 
//				pr_default_new_line, 
//				do_TabBuilt_callback,
//				null
//			);			
		}
		var do_TabBuilt_callback = function(table) {
			do_gl_disable_edit($(pr_divContent));
			
			if(pr_mode == App['const'].MODE_NEW) {
				do_gl_enable_edit($(pr_divContent));

			} else if(pr_mode == App['const'].MODE_MOD) {
				do_gl_enable_edit($(pr_divContent));
				
//					if(pr_obj.type >= 1){
//					do_gl_enable_edit($(pr_divContent));
//					}
//					if(pr_mode == App['const'].MODE_MOD && pr_obj.type < 2)
//					$(pr_divContent).find("#btn_add").hide();
//					if(pr_obj.type != 3)
//					$("#tab_CfgGroup_Values .a_delete").hide();
			}
		}
	};

	return CtrlEntTab01;
});