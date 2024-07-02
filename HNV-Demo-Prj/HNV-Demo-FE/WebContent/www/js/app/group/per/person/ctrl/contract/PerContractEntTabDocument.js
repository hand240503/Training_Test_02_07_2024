define([
        'jquery',
        'text!template/per/contract/PerContract_Ent_Tab_Document.html'      

        ],
        function($,
        		PerContract_Ent_Tab_Document    		
        		) {


	var PerContractEntTabDocument     = function (header,content,footer, grpName) {
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
		
		var invInvoiceType = 1;
		//------------------------------------------------------------------------------------
		
		var pr_tableNewLineId 	= 0;
		var pr_table			= undefined;
		var pr_news_line_data	= undefined;
		
		var defautNumberFormat 	= "#,###.##";
		
		var pr_SERVICE_CLASS	= "ServiceSorOrder";
//		var pr_SV_MAT_SEARCH	= "SVMatStockIoOrderMatSearch";
//		var pr_SV_REQ_DETAIL	= "SVMatStockIoOrderReqDetail";
		
		//--------------------Cache-------------------------------------
		var pr_cache_material_by_search_key = {};
		var pr_cache_unit_by_mat_id = {};
		
		
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;
		
	
		//-----------------------------------------------------------------------------------
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
		}
		
		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;
			
			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_ENT_TAB_DOCUMENT, PerContract_Ent_Tab_Document); 			
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_ENT_TAB_DOCUMENT, obj));
				
				do_bind_event (obj, mode);
			}catch(e) {
				console.log(e);
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.contract", "PerContractTabDoc", "do_lc_show", e.toString()) ;
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
	
	return PerContractEntTabDocument;
});