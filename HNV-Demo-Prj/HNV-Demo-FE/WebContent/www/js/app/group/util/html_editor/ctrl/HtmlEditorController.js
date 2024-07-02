define([
	'jquery', 
	'text!group/util/html_editor/tmpl/HtmlEditor_Main.html'
	],

	function($, 
			HtmlEditor_Main
	) {


	var HtmlEditorController     = function () {

		var pr_divBtnDiscard		= "#btn_Discard";
		var pr_divBtnDraft			= "#btn_Draft";
		var pr_divBtnSend			= "#btn_Send";
		
		var self 					= this;
		var tmplName				= App.template.names;
		var tmplCtrl				= App.template.controller;
		
		//--------------------Init--------------------------------------//
		tmplName.COMMON_HTMLEDITOR 	= "HtmlEditor_Main";
		tmplCtrl.do_lc_put_tmpl(tmplName.COMMON_HTMLEDITOR		, HtmlEditor_Main);
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init = function() {
			
		}   
		
		this.var_lc_MODE_INIT 		= 0;
		this.var_lc_MODE_NEW 		= 1; //duplicate is the mode new after clone object
		this.var_lc_MODE_MOD 		= 2;
		this.var_lc_MODE_DEL 		= 3;	
		this.var_lc_MODE_SEL 		= 5;
		this.var_lc_MODE_MOD_TRANSL	= 10;
		
		this.do_lc_show		= function(obj, divDest, functName, mode, withSummernote, withMathSymbole){
			if (!mode) mode = this.var_lc_MODE_MOD;
			if (mode==this.var_lc_MODE_MOD_TRANSL)mode = this.var_lc_MODE_MOD;
			obj.mode = mode;
			
			App.MsgboxController.do_lc_show({
				content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.COMMON_HTMLEDITOR, obj),
				buttons		: "none",
				autoclose	: false,
				css			: [
					{attr: "width"		, val: "80%"},
					{attr: "height"		, val: "80%"},
					{attr: "max-width"	, val: "80%!important"},
				],
				
				bindEvent	: function() {
					//Add text editor
					if (withSummernote){
						if (App.SummerNoteController){
							if (withMathSymbole){
								App.SummerNoteController.do_lc_show_withMathSymbole("#frm_HtmlEditor_Compose", {height : 300});
								MathJaxPreview.Init("txt_HtmlEditor", "divMathPreview");
//								MathJax.Hub.Queue(["Update", MathJaxPreview]);
							} else{
								App.SummerNoteController.do_lc_show("#frm_HtmlEditor_Compose", {height : 300});
							}
							return;
						}
						
					}
					//by defeault
					$("#txt_HtmlEditor").wysihtml5();
					
				}
			}); 	    

			doBindingButton(obj, divDest, functName);
		};
	
		
		this.do_lc_bindingEvent = function(ele, dataDestina, dataFunct, mode, withSummernote, withMathSymbole){
			if (!mode) mode = this.var_lc_MODE_MOD;
			if (mode==this.var_lc_MODE_MOD_TRANSL)mode = this.var_lc_MODE_MOD;
			
			if (!dataDestina) 	dataDestina = "dest";
			if (!dataFunct) 	dataFunct 	= "funct";
			$(ele).off("click");
			$(ele).click(function(){
				var div 		= $(this).data(dataDestina);
				var functName 	= $(this).data(dataFunct);
				var obj			= {};
				
				if (functName == "val")
					obj.body = $(div).val();
				else if (functName == "text")
					obj.body = $(div).text();
				else if (functName == "html")
					obj.body = $(div).html();
				else
					obj.body = $(div).html();
				
				obj.mode = mode;
				self.do_lc_show(obj, div, functName, mode, withSummernote, withMathSymbole);
			});	
		}
		//--------------------------------------------------------------------------------------------------
//		var textToPlace =[
//			{'v':'&nbsp;&nbsp;'		, 'r':'&nbsp;'	},
//			{'v':'&nbsp; &nbsp;'	, 'r':'&nbsp;'	},
//			{'v':'<i> '				, 'r':' <i>'	},
//			{'v':'<b> '				, 'r':' <b>'	},
//			{'v':' </i>'			, 'r':'</i> '	},
//			{'v':' </b>'			, 'r':'</b> '	},
//			];
		
		var textToPlace =[
			{'v':'emsp;'			, 'r':' '	},
			{'v':'ensp;'			, 'r':' '	}, 
			
			{'v':'&nbsp;&nbsp;'		, 'r':'&nbsp;'	},
			{'v':'&nbsp; &nbsp;'	, 'r':'&nbsp;'	},
			
			{'v':'	 '				, 'r':' '		},
			
			{'v':'      '			, 'r':' '		},
			{'v':'     '			, 'r':' '		},
			{'v':'    '				, 'r':' '		},
			{'v':'   '				, 'r':' '		},
			{'v':'  '				, 'r':' '		},
			
			{'v':'<i> '				, 'r':'<i>'		},
			{'v':' </i>'			, 'r':'</i>'	},
			
			{'v':'<b> '				, 'r':'<b>'		},
			{'v':' </b>'			, 'r':'</b>'	},
			
			{'v':'<u> '				, 'r':'<u>'		},
			{'v':' </u>'			, 'r':'</u>'	},

			{'v':'<p> '				, 'r':'<p>'		},
			{'v':' </p>'			, 'r':'</p>'	},
			
			{'v':'&amp;'			, 'r':'&'		},
			
			];
		
		function formatText(str){
			for (var t in textToPlace){
				var val = textToPlace[t].v;
				var rep = textToPlace[t].r;
				while (str.indexOf(val)>=0){
					str = str.replace(val, rep);
				}
			}
			
			return str.trim();
		}
		function doBindingButton(obj, divDest, functName ) {
			//-------------------------------------------------------------------
			$(pr_divBtnDiscard).off("click");
			$(pr_divBtnDiscard).on("click", function () {	
				App.MsgboxController.do_lc_show({
					subBox	: true,
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("msg_message_discard_confirm"	),
					buttons	: {
						OK: {
							label		: $.i18n("common_btn_ok"),
							cssClass	: "btn-primary",
							action		: function(dialogRef){
								//DO SOMETHING
								App.MsgboxController.do_lc_close();
								if (dialogRef) dialogRef.do_lc_close();
							}					
						},
						NO: {
							label		:  $.i18n("common_btn_cancel"),
							action	: function(){
								App.MsgboxController.do_lc_close();
								if (dialogRef) dialogRef.do_lc_close();
							}
						}
					}
				});
			});

			//-------------------------------------------------------------------
			$(pr_divBtnSend).off("click");
			$(pr_divBtnSend).on("click", function () {	
				App.MsgboxController.do_lc_show({
					subBox	: true,
					title	: $.i18n("msgbox_confirm_title"),
					content : $.i18n("msg_message_get_confirm"	),
					buttons	: {
						OK: {
							label		: $.i18n("common_btn_ok"),
							cssClass	: "btn-primary",
							action		: function(dialogRef){
								//DO SOMETHING
								var data 				= req_gl_data({
									dataZoneDom		: $("#frm_HtmlEditor_Compose")
								});
								
								data.data.body = formatText(data.data.body);
								
								App.MsgboxController.do_lc_close();
								if (dialogRef)  dialogRef.do_lc_close();
								
								if (functName == "val")
									$(divDest).val(data.data.body);
								else if (functName == "text")
									$(divDest).text(data.data.body);
								else if (functName == "html")
									$(divDest).html(data.data.body);
								else
									$(divDest).html(data.data.body);
							}					
						},
						NO: {
							label		:  $.i18n("common_btn_cancel"),
							action	: function(dialogRef){
//								if (dialogRef) dialogRef.do_lc_close();
							}
						}
					}
				});
			});
		}
	};


	return HtmlEditorController;
});