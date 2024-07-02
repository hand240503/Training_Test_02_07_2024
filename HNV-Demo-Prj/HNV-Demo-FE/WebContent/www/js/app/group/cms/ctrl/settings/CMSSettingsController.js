define([
        'jquery',
        
        'text!group/cms/tmpl/settings/CMS_Settings_Config.html',
        'text!group/cms/tmpl/settings/CMS_Settings_Load.html',

        ],
    function($,

    		CMS_Settings_Config,
    		CMS_Settings_Load
    ) {
        
	
	var CMSSettingsController 	= function () {

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

		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_CMSMain 			= App.controller.CMS.Main;
			pr_ctr_CMSHeader 		= App.controller.CMS.Header;
			pr_ctr_CMSContent 		= App.controller.CMS.Content;
			pr_ctr_CMSFooter 		= App.controller.CMS.Footer;
			pr_ctr_CMSMenu 			= App.controller.CMS.Menu;
			pr_ctr_CMSSettings 		= App.controller.CMS.Settings;
			

			tmplName.CMS_SETTINGS_CONFIG	= "CMS_Settings_Config";
			tmplName.CMS_SETTINGS_LOAD		= "CMS_Settings_Load";
		}
		
		//--------------------------------------------------------------------------------------------------
	
		this.do_lc_show	= function(){
			try { 					
				tmplCtrl.do_lc_put_tmpl(tmplName.CMS_SETTINGS_CONFIG				, CMS_Settings_Config);
	        	tmplCtrl.do_lc_put_tmpl(tmplName.CMS_SETTINGS_LOAD				, CMS_Settings_Load);

	        	$(App.constHTML.id.SETTINGS_CONFIG_VIEW)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CMS_SETTINGS_CONFIG));
	        	$(App.constHTML.id.SETTINGS_LOAD_VIEW)		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CMS_SETTINGS_LOAD));

			}
			catch(e) {
				pr_ctr_CMSMain.do_show_Msg(null, e);
			}
		}
		
		//--------------------------------------------------------------------------------------------------
    	//--------------------------------------------------------------------------------------------------
    	//--------------------------------------------------------------------------------------------------
    	//--------------------------------------------------------------------------------------------------
    	//--------------------------------------------------------------------------------------------------
    	//--------------------------------------------------------------------------------------------------
    	//--------------------------------------------------------------------------------------------------
    	//--------------------------------------------------------------------------------------------------
    	//--------------------------------------------------------------------------------------------------
    	//--------------------------------------------------------------------------------------------------
    	//--------------------------------------------------------------------------------------------------

        
    };
    
    return CMSSettingsController;
    
});