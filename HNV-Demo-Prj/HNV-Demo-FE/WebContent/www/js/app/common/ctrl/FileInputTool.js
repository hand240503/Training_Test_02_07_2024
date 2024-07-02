//do_gl_init_fileinputPlugin(parentNode, options) 

FileInput = function(selector, options, obj) {
//	var FileInput = function(selector, options, obj) {

	if (!App.CameraController){
		var CameraController = require('common/ctrl/CameraController');
		App.CameraController  = new CameraController();
	}

	if (!App.FileURLController){
		var FileURLController = require('common/ctrl/FileURLController');
		App.FileURLController = new FileURLController();
	}

	var supportedFileType = ['image', 'html', 'text', 'video', 'audio', 'flash', 'object'];

	var defaultOption = {
			language: App.language,
			showClose: false,
			showCapture: can_gl_iOSDevices()?false:true,
					showFileURL				: true,
					maxFileSize				: 1024*1024*512, //512MB
					allowedFileTypes		: ['image', 'html', 'text', 'video', 'audio', 'flash', 'object', 'jasper', 'jrxml'],
					allowedFileExtensions	: ['jpg', 'png', 'txt', 'pdf', 'jasper', 'jrxml', 'webm', 'mp4', 'doc', 'xls','docx', 'xlsx'],
					allowedPreviewTypes		: ['image', 'html', 'text', 'video', 'audio', 'flash', 'object', 'jasper', 'jrxml', 'pdf', 'doc', 'xls'],
					uploadUrl				:  App.path.BASE_URL_API_UPLOAD,
					ajaxSettings			: {
						headers :  			{
												Authorization: "Bearer " + App.data.user.headerURLSecu
												//--multipart request: cannot use req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL)
											}
					},
					uploadExtraData 		: {
						sv_class 			: "ServiceTpyDocument",
						sv_name 			: "SVNew",
						typ01 				: 1,
						typ02 				: 10
					},
					uploadAsync 			: false,
					overwriteInitial		: false,
					
					deleteUrl				: App.path.BASE_URL_API_PRIV,
					ajaxDeleteSettings		: {
						headers 			: req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL)
					},
					deleteExtraData 		: {
						sv_class 			: "ServiceTpyDocument",
						sv_name 			: "SVDel"
					},
					layoutTemplates: {
//						actionDrag: ''
					},
					
	};

	this.do_lc_init_input_file = function() {
		var input_file_type = this.input.data("type");
		if(input_file_type && input_file_type == "avatar") {
			var avatar_options = {
//					overwriteInitial: true,
					maxFileSize: 1024*1024*100,
//					showClose: false,
//					showCaption: false,
//					showBrowse: false,
//					showCapture: false,
//					browseOnZoneClick: true,
//					layoutTemplates: {main2: '{preview} '},
					isCaptureAvatar	: true,
					browseLabel		: "",
					captureLabel 	: "",
					allowedFileExtensions: ["jpg", "png", "gif"]
			};
			$.extend(true, this.options, avatar_options);
//			$(this.input.parent()).addClass("kv-avatar");
		}

		this.input.fileinput(this.options);
	}

	this.input		= $(selector);

	//copy from default option
	this.options 	= $.extend(true, {}, defaultOption);
	this.fileLst	= [];

	var self	= this;

	if(options) {
		//if options is given -> override the options
		this.options = $.extend({}, this.options, options);
	}

	//get config from input
	var code 		= this.input.data("code");
	var typ01 		= this.input.data("typ01");
	var typ02 		= this.input.data("typ02");
	var dataname	= this.input.data("name");
	var maxFile		= this.input.data("maxfile");
	var maxSize		= this.input.data("maxfilesize");
	var fileType	= this.input.data("filetype");
	var entId		= this.input.data("entid");

	this.options.uploadExtraData.code = code;
	this.options.uploadExtraData.entId = entId;
	if(typ01) {
		this.options.uploadExtraData.typ01 = typ01;
	}
	if(typ02) {
		this.options.uploadExtraData.typ02 = typ02;
	}

	if(maxFile) {
		try {
			this.options.maxFileCount = parseInt(maxFile,10);
		} catch(e) {
			console.log(e);
		}
		if(this.options.maxFileCount == 1) {
			this.options.autoReplace		= true;
			this.options.overwriteInitial	= true;
		}
	}

	if(maxSize) {
		try {
			this.options.maxFileSize = parseInt(maxSize,10);
		} catch(e) {
			console.log(e);
		}
		if(this.options.maxFileSize <=0) {
			this.options.maxFileSize = 1000;
		}
	}

	if(fileType) {
		var typs = fileType.split(',');
		this.options.allowedFileTypes 		= [];
		this.options.allowedFileExtensions 	= [];
		this.options.allowedPreviewTypes 	= [];
		var opt = this.options.allowedFileExtensions;
		var opt1 = this.options.allowedPreviewTypes;
		$.each(typs, function(i, e) {
			opt.push(typs[i]);
			opt1.push(typs[i]);
		});
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
				if(typ02) {
					if(e.typ02 == typ02) {
						listFiles.push(e);
					}
				} else {
					listFiles.push(e);
				}
			}
		});
	}else if(typ02) {
		$.each(listTmpFile, function(i, e) {
			if(e.typ02 == typ02) {
				listFiles.push(e);
			}
		});
	}else{
		listFiles = listTmpFile;
	}

	//save the current file list
	this.fileLst = $.extend(true, [], listFiles);

	//Init the file input preview existing files
	var urls 	= [];
	var preConf = [];
	
	var reqFileType = function (fName){
		return fName.substring(fName.lastIndexOf('.')+1, fName.length) || "object";
	}
	
	
	$.each(listFiles, function(i, e) {
		var isPublic= (e.typ03==1);

//		var urlPrev = e.path03 ? (App.path.BASE_URL_API_PRIV + "?" + e.path03) :( e.path01 ? (App.path.BASE_URL_API_PRIV + "?" + e.path01) :"www/img/noImg.jpg");		
//		var urlPrev = (e.urlPrev? (!isPublic?(App.path.BASE_URL_API_PRIV + "?" + e.urlPrev) :e.urlPrev) :"www/img/noImg.jpg");		
//		var urlDown = !isPublic?(App.path.BASE_URL_API_PRIV + "?" + e.url):e.url;

//		urls.push(urlPrev);
		
		urls.push(e.url);
		
		var c = {
				caption 	: e.fName,
				downloadUrl	: e.url,
				size 		: e.fSize,
				key 		: e.id,
				filetype	: reqFileType(e.fName)
		}
		preConf.push(c);
	});
	
	this.options.initialPreview 			= urls;
	this.options.initialPreviewAsData 		= true;
	this.options.initialPreviewConfig 		= preConf;
	this.options.preferIconicPreview 		= true, // this will force thumbnails to display icons for following file extensions
	this.options.previewFileIconSettings 	=  { // configure your icon file extensions
	        'doc': '<i class="fas fa-file-word text-primary"></i>',
	        'xls': '<i class="fas fa-file-excel text-success"></i>',
	        'ppt': '<i class="fas fa-file-powerpoint text-danger"></i>',
	        'pdf': '<i class="fas fa-file-pdf text-danger"></i>',
	        'zip': '<i class="fas fa-file-archive text-muted"></i>',
	        'htm': '<i class="fas fa-file-code text-info"></i>',
	        'txt': '<i class="fas fa-file-alt text-info"></i>',
	        'mov': '<i class="fas fa-file-video text-warning"></i>',
	        'mp3': '<i class="fas fa-file-audio text-warning"></i>',
	    };
	this.options.previewFileExtSettings 	= { // configure the logic for determining icon file extensions
	        'doc': function(ext) {
	            return ext.match(/(doc|docx)$/i);
	        },
	        'xls': function(ext) {
	            return ext.match(/(xls|xlsx)$/i);
	        },
	        'ppt': function(ext) {
	            return ext.match(/(ppt|pptx)$/i);
	        },
	        'pdf': function(ext) {
	            return ext.match(/(pdf)$/i);
	        },
	        'zip': function(ext) {
	            return ext.match(/(zip|rar|tar|gzip|gz|7z)$/i);
	        },
	        'htm': function(ext) {
	            return ext.match(/(htm|html)$/i);
	        },
	        'txt': function(ext) {
	            return ext.match(/(txt|ini|csv|java|php|js|css)$/i);
	        },
	        'mov': function(ext) {
	            return ext.match(/(avi|mpg|mkv|mov|mp4|3gp|webm|wmv)$/i);
	        },
	        'mp3': function(ext) {
	            return ext.match(/(mp3|wav)$/i);
	        }	       
	    };
	
	this.do_lc_init_input_file();

	this.input.on('fileuploaded', function(event, data, previewId, index) {
		do_upload_success(event, data, previewId, index);
	});

	this.input.on('filebatchuploadsuccess', function(event, data, previewId, index) {
		do_upload_success(event, data, previewId, index);
	});

	//Always ask when delete file
	this.input.on('filebeforedelete', function(event, key, data) {
		return new Promise(function(resolve, reject) {
			App.MsgboxController.do_lc_show({
				subBox	: true,
				width	: "50%",
				title	: $.i18n("msgbox_confirm_title"),
				content : $.i18n("common_msg_del_file_content"	),
				buttons	: {
					OK: {
						lab			: $.i18n("common_btn_ok"),
						autoclose	: true,
						funct		: function(){ 
							//debugger;
							resolve();
						}					
					},
					NO: {
						lab		:  $.i18n("common_btn_cancel"),
					}
				}
			});
		});
	});

	this.input.on('filedeleted', function(event, key, jqXHR, data) {
		response = jqXHR.responseJSON;
		if(obj) {
			if(response[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				var fileId = response[App['const'].RES_DATA];

				for(var i=0; i<obj[dataname].length; i++){
					if(obj[dataname][i].id == fileId) {
						obj[dataname].splice(i,1);
						i--;
					}
				}
				for(var i = 0; i < self.fileLst.length; i++){
					if(self.fileLst[i].id == fileId) {
						self.fileLst.splice(i,1);
						i--;
					}
				}
				do_gl_show_Notify_Msg_Success ($.i18n('common_file_del_ok_msg'));
			} else {
				do_gl_show_Notify_Msg_Error ($.i18n('common_data_error_msg'));
			}
		}

		if(self.options.del_success) {
			self.options.del_success(response);
		}
	});

	this.do_lc_upload_file = function(callback, objOpt) {
		if (!obj) obj = objOpt;

		var data 	= this.input.data('fileinput');
		var nbFile 	= data.getFileStack().length;
		if (nbFile<=0) {
			callback()
			return;
		}

		this.options.upload_success = callback;
		this.input.fileinput('upload');
	}

	this.input.data("file_input", this);

	var do_upload_success = function(event, data, previewId, index) {
		var form = data.form, files = data.files, extra = data.extra, 
		response = data.response, reader = data.reader;

		if(obj) {
			if(response[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				if(!obj[dataname]) {
					obj[dataname] = [];
				}

				var lstFiles = response[App['const'].RES_DATA];
				$.each(lstFiles, function(i, e) {
					//check if this input is 1 file only to replace the existing file
					if(self.options.maxFileCount == 1) {
						var oldFile = self.fileLst[0];
						if(oldFile) {
							$.each(obj[dataname], function(io, eo) {
								if(eo.id == oldFile.id) {
									obj[dataname][io] 	= e;
									self.fileLst[0]		= e;
								}
							})
						} else {
							obj[dataname].push(e);
							self.fileLst.push(e);
						}
					} else {
						obj[dataname].push(e);
						self.fileLst.push(e);
					}
				});
				if(lstFiles.length>0)
					do_gl_show_Notify_Msg_Success ($.i18n('common_file_up_ok_msg'));
				if(self.options.callback_file_upload_success){
					self.options.callback_file_upload_success.call();
				}
			}else {
				do_gl_show_Notify_Msg_Error ($.i18n('common_data_error_msg'));
			}
		}

		if(self.options.upload_success) {
			self.options.upload_success(response);
		}	    
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
//---------------------------------------------DROPZONE-------------------------------------------------------------
//override the removal callback behavior
if(typeof Dropzone !== 'undefined'){
	Dropzone.confirm = function(question, fnAccepted, fnRejected) {
		// launch your fancy bootstrap modal    
		App.MsgboxController.do_lc_show({
			title	: $.i18n("msgbox_confirm_title"),
			width	: "70%",
			content : question,
			buttons	: {
				OK: {
					lab		: $.i18n("common_btn_ok"),
					funct	: function(){
						if(fnAccepted)	fnAccepted();
					}
				},
				CALCEL: {
					lab		:  $.i18n("common_btn_no"),
					funct	: function() {
						if(fnRejected)	fnRejected();
					}
				}
			}
		});	
		
	};
}

Dzopzone = function(selector, options, obj = {files: []}) {
//	var supportedFileType = ['image', 'html', 'text', 'video', 'audio', 'flash', 'object'];

	let {fProcessing, fSucces, fError, files, maxFiles, param, previewsContainer} = options;
	if(!fSucces)
		fSucces = function(file, res){
			file.id = res[App['const'].RES_DATA][0].id;
		}
	
	let fileExist 	= [...obj.files];
	if(param){
		fileExist	= obj.files.filter(f => (param.typ01 ? param.typ01==f.typ01 : true) && (param.typ02 ? param.typ02==f.typ02 : true));
	}
		
	var defaultOption = {
			url: App.path.BASE_URL_API_UPLOAD,
			ajaxSettings:{
				headers :  {
					Authorization: "Bearer " + App.data.user.headerURLSecu
				}
			},
			params : {
				sv_class : "ServiceTpyDocument",
				sv_name : "SVNew",
				typ01 : (!param || !param.typ01) ? 1 : param.typ01,
				typ02 : (!param || !param.typ02) ? 2 : param.typ02
			},
//			acceptedFiles: 'image,html,text,video,audio,flash,object,jasper,jrxml',
			accept : function(file, done){
				done();
			},
			init: function(){
				let _this = this;

				this.on("processing", function (file) {
					if(fProcessing)	fProcessing(file);
				});

				this.on("success", function (file, response) {
					console.log("sucesso");
					let res = JSON.parse(response);
					if(res[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES){
						obj.files = [...obj.files, ...res.res_data];
						if(fSucces)	fSucces(file, res);
					}
				});

				this.on("error", function (file, error, xhr) {
					if(fError)	fError(file, error, xhr);
				});

				this.on("removedfile", function (file) {
					if(file.id){
						//send ajax delede
						do_gl_remove_fileDropzone(file, obj);
					}
				});

				if(fileExist && fileExist.length){
					for(let f of fileExist){
						var mockFile = { name: f.fName, size: f.fSize, id: f.id, accepted: true }; // use actual id server uses to identify the file (e.g. DB unique identifier)
						this.emit("addedfile", mockFile);
						if((/\.(gif|jpe?g|tiff|png|webp|bmp)$/i).test(mockFile.name)){
							this.createThumbnailFromUrl(mockFile, f.url);
							this.emit("thumbnail", mockFile, f.url);
						}
						
//						this.emit("success", mockFile);
						this.emit("complete", mockFile);
						this.files.push(mockFile);
					}
				}
			},
			addRemoveLinks : true,
			dictRemoveFileConfirmation: $.i18n("common_msg_del_file_content"),
			maxFiles : maxFiles,
			previewsContainer
	};

	return new Dropzone(selector, defaultOption);
}

function do_gl_init_fileDropzone(parentNode, options) {
	let children 	= parentNode.find(".inputfile");
	let lstInpFile 	= [];

	let {fileinput: fileinputOption = {}, obj} = options;

	if(children.length>0) {	
		children.each(function(){
			let dropzone = new Dzopzone(this, fileinputOption, obj);
			lstInpFile.push(dropzone);
		});
	}
	return lstInpFile;
}

function do_gl_remove_fileDropzone(file, obj){
	let aut_Header		= req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL);
			
	var ref 			= req_gl_Request_Content_Send("ServiceTpyDocument", "SVDel");
	ref["id"]			= file.id;
	var fSucces			= [];
	fSucces.push(req_gl_funct(null, do_gl_delete_succes_dropzone, [file, obj]));	
	
	var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax"), 0]);	

	App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, aut_Header, ref, 100000, fSucces, fError) ;
}

function do_gl_delete_succes_dropzone(response, file, obj){
	if(response[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
		if(obj.files && obj.files.length){
			obj.files = obj.files.filter(f => f.id != file.id);
		}
		do_gl_show_Notify_Msg_Success ($.i18n('common_file_del_ok_msg'));
	}
}
