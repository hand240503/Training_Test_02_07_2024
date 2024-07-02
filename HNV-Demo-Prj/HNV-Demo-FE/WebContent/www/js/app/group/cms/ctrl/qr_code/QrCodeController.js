define(['require',
        'jquery',
        'pathparser',
        
        'group/cms/ctrl/qr_code/QrCodeMain',
        'group/cms/ctrl/qr_code/QRCodeEncode',
        'group/cms/ctrl/qr_code/QRCodeDecode'
        ],
        function (
        		require, $,
        		PathParser
        		
        ) {
	
	var QrCodeController = function () {
		var QrCodeMain		=  require('group/cms/ctrl/qr_code/QrCodeMain');
	
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

		var defaultLocation			= App['const'].LOCATION;
		var defaultLanguage			= App['const'].LANGUAGE;

		var self 					= this;	
		
		this.do_lc_init = function() {
//			//--------------------------------------------------------------------------------------------------
//			if (!ContactMain || !ContactPopup){	
//				setTimeout(function(param) {
//					window.location.reload();
//				},  200);					
//				return;
//			}
			//--------------------------------------------------------------------------------------------------
			
			if (!App.controller.QrCode)				
				App.controller.QrCode				= self;

			if (!App.controller.QrCode.Main)	
				this.Main = new QrCodeMain();
			
			//------------------------------------------------------------------------	
			this.ready	= true;
			this.router = new PathParser();			
		};
		
		this.do_lc_show	= function() {
			this.Main.do_lc_init();
			this.Main.do_lc_show();
		};
	}
	return QrCodeController;
});