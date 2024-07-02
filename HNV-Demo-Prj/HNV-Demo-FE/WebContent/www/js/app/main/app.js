var AUTHOR_NAME = "hnv";
var IDEA_NAME   = "hnv";
var CLIENT_NAME = "hnv.ec_v3_ui";
var PROJ_NAME   = "hnv.ec_v3_ui_manager";

//var UI_URL_ROOT	= can_gl_MobileOrTablet() ? "" : "www/";
var UI_URL_ROOT = "www/";
var APP_NAME    = "hnv.ec_v3_ui_manager";
var COMP_DOM    = "hnv";

//-------------------------------------------------------------
var var_gl_params_code = [
	{k: "location", v: "par"},
    {k: "language", v: "fr"},
    {k: "languageId", v: "1"},
    {k: "locale", v: "fr-FR"},
];
var appVersion         = localStorage.getItem("appVersion");
if (!appVersion) {
    appVersion = "1.25.8";
    localStorage.setItem("appVersion", appVersion);
}

document.addEventListener("keydown", docOnKeyDown, false);

function docOnKeyDown(e) {
    var x = e.keyCode;
    if (x == 116) {
        appVersion = "1.25." + (new Date().getTime() % 1000);
        localStorage.setItem("appVersion", appVersion);
        event.preventDefault();
        window.location.reload();
    }
}

