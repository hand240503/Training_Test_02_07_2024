define([
        'jquery',
        
        'text!template/per/contract/PerContract_Main.html',
        'text!template/per/common/Per_Sel_List_Cfg.html',
        'text!template/per/common/Per_Sel_List_Type_Person.html',
        'text!template/per/contract/PerContract_List.html',  
        
        'controller/per/contract/PerContractList',
        'controller/per/contract/PerContractEnt',
        'controller/per/contract/PerContractEntHeader',
        'controller/per/contract/PerContractEntBtn',
        'controller/per/contract/PerContractEntTabs',       
        'controller/per/contract/PerContractEntTabInfo'   ,       
        'controller/per/contract/PerContractEntTabDetail'   ,       
        'controller/per/contract/PerContractEntTabDocument',
        'controller/per/contract/PerContractEntTabHistory',
        'controller/per/contract/PerContractEntTabContent'
        ],
        function($,         		
        		PerContract_Main, 
        		Per_Sel_List_Cfg,
        		Per_Sel_List_Type_Person,
        		PerContract_List,
        		
        		PerContractList, 
        		PerContractEnt, 
        		PerContractEntHeader, 
        		PerContractEntBtn, 
        		PerContractEntTabs, 
        		PerContractEntTabInfo, 
        		PerContractEntTabDetail, 
        		PerContractEntTabDocument,
        		PerContractEntTabHistory,
        		PerContractEntTabContent
        ) {

	var PerContractMain 	= function (header,content,footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
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
		
		this.var_lc_MODE_INIT 		= 0;
		this.var_lc_MODE_NEW 		= 1; //duplicate is the mode new after clone object
		this.var_lc_MODE_MOD 		= 2;
		this.var_lc_MODE_DEL 		= 3;	
		this.var_lc_MODE_SEL 		= 5;
	
		this.var_lc_URL_Aut_Header	= null;
		//---------------------------------------------------------------
		this.pr_right_soc_manage	= [30002001, 30002002, 30002003, 30002004, 30002005];
		//---------------------------------------------------------------
		var societeListChild		= 1010011;
		var societeListCompany		= 1010010;
					
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			tmplName.PER_CONTRACT_MAIN					= "PerContract_Main";
			tmplName.PER_CONTRACT_LIST					= "PerContract_List";
			
			tmplName.PER_CONTRACT_LIST_INIT_HEADER		= "PerContract_List_Init_Header";
			tmplName.PER_CONTRACT_LIST_INIT_CONTENT		= "PerContract_List_Init_Content";
			
			tmplName.PER_CONTRACT_LIST_OK_HEADER		= "PerContract_List_Ok_Header";
			tmplName.PER_CONTRACT_LIST_OK_CONTENT		= "PerContract_List_Ok_Content";
			
			tmplName.PER_CONTRACT_LIST_CALCEL_HEADER	= "PerContract_List_Calcel_Header";
			tmplName.PER_CONTRACT_LIST_CALCEL_CONTENT	= "PerContract_List_Calcel_Content";
			
			tmplName.PER_CONTRACT_LIST_EXPIRED_HEADER	= "PerContract_List_Expired_Header";
			tmplName.PER_CONTRACT_LIST_EXPIRED_CONTENT	= "PerContract_List_Expired_Content";
			
			tmplName.PER_CONTRACT_ENT					= "PerContract_Ent";
			tmplName.PER_CONTRACT_ENT_BTN				= "PerContract_EntBtn";
			tmplName.PER_CONTRACT_ENT_HEADER			= "PerContract_EntHeader";
			tmplName.PER_CONTRACT_ENT_TABS				= "PerContract_EntTabs";
			
			tmplName.PER_CONTRACT_ENT_TAB_INFO			= "PerContract_Ent_Tab_Info";
			tmplName.PER_CONTRACT_ENT_TAB_DETAIL		= "PerContract_Ent_Tab_Detail";
			tmplName.PER_CONTRACT_ENT_TAB_HISTORY		= "PerContract_Ent_Tab_History";
			tmplName.PER_CONTRACT_ENT_TAB_DOCUMENT		= "PerContract_Ent_Tab_Document";
			
			tmplName.PER_CONTRACT_CURRENCY				= "PerContract_Currency";
			tmplName.PER_CONTRACT_PAYMENT_METHOD		= "PerContract_Payment_Method";
			tmplName.PER_CONTRACT_DEADLINE				= "Sor_Order_Payment_Deadline";
			tmplName.PER_CONTRACT_SELECT_TAX_SYSTEM		= "Sor_Contract_Select_Tax_System";
			
			tmplName.PER_CONTRACT_SELECT_COUNTRY		= "PerContract_Country";
			tmplName.PER_SEL_LIST_TYPE_PERSON			= "PerContract_Person";
			tmplName.PER_CONTRACT_SELECT_UNIT			= "PerContract_Unit";
			
			tmplName.PER_CONTRACT_LIST_FILTER_BOX				= "PerContract_List_Filter_Box";
			tmplName.PER_CONTRACT_LIST_FILTER_HEADER			= "PerContract_List_Filter_Header";
			tmplName.PER_CONTRACT_LIST_FILTER_CONTENT			= "PerContract_List_Filter_Content";

			
			if (!App.controller.PerContract)				
				 App.controller.PerContract				= {};
			
			if (!App.controller.PerContract.Main)	
				App.controller.PerContract.Main 		= this; //important for other controller can get ref, when new this controller,
			
			if (!App.controller.PerContract.List		)  
				 App.controller.PerContract.List		= new PerContractList			("#div_PerContract_List_Header", "#div_PerContract_List", "#div_PerContract_List_Content");				
			if (!App.controller.PerContract.Ent			)  
				 App.controller.PerContract.Ent			= new PerContractEnt			(null, "#div_PerContract_Ent", null);
			if (!App.controller.PerContract.EntBtn		)  
				 App.controller.PerContract.EntBtn		= new PerContractEntBtn			(null, "#div_PerContract_Ent_Btn", null);
			if (!App.controller.PerContract.EntHeader	)  
				 App.controller.PerContract.EntHeader	= new PerContractEntHeader		(null, "#div_PerContract_Ent_Header", null);
			if (!App.controller.PerContract.EntTabs		)  
				 App.controller.PerContract.EntTabs		= new PerContractEntTabs		(null, "#div_PerContract_Ent_Tabs", null);
			
			//----------tab name----------------------------------------------------------------------------------------
			if (!App.controller.PerContract.EntTabInfo)  
				 App.controller.PerContract.EntTabInfo		= new PerContractEntTabInfo		(null, "#div_PerContract_Ent_Tab_Info", null);
			if (!App.controller.PerContract.EntTabDetail)  
				 App.controller.PerContract.EntTabDetail	= new PerContractEntTabDetail	(null, "#div_PerContract_Ent_Tab_Detail", null);
			if (!App.controller.PerContract.EntTabDocument)  
				 App.controller.PerContract.EntTabDocument	= new PerContractEntTabDocument	(null, "#div_PerContract_Ent_Tab_Doc", null);
			if (!App.controller.PerContract.EntTabHistory)  
				 App.controller.PerContract.EntTabHistory	= new PerContractEntTabHistory	(null, "#div_PerContract_Ent_Tab_History", null);
			if (!App.controller.PerContract.EntTabContent)  
				 App.controller.PerContract.EntTabContent	= new PerContractEntTabContent	(null, "#div_PerContract_Ent_Tab_Content", null);
			//--------------------------------------------------------------------------------------------------
			
			App.data["HttpSecuHeader"]				= req_gl_Security_HttpHeader (App.keys.KEY_STORAGE_CREDENTIAL);
			
			App.controller.PerContract.List				.do_lc_init();
			App.controller.PerContract.Ent				.do_lc_init();
			App.controller.PerContract.EntBtn			.do_lc_init();
			App.controller.PerContract.EntHeader		.do_lc_init();
			App.controller.PerContract.EntTabs			.do_lc_init();
			App.controller.PerContract.EntTabInfo		.do_lc_init();
			App.controller.PerContract.EntTabDetail		.do_lc_init();
			App.controller.PerContract.EntTabDocument	.do_lc_init();
			App.controller.PerContract.EntTabHistory	.do_lc_init();
			App.controller.PerContract.EntTabContent	.do_lc_init();
			//----------------------------------------------//			
			
			
//			do_get_tp_list(1010004);
			do_get_tp_list(1010003);
			do_Get_Lst_Cfg_Group();
			do_get_per_societe(societeListCompany);
			do_get_per_societe(societeListChild);
		}
		
		
		this.do_lc_show = function(){
			try { 
				App.data["HttpSecuHeader"]				= req_gl_Security_HttpHeader (App.keys.KEY_STORAGE_CREDENTIAL);
			
				tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_MAIN	, PerContract_Main); 
				tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_LIST	, PerContract_List); 
				
				$(pr_divContent)			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_MAIN	, {}));	
