 define([
	'jquery',
	'text!template/per/partner/PerPartner_Ent_Tab_Account_Entity.html'
	],
	function($, 
			PerPartner_Ent_Tab_Account_Entity) {

	var PerPartnerEntTabAccountEntity     = function (header,content,footer, grpName) {
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

		var svClass         			= App['const'].SV_CLASS;
		var svName          			= App['const'].SV_NAME;
		var userId          			= App['const'].USER_ID;
		var sessId          			= App['const'].SESS_ID;
		var fVar            			= App['const'].FUNCT_SCOPE;
		var fName           			= App['const'].FUNCT_NAME;
		var fParam          			= App['const'].FUNCT_PARAM;
		
		var pr_SV_ACCOUNT_SEARCH    	= "SVInvAccountEntitySearch";
		var pr_SERVICE_ACCOUNT_CLASS    = "ServiceInvAccountEntity";

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
			pr_ctr_Main 			= App.controller.Per.Main;
			pr_ctr_List 			= App.controller.Per.List;

			pr_ctr_Ent				= App.controller.Per.Ent;
			pr_ctr_EntHeader 		= App.controller.Per.EntHeader;
			pr_ctr_EntBtn 			= App.controller.Per.EntBtn;
			pr_ctr_EntTabs 			= App.controller.Per.EntTabs;
		}      

		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;

			try{
				do_Load_View();
				do_Build_Page(obj, mode);
				do_bind_event(obj, mode);
			}catch(e) {				
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.partner", "PerPartnerEntTabAccountEntity", "do_lc_show", e.toString()) ;
			}
		};

		var do_Load_View = function(){
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_PARTNER_ENT_TAB_ACCOUNT_ENTITY, PerPartner_Ent_Tab_Account_Entity); 
		} 

		var do_Build_Page = function(obj, mode){
//			if(obj.account == null)	obj.account = {};
			$(pr_divContent)		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_PARTNER_ENT_TAB_ACCOUNT_ENTITY, obj));
		} 

		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			if(pr_mode == App['const'].MODE_MOD || pr_mode == App['const'].MODE_NEW) {
				do_gl_enable_edit($(pr_divContent));
			}
			
			do_gl_input_autocomplete_dyn("#accNum01", {
				dataRes : ["lab01", "nb"], dataReq : {"nbLine" : 10}, dataService : [pr_SERVICE_ACCOUNT_CLASS, pr_SV_ACCOUNT_SEARCH], dataSel : {"#acc01": "id", "#accLab01": "lab01"}
			});
			
//			do_gl_input_autocomplete_dyn("#accNum02", {
//				dataRes : ["lab01", "nb"], dataReq : {"nbLine" : 10}, dataService : [pr_SV_ACCOUNT_SEARCH, pr_SERVICE_ACCOUNT_CLASS], dataSel : {"#acc02": "id", "#accLab02": "lab01"}
//			});
		}
	};

	return PerPartnerEntTabAccountEntity;
});