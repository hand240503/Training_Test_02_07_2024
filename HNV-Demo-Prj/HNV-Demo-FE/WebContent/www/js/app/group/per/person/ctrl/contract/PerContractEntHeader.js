define([
        'jquery',
        'text!template/per/contract/PerContract_Ent_Header.html'
        ],

        function($, 
        		PerContract_Ent_Header) {

	var PerContractEntHeader     = function (header,content,footer, grpName) {
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

		var svClass         			= App['const'].SV_CLASS;
		var svName          			= App['const'].SV_NAME;
		var userId          			= App['const'].USER_ID;
		var sessId          			= App['const'].SESS_ID;
		var fVar            			= App['const'].FUNCT_SCOPE;
		var fName           			= App['const'].FUNCT_NAME;
		var fParam          			= App['const'].FUNCT_PARAM;

		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;
		
		var pr_OrdType 				= 2;
	
		//-----------------------------------------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		
		var pr_SERVICE_PER_CLASS	= "ServicePersonDyn"; //to change by your need
		var pr_SV_PER_SEARCH		= "SVPerLstSearch";
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.PerContract.Main;
			pr_ctr_List 			= App.controller.PerContract.List;
			
			pr_ctr_Ent				= App.controller.PerContract.Ent;
			pr_ctr_EntHeader 		= App.controller.PerContract.EntHeader;
			pr_ctr_EntBtn 			= App.controller.PerContract.EntBtn;
			pr_ctr_EntTabs 			= App.controller.PerContract.EntTabs;
			
		}      
		
		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;
			
			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_ENT_HEADER	, PerContract_Ent_Header); 			
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_ENT_HEADER, obj));
				
				$("#sel_per_contract_unitId").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_SELECT_UNIT));
				$("#sel_per_contract_unitId").val(obj.unitId);
				
				do_bind_event(obj, mode);
			}catch(e) {				
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.contract", "PerContractEntHeader", "do_lc_show", e.toString()) ;
			}
		};
		
		var doGetPersonInfo = function (item){
			if(item == undefined)
				return;
			var ref 		= req_gl_Request_Content_Send('SVPersonGet', 'ServicePerPerson');
			ref["id"]		= item.id;			
			ref["forced"]	= true;
			
			var fSucces		= [];
			fSucces.push(req_gl_funct(null, do_get_tp_info_response,[]));	
			
			var fError 		= req_gl_funct(App, self.do_show_Msg, [$.i18n("common_err_ajax")]);	
			
			App.network.do_lc_ajax (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
			
		}
		var do_get_tp_info_response = function(sharedJson) {
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				var data = sharedJson.res_data;
				do_lc_remplir_addr(data, pr_OrdType);
			}
		}
	
		this.do_lc_save		= function(obj, mode){
			if(!obj.files)	obj.files = [];
			return req_gl_data({
				dataZoneDom 	: $(pr_divContent),
				oldObject 		: {"files": obj.files},
				removeDeleted	: true	
			});
		}
			
		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			do_gl_input_autocomplete_dyn("#inp_per_contract_pers01", {
				dataRes : ["name01", "name02"], dataReq : {"typ02" : 1010010,"nbLine" : 20}, dataService : [pr_SERVICE_PER_CLASS, pr_SV_PER_SEARCH], dataSel : {"#pers01": "id", "#order_suplId": "id"},
				succesCallback: doGetPersonInfo
			});
			
			do_gl_input_autocomplete_dyn("#inp_per_contract_pers02", {
				dataRes : ["name01", "name02"], dataReq : {"typ02" : 1010002,"nbLine" : 20}, dataService : [pr_SERVICE_PER_CLASS, pr_SV_PER_SEARCH], dataSel : {"#pers02": "id", "#order_cliId": "id"},
				succesCallback: doGetPersonInfo
			});
			
			do_gl_input_autocomplete_dyn("#inp_per_contract_parent", {
				dataRes : ["code", "title"]	, dataReq : {"nbLine" : 20}, dataService : ["ServicePerContract", "SVPerContractSearch" ], dataSel : {"#parent": "id"},
			});
			
			var rightSocMa = pr_ctr_Main.do_verify_user_right_soc_manage();
			if(!rightSocMa)
				$("#div_per_contract_societe").hide();
			else{
				var LstAllSociete = App.data["LstSociete"].concat(App.data["LstSocieteChild"]);
				for(var i=0; i<LstAllSociete.length; i++){
					if(LstAllSociete[i].id == obj.manId){
						$("#inp_per_contract_societe")	.val(LstAllSociete[i].name01);
						break;
					}
				}
				do_gl_autocomplete({
					el: $("#inp_per_contract_societe"),
					required: true,
					source: App.data["LstSociete"].concat(App.data["LstSocieteChild"]),
					selectCallback: function(item ) {
						$("#socId")						.val(item.id);
						$("#inp_per_contract_societe")	.val(item.name01);
					},
					renderAttrLst: ["name01"],
					minLength: 0,
				});
			}
		}
		
		var do_lc_remplir_addr = function(data, contractTyp){
			var pr_const_01 = "";
			var pr_const_02 = "";
			if(contractTyp == 2){//App['const'].SOR_ORDER_OUT_TYPE
				pr_const_01 = 1010010;
				pr_const_02 = 1010002;
			} else if(contractTyp == 1){//App['const'].SOR_ORDER_IN_TYPE
				pr_const_01 = 1010003;
				pr_const_02 = 1010010;
			}
			
			if(data.typ02 == pr_const_01){
				if(data['tpyInfos']!= undefined){
					var  info = data['tpyInfos'];				
					for(key in info){
						if(info[key].typ01 == 1){
							if(info[key].typ02 == 230005){
								var addr = {};
								addr['li01'] 	= info[key].info01;
								addr['li02'] 	= info[key].info02;							
								addr['li04'] 	= info[key].info03;
								addr['li05'] 	= info[key].info04;
								addr['country'] = info[key].cfgVal01;
								addr['typ']	 	= 1;
								addr['title']	= "per_contract_tab_general_address_delivery";
								
								do_build_select_addr(1, addr);
							}
						} else if(info[key].typ01 == 2){
							var addr = info[key];
							addr['typ']=4;
							$("#div_per_contract_tab_general_Bank").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_ENT_TAB_INFO_BANK, addr));
						}
					}
				}
			}
			if(data.typ02 == pr_const_02){
				if(data['tpyInfos']!= undefined){
					var  info = data['tpyInfos'];				
					for(key in info){
						if(info[key].typ01 == 1){
							var addr = {};
							addr['li01'] 	= info[key].info01;
							addr['li02'] 	= info[key].info02;							
							addr['li04'] 	= info[key].info03;
							addr['li05'] 	= info[key].info04;
							addr['country'] = info[key].cfgVal01;
							if(info[key].typ02 == 230005){
								addr['typ']=2;
								addr.title = "per_contract_tab_general_address_invoice";
								do_build_select_addr(2, addr);
							} else if(info[key].typ02 == 230009){
								addr['typ']=3;
								addr['title'] = "per_contract_tab_general_address_correspondence";
								do_build_select_addr(3, addr);
							}
						}
					}
				}
			}	
		}
		
		var do_build_select_addr = function(type, addr){
			$("#per_contract_addr_0"+type)			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_ADDR_CONTENT, addr));
			$("#sel_per_addr_"+type+"_country")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_SELECT_COUNTRY));
			do_gl_select_value($("#sel_per_addr_"+type+"_country"), addr.country);
		}

	};


	return PerContractEntHeader;
});