//				do_gl_apply_right($(pr_divContent));
				$("#div_PerContract_List")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_LIST	, {}));
				
				self.do_lc_show_lst_contract();
				App.controller.PerContract.Ent	.do_lc_show(null);
				
//				do_gl_init_Resizable("#div_PerContract_List");	
							
			}catch(e) {				
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.contract", "PerContractMain", "do_lc_show", e.toString()) ;
			}

		};
		
		this.do_lc_show_lst_contract = function(){
			App.controller	.PerContract.List	.do_lc_show("#div_PerContract_List_Init"	, 0);
			App.controller	.PerContract.List	.do_lc_show("#div_PerContract_List_Ok"		, 1);
			App.controller	.PerContract.List	.do_lc_show("#div_PerContract_List_Calcel"	, 2);
			App.controller	.PerContract.List	.do_lc_show("#div_PerContract_List_Expired"	, 3);
			App.controller	.PerContract.List	.do_lc_show_filter();
		}
		
		this.do_lc_binding_pages = function(div, options) {
			try {
				if(div.length>0) do_gl_enhance_within(div, options);
			} catch (e) {
				console.log(e);
				self.do_show_Msg(null, e);
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
		var do_Get_Lst_Cfg_Group= function(){
			var ref 		= req_gl_Request_Content_Send('ServiceCfgValue', 'SVCfgGroupLst');			
			var idGroup 	= [10,11,14,15,16,17,31];
			ref['ids'	]	= JSON.stringify(idGroup);
			ref['withValue']= true;
			var fSucces		= [];		
			fSucces.push(req_gl_funct(null, do_Get_Lst_Cfg_Group_Response, []));	
			
			var fError 		= req_gl_funct(App, self.do_show_Msg, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
		var do_Get_Lst_Cfg_Group_Response = function(sharedJson) {
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				var data = sharedJson[App['const'].RES_DATA];
				App.data["cfg"] = {};
				$.each(data, function(i, e) {
					switch (e.id) {
					case 15:
						App.data['currency'] = e.vals;
						tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_CURRENCY					, Per_Sel_List_Cfg); 
						tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_CURRENCY			, e.vals);
						break;
					case 16:
						App.data['pay_method'] = e.vals;
						tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_PAYMENT_METHOD			, Per_Sel_List_Cfg); 
						tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_PAYMENT_METHOD		, e.vals);
						break;
					case 17:
						App.data['deadline'] = e.vals;
						tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_DEADLINE					, Per_Sel_List_Cfg); 
						tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_DEADLINE			, e.vals);
						break;
					case 14:
						App.data['tax'] = e.vals;
						tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_SELECT_TAX_SYSTEM		, Per_Sel_List_Cfg); 
						tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_SELECT_TAX_SYSTEM	, e.vals);
						break;
					case 10:
						App.data['country'] = e.vals;
						tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_SELECT_COUNTRY			, Per_Sel_List_Cfg); 
						tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_SELECT_COUNTRY		, e.vals);
						break;
					case 31:
						App.data['unit']	= [];
						for(var i=0; i < e.vals.length; i++){
							if(e.vals[i].val03 > "2")
								App.data['unit'].push(e.vals[i]);
						}
						tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_SELECT_UNIT		, Per_Sel_List_Cfg); 
						tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_SELECT_UNIT	, App.data['unit']);
						break;
					}
					
					App.data["cfg"][e.id] = e.vals;
				});
			}
		}
		
		var do_Get_Cfg_Values= function(){
			//ajax to get all fix values here			
			var ref 		= req_gl_Request_Content_Send('SVCfgClass', 'SVCfgService');			
		
			var fSucces		= [];		
			fSucces.push(req_gl_funct(App, App.funct.put, ['cfg_value_01']));	
			
			var fError 		= req_gl_funct(App, self.do_show_Msg, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}	
		

		function do_get_tp_list(type){	
			var ref 		= req_gl_Request_Content_Send('ServicePerPerson', 'SVPersonLst');
			
			
			ref["stat"]	= 1;
		
			ref["typ02"]	= type;
			var fSucces		= [];
			fSucces.push(req_gl_funct(App, App.funct.put));
			if(type == 1010003){				
				fSucces.push(req_gl_funct(null, do_get_tp_response));
			}				
			if(type == 1010004){
				fSucces.push(req_gl_funct(null, do_get_client_response));
			}
			var fError 		= req_gl_funct(App, self.do_show_Msg, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_get_client_response = function(sharedJson) {
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				var data = sharedJson.res_data;
				delete App.data["cli_lst"];
				App.data["cli_lst"] = data;
//				$.each(data, function(i, e) {
//					App.data["cli_lst"][e.id]= e;				
//				});
			}
		}
		
		this.req_lc_compile_client_html	= function(idExcluded){
			var data			= $.extend(true, {}, App.data["cli_lst"]);
			delete	data[idExcluded];

			tmplCtrl.do_lc_put_tmpl(tmplName.PER_SEL_LIST_TYPE_PERSON	, Per_Sel_List_Type_Person);
			return tmplCtrl.req_lc_compile_tmpl(tmplName.PER_SEL_LIST_TYPE_PERSON	, data);
		}
		
		this.req_lc_client	= function(idExcluded){
			var data		= [].concat(App.data["cli_lst"]);
			try{
				var id		= parseInt(idExcluded,10);
				for(var i=0; i<data.length; i++){
					if(data[i].id==id){
						data.splice(i,1);
						break;
					}
				}				
			}catch(e){}
//			data[idExcluded]	= undefined;

			return data;
		}
		
		//--------------------------------------------------------------------------------------------
		var do_get_tp_response = function(sharedJson) {
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				var data = sharedJson.res_data;
				delete App.data["tp_lst"];
				App.data["tp_lst"] = {};
				$.each(data, function(i, e) {
					App.data["tp_lst"][e.id]= e;				
				});
			}
		}
		
		var do_get_per_societe = function(typeSoc) {
			//ajax to get all fix values here
			var ref 		= req_gl_Request_Content_Send('ServicePerPerson', 'SVPersonLst');
			ref["typ02"]	= typeSoc;
			
			var fSucces		= [];
			if(typeSoc == societeListCompany)
				fSucces.push(req_gl_funct(App, App.funct.put, ['LstSociete']));
			if(typeSoc == societeListChild)
				fSucces.push(req_gl_funct(App, App.funct.put, ['LstSocieteChild']));
			
			var fError 		= req_gl_funct(App, self.do_show_Msg, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
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
				var pr_ctr_Main	= App.controller.PerContract.Main;
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

	return PerContractMain;
  });