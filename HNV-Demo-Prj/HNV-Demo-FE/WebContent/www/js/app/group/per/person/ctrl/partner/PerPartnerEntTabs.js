define([
	'jquery',
	'text!template/per/partner/PerPartner_Ent_Tabs.html'
	],
	function($, 
			PerPartner_Ent_Tabs        		
	) {

	var PerPartnerEntTabs     = function (header,content,footer, grpName) {
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
		
		var pr_tpyInfoAddress		= 1;
		var pr_tpyInfoBankAcc		= 2;
		
		var typePartnerClient		= 1010002;
		var typePartnerProvider		= 1010003;
//		var typePartnerProducer		= 1010004;
//		var typePartnerDoctor		= 1010005;
		var typePartnerThirdparty	= 1010006;

		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 					= null;
		var pr_ctr_List						= null;
		var pr_ctr_Ent						= null;
		var pr_ctr_EntHeader 				= null;
		var pr_ctr_EntBtn 					= null;
		var pr_ctr_EntTabs 					= null;
		var pr_ctr_TabAddress				= null;
		var pr_ctr_TabDoc					= null;
		var pr_ctr_TabBank					= null;
//		var pr_ctr_TabReportProducer		= null;
//		var pr_ctr_TabReportProvider		= null;
//		var pr_ctr_TabReportThirdParty		= null;
		var pr_ctr_EntTabservices				= null;
		var pr_ctr_TabObservations			= null;
		

		//-------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init						= function(){
			pr_ctr_Main 					= App.controller.Per.Main;
			pr_ctr_List						= App.controller.Per.List;
			pr_ctr_Ent						= App.controller.Per.Ent;
			pr_ctr_EntHeader 				= App.controller.Per.EntHeader;
			pr_ctr_EntBtn 					= App.controller.Per.EntBtn;
			pr_ctr_EntTabs 					= App.controller.Per.EntTabs;
			
			pr_ctr_TabAddress 				= App.controller.Per.EntTabAddress;
			pr_ctr_TabDoc					= App.controller.Per.EntTabDoc;
			pr_ctr_TabBank					= App.controller.Per.EntTabBank;
			pr_ctr_TabObservation			= App.controller.Per.EntTabObservation;
			pr_ctr_TabAccountEntity			= App.controller.Per.EntTabAccountEntity;
			
//			pr_ctr_TabReportProducer		= App.controller.Per.EntTabReportProducer;
//			pr_ctr_TabReportProvider		= App.controller.Per.EntTabReportProvider;
//			pr_ctr_TabReportThirdParty		= App.controller.Per.EntTabReportThirdParty;
			pr_ctr_TabReportClient			= App.controller.Per.EntTabReportClient;
			pr_ctr_TabObservations          =App.controller.Per.EntTabObservation;
			
//			pr_ctr_TabAccounts				= App.controller.Per.EntTabAccounts;
//			pr_ctr_EntTabservices				= App.controller.Per.EntTabServices;
//			pr_ctr_TabOrders				= App.controller.Per.EntTabOrders;
			
			tmplName.PER_PARTNER_ENT_TAB_ADDRESS				= "Per_Partner_Ent_Tab_Address";
			tmplName.PER_PARTNER_ENT_TAB_ADDRESS_LIST			= "Per_Partner_Ent_Tab_Address_List";
			tmplName.PER_PARTNER_ENT_TAB_ADDRESS_DETAIL			= "Per_Partner_Ent_Tab_Address_Detail";
			tmplName.PER_PARTNER_ENT_TAB_DOC					= "Per_Partner_Ent_Tab_Doc";
			tmplName.PER_PARTNER_ENT_TAB_BANK					= "Per_Partner_Ent_Tab_Bank";
//			tmplName.PER_PARTNER_ENT_TAB_REPORT_PRODUCER		= "Per_Partner_Ent_Tab_Report_Producer";
//			tmplName.PER_PARTNER_ENT_TAB_REPORT_PROVIDER		= "Per_Partner_Ent_Tab_Report_Provider";
//			tmplName.PER_PARTNER_ENT_TAB_REPORT_THIRDPARTY		= "Per_Partner_Ent_Tab_Report_ThirdParty";
			tmplName.PER_PARTNER_ENT_TAB_REPORT_CLIENT			= "Per_Partner_Ent_Tab_Report_Client";
		}
		
		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;

			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.PER_ENT_TABS, PerPartner_Ent_Tabs); 			
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_ENT_TABS, obj));

				//fixed max-height scroll of % height div_ContentView
				//do_gl_calculateScrollBody(pr_divContent + " .custom-scroll-tab", 43.6);
				do_bind_event(obj, mode);
				pr_ctr_TabAddress					.do_lc_show(pr_obj, pr_mode);
				pr_ctr_TabDoc 						.do_lc_show(pr_obj, pr_mode);
				pr_ctr_TabBank 						.do_lc_show(pr_obj, pr_mode);
//				pr_ctr_TabAccounts					.do_lc_show(pr_obj, pr_mode);
				//pr_ctr_EntTabservices				.do_lc_show(pr_obj, pr_mode);
				//pr_ctr_TabOrders	 				.do_lc_show(pr_obj, pr_mode);
				pr_ctr_TabObservations				.do_lc_show(pr_obj, pr_mode);
				
//				if(mode != App['const'].MODE_NEW){
//					if(obj.typ02 == typePartnerProducer){
//						pr_ctr_TabReportProducer 		.do_lc_show(pr_obj, pr_mode);
//					} else if(obj.typ02 == typePartnerProvider){
//						$("#li_Per_Ent_Tab_Account_Entity")	.show();
//						$("#li_Per_Ent_Tab_Orders")	.show();
//						pr_ctr_TabAccountEntity 		.do_lc_show(pr_obj, pr_mode);
//						pr_ctr_TabOrders	 		.do_lc_show(pr_obj, pr_mode);
//						pr_ctr_TabReportProvider 		.do_lc_show(pr_obj, pr_mode);
//					} else if(obj.typ02 == typePartnerThirdparty||obj.typ02 == typePartnerDoctor){
//						pr_ctr_TabReportThirdParty 		.do_lc_show(pr_obj, pr_mode);
//					} else if(obj.typ02 == typePartnerClient){
//						$("#li_Per_Ent_Tab_Orders")	.show();
//						pr_ctr_TabReportClient	 		.do_lc_show(pr_obj, pr_mode);
//						
//					}
//				}
				
			}catch(e) {
				do_gl_show_Notify_Msg_Error("PerPartnerEntTabs :" + e.toString());
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.partner", "PerPartnerEntTabs", "do_lc_show", e.toString()) ;
			}
		};

		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			//Split Get Address and Bank Account
			var listTpyInfo = obj.tpyInfos;
			var listAddress = [];
			var listBankAcc = [];
			if(obj.tpyInfos){
				for(var i = 0; i < listTpyInfo.length; i++){
					if(listTpyInfo[i].typ01 == pr_tpyInfoAddress){
						listAddress.push(listTpyInfo[i]);
					}
					if(listTpyInfo[i].typ01 == pr_tpyInfoBankAcc){
						listBankAcc.push(listTpyInfo[i]);
					}
				}
			}
			App.data.tpyListAdd 	= listAddress;
			App.data.tpyListBank 	= listBankAcc;
		}
	};

	return PerPartnerEntTabs;
});