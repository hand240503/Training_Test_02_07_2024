define([
        'jquery',
        'text!group/aut/user/tmpl/Aut_User_List.html',     
        'text!group/aut/user/tmpl/Aut_User_List_Content.html', 
        
        'text!group/aut/user/tmpl/Aut_User_List_By_Id.html',
        'text!group/aut/user/tmpl/Aut_User_List_By_Id_Header.html',  
        'text!group/aut/user/tmpl/Aut_User_List_By_Id_Content.html', 
        
        'text!group/aut/user/tmpl/Aut_User_List_Filter_Header.html',  
    	'text!group/aut/user/tmpl/Aut_User_List_Filter_Content.html', 
    	'text!group/aut/user/tmpl/Aut_User_List_Filter_Box.html', 

        ],
        function($, 
        		AutUser_List,
        		AutUser_List_Content,
        		
        		Aut_User_List_By_Id,
        		Aut_User_List_By_Id_Header,
        		Aut_User_List_By_Id_Content,
        		
        		Aut_User_List_Filter_Header,
    			Aut_User_List_Filter_Content,
    			Aut_User_List_Filter_Box
        ) 
        {

	var AutUserList 	= function (header,content,footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		
		//------------------------------------------------------------------------------------
		var tmplName				= App.template.names;
		var tmplCtrl				= App.template.controller;
		
		var svClass 				= App['const'].SV_CLASS;
		var svName					= App['const'].SV_NAME;
		var sessId					= App['const'].SESS_ID;
		var userId          		= App['const'].USER_ID;

		var fVar					= App['const'].FUNCT_SCOPE;
		var fName					= App['const'].FUNCT_NAME;
		var fParam					= App['const'].FUNCT_PARAM;		

		var self 					= this;
		
		
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
		
		//-----------------------------------------------------------------------------------
		var pr_type_visitor      	= 1;
		var pr_type_adm      		= 2;
		var pr_type_emp      		= 3;
		var pr_type_client   		= 4;
		var pr_type_client_public 	= 5;
		var pr_type_mentor 			= 6;
		var pr_type_shipper 		= 8;
		var pr_type_seller 			= 9;
		var pr_type_adm_all    		= 10;
		
		var varname					= "AutUserList";
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.AutUser.Main;
			pr_ctr_List 			= App.controller.AutUser.List;
			
			pr_ctr_Ent				= App.controller.AutUser.Ent;
			pr_ctr_EntHeader 		= App.controller.AutUser.EntHeader;
			pr_ctr_EntBtn 			= App.controller.AutUser.EntBtn;
			pr_ctr_EntTabs 			= App.controller.AutUser.EntTabs;			
		}
		
		//--------------------------------------------------------------------------------------------
		this.do_lc_show = function(){               
			try{
							
				tmplCtrl.do_lc_put_tmpl(tmplName.AUT_USER_LIST			, AutUser_List); 	
				tmplCtrl.do_lc_put_tmpl(tmplName.AUT_USER_LIST_CONTENT	, AutUser_List_Content); 		
				
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.AUT_USER_LIST			, {}));
				
				//fixed max-height scroll of % height div_ContentView
				//do_gl_calculateScrollBody(pr_divContent, 89.5);

				if(App.data.user.manId != 1){
					$("#div_AutUser_List_05_01").remove(); // thanh vien dang hoat dong
					$("#div_AutUser_List_05_02").remove(); // thanh vien dang xac thuc
					$("#div_AutUser_List_10")	.remove(); // tai khoan bị xoa
					$("#div_AutUser_List_06_01").remove(); // tu van vien dang hoat dong
					$("#div_AutUser_List_06_02").remove(); // tu van vien dang xac thuc
					$("#div_AutUser_List_08_01").remove(); // shipper dang hoat dong
					$("#div_AutUser_List_08_02").remove(); // shipper vien dang xac thuc
					$("#div_AutUser_List_09_01").remove(); // seller dang hoat dong
					$("#div_AutUser_List_09_02").remove(); // seller vien dang xac thuc
					$("#div_AutUser_List_Filter").remove();
				}
				
				if(App.data.user.typ != pr_type_adm_all && App.data.user.typ != pr_type_adm) {
					$("#div_AutUser_List_02").remove(); // Quan tri vien
					$("#div_AutUser_List_10").remove(); // tai khoan bị xoa
					
				}
				
				var socId = App.data.user.manId;  
				if (socId==1) socId = null;
				
				$(pr_divContent).find(".data-list").each(function(i, e) {
					$(this).find(".div_AutUser_List_Content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.AUT_USER_LIST_CONTENT	, {}));
					var type 		= $(this).data("type");
					var typeMulti 	= $(this).data("typeMulti");
					var stat 		= $(this).data("stat");
					
					/*var pr_type_visitor      	= 1;
					var pr_type_adm      		= 2;
					var pr_type_emp      		= 3;
					var pr_type_client   		= 4;
					var pr_type_client_public 	= 5;
					var pr_type_mentor          = 6;
					var pr_type_shipper 		= 8;
					var pr_type_seller 			= 9;
					var pr_type_adm_all    		= 10;*/
					
					if(App.data.user.typ == pr_type_adm_all && !type){
						typeMulti	= "(" 	+ pr_type_visitor 		+ ","
											+ pr_type_adm 			+ ","
											+ pr_type_emp 			+ ","
											+ pr_type_client 		+ ","
											+ pr_type_client_public + ","
											+ pr_type_mentor		+ ","
											+ pr_type_shipper       + ","
											+ pr_type_seller        + ","
											+ pr_type_adm_all 		+ ")";
					}else	
					if(App.data.user.typ == pr_type_adm && !type){
						typeMulti	= "(" 	+ pr_type_visitor 		+ ","
											+ pr_type_adm 			+ ","
											+ pr_type_emp 			+ ","
											+ pr_type_client 		+ ","
											+ pr_type_client_public + ","
											+ pr_type_mentor        + ","
											+ pr_type_seller        + ","
											+ pr_type_shipper       + ")";
					}
					
					
					do_get_list_ByAjax_Dyn	(this, type, typeMulti, stat, socId);
				});
				
				if(App.data.user.manId == 1) do_load_view_filter();
				do_gl_enhance_within($(pr_divContent));

			}catch(e) {	
				console.log(e);
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "aut.user", "AutUserList", "do_lc_show", e.toString()) ;
			}
		};
		
		//---------private-----------------------------------------------------------------------------		
		this.do_lc_show_list_ById = function(obj){
			tmplCtrl.do_lc_put_tmpl(tmplName.AUT_USER_LIST_BY_ID			, Aut_User_List_By_Id); 
			tmplCtrl.do_lc_put_tmpl(tmplName.AUT_USER_LIST_BY_ID_HEADER	, Aut_User_List_By_Id_Header); 		
			tmplCtrl.do_lc_put_tmpl(tmplName.AUT_USER_LIST_BY_ID_CONTENT	, Aut_User_List_By_Id_Content); 
			
			$("#div_AutUser_List")         .html(tmplCtrl.req_lc_compile_tmpl(tmplName.AUT_USER_LIST_BY_ID		    , {}));
			$("#div_Aut_User_List_Header")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.AUT_USER_LIST_BY_ID_HEADER		, {}));
			$("#div_Aut_User_List_Content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.AUT_USER_LIST_BY_ID_CONTENT	, {}));
			
			var lstUsers = [];
			var user = {};
			user.login = obj.login;
			user.name  = obj.per.name01 + obj.per.name02 + obj.per.name03;	
			lstUsers.push(user);
			
			req_gl_create_datatable(lstUsers, "#table_aut_user",{});	
		}
		
		var do_load_view_filter = function(){
			tmplCtrl.do_lc_put_tmpl(tmplName.AUT_USER_LIST_FILTER_HEADER			, Aut_User_List_Filter_Header); 
			tmplCtrl.do_lc_put_tmpl(tmplName.AUT_USER_LIST_FILTER_CONTENT			, Aut_User_List_Filter_Content); 
			tmplCtrl.do_lc_put_tmpl(tmplName.AUT_USER_LIST_FILTER_BOX				, Aut_User_List_Filter_Box); 
			$("#div_AutUser_List_Filter_Header")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.AUT_USER_LIST_FILTER_HEADER	, {}));
			$("#div_AutUser_List_Filter_Box")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.AUT_USER_LIST_FILTER_BOX		, {}));
			do_wait_bind_event_filter()
		}
		
		var do_wait_bind_event_filter = function(){
//			if(App.data["LstSociete"] && App.data["LstSocieteChild"]){
			if(App.data["LstPartner"]){
				do_lc_bind_event_filter();
			}else{
				setTimeout(do_wait_bind_event_filter, 200);
			}
		}
							

		//---------private-----------------------------------------------------------------------------		
		function do_get_list_ByAjax(div, type, varname){	
			var ref 			= {};
			ref[svClass		] 	= "ServiceAutUser"; 
			ref[svName		]	= "SVLst";
			ref[userId]			= App.data.user.id;
			ref[sessId]			= App.data.session_id;
			ref["type"]			= type;

			var fSucces			= [];	
			fSucces.push(req_gl_funct(App	, App.funct.put		, [varname]));
			fSucces.push(req_gl_funct(null	, do_show_list		, []));
			fSucces.push(req_gl_funct(null	, do_bind_list_event, []));

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax")]);	
			
			App.network.ajax(App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError);
		}
		
		//--------------------------------------------------------------------------------------------
		function do_get_list_ByAjax_Dyn(div, type, typeMulti, stat, varname, socId){	
			var ref 				= {};
			ref[svClass] 			= "ServiceAutUser";
			ref[svName]				= "SVLstDyn";
			ref[userId]				= App.data.user.id;
			ref[sessId]				= App.data.session_id;
			ref["type"]				= type;
			ref["typeMulti"]		= typeMulti;
			
			if(stat)	ref["stat"]		= stat;
			
			if(socId)
				ref["socId"]	= socId;
			
			var lang = localStorage.language;
			if (lang ==null ) lang = "vn";	
			
			var filename = "www/js/lib/datatables/datatable_"+lang+".json";
			
			var additionalConfig	= {};
			
			var colConfig	= req_gl_table_col_config($(div).find("table"), null, additionalConfig);
			
			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax")]);	
			
			//call Datatable AJAX dynamic function from DatatableTool
			var oTable 		= req_gl_Datatable_Ajax_Dyn		(div, App.path.BASE_URL_API_PRIV,App.data["HttpSecuHeader"], filename, colConfig, ref, fError, undefined, ".table-datatable", undefined, do_bind_list_event);
		}
		
		//--------------------------------------------------------------------------------------------
		var do_show_list = function (sharedJson){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				var data 		= App.data[varname]; //sharedJson[App['const'].RES_DATA];

				$("#div_AutUser_List_Content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.AUT_USER_LIST_CONTENT	, data));	
			} else {
				//do something else
			}
		}

		//--------------------------------------------------------------------------------------------
		var do_bind_list_event = function(data, div, oTable) {
			
			$(div).find('.table-datatable tbody').on('click', 'tr', function(){
				//apply CSS style
				//check mod
				if(App.data.mode == App['const'].MODE_MOD || App.data.mode == App['const'].MODE_NEW) {
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_msg_sel'));
					return;
				}
				
				do_gl_Add_Class_List($(this).parent(), $(this), "selected");
				
				var oData = oTable.fnGetData(this);
				
				//ajax to fetch data from server
				pr_ctr_Ent. do_lc_show_ById(oData, App['const'].MODE_SEL);	
		
			});
		};
		
		//--------------------------------------------------------------------------------------------
		var do_lc_bind_event_filter = function(){
			do_gl_autocomplete({
				el: $("#AutUser_List_Societe_Name"),
				required: true,
//				source: App.data["LstSociete"].concat(App.data["LstSocieteChild"]),
				source: App.data["LstPartner"],
				selectCallback: function(item ) {
					$("#AutUser_List_Societe_Id")		.val(item.id);
					$("#AutUser_List_Societe_Name")		.val(item.name01);
				},
				renderAttrLst: ["name01"],
				minLength: 0,
			});

			$("#btn_aut_user_filter_submit").off("click");
			$("#btn_aut_user_filter_submit").on("click", function(){
				var filter = req_gl_data({
					dataZoneDom : $("#frm_filter_aut_user")
				});
				
				if(filter.hasError) {
					do_gl_show_Notify_Msg_Error ($.i18n('common_err_entity_save'));
					return false;
				}
				var socId = filter.data.id;
				
				if(socId == 1 ){
					var typMulti = "(" 	+ pr_type_visitor 		+ ","
										+ pr_type_adm 			+ ","
										+ pr_type_emp 			+ ","
										+ pr_type_client 		+ ","
										+ pr_type_client_public + ")"
										+ pr_type_adm_all 		+ ")";
				}else{
					var typMulti = "(" 	+ pr_type_visitor 		+ ","
										+ pr_type_adm 			+ ","
										+ pr_type_emp 			+ ","
										+ pr_type_client 		+ ","
										+ pr_type_client_public + ")";
				}
				
				$("#div_AutUser_List_Filter_Content")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.AUT_USER_LIST_FILTER_CONTENT	, {}));
				do_get_list_ByAjax_Dyn("#div_AutUser_List_Filter", null, typMulti, null, null, socId);
			});

			$("#btn_aut_user_filter_reset").off("click");
			$("#btn_aut_user_filter_reset").on("click", function(){
				$("#div_AutUser_List_Filter_Content")	.html("");
			});
			do_gl_init_show_box($("#div_AutUser_List_Filter"));
		}

		
		//--------------------------------------------------------------------------------------------
		
	
	};

	return AutUserList;
  });