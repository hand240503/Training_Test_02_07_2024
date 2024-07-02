define([
        'jquery',
        'text!group/aut/role/tmpl/Ent_Tab_Rights.html'      

        ],
        function($,
        		Tmpl_Ent_Tab_Rights    		
        		) {


	var CtrlEntTabRights     = function (header,content,footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;

		//------------------------------------------------------------------------------------
		var pr_grpName				= grpName;
		//------------------------------------------------------------------------------------
		var tmplName				= App.template.names[pr_grpName];
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
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			//----step 01: load template----------------------------------------------------------------------------------------------
			tmplName.ENT_TAB_RIGHT	= "Ent_Tab_Right";
			tmplCtrl.do_lc_put_tmpl(tmplName.ENT_TAB_RIGHT, Tmpl_Ent_Tab_Rights);
			//-----------------------------------------------------------------------------------
			
			pr_ctr_Main 			= App.controller[pr_grpName].Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;
			pr_ctr_Ent				= App.controller[pr_grpName].Ent;
			
		}
		
		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;
			
			try {
				var rightList = req_check_right_selected(obj.rights);
				
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_TAB_RIGHT, rightList));
				
				do_bind_event (obj, mode, rightList);
				
			} catch(e) {		
				console.log(e);
			}
		};

		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode, array){
			$.each(array, function (key, val){
				var div = "#div_Tab_" + key + " input[type='checkbox']";
				$(div+"[data-level='0']").off("click").on("click", function() {
					var checked = $(this).prop('checked');
					$(div+"[data-level='1']").prop('checked', checked);
				});
				$(div+"[data-level='1']").off("click").on("click", function() {
					var checked = $(this).prop('checked');
					if (!checked) $(div+"[data-level='0']").prop('checked', checked);
				});
			});
	
		}
		
		var req_check_right_selected = function(rights) {
			var tabCheck = {};
			for (var i in rights) tabCheck[rights[i]] = 1;
			
			var grpRight = $.extend(true, {}, App.data.AutRightList);
			for (var grp in grpRight){
				var grpList = grpRight[grp];
				grpList.checkAll = true;
				
				for (var r in grpList.rights){
					var ri = grpList.rights[r];
					if (tabCheck[ri.id]) 
							ri.check 		 = true; 
					else 	grpList.checkAll = false;
				}
			}
			
			//----sort by grp name
			var key = Object.keys(grpRight);
			key.sort();
			var arr = [];
			for (var k in key){
				arr.push (grpRight[key[k]]);
			}
			
			return arr;
		}
	};


	return CtrlEntTabRights;
});

