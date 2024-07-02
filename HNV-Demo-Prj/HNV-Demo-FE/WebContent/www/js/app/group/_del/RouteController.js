define(['pathparser',

	'group/cms/ctrl/CommonRouteController',
],
	function (PathParser,
		CommonRouteController
	) {

		var RouteController = function () {
			var self = this;

			this.do_lc_init = function () {
				this.commonRouter = new CommonRouteController();
				this.commonRouter.do_lc_init();
				//------------------------------------------------------------------------	
				this.router = new PathParser();

				this.router.add(App.router.routes.VI_MAIN, function () {
					let { url } = this;
					self.commonRouter.consoleRoute(url);
					let options = {
						nameGroup: "DBoard", name: "DBoardMain",
						path: "group/dashboard/ctrl/DBoardMain", initParams: [],
						fInit: "do_lc_init", fInitParams: [],
						fShow: "do_lc_show", fShowParams: [],
						fCallBack: function () { self.commonRouter.pushHistory(url); }
					}

					do_gl_load_JSController_ByRequireJS(App.controller, options);
				});
			};

			this.do_lc_run = function (path) {
				if (!this.commonRouter.do_lc_run(path))
					this.router.run(path);
			};
		};

		return RouteController;
	});
