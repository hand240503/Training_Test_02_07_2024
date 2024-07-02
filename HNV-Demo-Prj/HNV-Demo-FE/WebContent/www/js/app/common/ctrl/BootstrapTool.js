var do_gl_enhance_within = function (parentNode, options) {
	if (!parentNode) return;
	if (parentNode.length==0) return;
	
	try{
		do_gl_init_datetimePlugin(parentNode);
		do_gl_init_fileinputPlugin(parentNode, options);
		
		do_gl_apply_right(parentNode);
		
		do_gl_init_jqueryNumpadPlugin(parentNode);
		do_gl_init_touchKeyboardPlugin(parentNode, options);
		
		do_gl_init_box(parentNode);
		do_gl_init_show_box(parentNode, options);
		
		do_gl_init_tabActive();

		do_gl_init_jqueryUI(parentNode, options);

//		do_gl_init_selectPlugin(parentNode);
//		do_gl_init_datatable(parentNode, options);
//		do_gl_init_inputMaskPlugin(parentNode);

//		do_gl_init_affix(parentNode);

		//from UserRightTool

//		Handle jQuery plugin naming conflict between jQuery UI and Bootstrap
//		$.widget.bridge('uibutton', $.ui.button);
//		$.widget.bridge('uitooltip', $.ui.tooltip);
	}catch(e){
		console.log (e);
	}
}

//--------------------------------------------------------------------------------
var var_gl_tab_active	= null;

var do_gl_req_tab_active = function (parentNode){	
	var_gl_tab_active	= parentNode.find(".nav-tabs-custom li.active").not(".paginate_button").find("a").attr("href");	
}

var  do_gl_init_tabActive = function (){
	if(var_gl_tab_active != null){
		$(".nav-tabs").find('a[href="'+var_gl_tab_active+'"]').tab("show");	
		var_gl_tab_active = null;
	}
	
	$(".nav-tabs").find('li:not(.always-show)').on('click', function(e) {
		$(".nav-tabs").toggleClass("responsive");
		var_gl_tab_active = $(this).find("a").attr("href");
	});
	
	$(".nav-tabs").find('li.always-show').on('click', function(e) {
		if ($(".nav-tabs").hasClass('responsive'))
			$(".nav-tabs").toggleClass("responsive");
		var_gl_tab_active = $(this).find("a").attr("href");
	});
	
	$(".nav-tabs").find("#div_NavTabs_Responsive").off("click");
	$(".nav-tabs").find("#div_NavTabs_Responsive").on("click", function() {
		$(".nav-tabs").toggleClass("responsive");
	});
	
}


//--------------------------------------------------------------------------------
var do_gl_init_show_box = function (parentNode, options){
	if(options){
		if(options.div){
			if(App.data.page && App.data.page[options.div] && App.data.page[options.div] == 1){
				App.data.page[options.div] = 0;
				return;
			}
		}
	}
	if(parentNode.hasClass("box-not-show")){
		$(parentNode).addClass("collapsed-box");
//		$(parentNode).find(".box-body").css("display", "none");
//		$(parentNode).find(".box-footer").css("display", "none");
	};
}

//--------------------------------------------------------------------------------
//Box widget
var do_gl_init_affix = function(parentNode) {
	var children = parentNode.find(".custom-affix");

	if(children.length>0) {	
		children.each(function(){
			var off	= $(this).attr("custom-affix-offset");
			var value 	= $(this).attr("custom-affix-value");

			var option = {
					offset : {
					}
			}

			if(off == 1)		option.offset.top 		= value;
			else if(off == 2)	option.offset.bottom 	= value;

			$(this).affix(option);
		});
	}
}

//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//Box widget
var do_gl_init_box = function(parentNode) {
	var children = parentNode.find(".btn-minimize");

	if(children.length>0) {	
		children.each(function(){
			$(this).off('click');
			$(this).click(function(e){
//				$(this).toggleBox();
			});
		});
	}
}

