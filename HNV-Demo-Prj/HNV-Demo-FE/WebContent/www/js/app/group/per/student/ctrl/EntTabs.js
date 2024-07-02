define([
        'jquery',
        'text!group/per/student/tmpl/Ent_Tabs.html',
        
        'group/per/student/ctrl/EntTabDoc' 

        ],
        function($, 
        		Tmpl_Ent_Tabs,
        		
        		CtrlEntTabDoc
        		) {


	var CtrlEntTabs     = function (header,content,footer, grpName) {
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
		var pr_ctr_EntTabs 			= null;
		
		//-------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller[pr_grpName].Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;
			
			pr_ctr_Ent				= App.controller[pr_grpName].Ent;
			pr_ctr_EntTabDoc 		= App.controller[pr_grpName].EntTabDoc;
//			pr_ctr_EntTabRating 	= App.controller[pr_grpName].EntTabRating;
			
			tmplName.ENT_TABS			= "Ent_Tabs";
			
			tmplCtrl.do_lc_put_tmpl(tmplName.ENT_TABS, Tmpl_Ent_Tabs); 
		}     
		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;
			
			var objLink = pr_obj;
			var objFile = pr_obj;
			
			if(obj && mode != App['const'].MODE_MOD){
				if(!obj.link || obj.link.length <= 0){
					if(obj.files){
						var files = obj.files;
						var newFiles = [];
						var newLink  = [];
						for(var i = 0; i < files.length; i++){
							if(files[i].typ02 != 3){
								newFiles.push(files[i]);
							}else{
								newLink.push(files[i]);
							}
						}
						objFile.files = newFiles;
						objLink.link  = newLink;
					}
				}
			}
			
			
			try{
							
				$(pr_divContent).html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_TABS, obj));
				
				//fixed max-height scroll of % height div_ContentView
				do_gl_calculateScrollBody(pr_divContent + " .custom-scroll-tab", 43.6);
						
//				pr_ctr_EntTabRating.do_lc_show(pr_obj, pr_mode);
				pr_ctr_EntTabDoc .do_lc_show(objFile, mode);
//				pr_ctr_EntTabLink.do_lc_show(objLink, mode);
				
				do_bind_event(obj, mode);
			}catch(e) {				
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  pr_grpName, "EntTabs", "do_lc_show", e.toString()) ;
			}
		};
		

		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			
		}

	};


	return CtrlEntTabs;
});