//--------------------------------------------------------------
var requirejs_config = {
    urlArgs: "bust=" + appVersion,
    // Base dir for all js
    baseUrl: UI_URL_ROOT + "js/lib",
    // paths and aliases
    paths      : {
        jquery  : [
            "//ajax.googleapis.com/ajax/libs/jquery/2.2.3/jquery.min",
            "./vendor/jquery-2.2.3.min",
        ],
        jqueryUI: "./jQueryUI-PRJ/jquery-ui",

        bootstrap: [
            "//netdna.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min",
            "./bootstrap/js/bootstrap.min",
        ],
        //			bootstrap			: './bootstrap/js/bootstrap',

        handlebars: [
            "//cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.4.3/handlebars.min",
            "./vendor/handlebars",
        ],

        app: "../app",

        common    : "../app/common",
        controller: "../app/main/controller",
        template  : "../app/main/template",

        group: "../app/group",
        main : "../app/main",

        i18n: "./i18n/jquery.i18n.all_full",

        fastclick   : "./fastclick",
        fullcalendar: "./fullcalendar",
        iCheck      : "./iCheck",
        slimScrool  : "./slimScroll",

        bootstrapTour     : "./bootstrap-tour/js",
        bootstrapDialog   : "./bootstrap-dialog/js",
        bootstrapwysihtml5: "./bootstrap-wysihtml5",

        flagIcon       : "./flag-icon",
        inputMaskPath  : "./input-mask",
        colorpickerPath: "./colorpicker",
        datatablePath  : "./datatables",

        datetimepickerPath: "./bootstrap-datetimepicker",
        timepickerPath    : "./bootstrap-timepicker",
        datepickerPath    : "./bootstrap-datepicker",

        datepicker    : "./bootstrap-datepicker/js/bootstrap-datepicker.all",
        timepicker    : "./bootstrap-timepicker/js/bootstrap-timepicker",
        datetimepicker: "./bootstrap-datetimepicker/js/bootstrap-datetimepicker",

        daterangepickerPath: "./daterangepicker",
        calendarPickmeup   : "./calendar-pickmeup",

        selectChosen: "./select2/select2.full",

        fileinputPath: "./bootstrap-fileinput",
        fileinput    : "./bootstrap-fileinput/js/fileinput.all_full",

        jpegcamera: "./jpegCamera",

        tagsinput: "./bootstrap-tagsinput",

        jqueryNumpad : "./jquery-numpad",
        touchKeyboard: "./boootstrap-touch-keyboard",

        jqueryResizable: "./jquery-resizable",

        msgboxPath: "./msgbox",

        chosen: "./select-chosen",

        moment: "./moment",

        masonry: "./masonry",

        mapPath: "./mapclustering",

        daypilot: "./daypilot/daypilot-all.min",

        prj            : "./prj",
        prjApexChart   : "./prj/apexcharts",
        prjBootstrap   : "./prj/bootstrap",
        prjDragula     : "./prj/dragula",
        prjDropzone    : "./prj/dropzone",
        prjJqueryRepeat: "./prj/jquery.repeater",
        prjMetismenu   : "./prj/metismenu",
        prjNodewaves   : "./prj/node-waves",
        prjJqueryRepete: "./prj/jquery.repeater",
        prjBib         : "./prj/prj_bib",

        prjBootstrapDatepicker: "./prj/bootstrap-datepicker",
        prjBootstrapTimepicker: "./prj/bootstrap-timepicker",
        prjSummernote         : "./prj/summernote",
        prjSimplebar          : "./prj/simplebar",
    },
    shim       : {
        //---------------------------------------------
        jqueryUI: {
            deps: ["bootstrap"],
        },

        "common/ctrl/BodyTool": {
            deps: [
                "jquery",
                "jqueryUI",
                "selectChosen",
                "common/ctrl/FileInputTool",
                "slimScrool/jquery.slimscroll.min",
                "fastclick/fastclick",
                "daypilot",
            ],
        },

        "common/ctrl/BootstrapTool": {
            deps: [
                "selectChosen",
                "common/ctrl/FileInputTool",
                "common/ctrl/DatatableTool",
            ],
        },

        "common/ctrl/DatatableTool": {
            deps: [
                "jquery",
                //				      'datatablePath/jquery.dataTables.min',
                "datatablePath/dataTables.bootstrap.min",
                "datatablePath/plugins/pagination/input",
                "datatablePath/plugins/pagination/select",
                "datatablePath/plugins/pagination/scrolling",
            ],
        },

        "common/ctrl/HandlebarsHelper": {
            deps: ["handlebars"],
        },

        "common/ctrl/TemplateController": {
            deps: ["handlebars"],
        },

        "common/ctrl/MsgboxController": {
            deps: [
                "bootstrap",
                "common/ctrl/HandlebarsHelper",
                "common/ctrl/TemplateController",
            ],
        },

        "common/ctrl/UserRightTool": {
            deps: ["jquery"],
        },

        "common/ctrl/NotifyTool": {
            deps: ["notify"],
        },

        "common/ctrl/TourTool": {
            deps: ["bootstrapTour/bootstrap-tour"],
        },

        "common/ctrl/ChartTool": {
            deps: ["jquery"],
        },

        "common/ctrl/TagTool": {
            deps: ["jquery", "tagsinput/bootstrap-tagsinput"],
        },

        "common/ctrl/ResizableTool": {
            deps: [
                "jquery",
                "jqueryResizable/jquery-resizable",
                "jqueryResizable/jquery-resizableTableColumns",
            ],
        },

        //-------------------------------------------------------
        fileinput: {
            deps: ["bootstrap"],
        },

        "common/ctrl/CameraController": {
            deps: ["fileinput"],
        },

        "common/ctrl/FileURLController": {
            deps: ["fileinput"],
        },

        "common/ctrl/FileInputTool": {
            deps: ["jquery", "fileinput"],
        },

        //---------------------------------------------
        "tagsinput/bootstrap-tagsinput": {
            deps: ["bootstrap"],
        },

        //---------------------------------------------
        handlebars: {
            deps: ["jquery"],
        },

        //---------------------------------------------
        bootstrap: {
            deps: ["jquery"],
        },

        //---------------------------------------------

        "fastclick/fastclick"             : {
            deps: ["jquery"],
        },
        "fullcalendar/fullcalendar.min"   : {
            deps: ["jquery"],
        },
        "iCheck/icheck.min"               : {
            deps: ["jquery"],
        },
        "slimScrool/jquery.slimscroll.min": {
            deps: ["jquery"],
        },

        "bootstrapTour/bootstrap-tour": {
            deps: ["jquery"],
        },

        "bootstrapDialog/bootstrap-dialog": {
            deps: ["bootstrap"],
        },

        "jqueryNumpad/jquery.numpad": {
            deps: ["jquery", "bootstrap"],
        },

        "touchKeyboard/jqbtk": {
            deps: ["jquery", "bootstrap"],
        },

        "bootstrapwysihtml5/bootstrap3-wysihtml5.hnv": {
            deps: ["jquery", "bootstrap", "common/ctrl/BodyTool"],
        },

        "flagIcon/assets/docs": {
            deps: ["jquery", "bootstrap"],
        },

        //---------------------------------------------
        datepicker: {
            deps: ["jquery", "bootstrap"],
        },

        //---------------------------------------------
        timepicker: {
            deps: ["jquery", "bootstrap"],
        },

        //---------------------------------------------
        datetimepicker: {
            deps: [
                "jquery",
                "bootstrap",
                "moment/moment.min",
                "moment/locales.newline",
            ],
        },

        //---------------------------------------------
        "calendarPickmeup/pickmeup": {
            deps: ["jquery", "bootstrap"],
        },

        //---------------------------------------------
        //			'datatablePath/jquery.dataTables.min':{
        //				deps:['jquery']
        //			},

        "datatablePath/dataTables.bootstrap.min": {
            deps: ["jquery", "bootstrap", "datatablePath/jquery.dataTables.min"],
        },

        "datatablePath/plugins/pagination/input": {
            deps: ["datatablePath/dataTables.bootstrap.min"],
        },

        "datatablePath/plugins/pagination/select": {
            deps: ["datatablePath/dataTables.bootstrap.min"],
        },

        "datatablePath/plugins/pagination/scrolling": {
            deps: ["datatablePath/dataTables.bootstrap.min"],
        },

        //---------------------------------------------

        //---------------------------------------------
        "jpegcamera/jpeg_camera_no_flash": {
            deps: ["jquery", "jpegcamera/canvas-to-blob"],
        },

        //---------------------------------------------
        "msgboxPath/jquery.msgBox": {
            deps: ["jquery"],
        },

        //---------------------------------------------
        "jqueryResizable/jquery-resizable": {
            deps: ["jquery"],
        },

        "jqueryResizable/jquery-resizableTableColumns": {
            deps: ["jquery"],
        },

        //---------------------------------------------
        i18n: {
            deps: ["jquery"],
        },

        "jquery.numberformatter-1.2.4": {
            deps: ["jquery"],
        },

        //---------------------------------------------
        "jqxScheduler/jqxScheduler.all": {
            deps: ["jquery"],
        },

        //---------------------------------------------

        "chosen/chosen.jquery": {
            deps: ["jquery"],
        },

        //---------------------------------------------

        "masonry/masonry.pkgd": {
            deps: ["jquery"],
        },

        //---------------------------------------------
        //			'../../../cordova' :{
        //				deps:['jquery']
        //			},
        //---------------------------------------------
        //---------------------------------------------
        "mapPath/infobox": {
            deps: [
                "https://maps.google.com/maps/api/js?key=AIzaSyBF-ao2kom3PV8ex5kDrbTJN_NRG3awnCg&language=vi&region=VN&libraries=places",
            ],
        },

        "mapPath/map": {
            deps: [
                "jquery",
                // 'mapPath/data-map',
                "https://maps.google.com/maps/api/js?key=AIzaSyBF-ao2kom3PV8ex5kDrbTJN_NRG3awnCg&language=vi&region=VN&libraries=places",
                "mapPath/markerclusterer.min",
                "mapPath/infobox",
                "mapPath/GoogleMapTool",
            ],
        },
        "goong/map"  : {
            deps: [
                'https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.js'
            ]
        },
        gmap3        : {
            deps: ["jquery"],
        },

        daypilot: {
            deps: ["jquery"],
        },

        //--------------------------------------------------
        "common/ctrl/hwcrypto/hwcrypto"      : {
            deps: ["jquery"],
        },
        "pagination-custom"                  : {
            deps: ["jquery"],
        },
        "prjJqueryRepete/jquery.repeater.min": {
            deps: ["jquery"],
        },
        "prjBib/prj"                         : {
            deps: ["jquery"],
        },
        //------------------crypto--------------------------------
        "hnv-secu/convert"                                  : {
            deps: ["hnv-secu/core"],
        },
        "hnv-secu/hmac"                                     : {
            deps: ["hnv-secu/core"],
        },
        "hnv-secu/sha1"                                     : {
            deps: ["hnv-secu/core"],
        },
        "hnv-secu/pbkdf2"                                   : {
            deps: ["hnv-secu/core"],
        },
        "hnv-secu/Base64Binary"                             : {
            deps: ["hnv-secu/core"],
        },
        "hnv-secu/HNVEnc"                                   : {
            deps: ["hnv-secu/core"],
        },
        "hnv-secu/aes"                                      : {
            deps: ["hnv-secu/core"],
        },
        "common/ctrl/CommonTool"                            : {
            deps: ["jquery"],
        },
        "prjBootstrapTimepicker/js/bootstrap-timepicker.min": {
            deps: ["jquery"],
        },

        //----------------summernote-------------------------
        "prjSummernote/summernote-bs4.min": {
            deps: ["jquery"],
        },

        "prjSummernote/lang/fr-FR"                : {
            deps: ["prjSummernote/summernote-bs4.min"],
        },
        "prjSummernote/lang/uk-UA"                : {
            deps: ["prjSummernote/summernote-bs4.min"],
        },
        "prjSummernote/lang/vi-VN"                : {
            deps: ["prjSummernote/summernote-bs4.min"],
        },
        "prjSummernote/emoji/js/config-summernote": {
            deps: ["prjSummernote/summernote-bs4.min"],
        },
        "prjSummernote/emoji/js/tam-emoji"        : {
            deps: ["prjSummernote/summernote-bs4.min"],
        },
        "prjSummernote/file/summernote-file"      : {
            deps: ["prjSummernote/summernote-bs4.min"],
        },
        "common/ctrl/SummerNoteController"        : {
            deps: [
                "prjSummernote/summernote-bs4.min",
                "prjSummernote/lang/fr-FR",
                "prjSummernote/lang/uk-UA",
                "prjSummernote/lang/vi-VN",
                "prjSummernote/emoji/js/config-summernote",
                "prjSummernote/emoji/js/tam-emoji",
                "prjSummernote/file/summernote-file",
            ],
        },
    },
    waitSeconds: 360,
};

