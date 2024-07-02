define([
	'jquery',
	'text!template/shp/perInfo/Per_Ent_Header.html'
	],
	function($, 
			Per_Ent_Header
	) {

	var PerEntHeader     = function (header,content,footer, grpName) {
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
		//------------------------------------------------------------------------------------
		var typePartnerClient		= 1010002;
		var typePartnerProvider		= 1010003;
		var typePartnerProducer		= 1010004;
		var typePartnerDoctor		= 1010005;
		var typePartnerThirdparty	= 1010006;

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
		}      

		this.do_lc_show		= function(obj, mode, partnerType){
			if (obj==null){
				obj = {"manId": App.data.user.manId};
			}
			
			pr_obj 	= obj;
			pr_mode		= mode;

			try{
				do_Load_View();
				do_Build_Page(obj, mode);
				do_bind_event(obj, mode);
			}catch(e) {
				alert("PerEntHeader: " + e.toString());
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.partner", "PerEntHeader", "do_lc_show", e.toString()) ;
			}
		};

		var do_Load_View = function(){
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_ENT_HEADER	, Per_Ent_Header);
			//do_gl_calculateScrollBody("#div_Per_Ent_Header" + " .custom-scroll-header", 25);
		} 

		var do_Build_Page = function(obj, mode){
			$("#div_Per_Ent_Header")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_ENT_HEADER, obj));
			
			if(obj != null){
				$("#stat") 							.find("option[value="+obj.stat			+"]")	.attr("selected","selected");
				$("#typ01") 						.find("option[value="+obj.typ01			+"]")	.attr("selected","selected");
				$("#typ02") 						.find("option[value="+obj.typ02			+"]")	.attr("selected","selected");
			}

			if(mode == App['const'].MODE_SEL) 
				setTimeout(function(){
					$("#div_Per_Ent_Header .file-footer-caption").html("<br><br>");
				}, 300)
		}

		var do_bind_event = function(obj, mode){
		}
	};

	return PerEntHeader;
});