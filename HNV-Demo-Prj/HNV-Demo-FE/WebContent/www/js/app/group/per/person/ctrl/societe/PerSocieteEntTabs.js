define([
	'jquery',
	'text!template/per/societe/PerSociete_Ent_Tabs.html'
	],
	function($, 
			PerSociete_Ent_Tabs        		
	) {

	var PerSocieteEntTabs     = function (header,content,footer, grpName) {
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
		
		const pr_tpyInfoAddress			= 1;
		const pr_tpyInfoBankAcc			= 2;
		const pr_tpyInfoReservation   	= 6;

		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List				= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;
		var pr_ctr_TabAddress		= null;
		var pr_ctr_TabDoc			= null;
		var pr_ctr_TabBank			= null;
		var pr_ctr_TabBook			= null;

		//-------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init				= function(){
			pr_ctr_Main 			= App.controller.Per.Main;
			pr_ctr_List				= App.controller.Per.List;
			pr_ctr_Ent				= App.controller.Per.Ent;
			pr_ctr_EntHeader 		= App.controller.Per.EntHeader;
			pr_ctr_EntBtn 			= App.controller.Per.EntBtn;
			pr_ctr_EntTabs 			= App.controller.Per.EntTabs;
			
			pr_ctr_TabAddress 		= App.controller.Per.EntTabAddress;
			pr_ctr_TabDoc			= App.controller.Per.EntTabDoc;
			pr_ctr_TabBank			= App.controller.Per.EntTabBank;
			pr_ctr_TabBook			= App.controller.Per.EntTabBook;
			
			tmplName.PER_SOCIETE_ENT_TAB_ADDRESS		= "Per_Societe_Ent_Tab_Address";
			tmplName.PER_SOCIETE_ENT_TAB_ADDRESS_LIST	= "Per_Societe_Ent_Tab_Address_List";
			tmplName.PER_SOCIETE_ENT_TAB_ADDRESS_DETAIL	= "Per_Societe_Ent_Tab_Address_Detail";
			tmplName.PER_SOCIETE_ENT_TAB_DOC			= "Per_Societe_Ent_Tab_Doc";
			tmplName.PER_SOCIETE_ENT_TAB_BANK			= "Per_Societe_Ent_Tab_Bank";
			tmplName.PER_SOCIETE_ENT_TAB_BOOK			= "Per_Societe_Ent_Tab_Book";
		}
		
		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;

			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.PER_ENT_TABS, PerSociete_Ent_Tabs); 			
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_ENT_TABS, obj));

				//fixed max-height scroll of % height div_ContentView
				//do_gl_calculateScrollBody(pr_divContent + " .custom-scroll-tab", 43.6);
				do_bind_event(obj, mode);
				pr_ctr_TabAddress	.do_lc_show(pr_obj, pr_mode);
				pr_ctr_TabDoc 		.do_lc_show(pr_obj, pr_mode);
				pr_ctr_TabBank 		.do_lc_show(pr_obj, pr_mode);
				pr_ctr_TabBook 		.do_lc_show(pr_obj, pr_mode);
			}catch(e) {
				do_gl_show_Notify_Msg_Error("PerSocieteEntTabs :" + e.toString());
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.societe", "PerSocieteEntTabs", "do_lc_show", e.toString()) ;
			}
		};

		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			//Split Get Address and Bank Account
			let listTpyInfo = obj.tpyInfos;
			let listAddress = [];
			let listBankAcc = [];
			let listReservation = [];
			if(obj.tpyInfos){
				for(let i = 0; i < listTpyInfo.length; i++){
					if(listTpyInfo[i].typ01 == pr_tpyInfoAddress){
						listAddress.push(listTpyInfo[i]);
					}
					if(listTpyInfo[i].typ01 == pr_tpyInfoBankAcc){
						listBankAcc.push(listTpyInfo[i]);
					}
					if(listTpyInfo[i].typ01 == pr_tpyInfoReservation){
						listReservation.push(listTpyInfo[i]);
					}
				}
			}
			App.data.tpyListAdd 			= listAddress;
			App.data.tpyListBank 			= listBankAcc;
			App.data.tpyListReservation     = listReservation;
		}
	};

	return PerSocieteEntTabs;
});