define([ 'jquery', 'text!group/aut/role/tmpl/Ent_Header.html'

],

		function($, Tmpl_Ent_Header) {

			var CtrlEntHeader = function(header, content, footer, grpName) {
				var pr_divHeader = header;
				var pr_divContent = content;
				var pr_divFooter = footer;

				// ------------------------------------------------------------------------------------
				var pr_grpName = grpName;
				// ------------------------------------------------------------------------------------
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
				// ------------------------------------------------------------------------------------

				var svClass = App['const'].SV_CLASS;
				var svName = App['const'].SV_NAME;
				var userId = App['const'].USER_ID;
				var sessId = App['const'].SESS_ID;
				var fVar = App['const'].FUNCT_SCOPE;
				var fName = App['const'].FUNCT_NAME;
				var fParam = App['const'].FUNCT_PARAM;

				// ------------------controllers------------------------------------------------------
				var pr_ctr_Main = null;
				var pr_ctr_List = null;
				var pr_ctr_Ent = null;
				var pr_ctr_EntHeader = null;
				var pr_ctr_EntBtn = null;
				var pr_ctr_EntTabs = null;

				// -----------------------------------------------------------------------------------
				var pr_obj = null;
				var pr_mode = null;
				// --------------------APIs--------------------------------------//
				this.do_lc_init = function() {
					// ----step 01: load
					// template----------------------------------------------------------------------------------------------
					tmplName.ENT_HEADER = "Ent_Header";
					tmplCtrl.do_lc_put_tmpl(tmplName.ENT_HEADER,
							Tmpl_Ent_Header);

					// -----------------------------------------------------------------------------------
					pr_ctr_Main = App.controller[pr_grpName].Main;
					pr_ctr_List = App.controller[pr_grpName].List;
					pr_ctr_Ent = App.controller[pr_grpName].Ent;
				}

				this.do_lc_show = function(obj, mode) {
					pr_obj = obj;
					pr_mode = mode;

					try {

						$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_HEADER, obj));

						if(obj != null){
							$("#sel_stat")		.find("option[value="+obj.stat+"]")  	.attr("selected","selected"); 
						} 
						
						// fixed max-height scroll of % height div_ContentView
						// do_gl_calculateScrollBody(pr_divContent + "
						// .custom-scroll-header", 25);

					} catch (e) {
						console.log(e);
						do_gl_exception_send(App.path.BASE_URL_API_PRIV, 	"aut.role", "EntHeader", "do_lc_show", e.toString());
					}
				};

				// ---------private-----------------------------------------------------------------------------

			};

			return CtrlEntHeader;
		});