var SDOM_DATATABLE_DEFAULT	= 	"<'row'<'col-4 col-lg-4 col-md-4 col-sm-4'l><'col-8 col-lg-8 col-md-8 col-sm-8 pull-right'f>>" +
								"<'row'<'col-12 col-lg-12 col-md-12 col-sm-12'tr>>" +
								"<'row mg-tb-20'<'col-6 col-lg-6 col-md-6 col-sm-6 col-xm-12'i><'col-6 col-lg-6 col-md-6 col-sm-6 col-xm-12 pull-right'p>>";

var SDOM_DATATABLE_CUSTOM	= 	"<'row'<'col-4 col-lg-4 col-md-4 col-sm-4 pull-left'l><'col-6 col-lg-6 col-md-6 col-sm-6 pull-right'f><'#table-header-add.col-2 col-lg-2 col-md-2 col-sm-2 pull-right'>>" +
								"<'row'<'col-12 col-lg-12 col-md-12 col-sm-12'tr>>" +
								"<'row'<'col-5 col-lg-5 col-md-5 col-sm-5'i><'col-5 col-lg-5 col-md-5 col-sm-5 pull-right'p><'#table-bottom-add.col-2 col-lg-2 col-md-2 col-sm-2'>>";

//var SDOM_DATATABLE_SEARCH_OPT= 	"<'row'<'col-lg-4 col-md-4 col-sm-4'l><'col-lg-8 col-md-8 col-sm-8'<'row div_search_with_opt'<'#table-header-search-opt'>f>>>" +
//								"<'row'<'col-lg-12 col-md-12 col-sm-12'tr>>" +
//								"<'row'<'col-lg-7 col-md-7 col-sm-12'i><'col-lg-5 col-md-5 col-sm-12'p>>";

var SDOM_DATATABLE_SEARCH_OPT= 	"<'row'<'col-5 col-lg-5 col-md-3 col-sm-4 col-xs-12'l><'#table-header-search-opt.col-2 col-lg-2 col-md-3 col-sm-3 col-xs-6'><'col-5 col-lg-5 col-md-6 col-sm-5 col-xs-6'f>>" +
								"<'row'<'col-12 col-lg-12 col-md-12 col-sm-12'tr>>" +
								"<'row'<'col-7 col-lg-7 col-md-7 col-sm-12'i><'col-5 col-lg-5 col-md-5 col-sm-12'p>>";

var SDOM_DATATABLE_SEARCH_OPT_OLD= 	"<'row'<'col-3 col-lg-3 col-md-3 col-sm-4'l><'col-5 col-lg-5 col-md-5 col-sm-4'f><'#table-header-search-opt.col-4 col-lg-4 col-md-4 col-sm-4'>>" +
								"<'row'<'col-12 col-lg-12 col-md-12 col-sm-12'tr>>" +
								"<'row'<'col-7 col-lg-7 col-md-7 col-sm-12'i><'col-5 col-lg-5 col-md-5 col-sm-12'p>>";

