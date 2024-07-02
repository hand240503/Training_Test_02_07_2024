define([
        'jquery',
        'text!template/per/contract/PerContract_List_Init_Header.html',  
        'text!template/per/contract/PerContract_List_Init_Content.html',
        
        'text!template/per/contract/PerContract_List_Ok_Header.html',  
        'text!template/per/contract/PerContract_List_Ok_Content.html',
        
        'text!template/per/contract/PerContract_List_Calcel_Header.html',  
        'text!template/per/contract/PerContract_List_Calcel_Content.html',
        
        'text!template/per/contract/PerContract_List_Expired_Header.html',  
        'text!template/per/contract/PerContract_List_Expired_Content.html',
        
        'text!template/per/contract/PerContract_List_Filter_Header.html', 
        'text!template/per/contract/PerContract_List_Filter_Content.html',
    	'text!template/per/contract/PerContract_List_Filter_Box.html', 

        ],
        function($, 
        		PerContract_List_Init_Header,
        		PerContract_List_Init_Content,
        		
        		PerContract_List_Ok_Header,
        		PerContract_List_Ok_Content,
        		
        		PerContract_List_Calcel_Header,
        		PerContract_List_Calcel_Content,
        		
        		PerContract_List_Expired_Header,
        		PerContract_List_Expired_Content,
        		
        		PerContract_List_Filter_Header,
        		PerContract_List_Filter_Content,
    			PerContract_List_Filter_Box
        ) 
        {

	var PerContractList 	= function (header,content,footer, grpName) {
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
		var pr_SERVICE_CLASS		= "ServicePerContract"; //to change by your need
		
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
		
		//-----------------------------------------------------------------------------------
		var varname					= "varname";
		var format 					= req_gl_Date_LocalFormat();
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.PerContract.Main;
			pr_ctr_List 			= App.controller.PerContract.List;
			
			pr_ctr_Ent				= App.controller.PerContract.Ent;
			pr_ctr_EntHeader 		= App.controller.PerContract.EntHeader;
			pr_ctr_EntBtn 			= App.controller.PerContract.EntBtn;
			pr_ctr_EntTabs 			= App.controller.PerContract.EntTabs;			
		}
		
		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(div, stat){               
			try{
				do_lc_load_view(div, stat);
				do_get_list_ByAjax_Dyn(div, stat);
			}catch(e) {				
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.contract", "PerContractList", "do_lc_show", e.toString()) ;
			}
		};
		
		var do_lc_load_view = function(div, stat){
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_LIST_INIT_HEADER		, PerContract_List_Init_Header); 
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_LIST_INIT_CONTENT	, PerContract_List_Init_Content); 
			
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_LIST_OK_HEADER		, PerContract_List_Ok_Header); 
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_LIST_OK_CONTENT		, PerContract_List_Ok_Content); 
			
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_LIST_CALCEL_HEADER	, PerContract_List_Calcel_Header); 
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_LIST_CALCEL_CONTENT	, PerContract_List_Calcel_Content);
			
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_LIST_EXPIRED_HEADER	, PerContract_List_Expired_Header); 
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_LIST_EXPIRED_CONTENT	, PerContract_List_Expired_Content);
			
			switch (stat) {
			case 0:
				$("#div_PerContract_List_Init_Header")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_LIST_INIT_HEADER		, {}));
				$("#div_PerContract_List_Init_Content")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_LIST_INIT_CONTENT		, {}));
				break;
			case 1:
				$("#div_PerContract_List_Ok_Header")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_LIST_OK_HEADER		, {}));
				$("#div_PerContract_List_Ok_Content")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_LIST_OK_CONTENT		, {}));
				break;		
			case 2:
				$("#div_PerContract_List_Calcel_Header")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_LIST_CALCEL_HEADER	, {}));
				$("#div_PerContract_List_Calcel_Content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_LIST_CALCEL_CONTENT	, {}));
				break;
			case 3:
				$("#div_PerContract_List_Expired_Header")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_LIST_EXPIRED_HEADER	, {}));
				$("#div_PerContract_List_Expired_Content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_LIST_EXPIRED_CONTENT	, {}));
				break;
			}
		}
		
		this.do_lc_refresh = function(){			
			$(pr_divHeader).find(".data-list").each(function(i, e) {
				$(this).find("#div_PerContract_List_Content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_LIST_CONTENT	, {}));
				var stat = $(this).data("stat");
				do_get_list_ByAjax_Dyn	(this, stat);
			});
		}
		
		this.do_lc_show_filter = function(div, stat){               
			var rightSocMa = pr_ctr_Main.do_verify_user_right_soc_manage();
			if(rightSocMa)
				do_load_view_filter();
			else
				$("#div_PerContract_List_Filter").hide();
		};
		
		var do_load_view_filter = function(){
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_LIST_FILTER_HEADER			, PerContract_List_Filter_Header); 
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_LIST_FILTER_CONTENT			, PerContract_List_Filter_Content); 
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_LIST_FILTER_BOX				, PerContract_List_Filter_Box); 
			$("#div_PerContract_List_Filter_Header")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_LIST_FILTER_HEADER	, {}));
			$("#div_PerContract_List_Filter_Box")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_LIST_FILTER_BOX		, {}));
			do_wait_bind_event_filter();
		}
		
		var do_wait_bind_event_filter = function(){
			if(App.data["LstSociete"] && App.data["LstSocieteChild"]){
				do_lc_bind_event_filter();
			}else{
				setTimeout(do_wait_bind_event_filter, 200);
			}
		}
							
		//--------------------------------------------------------------------------------------------
		function do_get_list_ByAjax_Dyn(div, stat, varname, socId){	
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, "SVPerContractLstDyn");
			ref.stat		= stat;
			
			if(socId)	ref["socId"]		= socId;
			
			var lang = localStorage.language;
			if (lang ==null ) lang = "en";	
			
			var filename = "www/js/lib/datatables/datatable_"+lang+".json";
			
			var additionalConfig = {
					"dt01": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							if(oData.dt01 != null){
			    				$(nTd).html(DateFormat(oData.dt01, format));  
							} else {
								$(nTd).html("");
							} 
						},
					},
			}		
			var colConfig	= req_gl_table_col_config($(div).find("table"), null, additionalConfig);
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax")]);	
			
			var oTable 		= req_gl_Datatable_Ajax_Dyn(div, App.path.BASE_URL_API_PRIV, pr_App.data["HttpSecuHeader"], filename, colConfig, ref, fError, undefined, ".table-datatable", undefined, do_bind_list_event);
		}
		
		//--------------------------------------------------------------------------------------------
		var do_bind_list_event = function(data, div, oTable, params) {
			do_gl_enhance_within($(div), {div: div});
			
			$(div).find('.table-datatable tbody').off('click', 'tr');
			$(div).find('.table-datatable').on('click', 'tr', function(){
				if(App.data.mode == App['const'].MODE_MOD || App.data.mode == App['const'].MODE_NEW) {
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_sel'));
					return;
				}	
				do_gl_Add_Class_List_All(pr_divContent, $(this), "selected");		

				var oData	= oTable.fnGetData(this);
				pr_ctr_Ent.do_lc_show_ById(oData.id, App['const'].MODE_SEL);	
		
			});
		};
		
		//--------------------------------------------------------------------------------------------
		var do_lc_bind_event_filter = function(){
			do_gl_autocomplete({
				el: $("#PerContract_List_Societe_Name"),
				required: true,
				source: App.data["LstSociete"].concat(App.data["LstSocieteChild"]),
				selectCallback: function(item ) {
					$("#PerContract_List_Societe_Id")		.val(item.id);
					$("#PerContract_List_Societe_Name")		.val(item.name01);
				},
				renderAttrLst: ["name01"],
				minLength: 0,
			});

			$("#btn_per_contract_filter_submit").off("click");
			$("#btn_per_contract_filter_submit").on("click", function(){
				var filter = req_gl_data({
					dataZoneDom : $("#frm_filter_per_contract")
				});
				
				var socId = filter.data.id;

				$("#div_PerContract_List_Filter_Content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_LIST_FILTER_CONTENT	, {}));
				do_get_list_ByAjax_Dyn("#div_PerContract_List_Filter_Content", null, null, socId);
			});

			$("#btn_per_contract_filter_reset").off("click");
			$("#btn_per_contract_filter_reset").on("click", function(){
				$("#div_PerContract_List_Filter_Content")	.html("");
			});
			do_gl_init_show_box($("#div_PerContract_List_Filter"));
		}
	};

	return PerContractList;
  });