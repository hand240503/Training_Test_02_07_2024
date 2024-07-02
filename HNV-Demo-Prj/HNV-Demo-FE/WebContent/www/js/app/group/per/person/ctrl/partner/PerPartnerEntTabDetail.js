define([
	'jquery', 
	'text!template/per/partner/PerPartner_Ent_Tab_Detail.html'
	],
	function($,
			PerPartner_Ent_Tab_Detail
	) {

	var PerPartnerEntTabDetail     = function (header,content,footer, grpName) {
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

			tmplName.PER_ENT_TAB_DETAIL		= "PerPartner_Ent_Tab_Detail";
		}

		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;
			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.PER_ENT_TAB_OBSERVATION_LIST, PerPartner_Ent_Tab_Observation); 	
				tmplCtrl.do_lc_put_tmpl(tmplName.PER_SEL_LIST_ADDRESS, Per_Sel_List_Address); 	


				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_ENT_TAB_OBSERVATION_LIST, {}));//obj.tpyAddr
				do_bind_event(obj, mode);
			}catch(e) {				
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.partner", "PerPartnerEntTabAddress", "do_lc_show", e.toString()) ;
			}
		};
		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){

			var additionalConfig = {			
//					"info05": {
//						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
//							do_gl_input_autocomplete_dyn(nTd, {
//								source: [{"label" : $.i18n('per_tab_observation_status_01'),  "displ" : $.i18n('per_tab_observation_status_01')}, {"label" : $.i18n('per_tab_observation_status_02'), "displ" : $.i18n('per_tab_observation_status_02')}, {"label" : $.i18n('per_tab_observation_status_03'), "displ" : $.i18n('per_tab_observation_status_03')}, {"label" : $.i18n('per_tab_observation_status_04'), "displ" : $.i18n('per_tab_observation_status_04')}], 
//									minLength: 0
//							}, oData);
//						},				
//					},	
//					"event": {
//						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
//							var lstEv = App.data.event;
//							$.each(lstEv, function(i, o){
//								o.label = o.name;
//								o.displ = o.name;
//							})
//							if(oData.info04 != null){
//								var lb = "";
//								for(var i= 0; i< lstEv.length; i++){
//									if(lstEv[i].code == oData.info04){
//										$(nTd).html(lstEv[i].name);
//										break;
//									}
//								}
//							} else {
//								$(nTd).html("");
//							}
//							do_gl_input_autocomplete_dyn(nTd, {
//								dataTab: {"info04": "code"}, source: lstEv, minLength: 0
//							}, oData);
//						},				
//					},
			}

			req_gl_create_datatable(obj, "#tab_Per_Ent_Tab_Orders", additionalConfig, pr_default_new_line, function(){
				if(pr_mode == App['const'].MODE_MOD || pr_mode == App['const'].MODE_NEW) {
					$("#div_Per_Ent_Tab_Orders").find("#btn_add").removeAttr("disabled");
				}
				$("#div_Per_Ent_Tab_Orders").find(".a_delete ").hide();
			});

		}.bind(this);

	}
	return PerPartnerEntTabDetail;
});