//------------------------------------------------------------------------------------------------------------------
var datatable_lang_config 	= "";
var datatable_lang_opt 		= null;
//------------------------------------------------------------------------------------------------------------------
var req_gl_datatable = function (cfg){
	//	tabParentId		: div contains table
	//	tabParentAttr 	: {} json html attributes
	//  tabId		: id of table
	//	tabClass	: class of table to find
	//  tabConf		: config for datatable
	//	tabColConf	: config of col in datatable
	//	tabScrollX	: true/false
	//  tabScrollY	: true/false
	//  tabLineFAdd	: function call when add line
	//  tabLineDef	: default line if add new one
	//  tabFCallback: function call when table is built 
	//  tabData		: data  
	//	tabTranslUrl:
	//	tabTransLang:
	// 	tabEditable	: can be editable
	
	//AJaxOption
	//	apiUrl			: urlAPI
	//	apiUrlHeader	: secu header
	//	apiUrlOpt		: refJon 
	//	apiTimeWait		: timeWait for each request
	//	apiFPreprocess	: call before api  
	//  apiFCallback	: call after api
	
	
	if (!cfg.apiTimeWait) cfg.apiTimeWait = 800;
	
	var tabParentId = null;
	var tabDiv		= null;
	var tabParent	= null;
	var tableId		= cfg.tabId?cfg.tabId:cfg.tabParentId;
	
	if (cfg.tabId)
		tabDiv 		= $(cfg.tabId);
	else {
		tabParentId	= cfg.tabParentId;
		tabParent 	= $(cfg.tabParentId);
		if(!cfg.tabClass) {
			cfg.tabClass = '.table-datatableDyn';
		}
		tabDiv 		= tabParent.find(cfg.tabClass);
	}
	
	if(tabDiv.length == 0) {
		console.log("ERROR: Table " + tableId + " is not found!");
		return undefined;
	}
	tabDiv.addClass("table-bordered table-striped");
	//-------------------------------------------------------------------------------------------
	cfg.tabColConf = req_gl_table_col_config(tabDiv, cfg.tabData, cfg.tabColConf);
	//-------------------------------------------------------------------------------------------
	var dataT = {
			"title"					: "",
			"searchOption" 			: false,
			"searchOptionConfig" 	: [{lab: $.i18n('all'), val:0}], //list des options dans select 
			"aLengthMenu"			: [ [15, 25, 50, 100], ["15", "25", "50", "100"] ],
			"processing"			: true,
	        "sPaginationType"		: "listbox",
			"bDeferRender"			: true,
			"sDom" 					: SDOM_DATATABLE_DEFAULT,	
			"aoColumns"				: cfg.tabColConf,
			"fnDrawCallback"		: function() {if(cfg.tabFCallback) cfg.tabFCallback(tableId);},
//			bProcessing	: false,  
		   
//		    "pagingType"	: "input",
//		    "pagingType"	: "simple_numbers",  //"full_numbers",
			
//		    "sPaginationType": "scrolling",		    
//			sPaginationType	: "bootstrap",
//			sPaginationType	: "full_numbers",    
		    
//		    aaSorting		: sort ? sort : [1, "asc"],	
				
	}
	
	if (!cfg.tabTranslUrl){
		var lang = cfg.tabTransLang ;
		if (lang == null || lang == undefined) lang = localStorage.language;	
		if (lang == null || lang == undefined) lang = "vi";	
		cfg.tabTranslUrl = "www/js/lib/datatables/datatable_"+lang+".json";
		cfg.tabTransLang = lang;
		
		if (datatable_lang_config!=lang){
			datatable_lang_config = lang; 
			readFile(cfg.tabTranslUrl, function(text){
				datatable_lang_opt = JSON.parse(text);		    
			});
		} 	
	}
	if (datatable_lang_opt) 
			dataT.oLanguage = datatable_lang_opt; //readfile is asynchro
	else  	dataT.oLanguage = {sUrl :  cfg.tabTranslUrl};
	
	//----not ajax dyn
	if (cfg.tabData){				
		var table_data 		= [];
		var table_data_name = tabDiv.data("name");
		var table_right 	= tabDiv.data("right");
		if(table_data_name && cfg.tabData[table_data_name]) {
			table_data = cfg.tabData[table_data_name];
		}else if (!table_data_name){
			table_data = cfg.tabData;
		}
		if (cfg.tabLineDef){
			$.each(table_data, function(i, e) {
				var tmp = $.extend(true, {}, cfg.tabLineDef, e);
				$.extend(true, e, tmp);
			});
		}		
		dataT.data = table_data;
		
	}else{
	//---- ajax dyn	
	
		var funtFuture;
		dataT.bServerSide		= true;
		dataT.sAjaxSource		= cfg.apiUrl; 

		dataT.fnServerData		= function ( sSource, aoData, fnCallback, oSettings  ) {			    	
			//aoData =[{"name":"sEcho","value":3},
			//{"name":"iColumns","value":2},{"name":"sColumns","value":","},{"name":"iDisplayStart","value":0},{"name":"iDisplayLength","value":10},{"name":"mDataProp_0","value":"code"},{"name":"sSearch_0","value":""},{"name":"bRegex_0","value":false},{"name":"bSearchable_0","value":true},{"name":"bSortable_0","value":true},{"name":"mDataProp_1","value":"name"},{"name":"sSearch_1","value":""},{"name":"bRegex_1","value":false},{"name":"bSearchable_1","value":true},{"name":"bSortable_1","value":true},{"name":"sSearch","value":"f"},{"name":"bRegex","value":false},{"name":"iSortCol_0","value":0},{"name":"sSortDir_0","value":"desc"},{"name":"iSortingCols","value":1}]
			//param = {name:3,iColumns:2,...}

			var param = {};

			//---chk if there is the option for search
			if (dataT.searchOption){
				var selectEle = $(tableId).find("#sel_search_opt");
//				param["searchOpt"] = selectEle.val();
				dataT.searchOptCol 	= selectEle.val();
				selectEle.off("change");			
				selectEle.on("change", function() {
					var searchText = $(tableId).find('.dataTables_filter').find('input').val();
					if (searchText) searchText = searchText.trim();
					if (searchText.length>0){
						dataT.searchOptCol 	= selectEle.val();
						dataT.fnServerData(sSource, aoData, fnCallback, oSettings );
					}
						
				});		
			}else{
//				if (dataT.searchOptVal) param["searchOpt"] = dataT.searchOptVal
//				else
//					param["searchOpt"] = null; //no option, by default in server side
			}
			
			if (dataT.searchOptCol){
				param["searchOptCol"] =dataT.searchOptCol;
			}

			for (var k in aoData){
				var o = aoData[k];
				param[o.name] = o.value;				
			}

			cfg.apiUrlOpt["dataTableParam"]	= JSON.stringify(param);		

			if (!funtFuture) clearTimeout(funtFuture);				
			funtFuture = setTimeout(function(){
				$.ajax({
					contentType : "application/json",
					dataType	: "json",
					type		: 'POST',
					url			: sSource,
					headers		: cfg.apiUrlHeader,
					data		: JSON.stringify(cfg.apiUrlOpt),
					success		: function (msg) {
//						App.network.decodeUTF8(msg);								
//						msg.aaData = JSON.parse(msg.aaData);
//						fnCallback(msg);

						if (!can_gl_BeLogged(msg)) return;
						App.network.decodeUTF8(msg);		    				
						if(msg.sv_code == 20000) {
							try{
								msg.aaData = JSON.parse(msg.aaData);
							}catch(e){
								//msg.aaData is aldready aaData
							}

						} else {
							msg.aaData = [];
							msg.iTotalRecords = 0;
						}

						if(cfg.apiFPreprocess) {
							// Process the return data before building the table
							msg = cfg.apiFPreprocess(msg);
						}
						if(msg.aaData.length >= 0){
							$(tabParentId).on("change", "select", function() {
								if(!App.data.page)	App.data.page = {};
								App.data.page[tabParentId] = 1;
							});

							$(tabParentId).on("keydown", "input[type='search']", function() {
								if(!App.data.page)	App.data.page = {};
								App.data.page[tabParentId] = 1;
							});


							fnCallback(msg);

							if (cfg.apiFCallback) {
								setTimeout(function(){ cfg.apiFCallback(msg.aaData, tabParentId, oTable, param);}, 500);
							}
						}

					},
					error 		: function(res, statut, erreur){	
						if (cfg.apiFError) execute (apiFError, [res, statut, erreur]);	
					},
				});	
			}, cfg.apiTimeWait);
		}	
	}
	
	//--------scrol option------------------------
	if(cfg.tabScrollX == undefined || cfg.tabScrollX == null){
		dataT["scrollX"] = true;
	} else{
		dataT["scrollX"] = cfg.tabScrollX;
	}
	if(cfg.tabScrollY == undefined || cfg.tabScrollY == null){
		//Scroll - vertical, dynamic height
		dataT["scrollY"] = "70vh";
		dataT["scrollCollapse"]	= true;
	} else {
		dataT["scrollCollapse"]	= cfg.tabScrollY;
	}
	
	
	//---------------------------------------------
	if (cfg.tabConf) dataT = Object.assign(dataT, cfg.tabConf);
	
	//---------------------------------------------
	
	var table_editable 	= cfg.tabEditable;
	if(table_editable == undefined || table_editable ==null ) table_editable = tabDiv.data("editable");
	if(table_editable == undefined || table_editable ==null ) {
		table_editable = true;
	}	
	
	var pr_local = {};
	if( tableId && table_editable  ) {		
		dataT.sDom 			= SDOM_DATATABLE_CUSTOM;
		dataT.initComplete 	= function( settings, json ) {			
			$(tableId + "_wrapper")	.find("#table-header-add")
									.html("<button id='btn_add' class='objData datatable_btn_add btn btn-flat btn-primary pull-right ' disabled='disabled'>"
											+ "<i class='fa fa-plus' aria-hidden='true'></i>"
										+ "</button>");
			
			$(tableId + "_wrapper")	.find("#table-bottom-add")
									.append("<button id='btn_add_bottom' class='objData datatable_btn_add btn btn-flat btn-primary pull-right' disabled='disabled'>"
											+ "<i class='fa fa-plus' aria-hidden='true'></i>"
										+ "</button>");
			
			//Add right to add btn
			$(tableId + "_wrapper").find(".datatable_btn_add").data(table_right);			
			$(tableId + "_wrapper").find(".datatable_btn_add").on("click", function() {
				if(cfg.tabLineFAdd) {
					cfg.tabLineFAdd(pr_local.oTable);
				} else {
					var newData 	= $.extend(true, {}, cfg.tabLineDef);
					var rownode 	= pr_local.oTable.api().row.add(newData).draw(false).node();

					do_gl_enable_edit($(rownode));
				}
			});
						
			do_gl_apply_right($(tableId + "_wrapper"));
			
			if(cfg.tabFCallback) {
				cfg.tabFCallback();
			}
		}
	}
	
	if (dataT.searchOption){
//		dataT.sDom 			= SDOM_DATATABLE_SEARCH_OPT;		
		dataT.initComplete 	=  function(settings, json) {
			var opt = "";
			for (var i in dataT.searchOptionConfig){
				var conf = dataT.searchOptionConfig[i];
				opt = opt + "<option value= '"+ conf.val+"'>" +  conf.lab + "</option>"; 
			}
			var div_filter= "#DataTables_Table_0_filter";
//			$(tableId).find("#table-header-search-opt").html(
			$(tableId).find(div_filter).find("label").prepend(
					"<select class= 'form-control input-sm datatable_sel_search_opt' id='sel_search_opt'>"
					+ opt
					+ "</select> &nbsp;");
			

		}
	}
	
	//-----Enable ColReorder extension
	if(dataT["canColReorder"] == null||dataT["canColReorder"] == undefined || dataT["canColReorder"] == true){
		dataT.sDom 	= "R" + dataT.sDom;
//		new $.fn.dataTable.ColReorder( oTable );
	}
	
	//---------------------------------------------
	
	var oTable = tabDiv.dataTable(dataT);
	pr_local.oTable = oTable; //=> for function
	
	if (cfg.tabParentAttr){
		setTimeout(function(){
			for (var a in cfg.tabParentAttr)
				tabDiv.parent("div").css(a,  cfg.tabParentAttr[a]);
		}, 700);
	}
	return oTable
}