var AppCommon = {
    version: appVersion,
    //		title 	: "Shop Manager V.1.0",

    environment: "DEV",
    //environment:"AF",
    //environment:"QUALIF",
    //environment:"PROD",
    // Globals Constants urls

    path: {
        BASE_APP   			: UI_URL_ROOT + "js/app",
        BASE_URL_UI			: "/", //'/hnv.em_v2_ui/'
        
        BASE_URL_API_PUBL 	: '/bo/api/publ',
        BASE_URL_API_PRIV 	: '/bo/api/priv',
        BASE_URL_API_LOGIN	: '/bo/api/login',
        BASE_URL_API_UPLOAD	: '/bo/api/up',
    },
    // Globals Constants keys local storage
    keys: {
        KEY_STORAGE_CREDENTIAL: "KEY_STORAGE_CREDENTIAL",
    },
    // Globals Constants routes
    router: {
        controller: null,
        routes    : {
//            ONLOAD  : "/onLoad",
//            HOME    : "/admin",
//            PREVIOUS: "/previous",
//            NEXT    : "/next",
//
//            UPLOAD: "/upload",
//            LOGOUT: "/logout",
//            LOGIN : "/login",
//
//            CMS_MAIN: "/cms_main",
//
//            HOME_VIEW: "/home_view",
//
//            ONLOAD_PRJ: "/onLoad_prj",
//            LOGOUT_PRJ: "/logout_prj",
//            LOGIN_PRJ : "/login_prj",
        },
    },

    controller: {},

    template: {
        controller: null,
        names     : {
            CMS_MSGBOX  : "CMS_MsgBox",
            CMS_CAMERA  : "CMS_Camera",
            CMS_FILE_URL: "CMS_File_URL",

            HOME_VIEW: "Home_View",
        },
    },

    data: {
        session_id: -1,
        user      : {
            headerURLSecu: null,
        },
    },

    const: {
        MODE_INIT  : 0,
        MODE_NEW   : 1, //duplicate is the mode new after clone object
        MODE_MOD   : 2,
        MODE_DEL   : 3,
        MODE_SEL   : 5,
        MODE_TRANSL: 10,

        SV_CLASS: "sv_class",
        SV_NAME : "sv_name",
        SV_CODE : "sv_code",

        SESS_STAT: "sess_stat",
        SESS_ID  : "sess_id",
        USER_ID  : "user_id",
        LOCK_ID  : "lock_id",

        USER_NAME 	: "user_name",
        USER_RIGHT	: "user_right",
        USER_TOK	: "user_tok",

        RES_DATA: "res_data",
        RES_LOCK: "lock",
        REQ_DATA: "req_data",

        FUNCT_SCOPE: "fVar",
        FUNCT_NAME : "fName",
        FUNCT_PARAM: "fParams",

        /*-------------------Error code ----------------------------------*/
        SV_CODE_ERR_AUTHEN: 10000,
        SV_CODE_ERR_RIGHT : 10001,

        /*-------------------API code to resp------------------------------*/
        SV_CODE_API_YES: 20000,
        SV_CODE_API_NO : 20001,

        SV_CODE_OK: 20000,
        SV_CODE_KO: 20001,

        SV_CODE_NOTHING: 0,
        /*-------------------Error code ----------------------------------*/

        SV_CODE_ERR_UNKNOW: 10000,
        SV_CODE_ERR_AUTHEN: 10001,
        SV_CODE_ERR_SESS  : 10002,
        SV_CODE_ERR_RIGHT : 10003,
        SV_CODE_ERR_LOCK  : 10004,
        SV_CODE_ERR_API   : 10010,

        LANGUAGE: {
            EN: "en",
            FR: "fr",
            VN: "vi",
        },

        LANGUAGE_ID: {
            EN: "2",
            FR: "3",
            VN: "1",
        },
    },

    funct: {},

    constHTML: {
        id       : {
            HEADER_VIEW       : "#div_HeaderView",
            HEADER_LOGO_VIEW  : "#div_HeaderLogoView",
            HEADER_NAVBAR_VIEW: "#div_HeaderNavbarView",

            CONTENT_VIEW           : "#layout-wrapper",
            CONTENT_BREADCRUMB_VIEW: "#div_ContentBreadcrumbView",
            CMS_CONTENT_VIEW       : "#div_CMSContentView", //main view

            FOOTER_VIEW: "#div_FooterView",

            MENU_VIEW       : "#div_MenuView",
            MENU_USERPANEL  : "#div_Menu_UserPanel",
            MENU_SEARCH     : "#div_Menu_Search",
            MENU_SIDEBARMENU: "#div_Menu_SidebarMenu",
            //items menu
            MENU_ITEM_DASHBOARD: "#li_Menu_SidebarMenu_Item_Dashboard",
            MENU_ITEM_CFG      : "#li_Menu_SidebarMenu_Item_CFG",

            SETTINGS_CONFIG_VIEW: "#div_SettingsConfigView",
            SETTINGS_LOAD_VIEW  : "#div_SettingsLoadView",

            LOGIN_VIEW: "#div_LoginView",
        },
        classBody: {
            LOGIN   : "hold-transition login-page",
            HOMEPAGE: "hold-transition skin-black sidebar-collapse sidebar-mini", //fixed
        },
    },
};

