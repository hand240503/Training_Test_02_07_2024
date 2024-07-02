define([
	'jquery',
	
	'text!template/shp/per/partner/PerPartner_List_New_Header.html',
	'text!template/shp/per/partner/PerPartner_List_New_Content.html',
	 
    'text!template/shp/per/partner/PerPartner_List_Client_Header.html',
    'text!template/shp/per/partner/PerPartner_List_Prospect_Header.html',
    'text!template/shp/per/partner/PerPartner_List_Producer_Header.html',  
    'text!template/shp/per/partner/PerPartner_List_Supplier_Header.html',
    'text!template/shp/per/partner/PerPartner_List_Thirdparty_Header.html',
    
//    'text!template/per/partner/PerPartner_List_Doctor_Header.html',
   
     
    'text!template/shp/per/common/PerPartner_List_Content.html',
     
    'text!template/shp/per/partner/PerPartner_List_Filter_Header.html',  
 	'text!template/shp/per/partner/PerPartner_List_Filter_Box.html',

	],
	function($,
			PerPartner_List_New_Header,
			PerPartner_List_New_Content,
			
			PerPartner_List_Client_Header,
			PerPartner_List_Prospect_Header,
			PerPartner_List_Producer_Header,
			PerPartner_List_Supplier_Header,
			PerPartner_List_Thirdparty_Header,
			
//			PerPartner_List_Doctor_Header,
			
			
			PerPartner_List_Content,
			
			PerPartner_List_Filter_Header,
			PerPartner_List_Filter_Box
	) 
	{

	var PerPartnerList 	= function () {

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
		var statPartnerNew			= 0;
		
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
			pr_ctr_EntTabs 			= App.controller.Per.EntTabs;
				
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_PARTNER_LIST_NEW_HEADER			, PerPartner_List_New_Header);
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_PARTNER_LIST_NEW_CONTENT			, PerPartner_List_New_Content);
			
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_PARTNER_LIST_CLIENT_HEADER		, PerPartner_List_Client_Header); 		
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_PARTNER_LIST_PROSPECT_HEADER		, PerPartner_List_Prospect_Header); 		
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_PARTNER_LIST_PRODUCER_HEADER		, PerPartner_List_Producer_Header); 		
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_PARTNER_LIST_PROVIDER_HEADER		, PerPartner_List_Supplier_Header); 		
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_PARTNER_LIST_THIRDPARTY_HEADER	, PerPartner_List_Thirdparty_Header); 		
			
//			tmplCtrl.do_lc_put_tmpl(tmplName.PER_PARTNER_LIST_DOCTOR_HEADER		, PerPartner_List_Doctor_Header); 
			
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_PARTNER_LIST_CONTENT				, PerPartner_List_Content);
		}

		//--------------------------------------------------------------------------------------------
		this.do_lc_show = function(typePartner, supType01, supType02, typ02Multi){               
			try{
				var div = doLoadView(typePartner);
				if(div == null) return;
				if(typePartner == statPartnerNew){
					do_get_list_new_ByAjax_Dyn(div, supType01, supType02, typ02Multi);
				} else{
					do_get_list_ByAjax_Dyn(div, typePartner);
				}
			}catch(e) {
				do_gl_show_Notify_Msg_Error("PerPartnerList: " + e.toString());
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.partner", "PerPartnerList", "do_lc_show", e.toString()) ;
			}
		};

		function doLoadView(typePartner){
			var div = null;
			if(typePartner == statPartnerNew){
				div = "#div_PerPartner_List_New";
				$("#div_PerPartner_List_New_Header")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_PARTNER_LIST_NEW_HEADER			, {}));
				$("#div_PerPartner_List_New_Content")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_PARTNER_LIST_NEW_CONTENT			, {}));
				return div;
			}
			if(typePartner == typePartnerClient){
				div = "#div_PerPartner_List_Client";
				$("#div_PerPartner_List_Client_Header")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_PARTNER_LIST_CLIENT_HEADER			, {}));
			}
			if(typePartner == typePartnerProspect){
				div = "#div_PerPartner_List_Prospect";
				$("#div_PerPartner_List_Prospect_Header")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_PARTNER_LIST_PROSPECT_HEADER			, {}));
			}
			if(typePartner == typePartnerProducer){
				div = "#div_PerPartner_List_Producer";
				$("#div_PerPartner_List_Producer_Header")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_PARTNER_LIST_PRODUCER_HEADER		, {}));
			}
			if(typePartner == typePartnerSupplier){
				div = "#div_PerPartner_List_Supplier";
				$("#div_PerPartner_List_Supplier_Header")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_PARTNER_LIST_PROVIDER_HEADER		, {}));
			}
			
