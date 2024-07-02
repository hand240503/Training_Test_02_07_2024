//function req_gl_start_scanner(selector) {
//	let scanner = new Instascan.Scanner({ video: document.getElementById(selector), continuous: false });
//	
////	document.getElementsByTagName('video')[0].removeAttribute('autoplay');
//	
//	Instascan.Camera.getCameras().then(function (cameras) {
//		if (cameras.length > 0) {
//			scanner.start(cameras[0]);
//		} else {
//			console.error('No cameras found.');
//		}
//	}).catch(function (e) {
//		console.error(e);
//	});
//	
//	return scanner;
//}
//
//function do_gl_content_scanner(scanner, callback) {
//	try {
//		scanner.addListener('scan', function(content) {
//			callback(content);
//		});
//	} catch(e) {
//		console.error(e);
//	}
//}
//
//function req_gl_content_manually_scanner(scanner) {
//	let result = scanner.scan();
//	
//	return result!=null ? result.content : null;
//}
//
//function do_gl_stop_scanner(scanner) {
//	try {
//		scanner.stop();
//	} catch(e) {
//		console.error(e);
//	}
//}



function do_gl_start_scanner(selectorPreview, selectorCamera, callback) {
	//HTML video component for web camera
    var videoComponent = $("#" + selectorPreview);
    //HTML select component for cameras change
    var webcameraChanger = $("#" + selectorCamera);
    var options = {};
    //init options for scanner
    options = initVideoObjectOptions(selectorPreview);
    var cameraId = 0;

    initScanner(options);

    initAvaliableCameras(
        webcameraChanger,
        function () {
            cameraId = parseInt(getSelectedCamera(webcameraChanger));
        }
    );

    initCamera(cameraId);

//    var str = null;
    
    scanStart(function (data){
        callback(data); 
//        str = data;
    });
    
//    if(str != null && str != "") scanStop();
}

function do_gl_stop_scanner() {
	scanStop();
}


//////////////////////////////////////////////////////
//------------------------------------------------------------------------------------
/*        var doShowPopupUser = function() {
            App.msgBox.show({           
                title   : $.i18n("page_common_msgbox_head_confirm"),
                
                content : tmplCtrl.req_lc_compile_tmpl(tmplName.SCANNER_USER_POPUP, {}),
                
                buttons : {
                    CANCEL: {
                        lab : $.i18n("page_common_btn_cancel")
                    }
                },
        
//              autoclose: true,
                
                width       : "80vw",
                height      : "80vh",
                
                bindEvent: function() {
                    do_gl_start_scanner("webcameraPreview", "webcameraChanger", callbackResultScanner);
//                  var scanner = req_gl_start_scanner("preview");
                                
//                  if(scanner) {
//                      do_gl_content_scanner(scanner, callbackResult);
//                      do_gl_stop_scanner(scanner);
//                  }
                    
//                  $("#btn_scan").off("click");
//                  $("#btn_scan").on("click", function() {
//                      var result = req_gl_content_manually_scanner(scanner);
//                      callbackResultManually(scanner, result);
//                  });
                }
            });
        }
        
        function callbackResult(content) {
            if(content) {
                console.log(content);
                App.msgBox.close();
            }       
        }
        
        function callbackResultManually(scanner, content) {
            if(content) {
                alert(content);
                console.log(content);
                App.msgBox.close();
//              do_gl_stop_scanner(scanner);
            } else
                alert("Retry");
            
            
        }
        
        function callbackResultScanner(content) {
            if(content != null && content != "") {
                App.msgBox.close();
                alert(content);
            } else
                alert("Retry");         
        }
*/
