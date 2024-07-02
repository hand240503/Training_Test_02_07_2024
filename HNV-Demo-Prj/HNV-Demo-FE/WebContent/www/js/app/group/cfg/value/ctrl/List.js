define([
        'jquery',
        'text!group/cfg/value/tmpl/List.html'   ,
        'text!group/cfg/value/tmpl/List_Stat_All.html',
        'text!group/cfg/value/tmpl/List_Stat_New.html',
        'text!group/cfg/value/tmpl/List_Stat_Act.html', 
        'text!group/cfg/value/tmpl/List_Stat_Rev.html',
        'text!group/cfg/value/tmpl/List_Stat_Del.html' 
        ],
        function($, 
        		Tmpl_List,
        		
        		Tmpl_List_Stat_All,
        		Tmpl_List_Stat_New,
        		Tmpl_List_Stat_Act,
        		Tmpl_List_Stat_Rev,
        		Tmpl_List_Stat_Del
        		
        ) 
        {

	var CtrlList 	= function (header, content, footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName;
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
		var pr_SERVICE_CLASS		= "ServiceCfgValue"; //to change by your need
		var pr_SERVICE_NAME			= "SVLstDyn";
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		//-----------------------------------------------------------------------------------
		var pr_datatables			= {};
		//-----------------------------------------------------------------------------------
		
		var pr_TYP_					= "[0]";
		
		var pr_STAT_NEW				= "[0]";
		var pr_STAT_ACTIV			= "[1]";
		var pr_STAT_REVIEW			= "[5]";
		var pr_STAT_DELETED			= "[10]";
		var pr_STAT_ALL				= "[0,1,5,10]";
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			tmplName.LIST									= "List";
			tmplName.LIST_STAT_NEW							= "List_Stat_New";
			tmplName.LIST_STAT_ACT							= "List_Stat_Act";
			tmplName.LIST_STAT_REV							= "List_Stat_Rev";
			tmplName.LIST_STAT_DEL							= "List_Stat_Del";
			tmplName.LIST_STAT_ALL							= "List_Stat_All";
			tmplCtrl.do_lc_put_tmpl(tmplName.LIST			, Tmpl_List); 
			tmplCtrl.do_lc_put_tmpl(tmplName.LIST_STAT_NEW	, Tmpl_List_Stat_New); 
			tmplCtrl.do_lc_put_tmpl(tmplName.LIST_STAT_ACT	, Tmpl_List_Stat_Act); 
			tmplCtrl.do_lc_put_tmpl(tmplName.LIST_STAT_REV	, Tmpl_List_Stat_Rev); 
			tmplCtrl.do_lc_put_tmpl(tmplName.LIST_STAT_DEL	, Tmpl_List_Stat_Del); 
			tmplCtrl.do_lc_put_tmpl(tmplName.LIST_STAT_ALL	, Tmpl_List_Stat_All); 
			//-----------------------------------------------------------------------------------
			pr_ctr_Main 			= App.controller[pr_grpName].Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;
			pr_ctr_Ent				= App.controller[pr_grpName].Ent;
			//-----------------------------------------------------------------------------------
			
		}
		//-----------------------------------------------------------------------------------
		
		this.do_lc_show = function(){               
			try{
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.LIST		, {}));
			
//				self.do_lc_show_byTypeStat("#div_List_Typ_01"	, tmplName.LIST_TYP_01, 	type01	, null);
//				self.do_lc_show_byTypeStat("#div_List_Stat_01", tmplName.LIST_STAT_01, 	null	, stat01);
				self.do_lc_show_byTypeStat("#div_List_Stat_New", tmplName.LIST_STAT_NEW, null, pr_STAT_NEW);
				self.do_lc_show_byTypeStat("#div_List_Stat_Act", tmplName.LIST_STAT_ACT, null, pr_STAT_ACTIV);
//				self.do_lc_show_byTypeStat("#div_List_Stat_Rev", tmplName.LIST_STAT_REV, null, pr_STAT_REVIEW );
//				self.do_lc_show_byTypeStat("#div_List_Stat_Del", tmplName.LIST_STAT_DEL, null, pr_STAT_DELETED, );
				self.do_lc_show_byTypeStat("#div_List_Stat_All", tmplName.LIST_STAT_ALL, null, pr_STAT_ALL);
				//---------------------------------------------------------------
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_Minimize();
			}catch(e) {	
				console.log(e);
				//do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "cfg.", "List", "do_lc_show", e.toString()) ;
			}
		};
		
		this.do_lc_show_byTypeStat = function(div, tmplName, type, stat){
			$(div) 		.html(tmplCtrl.req_lc_compile_tmpl(tmplName	, {}));
			do_get_list_ByAjax_Dyn	(div, type, stat);
		}
		
		this.do_lc_refresh_byType = function (type, stat){
			var key			= (!type?"":type) + "_" + (!stat?"":stat);
			pr_datatables [key].fnDraw();
		}
		
		
		//---------show-----------------------------------------------------------------------------
		//--------------------------------------------------------------------------------------------
		var do_get_list_ByAjax_Dyn = function(div, type, stat){	
			var ref 				= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SERVICE_NAME);
			if(type)	
				ref.typ01 			= type; //typ
			if(stat)	
				ref.stat 			= stat; //stat
			
			var fileTransl			= null;
			var additionalConfig 	= {};
			var colConfig			= req_gl_table_col_config($(div).find("table"), null, additionalConfig);
			var dataTableOption 	= {
					"canScrollY"			: true,
//					"searchOption" 			: true,	
//					"searchOptionConfig" 	: [	{lab: $.i18n('common_search_any'), val:0}]
			};	     		
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax")]);	
			
			//call Datatable AJAX dynamic function from DatatableTool
			var oTable 		= req_gl_Datatable_Ajax_Dyn		(div, App.path.BASE_URL_API_PRIV,App.data["HttpSecuHeader"], fileTransl, colConfig, ref, fError, undefined, null, undefined, do_bind_list_event, dataTableOption);
			
			var key			= (!type?"":type) + "_" + (!stat?"":stat);
			pr_datatables [key] = oTable;
		}
		
		//--------------------------------------------------------------------------------------------
		var do_bind_list_event = function(sharedJson, div, oTable) {
			$(div).find('tr').off('click')
			$(div).find('tr').on('click', function(){
				if(	App.data.mode == App['const'].MODE_MOD 	|| 
					App.data.mode == App['const'].MODE_NEW	||
					App.data.mode == App['const'].MODE_TRANSL){
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