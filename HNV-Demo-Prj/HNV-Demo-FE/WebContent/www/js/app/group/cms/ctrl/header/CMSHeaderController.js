define([
        'jquery',
        
        'text!group/cms/tmpl/header/CMS_Header.html',
        'text!group/cms/tmpl/header/logo/CMS_Header_Logo.html',
        'text!group/cms/tmpl/header/navbar/CMS_Header_Navbar.html',
        
        'text!group/cms/tmpl/header/navbar/CMS_Header_Navbar_Messages.html',
        'text!group/cms/tmpl/header/navbar/CMS_Header_Navbar_Notifications.html',
        
        
        ],
    function($,

    		CMS_Header,
    		CMS_Header_Logo,
    		CMS_Header_Navbar,
    		
    		CMS_Header_Navbar_Messages,
    		CMS_Header_Navbar_Notifications

    ) {
        
	
	var CMSHeaderController 	= function () {
		
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
		var pr_ctr_CMSMain 			= null;
		var pr_ctr_CMSHeader 		= null;
		var pr_ctr_CMSContent		= null;
		var pr_ctr_CMSFooter 		= null;
		var pr_ctr_CMSMenu 			= null;
		var pr_ctr_CMSSettings 		= null;
		
		//--------------------------------------------------------------------------------------------------

		var pr_liNavbarLangEN			= "#li_Navbar_Lang_EN";
		var pr_liNavbarLangFR			= "#li_Navbar_Lang_FR";
		var pr_liNavbarLangVN			= "#li_Navbar_Lang_VN";
		
		var pr_liNavbarMessage			= "#li_Navbar_Messages";
		var pr_liNavbarNotify			= "#li_Navbar_Notifications";
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_CMSMain 			= App.controller.CMS.Main;
			pr_ctr_CMSHeader 		= App.controller.CMS.Header;
			pr_ctr_CMSContent 		= App.controller.CMS.Content;
			pr_ctr_CMSFooter 		= App.controller.CMS.Footer;
			pr_ctr_CMSMenu 			= App.controller.CMS.Menu;
			pr_ctr_CMSSettings 		= App.controller.CMS.Settings;
			
			
			tmplName.CMS_HEADER							= "CMS_Header";
			tmplName.CMS_HEADER_LOGO					= "CMS_Header_Logo";
			tmplName.CMS_HEADER_NAVBAR					= "CMS_Header_Navbar";
			tmplName.CMS_HEADER_NAVBAR_MESSAGES			= "CMS_Header_Navbar_Messages";
			tmplName.CMS_HEADER_NAVBAR_NOTIFICATIONS	= "CMS_Header_Navbar_Notifications";
			
		}
		
		//--------------------------------------------------------------------------------------------------
	
		this.do_lc_show	= function(){
			try { 					
				tmplCtrl.do_lc_put_tmpl(tmplName.CMS_HEADER						, CMS_Header);
	        	tmplCtrl.do_lc_put_tmpl(tmplName.CMS_HEADER_LOGO					, CMS_Header_Logo);
	        	tmplCtrl.do_lc_put_tmpl(tmplName.CMS_HEADER_NAVBAR					, CMS_Header_Navbar);
	        	tmplCtrl.do_lc_put_tmpl(tmplName.CMS_HEADER_NAVBAR_MESSAGES		, CMS_Header_Navbar_Messages);
	        	tmplCtrl.do_lc_put_tmpl(tmplName.CMS_HEADER_NAVBAR_NOTIFICATIONS	, CMS_Header_Navbar_Notifications);

	        	
	        	$(App.constHTML.id.HEADER_VIEW)			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CMS_HEADER, {}));
	        	$(App.constHTML.id.HEADER_LOGO_VIEW)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CMS_HEADER_LOGO, App.data.pers_manager==null?{}:App.data.pers_manager));
	        	$(App.constHTML.id.HEADER_NAVBAR_VIEW)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CMS_HEADER_NAVBAR, App.data.user==null?{}:App.data.user));
	        	
	        	$(pr_liNavbarMessage)		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CMS_HEADER_NAVBAR_MESSAGES		, {}));
	        	$(pr_liNavbarNotify)		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CMS_HEADER_NAVBAR_NOTIFICATIONS, {}));
	        	
	        	
	        	doBindings();
	        	doGetNotificationList();
			}
			catch(e) {
				pr_ctr_CMSMain.do_show_Msg(null, e);
			}
		}
        
        //--------------------------------------------------------------------------------------------------        
        
        var doBindings = function() {
        	//rebuild content view style after load header
        	do_gl_rebuildContentViewStyle();
        	
        	doBindingNavbar();
        	
			doBindingEventLogo();
        	
//			doBindingEventRegister();
//			doBindingEventLogin();
        	
        	doBindingEventProfile();
        	
        	doBindingEventLogout();
        	
        	doBindingEventHelp();
        }
        
        var doBindingEventHelp = function() {
			
			//bind help button event
			$("#li_sys_Help").on("click", function() {
				do_lc_show_help(FIRST_VIEW);
			});
        }
    	
    	//--------------------------------------------------------------------------------------------------
    	var doBindingNavbar = function() {
    		$(pr_liNavbarLangEN).off("click");
    		$(pr_liNavbarLangEN).on("click", function () {
    			pr_ctr_CMSMain.do_lc_switchLanguage(App['const'].LANGUAGE.EN, App['const'].LANGUAGE_ID.EN);
    		});
    		
    		$(pr_liNavbarLangFR).off("click");
    		$(pr_liNavbarLangFR).on("click", function () {
    			pr_ctr_CMSMain.do_lc_switchLanguage(App['const'].LANGUAGE.FR, App['const'].LANGUAGE_ID.FR);
    		});
    		
    		$(pr_liNavbarLangVN).off("click");
    		$(pr_liNavbarLangVN).on("click", function () {
    			pr_ctr_CMSMain.do_lc_switchLanguage(App['const'].LANGUAGE.VN, App['const'].LANGUAGE_ID.VN);
    		});
    		
    		$(pr_liNavbarMessage).off("click");
    		$(pr_liNavbarMessage).on("click", function () {
    			window.open("view_msg_message.html", "_self");
    		});
    		
    		$(pr_liNavbarNotify).off("click");
    		$(pr_liNavbarNotify).on("click", function () {
    			doBindingNotificationClick();
//    			window.open("view_msg_message.html", "_self");
    		});
        }
    	
    	//-------------------------------------------------------------------------------------------------
    	var doBindingNotificationClick = function() {
    		$("#wygo-notification").find("li").each(function(i, e) {
				$(this).on("click", function(e) {
					var idx = $(this).attr("data-index");
					console.log(idx)
//					window.open(var_gl_page_area_view+"?areaId=" + App.data[varname][index].id, App.controller.CMS.Main.do_lc_newTab(e));
				});
			});
    	}
    	
    	//--------------------------------------------------------------------------------------------------
    	var doBindingEventLogo = function() {
        	var aLogo 	  			= "#a_Header_Logo";
        	
        	$(aLogo).off("click");
			$(aLogo).on("click", function() {			
				App.router.controller.do_lc_run(App.router.routes.HOME);
			});
        }
    	
    	//--------------------------------------------------------------------------------------------------
    	var doBindingEventRegister = function() {
        	var btnRegister 	  			= "#btn_Header_Register";
        	
        	$(btnRegister).off("click");
			$(btnRegister).on("click", function() {			
				//App.router.controller.do_lc_run(App.router.routes.REGISTER_VIEW);
				//App.router.controller.do_lc_run(App.router.routes.PERS_VIEW +"/"+var_gl_Pers_New);
			});	
        }
    	
    	//--------------------------------------------------------------------------------------------------
    	var doBindingEventLogin = function() {
        	var btnLogin 	  			= "#btn_Header_Login";
        	
        	$(btnLogin).off("click");
			$(btnLogin).on("click", function() {			
//				App.router.controller.do_lc_run(App.router.routes.LOGIN);
//				alert("Need to fix here!!!");
			});
        }
    	
    	//--------------------------------------------------------------------------------------------------
    	var doBindingEventProfile = function() {
//        	var btnProfile 	  			= "#btn_Header_Profile";
//        	
//        	$(btnProfile).off("click");
//			$(btnProfile).on("click", function() {			
//				App.router.controller.do_lc_run(App.router.routes.AUT_PROFILE);
//			});
        }
    	
    	//--------------------------------------------------------------------------------------------------
    	var doBindingEventLogout = function() {
        	var btnLogout 	  			= "#btn_Header_Logout";
        	
        	$(btnLogout).off("click");
			$(btnLogout).on("click", function() {	
				var title 	= "login_popup_logout_title";
				var msg		= "login_popup_logout_content";
				
				App.MsgboxController.do_lc_show({
					title	: $.i18n(title),
					content : $.i18n(msg),
					buttons	: {
						OK: {
							lab		: $.i18n("common_btn_ok"),
							funct	: function() {
								if (FIRST_VIEW)
									App.router.controller.do_lc_run(App.router.routes.LOGOUT+'/'+FIRST_VIEW);
								else
									App.router.controller.do_lc_run(App.router.routes.LOGOUT);
							},			
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					}
				});
				
			});
        }
    	
    	//-------------- Get list of notifications from server------------------
    	var doGetNotificationList = function() {
    		var ref = req_gl_Request_Content_Send("ServiceMessageNotification", "SVMsgMessageNotificationLst");

			var fSucces = [];
			fSucces.push(req_gl_funct(null, do_callback_fetchResp, []));

			var fError = req_gl_funct(null, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);

			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV,  App.data.user.headerURLSecu, ref, 100000, fSucces, fError) ;	
    	}
    	
		//-----------------------------------------------------------------------
		function do_callback_fetchResp(sharedJson) {
			if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				var data = sharedJson[App['const'].RES_DATA];
				var dataObj = {};
				dataObj.data = data;
				dataObj.length = data.length;
				$(pr_liNavbarNotify)		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CMS_HEADER_NAVBAR_NOTIFICATIONS,  dataObj));
				doModSeenNotification(data);

			} else {
				do_gl_show_Notify_Msg_Error($.i18n ("content_send_not_succes"));
			}
		}
		
		//--------------------------------------------------------------------------------------------------
		var doModSeenNotification = function(data) {
			var ref = req_gl_Request_Content_Send("ServiceMessageNotification", "doMsgMessageNotificationMod");
			var obj = req_gl_data({
				dataZoneDom : $(''),
				showError : true
			});
			obj.data = data;
			var fSucces = [];
			fSucces.push(req_gl_funct(null, do_callback_fetchResp, []));

			var fError = req_gl_funct(null, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax") ]);
			
//			obj.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data.user.headerURLSecu, ref, fSucces, fError, "obj");
		}
    	
    	//--------------------------------------------------------------------------------------------------
    	this.do_lc_ShowNavbar = function(flag, type) {	
    		switch (type) {

				case 1:
					break;
	
				default:
					break;
				
			}
    		
    	} 
    	
    	//--------------------------------------------------------------------------------------------------
    	//--------------------------------------------------------------------------------------------------
    	//--------------------------------------------------------------------------------------------------
    	//--------------------------------------------------------------------------------------------------
    	//--------------------------------------------------------------------------------------------------
    	//--------------------------------------------------------------------------------------------------

        
    };
    
    return CMSHeaderController;
    
});