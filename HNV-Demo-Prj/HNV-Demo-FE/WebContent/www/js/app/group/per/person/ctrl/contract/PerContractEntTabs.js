define([
        'jquery',
        'text!template/per/contract/PerContract_Ent_Tabs.html'

        ],
        function($, 
        		PerContract_Ent_Tabs        		
        		) {


	var PerContractEntTabs     = function (header,content,footer, grpName) {
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

		var pr_ctr_EntTab00			= null;
		var pr_ctr_EntTab01			= null;
		var pr_ctr_EntTab02			= null;
		
		//-------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.PerContract.Main;
			pr_ctr_List 			= App.controller.PerContract.List;
			
			pr_ctr_Ent				= App.controller.PerContract.Ent;
			pr_ctr_EntHeader 		= App.controller.PerContract.EntHeader;
			pr_ctr_EntBtn 			= App.controller.PerContract.EntBtn;
			pr_ctr_EntTabs 			= App.controller.PerContract.EntTabs;		
			
			pr_ctr_EntTabInfo		= App.controller.PerContract.EntTabInfo;	
			pr_ctr_EntTabDetail		= App.controller.PerContract.EntTabDetail;	
			pr_ctr_EntTabDocument	= App.controller.PerContract.EntTabDocument;	
			pr_ctr_EntTabHistory	= App.controller.PerContract.EntTabHistory;	
			pr_ctr_EntTabContent	= App.controller.PerContract.EntTabContent;	
		}     
		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;
			
			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_ENT_TABS, PerContract_Ent_Tabs); 			
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_ENT_TABS, obj));
				
				//fixed max-height scroll of % height div_ContentView
//				do_gl_calculateScrollBody(pr_divContent + " .custom-scroll-tab", 43.6);
//							
				pr_ctr_EntTabInfo		.do_lc_show(pr_obj, pr_mode);
				pr_ctr_EntTabDetail		.do_lc_show(pr_obj, pr_mode);
				pr_ctr_EntTabDocument	.do_lc_show(pr_obj, pr_mode);
				pr_ctr_EntTabHistory	.do_lc_show(pr_obj, pr_mode);
				pr_ctr_EntTabContent	.do_lc_show(pr_obj, pr_mode);
				do_bind_event(obj, mode);
			}catch(e) {				
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.contract", "PerContractEntTabs", "do_lc_show", e.toString()) ;
			}
		};
		
		this.do_lc_save		= function(obj, mode){
			return req_gl_data({
				dataZoneDom 	: $(pr_divContent),
				removeDeleted	: true	
			});
		}
		

		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			
		}

	};


	return PerContractEntTabs;
});