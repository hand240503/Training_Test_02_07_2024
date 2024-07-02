/**
 * Created by H&V on 19/02/16.
 */

define(['pathparser',
	  	'group/cms/ctrl/LoginController'
	], function (PathParser, LoginController) {

    var CommonRouteControllerPrj = function () {
        var htmlHeader  = null;
        var htmlContent = null;
        var htmlFooter  = null;

        var self = this;

        var historyURL = [];

        this.do_lc_init = function () {
        	if (!App.controller.common) App.controller.common = {};
        	App.controller.common.Login = new LoginController();
        	App.controller.common.Login.do_lc_init();
        	
            this.router = new PathParser();

            this.router.add(App.router.routes.CMS_MAIN, function () {
                let {url} = this;
                self.consoleRoute(url);
                let dataParams = {
                    nameGroup	: "CMS", 
                    name		: "Main",
                    path     	: "group/cms/ctrl/CMSController",
                    fInit    	: "do_lc_init",
                    fShow   	: "do_lc_show", 
                    fCallBack: function () {
                        self.pushHistory(url);
                    }
                }

                do_gl_load_JSController_ByRequireJS(App.controller, dataParams);
            });

            //-------------------------------------------------------------------------------------------------------

            this.router.add(App.router.routes.HOME, function () {
                self.consoleRoute(this.url);
                var urlToLaunch = "";
                if (App.path.BASE_URL_UI) urlToLaunch = App.path.BASE_URL_UI;
                window.open(urlToLaunch, "_self");
                self.pushHistory(this.url);
            });

            //-------------------------------------------------------------------------------------------------------

            this.router.add(App.router.routes.HOME_VIEW, function () {
                self.consoleRoute(this.url);
                var urlToLaunch = "";
                if (App.path.BASE_URL_UI) urlToLaunch = App.path.BASE_URL_UI;
                window.open(urlToLaunch, "_self");
                self.pushHistory(this.url);
            });

            //---------------------------------------------PRJ PROJECT----------------------------------------------------------

            this.router.add(App.router.routes.LOGIN_PRJ + '/:FIRST_VIEW', function () {
                let {url, FIRST_VIEW} = this;
                self.consoleRoute(url);
                
                App.controller.common.Login.do_lc_show(FIRST_VIEW);
            });

            //-------------------------------------------------------------------------------------------------------

            this.router.add(App.router.routes.LOGOUT_PRJ + '/:FIRST_VIEW', function () {
                if (App) {
                    App.data            = {};
                    App.data.session_id = -1;
                }

                let {url, FIRST_VIEW} = this;
                self.consoleRoute(url);
                
                App.controller.common.Login.do_lc_show(FIRST_VIEW);
            });


            this.router.add(App.router.routes.ONLOAD_PRJ + '/:FIRST_VIEW', function () {
            	//{tok, login, pass, wHash, wSalt, salt, rem, time, count}
                let  info = req_gl_LS_SecurityInfo(App.keys.KEY_STORAGE_CREDENTIAL);

                if (!info.login || !info.pass || !info.tok) {
                    if (this.FIRST_VIEW)
                        App.router.controller.do_lc_run(App.router.routes.LOGIN_PRJ + "/" + this.FIRST_VIEW);
                    else
                        App.router.controller.do_lc_run(App.router.routes.LOGIN_PRJ);
                } else {
                	App.controller.common.Login.do_lc_Login_Bg(this.FIRST_VIEW, info);
                }
            });
        };

        this.do_lc_run = function (path) {
            if (path == App.router.routes.CMS_MAIN) {
                this.router.run(path);
                return true;
            }

            if (path == App.router.routes.HOME) {
                this.router.run(path);
                return true;
            }

            if (path == App.router.routes.HOME_VIEW) {
                this.router.run(path);
                return true;
            }

            if (path.indexOf(App.router.routes.LOGIN_PRJ) == 0) {
                this.router.run(path);
                return true;
            }
            if (path.indexOf(App.router.routes.LOGOUT) == 0) {
                this.router.run(path);
                return true;
            }

            if (path.indexOf(App.router.routes.ONLOAD) == 0) {
                this.router.run(path);
                return true;
            }

            return false;
        };

        this.previous = function () {
            popHistory();
            var url = popHistory();
            if (url == null) this.run(App.router.routes.HOME);
            else this.run(url);
        }
        this.next     = function () {

        }

        this.consoleRoute = function (route) {
            console.log(route + "...");
        };

        this.pushHistory = function (url) {
            historyURL.push(url);
            if (historyURL.lenght > 50) historyURL.shift();
        };

        this.popHistory = function () {
            if (historyURL.length == 0) return null;
            return historyURL.pop();
        };

        this.clearHistory = function () {
            historyURL = [];
        };

    };
    return CommonRouteControllerPrj;
});
