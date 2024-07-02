var do_gl_load_JSController_ByRequireJS = function(AppVar, ctrConfig){
	if (!ctrConfig	) return;
	if (!AppVar		) AppVar = {};
	/*
	 AppVar 	= App.controller;
	 ctrConfig 	= {path: "////", nameGroup: "List", name : "Area", initParams: [....], fShow: name, fShowParams : [], fCallBack: function(){},}
	 	nameGroup/grpName		: ten cua cac phan lon': area, plan, post, material...
		name/ctrlName			: ten cua controller: list, main, tab...
		path/ctrlPath			: duong dan cua controller
		initParams/ctrlParams	: cac bien khoi tao cua controller
		fInit 			: ten ham se goi sau khi controller duoc khoi tao
		fInitParams 	: bien cua ham khoi tao
		fShow 			: ten ham se goi sau khi controller duoc khoi tao
		fShowParams 	: bien cua ham khoi tao
		fCallBack 		: nhung ham se thuc hien sau cung
		fCallBackParams : bien cua ham callback
	 */
	try{
//		let {nameGroup, name, path, initParams, fInit, fInitParams, fShow, fShowParams, fCallBack, fCallBackParams} = ctrConfig;
//		cách khai báo trên phải truyền đủ, không là sai
		
		let nameGroup		= ctrConfig.nameGroup		? ctrConfig.nameGroup		: ctrConfig.grpName; 
		let name			= ctrConfig.name	 		? ctrConfig.name	 		: ctrConfig.ctrlName;
		let path			= ctrConfig.path	 		? ctrConfig.path	 		: ctrConfig.ctrlPath;
		let initParams 		= ctrConfig.initParams		? ctrConfig.initParams		: ctrConfig.ctrlParams;
		let fCallBackParams = ctrConfig.fCallBackParams ? ctrConfig.fCallBackParams	: [];
		let fInit 			= ctrConfig.fInit;
		let fInitParams 	= ctrConfig.fInitParams;
		let fShow 			= ctrConfig.fShow;
		let fShowParams 	= ctrConfig.fShowParams;
		let fCallBack 		= ctrConfig.fCallBack;
		
		requirejs([path], function(ctrl){			
			if (!AppVar	[nameGroup])
				AppVar	[nameGroup] = {};
			
			if (!initParams)
				initParams		= [];
			
			if (!AppVar	[nameGroup][name])	
				AppVar	[nameGroup][name]		= new ctrl(...initParams);

			if (!fInitParams)		fInitParams		=  [];
			if (!fShowParams)		fShowParams		=  [];
						
			if (fInit		) 	AppVar[nameGroup][name][fInit](...fInitParams);
			if (fShow		) 	AppVar[nameGroup][name][fShow](...fShowParams);
			
			if (!fCallBackParams)	fCallBackParams	=  [];
			if (fCallBack	)	fCallBack(...fCallBackParams);
		})
	}catch(e){
		console.log("do_gl_load_JSController_ByRequireJS:"+ e);
	}	
}

//------function load a js controller
function do_gl_load_JSController(require, ctrPath, grpName, ctrName, newParam01, newParam02, newParam03 ){
	var ctrClass  =  require(ctrPath);
	if (!ctrClass  ){	
		ctrClass  =  require(ctrPath);
	}
	if (!ctrClass  ){	
		ctrClass  =  require(ctrPath);
	}
	if (!ctrClass  ){	
		ctrClass  =  require(ctrPath);
	}
	if (!ctrClass  ){	
		ctrClass  =  require(ctrPath);
	}
	if (!ctrClass  ){	
		console.log("--cannot load "+ctrPath);
		setTimeout(function(param) {
			window.location.reload();
		}, 200);					
		return;
	}
	App.controller[grpName][ctrName]  = new ctrClass(newParam01, newParam02, newParam03);
	App.controller[grpName][ctrName].do_lc_init();
}

//--------------------------------------
function do_gl_sortByKeyIntegerAsc(array, key) {
	return array.sort(function (a, b) {
		var x = parseInt(a[key],10); 
		var y = parseInt(b[key],10);
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});
}
//----------------------------------------------------
var do_gl_show_HeaderSlider= function( timewait, divSlide, slides, slideIndex) {
	if (!timewait)					timewait = 3000;

	if (!slides){
		slides =$(divSlide);
		for (var i = 0; i < slides.length; i++) {
			slides[i].style.display = "none";  
		}
	}

	if (!slides)					return;
	if (slides.length==0)			return;

	if (!slideIndex) 				slideIndex = 1;
	if (slideIndex>slides.length) 	slideIndex = 1;



//	slides[slideIndex-1].style.display = "block";  
	$(slides[slideIndex-1]).fadeIn(1000);

	if (slides.length>1){
		setTimeout(function(){
			$(slides[slideIndex-1]).fadeOut(1000);
			slideIndex++;
			do_gl_show_HeaderSlider (timewait, divSlide, slides, slideIndex);  
		}, timewait);// Change image every 3,5 seconds
	}
}