//------------------------------------------------------------------------------------------------------------------
var do_gl_filter_line_by_mode = function (list, mode){
	if (!list) return;
	try{
		for(var i = 0; i<list.length; i++){
			if(list[i].mode){
				if(list[i].mode == mode){
					delete list[i];
				}
			}
		}
	}catch(e){}	
}

jQuery.fn.dataTable.Api.register('row.addByPos()', function(data, index) {    
    var currentPage = this.page();
 
    //insert the row
    this.row.add(data);
 
    //move added row to desired index
    var rowCount = this.data().length;
    if (rowCount<=1) return this.row(0);
    
    var insertedRow = this.row(rowCount-1).data();
    insertedRow.ord = rowCount;
    
 
    for (var i=rowCount-1;i>index;i--) {
    	var tempRow = this.row(i-1).data();
        this.row(i).data(tempRow);        
    }    
    
    this.row(index).data(insertedRow);
    
    //refresh the current page
    this.page(currentPage).draw(false);
    return this.row(index);
});


/*
 *
 var selectedElement = $("#id_tab");
 var selectedTab = selectedElement.dataTable();
 var selectedRow = selectedElement.dataTable().fnGetNodes().filter(function(element){ 
    			return element.getAttribute('data-id') == userId 
    		})[0];
 */