//----------------------------------------------------------------------------------------------------------------------------

//var var_gl_divMenuView			= "#div_MenuView";
//var var_gl_divContentView			= "#div_ContentView";
//var var_gl_divFooterView			= "#div_FooterView";
//var var_gl_divSettingsConfigView	= "#div_SettingsConfigView";
//var var_gl_divSettingsLoadView	= "#div_SettingsLoadView";
//var var_gl_divCMSContentView		= "#div_CMSContentView";

//----------------------------------------------------------------------------------------------------------------------------
var lastStatus = "";

window.onload = function () {
    var element = document.createElement("div");
    element.id  = "div_Preloader";
    document.body.appendChild(element);
};

var do_gl_lang_load = function (callback) {
    try {
        //Load language
        var locale   = localStorage.getItem("locale");
        var language = localStorage.getItem("language");
        var lang_id  = localStorage.getItem("languageId");

        if (!language || !locale || !lang_id) {
            do_gl_Set_Lang_Build_UI_URL_PATH();
            locale   = localStorage.getItem("locale");
            language = localStorage.getItem("language");
            lang_id  = localStorage.getItem("languageId");
        }

        App.locale     = locale;
        App.language   = language;
        App.languageId = lang_id;

        try {
            $.fn.datepicker.defaults.language = App.language;
        } catch (e) {
        }

        $.i18n({
            locale: App.locale,
        });
        $.i18n()
         .load(App.path.BASE_APP + "/transl", App.language, App.version)
         .done(function () {
             if (callback) callback();
         });
    } catch (e) {
        console.log("---Cannot load language package----");
    }
};