//----------------------------------------------------
//Returns a function, that, as long as it continues to be invoked, will not
//be triggered. The function will be called after it stops being called for
//N milliseconds. If `immediate` is passed, trigger the function on the
//leading edge, instead of the trailing.
var var_gl_timeout;
const do_gl_execute_debounce = (func, wait = 500, params = []) => {
	clearTimeout(var_gl_timeout);
	var_gl_timeout = setTimeout(func, wait, ...params);
};

//----------------------------------------------------
function do_gl_integrated_editor_unique(inp, options = {}){
	let defaultOptions = {
			height		: 400,
			minHeight	: null,
			maxHeight	: null,
			focus		: true, 
			callbacks: {
				onImageUpload: function(files) {
					(files && files.length) && do_lc_up_file(this, files);	
				},
				onImageLinkInsert: function(url) {
					$img = $('<img>').attr({ src: url })
					$(this).summernote('insertNode', $img[0]);
				}
			}
	}

	if(options){
		options = Object.assign(options, defaultOptions);
	}

	$(inp).summernote(options);
}

//thêm editor summernote cho textarea
function do_gl_integrated_editor(div, options = {}){
	let defaultOptions = {
			height		: 100,
			minHeight	: null,
			maxHeight	: null,
			focus		: true, 
			callbacks: {
				onImageUpload: function(files) {
					(files && files.length) && do_lc_up_file(this, files);	
				},
				onImageLinkInsert: function(url) {
					$img = $('<img>').attr({ src: url })
					$(this).summernote('insertNode', $img[0]);
				}
			}
	}

	if(options){
		options = Object.assign(options, defaultOptions);
	}

	$(div).find("textarea").summernote(options);
}

function do_lc_up_file(divSummernote, files){
	let ref = new FormData();
	ref.append('sv_class'	, 'ServiceTpyDocument');
	ref.append('sv_name'	, 'SVTpyDocumentNewPublic');
	ref.append('typ01'		, 1);
	ref.append('typ02'		, 1);
	for(let i in files){
		ref.append(`file${i}`, files[i]);
	}

	let fSucces 	= [];
	fSucces.push(req_gl_funct(null, do_lc_after_upload_file, [divSummernote]));

	let fError 	= req_gl_funct(null, do_lc_upload_error, [$.i18n("common_err_ajax") ]);
	App.network.do_lc_ajax_form(App.path.BASE_URL_API_UPLOAD, App.data.user.headerURLSecu, ref, 100000, fSucces, fError);
}

function do_lc_after_upload_file(sharedJson, divSummernote){
	if (isAjaxSuccess(sharedJson)) {
		let data = sharedJson[App['const'].RES_DATA];
		if(data && data.length){
			for(let img of data){
				let $img = document.createElement("IMG");
				$img.src = img.path01;
				$(divSummernote).summernote('insertNode', $img);
			}
		}
	} else {
		do_gl_show_Notify_Msg_Error ($.i18n("common_err_ajax"));	
	}
}

function do_lc_upload_error(sharedJson, msg){
	do_gl_show_Notify_Msg_Error (msg);	
}

//----------------------------------------------------
//Lấy vị trí scroll hiện tại của phần tử, mặc định là phần tử window
const getScrollPosition = (el = window) => ({
	x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
			y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop
});

//scroll mượt hơn khi lên đầu trang
const scrollToTop = () => {
	const c = document.documentElement.scrollTop || document.body.scrollTop;
	if (c > 0) {
		window.requestAnimationFrame(scrollToTop);
		window.scrollTo(0, c - c / 8);
	}
};

