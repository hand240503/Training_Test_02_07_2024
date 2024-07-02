define([
        'jquery',
        
        'text!group/cms/tmpl/menu/CMS_Menu.html',
        'text!group/cms/tmpl/menu/userpanel/CMS_Menu_UserPanel.html',
        'text!group/cms/tmpl/menu/userpanel/CMS_Menu_Search.html',
        'text!group/cms/tmpl/menu/sidebarmenu/CMS_Menu_SidebarMenu.html',
        
        ],
    function($,

    		CMS_Menu,
    		CMS_Menu_UserPanel,
    		CMS_Menu_Search,
    		CMS_Menu_SidebarMenu
    ) {
        
	
	var CMSMenuController 	= function () {
		
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
		this.var_lc_ulMenu_SidebarMenu	= "#ul_Menu_SidebarMenu";
		
		var pr_inpMenuSearch			=	"#inp_Menu_Search";
		var pr_btnMenuSearch			=	"#btn_Menu_Search";
		
		var pr_Timeout_Search_Function 	= null;
		var pr_Timeout_Search_Value		= 500;
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_CMSMain 			= App.controller.CMS.Main;
			pr_ctr_CMSHeader 		= App.controller.CMS.Header;
			pr_ctr_CMSContent 		= App.controller.CMS.Content;
			pr_ctr_CMSFooter 		= App.controller.CMS.Footer;
			pr_ctr_CMSMenu 			= App.controller.CMS.Menu;
			pr_ctr_CMSSettings 		= App.controller.CMS.Settings;
			
			
			tmplName.CMS_MENU				= "CMS_Menu";
			tmplName.CMS_MENU_USERPANEL		= "CMS_Menu_UserPanel";
			tmplName.CMS_MENU_SEARCH		= "CMS_Menu_Search";
			tmplName.CMS_MENU_SIDEBARMENU	= "CMS_Menu_SidebarMenu";
			
		}
		
		//--------------------------------------------------------------------------------------------------
	
		this.do_lc_show	= function(domains){
			try {
				tmplCtrl.do_lc_put_tmpl(tmplName.CMS_MENU						, CMS_Menu);
	        	tmplCtrl.do_lc_put_tmpl(tmplName.CMS_MENU_USERPANEL			, CMS_Menu_UserPanel);
	        	tmplCtrl.do_lc_put_tmpl(tmplName.CMS_MENU_SEARCH				, CMS_Menu_Search);
	        	tmplCtrl.do_lc_put_tmpl(tmplName.CMS_MENU_SIDEBARMENU			, CMS_Menu_SidebarMenu);
	        	
	        	$(App.constHTML.id.MENU_VIEW)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CMS_MENU, {}));
	        	$(App.constHTML.id.MENU_USERPANEL)				.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CMS_MENU_USERPANEL, App.data.user));
	        	$(App.constHTML.id.MENU_SEARCH)					.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CMS_MENU_SEARCH, {}));
	        	$(App.constHTML.id.MENU_SIDEBARMENU)			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CMS_MENU_SIDEBARMENU, domains));

	    		doBindings();
			} catch (e) {
				pr_ctr_CMSMain.do_show_Msg(null, e);
			}	
		}

        //--------------------------------------------------------------------------------------------------
        function doBindings() {
//        	doBindingButton();
        	
        	doBindings_Event_Search();
        	doBindingLink();
    	}
    	
    	//--------------------------------------------------------------------------------------------------
    	function doBindingButton() {

    	}
    	
    	//--------------------------------------------------------------------------------------------------
    	this.do_lc_AddRemoveClassActiveMenu = function(divCurUl, divCurBtn) {
    		do_gl_Add_Class_List(divCurUl, divCurBtn);
    	}
    	
        //--------------------------------------------------------------------------------------------------
    	this.do_lc_ShowItemMenu = function(flag, type) {
    		switch (type) {
				case 1:

					break;

				default:
					
					break;
			}
    		
    	} 

    	//--------------------------------------------------------------------------------------------------
		var doBindings_Event_Search = function() {
			$(pr_inpMenuSearch).off("input");
			$(pr_inpMenuSearch).on("input", function() {
				if(pr_Timeout_Search_Function) {
					//do nothing
//					clearTimeout(pr_Timeout_Search_Function);
					
				} else {	
					pr_Timeout_Filter_Function = setTimeout(function() {
						var key = $(pr_inpMenuSearch).val();
						
						doSearchMenuStep01(self.var_lc_ulMenu_SidebarMenu + " li", key.toLowerCase());
						doSearchMenuStep02();
						
						pr_Timeout_Search_Function = null;
						
					}, pr_Timeout_Search_Value);
				}
				
			});
		}
    	
    	//--------------------------------------------------------------------------------------------------
		var clickCount 			=	0;
		var singleClickTimer 	= 	null;
		function doBindingLink(){
			
			$("#li_Menu_SidebarMenu_Home").off("click");
			$("#li_Menu_SidebarMenu_Home").click(function(){
				App.controller.Home.Main.do_lc_show();
			});
			
			$(".li_Menu_SidebarMenu_Child_Item a").off("dblclick");
			$(".li_Menu_SidebarMenu_Child_Item a").off("click");
			$(".li_Menu_SidebarMenu_Child_Item a").click(function() {
				var url 				= this.href;
				
				clickCount++;
				if (clickCount === 1) {
					singleClickTimer = setTimeout(function() {
						clickCount = 0;
						window.open(url, '_self');
					}, 500);
					
				} else if (clickCount === 2) {
					if (singleClickTimer) clearTimeout(singleClickTimer);
					singleClickTimer 	= null;
					clickCount 			= 0;
					window.open(url, '_blank');
				}
				return false;
			})
			
//			$('#').click(function() {
//			return false;
//		}).dblclick(function() {
//			window.location = this.href;
//			return false;
//		}).keydown(function(event) {
//			switch (event.which) {
//			case 13: // Enter
//			case 32: // Space
//				window.location = this.href;
//				return false;
//			}
//		});
		}
		
		function doSearchMenuStep01(div, key) {	
			$(div).filter(function() {
				var name = $(this).attr("data-name").toLowerCase();
			    return name.indexOf(key) > -1;
			}).attr("data-check", 1);//css("display", "block");
			
			$(div).filter(function() {
				var name = $(this).attr("data-name").toLowerCase();
			    return name.indexOf(key) === -1;
			}).attr("data-check", 0);//css("display", "none");

		}
		
		function doSearchMenuStep02() {		
			$(".li_Menu_SidebarMenu_Child_Item").each(function() {
				var check 	= $(this).attr("data-check");
				var idP		= $(this).attr("data-idParent");
				
				if(check==1) {
					var checkParent 	= 	$("#li_Menu_SidebarMenu_Item_"+idP).attr("data-check");
					if(checkParent==0)		$("#li_Menu_SidebarMenu_Item_"+idP).attr("data-check", 1);
				}
			});
			
			$(self.var_lc_ulMenu_SidebarMenu + " li").each(function() {
				var check = $(this).attr("data-check");
				if(check==1)	$(this).css("display", "block");
				else			$(this).css("display", "none");
			});
			
		
			

		}
		
		//--------------------------------------------------------------------------------------------------
    	//--------------------------------------------------------------------------------------------------
    	//--------------------------------------------------------------------------------------------------
    	//--------------------------------------------------------------------------------------------------
    	//--------------------------------------------------------------------------------------------------
        
    };
    
    return CMSMenuController;
    
});