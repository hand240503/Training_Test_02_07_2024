define(['jquery', 'handlebars'],
		function (
				$,handlebars          
		) {
	var TemplateController = function() {
		var cachedHtml		= []; //only html no function
		var cached 			= []; //html to function
		var compiled 		= []; //after inject json
		var templatePath 	= "./template";
		var extension		= ".html";

		//--------------Use usually------------------	
		this.do_lc_put_tmpl = function(name, templateHtml, forced){
			putTemplate (name, templateHtml, forced);
		}

		this.do_lc_put_tmpl_multi = function(names, templateHtml){
			//name = [Name_Main, Name_subTmp01, Name_subTmp02]
			//trust 1 level, 
			if (!names || !templateHtml) return;
			if (!Array.isArray(names)) return;
			if (names.length==0) return;

			for (ind = 1; ind < names.length; ind++){
				var indBegin 	= templateHtml.indexOf("<!--BEGIN TMPL-->");
				var indEnd		= templateHtml.indexOf("<!--END TMPL-->")+15;
				if (indBegin>0 && indEnd>0){
					if (names[ind]){
						var tmpl		= templateHtml.slice(indBegin, indEnd);
						putTemplate (names[ind], tmpl, true);
					}					
					templateHtml	= templateHtml.substring(0, indBegin) + templateHtml.substring(indEnd);
				}else{
					break;
				}

			}
			if (names[0]) putTemplate (names[0], templateHtml, true);
		}

		this.do_lc_put_tmplRaw = function(templateHtml){
			if (!templateHtml) return;
			let	txtBegin			= "<!--BEGIN TMPL-->";
			let txtEnd				= "<!--END TMPL-->";
			let txtBeginLen			= txtBegin.length;
			let txtName 			= "<!--NAME TMPL:";
			let txtNameLen 			= txtName.length;

			var indBegin		= 0;
			var indEnd			= 1;
			while (indBegin>=0 && indEnd>0 ){
				indBegin 			= templateHtml.indexOf(txtBegin);
				indEnd				= templateHtml.indexOf(txtEnd);

				if (indBegin>=0 && indEnd>0){
					let content					= templateHtml.slice(indBegin + txtBeginLen, indEnd).trim();
					if (!content) 	content 	= "";
					if (content.length>0){
						let indTitleBegin 		= content.indexOf(txtName);
						let indTitleEnd			= content.indexOf("-->");

						if (indTitleBegin>=0 && indTitleEnd>0){
							let name			= content.slice(indTitleBegin + txtNameLen , indTitleEnd).trim();
							if (!name) name		= "";
							if(name.length>0)
								cachedHtml[name]= content;		
//								cachedHtml[name]= content.replace("/<!--[\s\S]*?-->/g", "");				
						}
					}
					templateHtml = templateHtml.substring(indEnd+15);
				}
			}
		}

		this.do_lc_build_tmplRaw = function(name){
			if (!cached[name]){
				if (cachedHtml	[name]){				
					cached		[name] =  handlebars.compile(cachedHtml[name]);
					//cachedHtml	[name] = null;
				}			
			}
		}		

		this.req_lc_tmplRaw = function(name){
			return cachedHtml[name];
		}
		
		this.req_lc_tmplCompiled = function(name){
			return cached[name];
		}
		
		this.req_lc_compile_tmpl = function(name, data){
			return getCompiled(name, data);
		}
		
		this.do_lc_clear_All = function(){
			cached 		= [];
			compiled 	= [];	
			cachedHtml	= [];
		}			
		
		this.do_lc_clear_Raw = function(){
			cached 		= [];
		}
		this.do_lc_clear_Compiled = function(){
			compiled = [];
		}
		this.can_lc_have_tmpl = function(name){
			var tmpl = cached[name];			
			if (tmpl == null){
				tmpl = cachedHtml[name]; 
				if (tmpl == null) 
					return false;
				else 
					cached[name] = handlebars.compile(tmpl);
			}
			return true;
		}
		//-------------------------------------------------------
		//----mode asyncho----------------

		this.do_lc_clearAll = function(){
			cached 		= [];
			compiled 	= [];		
		};

		this.do_lc_clearRawCache = function(){
			cached 		= [];
			cachedHtml	= [];
		}
		this.do_lc_clearCompileCache = function(){
			compiled = [];
		}

		this.do_lc_setTemplatePath = function (path){
			templatePath 	= path;
		};
		this.do_lc_setFileExtension = function (ext){
			extension 	= ext;
		};


		//--private--------------------------------------------------------
		var putTemplate = function(name, templateHtml, forced){
			if (!forced) forced = false;
			if (!cached[name] || forced==true){
				cached[name] =  handlebars.compile(templateHtml);
			}			
		}
		
		//force to recompile with data
		var getCompiled= function(name, data){ //to show view with emty data: data ={}	
			if (!name) return 'Error: The template name is not yet defined';
			
			if (!data && compiled[name]) return compiled[name]; //return from last built
			if (!data) data = {};
			
			var tmpl = cached[name];			
			if (tmpl == null){
				tmpl = cachedHtml[name]; 
				if (tmpl == null) 
					return null;
				else 
					cached[name] = handlebars.compile(tmpl);
			}
			compiled[name] 	= cached[name](data);
			return compiled[name];
		};
		
		var getAndRender= function(url, callback) {    	
			fetch	(url);        	
			render	(url, callback);
		};


		var prefetch= function(url) {
			if (url==null || url=="") return;
			$.get(urlFor(url), function(raw) {			
				store(url, raw);
			});
		};

		var render = function(url, callback) {
			if (isCached(url)) {
				if (!!callback) callback(this.cached[url]);
			} 
		};
		
		var fetch= function(url) {
			// synchronous, for those times when you need it.
			var r = $.ajax({
				url		: urlFor(url), 
				async	: false, 
				dataType: 'html', 				
				type	: 'POST',//cache:false,
				success: function(res, status, jqXHR){ 
					if (res.trim()=="" || status=== "notmodified"){
						store(url, jqXHR.responseText); 
					}else
						store(url, res); 
				}}).responseText; 			
		};

		//--------------------------------------------------
		var isCached= function(name) {    	
			return !!cached[name];
		};
		
		var store= function(name, raw) {
			if (raw==null || raw=="") return;
			cached[name] = handlebars.compile(raw);
		};
		var urlFor= function(name) {
			return templatePath +"/"+ name + extension;
		};
	};

	return TemplateController;
});