function doShowDatatablePageByRow (selectedTab, selectedRow){	
	var lines	= selectedTab.fnGetNodes();
	var lineNb	= -1;
	for (var i = 0; i< lines.length;i ++){
		if (lines[i] == selectedRow){
			lineNb = i;
			break;
		}
	}
	if (lineNb>=0){
		var pos			= lineNb; //selectedTab.fnGetPosition(selectedRow);
		var pageInf 	= selectedTab.fnPagingInfo();		    			    	
		var pageDisplay = Math.floor(pos/pageInf.iLength );
		selectedTab.fnPageChange(pageDisplay,true);
	}
	
}


//url =  App.path.BASE_URL_API_PRIV
/*colConfig		= [
{ mData: "id" 		, bVisible: false},
{ mData: "code" 		, bVisible: true},
{ mData: "name01" 	, bVisible: true}  
]*/	
function req_gl_Datatable_Ajax_Dyn(div, url, url_header, fileTranslate, colConfig, refJson, fError, timeWait, datatableClass, fPreprocess, fCallback, dataTableConf, scrollX){	
	if (!timeWait) timeWait = 800;
	
	if(!datatableClass) {
		datatableClass = '.table-datatableDyn';
	}
	
	var funtFuture;
	var tableId = div;
	
	if (!fileTranslate){
		var lang = localStorage.language;
		if (lang == null || lang == undefined) lang = "vi";	
		fileTranslate = "www/js/lib/datatables/datatable_"+lang+".json";
	}
	
	var dataT = {
			"searchOption" 			: false,
			"searchOptionConfig" 	: [{lab: $.i18n('all'), val:0}], //list des options dans select 
			
			"processing": true,
	        
		    bServerSide		: true,  
		    //bProcessing	: false,  
		    sAjaxSource		: url,  

		    "aLengthMenu"	: [ [15, 25, 50, 100], ["15", "25", "50", "100"] ],
		   
//		    "pagingType"	: "input",
//		    "pagingType"	: "simple_numbers",  
		    //pagingType		: "full_numbers",
		    
//		    "sPaginationType": "scrolling",
		    "sPaginationType": "listbox",
//			sPaginationType	: "bootstrap",
//			sPaginationType	: "full_numbers",    
		    
//		    aaSorting		: sort ? sort : [1, "asc"],
		    	
		    bDeferRender	: true,
		    
			oLanguage		: {
				sUrl		:  fileTranslate
			},	
			
//			oClasses		:{
//				sFilterInput :  "inputClass",
//				sLengthSelect : "selectClass",
//			},

			sDom 			: SDOM_DATATABLE_DEFAULT,
			
			aoColumns		: colConfig,	
		
			initComplete	: function(settings, json) {
				$(tableId).find('.dataTables_scrollBody').addClass("dataTables_scrollbar");
			},
		    
			fnServerData	: function ( sSource, aoData, fnCallback, oSettings  ) {			    	
				$(tableId).find('.dataTables_scrollBody').addClass("dataTables_scrollbar");
				
				//aoData =[{"name":"sEcho","value":3},{"name":"iColumns","value":2},{"name":"sColumns","value":","},{"name":"iDisplayStart","value":0},{"name":"iDisplayLength","value":10},{"name":"mDataProp_0","value":"code"},{"name":"sSearch_0","value":""},{"name":"bRegex_0","value":false},{"name":"bSearchable_0","value":true},{"name":"bSortable_0","value":true},{"name":"mDataProp_1","value":"name"},{"name":"sSearch_1","value":""},{"name":"bRegex_1","value":false},{"name":"bSearchable_1","value":true},{"name":"bSortable_1","value":true},{"name":"sSearch","value":"f"},{"name":"bRegex","value":false},{"name":"iSortCol_0","value":0},{"name":"sSortDir_0","value":"desc"},{"name":"iSortingCols","value":1}]
		    	//param = {name:3,iColumns:2,...}
		    	var param = {};
		    	
		    	//---chk if there is the option for search
		    	if (dataT.searchOption){
		    		var selectEle 		= $(tableId).find("#sel_search_opt");
//					param["searchOpt"] 	= selectEle.val();
		    		dataT.searchOptCol 	= selectEle.val();
					selectEle.off("change");			
					selectEle.on("change", function() {
						var searchText = $(tableId).find('.dataTables_filter').find('input').val();
						if (searchText) searchText = searchText.trim();
						if (searchText.length>0){
							dataT.searchOptCol = selectEle.val();
							dataT.fnServerData(sSource, aoData, fnCallback, oSettings );
						}
							
					});		
				}else{
//					if (dataT.searchOptVal) param["searchOpt"] = dataT.searchOptVal
//					else
//						param["searchOpt"] = null; //no option, by default in server side
				}
		    	
		    	if (dataT.searchOptCol){
					param["searchOptCol"] =dataT.searchOptCol;
				}
		    	
		    	for (var k in aoData){
					var o = aoData[k];
					param[o.name] = o.value;				
				}

		    	refJson["dataTableParam"]	= JSON.stringify(param);		
				
				clearTimeout(funtFuture);
				
		    	funtFuture = setTimeout(function(){
		    		$.ajax({
		    			contentType : "application/json",
						dataType	: "json",
		    			type		: 'POST',
		    			url			: sSource,
						headers		: url_header,
						data		: JSON.stringify(refJson),
		    			success		: function (msg) {
//		    				App.network.decodeUTF8(msg);								
//		    				msg.aaData = JSON.parse(msg.aaData);
//		    				fnCallback(msg);
		    				
		    				if (!can_gl_BeLogged(msg)) return;
		    				App.network.decodeUTF8(msg);		    				
							if(msg.sv_code == 20000) {
								try{
									msg.aaData = JSON.parse(msg.aaData);
								}catch(e){
									//msg.aaData is aldready aaData
								}
								
							} else {
								msg.aaData = [];
								msg.iTotalRecords = 0;
							}

							if(fPreprocess) {
								// Process the return data before building the table
								msg = fPreprocess(msg);
							}
							if(msg.aaData.length >= 0){
								$(div).on("change", "select", function() {
									if(!App.data.page)	App.data.page = {};
									App.data.page[div] = 1;
								});
								
								$(div).on("keydown", "input[type='search']", function() {
									if(!App.data.page)	App.data.page = {};
									App.data.page[div] = 1;
								});
								
								
								fnCallback(msg);
								
								if(fCallback) {
									setTimeout(function(){ fCallback(msg.aaData, div, oTable, param);}, 500);
								}
							}
		    				
		    			},
		    			error 		: function(res, statut, erreur){					
		    				if (fError) execute (fError, [res, statut, erreur]);						
		    			},
		    		});	
		    	}, timeWait);
		    }	    
		 
		};
	
	
	if (dataTableConf) dataT = Object.assign(dataT, dataTableConf);
	
	if(dataT["canScrollY"] == true){
	    //Scroll - vertical, dynamic height
		dataT["scrollY"] = "80vh";
		dataT["scrollCollapse"]	= true;
	}
	if(dataT["canScrollX"] == true){
	    //Scroll - vertical, dynamic height
		dataT["scrollX"] = "80%";
	} else {
//		dataT["scrollX"] = false;
	}
	
//	if(typeof(scrollX) == "undefined"){
//		dataT["scrollX"] = false;
//	}
	
	
	
	if (dataT.searchOption){
//		dataT.sDom 	= SDOM_DATATABLE_SEARCH_OPT;
		
		dataT.initComplete =  function(settings, json) {

			var opt = "";
			for (var i in dataT.searchOptionConfig){
				var conf = dataT.searchOptionConfig[i];
				opt = opt + "<option value= '"+ conf.val+"'>" +  conf.lab + "</option>"; 
			}

			var div_filter= "#DataTables_Table_0_filter";
//			$(tableId).find("#table-header-search-opt").html(
			$(tableId).find(div_filter).find("label").prepend(
										"<select class= 'form-control input-sm datatable_sel_search_opt' id='sel_search_opt'>"
										+ opt
										+ "</select> &nbsp;");
			
//			$(tableId).find("#table-header-search-opt").html(
//										"<select class= 'form-control input-sm datatable_sel_search_opt' id='sel_search_opt'>"
//										+ opt
//										+ "</select> &nbsp;");
			
//			$(tableId).find(".dataTables_filter").prepend(
//					"<select class='form-control sel_search_opt' id='sel_search_opt'>"
//					+ opt
//					+ "</select> &nbsp;"); 

			
			//Add right to add btn
			
		}
	}
	
	
	//Enable ColReorder extension
	if(dataT["canColReorder"] == null||dataT["canColReorder"] == undefined || dataT["canColReorder"] == true){
		dataT.sDom 	= "R" + dataT.sDom;
//		new $.fn.dataTable.ColReorder( oTable );
	}
	
	$(div).find(datatableClass).addClass("table-bordered table-striped");
	var oTable = $(div).find(datatableClass).dataTable(dataT);
	
	//---binding event for refresh btn
	var btnRefresh = $(div).find(".btn-refresh");
	btnRefresh.off("click");
	btnRefresh.on("click", function(){
		oTable.fnDraw();
	});
	
	
	return oTable;
}

