Resizable = function(selector) {
	this.elt = $(selector);
	if(this.elt.length <= 0) {
		console.log("Resizable error: " + selector + " not found!")
		return;
	}

	var defaultOptions = {
			handleSelector: ".splitter",
			resizeHeight: false
	};
	
	this.do_lc_init = function(customOpt, isVertical) {
		if(isVertical) {
			defaultOptions = {
					handleSelector: ".splitter-horizontal",
					resizeWidth: false
			};
		}
		
		var options = $.extend(true, {}, defaultOptions, customOpt);
		this.elt.resizable(options);
	}
}

function do_gl_init_Resizable(selector, isVertical) {
	var pr_resizable = new Resizable(selector);

	var customOpt = {
			onDragEnd: function(event, ui){
				do_gl_set_resize_datatable(ui);
			}
	}
	
	pr_resizable.do_lc_init(customOpt, isVertical);
	
	$(".splitter").on("dblclick", function() {
		var leftWidth 	= $(".panel-left").width();
		var rightWidth	= $(".panel-right").width();
		if(leftWidth < rightWidth) {
			 $(".panel-left").css("width", "80%");
			 $(".panel-right").css("width", "20%");
		} else {
			$(".panel-left").css("width", "25%");
			$(".panel-right").css("width", "75%");
		}
	});

}

function do_gl_set_resize_datatable(parentNode){
	var child = parentNode.find(".dataTables_scrollHeadInner");
	child.each(function(){
		$(this).css("width", "100%")
	})
}