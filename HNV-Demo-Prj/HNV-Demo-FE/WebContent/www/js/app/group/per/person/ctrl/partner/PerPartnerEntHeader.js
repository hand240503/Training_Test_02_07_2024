define([
	'jquery',
	'text!template/shp/per/partner/PerPartner_Ent_Header.html',
	'text!template/shp/per/common/Per_Sel_List_Type_Person.html',
	'text!template/shp/per/common/Per_Sel_List_Legal_Status.html',
	'text!template/shp/per/common/Per_Sel_List_Legal_Domain.html',
	'text!template/shp/per/common/Per_Sel_List_Type_Partner.html'
	],
	function($, 
			PerPartner_Ent_Header,
			Per_Sel_List_Type_Person,
			Per_Sel_List_Legal_Status,
			Per_Sel_List_Legal_Domain,
			Per_Sel_List_Type_Partner
	) {

	var PerPartnerEntHeader     = function (header,content,footer, grpName) {
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
			pr_ctr_EntTabs 			= App.controller.Per.EntTabs;
			pr_ctr_TabObservation	= App.controller.Per.EntTabObservation;
			pr_ctr_TabAccountEntity	= App.controller.Per.EntTabAccountEntity;
		}      

		this.do_lc_show		= function(obj, mode, partnerType){
			if (obj==null){
				obj = {"typ02": partnerType};
			}
			
			pr_obj 	= obj;
			pr_mode		= mode;

			try{
				do_Load_View();
				do_Build_Page(obj, mode);
				do_bind_event(obj, mode);
			}catch(e) {
				alert("PerPartnerEntHeader: " + e.toString());
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.partner", "PerPartnerEntHeader", "do_lc_show", e.toString()) ;
			}
		};

		var do_Load_View = function(){
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_SEL_LIST_TYPE_PERSON	, Per_Sel_List_Type_Person);
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_SEL_LIST_LEGAL_STATUS	, Per_Sel_List_Legal_Status);
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_SEL_LIST_LEGAL_DOMAIN	, Per_Sel_List_Legal_Domain);
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_SEL_LIST_TYPE_PARTNER	, Per_Sel_List_Type_Partner);
			tmplCtrl.do_lc_put_tmpl(tmplName.PER_ENT_HEADER	, PerPartner_Ent_Header);
			//do_gl_calculateScrollBody("#div_Per_Ent_Header" + " .custom-scroll-header", 25);
		} 

		var do_Build_Page = function(obj, mode){
			$("#div_Per_Ent_Header")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_ENT_HEADER, obj));
			var listLegalStatus   = App.data.cfgValListTypeLegalStatM;
			var listDomainPartner = App.data.cfgValListTypeDomainPartner;
//			var listLegalDomain = App.data.cfgValListTypeLegalDomainM;
			if(obj.typ01){
				if(obj.typ01 == 1000002){
					listLegalStatus = App.data.cfgValListTypeLegalStatN;
//					listLegalDomain = App.data.cfgValListTypeLegalDomainN;
				}
			}

			$("#sel_list_type_person").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_SEL_LIST_TYPE_PERSON, App.data.cfgValListTypePerson));
			$("#sel_list_legal_status").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_SEL_LIST_LEGAL_STATUS, listLegalStatus))
