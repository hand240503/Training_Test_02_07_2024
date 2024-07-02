define([
	'jquery',
     'text!template/shp/per/societe/PerSociete_List_Company_Header.html',
     'text!template/shp/per/societe/PerSociete_List_Child_Header.html',  
     
     'text!template/shp/per/common/PerSociete_List_Content.html'
	],
	function($, 
			PerSociete_List_Company_Header,
			PerSociete_List_Child_Header,
			PerSociete_List_Content
	) 
	{

	var PerSocieteList 	= function (header,content,footer, grpName) {
		var pr_divHeader 			= header  ? $(header) : null;
		var pr_divContent 			= content ? $(content): null;
		var pr_divFooter 			= footer  ? $(footer) : null;

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

		var rights					=  App.controller.Per.Rights;
		
		//------------------controllers----------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List		 		= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;		

		//---------------------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;

		//---------------------------------------------------------------
		var societeListChild		= 1010011;
		var societeCompany			= 1010010;
		
//		RIGHT ACTION----------------------------------------
		var RIGHT_G		= 0;
		var RIGHT_N		= 1;
		var RIGHT_M		= 2;
		var RIGHT_D		= 3;
		var RIGHT_R		= 4;

		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.Per.Main;
			pr_ctr_List				= App.controller.Per.List;
			pr_ctr_Ent				= App.controller.Per.Ent;
			pr_ctr_EntHeader 		= App.controller.Per.EntHeader;
			pr_ctr_EntBtn 			= App.controller.Per.EntBtn;
			pr_ctr_EntTabs 			= App.controller.Per.EntTabs;
			
			tmplName.PER_SOCIETE_LIST_COMPANY_HEADER		= "PerSociete_List_Dep_Header";
			tmplName.PER_SOCIETE_LIST_CHILD_HEADER			= "PerSociete_List_Child_Header";
			tmplName.PER_SOCIETE_LIST_CONTENT				= "PerSociete_List_Content";
			
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_SOCIETE_LIST_COMPANY_HEADER		, PerSociete_List_Company_Header);
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_SOCIETE_LIST_CHILD_HEADER			, PerSociete_List_Child_Header); 		
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_SOCIETE_LIST_CONTENT				, PerSociete_List_Content);
		}

		//--------------------------------------------------------------------------------------------
		this.do_lc_show = function(typeSoc){
			try{
				var div = doLoadView(typeSoc);
				do_get_list_ByAjax_Dyn(div, typeSoc);
				//do_bind_list_event(div);
			}catch(e) {
				do_gl_show_Notify_Msg_Error("PerSocieteList: " + e.toString());
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.partner", "PerSocieteList", "do_lc_show", e.toString()) ;
			}
		};

		function doLoadView(typeSoc){
			var div = null;
			if(typeSoc == societeCompany){
				div = "#div_PerSociete_List_Company";
				$("#div_PerSociete_List_Company_Header")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_SOCIETE_LIST_COMPANY_HEADER	, {}));
			}	
			if(typeSoc == societeListChild){
				div = "#div_PerSociete_List_Child";
				$("#div_PerSociete_List_Child_Header")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_SOCIETE_LIST_CHILD_HEADER		, {}));
			}
			$(div + "_Content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_SOCIETE_LIST_CONTENT, {}));
			return div;
		}
		//--------------------------------------------------------------------------------------------
		function do_get_list_ByAjax_Dyn(div, typeSoc){
			var rightCode = rights.req_lc_Right(typeSoc, RIGHT_G);
			if(rightCode == -1){
				do_gl_show_Notify_Msg_Error($.i18n("user_not_support_G_" + typeSoc));
				$(div).hide();
				return;
			}
			
			var ref 		= {};
			ref[svClass] 	= "ServicePersonDyn"; 
			ref[svName]		= getSVName(typeSoc);
			ref[userId]		= App.data.user.id;
			ref[sessId]		= App.data.session_id;
			ref["typ02"]	= typeSoc;
			
			var lang = localStorage.language;
			if (lang ==null ) lang = "en";	
			
			var filename = "www/js/lib/datatables/datatable_"+lang+".json";
			
			var additionalConfig = {
				"typ01": {
					fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
						for (i in App.data.cfgValListTypePerson){
							if (App.data.cfgValListTypePerson[i].id == oData.typ01){
								$(nTd).html($.i18n(App.data.cfgValListTypePerson[i].val01));
								break;
							}
						}
					},
				},
			}

			var colConfig	= req_gl_table_col_config($(div).find("table"), null, additionalConfig);

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax")]);	

			var oTable 		= req_gl_Datatable_Ajax_Dyn		(div, App.path.BASE_URL_API_PRIV,App.data["HttpSecuHeader"], filename, colConfig, ref, fError, undefined, null, undefined, do_bind_list_event);
		}

		function getSVName(typeSoc){
			var svName = null;
			switch(typeSoc){
				case societeCompany: {
					svName = "SVPerLstCompany";
				};
				break;
				case societeListChild:{
					svName = "SVPerLstChild";
				};
				break;
			}
			return svName;
		}
		
		//--------------------------------------------------------------------------------------------
		function do_bind_list_event(data, div, oTable, params) {
//			do_gl_enhance_within($(div), {div: div});
			
			$(div).find('.table-datatableDyn tbody').on('click', 'tr', function(){
				$(this).parents().find(".selected").removeClass("selected");
				$(this)	.addClass("selected");
				var oData = oTable.fnGetData(this);
				var perID = oData.id;
				pr_ctr_Ent.do_lc_show_ById(perID, App['const'].MODE_SEL);
			});
		}
	};
	return PerSocieteList;
});