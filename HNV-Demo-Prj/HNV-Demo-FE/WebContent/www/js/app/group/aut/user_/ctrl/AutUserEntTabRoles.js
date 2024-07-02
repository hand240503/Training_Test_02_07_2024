define([
	'jquery',
	'text!group/aut/user/tmpl/Aut_User_Ent_Tab_Roles.html'      

	],
	function($,
			AutUser_Ent_Tab_Roles    		
	) {


	var AutUserEntTab01     = function (header,content,footer, grpName) {
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
		//------------------------------------------------------------------------------------

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
		
		var RIGHT_AUT_ROLE_G		=	10201;
		var RIGHT_AUT_ROLE_N		=	10202;
		var RIGHT_AUT_ROLE_M		=	10203;
		var RIGHT_AUT_ROLE_D		=	10204;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.AutUser.Main;
			pr_ctr_List 			= App.controller.AutUser.List;

			pr_ctr_Ent				= App.controller.AutUser.Ent;
			pr_ctr_EntHeader 		= App.controller.AutUser.EntHeader;
			pr_ctr_EntBtn 			= App.controller.AutUser.EntBtn;
			pr_ctr_EntTabs 			= App.controller.AutUser.EntTabs;

		}

		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;
			try {
				var arr_auth =[
					{"id" : -0 , "rId" : 101 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_aut_user")},
					{"id" : -1 , "rId" : 102 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_aut_author")},

					{"id" : -2 , "rId" : 201 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_per_client")},
					{"id" : -27, "rId" : 205 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_per_company")},
					{"id" : -3 , "rId" : 202 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_per_supl")},
					{"id" : -4 , "rId" : 203 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_per_prod")},
					{"id" : -5 , "rId" : 204 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_per_tpart")},
					{"id" : -6 , "rId" : 205 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_per_other")      , "class" : "d-none"},
					{"id" : -7 , "rId" : 206 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_per_company")    , "class" : "d-none"},
					{"id" : -8 , "rId" : 207 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_per_branch")     , "class" : "d-none"},
					{"id" : -9 , "rId" : 208 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_per_department") , "class" : "d-none"},
					
					{"id" : -10 , "rId" : 301 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_mat_material_simple")},
					{"id" : -11 , "rId" : 302 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_mat_material_complex")},
					{"id" : -12 , "rId" : 310 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_mat_material_unit")},
					{"id" : -13 , "rId" : 320 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_mat_material_price")},
					{"id" : -14 , "rId" : 330 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_mat_material_warehouse")},
					{"id" : -15 , "rId" : 340 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_mat_material_stock")},
					{"id" : -16 , "rId" : 350 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_mat_material_alarm")},
					
					{"id" : -17 , "rId" : 4101 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_sor_order_in_stk_buy")},
					{"id" : -18 , "rId" : 4102 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_sor_order_in_stk_shop")},
					{"id" : -19 , "rId" : 4103 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_sor_order_in_stk_bal")},
					{"id" : -20 , "rId" : 4104 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_sor_order_in_stk_other")}, //quản lý nhập kho khác
					
					{"id" : -21 , "rId" : 4201 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_sor_order_out_stk_sell")},
					{"id" : -22 , "rId" : 4202 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_sor_order_out_stk_shop")},
					{"id" : -23 , "rId" : 4203 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_sor_order_out_stk_bal")},
					{"id" : -24 , "rId" : 4204 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_sor_order_out_stk_other")}, //quản lý xuất kho khác
					{"id" : -24 , "rId" : 4250 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_sor_order_deal")}, 
					
					
					{"id" : -25 , "rId" : 4110 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_sor_order_in_info")}, //báo giá nhập
					{"id" : -26 , "rId" : 4210 , "r1":0, "r2":0, "r3":0, "r4":0, "r5":0, "title" : $.i18n("role_sor_order_ou_info")}, //báo giá xuất
					
				]
				arr_auth = req_update_data(arr_auth,obj)
				tmplCtrl.do_lc_put_tmpl(tmplName.AUT_USER_ENT_TAB_ROLES, AutUser_Ent_Tab_Roles); 			
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.AUT_USER_ENT_TAB_ROLES, arr_auth));
				
//				$("#sel_autuser_header_legalstat").html(tmplCtrl.req_lc_compile_tmpl(tmplName.AUT_USER_LEGAL_STAT));
//				do_bind_event (obj, mode);
				do_bind_check_all(arr_auth);
				
				var roleN = pr_ctr_Rights.req_lc_Roles(RIGHT_AUT_ROLE_N);
				var roleM = pr_ctr_Rights.req_lc_Roles(RIGHT_AUT_ROLE_M);
				var roleG = pr_ctr_Rights.req_lc_Roles(RIGHT_AUT_ROLE_G);
				
				if(mode == App['const'].MODE_NEW || mode == App['const'].MODE_MOD) {
					
					if(roleN == -1 && roleM == -1){
						do_gl_disable_edit($(pr_divContent));
					} else {
						do_gl_enable_edit($(pr_divContent));
					}
					
					if(roleG == -1) $(pr_divContent).hide();
					
				} else {
					if(roleG == -1){
						$(pr_divContent).hide();
					}else{
						do_gl_disable_edit($(pr_divContent));
					}
				}
				
			}catch(e) {				
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "aut.user", "AutUserEntTab01", "do_lc_show", e.toString()) ;
			}
		};


		//---------private-----------------------------------------------------------------------------
		var do_bind_check_all = function (obj) {
			if(obj && obj.length>0){
				obj.forEach((e) => {
					$("." + e.rId + "_rAll").change(() => {
						if ($("." + e.rId + "_rAll").is(':checked')) {
							$("."+ e.rId +"_r1").prop('checked', true);
							$("."+ e.rId +"_r2").prop('checked', true);
							$("."+ e.rId +"_r3").prop('checked', true);
							$("."+ e.rId +"_r4").prop('checked', true);
							$("."+ e.rId +"_r5").prop('checked', true);
						} else {
							$("."+ e.rId +"_r1").prop('checked', false);
							$("."+ e.rId +"_r2").prop('checked', false);
							$("."+ e.rId +"_r3").prop('checked', false);
							$("."+ e.rId +"_r4").prop('checked', false);
							$("."+ e.rId +"_r5").prop('checked', false);
						}
					});
				})
			}
		}

		var do_bind_event = function (obj, mode){
			if(obj.roles && obj.roles.length>0){
				let roles = obj.roles;
				for(var i = 0 ;i<roles.length;i++){
					if(roles[i].r1 == 1){
						$("."+roles[i].rId+"_r1").prop('checked', true);
					}
					if(roles[i].r2 == 1){
						$("."+roles[i].rId+"_r2").prop('checked', true);
					}
					if(roles[i].r3 == 1){
						$("."+roles[i].rId+"_r3").prop('checked', true);
					}
					if(roles[i].r4 == 1){
						$("."+roles[i].rId+"_r4").prop('checked', true);
					}
					if(roles[i].r5 == 1){
						$("."+roles[i].rId+"_r5").prop('checked', true);
					}
				}
			}
		}
		
		var req_update_data = function (arr,obj){
			if(obj.roles && obj.roles.length>0){
				let roles = obj.roles;
				for(var i = 0 ;i<roles.length;i++){
					for(var j = 0 ;j< arr.length;j++){
						if(roles[i].rId == arr[j].rId){
							arr[j].id = roles[i].id;
							arr[j].r1 = roles[i].r1;
							arr[j].r2 = roles[i].r2;
							arr[j].r3 = roles[i].r3;
							arr[j].r4 = roles[i].r4;
							arr[j].r5 = roles[i].r5;
						}
					}
					
				}
			}
			return arr;
		}

	};


	return AutUserEntTab01;
});