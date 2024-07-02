/**
 * by H&V 2017
 */
define([
        'jquery',
        'pathparser',
        'controller/common/CommonRouteController',

        'controller/per/contract/PerContractMain'
        ],
        function (
        		$,PathParser, 
        		CommonRouteController,
        		PerContractMain
        ) {

	var RouteController = function () {
		var htmlHeader  = null;
		var htmlContent = "#div_CMSContentView";
		var htmlFooter	= null;
		var self		= this;
		 
		this.do_lc_init = function() {
			this.commonRouter 	= new CommonRouteController();
			this.commonRouter.do_lc_init();
			//------------------------------------------------------------------------	
			this.router = new PathParser();			

			//--------------------Use case screen ----------------------------------------------------	
			this.router.add(App.router.routes.PER_CONTRACT, function () {
				self.commonRouter.consoleRoute(this.url);                

				if (!App.controller				) App.controller 			= {};
				if (!App.controller.PerContract	) App.controller.PerContract = {};
				
				App.controller.CMS.Menu.do_lc_AddRemoveClassActiveMenu(
						App.controller.CMS.Menu.var_lc_ulMenu_SidebarMenu,
						App.controller.CMS.Menu.var_lc_liMenu_SidebarMenu_CFG
					);
				
				App.controller.PerContract.Main = new PerContractMain(htmlHeader, htmlContent, htmlFooter);			
				App.controller.PerContract.Main.do_lc_init(); 
				App.controller.PerContract.Main.do_lc_show();  
				
				self.commonRouter.pushHistory(this.url);
			});
			
		};

		this.do_lc_run = function (path) {
			if (!this.commonRouter.do_lc_run(path))
				this.router.run(path);
		};	

	};
	return RouteController;
});