var can_gl_BeLogged = function (res){
	if (!res.sess_stat){
//		localStorage.clear();	
		try{
			do_gl_LocalStorage_Remove (App.keys.KEY_STORAGE_CREDENTIAL);
		}catch(e){}	
		App.router.controller.do_lc_run(App.router.routes.HOME);
		return false;
	}		
	return true;
};

//------------------------only when begin ---------------------------------------------------
/* ---------- Additional functions for data table ---------- */
$.fn.dataTableExt.oApi.fnPagingInfo = function (oSettings ){
	if(oSettings==null) {
		return {
			"iStart"		: 0,
			"iEnd"			: 0,
			"iLength"		: 0,
			"iTotal"		: 0,
			"iFilteredTotal": 0,
			"iPage"			: 0,
			"iTotalPages"	: 0
		};
	} else {
		return {
			"iStart"		: oSettings._iDisplayStart,
			"iEnd"			: oSettings.fnDisplayEnd(),
			"iLength"		: oSettings._iDisplayLength,
			"iTotal"		: oSettings.fnRecordsTotal(),
			"iFilteredTotal": oSettings.fnRecordsDisplay(),
			"iPage"			: Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
			"iTotalPages"	: Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
		};
	}		
}

//custom search to hide deleted rows
$.fn.dataTable.ext.search.push(
		function(settings, data, dataIndex) {
			var mode = settings.aoData[dataIndex]._aData.mode;
			if(mode == 3) {
				return false;
			} else {
				return true;
			}
		}
);

var _range = function ( len, start ){	
	var end;
	if ( start === undefined ) {
		start 	= 0;
		end 	= len;
	}else {
		end 	= start;
		start 	= len;
	}
	
	var out = [];
	for ( var i=start ; i<end ; i++ ) {
		out.push( i );
	}

	return out;
};
$.fn.DataTable.ext.pager.simple_numbers_no_ellipses = function(page, pages){
	var numbers 	= [];
	//var buttons = $.fn.DataTable.ext.pager.numbers_length;
	var buttons 	= 5;
	var half 	= Math.floor( buttons / 2 );

	if ( pages <= buttons ) {
		numbers = _range( 0, pages );

	} else if ( page <= half ) {
		numbers = _range( 0, buttons);

	} else if ( page >= pages - 1 - half ) {
		numbers = _range( pages - buttons, pages );

	} else {
		numbers = _range( page - half, page + half + 1);
	}

	numbers.DT_el = 'span';	 
	return [ 'previous', numbers, 'next' ];
};

