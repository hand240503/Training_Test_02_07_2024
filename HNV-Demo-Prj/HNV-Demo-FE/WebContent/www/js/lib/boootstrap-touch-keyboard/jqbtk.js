// jQuery Bootstrap Touch Keyboard plugin
// By Matthew Dawkins
(function($) {
    $.fn.keyboard = function(options) {
        // Settings
        var settings = $.extend({
            keyboardLayout: [
                [
                    ['1', '1'],
                    ['2', '2'],
                    ['3', '3'],
                    ['4', '4'],
                    ['5', '5'],
                    ['6', '6'],
                    ['7', '7'],
                    ['8', '8'],
                    ['9', '9'],
                    ['0', '0'],
                    ['del', 'del']
                ],
                [
                    ['q', 'Q'],
                    ['w', 'W'],
                    ['e', 'E'],
                    ['r', 'R'],
                    ['t', 'T'],
                    ['y', 'Y'],
                    ['u', 'U'],
                    ['i', 'I'],
                    ['o', 'O'],
                    ['p', 'P'],
                    ['-', '='],
                    ['_', '+']
                ],
                [
                    ['a', 'A'],
                    ['s', 'S'],
                    ['d', 'D'],
                    ['f', 'F'],
                    ['g', 'G'],
                    ['h', 'H'],
                    ['j', 'J'],
                    ['k', 'K'],
                    ['l', 'L'],
                    ['\'', ':'],
                    ['@', ';'],
                    ['#', '~']
                ],
                [
                    ['z', 'Z'],
                    ['x', 'X'],
                    ['c', 'C'],
                    ['v', 'V'],
                    ['b', 'B'],
                    ['n', 'N'],
                    ['m', 'M'],
                    [',', ','],
                    ['.', '.'],
                    ['?', '!']
                ],
                [
                    ['shift', 'shift'],
                    ['space', 'space'],
                    ['shift', 'shift']
                ]
            ],
            numpadLayout: [
                [
                    ['7'],
                    ['8'],
                    ['9']
                ],
                [
                    ['4'],
                    ['5'],
                    ['6']
                ],
                [
                    ['1'],
                    ['2'],
                    ['3']
                ],
                [
                    ['del'],
                    ['0'],
                    ['.']
                ]
            ],
            telLayout: [
                [
                    ['1'],
                    ['2'],
                    ['3']
                ],
                [
                    ['4'],
                    ['5'],
                    ['6']
                ],
                [
                    ['7'],
                    ['8'],
                    ['9']
                ],
                [
                    ['del'],
                    ['0'],
                    ['.']
                ]
            ],
            customLayout: [
                [
                    ['7'],
                    ['8'],
                    ['9'],
                    ['del']
                ],
                [
                    ['4'],
                    ['5'],
                    ['6'],
                    ['clear']
                ],
                [
                    ['1'],
                    ['2'],
                    ['3'],
                    ['cancel']
                ],
                [
                    ['0'],
                    ['00'],
                    ['000'],
                    ['.']
                ],
                [
                	['done']
                ]
            ],
            layout: false,
            type: false,
            btnTpl: '<button type="button" tabindex="-1">',
            btnClasses: 'btn btn-default btn-vendor',
            btnActiveClasses: 'active btn-primary',
            initCaps: false,
            placement: 'bottom',
            container:'body',
            trigger: 'focus',
            input01: this,
            numberFormat : "#,###.##"
            
        }, options);
        if (!settings.layout) {
            if (($(this).attr('type') === 'tel' && $(this).hasClass('keyboard-numpad')) || settings.type === 'numpad') {
                settings.layout = settings.numpadLayout;
                settings.type = 'numpad';
            } else if (($(this).attr('type') === 'tel') || settings.type === 'tel') {
                settings.layout = settings.telLayout;
                settings.type = 'tel';
            } else if (($(this).attr('type') === 'custom') || settings.type === 'custom') {
                settings.layout = settings.customLayout;
                settings.type = 'custom';
            } else {
                settings.layout = settings.keyboardLayout;
                settings.type = 'keyboard-numpad';
            }
        }
        // Keep track of shift status
        var keyboardShift = false;

        // Listen for keypresses
        var onKeypress = function(e, key) {
        	$(this).addClass(settings.btnActiveClasses);
            var keyContent = $(this).attr('data-value' + (keyboardShift ? '-alt' : ''));
        	if(key) {
        		keyContent = key;
        	}
            
            var parent = $("#inp_numpad");
            var numberFormat = "#,###.###";
            var currentContent = parent.val();
            if(parent.is('td')) {
            	currentContent = parent.html();
            }
            switch (keyContent) {
                case 'space':
                    currentContent += ' ';
                    break;
                case 'shift':
                    keyboardShift = !keyboardShift;
                    keyboardShiftify();
                    break;
                case 'del':
                	currentContent = currentContent.substr(0, currentContent.length - 1);
                    break;
                case 'enter':
                    parent.closest('form').submit();
                    break;           
                case 'clear':
                	currentContent = '';
                    break;
                case 'cancel':
//                	if(settings.callbackFunct) {
//                		settings.callbackFunct(settings.input01, $.parseNumber(settings.value, {format: settings.numberFormat, locale:localStorage.language, strict:true}).valueOf());
//                	}
                	App.MsgboxController.do_lc_close();
                    break;
                case 'done':
                	if(settings.callbackFunct) {
                		settings.callbackFunct(settings.input01, $.parseNumber(currentContent, {format: settings.numberFormat, locale:localStorage.language, strict:true}).valueOf());
                	}
                	App.MsgboxController.do_lc_close();
                	break;
                case '000':
                	currentContent += " 000";
                	break;
                case '00':
                	currentContent += "00";
                	break;
                case '0':
                	currentContent += "0";
                	break;
                case '.':
                	if(currentContent.indexOf('.') == -1)
                		currentContent += ".";
//                	else
//                		currentContent = currentContent;
                	break;
                case ',':
                	if(currentContent.indexOf(',') == -1)
                		currentContent += ",";
                	break;
                default:
                    currentContent += keyContent;
                    keyboardShift = false;
            }
            
//            if (settings.type !='custom'){}
//            currentContent = $.parseNumber(currentContent, {format: settings.numberFormat, locale:localStorage.language, strict:true}).valueOf();
//            currentContent = $.formatNumber(currentContent, {format: settings.numberFormat, locale : localStorage.language})
            
            parent.val(currentContent);
        };
        $(document).off('touchstart', '.jqbtk-row .btn');
        $(document).on('touchstart', '.jqbtk-row .btn', onKeypress);

        $(document).off('mousedown', '.jqbtk-row .btn');
        $(document).on('mousedown', '.jqbtk-row .btn',function(e){
            onKeypress.bind(this,e)();
//            var parent = $('[aria-describedby=' + $(this).closest('.popover').attr('id') + ']');
            var parent = $("#inp_numpad");
            parent.focus();
            e.preventDefault();
        });

        // All those trouble just to prevent clicks on the popover from cancelling the focus
        $(document).off('mouseup', '.jqbtk-row .btn');
        $(document).on('mouseup', '.jqbtk-row .btn',function(e){
            $(this).removeClass(settings.btnActiveClasses);
//            var parent = $('[aria-describedby=' + $(this).closest('.popover').attr('id') + ']');
            var parent = $("#inp_numpad");
            parent.focus();
        });

        $(document).on('click', '.jqbtk-row .btn',function(e){
//            var parent = $('[aria-describedby=' + $(this).closest('.popover').attr('id') + ']');
            var parent = $("#inp_numpad");
            parent.focus();
        });
        $(document).on('touchend', '.jqbtk-row .btn', function() {
            $(this).removeClass(settings.btnActiveClasses);
//            var parent = $('[aria-describedby=' + $(this).closest('.popover').attr('id') + ']');
            var parent = $("#inp_numpad");
            parent.focus();
        });
        $(document).on('touchend', '.jqbtk-row', function(e) {
            e.preventDefault();
//            var parent = $('[aria-describedby=' + $(this).closest('.popover').attr('id') + ']');
            var parent = $("#inp_numpad");
            parent.focus();

        });
        // Update keys according to shift status
        var keyboardShiftify = function() {
            $('.jqbtk-container .btn').each(function() {
                switch ($(this).attr('data-value')) {
                    case 'shift':
                    case 'del':
                    case 'space':
                    case 'enter':
                    case 'clear':
                    case 'cancel':
                    case 'done':
                    case '000':
                    case '00':
                    case '0':
                    case '.':
                    case ',':
                        break;
                    default:
                        $(this).text($(this).attr('data-value' + (keyboardShift ? '-alt' : '')));
                }
            });
        };
        var container = this.data('container');
        if(container!=undefined)
        {
          container = '#'+container;
          settings.container = container;
          settings.placement = 'in';
          settings.trigger = 'manual';
          $(container).addClass('keyboard-container');
        }
        // Set up a popover on each of the targeted elements
        return this.each(function() {
//            $(this).popover({
        	App.MsgboxController.do_lc_show({
//        		bindEvent: function() {
//        			alert("Hello");
//        		},
        		title	: "",
        		buttons	: "none",
				autoclose: false,
				width: "60%",
                content: function() {
                    // Optionally set initial caps
                    if (settings.initCaps && $(this).val().length === 0) {
                        keyboardShift = true;
                    }     
                    // Set up container
                    var content= $('<div class="jqbtk-container" tabIndex="-1">');
                    content.append('<input id="inp_numpad" class="form-control" style="margin-bottom:1%; font-size:2em" type="text" '
                    				+ 'value="'+settings.value+'">'
                    				+'</input>');
                    $.each(settings.layout, function() {
                        var line = this;
                        var lineContent = $('<div class="jqbtk-row">');
                        $.each(line, function() {
                            var btn = $(settings.btnTpl).addClass(settings.btnClasses);
                            btn.attr('data-value', this[0]).attr('data-value-alt', this[1]);
                            switch (this[0]) {
                                case 'shift':
                                    btn.addClass('jqbtk-shift').html('<span class="fa fa-arrow-up"></span>');
                                    break;
                                case 'space':
                                    btn.addClass('jqbtk-space').html('&nbsp;');
                                    break;
                                case 'del':
                                    btn.addClass('jqbtk-del').html('<span class="fa fa-arrow-left"></span>');
                                    break;
                                case 'enter':
                                    btn.addClass('jqbtk-enter').html('Enter');
                                    break;
                                case 'clear':
                                    btn.addClass('jqbtk-clear').html('<span>C</span>');
                                    break;
                                case 'cancel':
                                    btn.addClass('jqbtk-cancel').html('<span class="fa fa-remove"></span>');
                                    break;
                                case 'done':
                                    btn.addClass('jqbtk-done').html('<span class="fa fa-check"></span>');
                                    break;
                                case '000':
                                    btn.addClass('jqbtk-thousand').html('<span>000</span>');
                                    break;
                                case '00':
                                    btn.addClass('jqbtk-houndred').html('<span>00</span>');
                                    break;
                                case '.':
                                    btn.addClass('jqbtk-point').html('<span>.</span>');
                                    break;
                                case '0':
                                    btn.addClass('jqbtk-zero').html('0');
                                    break;
                                default:
                                    btn.text(btn.attr('data-value' + (keyboardShift ? '-alt' : '')));
                            }
                            lineContent.append(btn);
                        });
                        content.append(lineContent); 
                    });
                    return content;
                },
                html: true,
                placement: settings.placement,
                trigger: settings.trigger,
                container:settings.container,
                viewport: settings.container,
	            bindEvent: function() {
	            	$("body").off("keyup");
	            	$("body").on("keyup",function(e) {
	            		if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
	            			//0-9
	            			onKeypress(e, String.fromCharCode(e.keyCode));
	            		} else if(e.keyCode == 8) {
	            			onKeypress(e, "del");
	            		} else if(e.keyCode == 13) {
	            			onKeypress(e, "done");
	            		}
	            		e.preventDefault();
	            	});
	            	$("#inp_numpad").on("focus", function(){
	            		$(this).blur();
	            	});
	            },
	            onClose : function() {
	            	$("body").off("keyup");
	            }
            });
        	
            if(settings.trigger == 'manual')
            {
//              $(this).popover('show');
            }
        });
    };
}(jQuery));
