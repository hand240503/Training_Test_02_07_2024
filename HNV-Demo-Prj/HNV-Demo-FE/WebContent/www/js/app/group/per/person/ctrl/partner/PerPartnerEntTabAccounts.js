define([
	'jquery',
	'text!template/per/partner/PerPartner_Ent_Tab_Accounts.html'
	],
	function($,
			PerPartner_Ent_Tab_Accounts
	) {

	var PerPartnerEntTabAccounts     = function () {
		//---------------------------------------------------------------------------------------------------------
		//DEFINITIONS------DEFINITIONS------DEFINITIONS------DEFINITIONS------DEFINITIONS-----DEFINITIONS-----DEFIN						
		//---------------------------------------------------------------------------------------------------------
		var pr_divContent 			= "#div_PerPartner_Ent_Tab_Accounts";
		
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
		
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;	
		
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
		}

		this.do_lc_show		= function(obj, mode){
			pr_obj 				= obj;
			pr_mode					= mode;
			pr_parentId 			= obj.id;
			try{
				var lstAccounts = [];
				tmplName.PER_PARTNER_ENT_TAB_ACCOUNTS		= "PerPartner_Ent_Tab_Accounts";
			
				tmplCtrl.do_lc_put_tmpl(tmplName.PER_PARTNER_ENT_TAB_ACCOUNTS, PerPartner_Ent_Tab_Accounts);
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_PARTNER_ENT_TAB_ACCOUNTS, lstAccounts));
			}catch(e) {
				do_gl_show_Notify_Msg_Error("PerPartnerEntTabAccounts: " + e.toString());
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.partner", "PerPartnerEntTabAccounts", "do_lc_show", e.toString()) ;
			}
		}
	};

	return PerPartnerEntTabAccounts;
});