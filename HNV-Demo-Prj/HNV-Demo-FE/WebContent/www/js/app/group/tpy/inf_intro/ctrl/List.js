define([
        'jquery',
        'text!group/tpy/inf_rissi/tmpl/List.html',
        'text!group/tpy/inf_rissi/tmpl/List_Active.html',
        'text!group/tpy/inf_rissi/tmpl/List_Inactive.html'
        
        ],
        function($, 
        		Tmpl_List,
        		Tmpl_List_Active,
        		Tmpl_List_Inactive
        ) 
        {

	var CtrlList 	= function (header,content,footer,grpName) {
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
		var pr_SERVICE_CLASS		= "ServiceTpyInformation_Rissi"; //to change by your need
		var pr_SERVICE_NAME			= "SVLstDyn";
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		//-----------------------------------------------------------------------------------
		var pr_datatables			= {};
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			
			tmplName.LIST						= "List";
			tmplName.LIST_ACTIVE				= "List_Active";
			tmplName.LIST_INACTIVE				= "List_Inactive";
			
			tmplCtrl.do_lc_put_tmpl(tmplName.LIST			, Tmpl_List			); 
			tmplCtrl.do_lc_put_tmpl(tmplName.LIST_ACTIVE	, Tmpl_List_Active	); 
			tmplCtrl.do_lc_put_tmpl(tmplName.LIST_INACTIVE	, Tmpl_List_Inactive); 
			
			//--------------------------------------------------------------------
			pr_ctr_Main 			= App.controller[pr_grpName].Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;
			pr_ctr_Ent				= App.controller[pr_grpName].Ent;
		}
		
		//---------show-----------------------------------------------------------------------------
		var var_lc_SELECTION 		= 1;
		this.do_lc_show = function(){               
			try{
				$(pr_divContent)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.LIST		, {}));
			
				self.do_lc_show_byType("#div_List_Active"	, tmplName.LIST_ACTIVE	, var_lc_SELECTION, 1);
				self.do_lc_show_byType("#div_List_Inactive"	, tmplName.LIST_INACTIVE, var_lc_SELECTION, 0);
				
				//---------------------------------------------------------------
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_Minimize();
			}catch(e) {	
				console.log(e);
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "tpy.information", "List", "do_lc_show", e.toString()) ;
			}
		};
		
		this.do_lc_show_byType = function(div, tmplName, type, stat){
			
			$(div) 		.html(tmplCtrl.req_lc_compile_tmpl(tmplName	, {}));
			do_get_list_ByAjax_Dyn	(div, type, stat);
		}
		
		this.do_lc_refresh_byType = function (type){
			pr_datatables [type].fnDraw();
		}
		//--------------------------------------------------------------------------------------------
		var do_get_list_ByAjax_Dyn = function(div, type, stat){	
			var ref 			   = req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SERVICE_NAME);
			if(type)	ref.typ01  = type; //typ01
			ref.entTyp 			   = 0;
			ref.entId 			   = 100;
			ref.stat   			   = stat;
			var fileTransl		   = null;
			var additionalConfig   = {
				"dt01": {						
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							$(nTd).html(reg_gl_DateStr_From_DateStr(oData.dt01, DateFormat.masks.isoDateTime,req_gl_DateFormat_LocalShort()));
						}
			    },
			    "dt02": {						
					fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
						$(nTd).html(reg_gl_DateStr_From_DateStr(oData.dt02, DateFormat.masks.isoDateTime,req_gl_DateFormat_LocalShort()));
					}
			    }
			};
			var colConfig			= req_gl_table_col_config($(div).find("table"), null, additionalConfig);
			var dataTableOption 	= {
					"canScrollY"			: true,
//					"searchOption" 			: true,	
//					"searchOptionConfig" 	: [	{lab: $.i18n('common_search_any'), val:0}]
			};	     		
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax")]);	
			
			//call Datatable AJAX dynamic function from DatatableTool
			var oTable 		= req_gl_Datatable_Ajax_Dyn		(div, App.path.BASE_URL_API_PRIV,App.data["HttpSecuHeader"], fileTransl, colConfig, ref, fError, undefined, null, undefined, do_bind_list_event, dataTableOption);
			
			var key			= type;
			pr_datatables [key] = oTable;
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