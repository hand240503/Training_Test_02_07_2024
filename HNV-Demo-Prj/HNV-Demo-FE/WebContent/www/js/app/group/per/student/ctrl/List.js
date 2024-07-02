define([
        'jquery',
        'text!group/per/student/tmpl/List.html',
        'text!group/per/student/tmpl/List_by_Stat.html'
        
        ],
        function($, 
        		Tmpl_List,
        		Tmpl_List_Stat
        ) 
        {

	var CtrlList 	= function (header,content,footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName;
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
		var pr_SERVICE_CLASS		= "ServiceTpyCategoryDyn"; //to change by your need
		
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;		
		
		//-----------------------------------------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			
			tmplName.LIST						= "List";
			tmplName.LIST_STAT					= "List_Stat";
			
			tmplCtrl.do_lc_put_tmpl(tmplName.LIST		, Tmpl_List); 
			tmplCtrl.do_lc_put_tmpl(tmplName.LIST_STAT	, Tmpl_List_Stat); 
			
			//--------------------------------------------------------------------
			pr_ctr_Main 			= App.controller[pr_grpName].Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;
			pr_ctr_Ent				= App.controller[pr_grpName].Ent;
		}
		
		//---------show-----------------------------------------------------------------------------
		var var_lc_MAT 		= 100;
		var var_lc_BLOG 	= 200;
		this.do_lc_show = function(){               
			try{
				$("#div_List")						.html(tmplCtrl.req_lc_compile_tmpl(tmplName.LIST		, {}));
			
				self.do_lc_show_byType(var_lc_MAT);
				self.do_lc_show_byType(var_lc_BLOG);
				
				//---------------------------------------------------------------
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_Minimize();
			}catch(e) {	
				console.log(e);
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  pr_grpName, "List", "do_lc_show", e.toString()) ;
			}
		};
		
		this.do_lc_show_byType = function(type){
			if (type==var_lc_MAT){
				$("#div_List_Material") 		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.LIST_STAT	, {}));
				do_get_list_ByAjax_Dyn("#div_TpyCat_Mat", var_lc_MAT);
			}else if (type==var_lc_BLOG){
				$("#div_List_Blog")				.html(tmplCtrl.req_lc_compile_tmpl(tmplName.LIST_STAT	, {}));
				do_get_list_ByAjax_Dyn("#div_TpyCat_Blog", var_lc_BLOG);
			}
		}
		
		//--------------------------------------------------------------------------------------------
		var do_get_list_ByAjax_Dyn = function(div, type){	
			var ref 				= req_gl_Request_Content_Send(pr_SERVICE_CLASS, "SVLstDyn");
			if(type)	ref.parTyp 	= type; //type00
			
			var lang = localStorage.language;
			if (lang ==null ) lang 	= "en";	
			var filename 			= "www/js/lib/datatables/datatable_"+lang+".json";
			
			var additionalConfig 	= {	};
			
			var colConfig			= req_gl_table_col_config($(div).find("table"), null, additionalConfig);
			var dataTableOption 	= {
					"canScrollY"			: true,
					"searchOption" 			: true,	
					"searchOptionConfig" 	: [	{lab: $.i18n('common_search_any')			, val:0}]
			};	     		
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax")]);	
			
			//call Datatable AJAX dynamic function from DatatableTool
			var oTable 		= req_gl_Datatable_Ajax_Dyn		(div, App.path.BASE_URL_API_PRIV,App.data["HttpSecuHeader"], filename, colConfig, ref, fError, undefined, null, undefined, do_bind_list_event, dataTableOption);
		}
		
		//--------------------------------------------------------------------------------------------
		var do_bind_list_event = function(sharedJson, div, oTable) {
			$(div).find('tr').off('click')
			$(div).find('tr').on('click', function(){
				if(App.data.mode == App['const'].MODE_MOD || App.data.mode == App['const'].MODE_NEW){
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_sel'));
					return;
				}
				//apply CSS style
				do_gl_Add_Class_List($(this).parent(), $(this), "selected");
				
				var oData = oTable.fnGetData(this);
				pr_ctr_Ent. do_lc_show_ById(oData, App['const'].MODE_SEL);
		
			});
		};
	
	};

	return CtrlList;
  });