define([
	'jquery',

	'text!group/aut/user/tmpl/Ent_Header_Time_Main.html',

	'group/aut/user/ctrl/EntHeaderTimeList',
], function ($,
	Tmpl_Ent_Header_Time_Main,

	CtrlEntHeaderTimeList
) {
	var CtrlEntHeaderTimeMain = function (header, content, footer, grpName) {
		var pr_divHeader 	= header;
		var pr_divContent 	= content;
		var pr_divFooter 		= footer;

		//------------------------------------------------------------------------------------
		var pr_lock_type 		= -1; //--const based on BO
		var pr_grpName 		= grpName;
		//------------------------------------------------------------------------------------
		var tmplName 		= App.template.names[pr_grpName];
		var tmplCtrl 			= App.template.controller;

		var svClass 				= App['const'].SV_CLASS;
		var svName 			= App['const'].SV_NAME;
		var sessId 				= App['const'].SESS_ID;
		var userId 				= App['const'].USER_ID;

		var fVar 					= App['const'].FUNCT_SCOPE;
		var fName 				= App['const'].FUNCT_NAME;
		var fParam 				= App['const'].FUNCT_PARAM;

		var self 					= this;
		//------------------------------------------------------------------------------------

		var svClass 				= App['const'].SV_CLASS;
		var svName 			= App['const'].SV_NAME;
		var userId 				= App['const'].USER_ID;
		var sessId 				= App['const'].SESS_ID;
		var fVar 					= App['const'].FUNCT_SCOPE;
		var fName 				= App['const'].FUNCT_NAME;
		var fParam 				= App['const'].FUNCT_PARAM;

		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 							= null;
		var pr_ctr_List 								= null;
		var pr_ctr_Ent 								= null;
		var pr_ctr_EntHeader 					= null;
		var pr_ctr_EntHeaderTimeMain 	= null;
		var pr_ctr_EntHeaderTimeList	= null;

		//-----------------------------------------------------------------------------------
		var pr_obj  		= null;
		var pr_mode 	= null;

		//--------------------APIs--------------------------------------//
		this.do_lc_init = function () {
			tmplName.ENT_HEADER_TIME_MAIN = "Tmpl_Ent_Header_Time_Main";
			tmplCtrl.do_lc_put_tmpl(tmplName.ENT_HEADER_TIME_MAIN, Tmpl_Ent_Header_Time_Main);

			//--------------------Ctrl--------------------------------------//
			if (!App.controller[pr_grpName].EntHeaderTimeList)
				App.controller[pr_grpName].EntHeaderTimeList = new CtrlEntHeaderTimeList(null, "#div_Ent_Header_Time_List", null, pr_grpName);
			App.controller[pr_grpName].EntHeaderTimeList.do_lc_init();

			//----------------------------------------------------------//

			pr_ctr_Main 							= App.controller[pr_grpName].Main;
			pr_ctr_List 								= App.controller[pr_grpName].List;

			pr_ctr_Ent 								= App.controller[pr_grpName].Ent;
			pr_ctr_EntHeader 					= App.controller[pr_grpName].EntHeader;
			pr_ctr_EntHeaderTimeMain 	= App.controller[pr_grpName].EntHeaderTimeMain;
			pr_ctr_EntHeaderTimeList 		= App.controller[pr_grpName].EntHeaderTimeList;
		}

		this.do_lc_show = function (obj, mode) {
			pr_obj 	 	= obj;
			pr_mode = mode;

			try {
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_HEADER_TIME_MAIN, {}));
				
				pr_ctr_EntHeaderTimeList.do_lc_show(pr_obj, mode)

				do_bind_event(obj, mode);
			} catch (e) {
				console.log(e);
				do_gl_exception_send(App.path.BASE_URL_API_PRIV, "nso.offer", "CtrlEntHeaderTimeMain", "do_lc_show", e.toString());
			}
		};

		this.do_lc_new_list = function (obj, mode) {
			var data = obj;
			try {
				if (mode === App['const'].MODE_NEW) {
					data['title'] = obj['text']
				}

				$(pr_divContent).find('#main-content').append(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_HEADER_TIME_ITEM, data));
				// ++count;

			} catch (e) {
				console.log(e);
				do_gl_exception_send(App.path.BASE_URL_API_PRIV, "nso.offer", "CtrlEntHeaderTimeMain", "do_lc_new_list", e.toString());
			}
		}

		this.do_lc_remove_list = function (obj) {
			try {
				$(pr_divContent).find(`#div_Ent_Header_Time_Item_${obj.id}`).remove();
				// --count;
			} catch (e) {
				console.log(e);
				do_gl_exception_send(App.path.BASE_URL_API_PRIV, "nso.offer", "CtrlEntHeaderTimeMain", "do_lc_remove_list", e.toString());
			}
		}

		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode) {
			if (App.controller.HtmlEditor)
				App.controller.HtmlEditor.do_lc_bindingEvent(".htmlEditor", "dest", "funct", mode, true);
		}
	};


	return CtrlEntHeaderTimeMain;
});