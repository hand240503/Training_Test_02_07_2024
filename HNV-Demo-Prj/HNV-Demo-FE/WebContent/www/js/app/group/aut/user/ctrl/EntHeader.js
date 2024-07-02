define([
	'jquery',
	'text!group/aut/user/tmpl/Ent_Header.html',

],

	function ($,
		Tmpl_Ent_Header

	) {


		var CtrlEntHeader = function (header, content, footer, grpName) {
			var pr_divHeader = header;
			var pr_divContent = content;
			var pr_divFooter = footer;

			//------------------------------------------------------------------------------------
			var pr_grpName = grpName;
			//------------------------------------------------------------------------------------
			var tmplName = App.template.names[pr_grpName];
			var tmplCtrl = App.template.controller;

			var self = this;
			//------------------------------------------------------------------------------------

			var svClass = App['const'].SV_CLASS;
			var svName = App['const'].SV_NAME;
			var userId = App['const'].USER_ID;
			var sessId = App['const'].SESS_ID;
			var fVar = App['const'].FUNCT_SCOPE;
			var fName = App['const'].FUNCT_NAME;
			var fParam = App['const'].FUNCT_PARAM;

			//------------------controllers------------------------------------------------------
			var pr_ctr_Main = null;
			var pr_ctr_List = null;
			var pr_ctr_Ent = null;
			var pr_ctr_EntHeader = null;
			//-----------------------------------------------------------------------------------
			var pr_obj = null;
			var pr_mode = null;

			//--------------------APIs--------------------------------------//
			this.do_lc_init = function () {

				tmplName.ENT_HEADER = "EntHeader";

				tmplCtrl.do_lc_put_tmpl(tmplName.ENT_HEADER, Tmpl_Ent_Header);

				//-------------------------------------------------------
				pr_ctr_Main = App.controller[pr_grpName].Main;
				pr_ctr_List = App.controller[pr_grpName].List;

				pr_ctr_Ent = App.controller[pr_grpName].Ent;
				pr_ctr_EntHeader = App.controller[pr_grpName].EntHeader;


            }

			this.do_lc_show = function (obj, mode) {
				pr_obj = obj;
				pr_mode = mode;

				try {
					if (obj.per)
						obj.per.name = req_FullName(obj.per.name01, obj.per.name02, obj.per.name03);

					if (obj.man)
						obj.man.name = obj.man.name01;

					if (obj.cats && !Array.isArray(obj.cats))
						obj.cats = obj.cats.split(",");

					$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_HEADER, obj));

					do_bind_event(obj, mode);
				} catch (e) {
					console.log(e);
					do_gl_exception_send(App.path.BASE_URL_API_PRIV, "aut.user", "EntHeader", "do_lc_show", e.toString());
				}
			};

			//---------private-----------------------------------------------------------------------------
			var do_bind_event = function (obj, mode) {
				if (mode == App['const'].MODE_NEW) {
					$("#div_ent_password").show();
					$("#div_ent_password").removeClass("noData");
				}

				$("#btn_change_pass").on("click", function () {
					$("#div_ent_password").slideToggle();
					$("#div_ent_password").toggleClass("noData");
				});

                $('#btn_show_time_list').off('click').on('click', function (e) {
                    $(pr_divContent).find('#modal_time_main').modal('show');
                });

				do_gl_input_autocomplete_dyn("#inp_ent_supName", {
					dataRes: ["login01", "inf01", "inf02"],
					dataReq: { nbLine: 20, typ01: "[1]" },
					dataService: ["ServiceAutUser", "SVLst"],

					dataSel: {
						"#inp_ent_supName": "login01",
						"#inp_ent_uId03": "id"
					},
				});

//				do_gl_input_autocomplete_dyn("#inp_ent_perName", {
//					dataRes: ["name01", "name02", "name03"],
//					dataReq: { nbLine: 20, typ01: "[100]", typ02: "[1001000]" },
//					dataService: ["ServicePerPerson", "SVLst"],
//					dataSel: { "#inp_ent_perId": "id" },
//				});

				do_gl_input_autocomplete_dyn("#inp_ent_manName", {
					dataRes: ["name01", "name02", "name03"],
					dataReq: { nbLine: 20, typ01: "[200]", typ02: "[2001000]" },
					dataService: ["ServicePerPerson", "SVLst"],
					dataSel: { "#inp_ent_manId": "id" },
				});


				$("#inp_ent_typ").on('change', function(){
					console.log($('#inp_ent_typ').find(":selected").val());
					if($('#inp_ent_typ').find(":selected").val() == 100){
						$("#sel_cat").removeAttr("disabled");
					}else{
						$("#sel_cat").prop('disabled',true);
					}
				});
			}

			var req_FullName = function (...names) {
				var s = "";
				for (var i in names) {
					if (!i) continue;
					s = s + " " + names[i];
				}
				return s.trim();
			}



		};


		return CtrlEntHeader;
	});