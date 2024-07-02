define([
	'jquery',
	
//	'text!template/shp/perInfo/Per_List_New_Header.html',
//	'text!template/shp/perInfo/Per_List_New_Content.html',
	 
    'text!template/shp/perInfo/Per_List_Client_Header.html',
//    'text!template/shp/perInfo/Per_List_Prospect_Header.html',
    'text!template/shp/perInfo/Per_List_Producer_Header.html',  
    'text!template/shp/perInfo/Per_List_Supplier_Header.html',
    'text!template/shp/perInfo/Per_List_Thirdparty_Header.html',
    
//    'text!template/shp/perInfo/Per_List_Doctor_Header.html',
   
     
    'text!template/shp/perInfo/Per_List_Content.html'
     
//    'text!template/shp/perInfo/Per_List_Filter_Header.html',  
// 	'text!template/shp/perInfo/Per_List_Filter_Box.html',

	],
	function($,
//			Per_List_New_Header,
//			Per_List_New_Content,
			
			Per_List_Client_Header,
//			Per_List_Prospect_Header,
			Per_List_Producer_Header,
			Per_List_Supplier_Header,
			Per_List_Thirdparty_Header,
			
//			Per_List_Doctor_Header,
			
			
			Per_List_Content
			
//			Per_List_Filter_Header,
//			Per_List_Filter_Box
	) 
	{

	var PerList 	= function () {

		//------------------------------------------------------------------------------------
		var tmplName				= App.template.names;
		var tmplCtrl				= App.template.controller;

		var svClass 				= App['const'].SV_CLASS;
		var svName					= App['const'].SV_NAME;
		var sessId					= App['const'].SESS_ID;
		var userId          		= App['const'].USER_ID;
		var userRight          		= App['const'].USER_RIGHT;
		
		var fVar					= App['const'].FUNCT_SCOPE;
		var fName					= App['const'].FUNCT_NAME;
		var fParam					= App['const'].FUNCT_PARAM;		
		
		var self 					= this;
		var rights					=  App.controller.Per.Rights;
		
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List		 		= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;	

		//-----------------------------------------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;

		//-----------------------------------------------------------------------------------
		var typeCompany				= 1010010;

		var typePartnerClient		= 1010002;
		var typePartnerProspect		= 1010007;
		
		var typePartnerSupplier		= 1010003;
		var typePartnerProducer		= 1010004;
		var typePartnerDoctor		= 1010005;
		var typePartnerThirdparty	= 1010006;
		
		var typePersonMoral			= 1000001;
		var typePersonNatural		= 1000002;
		
		var pageClient				= 1; 
		var pagePartner				= 2;
		
		var typePartnerMoral		= 200;
		var typePartnerPhysique  	= 100;
		var typePartnerPhysiqueMr  	= 101;
		var typePartnerPhysiqueMrs 	= 102;
		
		var statPartnerNew		    = 0;
		var statPartnerValide  	    = 1;
		var statPartnerDel   	    = 2;
		
		//	RIGHT ACTION----------------------------------------
		var RIGHT_G		= 0;
		var RIGHT_N		= 1;
		var RIGHT_M		= 2;
		var RIGHT_D		= 3;
		var RIGHT_R		= 4;

		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.Per.Main;
			pr_ctr_List				= App.controller.Per.List;
			pr_ctr_Ent				= App.controller.Per.Ent;
			pr_ctr_EntHeader 		= App.controller.Per.EntHeader;
			pr_ctr_EntBtn 			= App.controller.Per.EntBtn;
//			pr_ctr_EntTabs 			= App.controller.Per.EntTabs;
				
//			tmplCtrl.do_lc_put_tmpl(tmplName.PER_LIST_NEW_HEADER			, Per_List_New_Header);
//			tmplCtrl.do_lc_put_tmpl(tmplName.PER_LIST_NEW_CONTENT			, Per_List_New_Content);
			
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_LIST_CLIENT_HEADER		, Per_List_Client_Header); 		
//			tmplCtrl.do_lc_put_tmpl(tmplName.PER_LIST_PROSPECT_HEADER		, Per_List_Prospect_Header); 		
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_LIST_PRODUCER_HEADER		, Per_List_Producer_Header); 		
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_LIST_PROVIDER_HEADER		, Per_List_Supplier_Header); 		
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_LIST_THIRDPARTY_HEADER	, Per_List_Thirdparty_Header); 		
			
