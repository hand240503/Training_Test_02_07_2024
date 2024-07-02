function do_lc_show_help(page) {
	var helpContent = "";
	var module		= "";
	if(page == "home_view") {
		helpContent = 'controller/sys/help/SysHelpHome';
	} else if(page == "mat_material"){
		helpContent = 'controller/sys/help/SysHelpMaterial';
	} else if(page == "aut_user") {
		helpContent = 'controller/sys/help/SysHelpAdmUser';
	} else if(page == "mat_stock_in") {
		helpContent = 'controller/sys/help/SysHelpMatStockIn';
	} else if(page == "mat_stock_out") {
		helpContent = 'controller/sys/help/SysHelpMatStockOut';
	} else if(page == "sor_order_in_view") {
		helpContent = 'controller/sys/help/SysHelpSorOrderIn';
	} else if(page == "sor_order_out_view") {
		helpContent = 'controller/sys/help/SysHelpSorOrderOut';
	} else if(page == "sor_sale") {
		helpContent = 'controller/sys/help/SysHelpSorSale';
	} else if(page == "job_report") {
		helpContent = 'controller/sys/help/SysHelpJobReport';
	} else {
		
		helpContent = 'controller/sys/help/SysHelpEMProject';
		if(page == "aut_user"){
			module = "AutUser";
		}
	}
	var defaultTemplate = "<div class='popover tour custom-tour'>"
						+		"<div class='arrow'></div>"
						+		"<h3 class='popover-title'></h3>"
						+		"<div class='popover-content'></div>"
						+		"<div class='popover-navigation'>"
						+			"<div class='btn-group'>"
						+				"<button class='btn btn-sm btn-default' data-role='prev'>« " + $.i18n("sys_help_comm_btn_prev") + "</button>"
						+				"<button class='btn btn-sm btn-default' data-role='next'>" + $.i18n("sys_help_comm_btn_next") + " »</button>"
						+			"</div>"
						+			"<button class='btn btn-sm btn-default' data-role='end'>" + $.i18n("sys_help_comm_btn_end") + "</button>"
						+		"</div>"
						+	"</div>";
	
	requirejs(['jquery', helpContent], function( jq, Help) {
		var help 	= new Help(module);
		var steps 	= help.req_lc_steps();
		var name	= help.req_lc_name();
		var tour = new Tour({
			name 	: name,
			steps 	: steps,
			backdrop : true,
			storage : false,
			template : defaultTemplate
		});
		
		tour.init(true);
		tour.start();
	});
}


//--INSTRUCTION (below)------------------------------------------------------------------
//---------------------------------------------------------------------------------------
//var tour = new Tour({
//	  name: "tour",
//	  steps: [],
//	  container: "body",
//	  smartPlacement: true,
//	  keyboard: true,
//	  storage: window.localStorage,
//	  debug: false,
//	  backdrop: false,
//	  backdropContainer: 'body',
//	  backdropPadding: 0,
//	  redirect: true,
//	  orphan: false,
//	  duration: false,
//	  delay: false,
//	  basePath: "",
//	  template: "<div class='popover tour'>
//	    <div class='arrow'></div>
//	    <h3 class='popover-title'></h3>
//	    <div class='popover-content'></div>
//	    <div class='popover-navigation'>
//	        <button class='btn btn-default' data-role='prev'>« Prev</button>
//	        <span data-role='separator'>|</span>
//	        <button class='btn btn-default' data-role='next'>Next »</button>
//	    </div>
//	    <button class='btn btn-default' data-role='end'>End tour</button>
//	  </div>",
//	  afterGetState: function (key, value) {},
//	  afterSetState: function (key, value) {},
//	  afterRemoveState: function (key, value) {},
//	  onStart: function (tour) {},
//	  onEnd: function (tour) {},
//	  onShow: function (tour) {},
//	  onShown: function (tour) {},
//	  onHide: function (tour) {},
//	  onHidden: function (tour) {},
//	  onNext: function (tour) {},
//	  onPrev: function (tour) {},
//	  onPause: function (tour, duration) {},
//	  onResume: function (tour, duration) {},
//	  onRedirectError: function (tour) {}
//	});


//---------------------------------------------------------------------------------------
//tour.addStep({
//	  path: "",
//	  host: "",
//	  element: "",
//	  placement: "right",
//	  smartPlacement: true,
//	  title: "",
//	  content: "",
//	  next: 0,
//	  prev: 0,
//	  animation: true,
//	  container: "body",
//	  backdrop: false,
//	  backdropContainer: 'body',
//	  backdropPadding: false,
//	  redirect: true,
//	  reflex: false,
//	  orphan: false,
//	  template: "",
//	  onShow: function (tour) {},
//	  onShown: function (tour) {},
//	  onHide: function (tour) {},
//	  onHidden: function (tour) {},
//	  onNext: function (tour) {},
//	  onPrev: function (tour) {},
//	  onPause: function (tour) {},
//	  onResume: function (tour) {},
//	  onRedirectError: function (tour) {}
//	});


//---------------------------------------------------------------------------------------
//addSteps([])		Add multiple steps to the tour. Pass an array of objects.
//addStep({})		Add single step to the tour. Pass an object.
//init()			Initialize the tour. You must do it before calling start.
//start(true)		Start the tour. Pass true to force the start.
//restart()			Restart the tour after it ended.
//end()				End the tour prematurely.
//next()			Skip to the next step.
//prev()			Go back to the previous step.
//goTo(i) 			Skip to a specific step. Pass i as the index of the step in the tour (0-based).
//					From version 0.7.0, the method has been renamed since some Javascript compilers are confused by the property name goto, which is a reserved word).
//pause()			Pause the duration timer. It works only if tour or current step has duration.
//resume()			Resume the duration timer. It works only if tour or current step has duration.
//ended()			Verify if the tour ended. Returns boolean.
//getStep(i)		Get the step object. Pass i as the index of the step in the tour (0-based).
//getCurrentStep()	Get the index of the current step.
//setCurrentStep(i)	Override the current step. Pass i as the index of the step in the tour (0-based).
//redraw()			Triggers a redraw on the overlay element. Useful for Dynamically sized tour targets.