define([
        'jquery',
        'text!group/aut/user/tmpl/Aut_User_Ent_Header.html',
        'text!group/aut/user/tmpl/Aut_User_Ent_Header_Pass.html'

        ],

        function($, 
        		AutUser_Ent_Header,
        		AutUser_Ent_Header_Pass
        	) {

	var AutUserEntHeader     = function (header,content,footer, grpName) {
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
		var pr_ctr_EntTabCat 		= null;
		
		var pr_type_seller 			= 9;
		
		var pr_type_adm 			= 2;
		var pr_type_adm_all 		= 10;
		//-----------------------------------------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.AutUser.Main;
			pr_ctr_List 			= App.controller.AutUser.List;
			
			pr_ctr_Ent				= App.controller.AutUser.Ent;
			pr_ctr_EntHeader 		= App.controller.AutUser.EntHeader;
			pr_ctr_EntBtn 			= App.controller.AutUser.EntBtn;
			pr_ctr_EntTabs 			= App.controller.AutUser.EntTabs;
			pr_ctr_EntTabCat 		= App.controller.AutUser.EntTabCat;
		}      
		
		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;
			
			try{
				if(obj.files){
					if(!obj.avatar )obj.avatar = obj.files.find(file => file.typ01 == 2);
				}
				tmplCtrl.do_lc_put_tmpl(tmplName.AUT_USER_ENT_HEADER		, AutUser_Ent_Header);
				tmplCtrl.do_lc_put_tmpl(tmplName.AUT_USER_ENT_HEADER_PASS	, AutUser_Ent_Header_Pass);
				if(obj.sup)
					obj.sup.name = obj.sup.name01 + obj.sup.name02 + obj.sup.name03;
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.AUT_USER_ENT_HEADER, obj));
//				do_show_fileUploader(obj);
				//fixed max-height scroll of % height div_ContentView
				//do_gl_calculateScrollBody(pr_divContent + " .custom-scroll-header", 50);
				
				$("#div_ent_header_password").html(tmplCtrl.req_lc_compile_tmpl(tmplName.AUT_USER_ENT_HEADER_PASS, {}));
				
				if (App.data.user.manId != 1 && (App.data.user.typ !=  pr_type_adm || App.data.user.typ !=  pr_type_adm_all)){
					$("#div_autuser_societe		").hide();
//					$("#div_autuser_supervisor	").hide();
				}else{
					if(obj.manId){
//						for(var i = 0; i < App.data["LstPartner"].length; i++){
//							if(obj.manId 	== App.data["LstPartner"][i].id){
//								var manName = App.data["LstPartner"][i].name01;
//								$("#inp_autuser_societe").html(manName);
//								break;
//							}
//						}
					}
					if(obj.typ == pr_type_seller){
						$("#div_affiliate").removeClass("hide");
					}
				}
				
				do_bind_event(obj, mode);
				
				pr_ctr_Ent.do_lc_style_pages($(pr_divContent), mode);
				
			}catch(e) {				
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "aut.user", "AutUserEntHeader", "do_lc_show", e.toString()) ;
			}
		};
			
		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			if(mode == App['const'].MODE_NEW) {
				$("#div_ent_header_password").show();
				$("#div_ent_header_password").removeClass("noData");
			}
			
			do_gl_input_autocomplete_dyn("#supName", {
				dataRes 	: ["info01"],  
				dataReq		: {nbLine:20, typeDif: 5}, 
				dataService : ["ServiceAutUser", "SVAutUserLstSearch"], 
				dataSel 	: {"#supId": "id"}, 
			});
			
			do_gl_input_autocomplete_dyn("#manName", {
				dataRes 	: ["name01", "name02"],  
				dataReq		: {nbLine:20, typeDif: 5, typ02:1010006, stat:1}, 
				dataService : ["ServicePerPerson", "SVPerLstSearch"], 
				dataSel 	: {"#manId": "id"}, 
			});
