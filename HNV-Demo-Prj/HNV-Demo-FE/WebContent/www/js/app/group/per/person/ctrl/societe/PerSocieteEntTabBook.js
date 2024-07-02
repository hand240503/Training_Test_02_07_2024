define([
	'jquery',
	'text!template/per/societe/PerSociete_Ent_Tab_Book.html'

	],
	function($,
			PerSociete_Ent_Tab_Book
	) {


	var PerSocieteEntTabBook     = function (header,content,footer, grpName) {
		const pr_divHeader 			= header;
		const pr_divContent 		= content;
		const pr_divFooter 			= footer;

		//------------------------------------------------------------------------------------
		const tmplName				= App.template.names;
		const tmplCtrl				= App.template.controller;

		const svClass 				= App['const'].SV_CLASS;
		const svName				= App['const'].SV_NAME;
		const sessId				= App['const'].SESS_ID;
		const userId          		= App['const'].USER_ID;

		const fVar					= App['const'].FUNCT_SCOPE;
		const fName					= App['const'].FUNCT_NAME;
		const fParam				= App['const'].FUNCT_PARAM;		

		var self 					= this;

		//---------------------------------------------------------------------------------------------------------
		//DEFINITIONS------DEFINITIONS------DEFINITIONS------DEFINITIONS------DEFINITIONS-----DEFINITIONS-----DEFIN						
		//---------------------------------------------------------------------------------------------------------
		let pr_ctr_Main 			= null;
		let pr_ctr_List 			= null;
		let pr_ctr_Ent				= null;
		let pr_ctr_EntHeader 		= null;
		let pr_ctr_EntBtn 			= null;
		let pr_ctr_EntTabs 			= null;

		//-----------------------------------------------------------------------------------
		let pr_obj				= null;
		let pr_mode					= null;

		let pr_detail_type_list		= [];
		let pr_date_selected_list	= [];

		const pr_stat_desactive 	= 0;
		const pr_stat_active 		= 1;
		const pr_stat_active_hide 	= 2;

		const pr_stat_place         = [
			{"k" : pr_stat_active 		, "v": $.i18n("nso_area_tab_detail_book_stat_active"		)},
			{"k" : pr_stat_active_hide 	, "v": $.i18n("nso_area_tab_detail_book_stat_active_hide"	)},
			{"k" : pr_stat_desactive 	, "v": $.i18n("nso_area_tab_detail_book_stat_deactive"		)},
			]
		
//		const pr_stat_place         = {
//				"0" : $.i18n("nso_area_tab_detail_book_stat_deactive"),
//				"1" : $.i18n("nso_area_tab_detail_book_stat_active"),
//				"2" : $.i18n("nso_area_tab_detail_book_stat_active_hide")
//		}

		//--------------------APIs--------------------------------------//

		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.Per.Main;
			pr_ctr_List				= App.controller.Per.List;
			pr_ctr_Ent				= App.controller.Per.Ent;
			pr_ctr_EntHeader 		= App.controller.Per.EntHeader;
			pr_ctr_EntBtn 			= App.controller.Per.EntBtn;
			pr_ctr_EntTabs 			= App.controller.Per.EntTabs;
		}

		this.do_lc_show	= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;

			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.PER_SOCIETE_ENT_TAB_BOOK, PerSociete_Ent_Tab_Book); 
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_SOCIETE_ENT_TAB_BOOK, obj));
				do_bind_event_detail(obj, mode);
			}catch(e) {
				do_gl_show_Notify_Msg_Error("NsoArea: EntAreaTabDetailBook :" + e.toString());
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "nso.area", "NsoAreaEntTabDetailBook", "do_lc_show", e.toString()) ;
			}
		}

		function do_load_controller(ctrPath, ctrName){
			var ctrClass  =  require(ctrPath);
			if (!ctrClass  ){	
				setTimeout(function(param) {
					window.location.reload();
				}, 200);					
				return;
			}
			App.controller.NsoArea[ctrName]  = new ctrClass(pr_divContent);
			App.controller.NsoArea[ctrName]	.do_lc_init();
		}

		//---------------------------------------------------------------------------------------------------------
		//AREA GENERAL------AREA GENERAL------AREA GENERAL------AREA GENERAL------AREA GENERAL-----AREA GENERAL----				
		//---------------------------------------------------------------------------------------------------------
		let pr_default_detail_partner = {

		};

		var do_bind_event_detail = function (obj, mode){
			pr_mode = mode;
			if(mode == App['const'].MODE_NEW){
				obj.detail = [];
			}

			do_init_detail_table(obj, mode);

		}.bind(this);

		var do_init_detail_table = function(obj, mode) {
			var additionalConfig = {								
					"typ01": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							if(mode != App['const'].MODE_SEL){
								oData.typ01 = 6;
								oData.ord = 1;
							}
						},
					},

					"info02_" : {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							$(nTd).html('<input class="form-control objData" type="time" min="00:00" max="23:59">');
							if(oData.id > 0 && oData.info02)
								$(nTd).find("input").val(oData.info02);
							if(pr_mode == App['const'].MODE_MOD || pr_mode == App['const'].MODE_NEW) {
								$(nTd).find("input").on("change", function(e){
									oData.info02 = $(this).val();
									$(nTd).parent().find(".info02").html($(this).val());
								});
							}
						}
					},

					"info03_" : {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							$(nTd).html('<input class="form-control objData" type="time" min="00:00" max="24:00">');
							if(oData.id > 0 && oData.info03)
								$(nTd).find("input").val(oData.info03);
							if(pr_mode == App['const'].MODE_MOD || pr_mode == App['const'].MODE_NEW) {
								$(nTd).find("input").on("change", function(e){
									oData.info03 = $(this).val();
									$(nTd).parent().find(".info03").html($(this).val());
								});
							}
						}
					},

					"info04Lab": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							var line = $(nTd).parent();
							if (oData.info04 != null && oData.info04 !== ""){
								
//								const statLab = pr_stat_place.reduce((acc, item) => {
//									  return (item.k == oData.info04) ? item.v : acc;
//									}, "");
//								
//								$(nTd).html(statLab);
								for(let i in pr_stat_place){
									if(pr_stat_place[i].k == oData.info04){
										$(nTd).html(pr_stat_place[i].v);
										break;
									}
								}
							}
							if(!oData.id > 0){
//								const statLab = pr_stat_place.reduce((acc, item) => {
//									  return (item.k == pr_stat_active) ? item.v : acc;
//									}, "");
//								
//								$(nTd).html(statLab);
								for(let i in pr_stat_place){
									if(pr_stat_place[i].k == pr_stat_active){
										$(nTd).html(pr_stat_place[i].v);
										break;
									}
								}
							}
							if(pr_mode == App['const'].MODE_MOD || pr_mode == App['const'].MODE_NEW) {

								do_gl_autocomplete({
									el				: $(nTd),
									required		: true,
									source			: pr_stat_place,
									selectCallback	: function(item) {
										oData.info04 = JSON.stringify(item.k);
									},
									renderAttrLst	: ["v"],
									minLength		: 0
								});
							}
						},
					},

					"management": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							if(pr_mode != App['const'].MODE_NEW && oData.id != ""){
								$(nTd).html("<div class='text-center'><a><i class='fa fa-calendar'></i></a></div>");
								$(nTd).find(".fa-calendar").off("click");
								$(nTd).find(".fa-calendar").click(function(){
									do_show_calendar_popup(obj, oData);
								});
							}
						}
					},
			}

			req_gl_create_datatable(obj, "#table_nso_detail_book", additionalConfig, pr_default_detail_partner, function(){
				if(pr_mode == App['const'].MODE_MOD || pr_mode == App['const'].MODE_NEW) {
					do_gl_enable_edit($(pr_divContent));
				}else if(pr_mode == App['const'].MODE_TRANSL){
					$(pr_divContent).find(".transl").attr("contenteditable", "true"); 
					$("#table_nso_detail_book").find(".info02_ input, .info03_ input").attr("disabled", "disabled");
				}else{
					$("#table_nso_detail_book").find(".info02_ input, .info03_ input").attr("disabled", "disabled");
				}
				$("#table_nso_detail_book").find(".info02, .info03").hide();
			});	
		}.bind(this);

		var do_show_calendar_popup = function(obj, oData){
			if(pr_mode != App['const'].MODE_NEW && oData.id != "")
				do_get_calendar_stock(obj, oData);

			if(pr_mode == App['const'].MODE_SEL) {
				do_gl_disable_edit($("#msb_message_box"));
			}
		}

		var do_get_calendar_stock = function(obj, oData){
			let ref 		= {};
			ref[svClass] 	= "ServicePerPerson"; 
			ref[svName]		= "SVPersonPlaceDateLst";
			ref[userId]		= App.data.user.id;
			ref[sessId]		= App.data.session_id;
			ref["perId"]	= obj.id;
			ref["infoId"]	= oData.id;

			let fSucces		= [];
			fSucces.push(req_gl_funct(null	, do_show_calendar_stock		, [obj, oData]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_show_calendar_stock = function(sharedJson, obj, oData){

			let toDay 			= new Date();
			let toDay_ 			= (new Date()).setHours(0,0,0,0);
			let lstDateResev 	= [];

			if(pr_mode == App['const'].MODE_MOD)
				App.MsgboxController.do_lc_show({
					title		: $.i18n("nso_area_tab_detail_book_popup_title"	),
					content 	: '<div id="matStockCalendar" class="text-center"></div>',
					autoclose	: false,
					buttons		: {
						save: {
							lab		: $.i18n("common_btn_save"),
							funct	: 	function(){
								do_save_date_for_reservation(obj, oData);
							}				
						},
						NO: {
							lab		:  $.i18n("common_btn_cancel"),
						}
					}
				});
			else
				App.MsgboxController.do_lc_show({
					title		: $.i18n("nso_area_tab_detail_book_popup_title"	),
					content		: '<div id="matStockCalendar" class="text-center"></div>',
					autoclose	: false,
					buttons		: {
						OK: {
							lab		:  $.i18n("common_btn_ok"),
						}
					}
				});

			if(sharedJson != null){
				if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES){
					data 	= sharedJson[App['const'].RES_DATA];
					for(let i=0; i<data.length; i++){
						let dt01 =new Date(data[i].dt01);
						lstDateResev.push(dt01);
					}
				}else{
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
				}
			}
			var render_pickmeup = true
			pickmeup('#matStockCalendar', {
				flat      : true,
				mode      : 'multiple',
				render 	: function(date){
					if(date.setHours(0,0,0,0) < toDay_)
						return {disabled : true};
				},
				calendars : 3,
				current	: toDay,
				locale	: App.language? App.language: 'en'
			});
			render_pickmeup = false;
			do_bind_event_date_calendar(lstDateResev);
		}

		var do_bind_event_date_calendar = function(lstDateResev){
			pickmeup('#matStockCalendar').set_date(lstDateResev);
		}

		var do_save_date_for_reservation = function(obj, oData){
			let ref 		= {};
			ref[svClass] 	= "ServicePerPerson"; 
			ref[svName]		= "SVPersonPlaceDateMod";
			ref[userId]		= App.data.user.id;
			ref[sessId]		= App.data.session_id;
			ref["perId"]	= obj.id;
			ref["infoId"]	= oData.id;

			let dateLst = pickmeup('#matStockCalendar').get_date();
			for(let i=0; i<dateLst.length; i++){
				dateLst[i] = DateFormat(dateLst[i]);
			}

			ref["dts"]		= JSON.stringify(dateLst);

			let fSucces		= [];
			fSucces.push(req_gl_funct(App	, do_gl_show_Notify_Msg	, [null, null, App['const'].MODE_MOD])); 
//			fSucces.push(req_gl_funct(null	, do_after_save_date_for_reservation		, [obj, oData]));	

			let fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax"), 0]);	

			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

//		var do_after_save_date_for_reservation = function(sharedJson, obj, oData){
//		if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES){
//		do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
//		}else{
//		do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_get'));
//		}
//		}

	}.bind(this);

	return PerSocieteEntTabBook;
});