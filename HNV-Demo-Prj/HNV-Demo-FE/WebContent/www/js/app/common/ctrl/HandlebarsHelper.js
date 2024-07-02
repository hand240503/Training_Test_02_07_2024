define([
	'jquery', 'handlebars'
	],
	function($, Handlebars) {	
	Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
		switch (operator) {
		case '==':
			return (v1 == v2) ? options.fn(this) : options.inverse(this);
		case '===':
			return (v1 === v2) ? options.fn(this) : options.inverse(this);
		case '<':
			return (v1 < v2) ? options.fn(this) : options.inverse(this);
		case '<=':
			return (v1 <= v2) ? options.fn(this) : options.inverse(this);
		case '>':
			return (v1 > v2) ? options.fn(this) : options.inverse(this);
		case '>=':
			return (v1 >= v2) ? options.fn(this) : options.inverse(this);
		case '&&':
			return (v1 && v2) ? options.fn(this) : options.inverse(this);
		case '&&!':
			return (v1 && !v2) ? options.fn(this) : options.inverse(this);
		case '||':
			return (v1 || v2) ? options.fn(this) : options.inverse(this); 
		case '||!':
			return (v1 || !v2) ? options.fn(this) : options.inverse(this); 
		default:
			return options.inverse(this);
		}
	});
	Handlebars.registerHelper('ifCondNot', function (v1, operator, v2, options) {
		switch (operator) {
		case '==':
			return !(v1 == v2) ? options.fn(this) : options.inverse(this);
		case '===':
			return !(v1 === v2) ? options.fn(this) : options.inverse(this);
		case '<':
			return !(v1 < v2) ? options.fn(this) : options.inverse(this);
		case '<=':
			return !(v1 <= v2) ? options.fn(this) : options.inverse(this);
		case '>':
			return !(v1 > v2) ? options.fn(this) : options.inverse(this);
		case '>=':
			return !(v1 >= v2) ? options.fn(this) : options.inverse(this);
		case '&&':
			return !(v1 && v2) ? options.fn(this) : options.inverse(this);
		case '||':
			return !(v1 || v2) ? options.fn(this) : options.inverse(this);            
		default:
			return options.inverse(this);
		}
	});

	Handlebars.registerHelper('divide', function (v1, v2) {
		if(v2 != 0){
			return v1/v2;
		}
	});

	Handlebars.registerHelper('select', function(value, options) {
		var $el = $('<select />').html( options.fn(this) );
		$el.find('[value="' + value + '"]').attr({'selected':'selected'});
		return $el.html();
	});


