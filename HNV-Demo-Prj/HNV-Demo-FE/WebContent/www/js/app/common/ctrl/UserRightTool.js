function do_gl_apply_right(ele) {
//	var eleRight = $("[data-right]");
	var eleRight = ele.find("[data-right]");
	if (!App.data.user.rights) return;
	
	$.each(eleRight, function(i, e) {
		var drights = $(e).data("right");
		if(drights && drights != "undefined") {
			var r  = drights;
			var typR = $(e).data("typ-right");
			if(typR && typR != "undefined"){
				var rS = drights.split("/");
				for(var i = 0; i < rS.length; i++){
					var uR = rS[i];
					var uS = uR.split("-");
					if(uS[0] == typR){
						r = uS[1];
						break;
					}
				}
			}
			
			var right_splits = r.split(";");
//			var right_splits = drights.split(";");
			$.each(right_splits, function(isr, esr) {
				var parts = esr.split(":");
				if(parts.length == 2) {
					var right_name 	= parts[0];
					var rightAnd	= null;
					var rightOr		= null;
					if (parts[1] && parts[1].length>0){
						if (parts[1].indexOf(",")>0){
							rightAnd 	= parts[1].split(",");
						} else if (parts[1].indexOf("|")>0){
							rightOr		= parts[1].split("|");
						}  else { 
							rightAnd	= [];
							rightAnd.push(parts[1]);
						}
					}
					
					
					var show = true;
					if (rightAnd){
						for (var  ir in rightAnd){
							var er = parseInt(rightAnd[ir],10);
							if(!App.data.user.rights.includes(er)) {
								show = false;
								break;
							}
						}
					}else if (rightOr){
						show = false;
						for (var  ir in rightOr){
							var er = parseInt(rightOr[ir],10);
							if(App.data.user.rights.includes(er)) {
								show = true;
								break;
							}
						}
					}
					
					if(right_name == "view") {
						if (!show) $(e).remove();
					} else if(right_name == "edit"){
						if (!show) $(e).addClass("unmodifiable");
					}
				}
			});
		}
	});
}