var do_gl_lang_append = function (fileDir, callback, params) {
    try {
        $.i18n()
         .load(App.path.BASE_APP + "/" + fileDir, App.language, App.version)
         .done(function () {
        	 if (callback){
        		 if (params) 
        			 callback.apply(null, params)
        		 else
        			 callback();
        	 }
         });
    } catch (e) {
        console.log("---Cannot append language package----");
    }
};

var do_gl_InitApp = function (
    RouteController,
    Network,
    TemplateController,
    MsgboxController,
    SummerNoteController,
    RightController,
    FileURLController,
    CameraController
) {
    if (AppCommon.title) document.title = AppCommon.title;

    App = $.extend(true, {}, AppCommon, App);

    /* --------- define put function for App.data ---------*/
    App.funct.put = function (sharedJson, name) {
        var sessId  = App["const"].SESS_ID;
        var resData = App["const"].RES_DATA;

        var sID = sharedJson[sessId];
        if (sID) App.data[sessId] = sID;

        if (name == "put" || name == sessId) return;
        if (name) {
            App.data[name] = sharedJson[resData];
        }
    };

    App.funct.put_networkData = function (sharedJson, apiUrl) {
        var sessId  = App["const"].SESS_ID;
        var resData = App["const"].RES_DATA;

        var sID = sharedJson[sessId];
        if (sID) App.data[sessId] = sID;

        var networkData = App["const"]["NET_DATA"];
        if (!networkData) {
            App["const"]["NET_DATA"] = {};
            networkData              = App["const"]["NET_DATA"];
        }
        if (!networkData[apiUrl]) {
            networkData[apiUrl]           = {};
            networkData[apiUrl]["header"] = req_gl_LS_SecurityHeaderBearer(
                App.keys.KEY_STORAGE_CREDENTIAL
            );
            networkData[apiUrl][sessId]   = sID;
            networkData[apiUrl]["user"]   = App.data.user;
        }
    };
    //----carrefully: sharedJson[resData] must be a array 1 level (not array of array) = array of object, object must have id
    App.funct.putArray        = function (sharedJson, name) {
        var sessId  = App["const"].SESS_ID;
        var resData = App["const"].RES_DATA;

        var sID = sharedJson[sessId];
        if (sID) App.data[sessId] = sID;
        if (name == sessId) return;
        if (name) {
            App.data[name] = {};
            for (var ind in sharedJson[resData]) {
                var o                = sharedJson[resData][ind];
                App.data[name][o.id] = o;
            }
        }
    };

    App.funct.merge = function (sharedJson, name) {
        var sessId  = App["const"].SESS_ID;
        var resData = App["const"].RES_DATA;

        var sID = sharedJson[sessId];
        if (sID) App.data[sessId] = sID;

        if (name == sessId) return;
        if (name) {
            var o          = App.data[name];
            App.data[name] = $.extend(o, sharedJson[resData]);
        }
    };

    App.funct.mergeArray = function (sharedJson, name) {
        var sessId  = App["const"].SESS_ID;
        var resData = App["const"].RES_DATA;

        var sID = sharedJson[sessId];
        if (sID) App.data[sessId] = sID;

        if (name == sessId) return;
        if (name) {
            var o = App.data[name];
            if (o == null) o = [];
            App.data[name] = o.concat(sharedJson[resData]);
        }
    };

    //----------------------------------------------------------
    App.network             = new Network();
    App.template.controller = new TemplateController();

    // create global router, init after templateController
    App.router.controller = new RouteController();
    App.router.controller.do_lc_init();

    App.MsgboxController = new MsgboxController();
    App.MsgboxController.do_lc_init();

    App.SummerNoteController = new SummerNoteController();

    App.RightController = new RightController();

    App.FileURLController = new FileURLController();

    App.CameraController = new CameraController();

    //------------------------------------------------------------------
    do_gl_lang_load(do_gl_page_show);

    do_gl_init_datepicker();
};

