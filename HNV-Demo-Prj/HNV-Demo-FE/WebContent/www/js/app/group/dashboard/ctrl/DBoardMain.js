define(['handlebars',
        'text!group/dashboard/tmpl/DBoard_Main.html',
        'text!group/dashboard/tmpl/DBoard_Rightbar.html',

        'group/dashboard/ctrl/DBoardCommon',
    ],
    function (
        handlebars,
        DBoard_Main,
        DBoard_Rightbar,
        {
            DBoardHeader,
            DBoardNotification,
            DBoardSidebar
        }
    ) {
        const DBoardMain = function (header, content, footer) {
            var pr_grpPath = 'group/dashboard/';
            var pr_grpName = 'DBoard';

            App.template.names[pr_grpName] = {};


            App.router.part = {
                VI_AUT_USER   : "VI_AUT_USER",
                VI_AUT_USER_COPY   : "VI_AUT_USER_COPY",
                VI_AUT_RIGHT  : "VI_AUT_RIGHT",
                VI_AUT_ROLE   : "VI_AUT_ROLE",
                VI_AUT_AUTH_SV: "VI_AUT_AUTH_SV",
  
                
                VI_CFG_GROUP: "VI_CFG_GROUP",

                VI_TPY_CATEGORY: "VI_TPY_CATEGORY",
                VI_TPY_INFO_VERSION: "VI_TPY_INFO_VERSION",
                VI_TPY_INF_RISSI	: "VI_TPY_INF_RISSI",
                VI_TPY_INF_INTRO	: "VI_TPY_INF_INTRO",

                VI_MAT_MATERIAL      : "VI_MAT_MATERIAL",
                VI_MAT_BCODE         : "VI_MAT_BCODE",
                VI_MAT_UNIT          : "VI_MAT_UNIT",
                VI_MAT_WARE_HOUSE    : "VI_MAT_WARE_HOUSE",
                VI_MAT_ALARM         : "VI_MAT_ALARM",
                VI_MAT_STOCK_RQ      : "VI_MAT_STOCK_RQ",
                VI_MAT_STOCK_RQ_MONTH: "VI_MAT_STOCK_RQ_MONTH",

                VI_SOR_ORDER_IN          : "VI_SOR_ORDER_IN",
                VI_SOR_ORDER_OU          : "VI_SOR_ORDER_OU",
                VI_SOR_ORDER_IN_BUY      : "VI_SOR_ORDER_IN_BUY",
                VI_SOR_ORDER_IN_TRANSFERT: "VI_SOR_ORDER_IN_TRANSFERT",
                VI_SOR_ORDER_IN_BAL      : "VI_SOR_ORDER_IN_BAL",
                VI_SOR_ORDER_OU_SELL     : "VI_SOR_ORDER_OU_SELL",
                VI_SOR_ORDER_OU_TRANSFERT: "VI_SOR_ORDER_OU_TRANSFERT",
                VI_SOR_ORDER_OU_BAL      : "VI_SOR_ORDER_OU_BAL",
                VI_SOR_ORDER_OU_BAL_FAIL : "VI_SOR_ORDER_OU_BAL_FAIL",
                VI_SOR_ORDER_OU_BAL_OTHER: "VI_SOR_ORDER_OU_BAL_OTHER",
                VI_SOR_ORDER_OU_STAT     : "VI_SOR_ORDER_OU_STAT",
                VI_SOR_DEAL              : "VI_SOR_DEAL",
                VI_SOR_VENDOR            : "VI_SOR_VENDOR",


                VI_REPORT_SOR_ORDER_IN_WAREHOUSE : "VI_REPORT_SOR_ORDER_IN_WAREHOUSE",
                VI_REPORT_SOR_ORDER_OUT_WAREHOUSE: "VI_REPORT_SOR_ORDER_OUT_WAREHOUSE",


                VI_REPORT_SOR_ORDER_OUT_SELLING        : "VI_REPORT_SOR_ORDER_OUT_SELLING",
                VI_REPORT_SOR_ORDER_OUT_SELLING_ANALYZE: "VI_REPORT_SOR_ORDER_OUT_SELLING_ANALYZE",

                VI_NSO_GROUP 	: "VI_NSO_GROUP",
                VI_NSO_POST 	: "VI_NSO_POST",
                VI_NSO_OFFER	: "VI_NSO_OFFER",


                VI_PER_PERSON  : "VI_PER_PERSON",
                VI_PER_INFO    : "VI_PER_INFO",
                VI_PER_STUDENT : "VI_PER_STUDENT",
                VI_PER_PRODUCER: "VI_PER_PRODUCER",
                
                VI_TEST_CHART  : "VI_TEST_CHART"
            };

            //------------------------------------------------------------------------------------
            var tmplCtrl            = App.template.controller;
            var tmplName            = App.template.names[pr_grpName];
            //------------------------------------------------------------------------------------
            var self                = this;
            //------------------------------------------------------------------------------------
            this.pr_LST_USER_ONLINE = [];
            //--------------------APIs--------------------------------------//
            this.do_lc_init         = function () {
                tmplName.DBOARD_MAIN     = "DBoard_Main";
                tmplName.DBOARD_RIGHTBAR = "DBoard_Rightbar";
                
                tmplCtrl.do_lc_put_tmpl(tmplName.DBOARD_MAIN, DBoard_Main);
                tmplCtrl.do_lc_put_tmpl(tmplName.DBOARD_RIGHTBAR, DBoard_Rightbar);
                //-----------------------------------------------------------------------------------------------------------
                
                //loadController;
                const pr_CONTROLLER = {Notify: DBoardNotification, Sidebar: DBoardSidebar, Header: DBoardHeader};

                if (!App.controller.DBoard) App.controller.DBoard = {};

                for (let name in pr_CONTROLLER) {
                    if (!App.controller.DBoard[name]) {
                        App.controller.DBoard[name] = new pr_CONTROLLER[name](null, null, null);
                        App.controller.DBoard[name].do_lc_init();
                    }
                }
            }

            this.do_lc_show      = function () {
                do_gl_lang_append(pr_grpPath + 'transl', self.do_lc_show_callback);
            };

            this.do_lc_show_callback = function () {
                try {
                    $("#layout-wrapper").html(tmplCtrl.req_lc_compile_tmpl(tmplName.DBOARD_MAIN, {}));
                    $("#div_right_bar")
                        .html(tmplCtrl.req_lc_compile_tmpl(tmplName.DBOARD_RIGHTBAR, {url: UI_URL_ROOT}));

                    App.controller.DBoard.Header.do_lc_show();
                    App.controller.DBoard.Sidebar.do_lc_show();
                    do_lc_show_content();

                    $("#login_page").html("");
                    do_gl_bind_page();
                } catch (e) {
                    console.log(e);
                }
            };

            this.do_lc_switch_mobile_or_pc = function (url, view_part, paramsShow) {
                window.open(url, "_self");
            }

            const do_lc_show_content = paramsShow => {
                if (paramsShow) pr_DATA_CTRL[VIEW_PART].fShowParams = paramsShow;
                do_gl_load_JSController_ByRequireJS(App.controller, pr_DATA_CTRL[VIEW_PART]);
            }

            const pr_DATA_CTRL = {

                [App.router.part.VI_AUT_USER]: {
                    nameGroup                                   : "Aut", name: "AutUser",
                    path: "group/aut/user/ctrl/Main", initParams: [null, "#div_main_content", null, "AutUser"],
                    fInit                                       : "do_lc_init", fInitParams: [],
                    fShow                                       : "do_lc_show", fShowParams            : [],
                },
                [App.router.part.VI_AUT_USER_COPY]: {
                    nameGroup                                   : "Aut", name: "AutStudent",
                    path: "group/aut/student/ctrl/Main", initParams: [null, "#div_main_content", null, "AutStudent"],
                    fInit                                       : "do_lc_init", fInitParams: [],
                    fShow                                       : "do_lc_show", fShowParams            : [],
                },

                [App.router.part.VI_AUT_AUTH_SV]: {
                    nameGroup  : "Aut",
                    name       : "AutAuthService",
                    path       : "group/aut/auth_service/ctrl/Main",
                    initParams : [null, "#div_main_content", null, "AutAuthService"],
                    fInit: "do_lc_init",
                    fInitParams: [],
                    fShow      : "do_lc_show",
                    fShowParams: [],
                },
                [App.router.part.VI_CFG_GROUP]: {
                    nameGroup  	: "Cfg"											,
                    name       	: "CfgGroup"									,
                    path       	: "group/cfg/value/ctrl/Main"							,
                    initParams 	: [null, "#div_main_content", null, "CfgGroup"]	,
                    fInit		: "do_lc_init"									,
                    fInitParams	: []											,
                    fShow      	: "do_lc_show"									,
                    fShowParams	: []											,
                },


                [App.router.part.VI_TPY_CATEGORY]: {
                    nameGroup  : "Tpy",
                    name       : "TpyCategory",
                    path       : "group/tpy/category/ctrl/Main",
                    initParams : [null, "#div_main_content", null, "TpyCategory"],
                    fInit: "do_lc_init",
                    fInitParams: [],
                    fShow      : "do_lc_show",
                    fShowParams: [],
                    fCallBack  : function () {
                    }
                },
                [App.router.part.VI_TPY_INFO_VERSION]: {
                    nameGroup  : "Tpy",
                    name       : "TpyInformation",
                    path       : "group/tpy/info_version/ctrl/Main",
                    initParams : [null, "#div_main_content", null, "TpyInformation"],
                    fInit: "do_lc_init",
                    fInitParams: [],
                    fShow      : "do_lc_show",
                    fShowParams: [],
                    fCallBack  : function () {
                    }
                },
                
                [App.router.part.VI_TPY_INF_RISSI]: {
                    nameGroup  : "Tpy",
                    name       : "TpyInformation",
                    path       : "group/tpy/inf_rissi/ctrl/Main",
                    initParams : [null, "#div_main_content", null, "TpyInformation"],
                    fInit: "do_lc_init",
                    fInitParams: [],
                    fShow      : "do_lc_show",
                    fShowParams: [],
                    fCallBack  : function () {
                    }
                },
                
                [App.router.part.VI_TPY_INF_INTRO]: {
                    nameGroup  : "Tpy",
                    name       : "TpyInformation",
                    path       : "group/tpy/inf_intro/ctrl/Main",
                    initParams : [null, "#div_main_content", null, "TpyInformation"],
                    fInit: "do_lc_init",
                    fInitParams: [],
                    fShow      : "do_lc_show",
                    fShowParams: [],
                    fCallBack  : function () {
                    }
                },

                [App.router.part.VI_NSO_GROUP]: {
                    nameGroup                                   : "Nso", name: "NsoGroup",
                    path: "group/nso/group/ctrl/Main", initParams: [null, "#div_main_content", null, "NsoGroup"],
                    fInit                                       : "do_lc_init", fInitParams            : [],
                    fShow                                       : "do_lc_show", fShowParams: [],
                },
                
                [App.router.part.VI_NSO_POST]: {
                    nameGroup                                   : "Nso", name: "NsoPost",
                    path: "group/nso/post/ctrl/Main", initParams: [null, "#div_main_content", null, "NsoPost"],
                    fInit                                       : "do_lc_init", fInitParams            : [],
                    fShow                                       : "do_lc_show", fShowParams: [],
                },

                [App.router.part.VI_NSO_OFFER]: {
                    nameGroup                                    : "Nso", name                       : "NsoOffer",
                    path: "group/nso/offer/ctrl/Main", initParams: [null, "#div_main_content", null, "NsoOffer"],
                    fInit                                        : "do_lc_init", fInitParams             : [],
                    fShow                                        : "do_lc_show", fShowParams: [],
                },

                [App.router.part.VI_AUT_RIGHT]: {
                    nameGroup                                    : "Aut", name                       : "AutRight",
                    path: "group/aut/right/ctrl/Main", initParams: [null, "#div_main_content", null, "AutRight"],
                    fInit                                        : "do_lc_init", fInitParams: [],
                    fShow                                        : "do_lc_show", fShowParams             : [],
                },

                [App.router.part.VI_AUT_ROLE]: {
                    nameGroup                                   : "Aut", name: "AutRole",
                    path: "group/aut/role/ctrl/Main", initParams: [null, "#div_main_content", null, "AutRole"],
                    fInit                                       : "do_lc_init", fInitParams: [],
                    fShow                                       : "do_lc_show", fShowParams            : [],
                },

                [App.router.part.VI_PER_STUDENT]: {
                    nameGroup  : "Per",
                    name       : "PerStudent",
                    path       : "group/per/student/ctrl/Main",
                    initParams : [null, "#div_main_content", null, "PerStudent"],
                    fInit: "do_lc_init",
                    fInitParams: [],
                    fShow      : "do_lc_show",
                    fShowParams: [],
                },


                [App.router.part.VI_PER_PRODUCER]: {
                    nameGroup  : "Per",
                    name       : "PerProducer",
                    path       : "group/per/producer/ctrl/Main",
                    initParams : [null, "#div_main_content", null, "PerProducer"],
                    fInit: "do_lc_init",
                    fInitParams: [],
                    fShow      : "do_lc_show",
                    fShowParams: [],
                },


                //-----------------------------------------------------------------
                [App.router.part.VI_MAT_MATERIAL]: {
                    nameGroup  : "Mat",
                    name       : "MatMaterial",
                    path       : "group/mat/material/ctrl/Main",
                    initParams : [null, "#div_main_content", null, "MatMaterial"],
                    fInit: "do_lc_init",
                    fInitParams: [],
                    fShow      : "do_lc_show",
                    fShowParams: [],
                },

                [App.router.part.VI_MAT_UNIT]: {
                    nameGroup                                   : "Mat", name: "MatUnit",
                    path: "group/mat/unit/ctrl/Main", initParams: [null, "#div_main_content", null, "MatUnit"],
                    fInit                                       : "do_lc_init", fInitParams            : [],
                    fShow                                       : "do_lc_show", fShowParams            : [],
                },
                
                [App.router.part.VI_TEST_CHART]: {
                    nameGroup                                   : "Test", name: "Chart",
                    path: "group/test/chart/ctrl/Main", initParams: [null, "#div_main_content", null, "Main"],
                    fInit                                       : "do_lc_init", fInitParams            : [],
                    fShow                                       : "do_lc_show", fShowParams            : [],
                },

            }

            //---------------------------FORMAT DATE TIME TOOL--------------------------------------------
            this.formatShortDate    = (date) => handlebars.helpers.reqFormatShortDate(date);// dd/MM/yyyy
            this.formatDate         = (date) => handlebars.helpers.reqFormatDate(date); // dd/MM/yyyy hh:mm:ss
            this.formatDateHHMM     = (date) => handlebars.helpers.reqFormatDateHHMM(date); // dd/MM/yyyy hh:mm:ss
            this.do_show_Notify_Msg = (sharedJson, msg) => console.log("do_show_Msg::" + msg);
            this.do_show_Msg        = (sharedJson, msg) => console.log("do_show_Msg::" + msg);

            this.do_lc_bind_event_div_MaxResize = function (div_left, div_right, btnId) {
                if (!div_left) div_left = "#div_List";
                if (!div_right) div_right = "#div_Ent";
                if (!btnId) btnId = "#vertical-list-btn";

                $(btnId).off("click").on("click", function (e) {
                    e.preventDefault();
                    $(div_left).toggleClass('col-lg-3 col-md-3').toggleClass('col-lg-6 col-md-6');
                    $(div_right).toggleClass('col-lg-9 col-md-9').toggleClass('col-lg-6 col-md-6');
                })
            }

            this.do_lc_bind_event_div_MinResize = function (div_left, div_right, btnClass) {
                if (!div_left) div_left = "#div_List";
                if (!div_right) div_right = "#div_Ent";
                if (!btnClass) btnClass = ".btn-minimize-list";

                $(btnClass).off("click").on("click", function () {
                    let $this       = $(this);
                    let {divtoogle} = $this.data();
                    let child       = $this.find("i");
                    let label       = $this.find(".label-resize");
                    child.toggleClass("mdi-window-minimize mdi-window-maximize")
                    $(divtoogle).toggle("hide");

                    $('#vertical-list-btn').toggleClass("hide");

                    const $div_left = $(div_left);
                    $div_left.hasClass('col-lg-3 col-md-3') ? $div_left.removeClass('col-lg-3 col-md-3') :
                    $div_left.hasClass('col-lg-6 col-md-6') ? $div_left.removeClass('col-lg-6 col-md-6') :
                    $div_left.addClass('col-lg-3 col-md-3');

                    $div_left.toggleClass('col-lg-1 col-md-1');

                    const $div_right = $(div_right);
                    $div_right.hasClass('col-lg-9 col-md-9') ? $div_right.removeClass('col-lg-9 col-md-9') :
                    $div_right.hasClass('col-lg-6 col-md-6') ? $div_right.removeClass('col-lg-6 col-md-6') :
                    $div_right.addClass('col-lg-9 col-md-9');

                    $div_right.toggleClass('col-lg-11 col-md-11');

                    label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n(
                        "prj_project_resize_max"));
                })
            }

            this.do_lc_bind_event_div_Minimize = function (btnClass) {
                if (!btnClass) btnClass = ".btn-resize";
                $(btnClass).off("click").on("click", function () {
                    let $this       = $(this);
                    let {divtoogle} = $this.data();
                    let child       = $this.find("i");
                    let label       = $this.find(".label-resize");
                    child.toggleClass("mdi-window-minimize mdi-window-maximize")
                    $(divtoogle).toggle("hide");

                    label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n(
                        "prj_project_resize_max"));
                })
            }

            this.do_lc_minimize = function (div) {
                if (!div) return;

                for (var i in div) {
                    var div   = div[i] + " .btn-resize";
                    let $this = $(div);
                    if ($this.length == 0) continue;
                    let {divtoogle} = $this.data();
                    let child       = $this.find("i");
                    let label       = $this.find(".label-resize");
                    child.toggleClass("mdi-window-minimize mdi-window-maximize")
                    $(divtoogle).toggle("hide");

                    label.html(child.hasClass("mdi-window-minimize") ? $.i18n("prj_project_resize_min") : $.i18n(
                        "prj_project_resize_max"));
                }
            }

            this.do_lc_prevent_winClosing = function (mode) {
                if (mode == App['const'].MODE_NEW || mode == App['const'].MODE_MOD || mode == App['const'].MODE_TRANSL) {
                    window.onbeforeunload = function (event) {
                        return true;
                    };
                } else {
                    window.onbeforeunload = function (event) {
                        return null;
                    };
                }
            }

            //-------------------------------------------------------------------------------------
            this.do_lc_Category_Lst = function (codes, wAvatar, wParent, wChild, forced) {
                var ref        = req_gl_Request_Content_Send('ServiceTpyCategory', 'SVLst');
                ref['codes']   = codes;
                ref['wAvatar'] = wAvatar;
                ref['wParent'] = wParent;
                ref['wChild']  = wChild;
                ref['forced']  = forced;

                var fSucces = [];
                fSucces.push(req_gl_funct(null, do_Category_Lst_Response, []));

                var fError = req_gl_funct(App, self.do_show_Msg, [$.i18n("common_err_ajax")]);

                var secuHeader = req_gl_LS_SecurityHeaderBearer(App.keys.KEY_STORAGE_CREDENTIAL);
                App.network.do_lc_ajax_bg(App.path.BASE_URL_API_PRIV, secuHeader, ref, 100000, fSucces, fError);
            }

            var do_Category_Lst_Response = function (sharedJson) {
                if (!App.data.LstCategories)
                    App.data.LstCategories = {};

                if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
                    var data = sharedJson[App['const'].RES_DATA];

                    App.data.LstCategories.child = data;
                    App.data.LstCategories.level = 0;

                    do_update_lev(App.data.LstCategories.child, 1);

                    for (var i in data) {
                        var cat                          = data[i];
                        cat.inf                          = JSON.parseJson(cat.inf);
                        App.data.LstCategories[cat.code] = cat;
                    }
                }
            }

            var do_Get_Lst_Category_Response = function (sharedJson) {
                if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
                    var data = sharedJson[App['const'].RES_DATA];


                } else {
                }
            }

            var do_update_lev = function (lstCat, lev) {
                for (var i in lstCat) {
                    var cat   = lstCat[i];
                    cat.level = lev;
                    if (cat.child && cat.child.length > 0) {
                        do_update_lev(cat.child, lev + 1);
                    }
                }
            }
        };

        return DBoardMain;
    });