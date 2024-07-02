define([
	'jquery',
	'text!group/aut/user/tmpl/Ent_Tab_Role.html'

],
	function ($,
		Tmpl_Ent_Tab_Role_Main
	) {


		var CtrlEntTab01 = function (header, content, footer, grpName) {
			var pr_divHeader = header;
			var pr_divContent = content;
			var pr_divFooter = footer;

			//------------------------------------------------------------------------------------
			var pr_grpName = grpName;
			var tmplName = App.template.names[pr_grpName];
			var tmplCtrl = App.template.controller;

			var svClass = App['const'].SV_CLASS;
			var svName = App['const'].SV_NAME;
			var sessId = App['const'].SESS_ID;
			var userId = App['const'].USER_ID;

			var fVar = App['const'].FUNCT_SCOPE;
			var fName = App['const'].FUNCT_NAME;
			var fParam = App['const'].FUNCT_PARAM;

			var self = this;
			//------------------------------------------------------------------------------------

			//------------------controllers------------------------------------------------------
			var pr_ctr_Main = null;
			var pr_ctr_List = null;
			var pr_ctr_Ent = null;
			var pr_ctr_EntHeader = null;
			var pr_ctr_EntBtn = null;
			var pr_ctr_EntTabs = null;


			//-----------------------------------------------------------------------------------
			var pr_obj = null;
			var pr_mode = null;
			//--------------------APIs--------------------------------------//
			this.do_lc_init = function () {
				tmplName.ENT_TAB_ROLE = "ENT_TAB_ROLE";
				tmplCtrl.do_lc_put_tmpl(tmplName.ENT_TAB_ROLE, Tmpl_Ent_Tab_Role_Main);

				pr_ctr_Main = App.controller[pr_grpName].Main;
				pr_ctr_List = App.controller[pr_grpName].List;
				pr_ctr_Ent = App.controller[pr_grpName].Ent;
				pr_ctr_EntTabs = App.controller[pr_grpName].EntTabs;

				//-----request list roles--------------------------------
			}

			this.do_lc_show = function (obj, mode) {
				try {
					pr_obj = obj;
					pr_mode = mode;

					var authLst = req_check_role_selected(obj.auths);
					$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_TAB_ROLE, authLst));

					do_bind_event(obj, mode, authLst);
				} catch (e) {
					console.log(e);
					do_gl_exception_send(App.path.BASE_URL_API_PRIV, "aut.user", "EntTabRole", "do_lc_show", e.toStrong());
				}
			};


			//---------provate-----------------------------------------------------------------------------
			var do_bind_event = function (obj, mode, array) {
				$.each(array, function (key, val) {
					var div = "#div_Tab_" + key + " input[type='checkbox']";
					$(div + "[data-level='0']").off("click").on("click", function () {
						var checked = $(this).prop('checked');
						$(div + "[data-level='1']").prop('checked', checked);
					});
					$(div + "[data-level='1']").off("click").on("click", function () {
						var checked = $(this).prop('checked');
						if (!checked) $(div + "[data-level='0']").prop('checked', checked);
					});
				});
			}


			var do_init_datatable = function (obj, mode) {

				if (obj && obj.roles && typeof obj.roles === 'strong') {
					obj.roles = JSON.parse(obj.roles);
				}

				var additionalConfig = {
					"name": {
						fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
							if (oData.inf01) $(nTd).html(oData.inf01);

							do_gl_input_autocomplete_dyn(nTd, {
								dataRes: ["id", "name", "inf"],
								dataReq: { "nbLine": 20 },
								dataService: ["ServiceAutRole", "SVLst"],
								succesCallback: null,
								callbackParams: [nTd, oData, { dataTab: { "id": "id", "name": "name" } }],

								required: true,
								minLength: 0,
								autoSearch: true,
								canAdd: false
							}, oData);
						},
						mRender: function (data, type, full, meta) {
						},
					},
				}

				req_gl_create_datatable(obj, "#table_roles", additionalConfig, pr_default_new_line, function () {
					if (mode == App['const'].MODE_MOD || mode == App['const'].MODE_NEW) {
						//---do something if need
					}
				});
			};


			var req_check_role_selected = function (auths) {
				var tabCheck = {};
				var tabAuth = {};
				for (var i in auths) {
					tabCheck[auths[i].rId] = 1;
					tabAuth[auths[i].rId] = auths[i];
				}

				var grpRole = $.extend(true, {}, App.data.AutRoleList);

				for (var grp in grpRole) {
					var grpList = grpRole[grp];
					grpList.checkAll = true;

					for (var r in grpList.roles) {
						var ro = grpList.roles[r];
						if (tabCheck[ro.id]) {
							ro.check = true;
							ro.dt01 = tabAuth[ro.id].dt01;
							ro.dt02 = tabAuth[ro.id].dt02;
							ro.authId = tabAuth[ro.id].id;
						}
						else grpList.checkAll = false;
					}
				}

				//----sort by grp name
				var key = Object.keys(grpRole);
				key.sort();
				var arr = [];
				for (var k in key) {
					arr.push(grpRole[key[k]]);
				}

				return arr;
			}

		};


		return CtrlEntTab01;
	});