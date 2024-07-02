define([
        'jquery',
        'text!group/nso/post/tmpl/Ent_Btn.html',
        'text!group/nso/post/tmpl/Ent_Btn_Sub.html',
        'text!group/nso/post/tmpl/Ent_Btn_Lang.html'
        ],

        function($, 
        		Tmpl_Ent_Btn,
        		Tmpl_Ent_Btn_Sub,
        		Tmpl_Ent_Btn_Lang) {


	var CtrlEntBtn     = function (header, content, footer, grpName) {
		var self 					= this;
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;

		//------------------------------------------------------------------------------------
		var pr_lock_type			= -1; //--const based on BO
		var pr_grpName				= grpName;
		//------------------------------------------------------------------------------------
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;
	
		//---------------------------------------------------------------------------------------------------------
		//DEFINITIONS------DEFINITIONS------DEFINITIONS------DEFINITIONS------DEFINITIONS-----DEFINITIONS-----DEFIN						
		//---------------------------------------------------------------------------------------------------------
		var pr_divContent 			= "#div_Ent_Btn";
		
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;		
		
		var pr_obj					= null;
		var pr_mode					= null;
		var pr_status				= null;
		
		var pr_btn_Create 			= "#btn_create";
		var pr_btn_Edit 			= "#btn_edit";
		var pr_btn_Duplicate 		= "#btn_duplicate";
		var pr_btn_Del 				= "#btn_del";
		var pr_btn_Export 			= "#btn_export";
		var pr_btn_Send 			= "#btn_send";
		var pr_btn_Print 			= "#btn_print";
		var pr_btn_Save 			= "#btn_save";
		var pr_btn_Cancel 			= "#btn_cancel";
		var pr_btn_Save_Sub 		= "#btn_save_sub";
		var pr_btn_Cancel_Sub		= "#btn_cancel_sub";
		var pr_btn_Transform        = "#btn_transform";
		var pr_btn_Validate			= "#btn_validate";
		var pr_btn_Deny				= "#btn_deny";
		var pr_btn_Clone_Lang		= "#btn_clone_lang";
		var pr_btn_See 				= "#btn_see";
		var pr_btn_Preview			= "#btn_preview";
		
		var POST_STAT_NEW	 		= 1;
		var POST_STAT_ACCEPTED	 	= 2;
		var POST_STAT_DENIED		= 3;
		var POST_STAT_DELETED 		= 4;
		
		//---------------------------------------------------------------------------------------------------------
		//INIT CONTROLLER------INIT CONTROLLER------INIT CONTROLLER------INIT CONTROLLER------INIT CONTROLLER-----I								
		//---------------------------------------------------------------------------------------------------------
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller[pr_grpName].Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;
			pr_ctr_Ent				= App.controller[pr_grpName].Ent;
			pr_ctr_EntHeader 		= App.controller[pr_grpName].EntHeader;
			pr_ctr_EntTabs 			= App.controller[pr_grpName].EntTabs;
			
			tmplName.ENT_BTN				= "Tmpl_Ent_Btn";
			tmplName.ENT_BTN_SUB			= "Tmpl_Ent_Btn_Sub";
			tmplName.ENT_BTN_LANG			= "Tmpl_Ent_Btn_LANG";
			
			tmplCtrl.do_lc_put_tmpl(tmplName.ENT_BTN		, Tmpl_Ent_Btn);
			tmplCtrl.do_lc_put_tmpl(tmplName.ENT_BTN_SUB	, Tmpl_Ent_Btn_Sub);
			tmplCtrl.do_lc_put_tmpl(tmplName.ENT_BTN_LANG	, Tmpl_Ent_Btn_Lang); 	
		}
		
		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;
			
			try{
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_BTN, {}));
				$(pr_divContent+"_Sub")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_BTN_SUB	, pr_obj));
				$(pr_divContent+"_Sub")	.hide();
				
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
				$(pr_btn_Clone_Lang )   .hide();
				$(pr_btn_See		)   .hide();
				$(pr_btn_Preview    )   .hide();
				
				if(mode==App['const'].MODE_INIT	){ // no material selected				
					$(pr_btn_Create	)	.show();
				
				}else if(mode == App['const'].MODE_SEL){
					$(pr_btn_Create	)	.show();
					$(pr_btn_Edit	)	.show();
					$(pr_btn_Del	)	.show();
					$(pr_btn_Preview    )   .show();
				
				}else if(mode==App['const'].MODE_NEW){ // in creation or duplication		
					$(pr_btn_Save		)	.show();
					$(pr_btn_Cancel		)	.show();
					$(pr_divContent+"_Sub")	.show();
				
				}else if(mode == App['const'].MODE_MOD){
					$(pr_btn_Save	)		.show();
					$(pr_btn_Clone_Lang )   .show();
					$(pr_btn_See		)   .show();
					$(pr_btn_Cancel	)		.show();
					$(pr_divContent+"_Sub")	.show();
				
				}else if(mode==App['const'].MODE_TRANSL){
					$(pr_btn_Save		)	.show();
					$(pr_btn_See		)   .show();
					$(pr_btn_Cancel		)	.show();
					$(pr_divContent+"_Sub")	.show();
				}
				
				do_bind_event_btn_create	(obj, mode);
				do_bind_event_btn_edit  	(obj, mode);
				do_bind_event_btn_delete  	(obj, mode);
				do_bind_event_btn_validate	(obj, mode);
				do_bind_event_btn_deny		(obj, mode);
				
				do_bind_event_btn_save		(obj, mode);
				do_bind_event_btn_cancel	(obj, mode);
				do_bind_event_btn_clone_lang(obj, mode);
				
				do_bind_event_btn_see		(obj, mode);
				do_bind_event_btn_preview   (obj, mode);
			}catch(e) {
				console.log(e);
				do_gl_show_Notify_Msg_Error("Ctrl: EntBtn :" + e.toString());
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "nso.post", "CtrlEntBtn", "do_lc_show", e.toString()) ;
			}
		}
		
		//---------------------------------------------------------------------------------------------
		//CREATE/VALIDATE/DENY/DELETE NEW POST BY MANAGER-----CREATE/VALIDATE/DENY/DELETE NEW POST BY MANAGER-----VAL
		//---------------------------------------------------------------------------------------------

		var do_bind_event_btn_create		= function(){
			$(pr_btn_Create).off('click');
			$(pr_btn_Create).click(function(){
				pr_ctr_Ent.do_lc_new();
			});
		}
		
		var do_bind_event_btn_validate	= function(obj, mode){
			$(pr_btn_Validate).off('click');
			$(pr_btn_Validate).click(function(){
				pr_ctr_Ent.do_update_post_status(obj, POST_STAT_ACCEPTED);
			});
		}
		
		var do_bind_event_btn_deny		= function(obj, mode){
			$(pr_btn_Deny).off('click');
			$(pr_btn_Deny).click(function(){
				pr_ctr_Ent.do_update_post_status(obj, POST_STAT_DENIED);
			});
		}
		
		var do_bind_event_btn_delete	= function(obj, mode){
			$(pr_btn_Del).off('click');
			$(pr_btn_Del).click(function(){
				pr_ctr_Ent.do_lc_delete(obj);
			});
		}
		
		//---------------------------------------------------------------------------------------------
		//MOD POST-----MOD POST-----MOD POST-----MOD POST-----MOD POST-----MOD POST-----MOD POST-----MO
		//---------------------------------------------------------------------------------------------
		
		function do_bind_event_btn_edit(obj){
			$(pr_btn_Edit).off('click');
			$(pr_btn_Edit).click(function(){
				pr_ctr_Ent	.do_lc_Lock_Begin(obj);
			});	
		}
		
		//---------------------------------------------------------------------------------------------
		//SAVE / CANCEL POST-----SAVE / CANCEL POST-----SAVE / CANCEL POST-----SAVE / CANCEL POST-----
		//---------------------------------------------------------------------------------------------
		
		function do_bind_event_btn_save(obj, mode){
			$(pr_btn_Save).off('click');
			$(pr_btn_Save).click(function(){
				pr_ctr_Ent	.do_lc_save(obj, mode);
			});	
			$(pr_btn_Save_Sub).off('click');
			$(pr_btn_Save_Sub).click(function(){
				pr_ctr_Ent	.do_lc_save(obj, mode);
			});	
			
			
		}
		
		var do_bind_event_btn_cancel		= function(obj, mode){
			var fCancel = function(){
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("common_msg_mod_cancel_confirm"),
					width	: window.innerWidth<1024?"95%":"40%",
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
			};
			$(pr_btn_Cancel).off('click');
			$(pr_btn_Cancel).on("click",fCancel);
			$(pr_btn_Cancel_Sub).off('click');
			$(pr_btn_Cancel_Sub).on("click",fCancel);
		}
		
		function doCancel(obj){		
			if(App.data.mode == App['const'].MODE_NEW) {	
				App.data.mode = App['const'].MODE_INIT;
				self		.do_lc_show		(null, App.data.mode);
				pr_ctr_Ent	.do_lc_show		(null, App.data.mode);
			} else if(App.data.mode == App['const'].MODE_MOD) {				
				pr_ctr_Ent	.do_lc_Lock_Cancel	(obj);			
			} else if(App.data.mode == App['const'].MODE_TRANSL) {				
				App.data.mode = App['const'].MODE_SEL;
				self		.do_lc_show		(null, App.data.mode);
				pr_ctr_Ent	.do_lc_show		(null, App.data.mode);	
			} 	 			
		}
		
		//---------------------------------------------------------------------------------------------
		//OTHER BUTTONS-----OTHER BUTTONS-----OTHER BUTTONS-----OTHER BUTTONS-----OTHER BUTTONS-----OTH
		//---------------------------------------------------------------------------------------------

		var do_bind_event_btn_duplicate	= function(obj){
			$(pr_btn_Duplicate).off('click');
			$(pr_btn_Duplicate).click(function(){
				//clone obj
				pr_ctr_Ent.do_lc_duplicate(obj);
			});
		}
		
		var do_bind_event_btn_clone_lang	= function(obj, mode){
			$(pr_btn_Clone_Lang).off('click');
			$(pr_btn_Clone_Lang).click(function(){
				App.MsgboxController.do_lc_show({
					title	: $.i18n("common_select_lang"),
					content : tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_BTN_LANG, {}),
					width	: window.innerWidth<1024?"95%":"40%",
					buttons	: {
						OK: {
							lab		: $.i18n("common_btn_ok"),
							funct	: doCloneLang,
							param	: [obj]							
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel")								
						}
					}
				});	
			});
		}
		
		var do_bind_event_btn_print		= function(obj, mode){
			$(pr_btn_Print).off('click');
			$(pr_btn_Print).click(function(){
			});
		}
		
		var do_bind_event_btn_export		= function(obj, mode){
			$(pr_btn_Export).off('click');
			$(pr_btn_Export).click(function(){
			});
		}
		
		var doCloneLang = function (obj){
			var lang 		= $("#select_lang select").val();
			var modeTransl 	= App['const'].MODE_TRANSL;
			var objId 		= obj.id;
			window.open("view_nso_post.html?id=" + objId + "&mode=" + modeTransl + "&lang=" +  lang, "_blank");	
		}
		
		var do_bind_event_btn_see		= function(obj, mode){
			$(pr_btn_See).off('click');
			$(pr_btn_See).click(function(){
				var postId 	= obj.id;
				var lang	= obj.lang;
				
				if(mode==App['const'].MODE_TRANSL){
					window.open("/view_post.html?forManager=true&id=" + postId+ "&lang=" + lang , "_blank");
				}else{
					window.open("/view_post.html?forManager=true&id=" + postId , "_blank");
				}
			});
		}
		
		var do_bind_event_btn_preview	= function(obj, mode){
			$(pr_btn_Preview).off('click');
			$(pr_btn_Preview).click(function(){
				var postId 	= obj.id;
				window.open("/view_post.html?forManager=true&id=" + postId , "_blank");
			});
		}
		
	};

	return CtrlEntBtn;
});