//kiểm tra phần tử có nằm trong viewport hay không, nằm toàn bộ hay 1 phần
const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
	const { top, left, bottom, right } 	= el.getBoundingClientRect();
	const { innerHeight, innerWidth } 	= window;
	return partiallyVisible
	? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) &&
			((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
			: top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};

//kiểm tra thiết bị hiện tại là mobile hay PC/DESKTOP
const detectDeviceType = () =>
/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
? 'Mobile'
		: 'Desktop';

//Trích xuất toàn bộ parameter của url
const getURLParameters = url =>
(url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
		(a, v) => ((a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a),
		{}
);

//xóa các object trùng lặp trong một mảng
const removeDupplicateObjectInArray = (list) =>
list.filter((item, index) => {
	const _item = JSON.stringify(item);
	return (
			index ===
				list.findIndex((obj) => {
					return JSON.stringify(obj) === _item;
				}))
})

//Smooth scroll tới 1 phần tử nào đó
const smoothScroll = (element) =>
document.querySelector(element).scrollIntoView({ behavior: "smooth" });

//encode String
const encodeStr = (encodeStr) => {
	try {
		encodeStr = encodeStr.toString().toLowerCase().trim();
		encodeStr = encodeStr.replace(
				/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,
				"a"
		);
		encodeStr = encodeStr.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ.+/g, "e");
		encodeStr = encodeStr.replace(/ì|í|ị|ỉ|ĩ/g, "i");
		encodeStr = encodeStr.replace(
				/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ.+/g,
				"o"
		);
		encodeStr = encodeStr.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
		encodeStr = encodeStr.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
		encodeStr = encodeStr.replace(/đ/g, "d");

		encodeStr = encodeStr.replace(/[^\w\s]/gi, "");
		encodeStr = encodeStr.replace(/\(|\)|\:/g, "");
		encodeStr = encodeStr.replace(/\//g, "-");
		encodeStr = encodeStr.replace(/^\-+|\-+$/g, "");
		encodeStr = encodeStr.replace(/ /g, "-");
		encodeStr = encodeStr.replace(/-+-/g, "-");

		return encodeStr;
	} catch (err) {
		return "";
	}
};

//Tim số ngày chênh lệch giữa 2 ngày
const getDiffDay = (dateFrom, dateTo = new Date()) => {
	let dateF 		= new Date(dateFrom);
	let dateT 		= new Date(dateTo);
	let diffTime 	= dateF - dateT;
	let diffDays 	= Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

	return diffDays;
}

//tạo 1 data Send ajax với nhiều object params
const req_gl_Request_Content_Send_With_Params = (serviceClass, serviceName, ...params) => {
	const {SV_CLASS: svClass, SV_NAME: svName, SESS_ID: sessId, USER_ID: userId} = App['const'];

	let ref = {
			[svClass]	: serviceClass, 
			[svName]	: serviceName, 
			[sessId]	: App.data.session_id,
			[userId]	: App.data.user ? App.data.user.id : -1
	};

	if(params && params.length){
		ref = Object.assign(ref, ...params);
	}

	return ref;
}

//call ajax success
const isAjaxSuccess = (sharedJson) => sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES;

const isAjaxAllSuccess = sharedJsons => {
	for(let sharedJson of sharedJsons){
		if(!isAjaxSuccess(sharedJson))	return false;
	}

	return true;
}

//get lat long of addresse with google map, return promise
const getLocation_addr = address => {
	return new Promise((resolve, reject) => {
		let geocoder = new google.maps.Geocoder();
		geocoder.geocode({address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK && results.length) {
				let {location} 	= results[0].geometry;
				let lat 		= parseFloat((location.lat()).toFixed(5));
				let lng 		= parseFloat((location.lng()).toFixed(5));

				resolve({lat, lng});
			} else{
				reject(status);
			}
		});
	})
}

//format number ##.###,##
const addCommas = nStr =>{
	nStr 	+= '';
	x 		= nStr.split('.');
	x1 		= x[0];
	x2 		= x.length > 1 ? '.' + x[1] : '';
	let rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 	= x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

//add TreeView.
$.fn.extend({
	treed: function (o) {

		let openedClass = 'mdi-chevron-down-box';
		let closedClass = 'mdi-chevron-right-box';

		if (typeof o != 'undefined'){
			if (typeof o.openedClass != 'undefined'){
				openedClass = o.openedClass;
			}
			if (typeof o.closedClass != 'undefined'){
				closedClass = o.closedClass;
			}
		};

		//initialize each of the top levels
		let tree = $(this);
		tree.addClass("tree");
		tree.find('li').has("ul").each(function () {
			var branch = $(this); //li with children ul
			branch.prepend("<i class='font-size-17 text-info indicator mdi " + closedClass + "'></i>");
			branch.addClass('branch');
			branch.not("span").on('click', function (e) {
				if (this == e.target) {
					var icon = $(this).children('i:first');
					icon.toggleClass(openedClass + " " + closedClass);
					$(this).find("ul:first").children().toggle();
				}
			})
			branch.find("ul:first").children().toggle();
		});
		//fire event from the dynamically added icon
		tree.find('.branch .indicator').each(function(){
			$(this).on('click', function () {
				$(this).closest('li').click();
			});
		});
		//fire event to open branch if the li contains an anchor instead of text
		tree.find('.branch>a').each(function () {
			$(this).on('click', function (e) {
				$(this).closest('li').click();
				e.preventDefault();
			});
		});
		//fire event to open branch if the li contains a button instead of text
		tree.find('.branch>button').each(function () {
			$(this).on('click', function (e) {
				$(this).closest('li').click();
				e.preventDefault();
			});
		});
	}
});

const pr_CODE_CURRENCY = {150001: "VND", 150002: "EUR", 150003: "USD", 150004: "GBP", 150005: "JPY", 150006: "CNY"};
const pr_LOCAL_COUNTRY = {"en": "en-US"	, "fr": "fr-FR"	, "vn": "vi-VN"};
const getFormatCurrency = (value, type) => {
	let local = localStorage.language ? localStorage.language : "en";
	
	return new Intl.NumberFormat(pr_LOCAL_COUNTRY[local], {
		  style		: 'currency',
		  currency	: pr_CODE_CURRENCY[Math.floor(type)],
		}).format(value);
}


var req_gl_Ent_By_Id_From_Arr = function(id, arr) {
	var ent	= arr.find(o => o.id === id);
	return ent;
}

var req_gl_numberFormat = function(num, decimal) {
	
	if (!num) return num;
	if (!decimal) decimal=0;
	return num.toFixed(decimal).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}