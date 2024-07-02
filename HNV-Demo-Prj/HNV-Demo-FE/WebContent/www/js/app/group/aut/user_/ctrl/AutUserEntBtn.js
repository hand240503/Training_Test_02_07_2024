define([
        'jquery',
        'text!group/aut/user/tmpl/Aut_User_Ent_Btn.html'

        ],

        function($, 
        		AutUser_Ent_Btn) {


	var AutUserEntBtn     = function (header,content,footer, grpName) {
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
			pr_ctr_Main 			= App.controller.AutUser.Main;
			pr_ctr_List 			= App.controller.AutUser.List;
			
			pr_ctr_Ent				= App.controller.AutUser.Ent;
			pr_ctr_EntHeader 		= App.controller.AutUser.EntHeader;
			pr_ctr_EntBtn 			= App.controller.AutUser.EntBtn;
			pr_ctr_EntTabs 			= App.controller.AutUser.EntTabs;
			pr_ctr_Rights			= App.controller.AutUser.Rights;
		}
		

		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;
			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.AUT_USER_ENT_BTN	, AutUser_Ent_Btn); 	
				var data = {};
				if(obj) {
					data = obj;
				}
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.AUT_USER_ENT_BTN, data));

				if(mode==App['const'].MODE_INIT	){ // no material selected				
					$("#btn_AutUser_create"	)	.show();
					$("#btn_AutUser_edit"	)	.hide();
					$("#btn_AutUser_duplicate")	.hide();
					$("#btn_AutUser_del"	)	.hide();

					$("#btn_AutUser_export"	)	.hide();
					$("#btn_AutUser_send"	)	.hide();
					$("#btn_AutUser_print"	)	.hide();
					$("#btn_AutUser_transform")	.hide();

					$("#btn_AutUser_save"	)	.hide();
					$("#btn_AutUser_cancel"	)	.hide();
					
					$("#btn_AutUser_see_cv"	)	.hide();
					
//					var rightCode = pr_ctr_Rights.req_lc_Right(RIGHT_G);
//					if(rightCode == -1){
//						do_gl_show_Notify_Msg_Error($.i18n("job_hld_msg_user_right_error_G"));
//						return;
//					} else {
//						do_get_list_ByAjax_Dyn	($(pr_divFooter));
//					}
				}else if(mode==App['const'].MODE_SEL){ // a object selected				
					$("#btn_AutUser_create"	)	.show();
					$("#btn_AutUser_edit"	)	.show();
					$("#btn_AutUser_duplicate")	.show();
					$("#btn_AutUser_del"	)	.show();

					$("#btn_AutUser_export"	)	.hide();
					$("#btn_AutUser_send"	)	.hide();
					$("#btn_AutUser_print"	)	.hide();
					$("#btn_AutUser_transform")	.hide();

					$("#btn_AutUser_save"	)	.hide();
					$("#btn_AutUser_cancel"	)	.hide();
					
					$("#btn_AutUser_see_cv"	)	.hide();
					if(App.data.user.typ == 10 || App.data.user.typ == 2){
						if(obj.typ == 6 || obj.typ == 5){
							if(obj.cv){
								if(obj.cv.stat == 2) $("#btn_AutUser_see_cv"	)	.show();
							}
						}
					}
					else $("#btn_AutUser_see_cv"	)	.hide();
					
				}else if(mode==App['const'].MODE_NEW){ // in creation or duplication		
					$("#btn_AutUser_create"	)	.hide();
					$("#btn_AutUser_edit"	)	.hide();
					$("#btn_AutUser_duplicate")	.hide();
					$("#btn_AutUser_del"	)	.hide();
					$("#btn_AutUser_transform")	.hide();
					
					$("#btn_AutUser_export"	)	.hide();
					$("#btn_AutUser_send"	)	.hide();
					$("#btn_AutUser_print"	)	.hide();
					$("#btn_AutUser_transform")	.hide();
					
					$("#btn_AutUser_save"	)	.show();
					$("#btn_AutUser_cancel"	)	.show();
					
					$("#btn_AutUser_see_cv"	)	.hide();
				}else if(mode==App['const'].MODE_MOD){ // in modification		
					$("#btn_AutUser_create"	)	.hide();
					$("#btn_AutUser_edit"	)	.hide();
					$("#btn_AutUser_duplicate")	.hide();
					$("#btn_AutUser_del"	)	.hide();
					$("#btn_AutUser_transform")	.hide();
					$("#btn_AutUser_export"	)	.hide();
					$("#btn_AutUser_send"	)	.hide();
					$("#btn_AutUser_print"	)	.hide();

					$("#btn_AutUser_save"	)	.show();
					$("#btn_AutUser_cancel"	)	.show();
					
					$("#btn_AutUser_see_cv"	)	.hide();
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
				
				do_bind_event_btn_see_cv	(obj, mode);	
				
			}catch(e) {				
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "aut.role", "AutUserEntBtn", "do_lc_show", e.toString()) ;
			}
		};


		//---------private-----------------------------------------------------------------------------
		//---------private-----------------------------------------------------------------------------

		var do_bind_event_btn_create		= function(){
			$("#btn_AutUser_create").off('click');
			$("#btn_AutUser_create").click(function(){
				pr_ctr_Ent.do_lc_new();
			});
		}	
		
		var do_bind_event_btn_duplicate	= function(obj){
			$("#btn_AutUser_duplicate").off('click');
			$("#btn_AutUser_duplicate").click(function(){
				//clone obj
				pr_ctr_Ent.do_lc_duplicate(obj);
			});
		}
		
		var do_bind_event_btn_see_cv	= function(obj){
			$("#btn_AutUser_see_cv").off('click');
			$("#btn_AutUser_see_cv").click(function(){
				if(obj.cv){
					var cvId = obj.cv.id;
					window.open("view_nso_work_CV.html?offerId=" + cvId, "_blank");	
				}else{
					do_gl_show_Notify_Msg_Error ($.i18n('common_null_data_or_not_valide'));
				}
			});
		}
		
		var do_bind_event_btn_edit			= function(obj){
			$("#btn_AutUser_edit").off('click');
			$("#btn_AutUser_edit").click(function(){
				pr_ctr_Ent	.do_lc_Lock_Begin(obj);
			});	
		}
		
		var do_bind_event_btn_del			= function(obj){
			$("#btn_AutUser_del").off('click');
			$("#btn_AutUser_del").click(function(){				
				App.MsgboxController.do_lc_show({
					title	: $.i18n("msgbox_confirm_title"	),
					//content : sprintf($.i18n("aut_user_msg_del_content"), obj.name),
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
			$("#btn_AutUser_save").off('click');
			$("#btn_AutUser_save").click(function(){				
				pr_ctr_Ent.do_lc_save(obj, mode);				
			});
		}
		var do_bind_event_btn_cancel		= function(obj, mode){
			$("#btn_AutUser_cancel").off('click');
			$("#btn_AutUser_cancel").click(function(){
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
			$("#btn_AutUser_export").off('click');
			$("#btn_AutUser_export").click(function(){
			});
		}

		var do_bind_event_btn_send		= function(obj, mode){
			$("#btn_AutUser_send").off('click');
			$("#btn_AutUser_send").click(function(){
			});
		}

		var do_bind_event_btn_print		= function(obj, mode){
			$("#btn_AutUser_print").off('click');
			$("#btn_AutUser_print").click(function(){
			});
		}

		var do_bind_event_btn_export		= function(obj, mode){
			$("#btn_AutUser_export").off('click');
			$("#btn_AutUser_export").click(function(){
			});
		}
		
		//----------------------------------------------------------------------------------------------
		function doCancel(obj){		
			if(App.data.mode == App['const'].MODE_NEW) {	
				App.data.mode = App['const'].MODE_INIT;
				pr_ctr_Ent	.do_lc_show		({}, App.data.mode);
			} else if(App.data.mode == App['const'].MODE_MOD) {				
				pr_ctr_Ent	.do_lc_Lock_Cancel	(obj);			
			} 			
		}
	};

	return AutUserEntBtn;
});