define([
        'jquery',
        'text!group/aut/role/tmpl/List.html',     
        'text!group/aut/role/tmpl/List_Table.html',  

        ],
        function($, 
        		Tmpl_List,
        		Tmpl_List_Content        		
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
		
		//-----------------------------------------------------------------------------------
		//--------------------APIs--------------------------------------//
		this.do_lc_init						= function(){
			//----step 01: load template----------------------------------------------------------------------------------------------
			tmplName.LIST			= "List";
			tmplName.LIST_CONTENT	= "List_Content";
			
			tmplCtrl.do_lc_put_tmpl(tmplName.LIST			, Tmpl_List); 
			tmplCtrl.do_lc_put_tmpl(tmplName.LIST_CONTENT	, Tmpl_List_Content);
			
			//-----------------------------------------------------------------------------------
			pr_ctr_Main 			= App.controller[pr_grpName].Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;
			pr_ctr_Ent				= App.controller[pr_grpName].Ent;
		}
		
		//--------------------------------------------------------------------------------------------
		this.do_lc_show = function(){               
			try{
				$(pr_divContent)	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.LIST				, {}));
				$("#div_List_All")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.LIST_CONTENT		, {}));
				
				do_get_list_ByAjax_Dyn	(pr_divContent);

				//---------------------------------------------------------------
				App.controller.DBoard.DBoardMain.do_lc_bind_event_div_Minimize();
			}catch(e) {	
				console.log(e);
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "aut.role", "List", "do_lc_show", e.toString()) ;
			}
		};
		
		//---------private-----------------------------------------------------------------------------		
		//--------------------------------------------------------------------------------------------
		var do_get_list_ByAjax_Dyn 	= function (div){	
			var ref 				= {};
			ref[svClass] 			= "ServiceAutRole"; 
			ref[svName]				= "SVLstDyn"; 
			ref[userId]				= App.data.user.id;
			ref[sessId]				= App.data.session_id;
			
			var lang = localStorage.language;
			if (lang ==null ) lang 	= "vi";	
			
			var filename 			= "www/js/lib/datatables/datatable_"+lang+".json";
			var additionalConfig	= {};
			var dataTableOption 	= {
					"canScrollY"			: true,
					"searchOption" 			: false,	
//					"searchOptionConfig" 	: [	{lab: $.i18n('common_search_any'), val:0}]
			};	     		
			var colConfig			= req_gl_table_col_config($(div).find("table"), null, additionalConfig);
			var fError 				= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax")]);	
			
			//call Datatable AJAX dynamic function from DatatableTool
			var oTable 		= req_gl_Datatable_Ajax_Dyn		(div, App.path.BASE_URL_API_PRIV,App.data["HttpSecuHeader"], filename, colConfig, ref, fError, undefined, null, undefined, do_bind_list_event, dataTableOption);
		}
		
		//--------------------------------------------------------------------------------------------
		var do_bind_list_event = function(sharedJson, div, oTable) {
//			do_gl_enhance_within($(div), {div: div});
			
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
		
		//--------------------------------------------------------------------------------------------
	
	};

	return CtrlList;
  });