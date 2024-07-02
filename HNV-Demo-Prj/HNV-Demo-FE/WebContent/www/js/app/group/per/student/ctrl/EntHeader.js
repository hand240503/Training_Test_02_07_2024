define([
	'jquery',
	'text!group/per/student/tmpl/Ent_Header.html',

	],

	function($, 
			Tmpl_Ent_Header
	) {


	var CtrlEntHeader     = function (header,content,footer, grpName) {
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

		var pr_typ_cat_I                = 1;
		var pr_typ_cat_II               = 2;

		var var_lc_TPY_CAT 			= 15200;
		var var_lc_BLOG 	= 17100;

		const pr_TYPE_LEVEL_01      = 1;
		const pr_TYPE_LEVEL_02      = 2;
		const pr_TYPE_LEVEL_03      = 3;
		const pr_TYPE_LEVEL_04      = 4;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			tmplName.ENT_HEADER					= "EntHeader";
			tmplCtrl.do_lc_put_tmpl(tmplName.ENT_HEADER	, Tmpl_Ent_Header); 	
			//----------------------------------------------------------
			pr_ctr_Main 			= App.controller[pr_grpName].Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;
			pr_ctr_Ent				= App.controller[pr_grpName].Ent;
		}      

		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;

			try{

				$(pr_divContent)				.html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_HEADER , obj));

				if(obj != null){
					$("#sel_parType")	.find("option[value="+obj.typ00+"]")  	.attr("selected","selected");
					$("#sel_type_01")	.find("option[value="+obj.typ01+"]")	.attr("selected","selected");
				} 

				do_init_datatable();
				do_bind_event(obj, mode);

			}catch(e) {				
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  pr_grpName, "EntHeader", "do_lc_show", e.toString()) ;
			}
		};

		var do_bind_event =  function (obj, mode){
			$("#sel_parType").off("change").on("change", function(){
				var parType = $(this).find(":selected").val();
				var typ01 	= $("#sel_type_01").val();

				if(typ01 == pr_TYPE_LEVEL_01){
					$("#inp_sel_parId").html("");
					$("#inp_sel_parId").attr("disabled", "disabled");
					$("#inp_sel_parId").removeAttr('data-validation');
				} else{
					do_bind_event_catParent (parType, typ01-1);
				}

			});

			$("#sel_type_01").off("change").on("change", function(){
				var parType = $("#sel_parType").val();
				var typ01 	= $(this).find(":selected").val();
				do_bind_event_catParent (parType, typ01-1);
			});

			var parType = $("#sel_parType").val();
			var typ01 	= $("#sel_type_01").val();
			do_bind_event_catParent (parType, typ01);
		}
		var do_bind_event_catParent =  function (parType, typ01){
			if (parType>0 && typ01>0){
				$("#inp_sel_parId").removeAttr("disabled");
				$("#inp_sel_parId").attr("data-validation", "required");
				do_gl_input_autocomplete_dyn("#inp_sel_parId", {
					placeholder : $.i18n("mat_material_header_select"),
					dataService : ["ServiceCtrlDyn", "SVCtrlLstSearch"], 
					dataReq 	: {"parTyp" : parType, "typ01" : typ01}, 
					dataRes 	: ["name"], 
					dataSel 	: {"#inp_parId": "id"},
					minLength	: 0,
					canAdd		: false
				});
			}
		}
		
	};


	return CtrlEntHeader;
});