$.fn.DataTable.ext.pager.simple_numbers = function(page, pages) {//page =0 => page 1
	var	numbers = [];
	var buttons = 6;
	var half 	= Math.floor( buttons / 2 )-1;
	var i 		= 1;

	if ( pages <= buttons ) {
		numbers = _range( 0, pages );
	
	}else if ( page <= half ) {
		numbers = _range( 0, buttons-2 );
		numbers.push( 'ellipsis' );
		numbers.push( pages-1 );
	
	}else if ( page >= pages - 1 - half ) {
		numbers = _range( pages-(buttons-2), pages );
		numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6
		numbers.splice( 0, 0, 0 );
	
	}else {
		numbers = _range( page-half+1, page+half );
		numbers.push( 'ellipsis' );
		numbers.push( pages-1 );
		numbers.splice( 0, 0, 'ellipsis' );
		numbers.splice( 0, 0, 0 );
	}

	numbers.DT_el = 'span';
	return ["previous", numbers, "next"];
};

$.extend( $.fn.dataTableExt.oPagination, {
	"bootstrap": {
		"fnInit": function( oSettings, nPaging, fnDraw ) {
			var oLang = oSettings.oLanguage.oPaginate;
			var fnClickHandler = function ( e ) {
				e.preventDefault();
				if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
					fnDraw( oSettings );
				}
			};

			$(nPaging).addClass('pagination').append(
					'<ul>'+
//					'<li class="prev disabled"><a href="#">&larr; '+oLang.sPrevious+'</a></li>'+
//					'<li class="next disabled"><a href="#">'+oLang.sNext+' &rarr; </a></li>'+
					'<li class="prev disabled"><a href="#">'+oLang.sPrevious+'</a></li>'+
					'<li class="next disabled"><a href="#">'+oLang.sNext+'</a></li>'+
					'</ul>'
			);
			
			var els = $('a', nPaging);
			$(els[0]).bind( 'click.DT', { action: "previous" 	}, fnClickHandler );
			$(els[1]).bind( 'click.DT', { action: "next" 		}, fnClickHandler );
		},

		"fnUpdate": function ( oSettings, fnDraw ) {
			var iListLength = 3;
			var oPaging = oSettings.oInstance.fnPagingInfo();
			var an = oSettings.aanFeatures.p;
			var i, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);

			if ( oPaging.iTotalPages < iListLength) {
				iStart = 1;
				iEnd = oPaging.iTotalPages;
			}
			else if ( oPaging.iPage <= iHalf ) {
				iStart = 1;
				iEnd = iListLength;
			} else if ( oPaging.iPage >= (oPaging.iTotalPages-iHalf) ) {
				iStart = oPaging.iTotalPages - iListLength + 1;
				iEnd = oPaging.iTotalPages;
			} else {
				iStart = oPaging.iPage - iHalf + 1;
				iEnd = iStart + iListLength - 1;
			}

			for ( i=0, iLen=an.length ; i<iLen ; i++ ) {
				// remove the middle elements
				$('li:gt(0)', an[i]).filter(':not(:last)').remove();

				// add the new list items and their event handlers
				for ( j=iStart ; j<=iEnd ; j++ ) {
					sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
					$('<li '+sClass+'><a href="#">'+j+'</a></li>')
					.insertBefore( $('li:last', an[i])[0] )
					.bind('click', function (e) {
						e.preventDefault();
						oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
						fnDraw( oSettings );
					} );
				}

				// add / remove disabled classes from the static elements
				if ( oPaging.iPage === 0 ) {
					$('li:first', an[i]).addClass('disabled');
				} else {
					$('li:first', an[i]).removeClass('disabled');
				}

				if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
					$('li:last', an[i]).addClass('disabled');
				} else {
					$('li:last', an[i]).removeClass('disabled');
				}
			}
		}
	}
});


/**
 * 
 */