//this.req_lc_put_tmpl_multi_byName = function(names, templateHtml){
//	//name = [Name_Main, Name_subTmp01, Name_subTmp02]
//	//trust 1 level, 
//	if (!names || !templateHtml) return;
//	if (!Array.isArray(names)) return;
//	if (names.length==0) return;
//
//	var dict = {};
//	for (ind = 0; ind < names.length; ind++){
//		if (names[ind]){
//			var s			= "<!--NAME TMPL:"+names[ind]+"-->";
//			var indName 	= templateHtml.indexOf(s);
//			if (indName>=0){
//				indName 		+= s.length;
//				var indBegin 	= templateHtml.indexOf("<!--BEGIN TMPL-->"	, indName+s.length);
//				var indEnd		= templateHtml.indexOf("<!--END TMPL-->"	, indName+s.length)+15;
//
//				if (indBegin>=0 && indEnd>=0){
//					var tmpl	= templateHtml.slice(indBegin+18, indEnd-15);
//					putTemplate (names[ind], tmpl);
//					dict[names[ind]] = 1;
//				}else{
//					dict[names[ind]] = 0;
//				}						
//				if (ind!=names.length-1) 
//					templateHtml	= templateHtml.substring(0, indName) + templateHtml.substring(indEnd);
//			}else{
//				dict[names[ind]] = 0;
//			} 					
//		}
//	}
//}		