//	translate with i18n
	Handlebars.registerHelper('transl', function(...i18n_key) {
		var key	   = '';
		for (var i in i18n_key){
			if (typeof i18n_key[i] === 'object' )
				break;
			else 
				key    = key + i18n_key[i];
		}
		
		var result = $.i18n(key);   
		return new Handlebars.SafeString(result);
	});

	Handlebars.registerHelper('translIfNoGetDefault', function(i18n_key, valDefault) {
		if (!valDefault) valDefault= i18n_key;
		var result = $.i18n(i18n_key);   
		if (!result || result==i18n_key) return valDefault;
		return new Handlebars.SafeString(result);
	});

	Handlebars.registerHelper('translIf', function(v1, operator, v2, key1, key2) {
		var result = "";
		switch (operator) {
		case '==':
			result = (v1 == v2) ? $.i18n(key1) : $.i18n(key2);
			break;
		case '===':
			result = (v1 === v2) ? $.i18n(key1) : $.i18n(key2);
			break;
		case '<':
			result = (v1 < v2) ? $.i18n(key1) : $.i18n(key2);
			break;
		case '<=':
			result = (v1 <= v2) ? $.i18n(key1) : $.i18n(key2);
			break;
		case '>':
			result = (v1 > v2) ? $.i18n(key1) : $.i18n(key2);
			break;
		case '>=':
			result = (v1 >= v2) ? $.i18n(key1) : $.i18n(key2);
			break;
		case '&&':
			result = (v1 && v2) ? $.i18n(key1) : $.i18n(key2);
			break;
		case '&&!':
			result = (v1 && !v2) ? $.i18n(key1) : $.i18n(key2);
			break;
		case '||':
			result = (v1 || v2) ? $.i18n(key1) : $.i18n(key2); 
			break;
		case '||!':
			result = (v1 || !v2) ? $.i18n(key1) : $.i18n(key2);
			break;
		default:
			result = $.i18n(key1)
			break;
		}

		return new Handlebars.SafeString(result);
	});

	Handlebars.registerHelper('transl_format', function(i18n_key, param) {
		var result = $.i18n(i18n_key);  
		if (!param) param = "";
		var array = JSON.parse("[" + param + "]");
		result = req_gl_str_format (result, array)
		return new Handlebars.SafeString(result);
	});



	var req_gl_str_format = function(str, param) {
		return str.replace(/{(\d+)}/g, function(match, number) { 
			return typeof param[number] != 'undefined'? param[number]: match;
		});
	};


	Handlebars.registerHelper('ifIn', function (v1, v2, options) {
		if (!v1 || !v2) return options.inverse(this);

		if (!$.isArray(v1) && !$.isArray (v2)){
			if (v1==v2) return options.fn(this); 
		}
		if ($.isArray (v2)){
			var chk = v1;		
			if (!$.isArray(v1)) chk = [v1];
			var ok = true;
			for (var i = 0; i< chk.length; i++){
				if (v2.indexOf(chk[i])< 0) {
					ok = false;
					break;
				}
			}
			if (ok) return options.fn(this); 		
		}
		return options.inverse(this);
	});

	Handlebars.registerHelper('equal', function(val1, val2, options){
		if(val1 == val2) {
			return options.fn(this);
		}
		return options.inverse(this);
	});
	
	Handlebars.registerHelper('equalOr', function(val1, val2, val3, options){
		if(val1 == val2 || val1 == val3) {
			return options.fn(this);
		}
		return options.inverse(this);
	});
	
	Handlebars.registerHelper('equalOrs', function(val1, ...restArg){
		let options 	= restArg[restArg.length - 1];
		restArg.length 	= restArg.length - 1;
		
		return restArg.includes(val1) ? options.fn(this) : options.inverse(this);
	});

	Handlebars.registerHelper('notEqual', function(val1, val2, options){
		if(val1 != val2) {
			return options.fn(this);
		}
		return options.inverse(this);
	});

	Handlebars.registerHelper("image", function(path) {
		// Helper to put planes tails icons for each company
		var errPath = UI_URL_ROOT+ 'www/img/noImg.jpg'
		return "<img src='" + UI_URL_ROOT + path+ "' onerror='this.src = '"+errPath+"'>";
	});


	Handlebars.registerHelper("url_root", function() {
		return  UI_URL_ROOT;
	});

	Handlebars.registerHelper("url_image", function(path) {
		return  UI_URL_ROOT + path;
	});

	Handlebars.registerHelper("url_avatar", function(path) {
		return  App.path.BASE_URL_API_SERVER + path;
	});
	
	Handlebars.registerHelper("url_image_remote", function(path) {
		return  URL_DOMAIN + path;
	});

	Handlebars.registerHelper("url_image_err", function(path) {
		// Helper to put planes tails icons for each company
		var errPath = UI_URL_ROOT+ 'www/img/noImg.jpg';
		return 'this.src = "'+errPath+ '"';
	});
	
	Handlebars.registerHelper("url_image_err_1001pharmacy", function(path) {
		// Helper to put planes tails icons for each company
		var errPath = UI_URL_ROOT+ 'www/img/noImg.jpg';
		return 'this.src = "'+errPath+ '"';
	});
	
	Handlebars.registerHelper("url_image_err_agri", function(path) {
		// Helper to put planes tails icons for each company
		var errPath = UI_URL_ROOT+ 'www/img/noImg.jpg';
		return 'this.src = "'+errPath+ '"';
	});
	
	Handlebars.registerHelper("url_image_err_job", function(path) {
		// Helper to put planes tails icons for each company
		var errPath = UI_URL_ROOT+ 'www/img/logo_job.png';
		return 'this.src = "'+errPath+ '"';
	});

	Handlebars.registerHelper("url_image_err_notification", function() {
		var errPath = UI_URL_ROOT+ 'www/img/user.png';
		return 'this.src = "'+errPath+ '"';
	});

	Handlebars.registerHelper("url_image_no_avatar", function(path) {
		// Helper to put planes tails icons for each company
		var errPath = UI_URL_ROOT+ 'www/img/default_user.png';
		return 'this.src = "'+errPath+ '"';
	});

	Handlebars.registerHelper("path_image_err", function(path) {
		// Helper to put planes tails icons for each company
		var errPath = UI_URL_ROOT+ 'www/img/noImg.jpg';
		return errPath;
	});

	Handlebars.registerHelper("image_home", function(filename) {
		// Helper to put planes tails icons for each company
		//return "<img src='" + App.path.BASE_URL_IMAGE_SERVER +  App.path.BASE_URL_IMAGE_PATH+  filename+".png' />";
		var path = UI_URL_ROOT + 'www/img/pdg/icons/';
		return "<img src='"+ path  + filename+".png' style='width: 100px; height: 100px;'/>";

	});

	//Decode the string str to unescape the specials characters 
	Handlebars.registerHelper('decodeUTF8',function(str){
		try{
			if(str != null || str != undefined) {
				return decodeURIComponent(str);
			} else {
				return "";
			}
		}catch(e){
			return str;
		}
	});

	Handlebars.registerHelper('dateFormat', function(strDate, format){
		try{
			return DateFormat(strDate, format);	
		}catch(e){
			return strDate;
		}
	});

	Handlebars.registerHelper('dateFormatLocal', function(strDate){
		try{
			if(strDate) {
				var local = localStorage.language;
				if (!local) local = "en";
				var format = DateFormat.masks.enFullDate;
				if (local=="fr")
					format = DateFormat.masks.frFullDate;
				else if (local=="vn")
					format = DateFormat.masks.viFullDate;
				else if (local=="vi")
					format = DateFormat.masks.viFullDate;

				return DateFormat(strDate, format);	
			} else {
				return strDate;
			}
		}catch(e){
			return strDate;
		}
	});

	Handlebars.registerHelper('dateFormatLocalShort', function(strDate){
		try{
			if(strDate) {
				var local = localStorage.language;
				if (!local) local = "en";
				var format = DateFormat.masks.enShortDate;
				if (local=="fr")
					format = DateFormat.masks.frShortDate;
				else if (local=="vn")
					format = DateFormat.masks.viShortDate;
				else if (local=="vi")
					format = DateFormat.masks.viShortDate;

				return DateFormat(strDate, format);	
			} else {
				return strDate;
			}

		}catch(e){
			return strDate;
		}
	});

	Handlebars.registerHelper('dateFormatInputDate', function(strDate){
		try{
			if(strDate) {
				format = DateFormat.masks.dbShortDate;
				return DateFormat(strDate, format);	
			} else {
				return strDate;
			}

		}catch(e){
			return strDate;
		}
	});

	Handlebars.registerHelper('dateFormatAppoint', function(strDate){
		try{
			if(strDate) {
				let date 	= new Date(strDate.slice(0,10));

				let local = localStorage.language;

				switch(local){
				case "vn":
					return date.toLocaleDateString('vn-VN');
					break;
				case "en":
					return date.toLocaleDateString("en-US");	
					break;
				case "fr":
					return date.toLocaleDateString("fr-FR");	
					break;
				default:
					return date.toLocaleDateString("vn-VN");	
				}
			} else {
				return strDate;
			}

		}catch(e){
			return strDate;
		}
	});

	Handlebars.registerHelper('compareExpirationDate', function(strDate){
		let date 	= new Date(strDate.slice(0,10));
		let curDate = new Date();

		let comp    = Math.round((date - curDate) / 3600 / 24 / 1000);

		return comp;
	});

	Handlebars.registerHelper('hoursFormatAppoint', function(strDate){
		try{
			if(strDate) {
				return strDate.slice(11);	
			} else {
				return strDate;
			}

		}catch(e){
			return strDate;
		}
	});

	Handlebars.registerHelper('ifModulo', function (v1, v2, v3, options) {
		return (v1 % v2 == v3)? options.fn(this) : options.inverse(this);		
	});

	Handlebars.registerHelper('extractMsg', function (msg, length, options) {
		var s = msg;
		if(s && s.length>0) {
			try{
				var div = $("<div></div>");
				div.html(s);
				s = div.text();
			}catch(e){
			}
			if (s.length==0) s=msg;

			if (s.length>length){
				s = s.substring(0, length)+"...";
//				s = s.split(".-")		.join('<br/>');
//				s = s.split(". -")		.join('<br/>');
//				s = s.split(" -")		.join('<br/>');
			}
//			s = s.split("<p>")		.join('');
//			s = s.split("</p>")		.join('');
//			s = s.split("<div>")	.join('');
//			s = s.split("</div>")	.join('');
//			s = s.split("<span>")	.join('');
//			s = s.split("</span>")	.join('');
//			s = s.split("<br><br>")	.join(' ');
		}	
//		return new Handlebars.SafeString(s);
		return s;		
	});


	Handlebars.registerHelper('textNoHtmlTag', function (msg) {
		var s = msg;
		if(s && s.length>0) {
			try{
				s = $(s).text();				
			}catch(e){
			}
			if (s.length==0) s=msg;
		}	
		return s;		
	});

	Handlebars.registerHelper('textNoHtmlTagAndNumberFormat', function (msg, nbDigit) {
		var s = msg;
		if(s && s.length>0) {
			try{
				s = $(s).text();	
				if(isNaN(s)){
					s = reqStrNumber(s, nbDigit);
				}
			}catch(e){
			}
			if (s.length==0) s=msg;
		}	
		return s;		
	});

	Handlebars.registerHelper('transl_wf', function (msg, options) {
		var s = msg;

		s = s.replace(" ", "_");
		s = s.replace("%20", "_");

		s = s.toLowerCase();

		var k = $.i18n("page_ref_workflow_"+s);
		if(!k) return msg;
		else return k;

	});

	Handlebars.registerHelper('transl_billing_pos', function (type, options) {
		var s = type;

		var k = $.i18n("page_ref_billing_admin_info_type_"+s);

		if(!k) return s;
		else return k;

	});

	Handlebars.registerHelper('tpCategory',function(tpCats, cat){
		var catName = "";
		try{
			catName = tpCats[cat];
		}catch(e){
			console.log(e);
			catName = "";
		}
		return catName;

	});

	Handlebars.registerHelper('doubleFormat',function(val, format){
		var valFormated = val;
		if(val === undefined) {
			valFormated = '';
		}

		var defautFormat = "#,##0.##";
		if(format && typeof format == "string") {
			defautFormat = format;
		}

		try{
			valFormated = $.formatNumber(valFormated, {format:defautFormat, locale : localStorage.language});
		}catch(e){
			console.log(e);
			valFormated = val;
		}
		return valFormated;

	});

	Handlebars.registerHelper('stringify',function(val){
		var sval = val;
		try{
			if(val) {
				sval = JSON.stringify(val);
			}
		}catch(e){
			console.log(e);
			sval = val;
		}
		return sval;

	});

	Handlebars.registerHelper('ifInJson', function (v1, v2, options) {
		var arr = undefined;

		try {
			arr = JSON.parse(v2);
		} catch(e) {
			arr = undefined
		}

		if (arr && $.isArray (arr)){
			var chk = v1;		
			if (!$.isArray(v1)) chk = [v1];
			var ok = true;
			for (var i = 0; i< chk.length; i++){
				if (arr.indexOf(chk[i])< 0) {
					ok = false;
					break;
				}
			}
			if (ok) return options.fn(this); 		
		}
		return options.inverse(this);
	});


	Handlebars.registerHelper('reqInvUrl', function (type) {
		var url = getLaunchURL();
		var paramIndex = url.lastIndexOf('/');

		if(paramIndex > -1) {
			url = url.substring(0,paramIndex);
		}

		url += '/'+App.const.INV_URL[type];

		return url;
	});

	Handlebars.registerHelper( 'concat', function(str1, str2) {
		return str1 + str2;
	});

	Handlebars.registerHelper('calc', function(val1, operator, val2){
		var res = 0;

		switch (operator) {
		case '+':
			res = val1 + val2;
			break;
		case '-':
			res = val1 - val2;
			break;
		case '*':
			res = val1 * val2;
			break;
		case '/':
			res = val1 / val2;
			break;
		default:
			break;
		}

		return res;
	});


	Handlebars.registerHelper('calcPercent', function(val1, operator, val2){
		var res = 0;

		switch (operator) {
		case '+':
			break;
		case '-':
			break;
		case '*':
			break;
		case '/':
			res = (val1*100) / val2;
			break;
		default:
			break;
		}

		res = res.toFixed(1);
		if (res.match(/\./)) {
			res = res.replace(/\.?0+$/, '');
		}

		return res.split('').reverse().join('').replace(/(\d{3})(?=[^$|^-])/g, "$1 ").split('').reverse().join('');;;
	});


	Handlebars.registerHelper('showDataOrMissing',function(str){
		try{
			if(str != null || str != undefined) {
				return str;
			} else {
				return $.i18n("common_null_data");
			}
		}catch(e){
			return str;
		}
	});

	Handlebars.registerHelper('replaceStrOrNot',function(str, newStr){
		try{		
			if(str != null || str != undefined) {
				return str;
			} else {
				return newStr;
			}
		}catch(e){
			return str;
		}
	});

	Handlebars.registerHelper('concatStr', function (str1, str2) {
		if(str1 != null && str2 != null)
			return str1 + " " + str2;
		else if(str1 != null && str2 == null)
			return str1;
		else if(str1 == null && str2 != null)
			return str2;
		else
			return "";	
	});

	Handlebars.registerHelper('appVersion', function () {
		if (!App.version) return Math.floor(Math.random() * 100);
		return App.version;	
	});

	Handlebars.registerHelper('delTagHtml', function (msg, length, options) {
		var s = msg;
		if(s && s.length>0) {
			s = s.split("<p>")		.join('');
			s = s.split("</p>")		.join('');
			s = s.split("<div>")	.join('');
			s = s.split("</div>")	.join('');
			s = s.split("<span>")	.join('');
			s = s.split("</span>")	.join('');
			s = s.split("<br>")		.join('');
			s = s.split("<br/>")	.join('');
			s = s.split("</br>")	.join('');
			s = s.split("<b>")		.join('');
			s = s.split("</b>")		.join('');
			s = s.split("<i>")		.join('');
			s = s.split("</i>")		.join('');
			s = s.trim();

			if (s.length>length && s.length>0){
				var tmp = s;
				try{
					s = $(s).text();
				}catch(e){
				}
				if (s.length==0) s=tmp;
			}
		}	

		return s;		
	});

	Handlebars.registerHelper('url_Media_Not_Null', function (o1, o2) {
		if(o1 != null )
			return URL_DOMAIN + o1;

		if(o2!= null)
			return URL_DOMAIN + o2;

		var errPath = UI_URL_ROOT+ 'www/img/noImg.jpg';
		return errPath;

	});
	
	Handlebars.registerHelper('url_Media_Not_Null_1001Pharmacy', function (o1, o2) {
		if(o1 != null )
			return URL_DOMAIN + o1;

		if(o2!= null)
			return URL_DOMAIN + o2;

		var errPath = UI_URL_ROOT+ 'www/img/logo.png';
		return errPath;

	});
	
	Handlebars.registerHelper('url_Media_Not_Null_Agri', function (o1, o2) {
		if(o1 != null )
			return URL_DOMAIN + o1;

		if(o2!= null)
			return URL_DOMAIN + o2;

		var errPath = UI_URL_ROOT+ 'www/img/logo.png';
		return errPath;

	});
	
	Handlebars.registerHelper('url_Media_Not_Null_Job', function (e, r) {
		return null != e ? URL_DOMAIN + e : null != r ? URL_DOMAIN + r : UI_URL_ROOT + "www/img/logo_job.png";
	});


	Handlebars.registerHelper('iff', function(msg, length, options) {
		var bool = false;
		switch(operator) {
		case '==':
			bool = a == b;
			break;
		case '>':
			bool = a > b;
			break;
		case '<':
			bool = a < b;
			break;
		default:
			throw "Unknown operator " + operator;
		}

		if (bool) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});

	Handlebars.registerHelper('numberFormatLocal', function(val) {

		try{
			if (typeof val === 'string' || val instanceof String)
				val = parseFloat(val);

			return val.toLocaleString();
			//https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number/toLocaleString
		}catch(e){
			return val;
		}

	});

	Handlebars.registerHelper('dateFormatShow', function(strDate, langOpt){
		try{
			if (!langOpt) langOpt = localStorage.languageId;
			if (!langOpt) langOpt = 1;

			var newDate = new Date(strDate);
			var weekday = new Array(7);

			if (langOpt==1){
				weekday[0] = "Chủ Nhật";
				weekday[1] = "Thứ Hai";
				weekday[2] = "Thứ Ba";
				weekday[3] = "Thứ Tư";
				weekday[4] = "Thứ Năm";
				weekday[5] = "Thứ Sáu";
				weekday[6] = "Thứ Bảy";
			}else if (langOpt==2){
				weekday[0] = "Sunday";
				weekday[1] = "Monday";
				weekday[2] = "Tuesday";
				weekday[3] = "Wednesday";
				weekday[4] = "Thursday";
				weekday[5] = "Friday";
				weekday[6] = "Saturday";
			}

			var d 		= weekday[newDate.getDay()];

			var dd   	= newDate.getDate();
			var mm   	= newDate.getMonth() + 1; 
			var yyyy 	= newDate.getFullYear();

			var hours   = newDate.getHours();
			var minutes = newDate.getMinutes();
			var seconds = newDate.getSeconds();


			if (dd < 10) {
				dd = '0' + dd;
			} 
			if (mm < 10) {
				mm = '0' + mm;
			} 

			if (hours < 10) {
				hours = '0' + hours;
			}
			if (minutes < 10) {
				minutes = '0' + minutes;
			} 
			if (seconds < 10) {
				seconds = '0' + seconds;
			} 

			if (!d || !dd || !mm || !yyyy || !hours || !minutes || !seconds) return strDate;

			strDate = d + ", " + dd + '-' + mm + '-' + yyyy + " " + hours + ":" +  minutes + ":" +  seconds;
		}catch(e){

		}
		return strDate;
	});

	Handlebars.registerHelper('dateFormatShowDet', function(strDate){
		try{
			if (!langId) var langId = localStorage.languageId;
			if (!langId) var langId = 1;

			let dt1 = new Date();
			let dt2 = new Date(strDate);

			let diff =(dt1.getTime() - dt2.getTime()) / 1000;
			diff /= (60 * 60);

			if( diff >= 24){
				diff = Math.abs(Math.round(diff));

				var weekday = new Array(7);

				if (langId==1){
					weekday[0] = "Chủ Nhật";
					weekday[1] = "Thứ Hai";
					weekday[2] = "Thứ Ba";
					weekday[3] = "Thứ Tư";
					weekday[4] = "Thứ Năm";
					weekday[5] = "Thứ Sáu";
					weekday[6] = "Thứ Bảy";
				}else if (langId==2){
					weekday[0] = "Sunday";
					weekday[1] = "Monday";
					weekday[2] = "Tuesday";
					weekday[3] = "Wednesday";
					weekday[4] = "Thursday";
					weekday[5] = "Friday";
					weekday[6] = "Saturday";
				}

				var d 		= weekday[dt2.getDay()];

				var dd   	= dt2.getDate();
				var mm   	= dt2.getMonth() + 1; 
				var yyyy 	= dt2.getFullYear();

				if (dd < 10) {
					dd = '0' + dd;
				} 
				if (mm < 10) {
					mm = '0' + mm;
				} 

				if (!d || !dd || !mm || !yyyy) return strDate;

				strDate = d + ", " + dd + '/' + mm + '/' + yyyy;

			}else if(diff >= 1 && diff < 24){
				diff = Math.abs(Math.round(diff));
				if (langId==1){
					strDate = diff + " giờ trước";
				}else if (langId==2){
					strDate = diff + " hours ago";
				}
			} else if(diff < 1 && diff >=0){
				diff = diff*60;
				diff = Math.abs(Math.round(diff));

				if (langId==1){
					strDate = diff + " phút trước";
				}else if (langId==2){
					strDate = diff + " minutes ago";
				}
			}else{
				diff = Math.abs(Math.round(diff));

				var weekday = new Array(7);

				if (langId==1){
					weekday[0] = "Chủ Nhật";
					weekday[1] = "Thứ Hai";
					weekday[2] = "Thứ Ba";
					weekday[3] = "Thứ Tư";
					weekday[4] = "Thứ Năm";
					weekday[5] = "Thứ Sáu";
					weekday[6] = "Thứ Bảy";
				}else if (langId==2){
					weekday[0] = "Sunday";
					weekday[1] = "Monday";
					weekday[2] = "Tuesday";
					weekday[3] = "Wednesday";
					weekday[4] = "Thursday";
					weekday[5] = "Friday";
					weekday[6] = "Saturday";
				}

				var d 		= weekday[dt2.getDay()];

				var dd   	= dt2.getDate();
				var mm   	= dt2.getMonth() + 1; 
				var yyyy 	= dt2.getFullYear();
				
				var hours   = dt2.getHours();
				var minutes = dt2.getMinutes();


				if (dd < 10) {
					dd = '0' + dd;
				} 
				if (mm < 10) {
					mm = '0' + mm;
				} 

				if (hours < 10) {
					hours = '0' + hours;
				}
				if (minutes < 10) {
					minutes = '0' + minutes;
				} 

				if (!d || !dd || !mm || !yyyy || !hours || !minutes) return strDate;

				strDate = d + ", " + dd + '-' + mm + '-' + yyyy + " " + hours + ":" +  minutes;
			}
		}catch(e){

		}
		return strDate;
	});

	Handlebars.registerHelper('dateFormatShowDayStr', function(strDate){
		try{
			if (!langId) var langId = localStorage.languageId;
			if (!langId) var langId = 1;

			let dt = new Date(strDate);

			var weekday = new Array(7);

			if (langId==1){
				weekday[0] = "Chủ Nhật";
				weekday[1] = "Thứ Hai";
				weekday[2] = "Thứ Ba";
				weekday[3] = "Thứ Tư";
				weekday[4] = "Thứ Năm";
				weekday[5] = "Thứ Sáu";
				weekday[6] = "Thứ Bảy";
			}else if (langId==2){
				weekday[0] = "Sunday";
				weekday[1] = "Monday";
				weekday[2] = "Tuesday";
				weekday[3] = "Wednesday";
				weekday[4] = "Thursday";
				weekday[5] = "Friday";
				weekday[6] = "Saturday";
			}

			let d 		= weekday[dt.getDay()];

			if (!d) return strDate;

			strDate = d;

		}catch(e){

		}
		return strDate;
	});

	Handlebars.registerHelper('dateFormatShowDayNumber', function(strDate){
		try{
			let dt = new Date(strDate);

			let dd   	= dt.getDate();

			if (dd < 10) {
				dd = '0' + dd;
			} 

			if (!dd) return strDate;

			strDate = dd;

		}catch(e){

		}
		return strDate;
	});
	
	Handlebars.registerHelper('dateFormatShowHours', function(strDate){
		try{
			let newDate = new Date(strDate);

			var hours   = newDate.getHours();
			var minutes = newDate.getMinutes();


			if (hours < 10) {
				hours = '0' + hours;
			}
			if (minutes < 10) {
				minutes = '0' + minutes;
			} 

			if (!hours || !minutes) return strDate;

			strDate = hours + " : " +  minutes;

		}catch(e){

		}
		return strDate;
	});

	Handlebars.registerHelper('dateFormatFromTimestamp', function(time){
		if (!langId) var langId = localStorage.languageId;
		if (!langId) var langId = 1;

		if(!time || time < 1000) return;

		let date        = new Date();
		let diff        = date.getTime() - time;
		let diffNum     = 0;
		diff            /= 1000 * 60 * 60;

		const reqLangAgoFormat = (str01, str02) => {
			if(langId == 1) return " " + str01;
			if(langId == 2) {
				if(diffNum > 1) {
					return " " + str02.replace("#", "");
				}
				return " " + str02.replace("#s", "");
			}
		}

		if(diff < 1 / 60) {
			diffNum = Math.floor(diff * 60 * 60);
			return diffNum      + reqLangAgoFormat("giây trước", "second#s ago");
		} else if(diff < 1) {
			diffNum = Math.floor(diff * 60);
			return diffNum      + reqLangAgoFormat("phút trước", "minute#s ago");
		} else if(diff < 24) {
			diffNum = Math.floor(diff);
			return diffNum      + reqLangAgoFormat("giờ trước", "hour#s ago");
		} else if(diff < 24 * 30) {
			diffNum = Math.floor(diff / 24);
			return diffNum      + reqLangAgoFormat("ngày trước", "day#s ago");
		} else if(diff < 24 * 30 * 12) {
			diffNum = Math.floor(diff / 24 / 30);
			return diffNum      + reqLangAgoFormat("tháng trước", "month#s ago");
		} else {
			diffNum = Math.floor(diff / 24 / 30 / 12);
			return diffNum      + reqLangAgoFormat("năm trước", "year#s ago");
		}
	});

	Handlebars.registerHelper('Icon', function(fileName) {
//		https://www.jstips.co/en/javascript/get-file-extension/
		var ext = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2);

		var iconPath = "www/img/file/";
		var docExt   = ["doc","docx","dot","dotx"];
		var exExt  	 = ["xls","xlxs","xlsm","xltx"];
		var pptExt   = ["ppt","pptx","pot","potx"];
		var xmlExt	 = ["xml"];
		var pdfExt	 = ["pdf"];

		if(docExt.includes(ext)) return (iconPath + "word.png");
		if(exExt.includes(ext))  return (iconPath + "excel.png");
		if(pptExt.includes(ext)) return (iconPath + "ppt.png");
		if(xmlExt.includes(ext)) return (iconPath + "xml.png");
		if(pdfExt.includes(ext)) return (iconPath + "pdf.png");
		return (iconPath + "other.png")

	});


	Handlebars.registerHelper('ifLangId', function(langId, options) {
		if (App.languageId == langId)  return options.fn(this);
		return options.inverse(this);
	});

	Handlebars.registerHelper('realEstateTypeTitle', function(typ) {
		if (typeof typ === 'string' || typ instanceof String)
			typ = parseInt(typ, 10);

		var mainTyp = Math.floor(typ/1000); //0 or 1;
		var subTyp	= typ%1000; 
		if (mainTyp<10) mainTyp = "0" 	+ mainTyp; 

		if (subTyp< 10) subTyp 	= "00" 	+ subTyp; 
		else
			if (subTyp<100) subTyp 	= "0" 	+ subTyp; 

		var key 	= "area_realEstate_type_"+mainTyp+"_" + subTyp;
		var result 	= $.i18n(key);

		var txtSub  =  $.i18n("area_realEstate_type_title_" + mainTyp);
		if(mainTyp == "02") return txtSub + " " + result;
		else                return result + " " + txtSub;
	});

	Handlebars.registerHelper('realEstateTypeMain', function(typ) {
		if (typeof typ === 'string' || typ instanceof String)
			typ = parseInt(typ, 10);

		var mainTyp = Math.floor(typ/1000); //0 or 1;	
		return mainTyp;
	});

	Handlebars.registerHelper('random', function (min, max) {
		return Math.min(max, Math.floor(Math.random() * max) + min);	
	});


	Handlebars.registerHelper('realEstateObjectToString', function(obj) {
		var strObj = JSON.stringify(obj);
		return strObj;
	});


	Handlebars.registerHelper('extractMsgBlogStart', function (msg, length, options) {
		var s = msg;
		if(s && s.length>0) {
			try{
				var div = $("<div></div>");
				div.html(s);
				s = div.text();
			}catch(e){
			}
			if (s.length==0) s=msg;

			if (s.length>length){
				s = s.substring(0, length);
			}
		}	
		return s;		
	});

	Handlebars.registerHelper('extractMsgBlogEnd', function (msg, options) {
		var s = msg;
		if(s && s.length>0) {
			try{
				var div = $("<div></div>");
				div.html(s);
				s = div.text();
			}catch(e){
			}
			if (s.length==0) s=msg;

			if (s.length>0){
				s = s.substring(1, s.length);
			}
		}	
		return s;		
	});

	Handlebars.registerHelper('reqViewURL', function(viewPath, entIdorTyp, urlRef) {
		var lang = "vn";

		var lang_key 	= localStorage.getItem("language");
		if (lang_key)
			lang		= lang_key;
//		var lang_id 	= localStorage.getItem("languageId");
		
		return URL_DOMAIN + viewPath+"/"+lang+"/"+ entIdorTyp  + (!urlRef?"":"/"+urlRef);
	});

		Handlebars.registerHelper('reqViewURLOffer', function(viewPath, id, cod) {
			// var lang = "vn";
			//
			// var lang_key 	= localStorage.getItem("language");
			// if (lang_key)
			// 	lang		= lang_key;

			return URL_DOMAIN + viewPath+"?id="+ id +"&cod="+ cod;
		});
	
	const CV_STAT_ACCEPT_ALL		= 2;
	const CV_STAT_ACCEPT_RECRUITER	= 3;
	
	Handlebars.registerHelper('reqViewURLJob', function(viewPath, parId, entId, stat) {
		
		if(stat == CV_STAT_ACCEPT_RECRUITER) return "javascript:void(0)";

		var lang_key 	= localStorage.getItem("language");
		if (lang_key)
			lang		= lang_key;
//		var lang_id 	= localStorage.getItem("languageId");
		return URL_DOMAIN + viewPath +"/"+lang +"/"+ parId +"/"+ entId;
	});


	Handlebars.registerHelper("url_material", function() {
		return  UI_URL_PATH_MATERIAL;
	});

	Handlebars.registerHelper('reqViewHrefMat', function(viewPath, entId) {
		return UI_URL_PATH_MATERIAL + "/" + viewPath + (!entId? "":"?id=" + entId );
	});

	Handlebars.registerHelper('twoDigitFixed', function(number) {
		if(number != null){
			number = Number(number);
			number = number.toFixed(2);
			if (number.match(/\./)) {
				number = number.replace(/\.?0+$/, '');
			}
			return number.split('').reverse().join('').replace(/(\d{3})(?=[^$|^-])/g, "$1 ").split('').reverse().join('');;

		}else{
			return null;
		}

	});
	Handlebars.registerHelper('digitFixed', function(number, nbDigit) {
		return reqStrNumber(number, nbDigit);
	});

	var reqStrNumber = function (number, nbDigit){
		if(number != null){
			number = Number(number);
			if (!nbDigit) nbDigit = 2;
			number = number.toFixed(nbDigit);
			if (number.match(/\./)) {
				number = number.replace(/\.?0+$/, '');
			}
			return number.split('').reverse().join('').replace(/(\d{3})(?=[^$|^-])/g, "$1 ").split('').reverse().join('');;

		}else{
			return null;
		}
	}

	Handlebars.registerHelper('reqCountStar', function(nbStar) {
		if(nbStar){
			return nbStar + " " + $.i18n("mentor_eval");
		}
		return $.i18n("mentor_eval_empty");
	});
	Handlebars.registerHelper('reqEvaluation', function() {
		//hien tai, evaluation tren 5 tieu chi
		const nbCritere =  5;
		let eval = this.eval;
		if(!eval || !eval .count)	return "100%";
		let moyen = (eval.eval01 + eval.eval02+ eval.eval03+ eval.eval04+ eval.eval05)/5;

		return moyen * 20 + "%";//calculer la pourcentage de width
	});

	Handlebars.registerHelper('ifUrl', function (str,  options) {
		var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
				'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
				'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
				'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
				'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
				'(\\#[-a-z\\d_]*)?$','i'); // fragment locator

		var ok = !!pattern.test(str);			  

		if (ok) return options.fn(this); 		

		return options.inverse(this);
	});
	
	Handlebars.registerHelper("reqSizeFileUI", function(str) {
		try {
			if(!str)	return "";
			number = parseInt(str)/1000000;
			number = number.toFixed(2);
			return number + " MB";
		}catch (e) {
			return str;
		}
	});

	const typ01_img_cover 			= 4;
	Handlebars.registerHelper("reqImageCover", function(data) {
		try {
			if(data.files && data.files.length){
				let iCover = data.files.find(item => item.typ01 == typ01_img_cover);
				if(iCover) return iCover.path01;
				return `www/img/banner01.jpg`;
			}else{
				return `www/img/banner01.jpg`;
			}
		}catch (e) {
		}
	});
	
	//---------------------------------------------------------------------------------------------------
	
	Handlebars.registerHelper('forWithData', function(from, to, inc, data, block) {
		if(!data) return;
	    var accum = '';
	    for(var i = from; i < to; i += inc) {
			if(!data[i]) return accum;
		    accum += block.fn(data[i]);
	    }
	    return accum;
	});

	Handlebars.registerHelper('inc', function (index) {
		return index + 1;
	});
	
	Handlebars.registerHelper('pageLang', function (index) {
		return localStorage.language?localStorage.language: "en";
	});
	
	
	//----------------------PRJ-----------------------------------------
	const do_lc_reqRandom_number 	= (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
	// const formatDate 				= {"en": DateFormat.masks.enShortDate, "fr": DateFormat.masks.frShortDate, "vn": DateFormat.masks.viShortDate};
	const defautNumberFormat 		= "#,###.##";
	const PRJ_MEMBER_LEVEL 			= {0: "prj_project_member_level_manager", 1: "prj_project_member_level_reporter", 2: "prj_project_member_level_worker", 10: "prj_project_member_level_owner"};
	const PRJ_MEMBER_TYPE 			= {0: "prj_project_lev_bas"				, 1: "prj_project_lev_haute"};
	
	const PRJ_LEVEL 				= {1: "prj_project_lev_01"	, 2: "prj_project_lev_02"	, 3: "prj_project_lev_03"	, 4: "prj_project_lev_04"};
	const PRJ_TYPE01 				= {1: "prj_project_type_01"	, 2: "prj_project_type_02"	, 3: "prj_project_type_03"	, 4: "prj_project_type_04"};
	const PRJ_STAT 					= {0: "prj_project_stat_00"	, 1: "prj_project_stat_01"	, 2: "prj_project_stat_02"	, 3: "prj_project_stat_03", 4: "prj_project_stat_04", 5: "prj_project_stat_05", 6: "prj_project_stat_06", 7: "prj_project_stat_07"};
	
	const PR_TYP_ADD 				= 1			, PR_TYP_MOD 	= 2			, PR_TYP_DEL = 3	, PR_TYP_JOIN 		= 4		, PR_TYP_MODIFY 	= 5		, PR_TYP_OUT 		= 6			, PR_TYP_COMMENT 	= 7		, PR_TYP_MOVE 		= 9;
	const PR_TAB_CONTENT 			= "content"	, PR_TAB_MEMBER = "member"	, PR_TAB_PRJ = "prj", PR_TAB_EPIC 		= "epic", PR_TAB_TASK 		= "task", PR_TAB_COMMENT 	= "comment"	, PR_TAB_FILE 		= "file";
	
	const strTyp 					= {
			1			: "prj_dashbord_history_typ_add"	, 2			: "prj_dashbord_history_typ_mod"	, 3			: "prj_dashbord_history_typ_del"		, 4			: "prj_dashbord_history_typ_join",
			5			: "prj_dashbord_history_typ_modify"	, 6			: "prj_dashbord_history_typ_out"	, 7			: "prj_dashbord_history_typ_comment"	, 9			: "prj_dashbord_history_typ_move",
			"content"	: "prj_dashbord_history_tab_content", "member"	: "prj_dashbord_history_tab_member"	, "prj"		: "prj_dashbord_history_tab_prj"		, "epic"	: "prj_dashbord_history_tab_epic",
			"task"		: "prj_dashbord_history_tab_task"	, "comment"	: "prj_dashbord_history_tab_comment", "file"	: "prj_dashbord_history_tab_file"		, "customer": "prj_dashbord_history_tab_customer"
	}
	
	Handlebars.registerHelper("reqSrcAvatarPrj", function(prj) {
		if(!prj.avatar){
			return "www/img/prj/companies/img-" 		+ do_lc_reqRandom_number(1, 1) 	+ ".png";
		}else{
			return prj.avatar.path01;
		}
	});
	
	Handlebars.registerHelper("reqSrcAvatarPartner", function(partner) {
		if(!partner.files || !partner.files.length){
			return "www/img/prj/companies/img-" 		+ do_lc_reqRandom_number(1, 1) 	+ ".png";
		}else{
			return partner.files[0].path01;
		}
	});
	
	Handlebars.registerHelper("reqSrcAvatarMember", function(mem) {
		if(!mem.avatar){
			return "www/img/users/avatar-" 		+ do_lc_reqRandom_number(1, 1) 	+ ".jpg";
		}else{
			return mem.avatar.path01;
		}
	});
	
	Handlebars.registerHelper("reqSrcAvatarChat", function(mem) {
		if(!mem.avatar){
			return "www/img/users/avatar-" 		+ do_lc_reqRandom_number(1, 1) 	+ ".jpg";
		}else{
			return mem.avatar[0].path01;
		}
	});
	
	Handlebars.registerHelper("reqSrcAvatarUser", function(prj) {
		if(!prj.files){
			return "www/img/users/avatar-" 		+ do_lc_reqRandom_number(1, 1) 	+ ".jpg";
		}else{
			let path = "";
			try {
				path = prj.files.filter(f => f.typ01==2 && f.typ02==1)[0].path01;
			}catch(e){}
			return path;
		}
	});
	
	Handlebars.registerHelper("reqSrcAvatarUserDashbord", function(user) {
		if(user.avatar)	return user.avatar.path01;
		
		if(user.files){
			let fileAvatar = user.files.find(f => f.typ01 == 2 && f.typ02 == 1);
			if(fileAvatar)	return fileAvatar.path01;
		}
		
		return "www/img/users/avatar-" 		+ do_lc_reqRandom_number(1, 1) 	+ ".jpg";
	});
	
	Handlebars.registerHelper("reqSubStrDescrPrj", function(str) {
		if(!str)	return "";
		if(str && str.length > 25){
			return str.substr(0,25) + "...";
		}
		return str;
	});
	
	Handlebars.registerHelper("reqNameFilePrj", function(str) {
		if(!str)	return "";
		if(str && str.length > 15){
			let length = str.length;
			return "..." + str.substr(length - 15, length);
		}
		return str;
	});
	
	Handlebars.registerHelper("reqSizeFile", function(str) {
		try {
			if(!str)	return "";
			return (+str)/1000 + " MB";
		}catch (e) {
			return str;
		}
	});
	
	// Handlebars.registerHelper("reqFormatDate", function(date) {
	// 	if(!date)	return "";
	// 	let local = localStorage.language ? localStorage.language : "en";
	// 	return DateFormat(date, formatDate[local]);
	// });
	
	Handlebars.registerHelper("reqFormatNumber", function(value) {
		if(!value)	return "";
		let local = localStorage.language ? localStorage.language : "en";
		return $.formatNumber(value, {format: defautNumberFormat, local});
	});
	
	Handlebars.registerHelper("reqBudgtetReal", function(val02, val01) {
		let val = val02;
		if(!val){
			val = val01;
			if(!val)	return "";
		}
		let local = localStorage.language ? localStorage.language : "en";
		return $.formatNumber(val, {format: defautNumberFormat, local});
	});
	
	Handlebars.registerHelper("reqLevelMember", function(level) {
		if(level === undefined)	return "";
		return $.i18n(PRJ_MEMBER_LEVEL[+level]);
	});
	
	Handlebars.registerHelper("reqTypeMember", function(typ) {
		if(typ === undefined)	return "";
		return $.i18n(PRJ_MEMBER_TYPE[+typ]);
	});
	
	Handlebars.registerHelper("reqTypPrj", function(typ) {
		if(typ === undefined)	return "";
		return $.i18n(PRJ_TYPE01[+typ]);
	});
	
	Handlebars.registerHelper("reqStatPrj", function(stat) {
		if(stat === undefined)	return "";
		return $.i18n(PRJ_STAT[+stat]);
	});
	
	Handlebars.registerHelper("reqLevPrj", function(lev) {
		if(lev === undefined)	return "";
		return $.i18n(PRJ_LEVEL[+lev]);
	});
	
	Handlebars.registerHelper("reqLevColor", function(lev) {
		if(lev === undefined)	return "info";
		if(lev == 1)	return "info";
		if(lev == 2)	return "primary";
		if(lev == 3)	return "warning";
		if(lev == 4)	return "danger";
		
		return "info";
	});
	
	Handlebars.registerHelper("reqNameMember", function(str) {
		if(!str)	return "";
		if(str && str.length > 10){
			return str.substr(0, 10) + "...";
		}
		return str;
	});
	
	Handlebars.registerHelper('concat', function(str1, str2) {
		return str1 + str2;
	});
	
	Handlebars.registerHelper('reqStatColor', function(stat) {
		if(stat === 0)	return "danger";
		if(stat === 1)	return "warning";
		return "success";
	});
	
	Handlebars.registerHelper('reqContentHis', function(cmt, entID) {
		if(!cmt)	return "";
		let data 		= JSON.parse(cmt);
		
		let str 		= $.i18n("prj_dashbord_history_init");
		if(data.typ)	str += $.i18n(strTyp[data.typ]) + " ";
		if(data.typTab)	str += $.i18n(strTyp[data.typTab]) + " ";
		if(data.title)	str += "<a href='#' class='a_view_prj' data-id='" + entID + "'>" +data.title + "</a> ";
		
		if(data.typ == PR_TYP_MOVE){
			str += $.i18n("prj_dashbord_history_from") + " " + $.i18n(PRJ_STAT[data.statFrom]) + " " + $.i18n("prj_dashbord_history_to") + " " + $.i18n(PRJ_STAT[data.statTo]);
		}
		
		return str;
	});
	
	Handlebars.registerHelper('reqPercentComplete', function(val05) {
		if(!val05) return "0";
		if(val05 > 100)	return "100";
		return Math.floor(+val05);
	});
	
	Handlebars.registerHelper('reqDateLate', function(date, stat) {
		if(stat && stat == 4){
			return "<span class='badge badge-success badge-pill'>" + $.i18n(PRJ_STAT[4]) + "</span>";
		}
		if(!date)	return "";
		let diffDays 	= getDiffDay(date);
		let nbDays 		= Math.abs(diffDays);
		
		if(diffDays < 0){
			return "<span class='badge badge-danger badge-pill'>" + $.i18n("prj_project_expired_late") + nbDays + $.i18n("prj_project_expired_day")+ "</span>";
		} else {
			if(diffDays > 10){
				return "";
			}else{
				return "<span class='badge badge-warning badge-pill'>" + $.i18n("prj_project_expired_in") + nbDays + $.i18n("prj_project_expired_day") + "</span>";
			}
		}
	});
	
	Handlebars.registerHelper("reqNameCustomer", function(str) {
		if(!str)	return "";
		if(str && str.length > 20){
			return str.substr(0, 20) + "...";
		}
		return str;
	});
	
	Handlebars.registerHelper("reqSrcAvatarCustomer", function(cus) {
		if(!cus.avatar){
			return "www/img/users/avatar-" 		+ do_lc_reqRandom_number(1, 1) 	+ ".jpg";
		}else{
			return cus.avatar.path01;
		}
	});
	
	Handlebars.registerHelper('reqCodePrjNotify', function(content) {
		if(!content)	return "";
		let data 		= JSON.parse(content);
		if(data && data.title)	return data.title;
		
		return "";
	});
	
	Handlebars.registerHelper('reqIdPrjNotify', function(content) {
		if(!content)	return "";
		let data 		= JSON.parse(content);
		if(data && data.title)	return data.parID;
		
		return "";
	});
	
	Handlebars.registerHelper('reqContentNotify', function(cmt, entID) {
		if(!cmt)	return "";
		let data 		= JSON.parse(cmt);
		
		let str 		= $.i18n(data.typTab == "comment" ? "prj_dashbord_notify_init_comment": "prj_dashbord_history_init") + " ";
		
		if(data.typ)	str += $.i18n(strTyp[data.typ]) + " ";
		if(data.typTab)	str += $.i18n(strTyp[data.typTab]) + " ";
		if(data.title)	str += "<a href='#' class='a_view_prj' data-id='" + entID + "'>" +data.title + "</a> ";
		
		if(data.typ == PR_TYP_MOVE){
			str += $.i18n("prj_dashbord_history_from") + " " + $.i18n(PRJ_STAT[data.statFrom]) + " " + $.i18n("prj_dashbord_history_to") + " " + $.i18n(PRJ_STAT[data.statTo]);
		}
		
		return str;
	});
	
	Handlebars.registerHelper('reqFirstLetter', function(str) {
		if(!str)	return "A";
		
		return str.trim().substr(0,1).toUpperCase();
	});
	
	Handlebars.registerHelper('reqTypPerson', function(typ01) {
		if(!typ01)	return "";
		let objTyp = App.data.cfgValListTypePerson.find(item => item.id == typ01);
		if(objTyp)	return $.i18n(objTyp.val01);
		return "";
	});
	
	Handlebars.registerHelper('reqLegalStatus', function(cfgVal02, typ01) {
		let listLegalStatus   = App.data.cfgValListTypeLegalStatM;
		if(typ01 && typ01 == 1000002){
			listLegalStatus = App.data.cfgValListTypeLegalStatN;
		}
		
		
		if(!typ01)	return "";
		let objTyp = listLegalStatus.find(item => item.id == cfgVal02);
		if(objTyp)	return $.i18n(objTyp.val01);
		return "";
	});
	
	Handlebars.registerHelper('reqTypPartner', function(typ02) {
		if(!typ02)	return "";
		let objTyp = App.data.cfgValListTypePartner.find(item => item.id == typ02);
		if(objTyp)	return $.i18n(objTyp.val01);
		return "";
	});
	
	Handlebars.registerHelper('reqTypDomain', function(cfgVal01) {
		if(!cfgVal01)	return "";
		let objTyp = App.data.cfgValListTypeDomainPartner.find(item => item.id == cfgVal01);
		if(objTyp)	return $.i18n(objTyp.val01);
		return "";
	});
	
	var STAT_PARTNER = {
			0: "per_partner_stat_00",	1: "per_partner_stat_01",	2: "per_partner_stat_02",
			3: "per_partner_stat_03",	10: "per_partner_stat_10",	11: "per_partner_stat_11",	100: "per_partner_stat_null"
		}
	
	Handlebars.registerHelper('reqStatPartner', function(stat) {
		if(!stat)				return $.i18n(STAT_PARTNER[100]);
		if(!STAT_PARTNER[stat])	return $.i18n(STAT_PARTNER[100]);
		
		return $.i18n(STAT_PARTNER[stat]);
	});
	
	Handlebars.registerHelper('reqStatBadgePartner', function(stat) {
		if(stat == 11)	return "badge-danger";
		if(stat == 3)	return "badge-success";
		return "badge-info";
	});
	
	Handlebars.registerHelper('cutStrInfo', function(str) {
		if(!str)	return "";
		if(str.length < 100)	return str;
		return str.substr(0, 100) + "...";
	});
	
	const TYP_USER = {
			2: "aut_user_ent_header_type_adm"	,	3: "aut_user_ent_header_type_agent"	,	5: "aut_user_ent_header_type_member",
			6: "aut_user_ent_header_type_mentor",	8: "aut_user_ent_header_type_shipper"
	}
	Handlebars.registerHelper('reqTypUser', function(typ) {
		if(!typ)				return $.i18n(TYP_USER[3]);
		if(!TYP_USER[typ])		return $.i18n(TYP_USER[3]);
		
		return $.i18n(TYP_USER[typ]);
	});
	
	Handlebars.registerHelper('reqTypBadgeUser', function(typ) {
		if(typ == 2)	return "badge-danger";
		if(typ == 6)	return "badge-success";
		return "badge-info";
	});
	
	Handlebars.registerHelper('reqPositionUser', function(pos) {
		if(!pos)	return $.i18n("prj_dashbord_tab_user_info_no_pos");
		
		return pos.reduce((name, item) => name + " /" + $.i18n("prj_dashbord_tab_user_info_" + item.code.toLowerCase()), "")
	});
	
	const SOCIAL_NETWORK = {
		"fb": {label: "Facebook", bgColor: "primary"}, "tw": {label: "Twitter", bgColor: "info"}, "ln": {label: "LinkedIn", bgColor: "info"}, "gg": {label: "Google", bgColor: "danger"}, "ig": {label: "Instagram", bgColor: "pink"}
	}
	
	Handlebars.registerHelper('reqNameSocialNetwork', function(code) {
		if(!code)					return "";
		if(!SOCIAL_NETWORK[code])	return "";
		return SOCIAL_NETWORK[code].label;
	});
	
	Handlebars.registerHelper('reqIconSocialNetwork', function(code) {
		if(!code)					return "";
		if(!SOCIAL_NETWORK[code])	return "";
		return SOCIAL_NETWORK[code].label.toLowerCase();
	});
	
	Handlebars.registerHelper('reqBgColorSocialNetwork', function(code) {
		if(!code)					return "primary";
		if(!SOCIAL_NETWORK[code])	return "primary";
		return SOCIAL_NETWORK[code].bgColor;
	});
	
	const PR_ICON_FOLDER = {
			"INBOX"		: "mdi-email-outline"		, "Sent": "mdi-email-check-outline"	, "Trash"			: "mdi-trash-can-outline"	, "[Gmail]"	: "mdi-gmail",
			"Corbeille"	: "mdi-trash-can-outline"	, "Spam": "mdi-bacteria-outline"	, "Objets envoyés"	: "mdi-email-check-outline" , "Brouillons": "mdi-file-outline",
			"Archives"	: "mdi-bag-personal-outline"
	}
	
	Handlebars.registerHelper('reqIconFolderMail', function(folder) {
		return PR_ICON_FOLDER[folder];
	});
	
	const PR_LANGUAGE_FOLDER = {
			"INBOX"		: "prj_email_folder_inbox", "Sent": "prj_email_folder_sent", "Trash"			: "prj_email_folder_trash", "[Gmail]"	: "prj_email_folder_gmail",
			"Corbeille"	: "prj_email_folder_trash", "Spam": "prj_email_folder_spam", "Objets envoyés"	: "prj_email_folder_sent" , "Brouillons": "prj_email_folder_draft",
			"Archives"	: "prj_email_folder_archive"
	}
	
	Handlebars.registerHelper('reqNameFolderMail', function(name) {
		return $.i18n(PR_LANGUAGE_FOLDER[name]);
	});
	
	Handlebars.registerHelper('reqDestinationMail', function(folder, from, to) {
		if(["Brouillons", "Sent", "Objets envoyés"].includes(folder))	return to;
		return from;
	});
	
	Handlebars.registerHelper('reqNameEmail', function(name) {
		if(!name)		return "";
		let begin = name.indexOf("<");
		if(begin < 0)	return name;
		
		return name.slice(0, begin);
	});
	
	Handlebars.registerHelper('reqEmailEmail', function(name) {
		if(!name)		return "";
		let begin 	= name.indexOf("<");
		if(begin < 0)	return "";
		let end 	= name.indexOf(">");
		return name.slice(begin + 1, end);
	});
	
	Handlebars.registerHelper('cutStrName', function(str) {
		if(!str)	return "";
		if(str.length < 15)	return str;
		return str.substr(0, 12) + "...";
	});
	
	//------------------------------------------------------------------------
	Handlebars.registerHelper("url_root", function() {
		return  UI_URL_ROOT;
	});

	Handlebars.registerHelper("url_image", function(path) {
		return  UI_URL_ROOT + path;
	});
	
	Handlebars.registerHelper("url_image_remote", function(path) {
		return  URL_DOMAIN + path;
	});
	
	Handlebars.registerHelper("url_image_err", function(path) {
		// Helper to put planes tails icons for each company
		var errPath = UI_URL_ROOT+ 'www/img/noImg.jpg'
		return 'this.src = "'+errPath+ '"';
	});

	Handlebars.registerHelper("url_image_no_avatar", function(path) {
		// Helper to put planes tails icons for each company
		var errPath = UI_URL_ROOT+ 'www/img/default_user.png'
		return 'this.src = "'+errPath+ '"';
	});

	Handlebars.registerHelper("path_image_err", function(path) {
		// Helper to put planes tails icons for each company
		var errPath = UI_URL_ROOT+ 'www/img/noImg.jpg'
		return errPath;
	});
	Handlebars.registerHelper('for', function(from, to, incr, block) {
	    var accum = '';
	    for(var i = from; i < to; i += incr)
	        accum += block.fn(i);
	    return accum;
	});
});