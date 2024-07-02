 define([
	'jquery',
	'text!template/per/contract/PerContract_Ent_Tab_Content.html'
	],
	function($, 
			PerContract_Ent_Tab_Content) {

	var PerContractEntTabContent     = function (header,content,footer, grpName) {
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

		var svClass         			= App['const'].SV_CLASS;
		var svName          			= App['const'].SV_NAME;
		var userId          			= App['const'].USER_ID;
		var sessId          			= App['const'].SESS_ID;
		var fVar            			= App['const'].FUNCT_SCOPE;
		var fName           			= App['const'].FUNCT_NAME;
		var fParam          			= App['const'].FUNCT_PARAM;

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
			pr_ctr_Main 			= App.controller.PerContract.Main;
			pr_ctr_List 			= App.controller.PerContract.List;
			
			pr_ctr_Ent				= App.controller.PerContract.Ent;
			pr_ctr_EntHeader 		= App.controller.PerContract.EntHeader;
			pr_ctr_EntBtn 			= App.controller.PerContract.EntBtn;
			pr_ctr_EntTabs 			= App.controller.PerContract.EntTabs;
		}      

		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;

			try{
				do_Load_View();
				do_Build_Page(obj, mode);
				do_bind_event(obj, mode);
			}catch(e) {				
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "mat.material", "MatMaterialEntTabInfo", "do_lc_show", e.toString()) ;
			}
		};

		var do_Load_View = function(){
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_ENT_TAB_CONTENT	, PerContract_Ent_Tab_Content); 
		} 

		var do_Build_Page = function(obj, mode){
			$(pr_divContent)		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_ENT_TAB_CONTENT, obj));
//			$("#div_mat_taxType")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.LST_TAX));
//			if(obj != null){
//				$("#div_mat_taxType").find("option[value="+obj.typ03  +"]")	.attr("selected","selected");
//			} 
		} 

		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){

		}
	};

	return PerContractEntTabContent;
});