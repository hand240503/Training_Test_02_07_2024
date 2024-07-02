define([
		'jquery',
		'text!common/tmpl/CMS_File_URL.html',
		
		'common/ctrl/MsgboxController'
		],
	function(
			$, 
			TmplFileURL) {

	var FileURLController = function() {
		var imageExtension	= "jpg";
		var videoExtension	= "webm";
		
		
		if (!App.MsgboxController){
			var MsgboxController = require('common/MsgboxController');
			App.MsgboxController  = new MsgboxController();
		}
		
		var tmplName		= App.template.names;
		var tmplCtrl		= App.template.controller;

		var self = this;


	
		this.do_lc_init = function() {
			tmplCtrl.do_lc_put_tmpl(tmplName.CMS_FILE_URL				, TmplFileURL);
		}

		this.do_lc_show = function(fileinputObj) {
			self.do_lc_init();

			App.MsgboxController.do_lc_show({
				title		: "",
				content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.CMS_FILE_URL, {}),
				buttons		: "none",
				autoclose	: false,
				width		: "50%",
				height		: "30%",
				onClose		: function() {
					//something
				},
				bindEvent: function() {
					initFileURL(fileinputObj);
				}
			});
		}

		//--------------------------------------------------------------------------------
		function initFileURL(fileinputObj) {
			var btn01 = "#btn_upload";
			$(btn01).click(function() {uploadFile(fileinputObj);});
		}
		
		function isUrlValid(url) {
		    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
		}
			
		function uploadFile(fileinputObj) {
			try {
				var url = $("#txt_FileURL").val();
				
				if(url != "" || url != null || url != undefined) {
					if (isUrlValid(url)) {
						url		= decodeURIComponent(url).replace(/è/g,"e").replace(/é/g,"e").replace(/à/g,"a").replace(/ê/g,"e").replace(/î/g,"i").replace(/ô/g,"o").replace(/â/g,"a").replace(/ï/g,"i").replace(/ç/g,"c");
						
						do_gl_downloadViaAjaxCallback_CORS_Anywhere(elementBlobToFileInput, fileinputObj, url, null, null);
					
					} else {
						do_gl_show_Notify_Msg_Error($.i18n("file_url_link_not_supported"));
						return false;
						
					}
				}

			} catch (e) {
				console.log(e);
			}
			
//				fileinputObj.refresh();
			App.MsgboxController.do_lc_close();
		}
			
		//--------------------------------------------------------------------------------
		function elementBlobToFileInput(blob, type, fileinputObj) {
			//Remove drag & drop class style
			fileinputObj.$container.find('.file-drop-zone .' + fileinputObj.dropZoneTitleClass).remove();

//			if (typeof element.toBlob !== "undefined") {
//				element.toBlob(function(blob) {
//					blob.name = (new Date()).getTime() + "."+imageExtension;
//					fileinputObj.readFiles([blob]);
//				}, "image/jpeg", 0.75);
//
//			} else if (typeof element.msToBlob !== "undefined") {
//				var blob = element.msToBlob();
//				// send blob
//				blob.name = (new Date()).getTime() + "."+imageExtension;
//				fileinputObj.readFiles([blob]);
//			} else {	//video
//				var blob = element.bufferValue;
//				blob.name = (new Date()).getTime() + "."+videoExtension;
//				fileinputObj.readFiles([blob]);
//			}
			
			if (type.indexOf('image') > -1) {
				var extension = type.substr(type.indexOf("/") + 1);
				blob.name = (new Date()).getTime() + "."+ extension;
			} else {
				do_gl_show_Notify_Msg_Error($.i18n("file_url_format_not_supported"));
				return false;
				
			}

			fileinputObj.readFiles([blob]);
		}
		
		//--------------------------------------------------------------------------
		function do_gl_downloadViaAjaxCallback_CORS_Anywhere(callback, fileinputObj, url, header, params, timeOut, succes, error){
			var x = new XMLHttpRequest();
			x.open('GET', "https://cors-anywhere.herokuapp.com/" + url);
			x.responseType = 'blob';

			$("#div_Preloader").fadeIn(1000);

			x.onload = function() {	
				var blob = x.response;
//				var fr = new FileReader();
//				fr.onloadend = function() {
//				var dataUrl = fr.result;
//				// Paint image, as a proof of concept
//				var img = document.createElement('img');
//				img.src = dataUrl;
//				document.body.appendChild(img);
//				};
//				fr.readAsDataURL(blob);

				var type		= this.getResponseHeader('Content-Type');

				callback(blob, type, fileinputObj);

				$("#div_Preloader").fadeOut(1000);
			};
			x.send();
		}
		
		//--------------------------------------------------------------------------
//		function do_gl_downloadViaAjaxCallback_CORS_Anywhere(callback, fileinputObj, url, header, params, timeOut, succes, error){
//			var x = new XMLHttpRequest();
//			x.open('GET', "https://cors-anywhere.herokuapp.com/" + url);
//			x.responseType = 'blob';
//			
//			$("#div_Preloader").fadeIn(1000);
//			
//			x.onload = function() {	
//			    var blob = x.response;
////			    var fr = new FileReader();
////			    fr.onloadend = function() {
////			        var dataUrl = fr.result;
////			        // Paint image, as a proof of concept
////			        var img = document.createElement('img');
////			        img.src = dataUrl;
////			        document.body.appendChild(img);
////			    };
////			    fr.readAsDataURL(blob);
//			    
//			    var type		= this.getResponseHeader('Content-Type');
//
//				callback(blob, type, fileinputObj);
//				
//				$("#div_Preloader").fadeOut(1000);
//			};
//			x.send();
//		}

//		//--------------------------------------------------------------------------
//		// Create the XHR object.
//		function createCORSRequest(method, url) {
//			var xhr = new XMLHttpRequest();
//			if ("withCredentials" in xhr) {
//				// XHR for Chrome/Firefox/Opera/Safari.
//				xhr.open(method, url, true);
//			} else if (typeof XDomainRequest != "undefined") {
//				// XDomainRequest for IE.
//				xhr = new XDomainRequest();
//				xhr.open(method, url);
//			} else {
//				// CORS not supported.
//				xhr = null;
//			}
//			return xhr;
//		}
//		
//		function do_gl_downloadViaAjaxCallback_CORS(callback, fileinputObj, url, header, params, timeOut, succes, error){
//			var xhr = createCORSRequest('GET', url);
//			if (!xhr) {
//				alert('CORS not supported');
//				return;
//			}
//
//			xhr.onload = function(e) {	
//				if (this.status == 200) {
//
//					var type		= this.getResponseHeader('Content-Type');
//					var blob		= new Blob([this.response], {type:type});
//
//					callback(blob, type, fileinputObj);
//				}
//			};
//
//			xhr.setRequestHeader("Access-Control-Allow-Origin", true);
//			xhr.send(); //params
//
//		}
//		
//		//--------------------------------------------------------------------------
//		function do_gl_downloadViaAjaxCallback(callback, url, header, params, timeOut, succes, error){
//			params	= url.split("?")[1];
//			url		= url.split("?")[0];
//			var xhr = new XMLHttpRequest();
//			xhr.open('GET', url);
//			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
//			xhr.responseType	= 'arraybuffer';
//			xhr.timeout			= timeOut;
//			xhr.onload = function(e) {
//				if (this.status == 200) {
//					var filename = params.filename;
//					var disposition = xhr.getResponseHeader('Content-Disposition');
//					if (disposition && disposition.indexOf('attachment') !== -1 && !filename) {
//						var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
//						var matches = filenameRegex.exec(disposition);
//						if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
//					}
//					
//					var type		= this.getResponseHeader('Content-Type');
//					var blob		= new Blob([this.response], {type:type});
//
//					callback(blob, type, fileinputObj);
//				}
//			};
//			for(p in header){
//				xhr.setRequestHeader(p, header[p]);
//			}
//			xhr.send(params);
//		}
			
			
	}

	return FileURLController;

});