//			tmplCtrl.do_lc_put_tmpl(tmplName.PER_LIST_DOCTOR_HEADER		, Per_List_Doctor_Header); 
			
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_LIST_CONTENT				, Per_List_Content);
		}

		//--------------------------------------------------------------------------------------------
		this.do_lc_show = function(typePartner, supType01, supType02, typ02Multi){               
			try{
				var div = doLoadView(typePartner);
				if(div == null) return;
//				if(typePartner == statPartnerNew){
//					do_get_list_new_ByAjax_Dyn(div, supType01, supType02, typ02Multi);
//				} else{
					do_get_list_ByAjax_Dyn(div, typePartner);
//				}
			}catch(e) {
				do_gl_show_Notify_Msg_Error("PerList: " + e.toString());
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.partner", "PerList", "do_lc_show", e.toString()) ;
			}
		};

		function doLoadView(typePartner){
			var div = null;

			if(typePartner == typeCompany){
				div = "#div_Per_List_Client";
				$("#div_Per_List_Client_Header")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_LIST_CLIENT_HEADER			, {}));
			}

			//fixed max-height scroll of % height div_ContentView
			//do_gl_calculateScrollBody(div, 89.5);
			$(div + "_Content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_LIST_CONTENT, {}));
			return div;
		}
		
		this.do_lc_show_filter = function(page){
			var rightSocMa = pr_ctr_Main.do_verify_user_right_soc_manage();
			if(rightSocMa)
				do_load_view_filter(page);
			else
				$("#div_Per_List_Filter").hide();
		};
		
		var do_load_view_filter = function(page){
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_LIST_FILTER_HEADER			, Per_List_Filter_Header); 
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_LIST_FILTER_BOX				, Per_List_Filter_Box); 
			$("#div_Per_List_Filter_Header")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_LIST_FILTER_HEADER	, {}));
			$("#div_Per_List_Filter_Box")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_LIST_FILTER_BOX		, {}));
			do_wait_bind_event_filter(page);
		}
		
		var do_wait_bind_event_filter = function(page){
			if(App.data["LstSociete"] && App.data["LstSocieteChild"]){
				do_lc_bind_event_filter(page);
			}else{
				setTimeout(function(){
					do_wait_bind_event_filter(page);},
				200);
			}
		}
		//--------------------------------------------------------------------------------------------
		function do_get_list_ByAjax_Dyn(div, typePartner, socId, page){
//			if(!socId){
//				var rightCode = rights.req_lc_Right(typePartner, RIGHT_G);
//				
//				if(rightCode == -1){
//					do_gl_show_Notify_Msg_Error($.i18n("user_not_support_G_" + typePartner));
//					$(div).hide();
//					return;
//				}
//			}
			
			var ref 		= {};
			ref[svClass] 	= "ServicePerPerson";
			ref[svName]	    = "SVLstDynNew";
//			if(socId){
//				ref[svName]	= "SVLstFilter";
//				ref["socId"]= socId;
//				ref["page"]	= page;
//			}
//			else{
//				ref[svName]	= getSVName(typePartner);
//			}
			if(ref[svName]	== null) return;
				
			ref[userId]		= App.data.user.id;
			ref[sessId]		= App.data.session_id;
			ref["type01Multi"]	= null; //moral and normal
			ref["type02Multi"]	= JSON.stringify(typePartner);
			
			var lang = localStorage.language;
			if (lang ==null ) lang = "en";	
			
			var filename = "www/js/lib/datatables/datatable_"+lang+".json";
			
			var additionalConfig = {
				"dt02": {
					fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
						if(oData.dt02 != null){
							$(nTd).html(App.controller.DBoard.DBoardMain.formatShortDate(oData.dt02));
						} else {
							$(nTd).html("");
						} 
					},
				},
				"typ01": {
					fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
						switch(oData.typ01){
						case typePersonMoral:
							$(nTd).html($.i18n("per_person_type_moral"));
							break;
						case typePartnerPhysique:
							$(nTd).html($.i18n("per_person_type_physic"));
							break;
						case typePartnerPhysiqueMr:
							$(nTd).html($.i18n("per_person_type_physic_Mr"));
							break;
						case typePartnerPhysiqueMrs:
							$(nTd).html($.i18n("per_person_type_physic_Mrs"));
							break;
						}
					},
				},
				
				"stat": {
					fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
						switch(oData.stat){
						case statPartnerNew:
							$(nTd).html($.i18n("per_partner_stat_00"));
							break;
						case statPartnerValide:
							$(nTd).html($.i18n("per_partner_stat_01"));
							break;
						case statPartnerDel:
							$(nTd).html($.i18n("per_partner_stat_02"));
							break;
						}
					},
				},
				
				
			}

			var colConfig	= req_gl_table_col_config($(div).find("table"), null, additionalConfig);
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax")]);
			
			App.data["HttpSecuHeader"]	= {
					Authorization: "Bearer " + req_gl_Security_HttpHeader(App.keys.KEY_STORAGE_CREDENTIAL),
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				}
			
			var oTable 		= req_gl_Datatable_Ajax_Dyn		(div, App.path.BASE_URL_API_PRIV,App.data["HttpSecuHeader"], filename, colConfig, ref, fError, undefined, null, undefined, do_bind_list_event);
		}
		
		function do_get_list_new_ByAjax_Dyn(div, typ01, typ02, typ02Multi){
//			var rightCode = rights.req_lc_Right(typePartner, RIGHT_G);
//			
//			if(rightCode == -1){
//				do_gl_show_Notify_Msg_Error($.i18n("user_not_support_G_" + typePartner));
//				$(div).hide();
//				return;
//			}
			var ref 			= {};
			ref[svClass] 		= "ServicePersonDyn";
			ref[svName]			= "SVLstNew"

			ref[userId]			= App.data.user.id;
			ref[sessId]			= App.data.session_id;
			ref["typ01"]		= typ01?typ01:null;
			ref["stat"]			= statPartnerNew;
			ref["typ02"]		= typ02?typ02:null;
			ref["typ02Multi"]	= typ02Multi?typ02Multi:null;
			
			var lang = localStorage.language;
			if (lang ==null ) lang = "en";	
			
			var filename = "www/js/lib/datatables/datatable_"+lang+".json";
			/*
			 	"per_person_typ_02"						:	"Khách hàng",
				"per_person_typ_03"						:	"Nhà phân phối",
				"per_person_typ_04"						:	"Nhà sản xuất",
				"per_person_typ_05"						:	"Bác sỹ",
				"per_person_typ_06"						:	"Đối tác khác",
				"per_person_typ_07"						:	"Khách hàng tiềm năng",
				"per_person_typ_10"						:	"Công ty",
				"per_person_typ_11"						:	"Công ty con",
			 */
			var additionalConfig = {
				"typ02": {
					fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
						var typ02 = "";
						switch(oData.typ02){
							case typePartnerProspect:{
								typ02 = "per_person_typ_07";
							}
							case typePartnerClient: {
								typ02 = "per_person_typ_02";
							};
							break;
							case typePartnerSupplier:{
								typ02 = "per_person_typ_03";
							};
							break;
							case typePartnerProducer:{
								typ02 = "per_person_typ_04";
							};
							break;
							case typePartnerDoctor:{
								typ02 = "per_person_typ_05";
							}
							break;
							case typePartnerThirdparty:{
								typ02 = "per_person_typ_06";
							};
							break;
						}
						$(nTd).html($.i18n(typ02));
					}
				}
			}

			var colConfig	= req_gl_table_col_config($(div).find("table"), null, additionalConfig);
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax")]);	
			var oTable 		= req_gl_Datatable_Ajax_Dyn	(div, App.path.BASE_URL_API_PRIV,App.data["HttpSecuHeader"], filename, colConfig, ref, fError, undefined, null, undefined, do_bind_list_event);
			
		}
		
		function getSVName(typePartner){
			var svName = null;
			switch(typePartner){
				case typePartnerProspect:{
					svName = "SVLstProspect";
				}
				case typePartnerClient: {
					svName = "SVLstClient";
				};
				break;
				case typePartnerSupplier:{
					svName = "SVLstSupplier";
				};
				break;
				case typePartnerProducer:{
					svName = "SVLstProducer";
				};
				break;
//				case typePartnerDoctor:{
//					svName = "SVLstDoctor";
//				}
//				break;
				case typePartnerThirdparty:{
					svName = "SVLstTParty";
				};
				break;
			}
			return svName;
		}

		//--------------------------------------------------------------------------------------------
		function do_bind_list_event(data, div, oTable, params) {
//			do_gl_enhance_within($(div), {div: div});
			
			$(div).find('.table-datatableDyn tbody').off('click', 'tr');
			$(div).find('.table-datatableDyn tbody').on('click', 'tr', function(){
				if(App.data.mode == App['const'].MODE_MOD || App.data.mode == App['const'].MODE_NEW) {
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_sel'));
					return;
				}
				$(this).parents().find(".selected").removeClass("selected");
				$(this)	.addClass("selected");
				var oData = oTable.fnGetData(this);
				var perID = oData.id;
				pr_ctr_Ent.do_lc_show_ById(perID, App['const'].MODE_SEL);
			});
		}
		
		//--------------------------------------------------------------------------------------------
		var do_lc_bind_event_filter = function(page){
			do_gl_input_autocomplete({
				el: $("#Per_List_Societe_Name"),
				required: true,
				source: App.data["LstSociete"].concat(App.data["LstSocieteChild"]),
				selectCallback: function(item ) {
					$("#Per_List_Societe_Id")		.val(item.id);
					$("#Per_List_Societe_Name")		.val(item.name01);
				},
				renderAttrLst: ["name01"],
				minLength: 0,
			});

			$("#btn_per_partner_filter_submit").off("click");
			$("#btn_per_partner_filter_submit").on("click", function(){
				var filter = req_gl_data({
					dataZoneDom : $("#frm_filter_per_partner")
				});
				
				var socId = filter.data.id;

				$("#div_Per_List_Filter_Content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_LIST_CONTENT	, {}));
				var typePer = {};
				do_get_list_ByAjax_Dyn("#div_Per_List_Filter_Content", typePer, socId, page);
			});

			$("#btn_per_partner_filter_reset").off("click");
			$("#btn_per_partner_filter_reset").on("click", function(){
				$("#div_Per_List_Filter_Content")	.html("");
			});
			do_gl_init_show_box($("#div_Per_List_Filter"));
		}
	};
	return PerList;
});