function do_gl_init_TagInput(elt, value, text, customOpt) {
//	tagClass: null,
//	allowDuplicates: false,
//	freeInput: false,
	
	var options = { itemValue: value, itemText: text };
	
	if(customOpt) {
		$.extend(true, options, customOpt);
	}
	
	$(elt).tagsinput(options);
	
}

function do_gl_add_TagInput(elt, obj) {
	$(elt).tagsinput('add', obj);
}

function do_gl_remove_TagInput(elt, obj) {
	$(elt).tagsinput('remove', obj);
}

function do_gl_removeAll_TagInput(elt, obj) {
	$(elt).tagsinput('removeAll');
}

function req_gl_str_TagInput(elt) {
	return $(elt).val();
}

function req_gl_arr_TagInput(elt) {
	return $(elt).tagsinput('items')
}

TagsInput = function(selector) {
	this.elt = $(selector);
	if(this.elt.length <= 0) {
		console.log("Tag input error: " + selector + " not found!")
		return;
	}
	
	var defaultOptions = {
			
	};
	
	this.do_lc_init = function(valueName, textName, customOpt) {
		defaultOptions.itemValue 	= valueName;
		defaultOptions.itemText		= textName;
		var options = $.extend(true, {}, defaultOptions, customOpt);
		this.elt.tagsinput(options);
	}
	
	this.do_lc_add = function(item) {
		this.elt.tagsinput('add', item);
	}

	this.do_lc_remove = function(item) {
		this.elt.tagsinput('remove', item);
	}

	this.do_lc_removeAll = function() {
		this.elt.tagsinput('removeAll');
	}

	this.req_lc_value = function() {
		return this.elt.val();
	}

	this.req_lc_items = function() {
		return this.elt.tagsinput('items')
	}
	
	this.req_lc_exist = function(item) {
		var lstValue = this.req_lc_items();
		if($.inArray(item, lstValue) >= 0) {
			return true;
		} else {
			return false;
		}
	}
	
	this.do_on_item_removed = function(callback) {
		$('input').on('itemRemoved', function(event) {
			 callback(event.item);
		});
	}
}