//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//Datatable
var do_gl_init_datatable = function(parentNode, options) {
	var lang = localStorage.language;
	if (lang ==null ) lang = "en";

	var filename = "datatable_"+lang+".json";
	var children = parentNode.find(".table-datatable");

	if(children.length>0) {	
		children.each(function(){
			var defaultOption = {
//					sDom			: "<'row-fluid'<'span4'l><'span8'f>r>t<'row-fluid'<'span12'i><'span12 noMarginLeft'p>>",
//					sPaginationType	: "bootstrap",

					oLanguage		: {
						sUrl	: "www/js/lib/datatables/"+ filename
					},	

//					oClasses		:{
//					sFilterInput :  "inputClass",
//					sLengthSelect : "selectClass",
//					},
					"paging": true,
					"lengthChange": true,
					"searching": true,
					"ordering": true,
					"info": true,
					"autoWidth": true
			};

			var customOption = $.extend(true, {}, defaultOption);

			if(options && options.datatable) {
				$.extend(true, customOption, options.datatable);
			}

			var extraCustomOption = $(this).data("option");
			if(extraCustomOption) {
				$.extend(true, customOption, extraCustomOption);
			}

//			$(this).DataTable(customOption);

//			try{
//			table.columnFilter({
//			//sPlaceHolder	: "head:before"
//			sPlaceHolder	: "head:after"
//			});
//			$(this).find('thead input').each( function () {
//			$(this).attr('style','width: 80% !important');	
//			} );
//			$(this).find('tfoot input').each( function () {
//			$(this).attr('style','width: 80% !important');
//			} );
//			$(this).find('tbody input').each( function () {
//			$(this).attr('style','width: 80% !important');
//			} );	



//			}catch(e){
//			console.log(e);
//			}

		});	
	}

//	var child = parentNode.find(".dataTables_scrollHeadInner");
//	child.each(function(){
//		$(this).css("width", "100%")
//	})
}

//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//jqueryUI
function do_gl_init_jqueryUI(parentNode, options) {

	var customOptions = {};
	if(options && options.jqueryUI) {
		customOptions.jqueryUI = options.jqueryUI;
	} else {
		customOptions.jqueryUI = {};
	}

	var connectedSortableClass = customOptions.jqueryUI;
	var children = parentNode.parent().find(connectedSortableClass);

	if(children.length>0) {	
		children.each(function(){
			$(this).sortable({
				placeholder: "sort-highlight",
				connectWith: connectedSortableClass,
				handle: ".box-header, .nav-tabs",
				forcePlaceholderSize: true,
				zIndex: 999999,
				cursor: 'move',
				revert: true,
				stop: function() {
					//do something
				}

			});

			$(this).draggable({
				over: function() { 
					//do something
				},
				out: function() { 
					//do something
				}
			});

			$(this).droppable({
				over: function() { 
					//do something
				},
				out: function() { 
					//do something
				},
				accept: "div"
			});

			subChildren = $(this).find(".box-header, .nav-tabs"); //nav-tabs-custom
			subChildren.each(function(){
				$(this).css("cursor", "move");
			});

		});
	}
}

