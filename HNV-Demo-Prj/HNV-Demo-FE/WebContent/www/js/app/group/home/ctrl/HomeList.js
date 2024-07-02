define([
        'jquery',
        'text!group/home/tmpl/Home_List.html',     
        'text!group/home/tmpl/Home_List_Content.html', 

        ],
        function($, 
        		Home_List,
        		Home_List_Content
        ) 
        {

	var HomeList 	= function (header, content, footer, grpName) {
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
		
		//-----------------------------------------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		
		//-----------------------------------------------------------------------------------
		var varname					= "HomeList";
		
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.Home.Main;
			pr_ctr_List 			= App.controller.Home.List;
			pr_ctr_Ent				= App.controller.Home.Ent;
			
			tmplName.HOME_LIST			= "Home_List";
			tmplName.HOME_LIST_CONTENT	= "Home_List_Content";
			tmplCtrl.do_lc_put_tmpl(tmplName.HOME_LIST			, Home_List); 		
			tmplCtrl.do_lc_put_tmpl(tmplName.HOME_LIST_CONTENT	, Home_List_Content); 	
			
			
		}
		
		//--------------------------------------------------------------------------------------------
		this.do_lc_show = function(obj){               
			try {
							
					
				
				var lstFav = [];
				$.each(obj, function(i, e) {
					var children = e.child;
					$.each(children, function(ic, ec){
						if(ec.val04) {
							lstFav.push(ec);
						}
					});
				});
				
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.HOME_LIST						, {}));
				$("#div_Home_List_Content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.HOME_LIST_CONTENT	, lstFav));
				
				do_binding_event();

			}catch(e) {	
				console.log(e);
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "home", "HomeList", "do_lc_show", e.toString()) ;
			}
		};
		
		var do_binding_event = function() {
			//do_gl_calculateScrollBody(pr_divContent, 89.5);
			do_gl_enhance_within($(pr_divContent));
		}
		
		//--------------------------------------------------------------------------------------------
		var do_show_list = function (sharedJson){
			if(sharedJson[App['const'].SV_CODE] == App['const'].SV_CODE_API_YES) {
				var data 		= App.data[varname]; //sharedJson[App['const'].RES_DATA];

				$("#div_Home_List_Content").html(tmplCtrl.req_lc_compile_tmpl(tmplName.AUT_ROLE_LIST_CONTENT	, data));	
			} else {
				//do something else
			}
		}

		//--------------------------------------------------------------------------------------------
		var do_bind_list_event = function(data, div, oTable) {
			
			$(div).find('.table-datatableDyn').on('click', 'tr', function(){
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
		
	
	};

	return HomeList;
  });