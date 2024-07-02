define([
        'jquery',
        'text!template/shp/per/Per_Ent_Btn.html'
        ],

        function($, 
        		Per_Ent_Btn) {


	var PerEntBtn     = function (header,content,footer, grpName) {
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
		var rights					=  App.controller.Per.Rights;
		//------------------------------------------------------
		var typePartnerClient		= 1010002;
		var typePartnerProspect		= 1010007;
		
		var typePartnerSupplier		= 1010003;
		var typePartnerProducer		= 1010004;
		//var typePartnerDoctor		= 1010005;
		var typePartnerThirdparty	= 1010006;
		
		var lc_stat_validate		= 1;
		var lc_stat_denied			= 2;
		
		//	RIGHT ACTION----------------------------------------
		var RIGHT_G		= 0;
		var RIGHT_N		= 1;
		var RIGHT_M		= 2;
		var RIGHT_D		= 3;
		var RIGHT_R		= 4;

		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_ListClient		= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;
		var statNew					= 3;
		
		var pr_btn_Create 			= "#btn_PerPartner_create";
		var pr_btn_Edit 			= "#btn_PerPartner_edit";
		var pr_btn_Duplicate 		= "#btn_PerPartner_duplicate";
		var pr_btn_Del 				= "#btn_PerPartner_del";
		var pr_btn_Export 			= "#btn_PerPartner_export";
		var pr_btn_Send 			= "#btn_PerPartner_send";
		var pr_btn_Print 			= "#btn_PerPartner_print";
		var pr_btn_Save 			= "#btn_PerPartner_save";
		var pr_btn_Cancel 			= "#btn_PerPartner_cancel";
		var pr_btn_Transform        = "#btn_PerPartner_transform";
		var pr_btn_Validate			= "#btn_PerPartner_validate";
		var pr_btn_Deny				= "#btn_PerPartner_deny";
		
		this.lc_partner_type		= 0;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(partnerType){
			pr_ctr_Main 			= App.controller.Per.Main;
			pr_ctr_List				= App.controller.Per.List;
			pr_ctr_Ent				= App.controller.Per.Ent;
			pr_ctr_EntHeader 		= App.controller.Per.EntHeader;
			pr_ctr_EntBtn 			= App.controller.Per.EntBtn;
			pr_ctr_EntTabs 			= App.controller.Per.EntTabs;
			self.lc_partner_type	= partnerType;

			tmplCtrl.do_lc_put_tmpl(tmplName.PER_ENT_BTN, Per_Ent_Btn); 			
		}
		
		this.do_lc_show		= function(obj, mode){
			try{
				$("#div_Per_Ent_Btn").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_ENT_BTN, obj));

				$(pr_btn_Create		)	.hide();
				$(pr_btn_Edit		)	.hide();
				$(pr_btn_Duplicate	)	.hide();
				$(pr_btn_Del		)	.hide();
				$(pr_btn_Transform	)	.hide();
				$(pr_btn_Export		)	.hide();
				
				$(pr_btn_Send		)	.hide();
				$(pr_btn_Print		)	.hide();

				$(pr_btn_Save		)	.hide();
				$(pr_btn_Cancel		)	.hide();
				
				$(pr_btn_Validate	)	.hide();
				$(pr_btn_Deny		)	.hide();
				
				if(mode==App['const'].MODE_INIT){				
					$(pr_btn_Create	).show();
					// $(pr_btn_Send	).show();
				}else if(mode==App['const'].MODE_SEL){			
					$(pr_btn_Create	)	.show();
					$(pr_btn_Edit	)	.show();
					$(pr_btn_Del	)	.show();
					$(pr_btn_Duplicate	)	.show();
					// $(pr_btn_Send	)	.show();
					
					if(obj.stat == statNew){
						$(pr_btn_Validate	)	.show();
						$(pr_btn_Deny		)	.show();
					}
				}else if(mode==App['const'].MODE_NEW || mode==App['const'].MODE_MOD){
					$(pr_btn_Save		)	.show();
					$(pr_btn_Cancel		)	.show();
				}

				do_bind_event_btn_create	(obj, mode);
				do_bind_event_btn_send		(obj, mode);
				do_bind_event_btn_edit		(obj, mode);		
				do_bind_event_btn_del		(obj, mode);
				//do_bind_event_btn_print	(obj, mode);
				do_bind_event_btn_duplicate (obj, mode);
				do_bind_event_btn_save		(obj, mode);
				do_bind_event_btn_cancel	(obj, mode);
				do_bind_event_btn_validate	(obj, mode);
				do_bind_event_btn_deny		(obj, mode);
			}catch(e) {
				do_gl_show_Notify_Msg_Error("PerEntBtn: " + e.toString());
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.partner", "PerEntBtn", "do_lc_show", e.toString()) ;
			}
		};
		
		//---------private-----------------------------------------------------------------------------

		function do_bind_event_btn_create(){
			$("#btn_PerPartner_create").off('click');
			$("#btn_PerPartner_create").click(function(){
				var newObj		= {"manId" : App.data.user.manId};
				
				self		.do_lc_show(newObj, App['const'].MODE_NEW);
				pr_ctr_Ent	.do_lc_show(newObj, App['const'].MODE_NEW);
				do_Enabled_Edit();
			});
		}	
		
		function do_bind_event_btn_send(){
			$("#btn_PerPartner_send").off('click');
			$("#btn_PerPartner_send").click(function(){
				window.open("view_msg_message.html", "_blank");
			});
		}
		
		var do_bind_event_btn_duplicate	= function(obj){
			$("#btn_PerPartner_duplicate").off('click');
			$("#btn_PerPartner_duplicate").click(function(){
				var newObj 	= $.extend(true, {}, obj);
				newObj.id	= null;
				//var newObj 		= pr_ctr_Ent.do_lc_duplicate(obj);
				App.data.mode 	= App['const'].MODE_NEW;
				
				self		.do_lc_show(newObj, App.data.mode);
				pr_ctr_Ent	.do_lc_show(newObj, App.data.mode);
			});
		}
		
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
			$("#dt01").attr("disabled","disabled");
			$("#dt02").attr("disabled","disabled");
		}
		
		var do_bind_event_btn_validate		= function(obj, mode){
			$(pr_btn_Validate).off('click');
			$(pr_btn_Validate).click(function(){
				pr_ctr_Ent.do_validate_partner(obj.id, lc_stat_validate);
			});
		}
		
		var do_bind_event_btn_deny		= function(obj, mode){
			$(pr_btn_Deny).off('click');
			$(pr_btn_Deny).click(function(){
				pr_ctr_Ent.do_validate_partner(obj.id, lc_stat_denied);
			});
		}
		
		//----------------------------------------------------------------------------------------------
		function doCancel(obj){		
			if(App.data.mode == App['const'].MODE_NEW) {	
				App.data.mode = App['const'].MODE_INIT;
				pr_ctr_Ent	.do_lc_show	(null, App.data.mode);
			} else if(App.data.mode == App['const'].MODE_MOD) {				
				pr_ctr_Ent	.do_lc_Lock_Cancel	(obj);
			} 
		}
	};

	return PerEntBtn;
});