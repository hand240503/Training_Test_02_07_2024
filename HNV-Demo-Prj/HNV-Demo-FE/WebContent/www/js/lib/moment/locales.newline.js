;(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined'
		&& typeof require === 'function' ? factory(require('../moment')) :
			typeof define === 'function' && define.amd ? define(['../moment'], factory) :
				factory(global.moment)
}(this, (function (moment) { 'use strict';

//! moment.js locale configuration
moment.defineLocale('vi', {
    months : 'Tháng 1_Tháng 2_Tháng 3_Tháng 4_Tháng 5_Tháng 6_Tháng 7_Tháng 8_Tháng 9_Tháng 10_Tháng 11_Tháng 12'.split('_'),
    monthsShort : 'Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12'.split('_'),
    monthsParseExact : true,
    weekdays : 'chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy'.split('_'),
    weekdaysShort : 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
    weekdaysMin : 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
    weekdaysParseExact : true,
    meridiemParse: /sa|ch/i,
    isPM : function (input) {
        return /^ch$/i.test(input);
    },
    meridiem : function (hours, minutes, isLower) {
        if (hours < 12) {
            return isLower ? 'sa' : 'SA';
        } else {
            return isLower ? 'ch' : 'CH';
        }
    },
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM [năm] YYYY',
        LLL : 'D MMMM [năm] YYYY HH:mm',
        LLLL : 'dddd, D MMMM [năm] YYYY HH:mm',
        l : 'DD/M/YYYY',
        ll : 'D MMM YYYY',
        lll : 'D MMM YYYY HH:mm',
        llll : 'ddd, D MMM YYYY HH:mm'
    },
    calendar : {
        sameDay: '[Hôm nay lúc] LT',
        nextDay: '[Ngày mai lúc] LT',
        nextWeek: 'dddd [tuần tới lúc] LT',
        lastDay: '[Hôm qua lúc] LT',
        lastWeek: 'dddd [tuần rồi lúc] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : '%s tới',
        past : '%s trước',
        s : 'vài giây',
        ss : '%d giây' ,
        m : 'một phút',
        mm : '%d phút',
        h : 'một giờ',
        hh : '%d giờ',
        d : 'một ngày',
        dd : '%d ngày',
        M : 'một tháng',
        MM : '%d tháng',
        y : 'một năm',
        yy : '%d năm'
    },
    dayOfMonthOrdinalParse: /\d{1,2}/,
    ordinal : function (number) {
        return number;
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});
moment.defineLocale('en', {
	months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
	monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
	weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
	weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
	weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
	longDateFormat : {
		LT : 'HH:mm',
		LTS : 'HH:mm:ss',
		L : 'DD/MM/YYYY',
		LL : 'D MMMM YYYY',
		LLL : 'D MMMM YYYY HH:mm',
		LLLL : 'dddd, D MMMM YYYY HH:mm'
	},
	calendar : {
		sameDay : '[Today at] LT',
		nextDay : '[Tomorrow at] LT',
		nextWeek : 'dddd [at] LT',
		lastDay : '[Yesterday at] LT',
		lastWeek : '[Last] dddd [at] LT',
		sameElse : 'L'
	},
	relativeTime : {
		future : 'in %s',
		past : '%s ago',
		s : 'a few seconds',
		ss : '%d seconds',
		m : 'a minute',
		mm : '%d minutes',
		h : 'an hour',
		hh : '%d hours',
		d : 'a day',
		dd : '%d days',
		M : 'a month',
		MM : '%d months',
		y : 'a year',
		yy : '%d years'
	},
	dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
	ordinal : function (number) {
		var b = number % 10,
		output = (~~(number % 100 / 10) === 1) ? 'th' :
			(b === 1) ? 'st' :
				(b === 2) ? 'nd' :
					(b === 3) ? 'rd' : 'th';
		return number + output;
	},
	week : {
		dow : 1, // Monday is the first day of the week.
		doy : 4  // The week that contains Jan 4th is the first week of the year.
	}
});

moment.defineLocale('fr', {
    months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
    monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
    monthsParseExact : true,
    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
    weekdaysMin : 'di_lu_ma_me_je_ve_sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Aujourd’hui à] LT',
        nextDay : '[Demain à] LT',
        nextWeek : 'dddd [à] LT',
        lastDay : '[Hier à] LT',
        lastWeek : 'dddd [dernier à] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'dans %s',
        past : 'il y a %s',
        s : 'quelques secondes',
        ss : '%d secondes',
        m : 'une minute',
        mm : '%d minutes',
        h : 'une heure',
        hh : '%d heures',
        d : 'un jour',
        dd : '%d jours',
        M : 'un mois',
        MM : '%d mois',
        y : 'un an',
        yy : '%d ans'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(er|)/,
    ordinal : function (number, period) {
        switch (period) {
            // TODO: Return 'e' when day of month > 1. Move this case inside
            // block for masculine words below.
            // See https://github.com/moment/moment/issues/3375
            case 'D':
                return number + (number === 1 ? 'er' : '');

            // Words with masculine grammatical gender: mois, trimestre, jour
            default:
            case 'M':
            case 'Q':
            case 'DDD':
            case 'd':
                return number + (number === 1 ? 'er' : 'e');

            // Words with feminine grammatical gender: semaine
            case 'w':
            case 'W':
                return number + (number === 1 ? 're' : 'e');
        }
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});
moment.locale('en');

return moment;

})));