//			
//			do_gl_input_autocomplete_dyn("#inp_affiliate", {			//tim kiem theo ten cua user
//				dataRes 		: ["login"], 
//				dataReq 		: {"nbLine" : 10}, 
//				dataService 	: ["ServiceAutUser", "SVAutUserSearchUI"],
//				dataSel 		: {"#entId01": "id"},
//				minLength		: 0,
//				autoSearch		: true,	
//			});
			
			if(obj.typ) {
				do_gl_select_value($("#inp_autuser_header_typ"), obj.typ);
			}
			
			
			if(obj.stat) {
				do_gl_select_value($("#inp_autuser_header_stat"), obj.stat);
			}
			
			$("#btn_aut_user_change_pass").on("click", function() {
				$("#div_ent_header_password").slideToggle();
				if($("#div_ent_header_password").hasClass("noData")) {
					$("#div_ent_header_password").removeClass("noData");
				} else {
					$("#div_ent_header_password").addClass("noData");
				}
			});
//			$( "#inp_autuser_header_typ" ).change(function() {
//				  if($( this ).val()==6){
//					  $("#li_AutUser_Ent_Tab_Cat		, #div_AutUser_Ent_Tab_Cat"		)	.removeClass("hide"		);
//					  pr_ctr_EntTabCat .do_lc_show(pr_obj, pr_mode);
//					  
//					  $(".div_file_cover").removeClass("hide"		);
//					  $("#div_affiliate").addClass("hide"		);
//				  }
//				  else if($( this ).val()==9){
//					  $("#div_affiliate").removeClass("hide");
//				  }
//				  else{
//					  $("#li_AutUser_Ent_Tab_Cat		, #li_AutUser_Ent_Tab_Cat"		)	.addClass	("hide"		);
////					  pr_ctr_EntTabCat .do_lc_show({}, mode);
//					  $(".div_file_cover")													.addClass("hide"		);
//					  $("#div_affiliate")													.addClass("hide"		);
//				  }
//			});
			
			
//			var rightSocMa = pr_ctr_Main.do_verify_user_right_soc_manage();
//			if(!rightSocMa)
//				$("#div_autuser_societe").hide();
//			else{
//				//var LstAllSociete = App.data["LstSociete"].concat(App.data["LstSocieteChild"]);
//				var LstAllSociete 	= App.data["LstPartner"];
//				
//				if(mode == App['const'].MODE_NEW ){
//					for(var i=0; i<LstAllSociete.length; i++){
//						if(LstAllSociete[i].id == App.data.user.manId){
//							$("#inp_autuser_societe")	.val(LstAllSociete[i].name);
//							break;
//						}
//					}
//				}else{
//					for(var i=0; i<LstAllSociete.length; i++){
//						if(LstAllSociete[i].id == obj.manId){
//							$("#inp_autuser_societe")	.val(LstAllSociete[i].name);
//							break;
//						}
//					}
//				}
//				
//				if(App.data.user.manId == 1){
//					do_gl_autocomplete({
//						el				: $("#inp_autuser_societe"),
//						required		: true,
//						source			: LstAllSociete,
//						selectCallback	: function(item ) {
//							$("#manId")					.val(item.id);
//							$("#inp_autuser_societe")	.val(item.name);
//						},
//						renderAttrLst	: ["name"],
//						minLength		: 0,
//					});
//				}
//			}
			
		}
		var do_show_fileUploader = function  (curObj) {		
			var optionsFileInput = {
					showCapture		: false,
					showFileURL		: false,
					dropZoneEnabled	: true,
					ajaxSettings:{
							headers : {Authorization: "Bearer " + req_gl_Security_HttpHeader(App.keys.KEY_STORAGE_CREDENTIAL),}
					}
			};
			do_binding_FileInput("#div_autuser_avt", curObj, optionsFileInput);
		}



		//---------------------------------------------------------------------------------------------

		var do_binding_FileInput = function(div, obj, options) {
			do_gl_init_fileinputPlugin(
					$(div),
					{	
						obj 		: obj, 
						fileinput	: options
					}
			);
		}
		
		
		
	};


	return AutUserEntHeader;
});