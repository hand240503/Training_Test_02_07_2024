define([
        'jquery',
        'text!template/per/contract/PerContract_Ent_Btn.html'

        ],

        function($, 
        		PerContract_Ent_Btn) {


	var PerContractEntBtn     = function (header,content,footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content
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
		
		//-----------------------------------------------------------------------------------
		var pr_btn_Create 			= "#btn_PerContract_create";
		var pr_btn_Edit 			= "#btn_PerContract_edit";
		var pr_btn_Duplicate 		= "#btn_PerContract_duplicate";
		var pr_btn_Del 				= "#btn_PerContract_del";
		var pr_btn_Export 			= "#btn_PerContract_export";
		var pr_btn_Send 			= "#btn_PerContract_send";
		var pr_btn_Print 			= "#btn_PerContract_print";
		var pr_btn_Save 			= "#btn_PerContract_save";
		var pr_btn_Cancel 			= "#btn_PerContract_cancel";
		var pr_btn_Transform 		= "#btn_PerContract_transform";
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.PerContract.Main;
			pr_ctr_List 			= App.controller.PerContract.List;
			
			pr_ctr_Ent				= App.controller.PerContract.Ent;
			pr_ctr_EntHeader 		= App.controller.PerContract.EntHeader;
			pr_ctr_EntBtn 			= App.controller.PerContract.EntBtn;
			pr_ctr_EntTabs 			= App.controller.PerContract.EntTabs;
		}
		

		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;
			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_ENT_BTN	, PerContract_Ent_Btn); 			
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_ENT_BTN, obj));

				if(mode==App['const'].MODE_INIT	){ // no material selected				
					$(pr_btn_Create		)	.show();
					$(pr_btn_Edit		)	.hide();
					$(pr_btn_Duplicate	)	.hide();
					$(pr_btn_Del		)	.hide();

					$(pr_btn_Export		)	.hide();
					$(pr_btn_Send		)	.hide();
					$(pr_btn_Print		)	.hide();

					$(pr_btn_Save		)	.hide();
					$(pr_btn_Cancel		)	.hide();
					$(pr_btn_Transform	)	.hide();
				}else if(mode==App['const'].MODE_SEL){ // a object selected				
					$(pr_btn_Create		)	.show();
					$(pr_btn_Edit		)	.show();
					$(pr_btn_Duplicate	)	.show();
					$(pr_btn_Del		)	.show();

					$(pr_btn_Export		)	.hide();
					$(pr_btn_Send		)	.hide();
					$(pr_btn_Print		)	.hide();

					$(pr_btn_Save		)	.hide();
					$(pr_btn_Cancel		)	.hide();
					$(pr_btn_Transform	)	.hide();
				}else if(mode==App['const'].MODE_NEW){ // in creation or duplication		
					$(pr_btn_Create		)	.hide();
					$(pr_btn_Edit		)	.hide();
					$(pr_btn_Duplicate	)	.hide();
					$(pr_btn_Del		)	.hide();
					
					$(pr_btn_Export		)	.hide();
					$(pr_btn_Send		)	.hide();
					$(pr_btn_Print		)	.hide();

					$(pr_btn_Save		)	.show();
					$(pr_btn_Cancel		)	.show();
					$(pr_btn_Transform	)	.hide();
				}else if(mode==App['const'].MODE_MOD){ // in modification		
					$(pr_btn_Create		)	.hide();
					$(pr_btn_Edit		)	.hide();
					$(pr_btn_Duplicate	)	.hide();
					$(pr_btn_Del		)	.hide();

					$(pr_btn_Export		)	.hide();
					$(pr_btn_Send		)	.hide();
					$(pr_btn_Print		)	.hide();

					$(pr_btn_Save		)	.show();
					$(pr_btn_Cancel		)	.show();
					$(pr_btn_Transform	)	.hide();
				}

				do_bind_event_btn_create	(obj, mode);
				do_bind_event_btn_edit		(obj, mode);
				do_bind_event_btn_duplicate	(obj, mode);
				do_bind_event_btn_del		(obj, mode);

				do_bind_event_btn_export	(obj, mode);
				do_bind_event_btn_send		(obj, mode);
				do_bind_event_btn_print		(obj, mode);

				do_bind_event_btn_save		(obj, mode);
				do_bind_event_btn_cancel	(obj, mode);			
			}catch(e) {				
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.contract", "PerContractEntBtn", "do_lc_show", e.toString()) ;
			}
		};

		//---------private-----------------------------------------------------------------------------
		var do_bind_event_btn_create		= function(){
			$(pr_btn_Create).off('click');
			$(pr_btn_Create).click(function(){
				pr_ctr_Ent.do_lc_new();
			});
		}	
		
		var do_bind_event_btn_duplicate	= function(obj){
			$(pr_btn_Duplicate).off('click');
			$(pr_btn_Duplicate).click(function(){
				//clone obj
				pr_ctr_Ent.do_lc_duplicate(obj);
			});
		}
		
		var do_bind_event_btn_edit			= function(obj){
			$(pr_btn_Edit).off('click');
			$(pr_btn_Edit).click(function(){
				pr_ctr_Ent	.do_lc_Lock_Begin(obj);
			});	
		}
		
		var do_bind_event_btn_del			= function(obj){
			$(pr_btn_Del).off('click');
			$(pr_btn_Del).click(function(){				
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("common_msg_del_confirm"),
					buttons	: {
						OK: {
							lab		: $.i18n("common_btn_ok"),
							funct	: pr_ctr_Ent	.do_lc_delete,
							param	: [obj]						
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					}
				});				
			});
		}
		
		var do_bind_event_btn_save			= function(obj, mode){
			$(pr_btn_Save).off('click');
			$(pr_btn_Save).click(function(){				
				pr_ctr_Ent.do_lc_save(obj, mode);				
			});
		}
		var do_bind_event_btn_cancel		= function(obj, mode){
			$(pr_btn_Cancel).off('click');
			$(pr_btn_Cancel).click(function(){
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

		var do_bind_event_btn_export		= function(obj, mode){
			$(pr_btn_Export).off('click');
			$(pr_btn_Export).click(function(){
			});
		}

		var do_bind_event_btn_send		= function(obj, mode){
			$(pr_btn_Send).off('click');
			$(pr_btn_Send).click(function(){
			});
		}

		var do_bind_event_btn_print		= function(obj, mode){
			$(pr_btn_Print).off('click');
			$(pr_btn_Print).click(function(){
			});
		}

		//----------------------------------------------------------------------------------------------
		function doCancel(obj){		
			if(App.data.mode == App['const'].MODE_NEW) {	
				App.data.mode = App['const'].MODE_SEL;
				pr_ctr_Ent	.do_lc_show	(null, App.data.mode);
			} else if(App.data.mode == App['const'].MODE_MOD) {				
				pr_ctr_Ent	.do_lc_Lock_Cancel	(obj);			
			} 			
		}
	};

	return PerContractEntBtn;
});