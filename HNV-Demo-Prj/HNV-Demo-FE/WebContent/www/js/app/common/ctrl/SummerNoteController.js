define([
	'text!common/tmpl/CMS_SummerNote.html',
	'text!common/tmpl/CMS_SummerNote_List.html',
	'text!common/tmpl/CMS_SummerNote_Math.html',
	],
	function(
			CMS_SummerNote, 
			CMS_SummerNote_List,
			CMS_SummerNote_Math
	) {

	var SummerNoteController 	= function () {
		const tmplName			= App.template.names;
		const tmplCtrl			= App.template.controller;

		var self 				= this;
		var pr_searchKey		= "";
		var pr_div              = "";
		
		var pr_math_numBut		= 50;

		this.do_lc_show_unique = function(inp, options = {}) {
			let defaultOptions = {
					height		: 400,
					minHeight	: null,
					maxHeight	: null,
					focus		: true, 
					dialogsInBody: true,
					callbacks: {
						onImageUpload: function(files) {
							(files && files.length) && do_lc_up_file(this, files,1,1);	
						},
						onImageLinkInsert: function(url) {
							$img = $('<img>').attr({ src: url })
							$(this).summernote('insertNode', $img[0]);
						},
						onFileUpload: function(files) {
							(files && files.length) && do_lc_up_file(this, files, 1, 20);
				        },
					},
					toolbar: [
						['style', ['style']],
						['font', ['bold', 'underline', 'clear']],
						['fontname', ['fontname']],
						['color', ['color']],
						['para', ['ul', 'ol', 'paragraph']],
						['table', ['table']],
						['insert', ['link', 'picture', 'video', 'file', 'existBtn']],
						['view', ['fullscreen', 'codeview', 'help']],
						],
						buttons: {
							existBtn: buttonExistImageCustom
						}
			}

			if(options){
				options = Object.assign(options, defaultOptions);
			}

			$(inp).summernote(options);
		};

		this.do_lc_show = function(div, options = {}, modSimple = false) {
			pr_div  = div;
			let symbole = [
				['style', ['style']],
				['font', ['bold', 'underline', 'clear']],
				['fontsize', ['fontsize']],
				['fontname', ['fontname']],
				['color', ['color']],
				['para', ['ul', 'ol', 'paragraph']],
				['table', ['table']],
				['insert', ['link', 'picture', 'video', 'file',  'hello', 'emoji']],
				['view', ['fullscreen', 'codeview', 'help']],
				['height', ['height']],
				
				['more', ['more']],
				['hide', ['hide']]
				];
			
			let defaultOptions = {
					height		: 180,
					minHeight	: null,
					maxHeight	: null,
					focus		: true, 
					dialogsInBody: true,
					callbacks: {
						onImageUpload: function(files) {
							(files && files.length) && do_lc_up_file(this, files,1,1);	
						},
						onImageLinkInsert: function(url) {
							$img = $('<img>').attr({ src: url })
							$(this).summernote('insertNode', $img[0]);
						},
						onFileUpload: function(files) {
							(files && files.length) && do_lc_up_file(this, files,1,20);
				        },
					},
					toolbar: symbole,
					buttons: {
						hello		: buttonExistImageCustom,
						more 		: buttonShowFull,
						hide 		: buttonShowSimple,
					},
					lang: App.language,
					lineHeights: ['0.2', '0.3', '0.4', '0.5', '0.6', '0.8', '1.0', '1.2', '1.4', '1.5', '2.0', '3.0']
			}

			if(options){
				options = Object.assign(defaultOptions, options);
			}

			document.emojiSource = 'www/js/lib/prj/summernote/emoji/img';
			
			$(div).find("textarea").each(function(index){
				if (index==0)
					$(this).summernote(options);
//				$(this).summernote('lineHeight', 1.15);
			})
			
			if(modSimple){
				$(div).find(".note-style, .note-fontsize, .note-fontname, .note-table, .note-view, .note-height, .note-hide").hide();
			}else{
				$(div).find(".note-more, .note-hide").hide();
			}
		};
		
		this.do_lc_show_withMathSymbole = function(div, options = {}, modSimple = false) {
			pr_div  = div;
			let symbole = [
				['style', ['style']],
				['font', ['bold', 'underline', 'clear']],
				['fontsize', ['fontsize']],
				['fontname', ['fontname']],
				['color', ['color']],
				['para', ['ul', 'ol', 'paragraph']],
				['table', ['table']],
				['insert', ['link', 'picture', 'video' ,'file']], //'hello', 'emoji'
				['view', ['fullscreen', 'codeview', 'help']],
				['height', ['height']],
				
				['mathMore', ['mathMore']],
				
				['mathRefresh', ['mathRefresh']],
				
				['math1', ['math1']],
				['math2', ['math2']],
				['math3', ['math3']],
				
				
				['math10', ['math10', 'math11', 'math12', 'math13', 'math14', 'math15', 'math16', 'math17' ]],

				['math20', ['math20']],
				['math21', ['math21']],
				['math22', ['math22']],
				['math23', ['math23']],
				
				['math30', ['math30', 'math31', 'math32', 'math33']],
			
				['math40', ['math40', 'math41', 'math42']],
				
				['mathLess', ['mathLess']],

				['more', ['more']],
				['hide', ['hide']]
				];
			
			let defaultOptions = {
					height		: 180,
					minHeight	: null,
					maxHeight	: null,
					focus		: true, 
					dialogsInBody: true,
					callbacks: {
						onImageUpload: function(files) {
							(files && files.length) && do_lc_up_file(this, files,1,1);	
						},
						onImageLinkInsert: function(url) {
							$img = $('<img>').attr({ src: url })
							$(this).summernote('insertNode', $img[0]);
						},
						onFileUpload: function(files) {
							(files && files.length) && do_lc_up_file(this, files,1,20);
				        },
					},
					toolbar: symbole,
					buttons: {
						//hello		: buttonExistImageCustom,
						more 		: buttonShowFull,
						hide 		: buttonShowSimple,
						
						mathMore 	: buttonMathMore,
						mathLess 	: buttonMathLess,
						mathRefresh : buttonMathRefresh,
						
						math1		: (context, div) => buttonMathCustomChild(context, div, "$ $"						, "math1.jpg"),
						math2		: (context, div) => buttonMathCustomChild(context, div, "$$ $$"						, "math2.jpg"),
						math3		: (context, div) => buttonMathCustomChild(context, div, "\\begin{gather*} f(x)\&=\&... \\\\ \& =\&... \\end{gather*}", "math3.jpg"),
						
						
						math10		: (context, div) => buttonMathCustomChild(context, div, "\\sum_{n=i}^{\\infty}"	, "math10.jpg"),
						math11		: (context, div) => buttonMathCustomChild(context, div, "\\prod_{i=a}^{b}"		, "math11.jpg"),
						math12		: (context, div) => buttonMathCustomChild(context, div, "\\lim_{x\\to\\infty}"	, "math12.jpg"),
						
						math13		: (context, div) => buttonMathCustomChild(context, div, "x^y"					, "math13.jpg"),
						math14		: (context, div) => buttonMathCustomChild(context, div, "x_y"					, "math14.jpg"),	
						math15		: (context, div) => buttonMathCustomChild(context, div, "{ x \\over y }"		, "math15.jpg"),
						math16		: (context, div) => buttonMathCustomChild(context, div, "\\sqrt{x}"				, "math16.jpg"),
						math17		: (context, div) => buttonMathCustomChild(context, div, "\\vec{v}"				, "math17.jpg"),
						
						math20		: (context, div) => buttonMathCustomChild(context, div, "\\int_{a}^{b}"			, "math20.jpg"),
						math21		: (context, div) => buttonMathCustomChild(context, div, "\\iint_{a}^{b}"		, "math21.jpg"),
						math22		: (context, div) => buttonMathCustomChild(context, div, "\\iiint_{a}^{b}"		, "math22.jpg"),
						math23		: (context, div) => buttonMathCustomChild(context, div, "\\oint_{a}^{b}"		, "math23.jpg"),
						
						math30		: (context, div) => buttonMathCustomChild(context, div, "\\ne"					, "math30.jpg"),
						math31		: (context, div) => buttonMathCustomChild(context, div, "\\pm"					, "math31.jpg"),
						math32		: (context, div) => buttonMathCustomChild(context, div, "\\infty"				, "math32.jpg"),
						math33		: (context, div) => buttonMathCustomChild(context, div, "\\,"					, "math33.jpg"),
						
						
						math40		: (context, div) => buttonMathCustomChild(context, div, "\\begin{matrix}1 \& 2 \\\\a \& b  \\end{matrix}"	, "math40.jpg"),
						math41		: (context, div) => buttonMathCustomChild(context, div, "\\begin{pmatrix}1 \& 2 \\\\a \& b \\end{pmatrix}"	, "math41.jpg"),
						math42		: (context, div) => buttonMathCustomChild(context, div, "\\begin{bmatrix}1 \& 2 \\\\a \& b \\end{bmatrix}"	, "math42.jpg"),
						
						  
						  
					},
					lang: App.language,
					lineHeights: ['0.2', '0.3', '0.4', '0.5', '0.6', '0.8', '1.0', '1.2', '1.4', '1.5', '2.0', '3.0']
			}

			if(options){
				options = Object.assign(defaultOptions, options);
			}

			document.emojiSource = 'www/js/lib/prj/summernote/emoji/img';
			
			$(div).find("textarea").each(function(index){
				if (index==0)
					$(this).summernote(options);
//				$(this).summernote('lineHeight', 1.15);
			})

			// Hide list math buttons
			do_lc_hide_math_btn(div, pr_math_numBut);
			
			if(modSimple){
				$(div).find(".note-style, .note-fontsize, .note-fontname, .note-table, .note-view, .note-height, .note-hide").hide();
			}else{
				$(div).find(".note-more, .note-hide").hide();
			}
			
			
		};

		const do_lc_hide_math_btn = function (div, n) {
			for (let i = 0; i < n; i++) {
				const str = ".note-math" + (i + 1);
				$(div).find(str).hide();
			}
			$(div).find(".note-mathMore").show();
			$(div).find(".note-mathLess").hide();
			$(div).find(".note-mathRefresh").hide();
			$("#divMathPreview").hide();
		}

		const do_lc_show_math_btn = function (div, n) {
			for (let i = 0; i < n; i++) {
				const str = ".note-math" + (i + 1);
				$(div).find(str).show();
			}
			$(div).find(".note-mathMore").hide();
			$(div).find(".note-mathLess").show();
			$(div).find(".note-mathRefresh").show();
			$("#divMathPreview").show();
		}

		const do_lc_load_view = function() {
			tmplName	.CMS_SUMMER_NOTE_LIST 	= "CMS_SummerNote_List";
			tmplName	.CMS_SUMMER_NOTE 		= "CMS_SummerNote";
			tmplName	.CMS_SUMMER_NOTE_MATH 	= "CMS_SummerNote_Math";
			tmplCtrl	.do_lc_put_tmpl(tmplName.CMS_SUMMER_NOTE_LIST	, CMS_SummerNote_List);
			tmplCtrl	.do_lc_put_tmpl(tmplName.CMS_SUMMER_NOTE		, CMS_SummerNote);
			tmplCtrl	.do_lc_put_tmpl(tmplName.CMS_SUMMER_NOTE_MATH	, CMS_SummerNote_Math);
		}

		const buttonExistImageCustom = function (context, div) {
			let ui = $.summernote.ui;

			let button = ui.button({
				contents	: '<i class="fa fa-plus"></i>',
				tooltip		: $.i18n("common_select_btn_toottip"),
				click		: function () {
					do_lc_load_view();

					App.MsgboxController.do_lc_show({
						title		: $.i18n("common_select_image_title"),
						content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.CMS_SUMMER_NOTE, {}),
						autoclose	: false,
						buttons		: {
							OK: {
								lab		: $.i18n("common_select_image"),
								funct	: do_lc_add_image,
								param	: [context],
								autoclose	: false,
								classBtn	: "btn-primary"
							},
							NO: {
								lab		:  $.i18n("common_btn_cancel"),
							}
						},
						bindEvent : function(){
							$("#btn_search_img_editor").off("keyup").on("keyup", function(){
								pr_searchKey	= $(this).val();
								do_gl_execute_debounce(do_lc_get_file_existe);
							})
						}
					});	
					do_lc_get_file_existe();
				}
			});

			return button.render();   // return button as jquery object
		}

		const buttonMathMore = function (context, div) {
			let ui = $.summernote.ui;

			let button = ui.button({
				contents	: '<b>f(...)</b>',
				tooltip		: $.i18n("common_select_btn_math"),
				click		: function () {
					do_lc_show_math_btn(pr_div, pr_math_numBut);
				}
			});

			return button.render();   // return button as jquery object
		}
		const buttonMathLess = function (context, div) {
			let ui = $.summernote.ui;

			let button = ui.button({
				contents	: '<i class="fa fa-angle-left"></i>',
				tooltip		: $.i18n("common_select_btn_math"),
				click		: function () {
					do_lc_hide_math_btn(pr_div, pr_math_numBut);
				}
			});

			return button.render();   // return button as jquery object
		}
		const buttonMathRefresh = function (context, div) {
			let ui = $.summernote.ui;

			let button = ui.button({
				contents	: '<i class="fa fa-refresh"></i>',
				click		: function () {					
					var txt = $(".note-editing-area").find(".note-editable").html();
					MathJaxPreview.Update(true, txt, true);
				}
			});

			return button.render();   // return button as jquery object
		}
		
		
		const buttonMathCustomChild = function (context, div, text, imgName) {
			let ui 		= $.summernote.ui;
			let imgSrc 	= "www/img/math/" + imgName;

			let button = ui.button({
				contents	: `<img src=${imgSrc} style="height:20px"/>`,
				click		: function () {
					$(pr_div).find("textarea").each(function(index){
						if (index==0){
							$(this).summernote('insertText', text);
							var txt = $(".note-editing-area").find(".note-editable").html();
							MathJaxPreview.Update(true, txt, true);
						}							
					})
				}
			});

			return button.render();   // return button as jquery object
		}
		
		const buttonShowFull = function () {
			let ui = $.summernote.ui;

			let button = ui.button({
				contents	: '<i class="fa fa-arrow-right"></i>',
				tooltip		: $.i18n("common_sel_all"),
				click		: function () {
					$(pr_div).find(".note-style, .note-fontsize, .note-fontname, .note-btn-group.note-table, .note-view, .note-height,  .note-hide").show();
					$(pr_div).find(".note-more").hide();
				}
			});

			return button.render();   // return button as jquery object
		}
		
		const buttonShowSimple = function () {
			let ui = $.summernote.ui;

			let button = ui.button({
				contents	: '<i class="fa fa-arrow-left"></i>',
				tooltip		: $.i18n("common_sel_all"),
				click		: function () {
					$(pr_div).find(".note-style, .note-fontsize, .note-fontname, .note-btn-group.note-table, .note-view, .note-height,  .note-hide").hide();
					$(pr_div).find(".note-more").show();
				}
			});

			return button.render();   // return button as jquery object
		}

		const do_lc_up_file = function(divSummernote, files, typ01, typ02){
			let ref = new FormData();
			ref.append('sv_class'	, 'ServiceTpyDocumentPubl');
			ref.append('sv_name'	, 'SVNew');
			ref.append('typ01'		, typ01?typ01:1);
			ref.append('typ02'		, typ02?typ02:20);
			for(let i in files){
				ref.append(`file${i}`, files[i]);
			}

			let fSucces 	= [];
			fSucces.push(req_gl_funct(null, do_lc_after_upload_file, [divSummernote, files]));

			let fError 	= req_gl_funct(null, do_lc_upload_error, [$.i18n("common_err_ajax") ]);
			App.network.do_lc_ajax_form(App.path.BASE_URL_API_PUBL, null, ref, 100000, fSucces, fError);
		}

		let listMimeImg 	= ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg'];
        let listMimeAudio 	= ['audio/mpeg', 'audio/ogg'];
        let listMimeVideo 	= ['video/mpeg', 'video/mp4', 'video/webm'];
        
		const do_lc_after_upload_file = function(sharedJson, divSummernote, files){
			if (isAjaxSuccess(sharedJson)) {
				let data = sharedJson[App['const'].RES_DATA];
				if(data && data.length){
	                for (var i in data){
	                	var elem 	= data[i];
	                	var file	= files[i];
	                		                	
	                	if (listMimeImg.indexOf(file.type) > -1) {
	                		let $img = document.createElement("IMG");
							$img.src = elem.path01;
							$(divSummernote).summernote('insertNode', $img);
		                } else if (listMimeAudio.indexOf(file.type) > -1) {
		                    //Audio
		                	let $aud = document.createElement("audio");
		                	$aud.src = elem.path01;
		                	$aud.setAttribute("controls", "controls");
		                	$aud.setAttribute("preload", "metadata");
		                	
		                	$(divSummernote).summernote('insertNode', $aud);
		                	
		                } else if (listMimeVideo.indexOf(file.type) > -1) {
		                    //Video
		                	let $vid = document.createElement("video");
		                	$vid.src = elem.path01;
		                	$vid.setAttribute("controls", "controls");
		                	$vid.setAttribute("preload", "metadata");
		                	
		                	$(divSummernote).summernote('insertNode', $vid);
		                	
		                } else {
		                    //Other file type
		                	let $a 			= document.createElement("a");
		                    let $linkText 	= document.createTextNode(elem.name);
		                    $a.appendChild(linkText);
		                    $a.title 		= file.name;
		                    $a.href 		= elem.path01;
		                    $(divSummernote).summernote('insertNode', $vid);
		                }
	                }
				}
			} else {
				do_gl_show_Notify_Msg_Error ($.i18n("common_err_ajax"));	
			}
		}

		const do_lc_get_file_existe = function(divSummernote){
			let ref 				= req_gl_Request_Content_Send_With_Params("ServiceTpyDocumentPubl", "SVGet", {searchKey: pr_searchKey});

			const callbackFunct 	= data => do_lc_show_list_ByAjax_Dyn(data, divSummernote);

			let opt 				= {
					divMain			: "#div_img_list",
					divPagination	: "#div_img_pagination",
					url_api 		: App.path.BASE_URL_API_PUBL, 
					url_header 		: null,
					url_api_param 	: ref,
					pageSize 		: 10,
					pageRange		: 1,
					callback		: callbackFunct
			};

			do_gl_init_pagination_opt(opt);
		}

		const do_lc_show_list_ByAjax_Dyn = function(sharedJson, divSummernote){
			let data = {};
			if (isAjaxSuccess(sharedJson)) {
				data = sharedJson[App['const'].RES_DATA];
			}
			$("#div_img_list")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.CMS_SUMMER_NOTE_LIST, data));
			do_lc_bind_event_msgbox();
		}

		const do_lc_bind_event_msgbox = function(){
			$(".item-doc").off("click").on("click", function() {
				let checkbox = $(this).find(".item-doc-check");
				checkbox.prop("checked", !checkbox.prop("checked"));
			})
		}

		const do_lc_add_image = function(divSummernote){
			let $imgSelects = $(".item-doc-check:checked");
			if($imgSelects && $imgSelects.length){
				for(let i = 0; i < $imgSelects.length; i++){
					let $img = document.createElement("IMG");
					$img.src = $($imgSelects[i]).data("src");
					divSummernote.$note.summernote('insertNode', $img);
				}
			}

			App.MsgboxController.close();
		}

		const do_lc_upload_error = (sharedJson, msg) => do_gl_show_Notify_Msg_Error (msg);

		this.do_lc_insert_image_base64 = function (pr_div, text) {				
			let $img = document.createElement("IMG");
			$img.src = text;
			$(pr_div).find("textarea").each(function(index){
				if (index==0)
					$(this).summernote('insertNode', $img);
			})
		}
	};

	return SummerNoteController;
});