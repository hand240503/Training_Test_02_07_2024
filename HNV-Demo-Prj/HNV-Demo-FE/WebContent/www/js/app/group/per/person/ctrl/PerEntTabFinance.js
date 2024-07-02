define([
	'jquery',
	'text!template/shp/per/Per_Ent_Tab_Finance.html',
],
	function ($,
		Per_Ent_Tab_Finance
	) {

		var PerEntTabFinance = function () {
			//---------------------------------------------------------------------------------------------------------
			//DEFINITIONS------DEFINITIONS------DEFINITIONS------DEFINITIONS------DEFINITIONS-----DEFINITIONS-----DEFIN						
			//---------------------------------------------------------------------------------------------------------
			var pr_divContent = "#div_Per_Ent_Tab_Finance";

			var tmplName = App.template.names;
			var tmplCtrl = App.template.controller;

			var svClass = App['const'].SV_CLASS;
			var svName = App['const'].SV_NAME;
			var sessId = App['const'].SESS_ID;
			var userId = App['const'].USER_ID;

			var fVar = App['const'].FUNCT_SCOPE;
			var fName = App['const'].FUNCT_NAME;
			var fParam = App['const'].FUNCT_PARAM;

			var self = this;

			var pr_ctr_Main = null;
			var pr_ctr_List = null;
			var pr_ctr_Ent = null;
			var pr_ctr_EntHeader = null;
			var pr_ctr_EntBtn = null;
			var pr_ctr_EntTabs = null;

			var pr_obj = null;
			var pr_mode = null;
			//------------------------------------------------------------------------------------
			var pr_OBJ_TYPE = 100;
			var pr_parentId = null;
			var pr_typeORDERSS = 1;

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
				pr_obj = obj;
				pr_mode = mode;
				pr_parentId = obj.id;
				try {
					tmplName.PER_ENT_TAB_FINANCE = "Per_Ent_Tab_Finance";
					tmplCtrl.do_lc_put_tmpl(tmplName.PER_ENT_TAB_FINANCE, Per_Ent_Tab_Finance);
					$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_ENT_TAB_FINANCE, obj));

					do_gl_enhance_within($(pr_divContent), {
						obj: pr_obj
					});
					
					do_get_list_ByAjax(obj, mode, param);
					
				} catch (e) {
					do_gl_show_Notify_Msg_Error("PerEntTabFin: " + e.toString());
					do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.partner", "PerEntTabFin", "do_lc_show", e.toString());
				}
			};

			
			//---------------------------------------------------------------------------------------------
			//-------------------------------------------------------------------------------------------
			//-------------------------------------------------------------------------------------------		
			function do_get_list_ByAjax(obj, div, param) {
				var ref = req_gl_Request_Content_Send("ServiceFinFinance", "SVFinGet");

				ref["id"] 			= pr_obj.id;
				ref["typ"] 			= 10;

				var fSucces = [];
				fSucces.push(req_gl_funct(null, do_show_data, div));

				var fError = req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax")]);

				App.network.ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
			}

			//--------------------------------------------------------------------------------------------
			var do_show_data = function (sharedJson, div) {
				if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
					var data = sharedJson[App['const'].RES_DATA];
					var hist = JSON.parse(data.inf01)
					
					for (var i in hist){
						var line = hist[i];
						if (!line.finalSum) line.finalSum = line.lastSum + line.ordVal;
					}
					
					$("#inp_sor_finance_sum").val($.formatNumber(data.val01, {format:"#,##0.#", locale : localStorage.language}))
					var additionalConfig = {
							"ordView": {
								fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
									let key = oData.mcq_id;
									$(nTd).html(`<i class='fa fa-eye' id='${key}'></i>`);
									$(nTd).click(function(){
										window.open("view_sor_order_out_sell.html?id="+oData.ordId, "_blank");
									});
								}
							},
					}
					req_gl_create_datatable(hist, "#table_sor_finance_rep_person", additionalConfig);


					App.controller.DBoard.DBoardMain.do_lc_bind_event_div_Minimize();
				} else {
					//do something else
					$("#table_sor_finance_rep_person").append(`<div>${$.i18n("common_err_msg_get_no_data")}</div>`);
				}
			}
		};

		return PerEntTabFinance;
	});