var do_gl_page_show = function () {
    //Custom datatable to hide line with mode = 3
    //	$.fn.DataTable.ext.search.push(
    //			function(settings, data, dataIndex) {
    //				var mode = settings.aoData[dataIndex]._aData.mode;
    //				if(!mode || mode != 3) {
    //					return true;
    //				} else {
    //					return false;
    //				}
    //			}
    //	);

    do_gl_page_FirstView();
    do_gl_page_Resize();
    /*---------------------------------------------------*/
    if (!can_gl_MobileOrTablet()) {
        if (App.environment != "DEV") {
        }
    } else {
        // Wait for device API libraries to load
        document.addEventListener("deviceready", onDeviceReady, false);
    }

    //------------------------------------------------------
    $("#div_Preloader").fadeOut(1000);

    setTimeout(function () {
        $("#div_Preloader").hide();
    }, 1000);
};

var do_gl_page_FirstView = function () {
    if (!localStorage.language) localStorage.language = "vi";
    App.language = localStorage.language;

    if (FIRST_VIEW) {
        App.router.controller.do_lc_run(
//            App.router.routes.ONLOAD_PRJ + "/" + FIRST_VIEW
        	App.router.routes.ONLOAD + "/" + FIRST_VIEW
        );
    } else {
//        App.router.controller.do_lc_run(App.router.routes.ONLOAD_PRJ);
        App.router.controller.do_lc_run(App.router.routes.ONLOAD);
    }
};

var do_gl_page_Resize = function () {
    var fix = 100;
    var sH  = $(window).height();

    // Sections height
    $(window).resize(function () {
        var sH = $(window).height();
    });
};