//			if(typePartner == typePartnerDoctor){
//				div = "#div_PerPartner_List_Doctor";
//				$("#div_PerPartner_List_Doctor_Header")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_PARTNER_LIST_DOCTOR_HEADER				, {}));
//			}
			
			if(typePartner == typePartnerThirdparty){
				div = "#div_PerPartner_List_Thirdparty";
				$("#div_PerPartner_List_Thirdparty_Header")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_PARTNER_LIST_THIRDPARTY_HEADER		, {}));
			}
			//fixed max-height scroll of % height div_ContentView
			//do_gl_calculateScrollBody(div, 89.5);
			$(div + "_Content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_PARTNER_LIST_CONTENT, {}));
			return div;
		}
		
		this.do_lc_show_filter = function(page){
			var rightSocMa = pr_ctr_Main.do_verify_user_right_soc_manage();
			if(rightSocMa)
				do_load_view_filter(page);
			else
				$("#div_PerPartner_List_Filter").hide();
		};
		
		var do_load_view_filter = function(page){
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_PARTNER_LIST_FILTER_HEADER			, PerPartner_List_Filter_Header); 
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_PARTNER_LIST_FILTER_BOX				, PerPartner_List_Filter_Box); 
			$("#div_PerPartner_List_Filter_Header")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_PARTNER_LIST_FILTER_HEADER	, {}));
			$("#div_PerPartner_List_Filter_Box")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_PARTNER_LIST_FILTER_BOX		, {}));
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
			ref[svClass] 	= "ServicePersonDyn";
			if(socId){
				ref[svName]	= "SVPerLstFilter";
				ref["socId"]= socId;
				ref["page"]	= page;
			}
			else{
				ref[svName]	= getSVName(typePartner);
			}
			if(ref[svName]	== null) return;
				
			ref[userId]		= App.data.user.id;
			ref[sessId]		= App.data.session_id;
			ref["typ01"]	= null; //moral and normal
			ref["typ02"]	= typePartner;
			
			var lang = localStorage.language;
			if (lang ==null ) lang = "en";	
			
			var filename = "www/js/lib/datatables/datatable_"+lang+".json";
			
			var additionalConfig = {
				"typ01": {
					fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
						for (i in App.data.cfgValListTypePerson){
							if (App.data.cfgValListTypePerson[i].id == oData.typ01){
								$(nTd).html($.i18n(App.data.cfgValListTypePerson[i].val01));
								break;
							}
						}
					},
				},
			}

			var colConfig	= req_gl_table_col_config($(div).find("table"), null, additionalConfig);
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax")]);
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
			ref[svName]			= "SVPerLstNew"

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
					svName = "SVPerLstProspect";
				}
				case typePartnerClient: {
					svName = "SVPerLstClient";
				};
				break;
				case typePartnerSupplier:{
					svName = "SVPerLstSupplier";
				};
				break;
				case typePartnerProducer:{
					svName = "SVPerLstProducer";
				};
				break;
//				case typePartnerDoctor:{
//					svName = "SVPerLstDoctor";
//				}
//				break;
				case typePartnerThirdparty:{
					svName = "SVPerLstTParty";
				};
				break;
			}
			return svName;
		}

		//--------------------------------------------------------------------------------------------
		function do_bind_list_event(data, div, oTable, params) {
			do_gl_enhance_within($(div), {div: div});
			
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
			do_gl_autocomplete({
				el: $("#PerPartner_List_Societe_Name"),
				required: true,
				source: App.data["LstSociete"].concat(App.data["LstSocieteChild"]),
				selectCallback: function(item ) {
					$("#PerPartner_List_Societe_Id")		.val(item.id);
					$("#PerPartner_List_Societe_Name")		.val(item.name01);
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

				$("#div_PerPartner_List_Filter_Content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_PARTNER_LIST_CONTENT	, {}));
				var typePer = {};
				do_get_list_ByAjax_Dyn("#div_PerPartner_List_Filter_Content", typePer, socId, page);
			});

			$("#btn_per_partner_filter_reset").off("click");
			$("#btn_per_partner_filter_reset").on("click", function(){
				$("#div_PerPartner_List_Filter_Content")	.html("");
			});
			do_gl_init_show_box($("#div_PerPartner_List_Filter"));
		}
	};
	return PerPartnerList;
});