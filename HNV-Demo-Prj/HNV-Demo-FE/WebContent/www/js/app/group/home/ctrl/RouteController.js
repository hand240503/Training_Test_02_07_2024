define([
		'require','jquery','pathparser',
		
        'group/cms/ctrl/CommonRouteController', 
        'group/home/ctrl/HomeMain',
        
        ],
        function (
        		require, $,PathParser, CommonRouteController, HomeMain
        ) {

	var RouteController = function () {  
		
		var htmlHeader  = null;
		var htmlContent = "#div_CMSContentView";
		var htmlFooter	= null;
		var self		= this;
		 
		this.do_lc_init = function() {
			//------------------------------------------------------------------------	
			this.commonRouter 	= new CommonRouteController();
			this.commonRouter.do_lc_init();
			
			if (!App.controller			) App.controller 	 	= {};
			if (!App.controller.Home	) App.controller.Home 	= {};
			if(!App.controller.Home.Main) {
				App.controller.Home.Main = new HomeMain(htmlHeader, htmlContent, htmlFooter);			
				App.controller.Home.Main.do_lc_init(); 	
			}
			
			//------------------------------------------------------------------------	
			this.router = new PathParser();			

			//--------------------Use case screen ----------------------------------------------------	
			this.router.add(App.router.routes.HOME_VIEW, function () {
				self.commonRouter.consoleRoute(this.url);                
				App.controller.Home.Main.do_lc_show();  
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
