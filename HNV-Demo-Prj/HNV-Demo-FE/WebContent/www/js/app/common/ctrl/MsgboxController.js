define([
        'jquery',
        'text!common/tmpl/CMS_MsgBox.html',
        ],
    function($, Msgbox) {
        
	
	var MsgboxController 	= function () {

            var tmplName		= App.template.names;
            var tmplCtrl		= App.template.controller;
            var self = this;
            
            App.data.msgElts 		= [];
            App.data.curElt			= 0;

            this.do_lc_init = function() {
            	try { 
                	tmplCtrl.do_lc_put_tmpl(tmplName.CMS_MSGBOX				, Msgbox);
        			$("body").append(tmplCtrl.req_lc_compile_tmpl(tmplName.CMS_MSGBOX, {}));
                	                   	
                }
                catch(e) {
                	console.log(e);
                }
    		}
            
            this.do_lc_show = function(params) {
            	var msbId = "#msb_message_box";
            	
            	if(params.id) {
            		msbId = params.id;
            	}
            	
            	if(params.subBox) {
            		msbId = "#msb_message_box_sub";
            	}
            	
            	/**
            	 * Clean the msgbox
            	 */
            	$(msbId + " .modal-title"	).html("");
            	$(msbId + " .modal-body" 	).html("");
            	$(msbId + " .modal-footer"	).html("");
        		
        		$(msbId + " .modal-footer"	).show();
        		
        		$("body").off("keydown", onTabEvent);
        		
        		//reset the tab index to the first input
        		App.data.curElt			= 0;
            	
            	if(params.title) {
            		if(params.title == "none") {
            			$(msbId + " .modal-header").hide();
            		} else {
                		$(msbId + " .modal-title").html(params.title);
            		}
            	}
            	
            	if(params.content) {
            		if(params.content == "none") {
            			$(msbId + " .modal-body").hide();
            		} else {
                		$(msbId + " .modal-body").html(params.content);
            		}
            	}
            	
            	if(params.buttons) {
            		var btns = params.buttons;
            		if(params.buttons == "none") {
            			$(msbId + " .modal-footer").hide();
            		} else {
            			Object.keys(params.buttons).forEach(function(key) {
                			var btn = btns[key];
                			var btnlabel = key;
                			if(btn != null) {
                				if(btn.lab) {
                    				btnlabel = btn.lab;
                    			}
                			}
                			if( $(msbId + " #btn_msgbox_"+key).length > 0) {
                				$(msbId + " #btn_msgbox_"+key).off("click");
                				$(msbId + " #btn_msgbox_"+key).remove();
                			} //else {
                				$(msbId + " .modal-footer").append("<button id='btn_msgbox_"+key+"' type='button' class='btn btn-default' >"+btnlabel+"</button>");
                			//}
                    		
                			            			
                    		if(btn != null) {	
                    			if(!btn.param) {
                    				btn.param = [];
                    			}
                    			if(!btn.context) {
                    				btn.context = null;
                    			}
                    			if(btn.funct) {
                    				//$(msbId + " #btn_msgbox_"+key).on("click",btn.param, btn.funct);
                    				$(msbId + " #btn_msgbox_"+key).off("click");                			
                    				$(msbId + " #btn_msgbox_"+key).click(function(){  
                    					btn.funct.apply(btn.context, btn.param);
                    				});
                    			} else if(btn.action) {
                    				//$(msbId + " #btn_msgbox_"+key).on("click",btn.param, btn.funct);
                    				$(msbId + " #btn_msgbox_"+key).off("click");                			
                    				$(msbId + " #btn_msgbox_"+key).click(function(){  
                    					btn.action.apply(btn.context, btn.param);
                    				});
                    			}
                			}
                    		
                    		if(btn.reload) {
                    			btn.context = this;
                    			$(msbId + " #btn_msgbox_"+key).on("click", function() {
                    				btn.context.do_lc_show.apply(btn.context, [btn.reload]);
                    			});
                    		}
                			
                			//always close the dialog box after callback of the button        
                    		if(btn.autoclose != undefined && btn.autoclose == false) {
                    			//do nothing
                    		} else {
                    			$(msbId + " #btn_msgbox_"+key).on("click", function(){self.do_lc_close(msbId)});
                    		}
                		}, this);
            		}
            	} else {
            		$(msbId + " .modal-footer"		).append("<button id='btn_msgbox_close' type='button' class='btn btn-default' >"+$.i18n("msgbox_btn_close")+"</button>");
            		$(msbId + " #btn_msgbox_close"	).off("click");
            		$(msbId + " #btn_msgbox_close"	).on("click", function(){self.do_lc_close(msbId)});
            	}
            	
            	if(params.bindEvent) {
            		params.bindEvent($(msbId + ""));
            	}
            	
            	if(params.autoclose == false) {
            		$(msbId).modal({
            			backdrop: 'static',
                        keyboard: false
            		});
            	} else {
            		$(msbId).modal("show");
            	}
            	
            	if(params.width) {
            		$(msbId + " .modal-dialog").css("width", params.width);
            	}
            	else {
            		$(msbId + " .modal-dialog").css("width", "90%");
            	}
            	//add event when dialog has been closed : delete all buttons
            	$(msbId).on('hidden.bs.modal', function() {
                	$(msbId + " .modal-title"	).html("");
                	$(msbId + " .modal-body"	).html("");
                	$(msbId + " .modal-footer"	).html("");
                	
            		$("body").off("keydown", onTabEvent);
            		if(params.onClose) {
            			params.onClose();
            		}
    			});
            	
            	//$(".modal-content").draggable();
            	
            	App.data.msgElts = $(msbId).find("input, select, textarea, button, a");
            	if(App.data.msgElts.length > 0) {
            		App.data.msgElts[0].focus();
            		
            		App.data.msgElts.each(function(index) {
            			$(this).on("focus", function() {
            				App.data.curElt			= index;
            			});
            		});
            	}
            	
            	this.bindDefaultEvent();
            	
            };
            
            this.do_lc_close = function(msbId) {
            	if (!msbId){ 
            		$("#msb_message_box").modal("hide");
            		$("#msb_message_box_sub").modal("hide");
            		return;
            	}
            	$(msbId).modal("hide");
            }
            
            this.bindDefaultEvent = function() {
            	$("body").on("keydown",onTabEvent);
            };
            
            this.showAlertNewNoSave = function(){
    			this.show({
    				title	: $.i18n('common_alert_err_save_title') ,
    				content	: $.i18n('common_alert_err_msg_new_no_save')
    			});	
    		};
            
            var onTabEvent = function(event) {
            	if(event.which === 9 && event.shiftKey){
            		event.preventDefault();
            		App.data.curElt -= 1;
            		if(App.data.curElt < 0) {
            			App.data.curElt = App.data.msgElts.length;
            		}
            		var count = 0;
            		while(!$(App.data.msgElts[App.data.curElt]).is(":focusable")) {
            			App.data.curElt -= 1;
            			if(App.data.curElt <0) {
            				App.data.curElt = App.data.msgElts.length;
            			}
            			count ++;
            			if(count > 100) {
            				return;
            			}
            		}
            		App.data.msgElts[App.data.curElt].focus();
            	}
            	else if(event.which === 9) {
            		event.preventDefault();
            		App.data.curElt += 1;
            		if(App.data.curElt >= App.data.msgElts.length) {
            			App.data.curElt = 0;
            		}
            		var count = 0;
            		while(!$(App.data.msgElts[App.data.curElt]).is(":focusable")) {
            			App.data.curElt += 1;
            			if(App.data.curElt >= App.data.msgElts.length) {
            				App.data.curElt = 0;
            			}
            			count ++;
            			if(count > 100) {
            				return;
            			}
            		}
            		App.data.msgElts[App.data.curElt].focus();
            	}
            };
            
        };
        
        return MsgboxController;
    });