var req_gl_table_col_config = function(table, data, options) {
	if(!table.is("table")) {
		console.log("<table> is not a valid table");
		return;
	}
	var colConfig 	= [];
	var lstTh 		= table.find("th");
	var primaryCol	= table.data("primary");
	if(lstTh) {
		lstTh.each(function(e, i) {
			var th 			= $(this);
			var name 		= th.data("name");			
			var group 		= th.data("group");
			var groupIndex 	= th.data("gindex");
			var visible 	= th.data("visible");
			var editable 	= th.data("editable");

			var plugin	= th.data("plugin");
			var tdClass	= th.data("class");
			var tpyCode	= th.data("code");
			var right	= th.data("right");
			var pattern = th.data("pattern");
			var disable = th.data("disabled")
			var editable_class = "";
			if(visible == undefined) {
				visible = true;
			}
			if(editable == undefined) {
				editable = true;
			} else if(editable == "none") {
				editable = false;
			}
			
			if(visible == true && editable == true) {
				editable_class = "editable";
			}
			
			if(plugin == "fileinput") {
				//do not enable edit the td itself
				editable_class = "";
			}
			
			if(!tdClass) {
				tdClass = "";
			}
			
			if(name) {
				var config = { mData: name 	, bVisible: visible, sClass:editable_class + " " + name + " " + tdClass};
				if(name == "action") {
					config.mData = "id";
					bSortable = false;
					//do not enable edit the td itself
					config.sClass = name + " " + tdClass;
				}
				
				if(plugin == "fileinput") {
					//fix the width so it not very large
					config.sWidth = "30px";
					//do not enable edit the td itself
					config.sClass = name + " " + tdClass + " excl";
				}
				//bind default event
				config.fnCreatedCell = function(nTd, sData, oData,iRow, iCol) {
					var line = $(nTd).parent();
					line.attr("data-gIndex",iRow);
					
					$(nTd).data("name"	, name);
					if (group) 		$(nTd).data("group"	, group);
					if (groupIndex) $(nTd).data("gindex", groupIndex);					

					if(visible == true && editable == true) {
						$(nTd).keydown(function(event) {
							if(event.which == 13) {
								event.preventDefault();
								var next = $(this).nextAll("[contenteditable='true']")[0];
								if(next.length > 0) {
									next[0].focus();
								} else {
									var nextLine = $(this).parent().next();
									if(nextLine.length > 0) {
										$(nextLine).find("[contenteditable='true']")[0].focus();
									}
								}
							}
						});
						
						if(plugin == "datepicker") {
							do_gl_datepicker_plugin($(nTd), th);
						}else if(plugin == "datetimepicker") {
							do_gl_datetimepicker_plugin($(nTd), th);
						}else if(plugin == "fileinput") {
							$(nTd).html("<input class='fileinput editable' type='file' data-name='" + name + "' data-code='" + tpyCode + "'/>")
							do_gl_init_fileinputPlugin($(nTd) ,{obj : oData, fileinput:{dropZoneEnabled: true}});
						}
					}
					
					if(pattern){
						$(nTd).on("blur", function(event) {
							var data = $(nTd).html();
							data = data.split(" ").join("");
							if(data != null && data != ""){
								data = parseFloat(data).toFixed(2);
								if(pattern == "number"){
									data = data.toString().split( /(?=(?:\d{3})+(?:\.|$))/g ).join( " " );
								} else {
									var patt = pattern.split(",");
									var a = patt[0];
									var b = patt[1];
									data = data.toString().replace(new RegExp(a,"g"), b);
								}
								
								$(nTd).html(data);
							}
						});
					}
					
					if(name == "action") {
						//bind delete line action
						$(nTd).find(".a_delete").on("click", function() {
							var table = $(this).parents("table").DataTable();
							var row = table.row( $(this).parents('tr') )
							var canConfirm  = false;
							if(oData[primaryCol] != null && oData[primaryCol] != "") {
								canConfirm 	= true;
							}
							if(canConfirm) {
								App.MsgboxController.do_lc_show({
									title	: $.i18n("msgbox_confirm_title"),
									content : $.i18n("common_msg_del_confirm"),
									width	: window.innerWidth<1024?"95%":"40%",
									buttons	: {
										OK: {
											lab		: $.i18n("common_btn_ok"),
											funct	: function(){
												oData.mode = 3;
												row.remove().draw();
//												table.draw();
											},
										},
										NO: {
											lab		:  $.i18n("common_btn_cancel"),
										}
									}
								});	
							} else {
								row.remove().draw();
							}
						});
					}
					
					//add optional function
					if(options && options[name] && options[name].fnCreatedCell) {
						options[name].fnCreatedCell(nTd, sData, oData,iRow, iCol);
					}
				}
				
				if(options && options[name] && options[name].mRender) {
					config.mRender = options[name].mRender;
				} else {
					config.mRender = function(data, type, oData, position) {
						var dataFormat = th.data("format");
						var name		= th.data("name");
						if (data === null || data === undefined || data === ""){
							oData[name] = "";
							data = "";
						} else if(dataFormat){
							var pformat = "viShortDate";
							localStorage.language == "vi"? pformat = "vnShortDate": localStorage.language == "fr"? pformat = "frShortDate": pformat = "enShortDate"
							var parts = dataFormat.split(" ");
							if(parts.length == 2) {
								pformat = parts[1];
							}
							if(parts[0] == "date") {
								var date 		= reg_gl_DateObj_From_DateStr(data	, DateFormat.masks.isoDateTime);
								data = value 	= reg_gl_DateStr_From_DateObj(date	, DateFormat.masks[pformat]);
								
//								var date = luxon.DateTime.fromString(data, DateFormat.masks["isoDateTime"]);
//								data = value = date.toFormat(DateFormat.masks[pformat]);
							} else if(parts[0] == "double"){
								data = $.formatNumber(data, {format: parts[1], locale : localStorage.language})
							} else if(parts[0] == "date_time"){
								localStorage.language == "vi"? pformat = "vnFullDate": localStorage.language =="fr"? pformat = "frFullDate": pformat = "enFullDate"
								var date 		= reg_gl_DateObj_From_DateStr(data	, DateFormat.masks.isoDateTime);
								data = value 	= reg_gl_DateStr_From_DateObj(date	, DateFormat.masks[pformat]);
							}
						}
						return data;
					}
				}
				
				if(name == "action") {
					config.mRender = function(id) {  
						var res = '<div class="box-icon" style="text-align:center" data-right="'	+ right + '">'
							+'<a class="editable a_delete action-btn not-active" data-id="'+id+'" ><i class="fa fa-minus-circle"></i></a></div>';
						return res;
					};
				}
				
				colConfig.push(config);
			} else {
				return;
			}
		})
	}
	return colConfig;
}


function readFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

