define([
        'jquery',
        'text!template/per/societe/PerSociete_Ent_Btn.html'

        ],

        function($, 
        		PerSociete_Ent_Btn) {


	var PerPartnerEntBtn     = function (header,content,footer, grpName) {
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
	
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_ListClient		= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;
		
		var pageSoc					= 10;
		
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
			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.PER_ENT_BTN, PerSociete_Ent_Btn); 			
				$("#div_Per_Ent_Btn"	).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_ENT_BTN, obj));
				$("#btn_PerPartner_transform").hide();
				$("#btn_PerPartner_duplicate").hide();
				$("#btn_PerPartner_export"	).hide();
				$("#btn_PerPartner_send"	).hide();
				
				if(mode==App['const'].MODE_INIT	){				
					$("#btn_PerPartner_create"	)	.show();
					$("#btn_PerPartner_edit"	)	.hide();
					$("#btn_PerPartner_del")		.hide();
					$("#btn_PerPartner_print"	)	.hide();
					$("#btn_PerPartner_save"	)	.hide();
					$("#btn_PerPartner_cancel"	)	.hide();
					$("#btn_PerPartner_duplicate")	.hide();
				}else if(mode==App['const'].MODE_SEL){			
					$("#btn_PerPartner_create"	)	.show();
					$("#btn_PerPartner_edit"	)	.show();
					$("#btn_PerPartner_del"		)	.show();
					$("#btn_PerPartner_print"	)	.hide();
					$("#btn_PerPartner_save"	)	.hide();
					$("#btn_PerPartner_cancel"	)	.hide();
					$("#btn_PerPartner_duplicate")	.hide();
				}else if(mode==App['const'].MODE_NEW){	
					$("#btn_PerPartner_create"	)	.hide();
					$("#btn_PerPartner_edit"	)	.hide();
					$("#btn_PerPartner_del"		)	.hide();
					$("#btn_PerPartner_print"	)	.hide();
					$("#btn_PerPartner_save"	)	.show();
					$("#btn_PerPartner_cancel"	)	.show();
				}else if(mode==App['const'].MODE_MOD){	
					$("#btn_PerPartner_create"	)	.hide();
					$("#btn_PerPartner_edit"	)	.hide();
					$("#btn_PerPartner_del"		)	.hide();
					$("#btn_PerPartner_send"	)	.hide();
					$("#btn_PerPartner_print"	)	.hide();
					$("#btn_PerPartner_save"	)	.show();
					$("#btn_PerPartner_cancel"	)	.show();					
				}

				do_bind_event_btn_create	(obj, mode);
				do_bind_event_btn_edit		(obj, mode);		
				do_bind_event_btn_del		(obj, mode);
				do_bind_event_btn_print		(obj, mode);
				do_bind_event_btn_save		(obj, mode);
				do_bind_event_btn_cancel	(obj, mode);
				
					$("#btn_PerSociete_home").off('click');
					$("#btn_PerSociete_home").click(function(){
						App.controller.Per.Main.do_lc_init(pageSoc);
						App.controller.Per.Main.do_lc_show(pageSoc);
					});	
				
			}catch(e) {				
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "mat.material", "PerPartnerEntBtn", "do_lc_show", e.toString()) ;
			}
		};
		
		//---------private-----------------------------------------------------------------------------

		function do_bind_event_btn_create(){
			$("#btn_PerPartner_create").off('click');
			$("#btn_PerPartner_create").click(function(){
				var newObj		= {};
				App.data.mode 	= App['const'].MODE_NEW;
				//App.data.mode 	= App['const'].MODE_NEW;
				self		.do_lc_show(newObj, App['const'].MODE_NEW);
				pr_ctr_Ent	.do_lc_show(newObj, App['const'].MODE_NEW);
				do_Enabled_Edit();
			});
		}	
		
//		var do_bind_event_btn_duplicate	= function(obj){
//			$("#btn_PerPartner_duplicate").off('click');
//			$("#btn_PerPartner_duplicate").click(function(){
//				var newObj 		= pr_ctr_Ent.do_lc_duplicate(obj);
//				App.data.mode 	= App['const'].MODE_NEW;
//				
//				self		.do_lc_show(newObj, App.data.mode);
//				pr_ctr_Ent	.do_lc_show(newObj, App.data.mode);
//			});
//		}
		
		function do_bind_event_btn_edit(obj){
			$("#btn_PerPartner_edit").off('click');
			$("#btn_PerPartner_edit").click(function(){
				pr_ctr_Ent	.do_lc_Lock_Begin(obj);
			});	
		}
		
		function do_bind_event_btn_del(obj){
			$("#btn_PerPartner_del").off('click');
			$("#btn_PerPartner_del").click(function(){				
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"	),
					content : $.i18n("per_partner_btn_del_content"	),
					buttons	: {
						OK: {
							lab		: $.i18n("common_btn_ok"),
							funct	: pr_ctr_Ent.do_lc_delete,
							param	: [obj]						
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					}
				});				
			});
		}
		
		function do_bind_event_btn_save(obj, mode){
			$("#btn_PerPartner_save").off('click');
			$("#btn_PerPartner_save").click(function(){
				pr_ctr_Ent.do_lc_save(obj, mode);				
			});
		}
		
		function do_bind_event_btn_cancel(obj, mode){
			$("#btn_PerPartner_cancel").off('click');
			$("#btn_PerPartner_cancel").click(function(){
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("common_msg_mod_cancel_confirm"),
					buttons	: {
						OK: {
							lab		: $.i18n("common_btn_ok"),
							funct	: doCancel,
							param	: [obj]							
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel")								
						}
					}
				});	
			});
		}

//		var do_bind_event_btn_export		= function(obj, mode){
//			$("#btn_PerPartner_export").off('click');
//			$("#btn_PerPartner_export").click(function(){
//			});
//		}

//		var do_bind_event_btn_send		= function(obj, mode){
//			$("#btn_PerPartner_send").off('click');
//			$("#btn_PerPartner_send").click(function(){
//			});
//		}

		var do_bind_event_btn_print		= function(obj, mode){
			$("#btn_PerPartner_print").off('click');
			$("#btn_PerPartner_print").click(function(){
			});
		}

//		var do_bind_event_btn_export		= function(obj, mode){
//			$("#btn_PerPartner_export").off('click');
//			$("#btn_PerPartner_export").click(function(){
//			});
//		}
//		
		var do_Enabled_Edit = function(){
			$("#div_frm_per_header").find("input, select, textarea").removeAttr("disabled");
		}
		
		//----------------------------------------------------------------------------------------------
		function doCancel(obj){		
			if(App.data.mode == App['const'].MODE_NEW) {	
				App.data.mode = App['const'].MODE_SEL;
				self		.do_lc_show		(null, App.data.mode);
				pr_ctr_Ent	.do_lc_show		(null, App.data.mode);
			} else if(App.data.mode == App['const'].MODE_MOD) {				
				pr_ctr_Ent	.do_lc_Lock_Cancel	(obj);			
			} 			
		}
	};

	return PerPartnerEntBtn;
});