 define([
	'jquery',
	'text!group/nso/post/tmpl/Ent_Tab_Rating.html'
	],
	function($, 
			Tmpl_Ent_Tab_Rating) {

	var CtrlEntTabRating     = function (header, content, footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;

		//------------------------------------------------------------------------------------
		var pr_lock_type			= -1; //--const based on BO
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

		var svClass         			= App['const'].SV_CLASS;
		var svName          			= App['const'].SV_NAME;
		var userId          			= App['const'].USER_ID;
		var sessId          			= App['const'].SESS_ID;
		var fVar            			= App['const'].FUNCT_SCOPE;
		var fName           			= App['const'].FUNCT_NAME;
		var fParam          			= App['const'].FUNCT_PARAM;

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
			pr_ctr_Main 			= App.controller[pr_grpName].Main;
			pr_ctr_List 			= App.controller[pr_grpName].List;

			pr_ctr_Ent				= App.controller[pr_grpName].Ent;
			pr_ctr_EntHeader 		= App.controller[pr_grpName].EntHeader;
			pr_ctr_EntBtn 			= App.controller[pr_grpName].EntBtn;
			pr_ctr_EntTabs 			= App.controller[pr_grpName].EntTabs;

		}      

		this.do_lc_show		= function(obj, mode){
			pr_obj 	= obj;
			pr_mode		= mode;

			try{
				do_Load_View();
				do_Build_Page(obj, mode);
				do_bind_event(obj, mode);
			}catch(e) {	
				console.log(e);
				do_gl_exception_send(App.path.BASE_URL_API_PRIV,  "nso.post", "CtrlEntTabRating", "do_lc_show", e.toString()) ;
			}
		};

		var do_Load_View = function(){
			tmplCtrl.do_lc_put_tmpl(tmplName.ENT_TAB_RATING	, Tmpl_Ent_Tab_Rating); 
		} 

		var do_Build_Page = function(obj, mode){
			$(pr_divContent)		.html(tmplCtrl.req_lc_compile_tmpl(tmplName.ENT_TAB_RATING, obj));
		} 

		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){

		}
	};

	return CtrlEntTabRating;
});