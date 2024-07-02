define([
        'jquery',
        'text!group/per/producer/tmpl/List.html'   ,
        'text!group/per/producer/tmpl/List_by_Stat.html'  
        ],
        function($, 
        		Tmpl_List,
        		Tmpl_List_by_Stat
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
		var pr_SERVICE_CLASS		= "ServicePerProducer"; //to change by your need
		var pr_SERVICE_NAME			= "SVLstDyn";
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		//-----------------------------------------------------------------------------------
		var pr_datatables			= {};
		//-----------------------------------------------------------------------------------
		
		var pr_TYP_01				= "[200]";
		var pr_TYP_02				= "[4000]";
		
		var pr_STAT_NEW				= "[0]";
		var pr_STAT_ACTIV			= "[1]";
		var pr_STAT_REVIEW			= "[5]";
		var pr_STAT_DELETED			= "[10]";
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			tmplName.LIST									= "List";
			tmplName.LIST_STAT								= "List_Stat";
			
			tmplCtrl.do_lc_put_tmpl(tmplName.LIST			, Tmpl_List); 
			tmplCtrl.do_lc_put_tmpl(tmplName.LIST_STAT		, Tmpl_List_by_Stat); 
			
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
			
				self.do_lc_show_byType("#div_List_Stat_00", tmplName.LIST_STAT, 	pr_TYP_01, 	pr_TYP_02, 	pr_STAT_NEW);
				self.do_lc_show_byType("#div_List_Stat_01", tmplName.LIST_STAT, 	pr_TYP_01, 	pr_TYP_02,	pr_STAT_ACTIV);
				self.do_lc_show_byType("#div_List_Stat_05", tmplName.LIST_STAT, 	pr_TYP_01, 	pr_TYP_02,	pr_STAT_REVIEW);
				self.do_lc_show_byType("#div_List_Stat_10", tmplName.LIST_STAT, 	pr_TYP_01, 	pr_TYP_02,	pr_STAT_DELETED);
				//---------------------------------------------------------------
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_Minimize();
			}catch(e) {	
				console.log(e);
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.producer", "List", "do_lc_show", e.toString()) ;
			}
		};
		
		this.do_lc_show_byType = function(div, tmplName, typ01, typ02, stat){
			$(div) 		.html(tmplCtrl.req_lc_compile_tmpl(tmplName	, {'stat': stat, 'title': 'per_person_list_stat_'+stat}));
			do_get_list_ByAjax_Dyn	(div, typ01, typ02, stat);
		}
		
		this.do_lc_refresh_byType = function (typ01, typ02, stat){
			var key			= (!typ01?"":typ01) + "_" + (!typ02?"":typ02) + "_" + (!stat?"":stat);
			pr_datatables [key].fnDraw();
		}
		
		
		//---------show-----------------------------------------------------------------------------
		//--------------------------------------------------------------------------------------------
		var do_get_list_ByAjax_Dyn = function(div, typ01, typ02, stat){	
			var ref 				= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SERVICE_NAME);
			if(typ01)	ref.typ01 	= typ01; //typ01
			if(typ02)	ref.typ02 	= typ02; //typ01
			if(stat)	ref.stat 	= stat; //stat
			
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
			
			var key			= (!typ01?"":typ01) + "_" + (!typ02?"":typ02) + "_" + (!stat?"":stat);
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