//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//Datetime Plugin : datepicker, daterangepicker, timepicker
function do_gl_init_datetimePlugin(parentNode) {
	//Date range picker
	var children01 = parentNode.find(".daterangepicker");

	if(children01.length>0) {	
		children01.each(function(){
//			$(this).daterangepicker();

			$(this).daterangepicker({
				timePicker: true, 
				timePickerIncrement: 30, 
				format: 'MM/DD/YYYY h:mm A'
			});

//			$(this).daterangepicker(
//			{
//			ranges: {
//			'Today': [moment(), moment()],
//			'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
//			'Last 7 Days': [moment().subtract(6, 'days'), moment()],
//			'Last 30 Days': [moment().subtract(29, 'days'), moment()],
//			'This Month': [moment().startOf('month'), moment().endOf('month')],
//			'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
//			},
//			startDate: moment().subtract(29, 'days'),
//			endDate: moment()
//			},
//			function (start, end) {
//			$('#daterange-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
//			}
//			);
		});
	}

	///////////////////////////////////////////////////
	//Date picker
	var children02 = parentNode.find(".datepicker");

	if(children02.length>0) {	
		children02.each(function(){
			var dateP = $(this).datepicker({
				autoclose: true,
				language: App.language,
				enableOnReadonly: false,
				immediateUpdates: true
			});

			var compare = $(this).attr("data-compare");
			if(compare) {
				var compareParts = compare.split(' ');
//				if(compareParts.length == 2) {
//				if(compareParts[0] == "before") {
//				var targetDate = $(compareParts[1]).val();
//				dateP.datepicker('setEndDate', targetDate);
//				dateP.on("changeDate", function(selected) {
//				startDate = new Date(selected.date.valueOf());
//				startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
//				$(compareParts[1]).datepicker('setStartDate', startDate);
//				});
//				} else if(compareParts[0] == "after") {
//				var targetDate = $(compareParts[1]).val();
//				dateP.datepicker('setStartDate', targetDate);
//				dateP.on("changeDate", function(selected) {
//				startDate = new Date(selected.date.valueOf());
//				startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
//				$(compareParts[1]).datepicker('setEndDate', startDate);
//				});
//				}
//				}
				var minDate = null;
				var maxDate = null;
				$(this).off("click");
				$(this).on("click", function() {
					if(compareParts.length == 2) {
						if(compareParts[0] == "lt") {
							maxDate = $(compareParts[1]).val();
						} else if(compareParts[0] == "gt") {
							minDate = $(compareParts[1]).val();
						}
					}else if(compareParts.length == 3){
						minDate = $(compareParts[1]).val();
						maxDate = $(compareParts[2]).val();
					}
					do_gl_set_range_datepicker($(this), minDate, maxDate);
				});
			}

		});
	}

	///////////////////////////////////////////////////
	//Timepicker
	var children03 = parentNode.find(".timepicker");

	if(children03.length>0) {	
		children03.each(function(){
			$(this).timepicker({
				showInputs: false
			});
		});
	}
	
	///////////////////////////////////////////////////
	//Datetimepicker step 30 minutes
	var children05 = parentNode.find(".datetimepicker.step-30");

	if(children05.length>0) {	
		children05.each(function(){
			$(this).datetimepicker({
                locale: App.language,
                collapse: true,
                showClose: true,
				stepping: 30
            });
		});
	}

	//Datetimepicker
	var children04 = parentNode.find(".datetimepicker");

	if(children04.length>0) {	
		children04.each(function(){
			$(this).datetimepicker({
                locale: App.language,
                collapse: true,
                showClose: true,
            });
		});
	}
}

function do_gl_set_range_datepicker(ele, minDate, maxDate){
	ele.datepicker('remove');
	if(minDate == null) minDate = "";
	if(maxDate == null) maxDate = "";
	minDate = do_lc_get_Date(ele, minDate);
	if (!minDate) minDate = "2010-01-01"; 
	maxDate = do_lc_get_Date(ele, maxDate);
	if (!maxDate) maxDate = "3010-01-01";
	
	ele.datepicker({
		autoclose: true,
		language: App.language,
		startDate : new Date(minDate),
		endDate : new Date(maxDate)
	});
	ele.datepicker('show');
}

//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//Select Plugin
function do_gl_init_selectPlugin(parentNode) {
	var children = parentNode.find(".selectChosen");

	if(children.length>0) {	
		children.each(function(){
			$(this).select2();
		});
	}
}


//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//InputMask Plugin
function do_gl_init_inputMaskPlugin(parentNode) {
	var children = parentNode.find("[data-mask]");

	if(children.length>0) {	
		children.each(function(){
			//Datemask dd/mm/yyyy
//			$(this).inputmask("dd/mm/yyyy", {"placeholder": "dd/mm/yyyy"});

			//General
			$(this).inputmask();
		});
	}

}


//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//Bootstrap Fileinput Plugin
function do_gl_init_fileinputPlugin(parentNode, options) {
	var children = parentNode.find(".fileinput");

	var fileinputOption = undefined;
	var obj				= undefined;

	if(options) {
		fileinputOption = options.fileinput;
		obj				= options.obj;
	}

	if(children.length>0) {	
		children.each(function(){
			var fileInput = new FileInput(this,fileinputOption, obj);
		});
	}

}

