define([
        'jquery',
        
        'text!template/per/common/Per_Main.html',
        
        'text!template/per/partner/PerPartner_List.html',
        'text!template/per/societe/PerSociete_List.html',
        'text!template/per/contract/PerContract_List.html',
        
        'controller/per/societe/PerSocieteList',
        'controller/per/societe/PerSocieteEnt',
        'controller/per/societe/PerSocieteEntHeader',
        'controller/per/societe/PerSocieteEntBtn',
        'controller/per/societe/PerSocieteEntTabs',
               
        'controller/per/partner/PerPartnerList',
        'controller/per/partner/PerPartnerEnt',
        'controller/per/partner/PerPartnerEntHeader',
        'controller/per/partner/PerPartnerEntBtn',
        'controller/per/partner/PerPartnerEntTabs',
        
        'controller/per/common/PerEntTabDoc',        
        'controller/per/common/PerEntTabAddress',        
        'controller/per/common/PerEntTabBank',
        
        'controller/per/partner/PerPartnerEntTabReportProducer',
        'controller/per/partner/PerPartnerEntTabReportSupplier',
        'controller/per/partner/PerPartnerEntTabReportThirdParty',
        'controller/per/partner/PerPartnerEntTabReportClient',
        
        'controller/per/contract/PerContractList',
        'controller/per/contract/PerContractEnt',
        'controller/per/contract/PerContractEntHeader',
        'controller/per/contract/PerContractEntBtn',
        'controller/per/contract/PerContractEntTabs',
        'controller/per/contract/PerContractEntTab01',
        
        'controller/per/common/PerRights'
        ],
        function($,         		
        		Per_Main,
        		
        		PerPartner_List,
        		PerSociete_List,
        		PerContract_List,
        		
        		PerSocieteList,
        		PerSocieteEnt, 
        		PerSocieteEntHeader, 
        		PerSocieteEntBtn, 
        		PerSocieteEntTabs,        	
        		
        		PerPartnerList,
        		PerPartnerEnt, 
        		PerPartnerEntHeader, 
        		PerPartnerEntBtn,
        		PerPartnerEntTabs,
        		
        		PerEntTabDoc,        		
        		PerEntTabAddress,        		
        		PerEntTabBank,
        		
        		PerPartnerEntTabReportProducer,
        		PerPartnerEntTabReportSupplier,
        		PerPartnerEntTabReportThirdParty,
        		PerPartnerEntTabReportClient,
        		
        		PerContractList,
        		PerContractEnt, 
        		PerContractEntHeader, 
        		PerContractEntBtn, 
        		PerContractEntTabs,
        		PerContractEntTab01,
        		
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
		var pagePartner				= 2; //type02:: producer: 2, provider:3, tparty: 4
		var pageContract			= 20;
		
		//-----------------------------------------------------------------------------------
		
		var typePartnerClient		= 1010002;
		
		var typePartnerSupplier		= 1010003;
		var typePartnerProducer		= 1010004;
		var typePartnerDoctor		= 1010005;
		var typePartnerThirdparty	= 1010006;
		
		var societeListCompany		= 1010010;
		var societeListChild		= 1010011;
		
		this.var_lc_URL_Aut_Header	= null;
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
			doGetCfgValue('cfgValListTypeLegalStatM', 			102, 	1);			//Legal Status of Moral		: SARL, SA, SAS...
			doGetCfgValue('cfgValListTypeLegalStatN', 			102,	2);			//Legal Status of Natural	: Mr, Mrs
			doGetCfgValue('cfgValListTypeAddress', 				23,		1);			//Addresses
			//doGetCfgValue('cfgValListBank', 					24,		null);		//Banks - don't need to translate.
			
			doGetTpyCategory('cfgValListBank', 					30003,	null);		//Banks - don't need to translate.
			do_Get_Lst_Cfg_Group();
				
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
								
				if (!App.controller.Per.EntTabAddress)  
					 App.controller.Per.EntTabAddress			= new PerEntTabAddress						(null, "#div_Per_Ent_Tab_Address", null);
				if (!App.controller.Per.EntTabBank)  
					 App.controller.Per.EntTabBank				= new PerEntTabBank							(null, "#div_Per_Ent_Tab_Bank", null);
				if (!App.controller.Per.EntTabDoc)  
					 App.controller.Per.EntTabDoc				= new PerEntTabDoc							(null, "#div_Per_Ent_Tab_Doc", null);
			} 
			//----------PAGE CONTRACT ------------------------------------------------------------------------------------
			else if(page == pageContract){ 
				if (!App.controller.Per.List)  
					 App.controller.Per.List					= new PerContractList						(null, null , null);				
				if (!App.controller.Per.Ent)  	
					 App.controller.Per.Ent						= new PerContractEnt						(null, "#div_Per_Ent" , null);
				if (!App.controller.Per.EntBtn)  
					 App.controller.Per.EntBtn					= new PerContractEntBtn						(null, null , null);
				if (!App.controller.Per.EntHeader)
					 App.controller.Per.EntHeader				= new PerContractEntHeader					(null, "#div_Per_Ent_Header" , null);
				if (!App.controller.Per.EntTabs	)  
					 App.controller.Per.EntTabs					= new PerContractEntTabs					(null, "#div_Per_Ent_Tabs", null);
				if (!App.controller.Per.EntTab01)  
					 App.controller.Per.EntTab01				= new PerContractEntTab01					(null, "#div_Per_Ent_Tab_Doc", null);
				
				
			} 
			//----------PAGE PARTNER ------------------------------------------------------------------------------------
			else {
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
				
				
				if (!App.controller.Per.EntTabReportProducer)  
					 App.controller.Per.EntTabReportProducer	= new PerPartnerEntTabReportProducer		(null, "#div_PerSociete_Ent_Tab_Report_Producer", null);
				if (!App.controller.Per.EntTabReportSupplier)  
					 App.controller.Per.EntTabReportSupplier	= new PerPartnerEntTabReportSupplier		(null, "#div_PerSociete_Ent_Tab_Report_Supplierr", null);
				if (!App.controller.Per.EntTabReportThirdParty)  
					 App.controller.Per.EntTabReportThirdParty	= new PerPartnerEntTabReportThirdParty		(null, "#div_PerSociete_Ent_Tab_Report_ThirdParty", null);
				if (!App.controller.Per.EntTabReportClient)  
					 App.controller.Per.EntTabReportClient		= new PerPartnerEntTabReportClient			(null, "#div_PerSociete_Ent_Tab_Report_Client", null);
				
				if (!App.controller.Per.EntTabAddress)  
					 App.controller.Per.EntTabAddress			= new PerEntTabAddress						(null, "#div_Per_Ent_Tab_Address", null);
				if (!App.controller.Per.EntTabBank)  
					 App.controller.Per.EntTabBank				= new PerEntTabBank							(null, "#div_Per_Ent_Tab_Bank", null);
				if (!App.controller.Per.EntTabDoc)  
					 App.controller.Per.EntTabDoc				= new PerEntTabDoc							(null, "#div_Per_Ent_Tab_Doc", null);
				
				App.controller.Per.EntTabReportProducer		.do_lc_init();
				App.controller.Per.EntTabReportSupplier		.do_lc_init();
				App.controller.Per.EntTabReportThirdParty	.do_lc_init();
				App.controller.Per.EntTabReportClient		.do_lc_init();
			}

			//----------common--------------------------------------
			
			
			App.controller.Per.List						.do_lc_init();
			App.controller.Per.Ent						.do_lc_init();
			App.controller.Per.EntBtn					.do_lc_init();
			App.controller.Per.EntHeader				.do_lc_init();
			App.controller.Per.EntTabs					.do_lc_init();
			App.controller.Per.EntTabAddress			.do_lc_init();
			App.controller.Per.EntTabDoc				.do_lc_init();
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
				}else if(page == pageContract){ 
					doGetCfgValue('cfgValListTypeContract',	101,	4);
					tmplCtrl		.do_lc_put_tmpl(tmplName.PER_LIST, PerContractList); 
					$("#div_Per_List").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_LIST, {}));
					App.controller	.Per.List.do_lc_show();
				}else {
					tmplCtrl		.do_lc_put_tmpl(tmplName.PER_LIST, PerPartner_List); 
					$("#div_Per_List").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_LIST, {}));
					if(page == pageClient){
						doGetCfgValue('cfgValListTypePartner',	101,	2);
						$("#div_PerPartner_List_Supplier"	).hide();
						$("#div_PerPartner_List_Producer"	).hide();
						$("#div_PerPartner_List_Doctor"	).hide();
						$("#div_PerPartner_List_Thirdparty"	).hide();		
						App.controller	.Per.List.do_lc_show(typePartnerClient);
					} else {
						doGetCfgValue('cfgValListTypePartner',	101,	3);
						$("#div_PerPartner_List_Client"		).hide();
						App.controller	.Per.List.do_lc_show(typePartnerProducer);
						App.controller	.Per.List.do_lc_show(typePartnerSupplier);
						App.controller	.Per.List.do_lc_show(typePartnerDoctor);
						App.controller	.Per.List.do_lc_show(typePartnerThirdparty);
					}
				}
				App.controller.Per.Ent.do_lc_show(null);
			}catch(e) {
				do_gl_show_Notify_Msg_Error("PerMain: " + e.toString());
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.main", "PerMain", "do_lc_show", e.toString()) ;
			}
		};

		//---------GetCFG Value---------
		function doGetCfgValue(varname, idGroup, val02){	
			var ref 		= req_gl_Request_Content_Send('ServicePerPerson', 'SVPersonGetCfg');
			ref['idGroup']	= idGroup;
			ref['val02']	= val02;
			var fSucces		= [];		
			fSucces.push(req_gl_funct(App, App.funct.put, [varname]));
			fSucces.push(req_gl_funct(null, translateCFGValue, varname));
			var fError 		= req_gl_funct(App, self.do_show_Msg, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
		function doGetTpyCategory(varname, parentType, val02){	
			var ref 		= req_gl_Request_Content_Send('ServiceTpyCategory', 'SVTpyCategoryLst');
			ref['parType']	= parentType;
			ref['val02']	= val02;
			var fSucces		= [];		
			fSucces.push(req_gl_funct(App, App.funct.put, [varname]));
			//fSucces.push(req_gl_funct(null, translateCFGValue, varname));
			var fError 		= req_gl_funct(App, self.do_show_Msg, [$.i18n("common_err_ajax")]);	
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}
		
		var do_Get_Lst_Cfg_Group= function(){
			//ajax to get all fix values here			
			var ref 		= req_gl_Request_Content_Send('ServiceTpyCategory', 'SVTpyCategoryLst');	
			ref["parType"]	= 20400;
			var fSucces		= [];		
			fSucces.push(req_gl_funct(App, App.funct.put, ["unitRef"]));	
			
			var fError 		= req_gl_funct(App, self.do_show_Msg, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}	
		
		function translateCFGValue(sharedJson, varname){
			var list =  App.data[varname];
			for(var i = 0; i <list.length; i++){
				list[i].name = $.i18n(list[i].val01);			
			}
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
		this.do_show_Msg= function(sharedJson, msg){
			//alert(msg);
			console.log("do_show_Msg::" + msg);
		}	
	};

	return PerMain;
  });