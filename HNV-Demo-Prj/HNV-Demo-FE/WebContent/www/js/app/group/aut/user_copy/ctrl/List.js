define([
        'jquery',
        'text!group/aut/user/tmpl/List.html',
        'text!group/aut/user/tmpl/List_Typ_Adm.html' ,
        'text!group/aut/user/tmpl/List_Typ_Agent.html' ,
        'text!group/aut/user/tmpl/List_Typ_Cand.html' ,
        'text!group/aut/user/tmpl/List_Typ_Recr.html' ,
        ],
        function($, 
        		Tmpl_List,
        		Tmpl_List_Typ_Adm,
        		Tmpl_List_Typ_Agent,
        		Tmpl_List_Typ_Cand,
        		Tmpl_List_Typ_Recr
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
		var pr_SERVICE_CLASS		= "ServiceAutUser"; //to change by your need
		var pr_SERVICE_NAME			= "SVLstDyn";
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		//-----------------------------------------------------------------------------------
		var pr_datatables			= {};
		//-----------------------------------------------------------------------------------
		var pr_TYP_01_ADM				= "1";
		var pr_TYP_01_AGENT				= "2";
		var pr_TYP_01_CLIENT			= "3";
		var pr_TYP_02_CAND				= "100";
		var pr_TYP_02_RECR				= "200";
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			tmplName.LIST								= "List";
			tmplName.LIST_TYP_ADM						= "List_Typ_Adm";
			tmplName.LIST_TYP_AGENT						= "List_Typ_Agent";
			tmplName.LIST_TYP_CAND						= "List_Typ_Cand";
			tmplName.LIST_TYP_RECR						= "List_Typ_Recr";
			
			tmplCtrl.do_lc_put_tmpl(tmplName.LIST				, Tmpl_List);
			tmplCtrl.do_lc_put_tmpl(tmplName.LIST_TYP_ADM		, Tmpl_List_Typ_Adm); 
			tmplCtrl.do_lc_put_tmpl(tmplName.LIST_TYP_AGENT		, Tmpl_List_Typ_Agent);   
			tmplCtrl.do_lc_put_tmpl(tmplName.LIST_TYP_CAND		, Tmpl_List_Typ_Cand); 
			tmplCtrl.do_lc_put_tmpl(tmplName.LIST_TYP_RECR		, Tmpl_List_Typ_Recr);  
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
				self.do_lc_show_byTypeStat("#div_List_Typ_Adm"		, tmplName.LIST_TYP_ADM	 		, 	pr_TYP_01_ADM	, null	, 1);
				self.do_lc_show_byTypeStat("#div_List_Typ_Agent"	, tmplName.LIST_TYP_AGENT		, 	pr_TYP_01_AGENT	, null	, 1);
				self.do_lc_show_byTypeStat("#div_List_Typ_Cand"		, tmplName.LIST_TYP_CAND	 	, 	pr_TYP_01_CLIENT, null	, 1);
//				self.do_lc_show_byTypeStat("#div_List_Typ_Recr"		, tmplName.LIST_TYP_RECR	 	, 	pr_TYP_01_CLIENT, pr_TYP_02_RECR	, null);
				//---------------------------------------------------------------
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_Minimize();
			}catch(e) {	
				console.log(e);
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "aut.user", "List", "do_lc_show", e.toString()) ;
			}
		};
		
		this.do_lc_show_byTypeStat = function(div, tmplName, typ01, typ02, stat){
			$(div) 		.html(tmplCtrl.req_lc_compile_tmpl(tmplName	, {}));
			do_get_list_ByAjax_Dyn	(div, typ01, typ02, stat);
		}
		
		this.do_lc_refresh_byTypeStat = function (type, stat){
			var key			= (!type?"":type) + "_" + (!stat?"":stat);
			pr_datatables [key].fnDraw();
		}
		
		
		//---------show-----------------------------------------------------------------------------
		//--------------------------------------------------------------------------------------------
		var do_get_list_ByAjax_Dyn = function(div, typ01, typ02, stat){	
			var ref 				= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SERVICE_NAME);
			if(typ01) {
				ref.typ01 			= typ01; //typ02				
			}
			if(typ02){
				ref.typ02 			= typ02; //typ02				
			}
			if(stat)	{
				ref.stat 			= stat;
			}
			

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
				pr_ctr_Ent.do_lc_show_ById(oData, App['const'].MODE_SEL);
			});
		};
	};
	return CtrlList;
  });