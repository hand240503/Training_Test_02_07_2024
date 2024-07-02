initApp = function(){
};

handleClickOutsideElt = function(e) {
	obj = $(e.target);
	//COMPANY-FILTER
	if(!obj.is(".company-filter") && !obj.parents('.company-filter').length) {
		$(".company-filter-on").removeClass("company-filter-on");
	}
	//ANY DATEPICKER
	if(!obj.parents("[class^='ui-datepicker']").length && !obj.is(".hasDatepicker")) {
		$(".hasDatepicker").datepicker("hide");
	}
};

window.onunload = function(e) {
	if(!/app\.html$/.test(e.target.documentURI) && C8O.LOGON != undefined) {
		sessionStorage["historyData"] = historyData;	
		sessionStorage["pageHistory"] = pageHistory;
		sessionStorage["DATEVOL"] = C8O.DATEVOL;
		sessionStorage["CODESITE"] = C8O.CODESITE;
		sessionStorage["COMPAGNIE"] = C8O.COMPAGNIE;
		sessionStorage["ENVIRONMENT"] = C8O.ENVIRONMENT;
		sessionStorage["FLIGHTID"] = C8O.FLIGHTID;
		sessionStorage["NOVOL"] = C8O.NOVOL;
		sessionStorage["CODECLI"] = C8O.CODECLI;
		sessionStorage["CODEESC"] = C8O.CODEESC;
		sessionStorage["ESC_LIBESC"] = C8O.ESC_LIBESC;
		sessionStorage["HEUREDEP"] = C8O.HEUREDEP;
		sessionStorage["PDT_VERSION"] = C8O.PDT_VERSION;
		sessionStorage["CODEPDT"] = C8O.CODEPDT;
		sessionStorage["CODEVAP"] = C8O.CODEVAP;
		sessionStorage["VPHYSAP"] = C8O.VPHYSAP;
		sessionStorage["LIBVAP"] = C8O.LIBVAP;
		sessionStorage["LOGON"] = C8O.LOGON;	
		sessionStorage["CODEGAL"] = C8O.CODEGAL;
	}
}

window.onload = function(e) {
	console.log("loading");
	//TODO TMP BLACKLIST OF PAGES TO AVOID REFRESH UN HISTORY NAVIGATION
	var tmpPages = ["mainPrestas","listPrestas","dispatch"];
	/*if(tmpPages.indexOf($.mobile.activePage.attr('id')) != -1){
		return;
	}*/
	if(!/app\.html$/.test(e.target.documentURI)) {
		C8O.LOGON = sessionStorage["LOGON"];
		if(C8O.LOGON == "false" || C8O.LOGON == undefined) {
			location.replace('app.html');
		} else {
			pageHistory = sessionStorage["pageHistory"].split(",");
			HistoryData = new Array();
			var historyData_str = sessionStorage["historyData"].split(",");
			
			for(var j = 0; j< historyData_str.length; j++) {
				historyData_str[j] = historyData_str[j]==""?undefined:historyData_str[j];
			}
			var paramNumber = historyData_str.length / pageHistory.length;
			while(historyData_str.length > 0) {
				historyData.push(historyData_str.splice(0, paramNumber));
			}

			C8O.DATEVOL = sessionStorage["DATEVOL"];
			C8O.CODESITE = sessionStorage["CODESITE"];
			C8O.COMPAGNIE = sessionStorage["COMPAGNIE"];
			C8O.ENVIRONMENT= sessionStorage["ENVIRONMENT"];
			C8O.NOVOL = sessionStorage["NOVOL"];
			C8O.CODECLI = sessionStorage["CODECLI"];
			C8O.FLIGHTID = sessionStorage["FLIGHTID"];
			C8O.CODEESC = sessionStorage["CODEESC"];
			C8O.ESC_LIBESC = sessionStorage["ESC_LIBESC"];
			C8O.HEUREDEP = sessionStorage["HEUREDEP"];
			C8O.PDT_VERSION = sessionStorage["PDT_VERSION"];
			C8O.CODEPDT = sessionStorage["CODEPDT"];
			C8O.CODEVAP = sessionStorage["CODEVAP"];
			C8O.VPHYSAP = sessionStorage["VPHYSAP"];
			C8O.LIBVAP = sessionStorage["LIBVAP"];
			C8O.CODEGAL = sessionStorage["CODEGAL"];

			var prevPage = pageHistory.length - 1;
			if(pageHistory[prevPage] == "CON_Connexion")
				callPreviousSequence("CHV_ObtenirListeVols", historyData[prevPage]);			
			else
				callPreviousSequence(pageHistory[prevPage], historyData[prevPage]);
		}
	}
}

updateDocumentLabel = function(deleteAttributes){
	$(".ui-page-active *[data-i18n]").each(function() {
		var obj = $(this);
		$(this).animate({opacity:0},100,function() {
			var key = obj.attr("data-i18n");
			if(key=="") {
				if(obj.is("[data-i18n-ph]")) {
					obj.attr('placeholder',$.i18n(obj.attr('data-i18n-ph')));
				}
				if(obj.is("[data-i18n-value]")) {
					obj.attr('value',$.i18n(obj.attr('data-i18n-value')));
				}
			} else {
				obj.html($.i18n(key));
			}
//			if($(this).attr("type") == "submit") {
//				$(this).attr('value', $.i18n(key));
//			}
			obj.animate({opacity:1},300);
//			if(deleteAttributes && (key != $.i18n(key))) {
//				obj.removeAttr("data-i18n");
//			}
		});
	});
}

function switchLanguage(language){
	if(!language) {
		if(sessionStorage && sessionStorage["language"]) {
			language = sessionStorage["language"];
		} else {
			language = 'fr';
		}
	}
	$.i18n({ locale: language });
	$.i18n().load( 'js/jq-i18n/_' + $.i18n().locale + '.json', $.i18n().locale );
	sessionStorage["language"] = language;
	setTimeout(function(){
		updateDocumentLabel(window.location.pathname.indexOf("app.html")!=-1?false:true);
	},100);
	
	C8O.init_vars.i18n = language;

}

handleFlipCard = function(width,height) {
	console.log("IN :: handleFlipCard - ");
	if(height) $(".flip-card").css("height",height);
	if(width) $(".flip-card").css("width",width);
	$(".flip-card").find(".card-container").each(function(){
		$(this).css({"width":$(this).parent(".relative-reset").css("width"),"height":$(this).parent(".relative-reset").css("height")});
	});
	$(".flip-card").unbind("click");
	$(".flip-card").bind("click",function(){
		var obj = $(this);
		obj.toggleClass("active");
	});
};

$(document).ready(function() {
	initApp();
	$(document).unbind("click",handleClickOutsideElt);
	$(document).bind("click",handleClickOutsideElt);
});