var can_gl_MobileOrTablet = function () {
    var check = false;
    (function (a) {
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
                a
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                a.substr(0, 4)
            )
        )
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

var can_gl_iOSDevices = function () {
    return (
        navigator.platform.indexOf("iPhone") != -1 ||
        navigator.platform.indexOf("iPod") != -1 ||
        navigator.platform.indexOf("iPad") != -1
    );
};

//function can_gl_iPhoneOriPod(){
//    return navigator.platform.match(/i(Phone|Pod))/i)
//}

var do_gl_conn_check = function () {
    var networkState = navigator.connection.type;
    console.log("NETWORK CHANGED : ", networkState);
    if (networkState != lastStatus) {
        lastStatus = networkState;
        console.log("Network connection switched to : ", networkState);
        //		modifyBaseUrl(networkState);
    }
};

//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
//Is fired when device is ready
function onDeviceReady() {
    document.addEventListener("offline", eventOffline, false);
    document.addEventListener("online", eventOnline, false);
    document.addEventListener("pause", eventPause, false);
    do_gl_conn_check();
}

//Is fired when connection is lost
function eventOffline() {
    do_gl_conn_check();
}

//Is fired when connection is backed up
function eventOnline() {
    do_gl_conn_check();
}

//Is fired when application is paused
function eventPause() {
    //TODO: Erase plane related localstorage stuff ? Have to dial about that
}

//----------------------------------------------------------------------------------------------------------------------------

var bib_jquery = ["jquery", "jqueryUI"];

var bib_hnv_tool = [
    "sha256.min",

    // 'common/ctrl/All_Tool',
    "common/ctrl/BodyTool", //---su dung noi tu 'appLTE'
    "common/ctrl/BootstrapTool",
    "common/ctrl/DatatableTool",
    "common/ctrl/DateTool",
    "common/ctrl/ExceptionTool",
    "common/ctrl/FunctionTool",
    "common/ctrl/HandlebarsHelper",
    "common/ctrl/InputTool",
    "common/ctrl/NotifyTool",
    "common/ctrl/Queue",
    "common/ctrl/SecurityTool",
    "common/ctrl/TagTool",
    "common/ctrl/ChartTool",
    "common/ctrl/FileInputTool",
    "common/ctrl/UserRightTool",
    "common/ctrl/ResizableTool",
    "common/ctrl/URLTool",
    "common/ctrl/PaginationTool",
    "common/ctrl/TranslationTool",
    "common/ctrl/CommonTool",
];

var bib_hnv_tool_02 = [
    "common/ctrl/WebSQLTool",
    "common/ctrl/QRCode/QRCodeDecode",
    "common/ctrl/QRCode/QRCodeEncode",
    "common/ctrl/hwcrypto/hwcrypto",
];

var bib_color = [
    //             		    'colorpickerPath/bootstrap-colorpicker'
];

var bib_datatable = [
    "datatablePath/dataTables.bootstrap.min",
    "datatablePath/plugins/pagination/input",
    "datatablePath/plugins/pagination/select",
    "datatablePath/plugins/pagination/scrolling",
];

var bib_datetime = [
    //                 	    'datepickerPath/bootstrap-datepicker',
    //						'datepickerPath/locales/bootstrap-datepicker.en',
    //						'datepickerPath/locales/bootstrap-datepicker.fr',
    //						'datepickerPath/locales/bootstrap-datepicker.vn',
    //						'daterangepickerPath/daterangepicker',

    "datepicker", //--neu muon them lang thi sua bootstrap-datepicker.all_full roi minimize lai
    "timepicker",
    "datetimepicker",
    //						'calendarPickmeup/pickmeup'
    //						'luxon.min'
];

var bib_inputmask = [];

var bib_transl = ["i18n"];

var bib_file = [
    //            		   	'fileinput/js/fileinput',
    //               		'fileinput/js/plugins/sortable',
    //               		'fileinput/js/plugins/purify',
    //               		'fileinput/js/locales/en',
    //               		'fileinput/js/locales/fr',
    //               		'fileinput/js/locales/vn'
    //               		'fileinput/js/fileinput.all' //for add lang: use fileinput.all_full, then minimize
];

var bib_secu = [
    "hnv-secu/core",
    "hnv-secu/convert",
    "hnv-secu/hmac",
    "hnv-secu/sha1",
    "hnv-secu/pbkdf2",
    "hnv-secu/Base64Binary",
    "hnv-secu/HNVEnc",
    "hnv-secu/aes",
];

var bib_others = [
    /*'cordova.js',*/
    //						'sprintf',							//--use in MsgBoxController
    //						'common/ctrl/xml2json',
    "pagination-custom",
    "jquery.numberformatter-1.2.4", //--parse number in InputTool
    "bootstrapTour/bootstrap-tour", //--help in interface
    "jqueryNumpad/jquery.numpad",
    "touchKeyboard/jqbtk", //--virtual keyboard for sell UI
    "patternomaly", //--draw chart
    "slimScrool/jquery.slimscroll.min", //--hieu ung template
    "fastclick/fastclick", //--hieu ung template
    "iCheck/icheck.min", //--checkbox used in MSG
    "masonry/masonry.pkgd",
    //
    //		        	    'bootstrapwysihtml5/bootstrap3-wysihtml5.hnv' //--Text editor
];

var bib_jqxScheduler = ["jqxScheduler/jqxScheduler.all"];

var bib_chosen = [
    "chosen/chosen.jquery", //-- use in report man for multi select
];
var bib_map    = ["mapPath/map", "mapPath/geo", "mapPath/data-map"];

var bib_summernote = [
    "prjSummernote/summernote-bs4.min",
    "prjSummernote/lang/fr-FR",
    "prjSummernote/lang/uk-UA",
    "prjSummernote/lang/vi-VN",
    "prjSummernote/emoji/js/config-summernote",
    "prjSummernote/emoji/js/tam-emoji",
    "prjSummernote/file/summernote-file",
];

var bib_prj     = [
    "jqueryUI",
    "prjMetismenu/metisMenu.min",
    "prjSimplebar/simplebar.min",
    "prjNodewaves/waves.min",
    "prjDropzone/min/dropzone.min",
    "prjJqueryRepete/jquery.repeater.min",
    "prjBib/prj",
    "prjBootstrap/js/bootstrap.bundle.min", //menu event

    //	'prjBootstrapDatepicker/js/bootstrap-datepicker.min',
    //	'prjBootstrapTimepicker/js/bootstrap-timepicker.min'
];
var bib_cordova = [
    //	'cordova.js',
];

function do_gl_Set_Lang_Build_UI_URL_PATH() {
    localStorage.setItem(var_gl_params_code[1].k, var_gl_params_code[1].v);
    localStorage.setItem(var_gl_params_code[2].k, var_gl_params_code[2].v);
    localStorage.setItem(var_gl_params_code[3].k, var_gl_params_code[3].v);
}

var do_gl_init_datepicker = function () {
    try {
        $.fn.datepicker.dates["fr"] = {
            days       : [
                "Dimanche",
                "Lundi",
                "Mardi",
                "Mercredi",
                "Jeudi",
                "Vendredi",
                "Samedi",
            ],
            daysShort  : ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
            daysMin    : ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
            months     : [
                "Janvier",
                "Février",
                "Mars",
                "Avril",
                "Mai",
                "Juin",
                "Juillet",
                "Août",
                "Septembre",
                "Octobre",
                "Novembre",
                "Decembre",
            ],
            monthsShort: [
                "Jan",
                "Fév",
                "Mar",
                "Avr",
                "Mai",
                "Juin",
                "Juillet",
                "Août",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
            today      : "Aujourd'hui",
            clear      : "Effacer",
            format     : "dd/mm/yyyy",
            titleFormat: "MM yyyy" /* Leverages same syntax as 'format' */,
            weekStart  : 0,
        };

        $.fn.datepicker.dates["vi"] = {
            days       : [
                "Chủ nhật",
                "Thứ Hai",
                "Thứ Ba",
                "Thứ tư",
                "Thứ năm",
                "Thứ sáu",
                "Thứ bảy",
            ],
            daysShort  : ["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"],
            daysMin    : ["Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy", "CN"],
            months     : [
                "Tháng Một",
                "Tháng Hai",
                "Tháng Ba",
                "Tháng Tư",
                "Tháng Năm",
                "Tháng Sáu",
                "Tháng Bảy",
                "Tháng Tám",
                "Tháng Chín",
                "Tháng Mười",
                "Tháng Mười Một",
                "Tháng Mười Hai",
            ],
            monthsShort: [
                "Một",
                "Hai",
                "Ba",
                "Tư",
                "Năm",
                "Sáu",
                "Bảy",
                "Tám",
                "Chín",
                "Mười",
                "Một",
                "Hai",
            ],
            today      : "Hôm nay",
            clear      : "Xóa",
            format     : "dd/mm/yyyy",
            titleFormat: "MM yyyy" /* Leverages same syntax as 'format' */,
            weekStart  : 0,
        };
    } catch (e) {
        console.log(e);
    }
};

var do_gl_refresh_SecuHeader = function () {
    setInterval(function () {
        console.log("----Refresh Http Secu Header-----");
        App.data["HttpSecuHeader"] = req_gl_LS_SecurityHeaderBearer(
            App.keys.KEY_STORAGE_CREDENTIAL
        );
    }, 1000 * 60 * 30);
};

var do_gl_show_Notify_Msg = function (
    sharedJson,
    msg,
    typeNotify,
    modeOld,
    modeNew
) {
    if (typeNotify) {
        if (typeNotify == 1) {
            if (!msg) msg = "OK";
            do_gl_show_Notify_Msg_Success(msg);
        } else if (typeNotify == 0) {
            if (!msg) msg = "Err";
            do_gl_show_Notify_Msg_Error(msg);
        }
    } else {
        var code = sharedJson[App["const"].SV_CODE];
        if (code == App["const"].SV_CODE_API_YES) {
            if (
                modeOld == App["const"].MODE_NEW ||
                modeOld == App["const"].MODE_MOD
            ) {
                if (!msg) {
                    msg = $.i18n("common_ok_msg_save");
                }
            } else if (modeOld == App["const"].MODE_DEL) {
                if (!msg) msg = $.i18n("common_ok_msg_del");
            }
            do_gl_show_Notify_Msg_Success(msg);
        } else if (code == App["const"].SV_CODE_API_NO) {
            if (
                modeOld == App["const"].MODE_INIT ||
                modeOld == App["const"].MODE_SEL
            ) {
                if (!msg) msg = $.i18n("common_err_msg_get");
            } else if (
                modeOld == App["const"].MODE_NEW ||
                modeOld == App["const"].MODE_MOD
            ) {
                if (!msg) msg = $.i18n("common_err_msg_save");
            } else if (modeOld == App["const"].MODE_DEL) {
                if (!msg) msg = $.i18n("common_err_msg_del");
            }

            do_gl_show_Notify_Msg_Error(msg);
        } else {
            if (!msg) msg = $.i18n("common_err_msg_unknow");
            do_gl_show_Notify_Msg_Error(msg + " (" + code + ")");
        }
    }
};
//------------------------------------------------------------------------------------------
requirejs.config(requirejs_config);
var URL_API = 'http://localhost:8080/bo/api';
var App = {
	path: {
		BASE_URL_API: URL_API,

		API_SOR_ORDER: "/ServiceTaSorOrder",

		API_PER_PERSON: "/ServicePerPerson",
		API_AUT_USER: "/ServiceAutUser",

		API_MAT_MATERIAL: "/ServiceMatMaterial",
		API_MAT_UNIT: "/ServiceMatUnit",

		API_LOGIN: "/login",
		API_LOGOUT: "/logout",

		API_UPLOAD: "/up",

		DATA_FILE_URL: URL_API + "?" + "sv_class=servicetpydocument&sv_name=svtpydocumentgetfile&code=d_1_1728379486&pT=11000",
		LOCATION_URL_HREF: '',
	},

	// Globals Constants routes
	router: {
		controller: null,
		routes: {
			VI_MAIN: "VI_MAIN"
		},
		part: {
		}
	},
	controller: {
	},
	template: {
		names: {
		}
	},
	'const': {

	},
	data: {
	},
	varname: {
	},
	funct: {
	},
	constHTML: {
	},
};

var bib = ['jquery',

//	'group/dashboard/ctrl/RouteController',
	'main/route/CommonRouteController',

	'common/ctrl/Network',
	'common/ctrl/TemplateController',
	'common/ctrl/MsgboxController_New',
	'common/ctrl/SummerNoteController',
	'common/ctrl/RightController',
	'common/ctrl/FileURLController',
	'common/ctrl/CameraController',

];

var bib_all = [...bib,
...bib_transl,
...bib_hnv_tool,
...bib_prj,
...bib_others,
...bib_secu,
...bib_datetime,
...bib_summernote];

if (can_gl_MobileOrTablet()) bib_all = [...bib_all, ...bib_cordova];

//Start the main app logic.
requirejs(bib_all, function ($, RouteController, Network, TemplateController, MsgboxController, SummerNoteController, RightController, FileURLController, CameraController) {
	$(document).ready(function () {
		//--------------Begin app here ----------------------------------------------------------------------------------------------	
		do_gl_InitApp(RouteController, Network, TemplateController, MsgboxController, SummerNoteController, RightController, FileURLController, CameraController);
		App.data.url = decodeURIComponent(window.location.search.substring(1));
	});
});
//------------------------------------------------------------------------------