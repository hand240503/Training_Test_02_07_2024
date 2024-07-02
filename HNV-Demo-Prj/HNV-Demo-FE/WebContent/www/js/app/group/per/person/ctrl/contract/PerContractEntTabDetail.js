define([
        'jquery',
        'text!template/per/contract/PerContract_Ent_Tab_Detail.html'      
        ],
        function($,
        		PerContract_Ent_Tab_Detail    		
        		) {

	var PerContractEntTabDetail     = function (header,content,footer, grpName) {
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
		
		var defautNumberFormat		= "#,###.##";
		
		var defautNumberFormat0		= "#,##0.##";
		
		var defautNumberFormat1		= "#,##0.0#";
		var defautNumberFormat2		= "#,##0.00";
		
		var defautNumberFormat3		= "#,###.###";
		var defautNumberFormat4		= "#,##0.###";
		var defautNumberFormat5		= "#,###.000";
		var defautNumberFormat6		= "#,##0.000";
		
		var defautNumberFormat7		= "#,##0.####";
		var defautNumberFormat11	= "#,##0.0000";
		//------------------------------------------------------------------------------------
		
		var invInvoiceType = 1;
	
		var pr_default_new_line	= {
				DT_RowClass: "",
				id 		: null,
				parId		: null,
				code	: null,
				name	: null,
				quan	: null,
				unitId	: null,
				unitlab	: null,				
				stat	: 1,
				val01	: null,
				val02	: null,
				val03	: null,
				val04	: null,
				val05	: null,
				val06	: null,
				val07	: null,				
				val08	: null,
				val09	: null,
				mode	: 4,
				dbFlag:0,
		};
		
		var pr_tableNewLineId 	= 0;
		var pr_table			= undefined;
		var pr_news_line_data	= undefined;
		
		var defautNumberFormat 	= "#,###.##";
		
		
		var pr_SERVICE_CLASS	= "ServiceMatMaterialDetail";
		var pr_SV_MAT_SEARCH	= "SVMatMaterialSearch";
		var pr_SV_REQ_DETAIL	= "SVMatStockIoReqDetail";
		
		
		//--------------------Cache-------------------------------------
		var pr_cache_material_by_search_key = {};
		var pr_cache_unit_by_mat_id 		= {};
		var pr_cache_price_sell_by_mat 		= {};
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
				tmplCtrl.do_lc_put_tmpl(tmplName.PER_CONTRACT_ENT_TAB_DETAIL, PerContract_Ent_Tab_Detail); 			
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_CONTRACT_ENT_TAB_DETAIL, obj));
				
				do_bind_event (obj, mode);
			}catch(e) {
				console.log(e);
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "per.contract", "PerContractEntTabDetail", "do_lc_show", e.toString()) ;
			}
		};


		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			pr_mode = mode;
			if(mode == App['const'].MODE_NEW) {
				obj.order.detail = [];
				do_init_detail_table(obj);
			} else {
				if(!obj.order)	obj.order = {};
				obj.order.detail = [];
				$.each(obj.order.details, function(i, e) {
					e = $.extend(true, {}, pr_default_new_line, e);
					obj.order.detail.push(e);
				})			

				do_init_detail_table(obj);
			}
		}.bind(this);
 
		var formatDoubleV2 = function(val){
			return Number(val).toFixed(2);
		}
		var do_calculate_on_deail_table = function (oData,p_this){

			var line 			= $(p_this).parent();
			var quantity 		= req_gl_double_value(line.find(".quan").html());
			var price 			= req_gl_double_value(line.find(".val01").html());					
			var taxp 			= req_gl_double_value(line.find(".val03").html());
			var priceWithTax 	= price * (1+ taxp/100);

			//--calculate discount with no tax and discount percentage
			var discpp 			= req_gl_double_value(line.find(".val04").html());				
			var disc 			= req_gl_double_value(line.find(".val05").html());	
			var totalHT 		= price * quantity;
			if (discpp!= 0){					
				disc  			= totalHT * discpp /100;					
			}else if (disc!= 0 &&  totalHT!= 0){					
				discpp 			= disc/totalHT*100;
			}

			var totalNet 		= totalHT - disc;	
			var tax 			= totalNet * taxp / 100;
			var totalFinal 		= totalNet + tax;				

			//-for display-----------------------------------------------------
			do_set_number_double(line, "val01", formatDoubleV2(price));
			do_set_number_double(line, "val03", formatDoubleV2(taxp));				
			do_set_number_double(line, "val04", formatDoubleV2(dispp));
			do_set_number_double(line, "val05", formatDoubleV2(discount));
			do_set_number_double(line, "val07", formatDoubleV2(totalNet));
			do_set_number_double(line, "val08", formatDoubleV2(tax));					
			do_set_number_double(line, "val09", formatDoubleV2(totalFinal));

			//---------------------------------------------------------
			oData.quan 	= quantity;
			oData.val01 = price;
			oData.val02 = priceWithTax;
			oData.val03 = taxp;
			oData.val04 = dispp;
			oData.val05 = discount;

			oData.val06 = 0;		//chua dung

			oData.val07 = totalNet;
			oData.val08 = tax;
			oData.val09 = totalFinal;
		}
		
		var do_set_number_double = function(pr_line, name, number){
			var pattern = pr_line.parent().parent().find("th[data-name="+name+"]").data("pattern");
			if(pattern){
				if(number != ""){
					if(pattern == "number"){
						number = number.toString().split( /(?=(?:\d{3})+(?:\.|$))/g ).join( " " );
					} else {
						var patt = pattern.split(",");
						var a = patt[0];
						var b = patt[1];
						number = number.toString().replace(new RegExp(a,"g"), b);
					}
				}
			}
			pr_line.find("."+name).html(number);
		}
		
		var do_set_number_float = function(number){
			if(typeof(number) == "string"){
				number = number.split(" ").join("");
			}
			
			return parseFloat(number);
		}
	
		var do_init_detail_table = function(obj) {
			var additionalConfig = {
					"code": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							do_gl_autocomplete({
								el: $(nTd),
								required: true,
								source: function(request, response) {
									do_search_article(request, response);
								},
								selectCallback: function(item ) {
									do_lc_verify_mat(item, nTd, oData, {dataTab: {"parId" : "id"}});
									return false;
								},
								renderAttrLst: ["code01", "name01"],
								minLength:0,
								autoSearch: true
							});
						}
					},
					"unitlab": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							var line = $(nTd).parent();
							line.attr("data-gIndex",iRow);
							var options = {dataTab: {"unitId": "id", "unitlab": "label"}};
							do_gl_autocomplete({
								el: $(nTd),
								required: true,
								source: function(request, response) {
									do_search_mat_unit(oData, request, response);
								},
								selectCallback: function(item ) {
									do_lc_verify_unit(item, nTd, oData, options);
								},
								renderAttrLst: ["label"],
								minLength: 0
							});

							$(nTd).on("focus", function() {
								console.log("focus");
								$(this).autocomplete("search", $(this).html());
							});
						}
					},
					"val01": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							do_gl_autocomplete({
								el: $(nTd),
								required: true,
								source: function(request, response) {
									if(oData.unitId == null || oData.unitId == ""){
										return false;
									}
									do_search_price_sell(oData.unitId, request, response);
								},
								selectCallback: function(item) {
									oData.val01 = item.price01;
									do_calculate_on_deail_table(oData, nTd);
									return false;
								},
								renderAttrLst: ["label"],
								displayAttrLst: ["price01"],
								minLength: 0
							});

							$(nTd).on("input", function() {
								do_calculate_on_deail_table(oData,this);
							})
						}
					},
					"quan": {
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							$(nTd).on("input", function() {
								do_calculate_on_deail_table(oData,this);
							})
						}
					},
					"val03": {					
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							$(nTd).on("input", function() {
								do_calculate_on_deail_table(oData,this);
							})
						}
					},
					"val04": {					
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							var line = $(nTd).parent();
							line.attr("data-gIndex",iRow);					
							$(nTd).on("input", function() {
								var val04 = line.find(".val04").html();
								var val01 = line.find(".val01").html();
								var quan = line.find(".quan").html();
								if(val04 == "" || do_set_number_float(val04) >= 100){
									oData.val04= 0;
									oData.val04= 0;
									line.find(".val04, .val05").html("");
								}else{
									do_set_number_double(line, "val05", formatDoubleV2(do_set_number_float(val01) * do_set_number_float(quan) * do_set_number_float(val04) / 100));
									do_calculate_on_deail_table(oData,this);
								}
							})
						}
					}			,
					"val05": {					
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							var line = $(nTd).parent();
							line.attr("data-gIndex",iRow);					
							$(nTd).on("input", function() {
								var val05 = line.find(".val05").html();
								var val07 = line.find(".val07").html();
								if(val05 == "" || do_set_number_float(val05) >= do_set_number_float(val07)){
									oData.val05= 0;
									oData.val04= 0;
									line.find(".val04, .val05").html("");
								}else
									do_calculate_on_deail_table(oData,this);
							})
						}
					},
					"val07": {					
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							var line = $(nTd).parent();
							line.attr("data-gIndex",iRow);	
							$(nTd).on("input", function() {
								var val07 	= line.find(".val07").html();
								
								if(val07 != "" && val07 != null){
									var quant = line.find(".quan").html();
									var taxp 	= line.find(".val03").html();
									var tax = 0;
									if(quant != "" && quant != null){
										do_set_number_double(line, "val01", formatDoubleV2(do_set_number_float(val07)/do_set_number_float(quant)));
									}
									
									if(taxp != ""){
										tax  = do_set_number_float(val07) * do_set_number_float(taxp) /100;
										do_set_number_double(line, "val08", formatDoubleV2(tax));
									}
									
									var discount = line.find(".val05").html();
									if(discount == "" || discount == ".00" || discount == ",00" || discount == null){
										discount = 0;
									} else {
										do_set_number_double(line, "val04", formatDoubleV2(do_set_number_float(discount)*100/do_set_number_float(val07)));
									}
									
									do_set_number_double(line, "val09", formatDoubleV2(do_set_number_float(val07) + tax - do_set_number_float(discount)));
								}
							})
						}
					},
					"val09": {					
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							var line = $(nTd).parent();
							line.attr("data-gIndex",iRow);	
							$(nTd).on("input", function() {
								var val09 	= line.find(".val09").html();
								if(val09 != "" && val09 != null){
									var taxp 	= line.find(".val03").html();
									var discount = line.find(".val05").html();
									
									if(discount == "" || discount == ".00" || discount == ",00" || discount == null){
										discount = 0;
									}
									var tax = 0;
									if(taxp != ""){
										tax  = (do_set_number_float(val09) + do_set_number_float(discount))/(1 + 100/do_set_number_float(taxp));
									} else {
										tax = 0;
									}
									do_set_number_double(line, "val08", formatDoubleV2(tax));
									do_set_number_double(line, "val07", formatDoubleV2(do_set_number_float(val09) - tax + do_set_number_float(discount)));
									
									var quant = line.find(".quan").html();
									var val07 = line.find(".val07").html();
									if(quant != "" && quant != null){
										do_set_number_double(line, "val01", formatDoubleV2(do_set_number_float(val07)/do_set_number_float(quant)));
									}
								}
							})
						}
					},
					"val08": {					
						fnCreatedCell: function(nTd, sData, oData,iRow, iCol) {
							$(nTd).on("input", function() {
								do_calculate_on_deail_table(oData,this);
							})
						}
					}
			}
			
			req_gl_create_datatable(obj.order, "#table_per_contract_tab01_detail", additionalConfig, pr_default_new_line, function(){
				if(pr_mode == App['const'].MODE_MOD || pr_mode == App['const'].MODE_NEW) {
						do_gl_enable_edit($(pr_divContent));
					}
			});
		}.bind(this);
	
		var do_search_article = function(request, response) {
			var ref 		= req_gl_Request_Content_Send(pr_SERVICE_CLASS, pr_SV_MAT_SEARCH);	
			ref.searchkey	= request.term;

			var fSucces			= [];

			fSucces.push(req_gl_funct(null, do_search_article_response, [response]));

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;	
		}

		var do_search_article_response = function(sharedJson, response) {
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				var data = sharedJson[App['const'].RES_DATA];
				
				$.each(data, function(i, o){
					o.label = o.code04 +" "+ o.name01
				})
				
				response(data);
			}
		}

		var do_search_mat_unit = function(oData, request, response) {
			var lstUnit = pr_cache_unit_by_mat_id[oData.parId];
			
			if(request != undefined){
				response($.ui.autocomplete.filter(lstUnit, request.term));
			}else{
				response( $.ui.autocomplete.filter(lstUnit));
			}
		}

		var do_req_mat_unit = function(options, do_show_result) {
			var ref 		= req_gl_Request_Content_Send("SVMatUnitLstByMat", "ServiceMatUnit");	
			ref.matId		= options.item.id;

			var fSucces		= [];

			fSucces.push(req_gl_funct(null, do_req_mat_unit_response, [options, do_show_result]));

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_req_mat_unit_response = function(sharedJson, options, do_show_result) {
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				var data 		= sharedJson[App['const'].RES_DATA];
				var parId 		= options.item.id;
				var baseUnit 	= undefined;
				data.some(function(e, i) {
					if(e.typ02 == 1) {
						e.label	= e.name;
						e.displ = e.label;
						baseUnit = e;
						return true;
					}
				});
				$.each(data, function(i, e) {
					if(e.typ02 == 2) {
						e.label = e.name + " " + e.ratio + " " + baseUnit.name;
					}
				});

				pr_cache_unit_by_mat_id[parId] = data;
				do_show_result(options);
			}
		}

		var do_req_mat_price_sell = function(item){
			var ref 		= req_gl_Request_Content_Send("SVSearchPriceSell", "ServiceSorOrder");	
			ref.matId		= item.matId;
			ref.unitId		= item.id;

			var fSucces			= [];

			fSucces.push(req_gl_funct(null, do_req_price_sell_response, [item.id]));

			var fError 		= req_gl_funct(App, do_gl_show_Notify_Msg, [$.i18n("common_err_ajax")]);	

			App.network.do_lc_ajax_background (App.path.BASE_URL_API_PRIV, App.data["HttpSecuHeader"], ref, 100000, fSucces, fError) ;
		}

		var do_req_price_sell_response = function(sharedJson, uId){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {	
				var data = sharedJson[App['const'].RES_DATA];
				pr_cache_price_sell_by_mat[uId] = data;
			}
		}

		var do_search_price_sell = function(uId, request, response){
			var lstPrice = pr_cache_price_sell_by_mat[uId];
			$.each(lstPrice, function(i, o){
				o.label = o.price01;
			}) 
			response( $.ui.autocomplete.filter( lstPrice, request.term ));
		}
		
		var do_lc_verify_mat = function(item, nTd, oData, datas){
			var options 	= {};
			options.item 	= item;
			options.nTd 	= nTd;
			options.oData 	= oData;
			options.datas 	= datas;
			
			do_req_mat_unit(options, do_show_result);
		}
		
		var do_show_result = function(options){
			var item	= options.item;
			var nTd		= options.nTd;
			var oData	= options.oData;
			var dataTab = options.datas.dataTab;
			
			var line = $(nTd).parent();
			if(pr_cache_unit_by_mat_id[item.id] && pr_cache_unit_by_mat_id[item.id].length >0){
				var lstTax = App.data.cfg[11];
				var tax = null;
				for(var i = 0; i<lstTax.length;i++){
					if(lstTax[i].id==item.typ03){
						tax = lstTax[i].val02 * 100;
						break
					}
				}
				$(nTd)	.html( item.code01);
				line	.find(".name").html(item.name01);
				line	.find(".val03").html(tax);
				line	.find(".parId").html(item.id);
				line	.find(".unitlab").attr("contenteditable","true");
				for(var key in dataTab){
					oData[key] = item[dataTab[key]];
				}
			}else {
				do_gl_show_Notify_Msg_Error ($.i18n('mat_material_tab_detail_error_msg'));
				oData = Object.assign({}, pr_default_new_line);
				line	.find("td").not(".action").html("");
				line	.find(".unitlab, .val01").attr("contenteditable","false");
			}
			return false;
		}
		
		var do_lc_verify_unit = function(item, nTd, oData, options){
			var line = $(nTd).parent();
			var dataTab = options.dataTab;
			
//			if(invInvoiceType == App['const'].SOR_ORDER_IN_TYPE){
//				for(var key in dataTab){
//					oData[key] = item[dataTab[key]];
//				}
//				line	.find(".val01").attr("contenteditable","true");
//			} else if(invInvoiceType == App['const'].SOR_ORDER_OUT_TYPE){
				do_req_mat_price_sell(item);
				setTimeout(function(){
					if(pr_cache_price_sell_by_mat[item.id] && pr_cache_price_sell_by_mat[item.id].length >0){
						for(var key in dataTab){
							oData[key] = item[dataTab[key]];
						}
						var price = formatDoubleV2(pr_cache_price_sell_by_mat[item.id][0].price01)
						oData.val01 = price;
						do_set_number_double(line, "val01", price);
						line	.find(".val01").attr("contenteditable","true");
						do_calculate_on_deail_table(oData, nTd);
					}else {
						do_gl_show_Notify_Msg_Error ($.i18n('mat_material_tab_detail_error_msg'));
						$(nTd).html("");
						line	.find(".val01").attr("contenteditable","false");
					}
					return false;
				}, 1000);
//			}
		}
	};


	return PerContractEntTabDetail;
});