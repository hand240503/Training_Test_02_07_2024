var do_gl_init_pagination_opt = function (options) {
    var contentDiv    = options.divMain;
    var paginationDiv = $(options.divMain);
    var container     = $(options.divPagination);
    var url_api       = options.url_api;
    var url_header    = options.url_header;
    var refJson       = options.url_api_param;
    var pageSize      = options.pageSize;
    var pageRange     = options.pageRange;
    var callbackFunct = options.callback;
    var callbackParam = options.callbackParam;
    var tagDiv        = options.tagDiv;
    var showGoInput   = options.showGoInput;
    var showGoButton  = options.showGoButton;
    var options       = {
        pageSize          : pageSize == undefined ? 9 : pageSize,
        pageRange         : pageRange == undefined ? 1 : pageRange,
        dataSource        : url_api,
        totalNumberLocator: function (response) {
            return response[App['const'].RES_DATA].total;
        },

        ajax: {
            dataType   : 'json',
            contentType: 'application/json',
            type       : 'POST',
            headers    : url_header,
            data       : refJson, //JSON.stringify is realised in Pagination-custom.js
            url        : url_api,
//				beforeSend 	: function() {
//					container.prev().html($.i18n("common_loading_data"));
//				}
        },

        callback: callbackFunct,

        afterRender: function () {
            if (tagDiv) do_gl_load_top_Div(tagDiv, paginationDiv);
            else do_gl_load_top_Div(contentDiv, paginationDiv);
        },
        afterPaging: function () {
            var totalPage = container.pagination("getTotalPage");
            if (totalPage && $("li.paginationjs-ellipsis").length > 0) {
                var li      = "";
                var liTotal = JSON.stringify(totalPage) + "...";

                for (var i = 0; i < totalPage; i++) {
                    var index = i + 1;
                    li += '<li class="li_input_pagination" data-value="' + index + '">' + index + '</li>';
                }
                var divForm = '<div class="div_input_pagination">'
                    + '<input type="text" style="width:100%" value="' + liTotal + '"/> '
                    + '<ul style="display : grid;height : 150px;overflow-y :scroll;margin-top : 0!important;cursor:pointer">'
                    + li
                    + '</ul>'
                    + '</div>';
                $("li.paginationjs-ellipsis").removeClass("disabled");
                $("li.paginationjs-ellipsis").append(divForm);
                $("li.paginationjs-ellipsis").find(".div_input_pagination").hide();
                do_bind_event_ellipsis(paginationDiv, container);
            }

        }
    };

    try {
        container.pagination(options);
    } catch (e) {
        console.log(e);
    }
}

var do_gl_init_pagination = function (
    contentDiv, url_api, url_header, refJson, pageSize, pageRange, callbackFunct, tagDiv) {
//	refJson['pageSize'] 	= refJson["number"];
//	refJson['pageNumber'] 	= 1;

    var paginationDiv = $(contentDiv).find(".wygo-pagination");
    var container     = $(paginationDiv);

    var options = {
        pageSize  : pageSize == undefined ? 9 : pageSize,
        pageRange : pageRange == undefined ? 1 : pageRange,
        dataSource: url_api, 	//thay the url trong ajax
//			locator		: function() {
//				return App['const'].RES_DATA;
//			},
        totalNumberLocator: function (response) {
            return response[App['const'].RES_DATA].total;
        },

        ajax: {
            dataType    : 'json',
            contentType : 'application/json',
            type        : 'POST',
            headers     : url_header,
            data        : refJson,//JSON.stringify is realised in Pagination-custom.js
            url         : url_api,
            beforeSend  : function () {
                container.prev().html($.i18n("common_loading_data"));
            }
        },

        callback: callbackFunct,

        afterRender: function () {
            if (tagDiv) do_gl_load_top_Div(tagDiv, paginationDiv);
            else do_gl_load_top_Div(contentDiv, paginationDiv);
        },
        afterPaging: function () {
            var totalPage = container.pagination("getTotalPage");
            if (totalPage && $("li.paginationjs-ellipsis").length > 0) {
                var li      = "";
                var liTotal = JSON.stringify(totalPage) + "...";

                for (var i = 0; i < totalPage; i++) {
                    var index = i + 1;
                    li += '<li class="li_input_pagination" data-value="' + index + '">' + index + '</li>';
                }
                var divForm = '<div class="div_input_pagination">'
                    + '<input type="text" style="width:100%" value="' + liTotal + '"/> '
                    + '<ul style="display : grid;height : 150px;overflow-y :scroll;margin-top : 0!important;cursor:pointer">'
                    + li
                    + '</ul>'
                    + '</div>';
                $("li.paginationjs-ellipsis").removeClass("disabled");
                $("li.paginationjs-ellipsis").append(divForm);
                $("li.paginationjs-ellipsis").find(".div_input_pagination").hide();
                do_bind_event_ellipsis(paginationDiv, container);
            }

        }
    };

    try {
        container.pagination(options);
    } catch (e) {
        console.log(e);
    }
}