//--------------------------------Elemetal functions------------------------------------------------
function do_gl_datepicker_plugin(element, th, options) {
	var dateP = element.datepicker({
		autoclose: true,
		language: App.language
	});
//	var compare = element.attr("data-compare");
	var compare = th.attr("data-compare");
	if(compare) {
		var compareParts = compare.split(' ');
//		if(compareParts.length == 2) {
//		if(compareParts[0] == "before") {
//		var targetDate = $(compareParts[1]).val();
//		dateP.datepicker('setEndDate', targetDate);
//		dateP.on("changeDate", function(selected) {
//		startDate = new Date(selected.date.valueOf());
//		startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
//		$(compareParts[1]).datepicker('setStartDate', startDate);
//		});
//		} else if(compareParts[0] == "after") {
//		var targetDate = $(compareParts[1]).val();
//		dateP.datepicker('setStartDate', targetDate);
//		dateP.on("changeDate", function(selected) {
//		startDate = new Date(selected.date.valueOf());
//		startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
//		$(compareParts[1]).datepicker('setEndDate', startDate);
//		});
//		}
		var minDate = null;
		var maxDate = null;
		element.off("click");
		element.on("click", function() {
			if(element.attr("contenteditable")){
				if(compareParts.length == 2) {
					if($(compareParts[1]).length > 0){
						if(compareParts[0] == "lt") {
							maxDate = $(compareParts[1]).val();
						} else if(compareParts[0] == "gt") {
							minDate = $(compareParts[1]).val();
						}
					}else if(element.parent().find("."+compareParts[1]).length > 0){
						if(compareParts[0] == "lt") {
							maxDate = element.parent().find("."+compareParts[1]).html();
						} else if(compareParts[0] == "gt") {
							minDate = element.parent().find("."+compareParts[1]).html();
						}
					}
					
				}else if(compareParts.length == 3){
					if($(compareParts[1]).length > 0){
						minDate = $(compareParts[1]).val();					
					}else if(element.parent().find("."+compareParts[1]).length > 0){
						minDate = element.parent().find("."+compareParts[1]).html();
					}
	
					if($(compareParts[2]).length > 0){
						maxDate = $(compareParts[2]).val();					
					}else if(element.parent().find("."+compareParts[2]).length > 0){
						maxDate = element.parent().find("."+compareParts[2]).html();
					}
				}

				do_gl_set_range_datepicker(element, minDate, maxDate);
			}
		});
	}
}

function do_gl_datetimepicker_plugin(element, th, options) {
	var dateP = element.datetimepicker({
		locale: App.language,
		inline: false,
		sideBySide: false
	});
//	var compare = element.attr("data-compare");
	var compare = th.attr("data-compare");
	if(compare) {
		var compareParts = compare.split(' ');
		var minDate = null;
		var maxDate = null;
		element.off("click");
		element.on("click", function() {
			if(element.attr("contenteditable")){
				if(compareParts.length == 2) {
					if($(compareParts[1]).length > 0){
						if(compareParts[0] == "lt") {
							maxDate = $(compareParts[1]).val();
						} else if(compareParts[0] == "gt") {
							minDate = $(compareParts[1]).val();
						}
					}else if(element.parent().find("."+compareParts[1]).length > 0){
						if(compareParts[0] == "lt") {
							maxDate = element.parent().find("."+compareParts[1]).html();
						} else if(compareParts[0] == "gt") {
							minDate = element.parent().find("."+compareParts[1]).html();
						}
					}
					
				}else if(compareParts.length == 3){
					if($(compareParts[1]).length > 0){
						minDate = $(compareParts[1]).val();					
					}else if(element.parent().find("."+compareParts[1]).length > 0){
						minDate = element.parent().find("."+compareParts[1]).html();
					}
	
					if($(compareParts[2]).length > 0){
						maxDate = $(compareParts[2]).val();					
					}else if(element.parent().find("."+compareParts[2]).length > 0){
						maxDate = element.parent().find("."+compareParts[2]).html();
					}
				}

				do_gl_set_range_datepicker(element, minDate, maxDate);
			}
		});
	}
}