var req_gl_create_datatable = function(data, tableId, colConf, default_new_line, success_callback, add_funct, taConf) {
	var table = $(tableId);
	
	
	if(table.length == 0) {
		console.log("ERROR: Table " + tableId + " is not found!");
		return undefined;
	}
	
	table.addClass("table-bordered table-striped");
	var colConfig = req_gl_table_col_config(table, data, colConf);
	
	var lang = localStorage.language;
	if (lang == null || lang == undefined) lang = "vi";	

	
	var filename = "www/js/lib/datatables/datatable_"+lang+".json";
	
	if (datatable_lang_config!=lang){
		datatable_lang_config= lang; 
		readFile(filename, function(text){
			datatable_lang_opt = JSON.parse(text);		    
		});
	} 	
		
//	else filename= null;
	
	var table_data 		= [];
	var table_data_grp  = table.data("group");
	var table_data_name = table.data("name");
	var table_right 	= table.data("right");
	if(table_data_grp && data[table_data_grp]) {
		table_data = data[table_data_grp][table_data_name];
	}else if(table_data_name && data[table_data_name]) {
		table_data = data[table_data_name];
	}else if (!table_data_name){
		table_data = data;
	}
	
	var table_editable = table.data("editable");
	if(table_editable == undefined) {
		table_editable = true;
	}
	
	$.each(table_data, function(i, e) {
		var tmp = $.extend(true, {}, default_new_line, e);
		$.extend(true, e, tmp);
	});


	var datatable_options = {
			"processing": true,

			data			: table_data,
			aoColumns		: colConfig,
			"fnDrawCallback": function() {
				if(success_callback) success_callback(tableId);
	        },
//			oLanguage		: {
//				sUrl		:  filename
//			},
			oLanguage		: datatable_lang_opt,
			
			sDom 			: SDOM_DATATABLE_DEFAULT
	};

	if (!datatable_options.oLanguage) datatable_options.oLanguage = {sUrl:  filename};
	
	
	if(table_editable) {
		datatable_options.sDom = SDOM_DATATABLE_CUSTOM;
		datatable_options.initComplete =  function( settings, json ) {			
			$(tableId + "_wrapper")	.find("#table-header-add")
									.html("<button id='btn_add' class='objData datatable_btn_add btn btn-flat btn-primary pull-right' disabled='disabled'>"
										+ "<i class='fa fa-plus' aria-hidden='true'></i>"
										+ "</button>");
			
			$(tableId + "_wrapper")	.find("#table-bottom-add")
									.append("<button id='btn_add_bottom' class='objData datatable_btn_add btn btn-flat btn-primary pull-right' disabled='disabled'>"
										+ "<i class='fa fa-plus' aria-hidden='true'></i>"
										+ "</button>");
			
			//Add right to add btn
			$(tableId + "_wrapper").find(".datatable_btn_add").data(table_right);			
			$(tableId + "_wrapper").find(".datatable_btn_add").on("click", function() {
				if(add_funct) {
					add_funct(new_table);
				} else {
					var newData 	= $.extend(true, {}, default_new_line);
					var rownode 	= new_table.api().row.add(newData).draw().node();

//					var rownode 	= new_table.api().row.addByPos(newData,0).draw(false).node();
					
					do_gl_enable_edit($(rownode));
				}
			});
			
			do_gl_apply_right($(tableId + "_wrapper"));
			
			if(success_callback) {
				success_callback();
			}
		}
	}
	
	if (taConf)
		$.extend(true, datatable_options, taConf);  
	
	var new_table = table.dataTable(datatable_options);
	
	//neu dung: var new_table = table.DataTable(datatable_options); =>new_table.row.add(newData).draw(false).node(); (khong co api())
		setTimeout(function(){
			table.parent("div").css("overflow", "auto");
		}, 700);
	
	return new_table;
}

function do_gl_init_nonSort_column(div, listClass){
	for(var i=0;i<listClass.length; i++){
		$(div).find("th[class*='"+listClass[i]+"']").off("click");
		$(div).find("th[class*='"+listClass[i]+"']").removeClass("sorting");
	}
}

//---------------------------------------------------------------------------------------------------------------------
jQuery.fn.dataTableExt.oApi.fnReloadAjax = function ( oSettings, sNewSource, fnCallback, bStandingRedraw )
{
	// DataTables 1.10 compatibility - if 1.10 then `versionCheck` exists.
	// 1.10's API has ajax reloading built in, so we use those abilities
	// directly.
	if ( jQuery.fn.dataTable.versionCheck ) {
		var api = new jQuery.fn.dataTable.Api( oSettings );

		if ( sNewSource ) {
			api.ajax.url( sNewSource ).load( fnCallback, !bStandingRedraw );
		}
		else {
			api.ajax.reload( fnCallback, !bStandingRedraw );
		}
		return;
	}

	if ( sNewSource !== undefined && sNewSource !== null ) {
		oSettings.sAjaxSource = sNewSource;
	}

	// Server-side processing should just call fnDraw
	if ( oSettings.oFeatures.bServerSide ) {
		this.fnDraw();
		return;
	}

	this.oApi._fnProcessingDisplay( oSettings, true );
	var that = this;
	var iStart = oSettings._iDisplayStart;
	var aData = [];

	this.oApi._fnServerParams( oSettings, aData );

	oSettings.fnServerData.call( oSettings.oInstance, oSettings.sAjaxSource, aData, function(json) {
		/* Clear the old information from the table */
		that.oApi._fnClearTable( oSettings );

		/* Got the data - add it to the table */
		var aData =  (oSettings.sAjaxDataProp !== "") ?
			that.oApi._fnGetObjectDataFn( oSettings.sAjaxDataProp )( json ) : json;

		for ( var i=0 ; i<aData.length ; i++ )
		{
			that.oApi._fnAddData( oSettings, aData[i] );
		}

		oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();

		that.fnDraw();

		if ( bStandingRedraw === true )
		{
			oSettings._iDisplayStart = iStart;
			that.oApi._fnCalculateEnd( oSettings );
			that.fnDraw( false );
		}

		that.oApi._fnProcessingDisplay( oSettings, false );

		/* Callback user function - for event handlers etc */
		if ( typeof fnCallback == 'function' && fnCallback !== null )
		{
			fnCallback( oSettings );
		}
	}, oSettings );
};