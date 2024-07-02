define([
        'jquery',
        'text!template/per/contract/PerContract_Ent_Tab_History.html'      
        ],
        function($,
        		PerContract_Ent_Tab_History    		
        		) {


	var PerContractEntTabHistory     = function (header,content,footer, grpName) {
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
		
	
		//-----------------------------------------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		
		var format 					= req_gl_Date_LocalFormat();
		//--------------------APIs--------------------------------------//
		var pr_default_new_line	= {
				dt 			: null,
				stat		: null,
				cmt			: null,
				val01		: null,
				val02		: null,
				parType		: null,
				parId		: null,
				uId			: null
		};
		
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
				tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_ENT_TAB_HISTORY, PerContract_Ent_Tab_History); 			
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_ENT_TAB_HISTORY, obj));
				
				do_bind_event (obj, mode);
			}catch(e) {				
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.contract", "PerContractEntTabGeneral", "do_lc_show", e.toString()) ;
			}
		};

		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			var additionalConfig = {
					"stat": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							if(oData.stat != null){
								if(oData.stat == 0){
									$(nTd).html($.i18n("per_contract_ent_tab_history_stat_01"))
								}else if(oData.stat == 1){
									$(nTd).html($.i18n("per_contract_ent_tab_history_stat_02"));
								}else if(oData.stat == 2){
									$(nTd).html($.i18n("per_contract_ent_tab_history_stat_03"));
								}else {
									$(nTd).html($.i18n("per_contract_ent_tab_history_stat_04"));
								} 
							} else {
								$(nTd).html("");
							} 
						},
					},
					"dt": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							if(oData.dt != null){
			    				$(nTd).html(DateFormat(oData.dt, format));  
							} else {
								$(nTd).html("");
							} 
						},
					},
			}

			req_gl_create_datatable(obj, "#table_per_contract_history", additionalConfig, pr_default_new_line, null);
		}.bind(this);
	};


	return PerContractEntTabHistory;
});