//			$("#sel_list_legal_domain").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_SEL_LIST_LEGAL_DOMAIN, listLegalDomain));
			$("#sel_list_type_domain").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_SEL_LIST_LEGAL_DOMAIN, listDomainPartner));
			$("#sel_list_type_partner").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_SEL_LIST_TYPE_PARTNER, App.data.cfgValListTypePartner));

			if(obj != null){
				$("#sel_list_type_domain") 		    .find("option[value="+obj.cfgVal01		+"]")	.attr("selected","selected");
				$("#sel_list_legal_status") 		.find("option[value="+obj.cfgVal02		+"]")	.attr("selected","selected");
				$("#sel_list_type_partner") 		.find("option[value="+obj.typ02			+"]")	.attr("selected","selected");
				$("#sel_list_type_person") 			.find("option[value="+obj.typ01			+"]")	.attr("selected","selected");
				$("#stat") 							.find("option[value="+obj.stat			+"]")	.attr("selected","selected");
				
				if (obj.typ02 == typePartnerClient)
					$("#div_partner_type_domain").hide();
				
//				if(obj.cfgVal03){
//					if(obj.typ01 == 1000001){
//						data = App.data.cfgValListTypeLegalDomainM;
//					}else{
//						data = App.data.cfgValListTypeLegalDomainN;
//					}
//					$("#sel_list_legal_domain").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_SEL_LIST_LEGAL_DOMAIN, data));
//					$("#sel_list_legal_domain").find("option[value="+ obj.cfgVal03 +"]").attr("selected","selected");
//					$("#sel_list_legal_domain").parent().parent().css("display", "block");
//				}else{
//					if(obj.typ02 == 1010003){
//						if(obj.typ01 == 1000001){
//							data = App.data.cfgValListTypeLegalDomainM;
//						}else{
//							data = App.data.cfgValListTypeLegalDomainN;
//						}
//						$("#sel_list_legal_domain").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_SEL_LIST_LEGAL_DOMAIN, data));
//						$("#sel_list_legal_domain").parent().parent().css("display", "block");
//					}else{
//						$("#sel_list_legal_domain").parent().parent().css("display", "none");
//					}
//				}
			}else{
				$("#sel_list_type_person") 			.find("option[value="+obj.typ01			+"]")	.attr("selected","selected");
			}

			if(mode == App['const'].MODE_SEL) 
				setTimeout(function(){
					$("#div_Per_Ent_Header .file-footer-caption").html("<br><br>");
				}, 300)
		}

		var do_bind_event = function(obj, mode){
			$("#sel_list_type_person").off("change");
			$("#sel_list_type_person").on("change", function(e){
				var data        = App.data.cfgValListTypeLegalStatM;
//				var data_domain = App.data.cfgValListTypeLegalDomainM;
				if($("#sel_list_type_person").val() == 1000002){
					data        = App.data.cfgValListTypeLegalStatN;
//					data_domain = App.data.cfgValListTypeLegalDomainN;
				}
				$("#sel_list_legal_status").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_SEL_LIST_LEGAL_STATUS, data));
//				$("#sel_list_legal_domain").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_SEL_LIST_LEGAL_DOMAIN, data_domain));
			});

//			$("#sel_list_type_partner").off("change");
//			$("#sel_list_type_partner").on("change", function(e){
//				if($(this).val() == typePartnerProvider || $(this).val() == typePartnerClient){
//				$("#li_Per_Ent_Tab_Observation")	.show();
//				pr_ctr_TabObservation	 			.do_lc_show(pr_obj, pr_mode);
//				} else {
//				$("#li_Per_Ent_Tab_Observation")	.hide();
//				$("#div_Per_Ent_Tab_Observation")	.html("");
//				}


//				if($(this).val() == typePartnerProvider){
//				$("#li_Per_Ent_Tab_Account_Entity")	.show();
//				pr_ctr_TabAccountEntity 		.do_lc_show(pr_obj, pr_mode);
//				} else {
//				$("#li_Per_Ent_Tab_Account_Entity")	.hide();
//				$("#div_Per_Ent_Tab_Account_Entity").html("");
//				}

//				if($("#sel_list_type_partner").val() == 1010003){
//					if($("#sel_list_type_person").val() == 1000002) {
//						var data = App.data.cfgValListTypeLegalDomainN;
//						$("#sel_list_legal_domain").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_SEL_LIST_LEGAL_DOMAIN, data));
//						$("#sel_list_legal_domain").parent().parent().css("display", "block");
//					}else{
//						var data = App.data.cfgValListTypeLegalDomainM;
//						$("#sel_list_legal_domain").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_SEL_LIST_LEGAL_DOMAIN, data));
//						$("#sel_list_legal_domain").parent().parent().css("display", "block");
//					}
//
//				}else{
//					var data = {};
//					$("#sel_list_legal_domain").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_SEL_LIST_LEGAL_DOMAIN, data));
//					$("#sel_list_legal_domain").parent().parent().css("display", "none");
//				}
//
//			});

			var rightSocMa = pr_ctr_Main.do_verify_user_right_soc_manage();
			if(!rightSocMa)
				$("#div_per_partner_societe").hide();
			else{
				var LstAllSociete = App.data["LstSociete"].concat(App.data["LstSocieteChild"]);
				for(var i=0; i<LstAllSociete.length; i++){
					if(LstAllSociete[i].id == obj.parent){
						$("#inp_per_partner_societe")	.val(LstAllSociete[i].name01);
						break;
					}
				}
				do_gl_autocomplete({
					el: $("#inp_per_partner_societe"),
					required: true,
					source: App.data["LstSociete"].concat(App.data["LstSocieteChild"]),
					selectCallback: function(item ) {
						$("#socId")						.val(item.id);
						$("#inp_per_partner_societe")	.val(item.name01);
					},
					renderAttrLst: ["name01"],
					minLength: 0,
				});
			}
		}
	};

	return PerPartnerEntHeader;
});