define(['require',
        'jquery',
        
        'text!group/cms/tmpl/qr_code/Qr_Code_Main.html',
        'text!group/cms/tmpl/qr_code/Qr_Code_Popup.html'
        ],
        function(require, $,         		
        		Qr_Code_Main,
        		Qr_Code_Popup
        ) {
	
	var QrCodeMain = function () {
		
//		var pr_divHeader 			= header;
//		var pr_divContent 			= content;
//		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var tmplName				= App.template.names;
		var tmplCtrl				= App.template.controller;
		
		var svClass 				= App['const'].SV_CLASS;
		var svName					= App['const'].SV_NAME;
		var sessId					= App['const'].SESS_ID;
		var userId          		= App['const'].USER_ID;

		var fVar					= App['const'].FUNCT_SCOPE;
		var fName					= App['const'].FUNCT_NAME;
		var fParam					= App['const'].FUNCT_PARAM;		

		var self 					= this;
		
		
		//------------------------------------------------------------------------------------
	
		
		//------------------------------------------------------------------------------------
		
		
		//------------------------------------------------------------------------------------
		this.do_lc_init		= function() {
			
			
			if (!App.controller.QrCode.Main	)	
				App.controller.QrCode.Main 		= self;
			
			tmplName.QRCODE_MAIN							= "Qr_Code_Main";	
			tmplCtrl.do_lc_put_tmpl(tmplName.QRCODE_MAIN	, Qr_Code_Main);
			
			tmplName.QRCODE_POPUP							= "Qr_Code_Popup";
			tmplCtrl.do_lc_put_tmpl(tmplName.QRCODE_POPUP	, Qr_Code_Popup);
			
		}
		
		this.do_lc_show = function(){
			try {
				
				$(App.constHTML.id.MAIN_VIEW).append(tmplCtrl.req_lc_compile_tmpl(tmplName.QRCODE_MAIN, {}));
	
				$("#btn_qrCode").off('click');
				$("#btn_qrCode").click( function() {	
					App.MsgboxController.do_lc_show({
						title	: $.i18n("qr_code_title"),
						content : tmplCtrl.req_lc_compile_tmpl(tmplName.QRCODE_POPUP, {}),
						width: can_gl_MobileOrTablet() ? "100%" : "35%",
						buttons	: {
							NO: {
								lab		:  $.i18n("common_btn_cancel")								
							}
						}
					});
					var scanner = new jsQRScan({
						'id': 'readQRCode',
						'width': 250,
						'height': 250,
						'callbackSuccess': do_callback_get_qrcode_ok,
						'callbackEnd': do_callback_get_qrcode_no,
						'scanInterval': 1000
					});
					$("#readQRCode").find("canvas").hide();	// hide 1 screen
				});
			} catch(e) {
				do_gl_show_Notify_Msg_Error("CONTACT_MAIN: " + e.toString());
			}
		}
		var do_callback_get_qrcode_ok = function(codeEmp){
//			$("#test").html(codeEmp);
			window.open(codeEmp, "_blank")
		}
		var do_callback_get_qrcode_no = function(){
			$("#displayMessage").html($.i18n("qr_code_not_found"));
		}
		
		
		
	};
	return QrCodeMain;
});