define([
	'jquery',

	'text!group/aut/user/tmpl/Ent_Header_Time_View.html',
	'text!group/aut/user/tmpl/Ent_Header_Time_New.html',
	'text!group/aut/user/tmpl/Ent_Header_Time_Show.html',

	'daypilot'
	], function($,

		Tmpl_Ent_Header_Time_View, 
		Tmpl_Ent_Header_Time_New,
		Tmpl_Ent_Header_Time_Show
	){

	var EntHeaderTimeList = function (header, content, footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;
		var pr_grpName 				= grpName;

		const tmplName				= App.template.names[pr_grpName];
		const tmplContr				= App.template.controller;
		//------------------------------------------------------------------------------------
		const pr_SERVICE_CLASS		= "ServicePrjProject"; //to change by your need
		const pr_SERVICE_CLASS_DYN	= "ServicePrjProjectDyn"; //to change by your need
		const pr_SV_LIST_DYN			= "SVPrjProjectLst";
		const pr_SV_SAVE_MOVE		= "SVPrjProjectTaskMove";

		const pr_SERVICE_PER_CLASS	= "ServicePersonDyn";

		const pr_SV_USER_SEARCH		= "SVUserLstSearchWithAvatar";
		const pr_SV_GET_MEMBER		= "SVSorOrderEntHeaderTimeGetMem";
		//-----------------------------------------------------------------------------------
		var pr_ctr_Main 					= null;
		var pr_ctr_EntHeader 				= null;
		var pr_ctr_EntHeaderTimeMain 			= null;
		
		var pr_SEARCHKEY					= "";
		var pr_GROUP						= null;

		var pr_obj							= null;
		var pr_mode							= null;
		var pr_lstAvailableTime				=	[];

		var TIME_RANGE						= 3;
		var TYP_01_APPOINTMENT				= 20001;
		var TYP_02_APPOINTMENT				= 1000;
		
		const STAT_APPOINTMENT_DESACTIVE    = 2;

		var members 						= {};
//		var membersDel 						= [];
		let files							= {files: []};
		var customers 						= [];
		var customersAdd 				    = [];
		var customersDel                    = [];

		var dayStart						= "2023/07/09";
		var dayEnd							= null;
		var dayGap							= null;
		var dp_schedule						= null;
		var locale							= "vi-vi";
		
		const pr_member_lev_manager 		= 0;
		const pr_member_lev_reporter 		= 1;
		const pr_member_lev_worker 			= 2;
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init	= function(){
			pr_ctr_Main 					= App.controller[pr_grpName].Main;
			pr_ctr_EntHeader				= App.controller[pr_grpName].EntHeader;
			pr_ctr_EntHeaderTimeMain 		= App.controller[pr_grpName].EntHeaderTimeMain;

			tmplName.ENT_HEADER_TIME_VIEW				= 	"Tmpl_Ent_Header_Time_View";
			tmplName.ENT_HEADER_TIME_NEW				= 	"Tmpl_Ent_Header_Time_New";
			tmplName.ENT_HEADER_TIME_SHOW				= 	"Tmpl_Ent_Header_Time_Show";
		}

		//---------show-----------------------------------------------------------------------------
		this.do_lc_show = function(obj, mode){
			pr_obj = obj;
			try{
				do_lc_load_view();
				do_register_locale_custom();
				do_build_schedulue();
				do_show_list_FreeTimes();
				// do_lc_bind_eventPage();
				do_lc_bind_save_FreeTimes();
			}catch(e) {	
				console.log(e);			
				do_gl_exception_send(App.path.BASE_URL_API_PRIV, pr_ctr_Main.var_lc_URL_Header, App.network, "prj.project", "EntHeaderTimeList", "do_lc_show", e.toString()) ;
			}
		};

		const do_lc_load_view = () => {
			tmplContr.do_lc_put_tmpl(tmplName.ENT_HEADER_TIME_VIEW, Tmpl_Ent_Header_Time_View);
			tmplContr.do_lc_put_tmpl(tmplName.ENT_HEADER_TIME_NEW, Tmpl_Ent_Header_Time_New);
			tmplContr.do_lc_put_tmpl(tmplName.ENT_HEADER_TIME_SHOW, Tmpl_Ent_Header_Time_Show);

			$(pr_divContent).html(tmplContr.req_lc_compile_tmpl(tmplName.ENT_HEADER_TIME_VIEW, {}));
		}

		//-------------------------------------------------------------------------------------------------
		var do_register_locale_custom = function () {
			DayPilot.Locale.register(
				new DayPilot.Locale("vi-vi", 
				{
				  dayNames: ['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'],
				  dayNamesShort: ['CN','T2','T3','T4','T5','T6','T7'],
				  monthNames: ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'],
				  monthNamesShort: ['Thg 1','Thg 2','Thg 3','Thg 4','Thg 5','Thg 6','Thg 7','Thg 8','Thg 9','Thg 10','Thg 11','Thg 12'],
				  timePattern: 'h:mm tt',
				  datePattern: 'M/d/yyyy',
				  dateTimePattern: 'M/d/yyyy h:mm tt',
				  timeFormat: 'Clock12Hours',
				  weekStarts: 0
				}
			));
			let tmp = localStorage.getItem("language");
			if (tmp == "en") locale = "en-us";
			else locale = tmp + "-" + tmp;
		}

		var do_build_schedulue = function(pr_lstAvailableTime) {
		    dp_schedule 							= new DayPilot.Calendar("dp_schedule");
			dp_schedule.eventClickHandling 			= "Select";
			dp_schedule.allowMultiSelect 			= false;
			dp_schedule.allowEventOverlap 			= false;
			dp_schedule.durationBarVisible 			= true;
			dp_schedule.eventMoveHandling 			= "Disabled";
			dp_schedule.eventResizeHandling 		= "Disabled";
			dp_schedule.timeRangeSelectedHandling 	= "Enable";
			dp_schedule.headerDateFormat 			= "dddd";
			dp_schedule.timeFormat 					= "Clock24Hours";
			dp_schedule.heightSpec 					= "Fixed";
			dp_schedule.height 						= 400;
			dp_schedule.startDate 					= new DayPilot.Date(dayStart);
			dp_schedule.dayBeginsHour 				= 6;
			dp_schedule.dayEndsHour 				= 21;
			dp_schedule.viewType 					= "Week";
			dp_schedule.locale						= locale
            dp_schedule.days                        = 7;

			dp_schedule.events.list 				= pr_lstAvailableTime;

			dp_schedule.onTimeRangeSelected = function (args) {
				dp_schedule.clearSelection();
	            
				do_lc_create_appointment(args);
	        };

			dp_schedule.contextMenu = new DayPilot.Menu({
				zIndex: 1050,
				items: [
				  {text:"Delete", onClick: args => { const e = args.source; dp_schedule.events.remove(e).queue(); } }
				]
			});
			
			dp_schedule.init();
		}

		//-------------------------------------------------------------------------------------------------

		var do_lc_create_appointment = function (args) {
			let count 	= 0;
			let start 	= args.start;
			let end  	= args.end;
			const date 	= start.toString('yyyy/MM/dd');

			$.each([...pr_lstAvailableTime], function(i, item) {
				if(item.start.toString('yyyy/MM/dd') === date) {
					if(end === item.start) {
						pr_lstAvailableTime.splice(i - count, 1);
						end = item.end;

						++count;
					}else if(start === item.end) {
						pr_lstAvailableTime.splice(i - count, 1);
						start = item.start;

						++count;
					}

					if(count === 2) return false;
				}
			})

			pr_lstAvailableTime.push({
				start	: start,
				end		: end,
				text	: $.i18n("aut_user_ent_free_time")
			})
			dp_schedule.events.list = pr_lstAvailableTime;
			dp_schedule.update();

		}

		var do_lc_bind_save_FreeTimes = function() {
			$('#btn_save_time').off('click').on('click', function() {
				App.data.TimeList = req_lc_reformat_data_send(dp_schedule.events.list);
				do_close_TimeMain();
			})
		}
		//------------------------------------------------------------------------------------
		//-------------------------------------------------------------------------------------------------
		function do_show_list_FreeTimes() {
            pr_lstAvailableTime = [];

            if(!pr_obj['times']) return;
			const lstFreeTimes 	= JSON.parse(pr_obj['times']);

			$.each(lstFreeTimes, function(i, item) {
				const lst 	= req_lc_format_Time_to_Daypilot_Date(item)

				$.each(lst, function(idx, o) {
					pr_lstAvailableTime.push({
						start	: o.start,
						end		: o.end,
						text	: $.i18n("aut_user_ent_free_time")
					});
				})
			})

			dp_schedule.events.list = pr_lstAvailableTime;
			dp_schedule.update();
		}

		var req_lc_reformat_data_send = (obj) => {
			let lst = [];
			$.each(obj, function(i, item) {
				const date 	= item.start.toString('yyyy/MM/dd');
				let start 	= item.start.toString('HH:mm')
				let end 	= item.end.toString('HH:mm')
				let flag	= 0;

				start 		= `${start.substr(0, 2)}${start.substr(3, 2)}`;
				end 		= `${end.substr(0, 2)}${end.substr(3, 2)}`;
				if((flag = req_lc_check_date_exists(lst, date)) !== -1) {
					lst[flag].time.push({
						start	: start,
						end		: end
					})
				} else {
					lst.push({
						date	: date,
						time	: [
							{
								start	: 	start,
								end		:	end
							}
						]
					})
				}
			})

			return lst;
		}

		var req_lc_check_date_exists = (lst, date) => {
			for (let i = 0; i < lst.length; i++) {
				if(lst[i].date === date) return i;
			}

			return -1;
		}

		var req_lc_format_Time_to_Daypilot_Date = (obj) => {
			let lst		= [];
			let date 	= obj.date;
			let time 	= obj.time;
			let start 	= null;
			let end 	= null;

			$.each(time, function(i, item) {
				start	= item["start"].substr(0, 2) + ":" + item["start"].substr(2, 2) + ":00";
				end 	= item["end"].substr(0, 2) + ":" + item["end"].substr(2, 2) + ":00";

				start 	= new DayPilot.Date(`${date}T${start}`)
				end 	= new DayPilot.Date(`${date}T${end}`)

				lst.push({
					start	: start,
					end		: end
				})
			})

			return lst;
		}

		var req_lc_convert_Date_to_Time = (day, hour, minutes) => {
			let time = day.toString();
			if(hour < 10) {
				time += "0" + hour;
			} else {
				time += hour;
			}
			if(minutes < 10) {
				time += "0" + minutes;
			} else {
				time += minutes;
			}

			return time;
		}
		//------------------------------------------------------------------------------------
		var do_close_TimeMain = () => {
			$('#modal_time_main').modal('hide');
		}
	};

	return EntHeaderTimeList;
});