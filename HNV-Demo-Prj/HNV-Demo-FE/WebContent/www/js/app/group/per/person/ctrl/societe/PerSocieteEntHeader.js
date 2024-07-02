 define([
	'jquery',
	'text!template/shp/per/societe/PerSociete_Ent_Header.html',
	'text!template/shp/per/common/Per_Sel_List_Type_Person.html',
	'text!template/shp/per/common/Per_Sel_List_Legal_Status.html',
	'text!template/shp/per/common/Per_Sel_List_Type_Partner.html'
	],
	function($, 
			PerSociete_Ent_Header,
			Per_Sel_List_Type_Person,
			Per_Sel_List_Legal_Status,
			Per_Sel_List_Type_Partner
			) {

	var PerSocieteEntHeader     = function (header,content,footer, grpName) {
		var pr_divHeader 			= header  ? $(header) : null;
		var pr_divContent 			= content ? $(content): null;
		var pr_divFooter 			= footer  ? $(footer) : null;

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
				
				do_Load_View();
				do_Build_Page(obj, mode);
				if(App.data.user.id	!= 1 ){
					$("#stat").removeClass("objData");
//					$("#stat").attr("disabled");
				}
			}catch(e) {
				do_gl_show_Notify_Msg_Error("PerPartnerEntHeader: " + e.toString());
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.societe", "PerSocieteEntHeader", "do_lc_show", e.toString()) ;
			}
		};

		var do_Load_View = function(){
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_SEL_LIST_TYPE_PERSON	, Per_Sel_List_Type_Person);
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_SEL_LIST_LEGAL_STATUS	, Per_Sel_List_Legal_Status);
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_SEL_LIST_TYPE_PARTNER	, Per_Sel_List_Type_Partner);
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_ENT_HEADER			, PerSociete_Ent_Header);
			//do_gl_calculateScrollBody("#div_Per_Ent_Header" + " .custom-scroll-header", 25);
		} 

		var do_Build_Page = function(obj, mode){
			$("#div_Per_Ent_Header")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_ENT_HEADER, obj));
			var listLegalStatus = App.data.cfgValListTypeLegalStatM;
			if(obj.typ01){
				if(obj.typ01 == 1000002){
					listLegalStatus = App.data.cfgValListTypeLegalStatN;
				}
			}
			$("#sel_list_type_person").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_SEL_LIST_TYPE_PERSON, App.data.cfgValListTypePerson));
			$("#sel_list_legal_status").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_SEL_LIST_LEGAL_STATUS, listLegalStatus));
			$("#sel_list_type_partner").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_SEL_LIST_TYPE_PARTNER, App.data.cfgValListTypePartner));
			
			if(obj != null){
				$("#sel_list_legal_status") 		.find("option[value="+obj.cfgVal02		+"]")	.attr("selected","selected");
				$("#sel_list_type_partner") 		.find("option[value="+obj.typ02			+"]")	.attr("selected","selected");
				$("#sel_list_type_person") 			.find("option[value="+obj.typ01			+"]")	.attr("selected","selected");
				$("#stat"							).find("option[value=" + obj.stat  		+"]")	.attr("selected", "selected");
			}
			
			$("#sel_list_type_person").off("change");
			$("#sel_list_type_person").on("change", function(e){
				var data = App.data.cfgValListTypeLegalStatM;
				if($("#sel_list_type_person").val() == 1000002){
					data = App.data.cfgValListTypeLegalStatN;
				}
				$("#sel_list_legal_status").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_SEL_LIST_LEGAL_STATUS, data));
			});
			
			if(mode == App['const'].MODE_SEL) 
				setTimeout(function(){
					$("#div_Per_Ent_Header .file-footer-caption").html("<br><br>");
				}, 300)
		}
	};

	return PerSocieteEntHeader;
});