var do_gl_init_pagination_noAjax = function (contentDiv, pageSize, pageRange, callbackFunct, tagDiv, data, total) {
    var paginationDiv = $(contentDiv).find(".wygo-pagination");
    var container     = $(paginationDiv);

    var options = {
        pageSize   : pageSize == undefined ? 9 : pageSize,
        pageRange  : pageRange == undefined ? 1 : pageRange,
        dataSource : data,
        totalNumber: total,

        callback: callbackFunct,

        afterRender: function () {
            if (tagDiv) do_gl_load_top_Div(tagDiv, paginationDiv);
            else do_gl_load_top_Div(contentDiv, paginationDiv);
        }
    };

    try {
        container.pagination(options);
    } catch (e) {
        console.log(e);
    }
}

//custom pagination with no data response from ajax
var do_gl_init_pagination_noResData = function (
    contentDiv, url_api, url_header, refJson, pageSize, pageRange, callbackFunct, tagDiv, data, total) {
    var paginationDiv = $(contentDiv).find(".wygo-pagination");
    var container     = $(paginationDiv);

    var options = {
        pageSize   : pageSize == undefined ? 9 : pageSize,
        pageRange  : pageRange == undefined ? 1 : pageRange,
        dataSource : data,
        locator    : '',
        totalNumber: total,

        isNoAjax: true,
        ajax    : {
            dataType    : 'json',
            contentType : 'application/json',
            type        : 'POST',
            headers     : url_header,
            data        : refJson,//JSON.stringify is realised in Pagination-custom.js
            url         : url_api,
            beforeSend  : function () {
                container.prev().html($.i18n("common_loading_data"));
            }
        },

        callback: callbackFunct,

        afterRender: function () {
            if (tagDiv) do_gl_load_top_Div(tagDiv, paginationDiv);
            else do_gl_load_top_Div(contentDiv, paginationDiv);
        }
    };

    try {
        container.pagination(options);
    } catch (e) {
        console.log(e);
    }
}

function do_gl_load_top_Div(topDiv, paginationDiv) {
    var str1 = App.data.currentUrl;
    var str2 = topDiv;

    paginationDiv.find(".paginationjs-page.J-paginationjs-page").each(function () {
        $(this).on("click", function () {
            var urlToLaunch = str1.indexOf(str2) != -1 ? str1 : str1 + str2;
            window.open(urlToLaunch, '_self');
        });
    });
}

function do_bind_event_ellipsis(paginationDiv, container) {
    $("li.paginationjs-ellipsis").removeClass("disabled");
    $("li.paginationjs-ellipsis a").on("click", function () {
//		$(this).parent().find(".div_input_pagination").show();
        $(this).parent().find(".div_input_pagination").toggle();
    });
    $("li.paginationjs-ellipsis input").on('keypress', function (e) {
        if (e.which == 13) {
            var val = e.target.value;
            if (val) container.pagination("go", val);
        }
    });
    $(".div_input_pagination li").on("click", function () {
        var val = $(this).text();
        if (val) container.pagination("go", val);
    });
}