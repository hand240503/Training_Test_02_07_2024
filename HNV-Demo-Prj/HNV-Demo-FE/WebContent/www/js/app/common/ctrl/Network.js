define(['jquery'], function ($) {
	const FUNCT_SCOPE	= AppCommon['const'].	FUNCT_SCOPE;
	const FUNCT_NAME	= AppCommon['const'].	FUNCT_NAME;
	const FUNCT_PARAM	= AppCommon['const'].	FUNCT_PARAM;
	const ROUTE			= AppCommon.keys.KEY_STORAGE_CREDENTIAL;
	/*--version 1.1.1 ----*/
	var Network = function() {	
		//	f* can be simple function : F1, or array a function : [F1, F2..] => f1[scope: variable_where_funct_in, name: functname, param: []]
		//  struct of f: fname(sharedJson, params )
		//  f set errorcode in sharedJson if something wrong
		//	res: logged: true/false  appCode: int  data: []	
		var self 	= this;		
		var compDom = COMP_DOM; //thieu 1 trong 2 deu khong chay
		var appName	= APP_NAME;
		//------------------------------------------------------------------
		/*	var opt = {
							isBg		: true,
							ajaxUrl		: App.path.BASE_URL_API_PUBL,
							ajaxHeader	: null,

							svClass		: "ServiceTpyCategoryPubl",
							svName		: "SVLstCat",
							svParams	: {
								parType 	: pr_TYPE_CATEGORY_JOB,
								treeType 	: true,
								withCount 	: true
							},

							dataName	: "cats",
							
							fCallback 	: doBindingCats,
							fParams		: [array]
							
							fSucces		: doSomethingWhenRespCodeOK
							fSuccesParam: [array]
							
							fFail		: doSomethingWhenRespCodeNotOK
							fFailParam	: [array]
					}
		 */
		this.do_lc_ajax_Opt = function (options) {
			var ref         = req_gl_Request_Content_Send(options.svClass, options.svName);
			ref				= $.extend(true, {}, ref, options.svParams);
			
			var fSucces = [];
			fSucces.push(req_gl_funct(null, do_Ajax_Resp, [options]));

			var fError = req_gl_funct(null, do_gl_show_Notify_Msg_Error, [$.i18n("common_err_ajax")]);

			if (options.isBg)
				this.do_lc_ajax_bg(options.ajaxUrl, options.ajaxHeader, ref, 100000, fSucces, fError);
			else
				this.do_lc_ajax	  (options.ajaxUrl, options.ajaxHeader, ref, 100000, fSucces, fError);
		}
		
		var do_Ajax_Resp = function (sharedJson, options) {
			var code = sharedJson[App["const"].SV_CODE];
			App.data['ajaxResp'] = sharedJson;
			if (code == App['const'].SV_CODE_API_YES) {
				if (!App.data) App.data = {};
				if (options.dataName)  App.data[options.dataName] = sharedJson[App['const'].RES_DATA];
				
				if (options.fCallback) options.fCallback.apply(null, options.fParams); 
				
				if (options.fSucces) options.fSucces.apply(null, options.fSuccesParam); 
			}else{
				if (options.fFail) 
					options.fFail.apply(null, options.fFailParam);
				else{
					var msg = $.i18n("common_err_ajax")+ " (" + code + ")";
					do_gl_show_Notify_Msg_Error(msg);
				}
			}
		}
		
		//-------------------------------------------------------------------------------------------
		//----------------------------------------------------------------------------------------
		this.do_lc_ajax_when = function(urlAPI, header, data,  timeWaitMax, fSucces, fError) {	
			let lstAjax = [];

			data.map(d => {
				let deferredItem = this.ajax_when(urlAPI, header, d, timeWaitMax);
				lstAjax.push(deferredItem);
			})

			Promise.all(lstAjax)
			.then(result => {
				for(let objFunct of fSucces){
					objFunct.fName(result, ...objFunct.fParams);
				}
			})
			.catch(err => {
				fError.fName(err, ...fError.fParams)
			})
		}

		this.ajax_when = function(urlAPI, header, data, timeWaitMax) {	
			return new Promise((resolve, reject) => {
				if (timeWaitMax<=0) timeWaitMax = 1000*60*60; //1h
				if (typeof  data === 'string' || data instanceof String) data = data.split("null").join("");
				do_gl_LS_SecurityInfo_Save_Time(ROUTE);

				this.startLoader();

				let fStopLoader	= {[FUNCT_SCOPE]: this, [FUNCT_NAME]: this.stopLoader, [FUNCT_PARAM]: []}; 

				checkDataToSend(data);

				$.ajax({
					type		: 'POST',
					dataType 	: "json",
					url			: urlAPI,      
					timeout		: timeWaitMax,
					data 		: JSON.stringify(data), 
					headers		: header
				}).done((res, statut) => {
					(!compDom || !appName) 												&& reject("No compDom or no appName");
					(compDom.indexOf(AUTHOR_NAME)<0 && compDom.indexOf(CLIENT_NAME)<0) 	&& reject("No AUTHOR_NAME or no CLIENT_NAME");
					(appName.indexOf(IDEA_NAME)<0 	&& appName.indexOf(PROJ_NAME)<0) 	&& reject("No IDEA_NAME or no PROJ_NAME");

					try{
						var resJson		= reqParseJson(res);
						if (!isLogged(resJson)) execute(fStopLoader);
						resolve(resJson);
					}catch(e){
						errLog (resJson, e);
						execute (fStopLoader);
						reject(e);
					}
				}).fail((res, statut, erreur) => {
					execute (fStopLoader);
					reject(erreur);
				}).always((res, statut) => {});
			})
		};
		//-------------------------------------------------------------------------------------------------------------------
		//-------------------------------------------------------------------------------------------------------------------
		//--do ajax post request with data
		this.do_lc_ajax = function(urlAPI, header, data,  timeWaitMax, fSucces, fError) {	
			this.ajax (urlAPI, header, data,  timeWaitMax, fSucces, fError);
		}
		
		//--do ajax request by type: Get, Post
		this.do_lc_ajax_type = function(urlAPI, header, data,  typeSend,  timeWaitMax, fSucces, fError) {	
			this.ajaxWithType(urlAPI, header, data,  typeSend,  timeWaitMax, fSucces, fError);
		}
		
		//--do ajax post request with form data
		this.do_lc_ajax_form = function(urlAPI, header, data,  timeWaitMax, fSucces, fError) {	
			this.ajaxUpFile(urlAPI, header, data,  timeWaitMax, fSucces, fError);
		}
		
		//--do ajax request in background
		this.do_lc_ajax_bg = function(urlAPI,  header, data,  timeWaitMax, fSucces, fError) {
			this.ajaxBackground(urlAPI,  header, data,  timeWaitMax, fSucces, fError) ;
		}
		
		//--do ajax request in background
		this.do_lc_ajax_background = function(urlAPI,  header, data,  timeWaitMax, fSucces, fError) {
			this.ajaxBackground(urlAPI,  header, data,  timeWaitMax, fSucces, fError) ;
		}
		
		//--when err connexion, no logout
		this.do_lc_ajax_bg_keepState = function(urlAPI,  header, data,  timeWaitMax, fSucces, fError) {
			this.ajaxBackground_NoLogout(urlAPI,  header, data,  timeWaitMax, fSucces, fError) ;
		}
		
		
		//--add a loader image
		this.do_lc_add_loader= function () {
			this.startLoader();
		}
		
		//--remove a loader image
		this.do_lc_remove_loader = function () {
			this.stopLoader();
		}
		
		//---do a task and lock every event with loader in timeoutMax
		this.do_lc_task_loader = function (task, params, timeoutMax) {
			this.startTask(task, timeoutMax, params);
		}		
		
		//-------------------------------------------------------------------------------------------------------------------
		//-------------------------------------------------------------------------------------------------------------------
		//-------------------------------------------------------------------------------------------------------------------
		//-------------------------------------------------------------------------------------------------------------------
		this.ajax = function(urlAPI, header, data,  timeWaitMax, fSucces, fError) {	
			if (timeWaitMax<=0) timeWaitMax = 1000*60*60; //1h
			if (typeof  data === 'string' || data instanceof String) data = data.split("null").join("");
			do_gl_LS_SecurityInfo_Save_Time(ROUTE);
			
			this.startLoader();

			var fStopLoader		= {}; 
			fStopLoader[FUNCT_SCOPE]= this; fStopLoader[FUNCT_NAME]=this.stopLoader; fStopLoader[FUNCT_PARAM]=[];
			
			
			checkDataToSend(data);
			$.ajax({
				type		: 'POST',
				contentType : "application/json",
				dataType	: "json",
				url			: urlAPI,      
				timeout		: timeWaitMax,
				data 		: JSON.stringify(data), 
				headers		: header, 				
				success		: function(res, statut){ // code_html contient le HTML renvoyé
					if (!fSucces) return;
					if (!compDom || !appName) return;
					
					if (compDom.indexOf(AUTHOR_NAME)<0 	&& compDom.indexOf(CLIENT_NAME)<0) 	return;
					if (appName.indexOf(IDEA_NAME)<0 	&& appName.indexOf(PROJ_NAME)<0) 	return;
					
					try{
						var resJson		= reqParseJson(res);
						if (isLogged(resJson)){	
//							decodeUTF8AllLevel(resJson);
							queue 	(fSucces, fError, fStopLoader , resJson, 100);								
						}else{
							execute (fStopLoader);	
						}
						
					}catch(e){
						errLog (resJson, e);
						execute (fStopLoader);
					}
				},
				error 		: function(res, statut, erreur){					
					if (fError) execute (fError, [res, statut, erreur]);
					execute (fStopLoader);				
				},
				complete	: function(res, statut){					
				}
			});				
			
		};
		//-------------------------------------------------------------------------------------------------
		
		this.ajaxWithType = function(urlAPI, header, data,  typeSend,  timeWaitMax, fSucces, fError) {	
			if (timeWaitMax<=0) timeWaitMax = 1000*60*60; //1h
			if (typeof  data === 'string' || data instanceof String) data = data.split("null").join("");
			do_gl_LS_SecurityInfo_Save_Time(ROUTE);
			
			this.startLoader();

			var fStopLoader		= {}; 
			fStopLoader[FUNCT_SCOPE]= this; fStopLoader[FUNCT_NAME]=this.stopLoader; fStopLoader[FUNCT_PARAM]=[];
			
			
			checkDataToSend(data);
			
			if (!typeSend) typeSend = 'POST';
			$.ajax({
				type		: typeSend,
				contentType : "application/json",
				dataType	: "json",
				url			: urlAPI,      
				timeout		: timeWaitMax,
				data 		: JSON.stringify(data), 
				headers		: header, 				
				success		: function(res, statut){ // code_html contient le HTML renvoyé
					if (!fSucces) return;
					if (!compDom || !appName) return;
					
					if (compDom.indexOf(AUTHOR_NAME)<0 	&& compDom.indexOf(CLIENT_NAME)<0) 	return;
					if (appName.indexOf(IDEA_NAME)<0 	&& appName.indexOf(PROJ_NAME)<0) 	return;
					
					try{
						
						//var resJson 	=  $.parseJSON(res);	
						var resJson		= reqParseJson(res);
						if (isLogged(resJson)){	
//							decodeUTF8AllLevel(resJson);
							queue 	(fSucces, fError, fStopLoader , resJson, 100);								
						}else{
							execute (fStopLoader);	
						}
						
					}catch(e){
						errLog (resJson, e);
						execute (fStopLoader);
					}
				},
				error 		: function(res, statut, erreur){					
					if (fError) execute (fError, [res, statut, erreur]);
					execute (fStopLoader);				
				},
				complete	: function(res, statut){					
				}
			});				
			
		};
		//-------------------------------------------------------------------------------------------------
		
		this.ajaxForm = function(urlAPI, header, data,  timeWaitMax, fSucces, fError) {	
			this.ajaxUpFile(urlAPI, header, data,  timeWaitMax, fSucces, fError);
		}
		
		this.ajaxUpFile = function(urlAPI, header, data,  timeWaitMax, fSucces, fError) {	
			if (timeWaitMax<=0) timeWaitMax = 1000*60*60*24; //24h
			do_gl_LS_SecurityInfo_Save_Time(ROUTE);
			
			this.startLoader();
			var fStopLoader		= {}; 
			fStopLoader[FUNCT_SCOPE]= this; fStopLoader[FUNCT_NAME]=this.stopLoader; fStopLoader[FUNCT_PARAM]=[];
			
			checkDataToSend(data); 			
			$.ajax({
				type		: 'POST',				
				url			: urlAPI,      
				timeout		: timeWaitMax,
				data 		: JSON.stringify(data), 
				headers		: header, 	
				cache		: false,
			    contentType	: false,
			    processData	: false,
				success		: function(res, statut){ // code_html contient le HTML renvoyé
					if (!fSucces) return;
					if (!compDom || !appName) return;
					
					if (compDom.indexOf(AUTHOR_NAME)<0 	&& compDom.indexOf(CLIENT_NAME)<0) 	return;
					if (appName.indexOf(IDEA_NAME)<0 	&& appName.indexOf(PROJ_NAME)<0) 	return;
					
					
					try{
						//var resJson 	=  $.parseJSON(res);	
						var resJson		= reqParseJson(res);
						if (isLogged(resJson)){	
//							decodeUTF8AllLevel(resJson);
							queue 	(fSucces, fError, fStopLoader , resJson, 100);								
						}else{
							execute (fStopLoader);	
						}	
					}catch(e){
						errLog (resJson, e);
						execute (fStopLoader);
					}
				},
				error 		: function(res, statut, erreur){					
					if (fError) execute (fError, [res, statut, erreur]);
					execute (fStopLoader);				
				},
				complete	: function(res, statut){					
				}
			});			
		};
		
		//-------------------------------------------------------------------------------------------------
		this.ajaxBackground = function(urlAPI,  header, data,  timeWaitMax, fSucces, fError) {	
			if (timeWaitMax<=0) timeWaitMax = 1000*60*60; //1h
			if (typeof  data === 'string' || data instanceof String) data = data.split("null").join("");
			do_gl_LS_SecurityInfo_Save_Time(ROUTE);
			
			checkDataToSend(data);
			$.ajax({
				type		: 'POST',
				contentType : "application/json",
				dataType	: "json",
				url			: urlAPI,      
				timeout		: timeWaitMax,
				data 		: JSON.stringify(data), 
				headers		: header, 
				success		: function(res, statut){ // code_html contient le HTML renvoyé
					if (!fSucces) return;
					if (!compDom || !appName) return;
					
					if (compDom.indexOf(AUTHOR_NAME)<0 	&& compDom.indexOf(CLIENT_NAME)<0) 	return;
					if (appName.indexOf(IDEA_NAME)<0 	&& appName.indexOf(PROJ_NAME)<0) 	return;
					
					
					try{
						//var resJson 	=  $.parseJSON(res);
						var resJson		= reqParseJson(res);

						if (isLogged(resJson)){	
//							decodeUTF8AllLevel(resJson);
							queue 	(fSucces, fError, null , resJson, 100);								
						}
					}catch(e){
						errLog (resJson, e);						
					}
					
				},
				error 		: function(res, statut, erreur){		
					console.log ("--- err : " + data.sv_class +" " + data.sv_name);
					if (fError) execute (fError, [res, statut, erreur]);						
				},
				complete	: function(res, statut){					
				}
			});
			//ev.preventDefault();
		};
		
		
		this.ajaxBackground_NoLogout = function(urlAPI,  header, data,  timeWaitMax, fSucces, fError) {	
			if (timeWaitMax<=0) timeWaitMax = 1000*60*60; //1h
			if (typeof  data === 'string' || data instanceof String) data = data.split("null").join("");
			do_gl_LS_SecurityInfo_Save_Time(ROUTE);
			
			checkDataToSend(data);
			$.ajax({
				type		: 'POST',
				contentType : "application/json",
				dataType	: "json",
				url			: urlAPI,      
				timeout		: timeWaitMax,
				data 		: JSON.stringify(data), 
				headers		: header, 
				success		: function(res, statut){ // code_html contient le HTML renvoyé
					if (!fSucces) return;
					if (!compDom || !appName) return;
					
					if (compDom.indexOf(AUTHOR_NAME)<0 	&& compDom.indexOf(CLIENT_NAME)<0) 	return;
					if (appName.indexOf(IDEA_NAME)<0 	&& appName.indexOf(PROJ_NAME)<0) 	return;
					
					
					try{
						//var resJson 	=  $.parseJSON(res);
						var resJson		= reqParseJson(res);

						if (isLoggedAndDoNothing(resJson)){	
//							decodeUTF8AllLevel(resJson);
							queue 	(fSucces, fError, null , resJson, 100);								
						}
					}catch(e){
						errLog (resJson, e);						
					}
					
				},
				error 		: function(res, statut, erreur){					
					if (fError) execute (fError, [res, statut, erreur]);						
				},
				complete	: function(res, statut){					
				}
			});
			//ev.preventDefault();
		};
		//-------------------------------------------------------------------------------------------------
		this.do_lc_ajax_req_file = function(urlAPI,  header, data,  timeWaitMax, fSucces, fError) {
			if (timeWaitMax<=0) timeWaitMax = 1000*60*60; //1h
			if (typeof  data === 'string' || data instanceof String) data = data.split("null").join("");
			do_gl_LS_SecurityInfo_Save_Time(ROUTE);
			
			$.ajax({
				type		: 'GET',
				dataType 	: 'text',
				url			: urlAPI,      
				timeout		: timeWaitMax,
				data 		: JSON.stringify(data), 
				headers		: header, 
				success		: function(res, statut){ // code_html contient le HTML renvoyé
					if (!fSucces) return;
					if (!compDom || !appName) return;
					
					if (compDom.indexOf(AUTHOR_NAME)<0 	&& compDom.indexOf(CLIENT_NAME)<0) 	return;
					if (appName.indexOf(IDEA_NAME)<0 	&& appName.indexOf(PROJ_NAME)<0) 	return;
					
					
					try{
						//var resJson 	=  $.parseJSON(res);
						var resJson		= reqParseJson(res);

//						decodeUTF8AllLevel(resJson);
						queue 	(fSucces, fError, null , resJson, 100);
						
					}catch(e){
						errLog (resJson, e);						
					}
					
				},
				error 		: function(res, statut, erreur){					
					if (fError) execute (fError, [res, statut, erreur]);						
				},
				complete	: function(res, statut){					
				}
			});
		}
		//-------------------------------------------------------------------------------------------------
		
		var errLog = function (resJson, e){
			console.log("----- something wrong with response-Json: " + resJson+ " :: "+ e +". If the response JSON is empty, we cannot parse it.");
		}
		var isLogged = function (res){
			if (!res.sess_stat){
				if (res.sv_code != 0)
					self.doWhenLoggedByError();
				else
					self.doWhenLogged();
				
				do_gl_show_Notify_Msg_Error ($.i18n("login_err_authentification"));
				
				return false;
			}		
			return true;
		};
		
		var isLoggedAndDoNothing = function (res){
			if (!res.sess_stat){				
				return false;
			}		
			return true;
		};
		
		var isLoggedOrDoLogIn = function (res, fLogin, loginParams){
			if (!res.sess_stat){
				fLogin.apply(null, loginParams);	
				do_gl_show_Notify_Msg_Error ($.i18n("common_err_ajax"));
				return false;
			}		
			return true;
		};
		
				
		this.doWhenLoggedByError = function(){
//			localStorage.clear();	
			try{
				do_gl_LocalStorage_Remove (App.keys.KEY_STORAGE_CREDENTIAL);
			}catch(e){}		
			App.router.controller.do_lc_run(App.router.routes.HOME);
			//alert("Log out");
		};
		
		this.doWhenLogged = function(){
//			localStorage.clear();	
			try{
				do_gl_LocalStorage_Remove (App.keys.KEY_STORAGE_CREDENTIAL);
			}catch(e){}		
			App.router.controller.do_lc_run(App.router.routes.HOME);
			//alert("Log out");
		};
		//----------------------------------------------------------------------------------------------------
		var reqParseJson= function(res){				
			var type = typeOfObject (res);
			switch(type){			
			case O_TYPE_OBJ		: 
			case O_TYPE_ARRAY	: 
				decodeUTF8AllLevel (res)
				return res;
			case O_TYPE_STRING	: 
//				res = decodeUTF8Str(res); break;
			}		
						
			var resJson 	= "{}";
			if (!res) return resJson;
			
			try{
				resJson 	=  JSON.parse(res);		
				decodeUTF8AllLevel (resJson);
			}catch(e){
				console.log("--err in parseJson : "+ res);
				var p =res.indexOf("}");
				if (p>0){
					resJson 	=  JSON.parse(res.substring(0,p+1));					
				}
			}		
			return resJson;
		}
		//----------------------------------------------------------------------------------------------------
		var checkDataToSend = function (data){
			try{
				for (var k in data){
					var d = data[k];
				    if (d ){
				    	if (d instanceof Date) {
				    		data[k] = DateFormat(d, DateFormat.masks.isoDateTime);	
				    	} 
				    }
				}
			}catch(e){}			
		}
		/*
		function canJSON(value) {
		    try {
		        JSON.stringify(value);
		        return true;
		    } catch (ex) {
		        return false;
		    }
		}
		*/
		//----------------------------------------------------------------------------------------------------
		var ajaxLoader = function (el, options) {
			// Becomes this.options
			var defaults = {
//					bgColor 		: 'transparent',
					duration		: 100,
//					opacity			: 0.6,
					classOveride 	: false
			};

			this.options 	= $.extend(defaults, options);
			this.container 	= $(el);
			this.init = function() {
				var container = this.container;
				// Delete any other loaders
				this.remove();
				
				// Create the overlay
				var height = container.height();
				if (height<container.scrollHeight)  height=container.scrollHeight;
				if (height<1080) height =1080;
				
				var overlay = $('<div></div>').css({
//					'background-color'	: this.options.bgColor,
//					'opacity'			: this.options.opacity,
//					'width'				: container.width(),
//					'height'			: height, //container.height(),
//					'position'			: 'fixed',
//					'top'				: '0px',
//					'left'				: '0px',
//					'z-index'			: 99999
				}).addClass('ajax_overlay');
				
				// add an overiding class name to set new loader style
				if (this.options.classOveride) {
					overlay.addClass(this.options.classOveride);
				}
				// insert overlay and loader into DOM
				container.append(
						overlay.append(
								$('<div></div>').addClass('ajax_loader')
						).fadeIn(this.options.duration)
				);
			};

			this.remove = function(){
				var overlay = this.container.children(".ajax_overlay");
				if (overlay.length) {
					overlay.fadeOut(this.options.classOveride, function() {
						overlay.remove();
					});
				}
			};
			this.init();
		};


		this.loader		= null;
		this.loaderUp 	= 0;
		this.startLoader= function () {
			if (this.loaderUp == 0) {
				this.loader = new ajaxLoader($('body'));
			}
			this.loaderUp++;    
		};
		this.stopLoader= function() {
			this.loaderUp--;
			if (this.loaderUp <= 0) {
				this.loaderUp = 0;
				if (this.loader)  this.loader.remove();
			}	
		};
		
		this.loaderDiv		= null;
		this.loaderUpDiv 	= 0;
		this.doStartLoaderDiv= function () {
			if (this.loaderUpDiv == 0) {
				this.loaderDiv = new ajaxLoader($('loaderDiv'));
			}
			this.loaderUpDiv++;    
		};
		this.doStopLoaderDiv= function() {
			this.loaderUpDiv--;
			if (this.loaderUpDiv <= 0) {
				this.loaderUpDiv = 0;
				if (this.loaderDiv)  this.loaderDiv.remove();
			}	
		};
		//--------------------------------------
		this.startTask  = function(nextTask, timeoutMax, paramArray) {
			if (!timeoutMax) timeoutMax = 0;
			this.loader = new ajaxLoader($('body'));
			if (nextTask){
				setTimeout(function(){nextTask.apply(paramArray);}, 300);
				if (timeoutMax>0) setTimeout(stopLoader, timeoutMax);
			}
		};
		//---------decodeur utf8 from serveur --------------------------------------------------------------------
		this.decodeUTF8 = function(object){	
			decodeUTF8AllLevel (object);
		}
		
		
		
		function decodeUTF8OneLevel(json){
			for (var k in json){
				var val = json[k];
				if (typeof val == 'string' || val instanceof String) 
					json[k] = decodeUTF8Str(json[k]);		
			}
		}

		function decodeUTF8AllLevel(object){	
			for (var k in object){
				var val = object[k];		
				var type = typeOfObject (val);
				switch(type){
				case O_TYPE_STRING	: object[k] = decodeUTF8Str(object[k]); break;
				case O_TYPE_OBJ		: decodeUTF8AllLevel (object[k]);		break;
				case O_TYPE_ARRAY	: 
					for (var i=0;i<val.length;i++){
						var v = val[i];
						var t = typeOfObject (v);
						if (t == O_TYPE_STRING) 	val[i] = decodeUTF8Str(v);	
						else if (t == O_TYPE_OBJ)	decodeUTF8AllLevel (v);	
						else if (t==O_TYPE_ARRAY)	decodeUTF8AllLevel (v);	
					}
					break;
				}
			}
		}

		function decodeUTF8Str(str){
			try{
				if(str != null || str != undefined) {
					return decodeURIComponent(str);
				} else {
					return "";
				}
			}catch(e){
				return str;
			}
		}

		var O_TYPE_NULL 	= 0;
		var O_TYPE_STRING 	= 1;
		var O_TYPE_ARRAY 	= 2;
		var O_TYPE_OBJ 		= 3;
		var O_TYPE_OTHER	= 4;

		function typeOfObject(object) {
		    if (object === null) {
		          return O_TYPE_NULL;
		    }
		    else if (object === undefined) {
		          return O_TYPE_NULL;
		    }
		    else{
		          var t = $.type(object);
		          if (t=='string') 	return O_TYPE_STRING;
		          if (t=='array')   return O_TYPE_ARRAY;
		          if (t=='object') 	return O_TYPE_OBJ;            
		          return O_TYPE_OTHER;
		    }      
		}

	};

	return Network;
});