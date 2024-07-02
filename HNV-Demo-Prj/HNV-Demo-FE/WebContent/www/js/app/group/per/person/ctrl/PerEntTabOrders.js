define([
	'jquery',
	'text!template/shp/per/Per_Ent_Tab_Orders.html',
	'text!template/shp/per/Per_Ent_Tab_Orders_Filter_Box.html'
],
	function ($,
		Per_Ent_Tab_Orders,
		Per_Ent_Tab_Orders_Filter_Box
	) {

		var PerEntTabOrders = function () {
			//---------------------------------------------------------------------------------------------------------
			//DEFINITIONS------DEFINITIONS------DEFINITIONS------DEFINITIONS------DEFINITIONS-----DEFINITIONS-----DEFIN						
			//---------------------------------------------------------------------------------------------------------
			var pr_divContent = "#div_Per_Ent_Tab_Orders";

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
			
			var RIGHT_SOR_ORDER_I_STK_BUY_G		=	410101;
			var RIGHT_SOR_ORDER_I_STK_SHOP_G	=	410201;
			var RIGHT_SOR_ORDER_I_STK_BAL_G		=	410301;
			var RIGHT_SOR_ORDER_I_INF_G			=	411001;
			var RIGHT_SOR_ORDER_O_STK_SELL_G	=	420101;
			var RIGHT_SOR_ORDER_O_STK_SHOP_G	=	420201;
			var RIGHT_SOR_ORDER_O_STK_BAL_G		=	420301;
			var RIGHT_SOR_ORDER_O_INF_G			=	421001;
			var RIGHT_MAT_MATERIAL_SIMPLE_G		=	30101;
			var RIGHT_MAT_MATERIAL_COMPLEX_G	=	30201;
			//------------------------------------------------------------------------------------
			var pr_OBJ_TYPE = 100;
			var pr_parentId = null;
			var pr_typeORDERSS = 1;

			const TYPE_01_IN_STK_BUY 		= 101;
			const TYPE_01_IN_STK_SHOP 		= 102;
			const TYPE_01_IN_STK_BALANCE 	= 103;

			const TYPE_01_OU_STK_SELL 			= 201;
			const TYPE_01_OU_STK_SHOP 			= 202;
			const TYPE_01_OU_STK_BALANCE 		= 203;
			const TYPE_01_OU_STK_BALANCE_FAIL 	= 204;
			const TYPE_01_OU_STK_BALANCE_OTHER 	= 205;
			
			const TYPE_03_VOUCHER 				= 10;
			
			const arrRights = [RIGHT_SOR_ORDER_I_STK_BUY_G, RIGHT_SOR_ORDER_I_STK_SHOP_G, RIGHT_SOR_ORDER_I_STK_BAL_G, RIGHT_SOR_ORDER_I_INF_G, 
				               RIGHT_SOR_ORDER_O_STK_SELL_G, RIGHT_SOR_ORDER_O_STK_SHOP_G, RIGHT_SOR_ORDER_O_STK_BAL_G, RIGHT_SOR_ORDER_O_INF_G,
				               RIGHT_MAT_MATERIAL_SIMPLE_G, RIGHT_MAT_MATERIAL_COMPLEX_G];


			var pr_default_new_line = {
				id: null,
				code04: null,
				name01: null,
				name02: null,
				unitRef: null,
				stat: null,
				code01: null,
				code02: null,
				code03: null,
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
				pr_obj = obj;
				pr_mode = mode;
				pr_parentId = obj.id;
				try {
					tmplName.PER_ENT_TAB_ORDERS = "Per_Ent_Tab_Orders";
					tmplName.PER_ENT_TAB_ORDERS_FILTER_BOX = "Per_Ent_Tab_Orders_Filter_Box";

					tmplCtrl.do_lc_put_tmpl(tmplName.PER_ENT_TAB_ORDERS, Per_Ent_Tab_Orders);
					tmplCtrl.do_lc_put_tmpl(tmplName.PER_ENT_TAB_ORDERS_FILTER_BOX, Per_Ent_Tab_Orders_Filter_Box);

					$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_ENT_TAB_ORDERS, obj));
					$("#per_tab_order_filter_box").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_ENT_TAB_ORDERS_FILTER_BOX, {}));

					do_gl_enhance_within($(pr_divContent), {
						obj: pr_obj
					});
					
					if($(pr_divContent).find("#tab_order_content").length > 0){
						do_get_list_ByAjax(obj, mode, param);
						$(pr_divContent).show()
					}else{
						$(pr_divContent).hide();
					}
				} catch (e) {
					do_gl_show_Notify_Msg_Error("PerEntTabOrders: " + e.toString());
					do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.partner", "PerEntTabOrders", "do_lc_show", e.toString());
				}
			};

			
			//---------------------------------------------------------------------------------------------
			//-------------------------------------------------------------------------------------------
			function do_config_col(data) {
				let tmp = data;
				tmp.forEach((e, i) => {
					// Mapping stat
					if (e.stat != null) {
						switch (e.stat) {
							case 0: tmp[i].stat = $.i18n('per_tab_orders_stat_new');
								break;
							case 1: tmp[i].stat = $.i18n('per_tab_orders_stat_chk_noSend');
								break;
							case 2:  tmp[i].stat = $.i18n('per_tab_orders_stat_valide_send');
								break;
							case 3:  tmp[i].stat = $.i18n('per_tab_orders_stat_refuse');
								break;
							case 4:  tmp[i].stat = $.i18n('per_tab_orders_stat_accept');
								break;
							case 6:  tmp[i].stat = $.i18n('per_tab_orders_stat_paid');
								break;
							case 7:  tmp[i].stat = $.i18n('per_tab_orders_stat_cancel');
								break;
							case 8:  tmp[i].stat = $.i18n('per_tab_orders_stat_expire');
								break;
							case 10: tmp[i].stat = $.i18n('per_tab_orders_stat_validation');
									break
							case 11: tmp[i].stat = $.i18n('per_tab_orders_stat_link_stock');
								break;
							case 12: tmp[i].stat = $.i18n('per_tab_orders_stat_stock_completed');
								break;
							default: tmp[i].stat = $.i18n('per_tab_orders_stat_other');
								break;
						}
					}

					// Mapping type01
					if (e.type01 != null) {
						switch (e.type01) {
							case TYPE_01_IN_STK_BUY: 
								tmp[i].type01 = $.i18n('per_tab_orders_typ01_in_buy');
								tmp[i].url	  = "view_sor_order_in_buy.html?id="+tmp[i].id
								break;
							case TYPE_01_IN_STK_SHOP: 
								tmp[i].type01 = $.i18n('per_tab_orders_typ01_in_shop');
								tmp[i].url	  = "view_sor_order_in_buy.html?id="+tmp[i].id
								break;
							case TYPE_01_IN_STK_BALANCE: tmp[i].type01 = $.i18n('per_tab_orders_typ01_in_balance');
								break;
							case TYPE_01_OU_STK_SELL: 
								tmp[i].type01 = $.i18n('per_tab_orders_typ01_out_buy');
								tmp[i].url	  = "view_sor_order_out_sell.html?id="+tmp[i].id
								break;
							case TYPE_01_OU_STK_SHOP: 
								tmp[i].type01 = $.i18n('per_tab_orders_typ01_out_shop');
								tmp[i].url	  = "view_sor_order_out_sell.html?id="+tmp[i].id
								break;
							case TYPE_01_OU_STK_BALANCE: tmp[i].type01 = $.i18n('per_tab_orders_typ01_out_balance');
								break;
							case TYPE_01_OU_STK_BALANCE_FAIL: tmp[i].type01 = $.i18n('per_tab_orders_typ01_out_balance_fail');
								break;
							case TYPE_01_OU_STK_BALANCE_OTHER: tmp[i].type01 = $.i18n('per_tab_orders_typ01_out_balance_other');
								break;
						}
					}
					
					if (e.type03 != null) {
						switch (e.type03) {
							case TYPE_03_VOUCHER: tmp[i].type03 = $.i18n('per_tab_orders_typ03_voucher');
							break;
							default: tmp[i].type03 = null;
							break;
						}
					}

					// Mapping dt01
					if (e.dt01) tmp[i].dt01 = App.controller.DBoard.DBoardMain.formatShortDate(e.dt01);
					// Mapping dt03
					if (e.dt03) tmp[i].dt03 = App.controller.DBoard.DBoardMain.formatShortDate(e.dt03);

					// Mapping taxe
					if (e.val06 && e.val07) tmp[i].taxe = e.val07 - e.val06;
					
					if (e.val06) 		e.val06 	= req_gl_numberFormat(e.val06, 1);
					if (e.val07) 		e.val07 	= req_gl_numberFormat(e.val07, 1);
					if (tmp[i].taxe) 	tmp[i].taxe = req_gl_numberFormat(tmp[i].taxe, 1);
				})
				return tmp;
			}

			//-------------------------------------------------------------------------------------------		
			function do_get_list_ByAjax(obj, div, param) {
				var ref = req_gl_Request_Content_Send("ServiceTaSorOrder", "SVSorOrderLstRepPerson");

				ref["perId"] 		= pr_obj.id;
				ref["typPerson"] 	= pr_obj.typ02;

				ref["matId"] = param != undefined ? param.matId : null;
				ref["dt01"] = param != undefined ? param.dt01 : "";
				ref["dt02"] = param != undefined ? param.dt02 : "";
				ref["code"] = param != undefined ? param.code : "";

				var fSucces = [];
				fSucces.push(req_gl_funct(null, do_show_list_rep_sale, div));

				var fError = req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax")]);

				App.network.ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
			}

			//--------------------------------------------------------------------------------------------
			var do_show_list_rep_sale = function (sharedJson, div) {
				if (sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
					var data = sharedJson[App['const'].RES_DATA];

					let sum01 = 0;
					let sum02 = 0;
					let sum03 = 0;

					data.forEach((e) => {
						sum01 = sum01 + e.val03 + e.val04;
						sum02 = sum02 + e.val06;
						sum03 = sum03 + e.val07;
					})
					let res = {
						sum01: req_gl_numberFormat(sum01,1),
						sum02: req_gl_numberFormat(sum02,1),
						sum03: req_gl_numberFormat(sum03,1)
					}
					$("#per_tab_order_filter_box").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_ENT_TAB_ORDERS_FILTER_BOX, res));

					
					
					var additionalConfig = {
							"ordView": {
								fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
									let key = oData.mcq_id;
									$(nTd).html(`<i class='fa fa-eye' id='${key}'></i>`);
									$(nTd).click(function(){
										let ordId = oData.id;
										window.open(oData.url, "_blank");
									});
								}
							},
					}

					let conf_data = do_config_col(data);
					req_gl_create_datatable(conf_data, "#table_sor_order_rep_person", additionalConfig);


					App.controller.DBoard.DBoardMain.do_lc_bind_event_div_Minimize();
				} else {
					//do something else
					$("#table_sor_order_rep_person").append(`<div>${$.i18n("common_err_msg_get_no_data")}</div>`);
				}
				do_lc_bind_event();
			}

			var do_lc_bind_event = function () {
				$("#btn_ReportSale_filter").click(() => {
					let data = req_gl_data({
						dataZoneDom : $("#div_SorOrder_Filter_Rep")
					});
					
					if(data.hasError) return;
					let tm01 = $("#inp_order_ent_tm01").val();
					tm01 = ('0' + tm01).slice(-5);

					let tm02 = $("#inp_order_ent_tm02").val();
					tm02 = ('0' + tm02).slice(-5);

					let matId = data.data.matID != "" ? data.data.matID : null;
					let dt01 = data.data.dt01? data.data.dt01 + " " +  tm01 : null;
					let dt02 = data.data.dt02? data.data.dt02 + " " +  tm02 : null;
					
					let code = $("#inp_ord_mat_code").val();

					let obj = { code, matId, dt01, dt02 };

					self.do_lc_show(pr_obj, pr_mode, obj);
				});
				do_gl_input_autocomplete_dyn("#inp_ord_mat_id", {
					dataRes: ["name01"],
					dataReq: { "nbLine": 10, "searchType": 1 },
					dataService: ["ServiceMatMaterial", "SVMatMaterialSearch"],

					succesCallback: do_lc_fill_info,

					required: true,
					minLength: 0,
					autoSearch: true,

				});

				// Bind timepicker
				$("#inp_order_ent_tm01").timepicker({//timepicker
					showMeridian: false,
					icons: {
						up: "mdi mdi-chevron-up",
						down: "mdi mdi-chevron-down"
					},
					defaultTime: '00:00',
				})

				$("#inp_order_ent_tm02").timepicker({//timepicker
					showMeridian: false,
					icons: {
						up: "mdi mdi-chevron-up",
						down: "mdi mdi-chevron-down"
					},
					defaultTime: '23:59',
				})
			}

			var do_lc_fill_info = function (item) {
				$("#mat_id").val(item.id);
			}

		};

		return PerEntTabOrders;
	});