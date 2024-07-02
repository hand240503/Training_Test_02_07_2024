define([
        'jquery',
        'text!template/shp/per/common/Per_Ent_Tab_Doc.html',
     
        ],
        function($,
        		PerPartner_Ent_Tab_Doc
        		) {


	var PerPartnerEntTabDoc     = function (header,content,footer, grpName) {
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
		}
		
		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;
			
			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.PER_PARTNER_ENT_TAB_DOC, PerPartner_Ent_Tab_Doc);
				$("#div_Per_Ent_Tab_Doc").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_PARTNER_ENT_TAB_DOC, obj));
				do_bind_event();
			}catch(e) {
				do_gl_show_Notify_Msg_Error("PerEntTabDoc " + e.toString());
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per", "PerEntTabDoc", "do_lc_show", e.toString()) ;
			}
		};

		//---------private-----------------------------------------------------------------------------
		function do_bind_event(){
			if ( $("#div_Per_Ent_Tab_Doc" ).find("input").prop("multiple") ){
				$("#div_Per_Ent_Tab_Doc" ).find("input").attr("data-typ01","1");
			}
//			var listDoc = App.data.patnerDoc;
//			$("#btn_add_doc").hide();
//			if(pr_mode == App['const'].MODE_MOD || pr_mode == App['const'].MODE_NEW){
//				$("#btn_add_doc").show();
//				$("#btn_add_doc").off("click");
//				$("#btn_add_doc").on("click", function() {
//					doShowAddDocMsgBox();
//				});
//			}
//			
//			$(".per_partner_doc_download").on("click", function() {
//				var docIndex = $(this).attr("data-docIndex");
//				var selectedDoc = listDoc[docIndex];
//				alert("Download doc " + docIndex);
//			});
//			
//			$(".per_partner_doc_delete").on("click", function() {
//				var docIndex = $(this).attr("data-docIndex");
//				var selectedDoc = listDoc[docIndex];
//				alert("Delete doc " + docIndex);
//			});
		}
	};
	
	return PerPartnerEntTabDoc;
});