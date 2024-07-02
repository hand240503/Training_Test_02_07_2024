define([
	'jquery',
	'text!template/shp/per/Per_Ent_Tab_Note.html',
],
	function ($,
		Per_Ent_Tab_Note
	) {

		var PerEntTabNote = function () {
			//---------------------------------------------------------------------------------------------------------
			//DEFINITIONS------DEFINITIONS------DEFINITIONS------DEFINITIONS------DEFINITIONS-----DEFINITIONS-----DEFIN						
			//---------------------------------------------------------------------------------------------------------
			var pr_divContent = "#div_Per_Ent_Tab_Note";

			var tmplName = App.template.names;
			var tmplCtrl = App.template.controller;

			var self = this;

			var pr_ctr_Main = null;
			var pr_ctr_List = null;
			var pr_ctr_Ent = null;
			var pr_ctr_EntHeader = null;
			var pr_ctr_EntBtn = null;
			var pr_ctr_EntTabs = null;

			var pr_obj = null;
			var pr_mode = null;
			
		
			//  RIGHT PERSON----------------------------------------
			var typePartnerClient		= 1010002;
			var typePartnerSupplier		= 1010003;
			var typePartnerProducer		= 1010004;
			var typePartnerThirdparty	= 1010006;

			var RIGHT_PER_CLIENT_N		=	20102;
			var RIGHT_PER_CLIENT_M		=	20103;
			var RIGHT_PER_CLIENT_R		=	20105;
			
			var RIGHT_PER_SUPPLIER_N	=	20202;
			var RIGHT_PER_SUPPLIER_M	=	20203;
			var RIGHT_PER_SUPPLIER_R	=	20205;
			
			var RIGHT_PER_PRODUCER_N	=	20302;
			var RIGHT_PER_PRODUCER_M	=	20303;
			var RIGHT_PER_PRODUCER_R	=	20305;
			
			var RIGHT_PER_THIRDPARTY_N	=	20402;
			var RIGHT_PER_THIRDPARTY_M	=	20403;
			var RIGHT_PER_THIRDPARTY_R	=	20405;
			//------------------------------------------------------------------------------------
		
			var pr_parentId = null;

			var pr_default_new_line = {
				dt: null,
				uId: App.data.user.id,
				uName: App.data.user.login,
				cont: null,
			}

			//--------------------APIs--------------------------------------//
			this.do_lc_init = function () {
				pr_ctr_Main = App.controller.Per.Main;
				pr_ctr_List = App.controller.Per.List;
				pr_ctr_Ent = App.controller.Per.Ent;
				pr_ctr_EntHeader = App.controller.Per.EntHeader;
				pr_ctr_EntBtn = App.controller.Per.EntBtn;
				pr_ctr_EntTabs = App.controller.Per.EntTabs;
			}

			this.do_lc_show = function (obj, mode, param) {
				pr_ctr_Main = App.controller.Per.Main;
				pr_obj = obj;
				pr_mode = mode;
				pr_parentId = obj.id;
				try {
					tmplName.PER_ENT_TAB_NOTE = "Per_Ent_Tab_Note";

					tmplCtrl.do_lc_put_tmpl(tmplName.PER_ENT_TAB_NOTE, Per_Ent_Tab_Note);

					$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_ENT_TAB_NOTE, obj));

					if (obj.inf04 && typeof obj.inf04 === "string") obj.inf04 = JSON.parse(obj.inf04);

					var taConfig	= {
						bScrollCollapse	: true,
						colReorder		: true,
						order 			: [[1,'asc']],
						columnDefs: [
							{ "width":  "50px", "targets": "dt" 	},
							{ "width":  "50px", "targets": "uName" 	},
						  ]
					}

					req_gl_create_datatable(obj, "#table_note", null, pr_default_new_line, function(){
						do_gl_enable_edit($(pr_divContent));
						if (isHasRight(obj)) {
							$("#btn_add").show();
							$("#a_btn_save").show();
						} else {
							$("#btn_add").hide();
							$("#a_btn_save").hide();
						}
					}, null, taConfig);

					do_lc_bind_event(obj);

				} catch (e) {
				}
			};

			var isHasRight = function (obj) {
				let typ = do_get_per_person_type();
				if (!typ) typ = obj.typ02
				else typ += 1010000;

				if (typ == typePartnerClient) {
					if (App.data.user.rights.includes(RIGHT_PER_CLIENT_N) || App.data.user.rights.includes(RIGHT_PER_CLIENT_M) || App.data.user.rights.includes(RIGHT_PER_CLIENT_R)) {
						return true;
					}
				} else if (typ == typePartnerSupplier) {
					if (App.data.user.rights.includes(RIGHT_PER_SUPPLIER_N) || App.data.user.rights.includes(RIGHT_PER_SUPPLIER_M) || App.data.user.rights.includes(RIGHT_PER_SUPPLIER_R)) {
						return true;
					}
				} else if (typ == typePartnerProducer) {
					if (App.data.user.rights.includes(RIGHT_PER_PRODUCER_N) || App.data.user.rights.includes(RIGHT_PER_PRODUCER_M) || App.data.user.rights.includes(RIGHT_PER_PRODUCER_R)) {
						return true;
					}
				} else if (typ == typePartnerThirdparty) {
					if (App.data.user.rights.includes(RIGHT_PER_THIRDPARTY_N) || App.data.user.rights.includes(RIGHT_PER_THIRDPARTY_M) || App.data.user.rights.includes(RIGHT_PER_THIRDPARTY_R)) {
						return true;
					}
				}

				return false;
			}

			var do_lc_bind_event = function (obj) {
				$("#a_btn_save").off("click").on("click", () => {
					var	per 				= req_gl_data({
						dataZoneDom		: $("#tab_Per_Ent_Note"),
					});
				
					if(per.hasError == true){
						do_gl_show_Notify_Msg_Error ($.i18n('common_err_entity_save'));
						return false;
					}
					per.data.id = obj.id;
					if (per.data.inf04) {
						per.data.inf04.forEach((e) => {
							if (e.uId == App.data.user.id) e.uName = App.data.user.login;
						})
					}

					do_send_mod(per);
				})
			}

			var do_get_per_person_type = function(){
				if(App.data.url) {
					var urlParams = req_gl_Url_Params(App.data.url);
					if (urlParams.typ)
						return parseInt(urlParams.typ);
				}
	
				return 0;
			}

			var do_send_mod = function(data) {
				var ref 		= {};
				var ref = req_gl_Request_Content_Send("ServicePerPerson", "SVPerPersonEditComment");

				var fSucces			= [];
				fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg	, [null, null, App['const'].MODE_MOD])); 
				fSucces.push(req_gl_funct(null	, do_show_partner					, []));
	
				var fError 			= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax")]);	
	
				data.do_lc_send_data(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, fSucces, fError, "obj");
			}

			function do_show_partner(sharedJson, mode, localObj, objMod, oldObject){
				if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
					if(localObj){//le cas de cancel action object
						self.do_lc_show(localObj, mode); 
					}else{					
						var per = sharedJson[App['const'].RES_DATA];
						if(per == null){
							per = {};
						}
						
						self.do_lc_show(per, mode);
					}			     		
				} else {
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_save'));
				}
			}

	
		};

		return PerEntTabNote;
	});