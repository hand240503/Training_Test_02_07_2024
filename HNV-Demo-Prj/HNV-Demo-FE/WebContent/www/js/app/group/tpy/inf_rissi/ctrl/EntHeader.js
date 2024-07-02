define([
	'jquery',
	'text!group/tpy/inf_rissi/tmpl/Ent_Header.html',

	],
	
	function($, 
			Tmpl_Ent_Header
	) {


	var CtrlEntHeader     = function (header,content,footer,grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;

		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName;
		//------------------------------------------------------------------------------------
		var tmplName				= App.template.names[pr_grpName];
		var tmplCtrl				= App.template.controller;

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
		//-----------------------------------------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;

		var pr_typ_cat_I                = 1;
		var pr_typ_cat_II               = 2;
		
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
			
			if (obj.inf01 && typeof obj.inf01 === 'string' ) obj.inf01 = JSON.parse(obj.inf01);
			if (obj.inf02 && typeof obj.inf02 === 'string') obj.inf02 = JSON.parse(obj.inf02);
			if (obj.inf03 && typeof obj.inf03 === 'string') obj.inf03 = JSON.parse(obj.inf03);
			if (obj.inf04 && typeof obj.inf04 === 'string') obj.inf04 = JSON.parse(obj.inf04);
			if (obj.inf05 && typeof obj.inf05 === 'string') obj.inf05 = JSON.parse(obj.inf05);
			
			try{
						
				$(pr_divContent)				.html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_HEADER , obj));
				
				if(obj != null){
					$('.summernote-Inf-rissi').summernote({
			            height: 150, 
			        });

				}
				
				do_bind_event		(obj, mode);
//				do_init_datatable	(obj, mode);

			}catch(e) {		
				console.log (e);
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "tpy.information", "EntHeader", "do_lc_show", e.toString()) ;
			}
		};

		var do_bind_event =  function (obj, mode){
		
		}
		
		var pr_default_new_line	= {
				id 			: null,
				name		: null,
				lang		: null,	
				code		: null,
		};
		
		var do_init_datatable = function(obj, mode){

			if (obj && obj.inf && typeof obj.inf === 'string'){
				obj.inf = JSON.parse(obj.inf);
			} 

			var additionalConfig = {
					"lang": {
						/*fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {		

						if (oData.lang != null) {
							$(nTd).html(oData.lang);
						}

						var lstLang = [{ "id": 1, "lang" :"ch"}, { "id": 2, "lang" :"en"}, { "id": 3, "lang" :"fr"}, {"id": 4, "lang" :"kr"}, { "id": 5, "lang" :"jp"}, { "id": 6, "lang" :"vi"} ];
						//var lstLang = ["ch", "en", "fr", "kr", "jp", "vi"];

						$(nTd).off("focusin");
							$(nTd).on("focusin", function () {
								do_gl_input_autocomplete_dyn(nTd, {
									dataTab : {"lang": "lang"},
									source: lstLang,
									minLength: 0
								}, oData);
							})
						},*/
					},
			}

			req_gl_create_datatable(obj, "#table_transl", additionalConfig, pr_default_new_line, function(){
				if(mode == App['const'].MODE_MOD || mode == App['const'].MODE_NEW) {
					//---do something if need
				}
			});
			req_gl_create_datatable(obj, "#table_sub", additionalConfig, pr_default_new_line, function(){
				if(mode == App['const'].MODE_MOD || mode == App['const'].MODE_NEW) {
					//---do something if need
				}
			});
		}; 
	};


	return CtrlEntHeader;
});