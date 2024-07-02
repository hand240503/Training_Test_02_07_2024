define([
	'jquery',
	'text!template/shp/perInfo/Per_Ent_Tabs.html'
	],
	function($, 
			Per_Ent_Tabs        		
	) {

	var PerEntTabs     = function (header,content,footer, grpName) {
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
		var typePartnerProducer		= 1010004;
//		var typePartnerDoctor		= 1010005;
		var typePartnerThirdparty	= 1010006;

		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 					= null;
		var pr_ctr_List						= null;
		var pr_ctr_Ent						= null;
		var pr_ctr_EntHeader 				= null;
		var pr_ctr_EntBtn 					= null;
		var pr_ctr_EntTabs 					= null;
		var pr_ctr_TabNote    				= null;
		var pr_ctr_TabDoc    				= null;

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
			
			pr_ctr_TabNote					= App.controller.Per.EntTabNote;
			pr_ctr_TabDoc					= App.controller.Per.EntTabDoc;
			
			tmplName.PER_ENT_TAB_ORDERS			= "Per_Partner_Ent_Tab_Orders";
			tmplName.PER_ENT_TAB_NOTE			= "Per_Partner_Ent_Tab_Note";
		}
		
		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;

			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.PER_ENT_TABS, Per_Ent_Tabs); 			
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_ENT_TABS, obj));

				//fixed max-height scroll of % height div_ContentView
				//do_gl_calculateScrollBody(pr_divContent + " .custom-scroll-tab", 43.6);
				do_bind_event(obj, mode);
				
				pr_ctr_TabNote						.do_lc_show(pr_obj, pr_mode);
				pr_ctr_TabDoc						.do_lc_show(pr_obj, pr_mode);

				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_Minimize();
//				if(mode != App['const'].MODE_NEW){
//					if(obj.typ02 == typePartnerProducer){
//						pr_ctr_TabReportProducer 		.do_lc_show(pr_obj, pr_mode);
//					} else if(obj.typ02 == typePartnerProvider){
//						$("#li_Per_Ent_Tab_Account_Entity")	.show();
//						$("#li_Per_Ent_Tab_Orders")	.show();
//						pr_ctr_TabAccountEntity 		.do_lc_show(pr_obj, pr_mode);
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
				do_gl_show_Notify_Msg_Error("PerEntTabs :" + e.toString());
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.partner", "PerEntTabs", "do_lc_show", e.toString()) ;
			}
		};

		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
		}
	};

	return PerEntTabs;
});