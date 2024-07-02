define(['jquery',
	'text!group/login/tmpl/Login_Content.html',
	'text!group/login/tmpl/Register_Content.html'
	],
	function ($, 
			LOGIN_CONTENT,
			REGISTER_CONTENT
	) {
	var LoginController = function () {
		//---------------------------------------
		window.onbeforeunload = function (event) {
			do_gl_LS_SecurityInfo_Save_Time(App.keys.KEY_STORAGE_CREDENTIAL);
			return null;
		};
		//---------------------------------------
		var pr_grpPath        = 'group/login/';
		//---------------------------------------
		this.viewAfter        = FIRST_VIEW;

		var tmplName = App.template.names;
		var tmplCtrl = App.template.controller;
		var self     = this;

		var svClass = AppCommon['const'].SV_CLASS;
		var svName  = AppCommon['const'].SV_NAME;
		var sessId  = AppCommon['const'].SESS_ID;
		var fVar    = AppCommon['const'].FUNCT_SCOPE;
		var fName   = AppCommon['const'].FUNCT_NAME;
		var fParam  = AppCommon['const'].FUNCT_PARAM;

		var pr_setTime_refresh_login = null;

		var pr_new_obj_default = {
				typ: 5,
				per: {
					typ01: 0,
					typ02: 0
				}
		}
		this.do_lc_init = function () {
			tmplName.LOGIN_CONTENT    = "LOGIN_CONTENT";
			tmplName.REGISTER_CONTENT = "REGISTER_CONTENT";
			tmplCtrl.do_lc_put_tmpl(tmplName.LOGIN_CONTENT	, LOGIN_CONTENT);
			tmplCtrl.do_lc_put_tmpl(tmplName.REGISTER_CONTENT	, REGISTER_CONTENT);
		}

		this.do_lc_show = function (nextView) {
			if (nextView)  this.viewAfter = nextView;
			//----------------------------------------------------------------------
			do_gl_lang_append(pr_grpPath + 'transl', self.do_lc_show_callback);
		};

		this.do_lc_show_callback = function () {
			self.do_lc_Logout();
			self.do_lc_appVersion();

			var compiledContent = tmplCtrl.req_lc_compile_tmpl(tmplName.LOGIN_CONTENT, {"version": appVersion});
			$("#layout-wrapper, #right-bar, #rightbar-overlay").html("");
			$("#login_page").html(compiledContent);

			bindingEventsPage();
		};

		//----------------------------------------------------------------------------------
		this.do_lc_Logout   = function () {
			do_gl_LocalStorage_Remove ();
			if (!localStorage.language) localStorage.language = "en";
			App.data.user = null;
		}

		//----------------------------------------------------------------------------------
		var do_login_submit = function () {
			//logout everything first
			self.do_lc_Logout();


			var login    = $("#inp_Username").val();
			var password = $("#inp_Password").val();
			var remember = $("#inp_remember").is(":checked");

			self.do_lc_Login(login, password, "", remember, self.viewAfter);

		}.bind(this);
		//----------------------------------------------------------------------------------

		this.do_lc_Login = function (login, pass, salt, remember, nextView) {
			if (!salt) salt = "";
			var pass_hash = rq_gl_Crypto(pass);
			var ref       = {};

			if (salt.length > 0) {
				pass_hash        = rq_gl_Crypto(pass_hash + salt);
				ref["with_salt"] = 1;
			} else {
				ref["with_salt"] = 0;
			}
			ref[svClass]     = "/login";
			ref[svName]      = "svAutLogin"; 	//return user with rights + sessionId

			ref["user_name"] = login;
			ref["user_pass"] = pass_hash;
			ref["user_salt"] = salt;
			ref["with_hash"] = 1;

			var inf = {
					login	: login,
					pass	: pass_hash,
					wHash	: ref["with_hash"],
					wSalt	: ref["with_salt"],
					salt	: salt,
					rem		: remember
			}
			var fSucces = [];
			fSucces.push(req_gl_funct(null, do_loadView, [nextView, inf]));

			var fError = req_gl_funct(null, reset, []);

			App.network.do_lc_ajax(App.path.BASE_URL_API_LOGIN, null, ref, 100000, fSucces, fError);
		}

		this.do_lc_Login_Interval = function () {
			pr_setTime_refresh_login && clearInterval(pr_setTime_refresh_login); // clear interval

			pr_setTime_refresh_login = setInterval(() => { //and reset interval
				let  info = req_gl_LS_SecurityInfo(App.keys.KEY_STORAGE_CREDENTIAL);
				self.do_lc_Login_Bg (null, info);

			}, TIME_TOK_REFRESH);
		}

		this.do_lc_Login_Bg = function (nextView, inf) {
			var ref       	 = {};
			ref[svClass]     = "/login";
			ref[svName]      = "svAutLogin"; 	//return user with rights + sessionId

			ref["user_name"] = inf.login;
			ref["user_pass"] = inf.pass;
			ref["user_salt"] = inf.salt;
			ref["with_hash"] = inf.wHash;
			ref["with_salt"] = inf.salt;

			var fSucces = [];
			fSucces.push(req_gl_funct(null, do_loadView, [nextView, inf]));

			var fError = req_gl_funct(null, reset, []);


			App.network.do_lc_ajax_bg(App.path.BASE_URL_API_LOGIN, null, ref, 100000, fSucces, fError);
		};


		//-------------------------------------------------------------------------------------
		// Bind events in the Login Page
		var bindingEventsPage = function () {

			//binding enter key for password input
			$("#inp_Password").keyup(function (e) {
				if (e.keyCode === 13) {
					do_login_submit();
				}
			});

			$("#btn_Submit").off("click").on("click", function () {
				do_login_submit();
			});

			$("#btn_register").off("click").on("click", function () {
				do_lc_showForm_register();
			})
		}.bind(this);

		var reset = function () {
			pr_setTime_refresh_login && clearInterval(pr_setTime_refresh_login);
			do_gl_show_Notify_Msg_Error($.i18n("login_err_authentification"));

			do_gl_LocalStorage_Remove (App.keys.KEY_STORAGE_CREDENTIAL);
			App.router.controller.do_lc_run(App.router.routes.LOGIN_PRJ);
		}

		//-------------------------------------------------------------------------------------
		var do_loadView = function (sharedJson, nextView, info) {
			if ((sharedJson && sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES)) {
				if (!App.data) App.data = {};
				App.data.user = sharedJson[App['const'].RES_DATA];

				if (!App.data.user.id || self.can_lc_User_Guest() || self.can_lc_User_Client_Public()) {
					do_gl_show_Notify_Msg_Error($.i18n("common_access_deny_for_client_user"));
					App.router.controller.do_lc_run(App.router.routes.LOGOUT + '/' + App.router.routes.HOME_VIEW);
					return;
				}
				//Save the user idman
				if (App.data.user.per)
					localStorage.setItem("manId", App.data.user.per.parent);

				App.data.user.headerURLSecu = sharedJson[App['const'].USER_TOK];

				do_gl_LS_SecurityInfo_Save(App.keys.KEY_STORAGE_CREDENTIAL, {
					tok		: App.data.user.headerURLSecu , 
					login	: info.login,
					pass	: info.pass,
					wHash	: info.wHash,
					wSalt	: info.wSalt,
					salt	: info.salt,
					rem		: info.rem
				});

				App.data["HttpSecuHeader"] = req_gl_LS_SecurityHeaderBearer(App.keys.KEY_STORAGE_CREDENTIAL);
				self.do_lc_Login_Interval ();

				if (nextView) App.router.controller.do_lc_run(nextView);

			} else {
				do_gl_show_Notify_Msg_Error($.i18n("login_err_authentification"));
			}
		};

		var do_lc_showForm_register = function () {
			self.do_lc_Logout();

			$("#layout-wrapper, #right-bar, #rightbar-overlay").html("");
			$("#login_page").html(tmplCtrl.req_lc_compile_tmpl(tmplName.REGISTER_CONTENT, {"version": appVersion}));

			do_lc_bin_event_register();
		}

		var do_lc_bin_event_register = function () {
			$("#btn_Register").off("click").on("click", function () {
				var obj_register = req_gl_data({
					dataZoneDom: $("#div_sendRegister")
				});

				if (obj_register.hasError) {
					do_gl_show_Notify_Msg_Error($.i18n("content_register_error"));
					return;
				}

				obj_register.data.pass = rq_gl_Crypto(obj_register.data.pass);
				obj_register.data      = $.extend(true, {}, obj_register.data, pr_new_obj_default);

				obj_register.data.per.info10 = obj_register.data.email;
				doRegisterUser(obj_register);
			});
		}

		var doRegisterUser = function (obj_register) {
			var ref = req_gl_Request_Content_Send("ServiceAutUser", "SVAutUserNew");

			do_gl_Security_HttpHeader_Clear();
			var sId    = -1;

			var fSucces = [];
			fSucces.push(req_gl_funct(null, showResultRegister, [ref]));

			var fError = req_gl_funct(null, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);
			
			App.network.ajax(App.path.BASE_URL_API_PRIV, null, ref, 100000, fSucces, fError);
		}

		var showResultRegister = function (sharedJson, reference) {
			if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				do_gl_show_Notify_Msg_Success($.i18n("content_register_succes"));
				do_Show_Login_Popup(false);
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("content_register_error"));
			}
		}

		var do_Show_Login_Popup = function (stat) {
			if (stat) {
				$(App.constHTML.id.LOGIN_VIEW).addClass('open');
				$('body').addClass('wygo-hidescroll');
				$("#inp_Username").focus();
			} else {
				$(App.constHTML.id.LOGIN_VIEW).removeClass('open');
				$('body').removeClass('wygo-hidescroll');
			}
		}

		//--------------------------------------------------------------------------------------------
		//check current user is visitor or client public
		this.can_lc_User_Guest         = function () {
			return App.data.user.typ == 1 ? true : false;
		}
		//check current user is client public
		this.can_lc_User_Client_Public = function () {
			return App.data.user.typ == 5 ? true : false;
		}

		//--------------------------------------------------------------------------------------------
		this.do_lc_appVersion    = function () {

			var ref      = {};
			ref[svClass] = "ServiceAppVersion";
			ref[svName]  = "svAppVersion";

			var fSucces = [];
			fSucces.push(req_gl_funct(null, do_lc_saveAppVersion, []));

			App.network.ajax(App.path.BASE_URL_API_PUBL, null, ref, 100000, fSucces, null);

		}
		var do_lc_saveAppVersion = function (sharedJson) {
			if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				let appVers = sharedJson[App['const'].RES_DATA];
				localStorage.setItem("appVersion", appVers);
				if (appVersion == "1.25") return;
				if (appVers != appVersion) {
					window.location.reload();
				}
			} else {
			}
		}
	};
	return LoginController;
});