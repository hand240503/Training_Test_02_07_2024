define([
        'jquery',
        
        'text!group/per/student/tmpl/Main.html',
        
        'group/per/student/ctrl/List',
        'group/per/student/ctrl/Ent',
        
        ],
        function($,         		
        		Tmpl_Main,
        		
        		CtrlList, 
        		CtrlEnt
        		
        ) {

	var CtrlMain	= function (header,	content, footer, grpName) {
		
		
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpPath				= 'group/per/student/';
		var pr_grpName				= grpName;
		App.template.names[pr_grpName] = {}; //---init only one time in Main ctrl
		
		//------------------------------------------------------------------------------------
		var tmplName				= App.template.names[pr_grpName];
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
		
		this.var_lc_MODE_INIT 		= 0;
		this.var_lc_MODE_NEW 		= 1; //duplicate is the mode new after clone object
		this.var_lc_MODE_MOD 		= 2;
		this.var_lc_MODE_DEL 		= 3;	
		this.var_lc_MODE_SEL 		= 5;
	
		//---------------------------------------------------------------
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			//---------------------------------------------------------------
			App.data["HttpSecuHeader"]				= req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL);
			do_gl_refresh_SecuHeader (self);
			
			//---------------------------------------------------------------
			
			tmplName.MAIN					= "Main";
			tmplCtrl.do_lc_put_tmpl(tmplName.MAIN	, Tmpl_Main); 
			
			//---------------------------------------------------------------
			
			if (!App.controller[pr_grpName])				
				 App.controller[pr_grpName]				= {};
			
			if (!App.controller[pr_grpName].Main		)	
				 App.controller[pr_grpName].Main 		= this; //important for other controller can get ref, when new this controller,
			
			if (!App.controller[pr_grpName].List		)  
				 App.controller[pr_grpName].List		= new CtrlList	("#div_List", "#div_List_Header", "#div_List_Content", pr_grpName);				
			if (!App.controller[pr_grpName].Ent			)  
				 App.controller[pr_grpName].Ent			= new CtrlEnt	(null, "#div_Ent", null, pr_grpName);
		

			App.controller[pr_grpName].List			.do_lc_init();
			App.controller[pr_grpName].Ent			.do_lc_init();
			//--------------------------------------------------------------------------------------------------
			
			//this.do_lc_Category_Lst= function(ids, forced, wAvatar, wParent, wChild){
		}
		
		//---load translation for page-----------------------------------
		
		this.do_lc_show = function(){
			do_gl_lang_append (pr_grpPath + 'transl', self.do_lc_show_callback);
		};			
		
		this.do_lc_show_callback = function(){
			try { 
				
				$(pr_divContent)		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.MAIN, {}));	
//				do_gl_apply_right($(pr_divContent));
				
//				
				App.controller[pr_grpName].List	.do_lc_show();
				App.controller[pr_grpName].Ent	.do_lc_show(null);//init: obj is null	
							
			}catch(e) {				
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  pr_grpName, "Main", "do_lc_show", e.toString()) ;
			}
		};
		
		this.do_verify_user_right_soc_manage = function(){
			for(var i = 0; i< this.pr_right_soc_manage.length; i++){
				if(App.data.user.rights.includes(this.pr_right_soc_manage[i]))
					return true;
			}
			return false;
		}

		//---------private-----------------------------------------------------------------------------
		
		
		//--------------------------------------------------------------------------------------------
		this.do_show_Notify_Msg  = function (sharedJson, msg, typeNotify, modeOld, modeNew){
			if (typeNotify){				
				if (typeNotify == 1 ){
					if (!msg) msg = "OK";
					do_gl_show_Notify_Msg_Success 	(msg);
				} else if (typeNotify == 0){
					if (!msg) msg = "Err";
					do_gl_show_Notify_Msg_Error 	(msg);
				}
			}else{
				var code 		= sharedJson[App['const'].SV_CODE];
				var pr_ctr_Main	= App.controller[pr_grpName].Main;
				if(code == App['const'].SV_CODE_API_YES) {
					
					if (modeOld == App['const'].MODE_NEW || modeOld == App['const'].MODE_MOD){
						if (!msg){
							msg = $.i18n('common_ok_msg_save');
						}
					}else if (modeOld == App['const'].MODE_DEL){
						if (!msg) msg = $.i18n('common_ok_msg_del');		  
					}
					
					do_gl_show_Notify_Msg_Success 	(msg);
					
				}else if (code== App['const'].SV_CODE_API_NO){
					if (modeOld == App['const'].MODE_INIT || modeOld == App['const'].MODE_SEL){
						if (!msg) msg = $.i18n('common_err_msg_get');		        		
					}else if (modeOld == App['const'].MODE_NEW || modeOld == App['const'].MODE_MOD){
						if (!msg) msg = $.i18n('common_err_msg_save');		        		
					}else if (modeOld == App['const'].MODE_DEL){
						if (!msg) msg = $.i18n('common_err_msg_del');		  
					}
					
					do_gl_show_Notify_Msg_Error 	(msg);
					
	        	} else {
	        		if (!msg) msg = $.i18n('common_err_msg_unknow');
	        		do_gl_show_Notify_Msg_Error 	(msg);
	        	}	
			}			
		}

		//--------------------------------------------------------------------------------------------
		this.do_show_Msg= function(sharedJson, msg){
			//alert(msg);
			console.log("do_show_Msg::" + msg);
		}		
			
	};

	return CtrlMain;
  });