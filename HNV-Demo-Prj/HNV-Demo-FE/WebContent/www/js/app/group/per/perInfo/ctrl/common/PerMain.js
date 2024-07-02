define([
        'jquery',
        
        'text!template/shp/per/common/Per_Main.html',
        
        'text!template/shp/per/partner/PerPartner_List.html',
        'text!template/shp/per/societe/PerSociete_List.html', 
        
        'controller/shp/per/societe/PerSocieteList',
        'controller/shp/per/societe/PerSocieteEnt',
        'controller/shp/per/societe/PerSocieteEntHeader',
        'controller/shp/per/societe/PerSocieteEntBtn',
        'controller/shp/per/societe/PerSocieteEntTabs',
        'controller/shp/per/societe/PerSocieteEntTabBook',
               
        'controller/shp/per/partner/PerPartnerList',
        'controller/shp/per/partner/PerPartnerEnt',
        'controller/shp/per/partner/PerPartnerEntHeader',
        'controller/shp/per/partner/PerPartnerEntBtn',
        'controller/shp/per/partner/PerPartnerEntTabs',
        
        'controller/shp/per/common/PerEntTabDoc',        
        'controller/shp/per/common/PerEntTabAddress',        
        'controller/shp/per/common/PerEntTabBank',
        
//        'controller/per/partner/PerPartnerEntTabReportProducer',
//        'controller/per/partner/PerPartnerEntTabReportSupplier',
//        'controller/per/partner/PerPartnerEntTabReportThirdParty',
        'controller/shp/per/partner/PerPartnerEntTabReportClient',
        'controller/shp/per/partner/PerPartnerEntTabObservation',
        'controller/shp/per/partner/PerPartnerEntTabAccountEntity',
        
//        'controller/per/partner/PerPartnerEntTabAccounts',
//        'controller/per/partner/PerPartnerEntTabOrders',
//        'controller/per/partner/PerPartnerEntTabServices',
        
        'controller/shp/per/common/PerRights'
        ],
        function($,         		
        		Per_Main,
        		
        		PerPartner_List,
        		PerSociete_List,
        		
        		PerSocieteList,
        		PerSocieteEnt, 
        		PerSocieteEntHeader, 
        		PerSocieteEntBtn, 
        		PerSocieteEntTabs,
        		PerSocieteEntTabBook,
        		
        		PerPartnerList,
        		PerPartnerEnt, 
        		PerPartnerEntHeader, 
        		PerPartnerEntBtn,
        		PerPartnerEntTabs,
        		
        		PerEntTabDoc,        		
        		PerEntTabAddress,        		
        		PerEntTabBank,
        		
//        		PerPartnerEntTabReportProducer,
//        		PerPartnerEntTabReportSupplier,
//        		PerPartnerEntTabReportThirdParty,
        		PerPartnerEntTabReportClient,
        		PerPartnerEntTabObservation,
        		PerPartnerEntTabAccountEntity,
        		
//        		PerPartnerEntTabAccounts,
//        		PerPartnerEntTabOrders,
//        		PerPartnerEntTabServices,

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
		
		//------------------------------------------------------------------------------------
		
		this.var_lc_MODE_INIT 		= 0;
		this.var_lc_MODE_NEW 		= 1; //duplicate is the mode new after clone object
		this.var_lc_MODE_MOD 		= 2;
		this.var_lc_MODE_DEL 		= 3;	
		this.var_lc_MODE_SEL 		= 5;
		
		var pageSoc					= 10;//type02:: 10
		var pageClient				= 1; //type02:: 1
		var pageTParty				= 2; 
		var pageSupplier			= 3; 
		var pageProducer			= 4; 
		//type02:
		// - CLIENT   1010002
		// - SUPPLIER 1010003
		// - TPARTY   1010006
			
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
			
			//----------COMMON ----------------------------------------------------------------------------------------
			if (!App.controller.Per.Main)	
				 App.controller.Per.Main 			= this;
			if (!App.controller.Per.Rights)	
				 App.controller.Per.Rights 			= new PerRights();
			
			this.var_lc_URL_Aut_Header				= req_gl_Security_HttpHeader (App.keys.KEY_STORAGE_CREDENTIAL);
			
			//important for other controller can get ref, when new this controller
			
			doGetCfgValue('cfgValListTypePerson', 				100, 	null);		//Moral or Natural
			doGetCfgValue('cfgValListTypeLegalStatN', 			102, 	1);			//Legal Status of Moral		: SARL, SA, SAS...
			doGetCfgValue('cfgValListTypeLegalStatM', 			102,	2);			//Legal Status of Natural	: Mr, Mrs
			doGetCfgValue('cfgValListTypeDomainPartner', 		1001,	null);      //Type Domain partner: hotel, restaurant,...
			doGetCfgValue('cfgValListTypeAddress', 				23,		1);			//Addresses
			doGetCfgValue('cfgValListCountry', 					10,		null);			//Country
			doGetCfgValue('cfgValListBank', 					24,		null);		//Banks - don't need to translate.
			
//			doGetTpyCategory('cfgValListBank', 					30003,	null);		//Banks - don't need to translate.
//			do_Get_Lst_Cfg_Group();
//			do_Get_Lst_Cat_Event();
				
			//----------PAGE SOCIETE ------------------------------------------------------------------------------------
			if(page == pageSoc){
				if (!App.controller.Per.List)  
					 App.controller.Per.List					= new PerSocieteList						(null, null , null);				
				if (!App.controller.Per.Ent)  	
					 App.controller.Per.Ent						= new PerSocieteEnt							(null, "#div_Per_Ent" , null);
				if (!App.controller.Per.EntBtn)  
					 App.controller.Per.EntBtn					= new PerSocieteEntBtn						(null, null , null);
				if (!App.controller.Per.EntHeader)
					 App.controller.Per.EntHeader				= new PerSocieteEntHeader					(null, "#div_Per_Ent_Header" , null);
				if (!App.controller.Per.EntTabs	)  
					 App.controller.Per.EntTabs					= new PerSocieteEntTabs						(null, "#div_Per_Ent_Tabs", null);
				
				if (!App.controller.Per.EntTabBook)  
					 App.controller.Per.EntTabBook				= new PerSocieteEntTabBook					(null, "#div_Per_Ent_Tab_Book", null);
			} 
					//----------PAGE PARTNER ------------------------------------------------------------------------------------
			else {
				do_get_per_societe(societeListCompany);
				do_get_per_societe(societeListChild);
				
				if (!App.controller.Per.List)  
					 App.controller.Per.List					= new PerPartnerList						(null, null , null);				
				if (!App.controller.Per.Ent)  
					 App.controller.Per.Ent						= new PerPartnerEnt							(null, "#div_Per_Ent" , null);
				if (!App.controller.Per.EntBtn)  
					 App.controller.Per.EntBtn					= new PerPartnerEntBtn						(null, null , null);
				if (!App.controller.Per.EntHeader)
					 App.controller.Per.EntHeader				= new PerPartnerEntHeader					(null, "#div_Per_Ent_Header" , null);
				if (!App.controller.Per.EntTabs	)  
					 App.controller.Per.EntTabs					= new PerPartnerEntTabs						(null, "#div_Per_Ent_Tabs", null);
				
				if (!App.controller.Per.EntTabObservation)  
					 App.controller.Per.EntTabObservation		= new PerPartnerEntTabObservation			(null, "#div_Per_Ent_Tab_Observation", null);
				if (!App.controller.Per.EntTabAccountEntity)  
					 App.controller.Per.EntTabAccountEntity		= new PerPartnerEntTabAccountEntity			(null, "#div_Per_Ent_Tab_Account_Entity", null);		
				
//				if (!App.controller.Per.EntTabReportProducer)  
//					 App.controller.Per.EntTabReportProducer	= new PerPartnerEntTabReportProducer		(null, "#div_PerPartner_Ent_Tab_Report", null);
//				if (!App.controller.Per.EntTabReportSupplier)  
//					 App.controller.Per.EntTabReportSupplier	= new PerPartnerEntTabReportSupplier		(null, "#div_PerPartner_Ent_Tab_Report", null);
//				if (!App.controller.Per.EntTabReportThirdParty)  
//					 App.controller.Per.EntTabReportThirdParty	= new PerPartnerEntTabReportThirdParty		(null, "#div_PerPartner_Ent_Tab_Report", null);
				if (!App.controller.Per.EntTabReportClient)  
					 App.controller.Per.EntTabReportClient		= new PerPartnerEntTabReportClient			(null, "#div_PerPartner_Ent_Tab_Report", null);
				
//				if (!App.controller.Per.EntTabAccounts)  
//					 App.controller.Per.EntTabAccounts			= new PerPartnerEntTabAccounts();
//				if (!App.controller.Per.EntTabOrders)  
//					 App.controller.Per.EntTabOrders			= new PerPartnerEntTabOrders();
//				if (!App.controller.Per.EntTabServices)  
//					 App.controller.Per.EntTabServices			= new PerPartnerEntTabServices();
			
				//App.controller.Per.EntTabReportProducer		.do_lc_init();
				//App.controller.Per.EntTabReportSupplier		.do_lc_init();
				//App.controller.Per.EntTabReportThirdParty		.do_lc_init();
				//App.controller.Per.EntTabReportClient			.do_lc_init();
				App.controller.Per.EntTabObservation		.do_lc_init();
				App.controller.Per.EntTabAccountEntity		.do_lc_init();
				//App.controller.Per.EntTabAccounts				.do_lc_init();
				//App.controller.Per.EntTabOrders					.do_lc_init();
				//App.controller.Per.EntTabServices				.do_lc_init();
			}

			//----------common--------------------------------------
			if (!App.controller.Per.EntTabAddress)  
				 App.controller.Per.EntTabAddress			= new PerEntTabAddress						(null, "#div_Per_Ent_Tab_Address", null);
			if (!App.controller.Per.EntTabBank)  
				 App.controller.Per.EntTabBank				= new PerEntTabBank							(null, "#div_Per_Ent_Tab_Bank", null);
			if (!App.controller.Per.EntTabDoc)  
				 App.controller.Per.EntTabDoc				= new PerEntTabDoc							(null, "#div_Per_Ent_Tab_Doc", null);
			
			var partnerType = null;
			if(page == pageClient	) partnerType = typePartnerClient;
			if(page == pageTParty	) partnerType = typePartnerThirdparty;
			if(page == pageSupplier	) partnerType = typePartnerSupplier;
			if(page == pageProducer	) partnerType = typePartnerProducer;
			
			
			App.controller.Per.List						.do_lc_init();
			App.controller.Per.Ent						.do_lc_init();
			if(page == pageSoc){
				App.controller.Per.EntBtn				.do_lc_init();
				App.controller.Per.EntTabBook			.do_lc_init();
			}
			else
				App.controller.Per.EntBtn				.do_lc_init(partnerType);
			App.controller.Per.EntHeader				.do_lc_init();
			App.controller.Per.EntTabs					.do_lc_init();
			App.controller.Per.EntTabAddress			.do_lc_init();
//			App.controller.Per.EntTabDoc				.do_lc_init();
			App.controller.Per.EntTabBank				.do_lc_init();
		}
		
		this.do_lc_show = function(page){
			try { 
				tmplCtrl		.do_lc_put_tmpl(tmplName.PER_MAIN	, Per_Main);
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_MAIN, {}));
				
				if(page == pageSoc){
					doGetCfgValue('cfgValListTypePartner',	101,	4);
					tmplCtrl		.do_lc_put_tmpl(tmplName.PER_LIST, PerSociete_List); 
					$("#div_Per_List").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_LIST, {}));
					App.controller	.Per.List.do_lc_show(societeListCompany);
					App.controller	.Per.List.do_lc_show(societeListChild);
				}else {
					tmplCtrl		.do_lc_put_tmpl(tmplName.PER_LIST, PerPartner_List); 
					$("#div_Per_List").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_LIST, {}));
					
					doGetCfgValue('cfgValListTypePartner',	101,	2, true);
					doGetCfgValue('cfgValListTypePartner',	101,	3, true);

					if(page == pageClient){						
						$("#div_PerPartner_List_New"		).show();
						$("#div_PerPartner_List_Client"		).show();
						$("#div_PerPartner_List_Prospect"	).show();
						$("#div_PerPartner_List_Supplier"	).hide();
						$("#div_PerPartner_List_Doctor"		).hide();
						$("#div_PerPartner_List_Thirdparty"	).hide();
						$("#div_PerPartner_List_Producer"	).hide();
						$("#div_PerPartner_List_Filter"		).hide();
						App.controller	.Per.List.do_lc_show(typePartnerNew, null, null, typePartnerClient+","+typePartnerProspect );
						App.controller	.Per.List.do_lc_show(typePartnerClient);
						App.controller	.Per.List.do_lc_show(typePartnerProspect);
						
					} else if (page == pageSupplier){						
						$("#div_PerPartner_List_New"		).show();
						$("#div_PerPartner_List_Client"		).hide();
						$("#div_PerPartner_List_Prospect"	).hide();
						$("#div_PerPartner_List_Supplier"	).show();
						$("#div_PerPartner_List_Doctor"		).hide();
						$("#div_PerPartner_List_Thirdparty"	).hide();
						$("#div_PerPartner_List_Producer"	).hide();
						$("#div_PerPartner_List_Filter"		).hide();
						App.controller	.Per.List.do_lc_show(typePartnerNew, null, null, typePartnerSupplier );
						App.controller	.Per.List.do_lc_show(typePartnerSupplier);
						
					} else if (page == pageProducer){	
						$("#div_PerPartner_List_New"		).show();
						$("#div_PerPartner_List_Client"		).hide();
						$("#div_PerPartner_List_Prospect"	).hide();
						$("#div_PerPartner_List_Supplier"	).hide();
						$("#div_PerPartner_List_Doctor"		).hide();
						$("#div_PerPartner_List_Thirdparty"	).hide();
						$("#div_PerPartner_List_Producer"	).show();
						$("#div_PerPartner_List_Filter"		).hide();
						App.controller	.Per.List.do_lc_show(typePartnerNew, null, null, typePartnerProducer );
						App.controller	.Per.List.do_lc_show(typePartnerProducer);
						
					} else if (page == pageTParty){	
						$("#div_PerPartner_List_New"		).show();
						$("#div_PerPartner_List_Client"		).hide();
						$("#div_PerPartner_List_Prospect"	).hide();
						$("#div_PerPartner_List_Supplier"	).hide();
						$("#div_PerPartner_List_Doctor"		).hide();
						$("#div_PerPartner_List_Thirdparty"	).show();
						$("#div_PerPartner_List_Producer"	).hide();
						$("#div_PerPartner_List_Filter"		).hide();
						App.controller	.Per.List.do_lc_show(typePartnerNew, null, null, typePartnerThirdparty );
						App.controller	.Per.List.do_lc_show(typePartnerThirdparty);	
						
					} else {
						$("#div_PerPartner_List_New"		).show();
						$("#div_PerPartner_List_Client"		).hide();
						$("#div_PerPartner_List_Prospect"	).hide();
						$("#div_PerPartner_List_Supplier"	).hide();
						$("#div_PerPartner_List_Doctor"		).hide();
						$("#div_PerPartner_List_Thirdparty"	).hide();
						$("#div_PerPartner_List_Producer"	).hide();
						$("#div_PerPartner_List_Filter"		).show();
						App.controller	.Per.List.do_lc_show(typePartnerNew, null, null, societeListCompany+","+societeListChild );
						App.controller	.Per.List.do_lc_show(societeListCompany);
						App.controller	.Per.List.do_lc_show(societeListChild);
//						App.controller	.Per.List.do_lc_show_filter(page);
					}
				}
				App.controller.Per.Ent.do_lc_show(null);
				
				do_gl_init_Resizable("#div_Per_List");
			}catch(e) {
				do_gl_show_Notify_Msg_Error("PerMain: " + e.toString());
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.main", "PerMain", "do_lc_show", e.toString()) ;
			}
		};
		
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
		
		//---------Enhance Within---------
		this.do_lc_binding_pages = function(div, options) {
			try {
				if(div.length>0) do_gl_enhance_within(div, options);
			} catch (e) {
				do_gl_show_Notify_Msg_Error("PerPartnerMain > do_lc_binding_pages :" + e.toString());
			}
		};
		
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