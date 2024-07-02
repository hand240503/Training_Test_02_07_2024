define([
	'jquery', 
	'text!template/shp/per/common/Per_Ent_Tab_Address_List.html',
	'text!template/shp/per/common/Per_Sel_List_Address.html'
	],
	function($,
			Per_Ent_Tab_Address_List,
			Per_Sel_List_Address
	) {

	var PerSocieteEntTabAddress     = function (header,content,footer, grpName) {
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
		var lst_group_tempo			= [];
		
		var pr_stat_active			= $.i18n("common_active");
		var pr_stat_deactive		= $.i18n("common_deactive");

		var pr_default_new_line	= {
				id 		: null,
				typ01	: 1,
				typ02	: null,
				typ02Lab: null,
				cfgVal05 	: null,
				lab		: null,
				info01	: null,
				info03 	: null,
				info07	: null,
				info09	: null,
		};
		var pr_tableNewLineId 	= 0;
		var pr_new_table		= undefined;
		var pr_news_line_data	= undefined;
		//------------------------------------------------------------------------------------
		var pr_OBJ_TYPE				= 20000;// change to adapt with back office for lock tool

		var pr_SERVICE_CLASS		= ""; //to change by your need

		var pr_SV_NEW				= ""; 
		var pr_SV_DEL				= ""; 
		var pr_SV_MAT_SEARCH		= "";

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
			pr_ctr_Main 			= App.controller.Per.Main;
			pr_ctr_List				= App.controller.Per.List;
			pr_ctr_Ent				= App.controller.Per.Ent;
			pr_ctr_EntHeader 		= App.controller.Per.EntHeader;
			pr_ctr_EntBtn 			= App.controller.Per.EntBtn;
			pr_ctr_EntTabs 			= App.controller.Per.EntTabs;
			
			tmplName.PER_ENT_TAB_ADDRESS_LIST		= "Per_Ent_Tab_Address_List";
			tmplName.PER_SEL_LIST_ADDRESS			= "Per_Sel_List_Address";
		}

		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;
			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.PER_ENT_TAB_ADDRESS_LIST, Per_Ent_Tab_Address_List); 	
				tmplCtrl.do_lc_put_tmpl(tmplName.PER_SEL_LIST_ADDRESS, Per_Sel_List_Address); 	
		

				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_ENT_TAB_ADDRESS_LIST, obj));//obj.tpyAddr
				do_bind_event(obj, mode);
			}catch(e) {				
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.partner", "PerPartnerEntTabAddress", "do_lc_show", e.toString()) ;
			}
		};
		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			var additionalConfig = {			
				"typ02Lab": {
					fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
						if (oData.typ02!=null){
							for (i in App.data.cfgValListTypeAddress)
								if (App.data.cfgValListTypeAddress[i].id == oData.typ02){
									$(nTd).html(App.data.cfgValListTypeAddress[i].name);
									break;
								}
						}
						
						var lstAddr = App.data.cfgValListTypeAddress;
						$.each(lstAddr, function(i, o){
							o.label = o.name;
							o.displ = o.name;
						})
						
						do_gl_input_autocomplete_dyn(nTd, {
							dataTab: {"typ02": "id"}, source: lstAddr, minLength: 0
						}, oData);
					},				
				},
				
				"cfgVal01Lab": {
					fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
						if (oData.cfgVal01!=""){
							for (i in App.data.cfgValListCountry)
								if (App.data.cfgValListCountry[i].id == oData.cfgVal01){
									$(nTd).html(App.data.cfgValListCountry[i].name);
									break;
								}
						}
						
						var lstctr = App.data.cfgValListCountry;
						$.each(lstctr, function(i, o){
							o.label = o.name;
							o.displ = o.name;
						})
						
						do_gl_input_autocomplete_dyn(nTd, {
							dataTab: {"cfgVal01": "id"}, source: lstctr, minLength: 0
						}, oData);
					},				
			
				}	
			}

			req_gl_create_datatable(obj, "#tab_Per_Ent_Tab_Address_List", additionalConfig, pr_default_new_line, function(){
				if(pr_mode == App['const'].MODE_MOD || pr_mode == App['const'].MODE_NEW) {
						do_gl_enable_edit($(pr_divContent));
					}
			});

		}.bind(this);

	}
	return PerSocieteEntTabAddress;
});