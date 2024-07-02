define(['text!group/dashboard/tmpl/DBoard_Sidebar.html',
	'text!group/dashboard/tmpl/DBoard_Header.html',
	'text!group/dashboard/tmpl/DBoard_Notification.html'],

	function (
		DBoard_Sidebar,
		DBoard_Header,
		DBoard_Notification) {
		var DBoardSidebar = function (header, content, footer) {
			const tmplName = App.template.names;
			const tmplCtrl = App.template.controller;

			var pr_ctr_Main = null;
			const pr_ROLE_ADMIN = 1;

			//--------------------APIs--------------------------------------//
			this.do_lc_init = function () {
				pr_ctr_Main = App.controller.DBoard.DBoardMain;

				tmplName.DBOARD_SIDEBAR = "DBoard_Sidebar";
				tmplCtrl.do_lc_put_tmpl(tmplName.DBOARD_SIDEBAR, DBoard_Sidebar);
			}

			this.do_lc_show = function () {
				try {
					do_lc_build_page();
				} catch (e) {
					console.log(e);
				}
			};

			var do_lc_build_page = function () {
				let isAdmin = false; //App.data.user.roles.includes(pr_ROLE_ADMIN);
				$("#div_menu_vertical").html(tmplCtrl.req_lc_compile_tmpl(tmplName.DBOARD_SIDEBAR, { isAdmin }));
				do_gl_apply_right($("#div_menu_vertical"));
			}
		};


		var DBoardHeader = function (header, content, footer) {
			const tmplName = App.template.names;
			const tmplCtrl = App.template.controller;
			var self = this;
			//------------------controllers------------------------------------------------------
			var pr_ctr_Main = null;
			var pr_ctr_Notify = null;

			const pr_SERVICE_CLASS = "ServiceDBoard"; //to change by your need
			const pr_SV_COUNT_NOTIF = "SVDBoardCountNotification";
			const pr_SV_LIST_NOTIF = "SVDBoardListNotification";

			const pr_TIME_REFRESH_NOTIFY = 2 * 60 * 1000;

			const pr_list_url = [
				{ label: $.i18n('shp_sidebar_per_person_typ_02'), url: "view_per_person.html?typ=02" },
				{ label: $.i18n('shp_sidebar_per_person_typ_03'), url: "view_per_person.html?typ=03" },
				{ label: $.i18n('shp_sidebar_per_person_typ_04'), url: "view_per_person.html?typ=04" },
				{ label: $.i18n('shp_sidebar_per_person_typ_06'), url: "view_per_person.html?typ=06" },
				{ label: $.i18n('shp_sidebar_aut_user_typ_01'), url: "view_manager.html" },

				{ label: $.i18n('shp_sidebar_nso_post'), url: "view_nso_post.html" },

			];
			//--------------------APIs--------------------------------------//
			this.do_lc_init = function () {
				pr_ctr_Main = App.controller.DBoard.DBoardMain;
				pr_ctr_Notify = App.controller.DBoard.Notify;

				tmplName.DBOARD_HEADER = "DBoard_Header";
				tmplCtrl.do_lc_put_tmpl(tmplName.DBOARD_HEADER, DBoard_Header);
			}

			this.do_lc_show = function () {
				try {
					do_lc_build_page();
					do_bind_event();
				} catch (e) {
					console.log(e);
				}
			};

			var do_lc_build_page = function () {
				let user = App.data.user;
				$("#page-topbar").html(tmplCtrl.req_lc_compile_tmpl(tmplName.DBOARD_HEADER, { user, url: UI_URL_ROOT, lan: localStorage.language }));
				do_gl_apply_right($("#page-topbar"));

				try {
					//				do_lc_get_count_new_notification();
					//				do_lc_setTime_refresh_notify();
				} catch (e) {
					console.log(e);
				}
			}
			//---------private-----------------------------------------------------------------------------
			var do_bind_event = function () {
				$(".a-languge").off("click").on("click", function () {
					let { lan: language, id: languageId, loc: locale } = $(this).data();

					if (!language) {
						if (localStorage && localStorage.language) {
							language 	= localStorage.language;
							languageId 	= localStorage.languageId;
							locale 		= localStorage.locale;
						} else {
							language 	= 'fr';
							locale		= 'fr-FR';
							languageId	= '1';
						}
					}

					$.i18n({ locale: locale });
					localStorage.locale 	= locale;
					localStorage.language 	= language;
					localStorage.languageId = languageId;
					window.location.reload();
				})

				$("#a_disconnect").off("click").on("click", function () {
					if (FIRST_VIEW) {
						App.router.controller.do_lc_run(App.router.routes.LOGOUT_PRJ + '/' + FIRST_VIEW);
					} else {
						App.router.controller.do_lc_run(App.router.routes.LOGOUT_PRJ);
					}
				})

			};

			var do_lc_get_count_new_notification = function () {
				let ref = req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_COUNT_NOTIF);

				let fSucces = [];
				fSucces.push(req_gl_funct(null, do_lc_afterGet_Count, []));

				let fError = req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax")]);

				App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
			}

			var do_lc_afterGet_Count = function (sharedJson) {
				if (isAjaxSuccess(sharedJson)) {
					let data = sharedJson[App['const'].RES_DATA];
					data && $("#sp_nbNew_notify").html(data);
				}
				do_lc_bind_event_notify();
			}

			var do_lc_bind_event_notify = function () {
				$("#btn_notify_dropdown").off("click").on("click", function () {
					pr_ctr_Notify.do_lc_show();
				})
			}

			var do_lc_setTime_refresh_notify = function () {
				setInterval(() => {
					//				do_lc_get_count_new_notification();
				}, pr_TIME_REFRESH_NOTIFY);
			}
		};


		var DBoardNotification = function (header, content, footer) {
			const tmplName = App.template.names;
			const tmplCtrl = App.template.controller;
			//------------------controllers------------------------------------------------------
			var pr_ctr_Main = null;
			var pr_ctr_List = null;
			var pr_ctr_Ent = null;

			const pr_SERVICE_CLASS = "ServiceDBoard"; //to change by your need
			const pr_SV_LIST_NOTIF = "SVDBoardListNotification";
			const pr_SV_MOD_NOTIF = "SVDBoardModNotification";

			var pr_BEGIN_NOTIFY = 0;
			const pr_NUMBER_NOTIFY = 10;
			//--------------------APIs--------------------------------------//
			this.do_lc_init = function () {
				pr_ctr_Main = App.controller.DBoard.DBoardMain;
				tmplName.DBOARD_NOTIFICATION = "DBoard_Notification";
				tmplCtrl.do_lc_put_tmpl(tmplName.DBOARD_NOTIFICATION, DBoard_Notification);
			}

			this.do_lc_show = function () {
				try {
					do_lc_get_list_notify();
				} catch (e) {
					console.log(e);
				}
			};

			var do_lc_get_list_notify = function () {
				let ref = req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_LIST_NOTIF, { number: pr_NUMBER_NOTIFY });

				let fSucces = [];
				fSucces.push(req_gl_funct(null, do_lc_afterGet_list, []));

				let fError = req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax")]);

				App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
			}

			var do_lc_afterGet_list = function (sharedJson) {
				if (isAjaxSuccess(sharedJson)) {
					let data = sharedJson[App['const'].RES_DATA];
					data && $("#div_notify_content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.DBOARD_NOTIFICATION, data));
				}
				do_lc_bind_event_notify();
			}

			var do_Build_Page = function () {
				let user = App.data.user;
				$("#page-topbar").html(tmplCtrl.req_lc_compile_tmpl(tmplName.DBOARD_HEADER, user));
			}
			//---------private-----------------------------------------------------------------------------
			var do_lc_bind_event_notify = function () {
				$(".notification-item").off("click").on("click", function () {
					let { prj: idPrj, id } = $(this).data();
					idPrj && window.open(`view_prj_project_content.html?id=${idPrj}`, "_blank");
					do_lc_modify_notification(id);
				})

				$("#btn_view_more").off("click").on("click", function () {
					pr_NUMBER_NOTIFY += pr_NUMBER_NOTIFY;
					do_lc_get_list_notify();
					return false;//stop toggle dropdown
				})

				$("#btn_view_all").off("click").on("click", function () {
					let readAll = true;
					do_lc_modify_notification(null, readAll);
					return false;//stop toggle dropdown
				})
			};

			var do_lc_modify_notification = function (idNotify, isReadAll) {
				let ref = req_gl_Request_Content_Send_With_Params(pr_SERVICE_CLASS, pr_SV_MOD_NOTIF, { id: idNotify, isReadAll });

				let fSucces = [];
				fSucces.push(req_gl_funct(null, do_lc_afterMod_Notify, []));

				let fError = req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax")]);

				App.network.do_lc_ajax_background(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
			}

			var do_lc_afterMod_Notify = function (sharedJson) {
				if (isAjaxSuccess(sharedJson)) {
					let data = sharedJson[App['const'].RES_DATA];
					$("#sp_nbNew_notify").html(data ? data : "");
				}
			}
		};


		return { DBoardSidebar, DBoardHeader, DBoardNotification };
	});