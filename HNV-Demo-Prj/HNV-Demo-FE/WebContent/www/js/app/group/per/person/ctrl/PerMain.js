define([
	'jquery',

	'text!template/shp/per/common/Per_Main.html',

	'text!template/shp/per/Per_List.html',
	'text!template/shp/per/Per_Ent.html',

	'controller/shp/per/PerList',
	
	'controller/shp/per/PerEnt',
	'controller/shp/per/PerEntHeader',
	'controller/shp/per/PerEntBtn',
	'controller/shp/per/PerEntTabs',
	'controller/shp/per/PerEntTabOrders',
	'controller/shp/per/PerEntTabNote',
	'controller/shp/per/PerEntTabFinance',
	'controller/shp/per/PerEntTabDoc',
	

	'controller/shp/per/common/PerRights'
	],
	function($,         		
			Per_Main,

			Per_List,
			Per_Ent,

			PerList,
			
			PerEnt, 
			PerEntHeader, 
			PerEntBtn,
			PerEntTabs,
			PerEntTabOrders,
			PerEntTabNote,
			PerEntTabFinance,
			PerEntTabDoc,
			PerRights
	) {

	var PerMain 	= function (header,content,footer, grpName) {
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

		var pr_per_Person_Type = 0;

		//------------------------------------------------------------------------------------

		this.var_lc_MODE_INIT 		= 0;
		this.var_lc_MODE_NEW 		= 1; //duplicate is the mode new after clone object
		this.var_lc_MODE_MOD 		= 2;
		this.var_lc_MODE_DEL 		= 3;	
		this.var_lc_MODE_SEL 		= 5;

		var pageClient				= 1; //type02:: 1
		var pageTParty				= 2; 
		var pageSupplier			= 3; 
		var pageProducer			= 4; 

		//-----------------------------------------------------------------------------------
		var typePersonMoral			= 1000001;
		var typePersonNatural		= 1000002;

		var typePartnerNew			= 0;

		var typePartnerClient		= 1010002;
		var typePartnerProspect		= 1010007;

		var typePartnerSupplier		= 1010003;
		var typePartnerProducer		= 1010004;
		//var typePartnerDoctor		= 1010005;
		var typePartnerThirdparty	= 1010006;

		var societeListCompany		= 1010010;
		var societeListChild		= 1010011;

		var statPartnerNew			= 3;
		
		this.var_lc_URL_Aut_Header	= null;

		//---------------------------------------------------------------
		this.pr_right_soc_manage	= [30002001, 30002002, 30002003, 30002004, 30002005];
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(page){
			
			this.pr_per_Person_Type = do_get_per_person_type();
			
			tmplName.PER_MAIN					=  "Per_Main";
			
			tmplName.PER_LIST					=  "Per_List";
			tmplName.PER_LIST_CLIENT_HEADER		=  "Per_List_Client_Header"; 		
			tmplName.PER_LIST_PRODUCER_HEADER	=  "Per_List_Producer_Header"; 		
			tmplName.PER_LIST_PROVIDER_HEADER	=  "Per_List_Supplier_Header"; 		
			tmplName.PER_LIST_THIRDPARTY_HEADER	=  "Per_List_Thirdparty_Header"; 	
			
			tmplName.PER_LIST_CONTENT           =  "Per_List_Content";
			
			tmplName.PER_ENT					=  "Per_Ent";
			tmplName.PER_ENT_BTN				=  "Per_Ent_Btn";
			tmplName.PER_ENT_HEADER				=  "Per_Ent_Header";
			tmplName.PER_ENT_TABS				=  "Per_Ent_Tabs";
			tmplName.PER_ENT_TAB_ORDERS		    =  "Per_Ent_Tab_Orders";
			tmplName.PER_ENT_TAB_DOC		    =  "Per_Ent_Tab_Doc";

			//----------COMMON ----------------------------------------------------------------------------------------
			if (!App.controller.Per.Main)	
				App.controller.Per.Main 			= this;
			if (!App.controller.Per.Rights)	
				App.controller.Per.Rights 			= new PerRights();



			if (!App.controller.Per.List)  
				App.controller.Per.List					= new PerList						(null, null , null);				
			if (!App.controller.Per.Ent)  
				App.controller.Per.Ent					= new PerEnt						(null, "#div_Per_Ent" , null);
			if (!App.controller.Per.EntBtn)  
				App.controller.Per.EntBtn				= new PerEntBtn						(null, null , null);
			if (!App.controller.Per.EntHeader)
				App.controller.Per.EntHeader			= new PerEntHeader					(null, "#div_Per_Ent_Header" , null);
			if (!App.controller.Per.EntTabs	)  
				 App.controller.Per.EntTabs				= new PerEntTabs					(null, "#div_Per_Ent_Tabs", null);
			
			if (!App.controller.Per.EntTabOrders)  
				 App.controller.Per.EntTabOrders		= new PerEntTabOrders();

			if (!App.controller.Per.EntTabNote)  
				 App.controller.Per.EntTabNote			= new PerEntTabNote();
			
			if (!App.controller.Per.EntTabDoc)  
				App.controller.Per.EntTabDoc			= new PerEntTabDoc();
			
			if (!App.controller.Per.EntTabFinance)  
				App.controller.Per.EntTabFinance		= new PerEntTabFinance();

			var partnerType = null;
			if(page == pageClient	) partnerType = typePartnerClient;
			if(page == pageTParty	) partnerType = typePartnerThirdparty;
			if(page == pageSupplier	) partnerType = typePartnerSupplier;
			if(page == pageProducer	) partnerType = typePartnerProducer;


			App.controller.Per.List					.do_lc_init();
			App.controller.Per.Ent					.do_lc_init();
			App.controller.Per.EntBtn				.do_lc_init();
			App.controller.Per.EntHeader			.do_lc_init();
			App.controller.Per.EntTabs				.do_lc_init();
			App.controller.Per.EntTabOrders			.do_lc_init();
			App.controller.Per.EntTabFinance		.do_lc_init();
			
			tmplCtrl							.do_lc_put_tmpl(tmplName.PER_MAIN	, Per_Main); 
			tmplCtrl							.do_lc_put_tmpl(tmplName.PER_LIST	, Per_List); 
			
			do_gl_refresh_SecuHeader (self);
		}

		

		this.do_lc_show = function(){
			try { 
				tmplCtrl		.do_lc_put_tmpl(tmplName.PER_MAIN	, Per_Main);
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_MAIN, {}));
				
				$("#div_Per_List")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_LIST, {perPersonType: self.pr_per_Person_Type}));

//				$("#div_Per_List_New"		).show();
				$("#div_Per_List_Client"	).show();
//				$("#div_Per_List_Prospect"	).hide();
				$("#div_Per_List_Supplier"	).show();
//				$("#div_Per_List_Doctor"	).hide();
				$("#div_Per_List_Thirdparty").show();
				$("#div_Per_List_Producer"	).show();
//				$("#div_Per_List_Filter"		).show();
//				App.controller	.Per.List.do_lc_show(typePartnerNew, null, null, societeListCompany+","+societeListChild );
//				App.controller	.Per.List.do_lc_show(societeListCompany);
//				App.controller	.Per.List.do_lc_show(societeListChild);
//				App.controller	.Per.List.do_lc_show_filter(page);
				App.controller	.Per.List.do_lc_show(typePartnerClient);
				App.controller	.Per.List.do_lc_show(typePartnerSupplier);
				App.controller	.Per.List.do_lc_show(typePartnerProducer);
				App.controller	.Per.List.do_lc_show(typePartnerThirdparty);

				App.controller.Per.Ent.do_lc_show(null);

//				do_gl_init_Resizable("#div_Per_List");
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_MaxResize('#div_Per_List', '#div_Per_Ent');
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_Minimize();
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_MinResize('#div_Per_List', '#div_Per_Ent');
			}catch(e) {
				do_gl_show_Notify_Msg_Error("PerMain: " + e.toString());
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.main", "PerMain", "do_lc_show", e.toString()) ;
			}
		};

		var do_get_per_person_type = function(){
			if(App.data.url) {
				var urlParams = req_gl_Url_Params(App.data.url);
				if (urlParams.typ)
					return parseInt(urlParams.typ);
			}

			return 0;
		}

		this.var_lc_URL_Aut_Header				= req_gl_LS_SecurityHeaderBearer (App.keys.KEY_STORAGE_CREDENTIAL);
		
		this.do_verify_user_right_soc_manage = function(){
			if(App.data.user.rights)
				for(var i = 0; i< this.pr_right_soc_manage.length; i++){
					if(App.data.user.rights.includes(this.pr_right_soc_manage[i]))
						return true;
				}

			return false;
		}

		//---------GetCFG Value---------
		function doGetCfgValue(varname, idGroup, val02, forConcat){	
			var ref 		= req_gl_Request_Content_Send('ServicePerPerson', 'SVPersonGetCfg');
			ref['idGroup']	= idGroup;
			ref['val02']	= val02;
			var fSucces		= [];		
			if (!forConcat) 
				fSucces.push(req_gl_funct(App, App.funct.put, [varname]));
			else
				fSucces.push(req_gl_funct(App, App.funct.mergeArray, [varname])); 

			fSucces.push(req_gl_funct(null, translateCFGValue, varname));
			var fError 		= req_gl_funct(App, self.do_show_Msg, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}


		function doGetTpyCategory(varname, parentType, val02, forConcat){	
			var ref 		= req_gl_Request_Content_Send('ServiceTpyCategory', 'SVTpyCategoryLst');
			ref['parType']	= parentType;
			ref['val02']	= val02;
			var fSucces		= [];		
			if (!forConcat) 
				fSucces.push(req_gl_funct(App, App.funct.put, [varname]));
			else
				fSucces.push(req_gl_funct(App, App.funct.mergeArray, [varname])); 

			fSucces.push(req_gl_funct(null, translateCFGValue, varname));
			var fError 		= req_gl_funct(App, self.do_show_Msg, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}

		var do_Get_Lst_Cfg_Group= function(){
			//ajax to get all fix values here			
			var ref 		= req_gl_Request_Content_Send('ServiceTpyCategory', 'SVTpyCategoryLstGroup');	
			ref["parType"]	= 20400;
			var fSucces		= [];		
			fSucces.push(req_gl_funct(App, App.funct.put, ["unitRef"]));	

			var fError 		= req_gl_funct(App, self.do_show_Msg, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}	

		var do_Get_Lst_Cat_Event = function(){
			//ajax to get all fix values here			
			var ref 		= req_gl_Request_Content_Send('ServiceTpyCategory', 'SVTpyCategoryLstCat');	
			ref["parTyp"]	= 30005;
			var fSucces		= [];		
			fSucces.push(req_gl_funct(App, App.funct.put, ["event"]));	

			var fError 		= req_gl_funct(App, self.do_show_Msg, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}

		function translateCFGValue(sharedJson, varname){
			var list =  App.data[varname];
			for(var i = 0; i <list.length; i++){
				list[i].name = $.i18n(list[i].val01);			
			}
		}

		var do_get_per_societe = function(typeSoc) {
			//ajax to get all fix values here
			var ref 		= req_gl_Request_Content_Send('ServicePerPerson', 'SVPersonLst');
			ref["typ02"]	= typeSoc;

			var fSucces		= [];
			if(typeSoc != societeListChild)
				fSucces.push(req_gl_funct(App, App.funct.put, ['LstSociete']));

			if(typeSoc == societeListChild)
				fSucces.push(req_gl_funct(App, App.funct.put, ['LstSocieteChild']));

			var fError 		= req_gl_funct(App, self.do_show_Msg, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_bg (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
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
				var pr_ctr_Main	= App.controller.Per.Main;
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

	return PerMain;
});