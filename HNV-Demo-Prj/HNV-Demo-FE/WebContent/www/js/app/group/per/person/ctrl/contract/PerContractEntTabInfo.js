define([
	'jquery',
	'text!template/per/contract/PerContract_Ent_Tab_Info.html',      
	'text!template/per/contract/PerContract_Ent_Tab_Info_Bank.html',
	'text!template/per/contract/PerContract_Address_Content.html'
	],
	function($,
			PerContract_Ent_Tab_Info,
			PerContract_Ent_Tab_Info_Bank,
			PerContract_Address_Content
	) {


	var PerContractEntTabInfo     = function (header,content,footer, grpName) {
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

		var pr_default_new_line	= {
				DT_RowClass: "",
				id 		: null,
				mat		: null,
				code	: null,
				name	: null,
				unit	: null,
				unitlab	: null,
				quant	: null,
				dt01	: null,
				dt00	: null,
				stat	: null,
				val01	: null,
				val00	: null,
				mode	: 1
		};

		var pr_tableNewLineId 	= 0;
		var pr_table			= undefined;
		var pr_news_line_data	= undefined;

		var defautNumberFormat 	= "#,###.##";

		var pr_SERVICE_CLASS	= "ServiceMatStockIo";
		var pr_SV_MAT_SEARCH	= "SVMatStockIoMatSearch";
		//var pr_SV_REQ_DETAIL	= "SVMatStockIoOrderReqDetail";

		//--------------------Cache-------------------------------------
		var pr_cache_material_by_search_key = {};
		var pr_cache_unit_by_mat_id = {};


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

		var invInvoiceType = 1;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.PerContract.Main;
			pr_ctr_List 			= App.controller.PerContract.List;

			pr_ctr_Ent				= App.controller.PerContract.Ent;
			pr_ctr_EntHeader 		= App.controller.PerContract.EntHeader;
			pr_ctr_EntBtn 			= App.controller.PerContract.EntBtn;
			pr_ctr_EntTabs 			= App.controller.PerContract.EntTabs;

			tmplName.PER_CONTRACT_ADDR_CONTENT		= "PerContract_Addr_Content";
			tmplName.PER_CONTRACT_ENT_TAB_INFO_BANK	= "PerContract_Ent_Tab_Info_Bank";

		}

		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;

			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_ENT_TAB_INFO, PerContract_Ent_Tab_Info); 			
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_ENT_TAB_INFO, obj));


				tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_ADDR_CONTENT, PerContract_Address_Content);
				tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_ENT_TAB_INFO_BANK, PerContract_Ent_Tab_Info_Bank);				

				$("#sel_per_contract_currency")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_CURRENCY));			
				$("#sel_per_contract_payement_mode")	.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_PAYMENT_METHOD));
				$("#sel_per_contract_payement_deadline").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_DEADLINE));				
				$("#sel_per_contract_tax_system")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_SELECT_TAX_SYSTEM));			

				loadView_PerContract_Tab_Info(obj, this.invInvoiceType);				

				do_bind_event (obj, mode);
			}catch(e) {
				console.log(e);
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.contract", "PerContractEntTabInfo", "do_lc_show", e.toString()) ;
			}
		};
		
		var do_lc_get_addr = function(addr, typ, title){
			var addrCus 	= {};
			addrCus.typ 	= typ;
			
			var objectConstructor = {}.constructor;
			if(addr != undefined && addr != ""){
				if (addr.constructor !== objectConstructor) {
					try{
						addr = JSON.parse(addr);
						addrCus = $.extend(true,{}, addrCus, addr);
						if(title)	addrCus.title 	= title;
						return addrCus;
					}catch(e){
						console.log(e);
						do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.contract", "PerContractEntTabInfo", "do_lc_get_addr", e.toString()) ;
					}
			    } else {
			    	return addr;
			    }
			
			}else{
				if(title)	addrCus.title 	= title;
				return addrCus;
			}
		}


		//---------private-----------------------------------------------------------------------------
		var loadView_PerContract_Tab_Info = function(data){
			if(!data.order)	data.order = {};
			data.order.addr01 = do_lc_get_addr(data.order.addr01, 1, "per_contract_tab_general_address_delivery");
			data.order.addr02 = do_lc_get_addr(data.order.addr02, 2, "per_contract_tab_general_address_invoice");
			data.order.addr03 = do_lc_get_addr(data.order.addr03, 3, "per_contract_tab_general_address_correspondence");
			data.order.addr04 = do_lc_get_addr(data.order.addr04, 4);

			$("#per_contract_addr_01")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_ADDR_CONTENT,data.order.addr01));
			$("#sel_per_addr_1_country")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_SELECT_COUNTRY));
			do_gl_select_value($("#sel_per_addr_1_country"), data.order.addr01.country);

			$("#per_contract_addr_02")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_ADDR_CONTENT,data.order.addr02));
			$("#sel_per_addr_2_country")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_SELECT_COUNTRY));
			do_gl_select_value($("#sel_per_addr_2_country"), data.order.addr02.country);

			$("#per_contract_addr_03")			.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_ADDR_CONTENT,data.order.addr03));
			$("#sel_per_addr_3_country")		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_SELECT_COUNTRY));
			do_gl_select_value($("#sel_per_addr_3_country"), data.order.addr03.country);
			
			$("#div_per_contract_tab_general_Bank").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_ENT_TAB_INFO_BANK, data.order.addr04));

//			//add bank template
//			if(data.order.infos != undefined && data.order.infos.length > 0 ){
//				var find = false;
//				for(key in data.order.infos){
//					if(data.order.infos[key].typ01 != undefined && data.order.infos[key].typ01 == 2){
//						data.order.infos[key].index = key;
//						$("#div_per_contract_tab_general_Bank").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_ENT_TAB_INFO_BANK, data.order.infos[key]));	
//						find = true;
//					}
//				}
//				if(find == false){
//					var length = data.order.infos.length;oBank
//					var oBank = {typ01:'2',typ02:'200000',index: length};
//					data.order.infos.push(oBank);
//					$("#div_per_contract_tab_general_Bank").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_ENT_TAB_INFO_BANK, oBank));
//				}
//
//			}else{
//				data.order.infos = [];
//				var oBank = {typ01:'2',typ02:'200000',index: '0'};
//				data.order.infos.push(oBank);
//				$("#div_per_contract_tab_general_Bank").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_ENT_TAB_INFO_BANK, data.order.infos[0]));
//			}

			//select currency
			if(data.order.currency != undefined){
				do_gl_select_value($("#sel_per_contract_currency"), data.order.currency);
			}

			// select payment method
			if(data.order.payTyp != undefined){
				do_gl_select_value($("#sel_per_contract_payement_mode"), data.order.payTyp);
			}

			//select payment deadline
			if(data.order.payDeadline != undefined){
				do_gl_select_value($("#sel_per_contract_payement_deadline"), data.order.payDeadline);
			}				
			//select tax
			if(data.order.tax != undefined){
				do_gl_select_value($("#sel_per_contract_tax_system"), data.order.tax);
			}
		}


		var do_bind_event = function (obj, mode){
			
		}.bind(this);
	};


	return PerContractEntTabInfo;
});