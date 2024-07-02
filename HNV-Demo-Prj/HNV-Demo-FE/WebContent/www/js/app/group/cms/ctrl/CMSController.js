define(['require',
        'jquery',

        'group/cms/ctrl/header/CMSHeaderController',
        'group/cms/ctrl/content/CMSContentController',
        'group/cms/ctrl/footer/CMSFooterController',
        'group/cms/ctrl/menu/CMSMenuController',
        
        
//        'group/cms/ctrl/settings/CMSSettingsController',
        
//        'controller/home/HomeMain'
        ],
    function(require, $,
    		
    		CMSHeaderController,
    		CMSContentController,
    		CMSFooterController,
    		CMSMenuController
    		
    		
//    		HomeMain
    ) {
        
	
	var CMSController 	= function () {	
//		var HomeMain				=  require('controller/home/HomeMain');
		
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
		var pr_grpPath				= 'group/cms';
		//--------------------------------------------------------------------------------------------------
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			if (!App.controller.CMS)				
				 App.controller.CMS				= {};
			
			if (!App.controller.CMS.Main)	
				App.controller.CMS.Main 			= this; //important for other controller can get ref, when new this controller,
			
			if (!App.controller.CMS.Header)  
				App.controller.CMS.Header			= new CMSHeaderController();
			if (!App.controller.CMS.Content)  
				App.controller.CMS.Content			= new CMSContentController();
			if (!App.controller.CMS.Footer)  
				App.controller.CMS.Footer			= new CMSFooterController();
			if (!App.controller.CMS.Menu)  
				App.controller.CMS.Menu				= new CMSMenuController();
//			if (!App.controller.CMS.Settings)  
//				App.controller.CMS.Settings			= new CMSSettingsController();
			
			//for list domain in menu
//			if (!App.controller.Home) {
//				App.controller.Home = {};
//			}
//			if (!App.controller.Home.Main)	
//				App.controller.Home.Main		= new HomeMain(null, "#div_CMSContentView", null);

			
			App.data["HttpSecuHeader"]			= req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL);
			
			App.controller.CMS.Header			.do_lc_init();
			App.controller.CMS.Content			.do_lc_init();
			App.controller.CMS.Footer			.do_lc_init();
			App.controller.CMS.Menu				.do_lc_init();
			
//			App.controller.CMS.Settings			.do_lc_init();
//			App.controller.Home.Main			.do_lc_init();
			
		}
		this.do_lc_show      	= function (nextView) {
            do_gl_lang_append(pr_grpPath + 'transl', self.do_lc_show_callback, nextView);
        };

		this.do_lc_show_callback = function(nextView){
			try {
				do_gl_addClassHTMLBody(App.constHTML.classBody.HOMEPAGE);
				
				doBuildUserAvatar(App.data.user);
				
				do_req_pers_manager(App.controller.CMS.Header.do_lc_show);
				App.controller.CMS.Content			.do_lc_show();
				App.controller.CMS.Footer			.do_lc_show();
				
//				App.controller.Home.Main.req_domain_list(App.controller.CMS.Menu.do_lc_show);
//				App.controller.CMS.Menu				.do_lc_show();
//				App.controller.CMS.Settings			.do_lc_show();
				
				doBindings();
			}
			catch(e) {
				self.do_show_Msg(null, e);
			}
		}
		
		//--------------------------------------------------------------------------------------------------
		var doBindings = function() {
        	do_gl_bindingAppLTE();
        }.bind(this);

        //--------------------------------------------------------------------------------------------------
        var do_req_pers_manager = function(callback) {
        	var user = App.data.user;
        	if(!user || !user.per) {
				do_gl_show_Notify_Msg_Error($.i18n("common_err_ajax"));
				return;
			}
        	
        	if(!App.data.pers_manager || App.data.pers_manager.id != user.per.parent) {
        		var perManagerId = user.manId;

        		var ref 		= req_gl_Request_Content_Send('ServicePerPerson', 'SVPersonGet');			
        		ref["id"]		= perManagerId;

    			var fSucces		= [];	
    			fSucces.push(req_gl_funct(null, do_req_pers_manager_response, [callback]));	

    			var fError 		= req_gl_funct(this, this.do_show_Msg, [$.i18n("common_err_ajax")]);
    			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;

        	} else {
        		callback();
        	}

        }
		
        var do_req_pers_manager_response = function(sharedJson, callback) {
        	if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
        		App.data.pers_manager = sharedJson[App['const'].RES_DATA];
        	} else {
        		App.data.pers_manager = {};
        	}
        	
      		callback();
        }
        
        //--------------------------------------------------------------------------------------------------
    	this.do_lc_showElement = function(idEle, flag) {
    		if(flag)
    			$(idEle).css("display", "block");
    		else
    			$(idEle).css("display", "none");
    	}
    	
    	this.do_lc_switchLanguage = function(language, languageId) {
    		App.MsgboxController.do_lc_show({
		        title	: $.i18n("msgbox_confirm_title"),
		        content	: sprintf($.i18n("lang_switch_confirm"), $.i18n("lang_" + language)),
		        buttons	: {
		        	YES: {
						lab	 : $.i18n("common_btn_yes"),
						funct: self.do_lc_switchLanguage_without_msgbox,
						param: [language],
						funct: function() {
							if (!language) {
				    			if (localStorage && localStorage.language) {
				    				language 	= localStorage.language;
				    				languageId	= localStorage.languageId;
				    			} else {
				    				language 	= 'vn';
				    				languageId	= 1;
				    			}
				    		}
				    		
				    		$.i18n({locale: language});
				    		localStorage.language 	= language;
				    		localStorage.languageId = languageId;
				    		
//				    		App.language			= localStorage.language;
				    		
    						App.router.controller.do_lc_run(FIRST_VIEW); //App.router.routes.HOME
    						window.location.reload();
						}
					},
					CANCEL: {
						lab : $.i18n("common_btn_cancel")
					}
		        },
		        bindEvent: function() {
		        }
			});
    	}
    	
    	this.do_lc_switchLanguage_without_msgbox = function(language, languageId = 1) {
    		if (!language) {
    			if (localStorage && localStorage.language) {
    				language 	= localStorage.language;
    				languageId	= localStorage.languageId;
    			} else {
    				language 	= 'vn';
    				languageId	= 1;
    			}
    		}
    		
    		$.i18n({locale: language});
    		localStorage.language 	= language;
    		localStorage.languageId = languageId;
    		
    		
//    		App.language			= localStorage.language;
//    		App.router.controller.do_lc_run(FIRST_VIEW); //App.router.routes.HOME
    		window.location.reload();
    	}
    	
    	//--------------------------------------------------------------------------------------------------
    	var doBuildUserAvatar = function(user, notPublic) {
    		if(user) {
    			if(user.per) {
    				user.per.defaultAvatar = "www/img/default_avatar_male.png";
    				if(user.per.files && user.per.files.length > 0) {
    					var fList = user.per.files;
    					$.each(fList, function(i, e) {
    						if(e.typ01 == 2) {
    							if (notPublic)
    								user.per.avatar = App.path.BASE_URL_API + "?" + (e.path03?e.path03:e.path01); //path03 is preview then resolution is lower
    							else
    								user.per.avatar = e.path03?e.path03:e.path01;
    						}
    					})
    				}
    			}
    		}
    	}
    	//--------------------------------------------------------------------------------------------------
    	//--------------------------------------------------------------------------------------------------
    	this.do_show_Msg= function(sharedJson, msg){
			//alert(msg);
			console.log("do_show_Msg::" + msg);
		}
    	
    	
    
        
    };
    
    return CMSController;
    
});