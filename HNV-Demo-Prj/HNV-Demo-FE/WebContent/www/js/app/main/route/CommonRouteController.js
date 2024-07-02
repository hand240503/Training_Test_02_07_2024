define(['require',
	'jquery',
	'pathparser',
	'group/login/ctrl/LoginController'
	],
	function (
			require, $,
			PathParser,
			LoginController
	) {

	var CommonRouteController = function () {
		var htmlHeader  = null;
		var htmlContent = null;
		var htmlFooter  = null;

		var self 		= this;
		var historyURL 	= [];

		//-------------------------------------------------------------------------------------
		this.do_lc_init = function () {
			if (!App.router)
				App.router  		= {};

			App.router.routes = {
					CMS			: "/cms",
					
					

					VI_MAIN		: "VI_MAIN",

		            CMS_MAIN	: "/cms_main",

		            ONLOAD		: "/onLoad",
		            LOGIN 		: "/login",
		            LOGOUT		: "/logout",
			};


			if (!this.router)
				this.router        	= new PathParser();

			App.router.controller	= this;

			//---init Login ctrl
			if (!App.controller.common) App.controller.common = {};
        	App.controller.common.Login = new LoginController();
        	App.controller.common.Login.do_lc_init();
        	
//			var ctrlLogin =  {
//					grpName		: "common", 
//					ctrlName	: "Login",
//					ctrlPath	: "group/login/ctrl/LoginController", 
//					ctrlParams	: [],
//					fInit		: "do_lc_init", 
//					fInitParams	: [],
//					fCallBack: function () {
//	                        self.pushHistory(url);
//	                }
//			};
//			do_gl_load_JSController_ByRequireJS(App.controller, ctrlLogin);
			
			//App.router.controller.do_lc_binding_route()
			this.do_router_init();
		};

		this.req_lc_router = function (){
			return this.router;
		}
		//---------------------------------------------------------------------------------------
		this.do_lc_run = function (route, url) {
			if (url){
//				window.history.replaceState({route: route}, "", url);
				pr_mapping_route[url] = route;
				window.history.pushState({state: route}, "", url);
			}
			
			this.router.run(route);
		};
		
		//---------------------------------------------------------------------------------------
		this.do_lc_consoleRoute = function (route) {
			console.log(route + "...");
		};

		this.do_lc_pushHistory = function (url) {
			historyURL.push(url);
			if (historyURL.lenght > 50) historyURL.shift();
		};

		this.do_lc_clearHistory = function () {
			historyURL = [];
		};
		//---------------------------------------------------------------------------------------

		var pr_mapping_route 			=  {};
		var pr_popEventListnerAdded 	= false;
		
		if (!pr_popEventListnerAdded){
			$(window).bind('popstate', function(event) {
				var urlObj 	= history.location || document.location;
				
				var url		= urlObj.href.substring(urlObj.origin.length+1);
//				var url		= urlObj.pathname.substring(1);
				var route	= pr_mapping_route[url];
				if (route)
					self.do_lc_run (route);

//				console.log(
//					`location: ${document.location}, state: ${JSON.stringify(event.state)}`
//				);
			});
			pr_popEventListnerAdded= true;
		}

		this.do_lc_binding_route = function (div){
			console.log("do_lc_binding_route: " + $(".hnv-route").length);
			var ele = null;
			if (div){
				ele= $(div).find(".hnv-route");
			}else{
				ele= $(".hnv-route");
			}

			if (ele)
				ele.off("click").on("click", function(){
					var route 	= $(this).data("route");
					var url		= $(this).data("url");

					if (route){
						self.do_lc_run (route, url);
					}
				});
		}
		//---------------------------------------------------------------------------------
		this.do_router_init = function () {
			//----Init path
			if (App.router.routes.ONLOAD)
			this.router.add(App.router.routes.ONLOAD + '/:FIRST_VIEW', function () {
				//{tok, login, pass, wHash, wSalt, salt, rem, time, count}
				let  info = req_gl_LS_SecurityInfo(App.keys.KEY_STORAGE_CREDENTIAL);

				if (!info.login || !info.pass || !info.tok) {
					if (this.FIRST_VIEW)
						App.router.controller.do_lc_run(App.router.routes.LOGIN + "/" + this.FIRST_VIEW);
					else
						App.router.controller.do_lc_run(App.router.routes.LOGIN);
				} else {
					App.controller.common.Login.do_lc_Login_Bg(this.FIRST_VIEW, info);
					self.do_lc_pushHistory(this.url);
				}
				
			});
			
			this.router.add(App.router.routes.LOGIN + '/:FIRST_VIEW', function () {
				let {url, FIRST_VIEW} = this;
				App.controller.common.Login.do_lc_show(FIRST_VIEW);
				
				self.do_lc_pushHistory(this.url);
			});
			//-------------------------------------------------------------------------------------------------------
			if (App.router.routes.VI_MAIN)
			this.router.add(App.router.routes.VI_MAIN, function () {
				let { url } = this;
				let options = {
						grpName		: "DBoard", 
						ctrlName	: "DBoardMain",
						ctrlPath	: "group/dashboard/ctrl/DBoardMain", 
						ctrlParams	: [],
						fInit		: "do_lc_init", 
						fInitParams	: [],
						fShow		: "do_lc_show", 
						fShowParams	: [],
						fCallBack  		: null,
						fCallBackParams	: null 
				}

				do_gl_load_JSController_ByRequireJS(App.controller, options);
				self.do_lc_pushHistory(this.url);
			});
			//-------------------------------------------------------------------------------------------------------
			if (App.router.routes.CMS)
			this.router.add(App.router.routes.CMS + '/:nextView', function () {
				let mainCtrl = {
						grpName  		: "CMS",
						ctrlName       	: "Main",
						ctrlPath       	: 'group/cms/ctrl/CMSController',
						ctrlParams 		: [null, null, null],
						fInit      		: "do_lc_init",
						fInitParams		: null,
						fShow      		: "do_lc_show",
						fShowParams		: [this.nextView], 
						fCallBack  		: null,
						fCallBackParams	: null
				}

				do_gl_load_JSController_ByRequireJS(App.controller, mainCtrl);
				self.do_lc_pushHistory(this.url);
			});
			
			//------------------------------------------------------------------------------
			if (App.router.routes.LOGOUT)
			this.router.add(App.router.routes.LOGOUT + '/:FIRST_VIEW', function () {
				if (App) {
					App.data            = {};
					App.data.session_id = -1;
				}

				self.do_lc_clearHistory();
			});

		}

	};
	return CommonRouteController;
});
