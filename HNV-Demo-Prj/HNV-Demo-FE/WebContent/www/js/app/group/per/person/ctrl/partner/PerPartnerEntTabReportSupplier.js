define([
	'jquery',
	'text!template/per/partner/PerPartner_Ent_Tab_Report_Supplier.html'
	],
	function($,
			PerPartner_Ent_Tab_Report_Supplier
	) {

	var PerPartnerEntTabReportSupplier     = function (header,content,footer, grpName) {
		var pr_divHeader 			= header  ? $(header) : null;
		var pr_divContent 			= content ? $(content): null;
		var pr_divFooter 			= footer  ? $(footer) : null;

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
		var pr_OBJ_TYPE				= 100;
		var pr_parentId				= null;
		var pr_typeBankAcc			= 2;
		
		var pr_type_inv_in			= 1;
		var pr_type_inv_out			= 2;
		
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;
		
		var pr_default_new_line_mat	= {
				code04 		: null,
				name01 		: null,
				name02		: null,
				unitRef		: null,
				stat		: null,
				code01		: null,
				code02		: null,
				code03		: null,
		};
		
		var pr_default_new_line_inv_detail	= {
				code04 		: null,
				invNum 		: null,
				invSuppl	: null,
				code		: null,
				name		: null,
				quan		: null,
				unit		: null,
				val01		: null,
				val02		: null,
				val03		: null,
				val05		: null,
				val06		: null,
				id			: null,
				invId		: null,
		};
		
		//-----------------------------------------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.Per.Main;
			pr_ctr_List				= App.controller.Per.List;
			pr_ctr_Ent				= App.controller.Per.Ent;
			pr_ctr_EntHeader 		= App.controller.Per.EntHeader;
			pr_ctr_EntBtn 			= App.controller.Per.EntBtn;
			pr_ctr_EntTabs 			= App.controller.Per.EntTabs;
			
			tmplName.PER_PARTNER_ENT_TAB_REPORT_SUPPLIER = "PerPartner_Ent_Tab_Report_Supplier";
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_PARTNER_ENT_TAB_REPORT_SUPPLIER, PerPartner_Ent_Tab_Report_Supplier); 	
		}

		this.do_lc_show		= function(obj, mode){
			pr_obj 				= obj;
			pr_mode					= mode;
			pr_parentId 			= obj.id;
			try{
				$("#div_PerPartner_Ent_Tab_Report").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_PARTNER_ENT_TAB_REPORT_SUPPLIER, {}));
				do_get_provider_mat_lst(obj);
//				do_get_provider_inv_detail_lst_dyn(obj);
			}catch(e) {
				do_gl_show_Notify_Msg_Error("PerPartnerEntTabReportSupplier: " + e.toString());
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.partner", "PerPartnerEntTabReportSupplier", "do_lc_show", e.toString()) ;
			}
		};
		
		//---------Bind Event-------------------------------------
		function do_bind_event(){
		}
		
		function do_get_provider_mat_lst(obj){
			var ref 			= {};
			ref[svClass] 		= "ServicePerPerson"; 
			ref[svName]			= "SVPerSupplierMatMaterialLst"; 
			ref[userId]			= App.data.user.id;
			ref[sessId]			= App.data.session_id;
			ref["supplierId"]	= obj.id;
			
			var fSucces			= [];
			fSucces.push(req_gl_funct(null, do_show_provider_mat_lst));

			var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}
		
		function do_show_provider_mat_lst(sharedJson){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				var obj = {};
				obj.lstProducerMat = sharedJson.res_data;
				var additionalConfig = {
					"stat": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							if(oData.stat != null){
								if(oData.stat == 0){
									$(nTd).html($.i18n("mat_material_status_00"))
								}else if(oData.stat == 1){
									$(nTd).html($.i18n("mat_material_status_01"));
								}else {
									$(nTd).html($.i18n("mat_material_status_02"));
								} 
							} else {
								$(nTd).html("");
							} 
						},
					},
					"unitRef": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							var lstUnit = App.data.unitRef;
							$.each(lstUnit, function(i, o){
								if(oData.unitRef == o.id){
									$(nTd).html(o.name);
								}
							})
						},
					},
				}
				
				req_gl_create_datatable(obj, "#div_PerPartner_Ent_Tab_report_Supplier_Mat", additionalConfig, pr_default_new_line_mat, function(){
//					if(pr_mode == App['const'].MODE_MOD || pr_mode == App['const'].MODE_NEW) {
//							do_gl_enable_edit($(pr_divContent));
//						}
				});
			} else {
				//TODO do something here
				//notify here
			}		
		}
		
		function do_get_provider_inv_detail_lst_dyn(obj){
			var ref 			= {};
			ref[svClass] 		= "ServiceInvInvoiceDyn"; 
			ref[svName]			= "SVInvInvoiceBuyLstDyn"; 
			ref[userId]			= App.data.user.id;
			ref[sessId]			= App.data.session_id;
			ref["providerId"]	= obj.id;
			ref["typ02"]		= 1; //typ02 = 1: hóa đơn nhập; 2: hóa đơn xuất
			
			var lang = localStorage.language;
			if (lang ==null ) lang = "en";
			var div ="#div_PerPartner_Ent_Tab_report_Supplier_Inv_Detail";
			
			var filename = "www/js/lib/datatables/datatable_"+lang+".json";
			
			var colConfig	= req_gl_table_col_config($(div).find("table"), null, {});		        
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax")]);	
			var oTable 		= req_gl_Datatable_Ajax_Dyn		(div, App.path.BASE_URL_API_PRIV, pr_App.data["HttpSecuHeader"], filename, colConfig, ref, fError, 1000, null, null, do_bind_list_event , { "order": [[ 0, "desc" ]]}, false);
		}
		
		//--------------------------------------------------------------------------------------------
		function do_bind_list_event(data, div, oTable) {
			do_gl_enhance_within($(div));
			$(div).find('.table-datatableDyn tbody').off('click', 'tr');
			$(div).find('.table-datatableDyn tbody').on('click', 'tr', function(){
				do_gl_Add_Class_List_All(div, $(this), "selected");
				
				var oData = oTable.fnGetData(this);
				
				if(oData.typ01 == pr_type_inv_in)
					window.open("view_inv_invoice_in.html"+"?id="+oData.id);
				if(oData.typ01 == pr_type_inv_out)
					window.open("view_inv_invoice_out.html"+"?id="+oData.id);
			});
		}
	};

	return PerPartnerEntTabReportSupplier;
});