function do_gl_inputfile_plugin(element, options) {
	var defaultOption = {
			language: App.language,
			showClose: false,
			allowedFileTypes: ['image', 'html', 'text', 'video', 'audio', 'flash', 'object'],
			allowedFileExtensions: ['jpg', 'png', 'txt', 'pdf'],
			allowedPreviewTypes: ['image', 'html', 'text', 'video', 'audio', 'flash', 'object'],
			uploadUrl:  App.path.BASE_URL_API_PRIV,
			uploadExtraData : {
				sv_class : "ServiceTpyDocument",
				sv_name : "SVTpyDocumentNew",
				typ01 : 1,
				typ02 : 1
			},
			uploadAsync : false,
			overwriteInitial: false,
			deleteUrl: App.path.BASE_URL_API_PRIV,
			deleteExtraData : {
				sv_class : "ServiceTpyDocument",
				sv_name : "SVTpyDocumentDel"
			},
			layoutTemplates: {
//				actionDrag: ''
			}
	};

	//copy from default option
	var customOption = $.extend(true, {}, defaultOption);

	if(options && options.fileinput) {
		//if fileinput options is given -> override the options
		$.extend(true, customOption, options.fileinput);
	}

	var obj = undefined;

	if(options && options.obj) {
		obj = options.obj;
	}

	//get config from input
	var code 		= element.data("code");
	var typ01 		= element.data("typ01");
	var typ02 		= element.data("typ02");
	var dataname	= element.data("name");
	var maxFile		= element.data("maxfile");


	customOption.uploadExtraData.code = code;
	if(typ01) {
		customOption.uploadExtraData.typ01 = typ01;
	}
	if(typ02) {
		customOption.uploadExtraData.typ02 = typ02;
	}

	if(maxFile) {
		try {
			customOption.maxFileCount = parseInt(maxFile);
		} catch(e) {
			console.log(e);
		}
		if(maxFile == 1) {
			customOption.autoReplace		= true;
			customOption.overwriteInitial	= true;
		}
	}

	//[T1604] show file by type01
	var listFiles 	= [];
	var listTmpFile = [];
	if(options && options.fileinput_files) {
		//old version
		listTmpFile = options.fileinput_files;
	} else if(obj && obj[dataname]) {
		//new version
		listTmpFile = obj[dataname];
	}

	//Filter list file by typ01
	if(typ01) {
		$.each(listTmpFile, function(i, e) {
			if(e.typ01 == typ01) {
				listFiles.push(e);
			}
		});
	} else {
		listFiles = listTmpFile;
	}

	//Init the file input preview existing files
	var urls = [];
	var preConf = [];
	$.each(listFiles, function(i, e) {
		var u = App.path.BASE_URL_API + "?" + e.path01;
		urls.push(u);
		var c = {
				caption : e.name,
				downloadUrl: u,
				size : e.size,
				key : e.id
		}
		preConf.push(c);
	});
	customOption.initialPreview = urls;
	customOption.initialPreviewAsData = true;
	customOption.initialPreviewConfig = preConf;

	element.fileinput(customOption);

	element.on('fileuploaded', function(event, data, previewId, index) {
		var form = data.form, files = data.files, extra = data.extra, 
		response = data.response, reader = data.reader;
		if(options && options.fileinput_upcallback) {
			options.fileinput_upcallback(response);
		} else if(obj) {
			if(response[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				if(!obj[dataname]) {
					obj[dataname] = [];
				}
				var lstFiles = response[App['const'].RES_DATA];
				$.each(lstFiles, function(i, e) {
					obj[dataname].push(e);
				});
				do_gl_show_Notify_Msg_Success ($.i18n('common_file_up_ok_msg'));
			}
		}
	});

	element.on('filebatchuploadsuccess', function(event, data, previewId, index) {
		var form = data.form, files = data.files, extra = data.extra, 
		response = data.response, reader = data.reader;
		if(options && options.fileinput_upcallback) {
			options.fileinput_upcallback(response);
		} else if(obj) {
			if(response[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				if(!obj[dataname]) {
					obj[dataname] = [];
				}
				var lstFiles = response[App['const'].RES_DATA];
				$.each(lstFiles, function(i, e) {
					obj[dataname].push(e);
				});
				do_gl_show_Notify_Msg_Success ($.i18n('common_file_up_ok_msg'));
			}
		}
	});

	//Always ask when delete file
	element.on('filebeforedelete', function(event, key, data) {
		return new Promise(function(resolve, reject) {
			App.MsgboxController.do_lc_show({
				title	: $.i18n("msgbox_confirm_title"),
				content : sprintf($.i18n("common_msg_del_file_content"	), key),
				buttons	: {
					OK: {
						lab		: $.i18n("common_btn_ok"),
						funct	: function(){
							resolve();
						}					
					},
					NO: {
						lab		:  $.i18n("common_btn_cancel"),
						funct	: function(){
							result = false;
						}
					}
				}
			});
		});
	});

	element.on('filedeleted', function(event, key, jqXHR, data) {
		response = jqXHR.responseJSON;
		if(options && options.fileinput_delcallback) {
			options.fileinput_delcallback(response);
		} else if(obj) {
			if(response[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				var fileId = response[App['const'].RES_DATA];
				$.each(obj[dataname], function(i, e) {
					if(e.id == fileId) {
						obj[dataname].splice(i,1);
					}
				});
				do_gl_show_Notify_Msg_Success ($.i18n('common_file_del_ok_msg'));
			} else {
				do_gl_show_Notify_Msg_Error ($.i18n('common_file_del_error_msg'));
			}
		}
	});
}
//--------------------------------------------------------------------------------


//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//jQuery Numpad
function do_gl_init_jqueryNumpadPlugin(parentNode) {
	var children = parentNode.find(".numpad");

	if(children.length>0) {	
		children.each(function(){
			$(this).numpad();
		});
	}
}

//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
function do_gl_init_touchKeyboardPlugin(parentNode, options) {
	var children = parentNode.find(".keyboard");

	if(children.length>0) {	
		children.each(function(){
			var defaultOption = {
					type:'custom',	//'tel'
//					layout:[
//					[['a','A'],['b','B'],['c','C'],['del','del']],
//					[['shift','shift'],['space','space']]
//					],

					initCaps: false
			};

			var customOption = $.extend(true, {}, defaultOption);

			if(options) {
				$.extend(true, customOption, options.keyboard);
			}



			$(this).keyboard(customOption);
		});
	}
}

//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------


//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//------------------------------------------------------
function do_gl_Add_Class_List(divList, divElement, className) {
	if(!className) className = "active";

	$(divList).children().removeClass(className);
	var li = $(divElement);
	li.addClass(className);
}

function do_gl_Remove_Add_Class_List(divList, divElement, oldClassName, newClassName) {
	if(!newClassName) newClassName = "active";

	$(divList).children().removeClass(oldClassName);
	var li = $(divElement);
	li.addClass(newClassName);
}

function do_gl_Add_Class_List_All(divList, divElement, className) {
	if(!className) className = "active";

	$(divList).find("tr").removeClass(className);
	var li = $(divElement);
	li.addClass(className);
}

function do_gl_Remove_Class_List(divList, className) {
	if(!className) className = "active";

	$(divList).children().removeClass(className);
}

function do_gl_ShowEnabledButton(idBtn, flag, styleDisplay) {
	if(!styleDisplay) styleDisplay = "block";
	if(flag) {
		$(idBtn).attr	("disabled", false);
		$(idBtn).css	("display", styleDisplay);
	} else {
		$(idBtn).attr	("disabled", true);
		$(idBtn).css	("display", "none");
	}
}


function srtArrayDesc(desc, key, srtTime) {
	if(srtTime) {
		return function(a, b){
			return desc ? ~~(key ? new Date(a[key]).getTime() < new Date(b[key]).getTime() : new Date(a).getTime() < new Date(b).getTime()) 
					: ~~(key ? new Date(a[key]).getTime() > new Date(b[key]).getTime() : new Date(a).getTime() > new Date(b).getTime());
		};
	} else {
		return function(a, b){
			return desc ? ~~(key ? a[key] < b[key] : a < b) 
					: ~~(key ? a[key] > b[key] : a > b);
		};
	}

}

function req_gl_Sort_Array(arr, key, type, srtTime) {
	if(type == App['const'].SORT_TYPE.ASC)
		return arr.sort(srtArrayDesc(false, key, srtTime));
	else if(type == App['const'].SORT_TYPE.DESC)
		return arr.sort(srtArrayDesc(true, key, srtTime));
}

if (!String.format) {
	String.format = function(format) {
		var args = Array.prototype.slice.call(arguments, 1);
		return format.replace(/{(\d+)}/g, function(match, number) { 
			return typeof args[number] != 'undefined'
				? args[number] 
			: match
			;
		});
	};
} //ex: String.format('{0} is dead, but {1} is alive! {0} {2}', 'ASP', 'ASP.NET', 'Test');

function do_gl_render_datatable(parentNode, options) {
	var lang = localStorage.language;
	if (lang ==null ) lang = "en";

	var filename = "datatable_"+lang+".json";
	var children = parentNode.find(".table-datatable");

	if(children.length>0) {	
		children.each(function(){
			var defaultOption = {
					oLanguage		: {
						sUrl	: "www/js/lib/datatables/"+ filename
					},	
					"paging": true,
					"lengthChange": true,
					"searching": true,
					"ordering": true,
					"info": true,
					"autoWidth": true,
					
					sDom :	SDOM_DATATABLE_DEFAULT
			};
			
			if(options.sDom){
				var custom_dom = SDOM_DATATABLE_CUSTOM;
				
				defaultOption.sDom = custom_dom;
				defaultOption.initComplete =  function( settings, json ) {
					$("#table-header-add").html("<button id='btn_add' class='objData btn btn-flat btn-primary pull-right'>"
												+ "<i class='fa fa-braille' aria-hidden='true'></i>"
												+ "</button>");
					
//					$(tableId + "_wrapper").find("#btn_add").on("click", function() {
//						if(add_funct) {
//							add_funct(new_table);
//						} else {
//							var newData 	= $.extend(true, {}, default_new_line);
//							var rownode 	= new_table.row.add(newData).draw(false).node();
//
//							do_gl_enable_edit($(rownode));
//						}
//					});
				}
			}

			var customOption = $.extend(true, {}, defaultOption);

			if(options && options.datatable) {
				$.extend(true, customOption, options.datatable);
			}

			var extraCustomOption = $(this).data("option");
			if(extraCustomOption) {
				$.extend(true, customOption, extraCustomOption);
			}

			$(this).DataTable(customOption);
		});	
	}
}

function do_gl_sort_object_number(object, itemSort) {
	var objectSort		= $.extend(true, {}, object);
	var reList 			= []
	var reListSort 		= []
	var i 				= 0
	$.each(objectSort, function(index, el){
		if(isNaN(el[itemSort]))
			el.nameSort = do_gl_change_characters_for_sort(el[itemSort]);
		else
			el.nameSort = parseFloat(el[itemSort]);
		reList[i] = el.nameSort;
		i++;
	})
	reList.sort(function(a, b){return a - b});
	$.each(objectSort, function(index, el){
		for(var i = 0; i < reList.length; i++){
			if(el.nameSort == reList[i]){
				reListSort[i] = el;
				delete reListSort[i].nameSort;
				delete reList[i]; 
				break;
			}
		}
	})
	return reListSort;
}

function do_gl_sort_object(object, itemSort) {
	var objectSort		= $.extend(true, {}, object);
	var reList 			= []
	var reListSort 		= []
	var i 				= 0
	$.each(objectSort, function(index, el){
		if(isNaN(el[itemSort]))
			el.nameSort = do_gl_change_characters_for_sort(el[itemSort]);
		else
			el.nameSort = el[itemSort];
		reList[i] = el.nameSort;
		i++;
	})
	reList.sort();
	$.each(objectSort, function(index, el){
		for(var i = 0; i < reList.length; i++){
			if(el.nameSort == reList[i]){
				reListSort[i] = el;
				delete reListSort[i].nameSort;
				delete reList[i]; 
				break;
			}
		}
	})
	return reListSort;
}

function do_gl_change_alias(string) {
    str = string.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    str = str.replace(/ + /g," ");
    str = str.trim(); 
    return str;
}

function do_gl_change_characters_for_sort(string) {
	var str = string;
	str = str.replace('Ă','Az');
	str = str.replace('Ằ','Azz');
	str = str.replace('Ắ','Azzz');
	str = str.replace('Ẳ','Azzzz');
	str = str.replace('Ẵ','Azzzzz');
	str = str.replace('Ặ','Azzzzzz');
	str = str.replace('Â','Azzzzzzz');
	str = str.replace('Ầ','Azzzzzzz');
	str = str.replace('Ấ','Azzzzzzzz');
	str = str.replace('Ẩ','Azzzzzzzzz');
	str = str.replace('Ẫ','Azzzzzzzzzz');
	str = str.replace('Ậ','Azzzzzzzzzzz');
	str = str.replace('ă','az');
	str = str.replace('ằ','azz');
	str = str.replace('ắ','azzz');
	str = str.replace('ẳ','azzzz');
	str = str.replace('ẵ','azzzzz');
	str = str.replace('ặ','azzzzzz');
	str = str.replace('â','azzzzzzz');
	str = str.replace('ầ','azzzzzzzz');
	str = str.replace('ấ','azzzzzzzzz');
	str = str.replace('ẩ','azzzzzzzzzz');
	str = str.replace('ẫ','azzzzzzzzzzz');
	str = str.replace('ậ','azzzzzzzzzzzz');
	str = str.replace('Đ','Dz');
	str = str.replace('đ','dz');
	str = str.replace('Ê','Ez');
	str = str.replace('Ề','Ezz');
	str = str.replace('Ế','Ezzz');
	str = str.replace('Ể','Ezzzz');
	str = str.replace('Ễ','Ezzzzz');
	str = str.replace('Ệ','Ezzzzzz');
	str = str.replace('ê','ezzzzzzz');
	str = str.replace('ề','ezzzzzzzz');
	str = str.replace('ê','ezzzzzzzzz');
	str = str.replace('ể','ezzzzzzzzzz');
	str = str.replace('ễ','ezzzzzzzzzzz');
	str = str.replace('ệ','ezzzzzzzzzzzz');
	str = str.replace('Ô','Oz');
	str = str.replace('Ồ','Ozz');
	str = str.replace('Ố','Ozzz');
	str = str.replace('Ổ','Ozzzz');
	str = str.replace('Ỗ','Ozzzzz');
	str = str.replace('Ộ','Ozzzzzz');
	str = str.replace('Ơ','Ozzzzzzz');
	str = str.replace('Ờ','Ozzzzzzzz');
	str = str.replace('Ớ','Ozzzzzzzzz');
	str = str.replace('Ở','Ozzzzzzzzz');
	str = str.replace('Ỡ','Ozzzzzzzzzz');
	str = str.replace('Ợ','Ozzzzzzzzzzz');
	str = str.replace('ô','oz');
	str = str.replace('ồ','ozz');
	str = str.replace('ố','ozzz');
	str = str.replace('ổ','ozzzz');
	str = str.replace('ỗ','ozzzzz');
	str = str.replace('ộ','ozzzzzz');
	str = str.replace('ơ','ozzzzzzz');
	str = str.replace('ờ','ozzzzzzzz');
	str = str.replace('ớ','ozzzzzzzzz');
	str = str.replace('ở','ozzzzzzzzzz');
	str = str.replace('ỡ','ozzzzzzzzzzz');
	str = str.replace('ợ','ozzzzzzzzzzzz');
	str = str.replace('Ư','Uz');
	str = str.replace('Ừ','Uzz');
	str = str.replace('Ứ','Uzzz');
	str = str.replace('Ử','Uzzzz');
	str = str.replace('Ữ','Uzzzzz');
	str = str.replace('Ự','Uzzzzzz');
	str = str.replace('ư','uz');
	str = str.replace('ừ','uzz');
	str = str.replace('ứ','uzzz');
	str = str.replace('ử','uzzzz');
	str = str.replace('ữ','uzzzzz');
	str = str.replace('ự','uzzzzzz');
	
	return str;
}

