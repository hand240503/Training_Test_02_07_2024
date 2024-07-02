function req_gl_Translation_Obj(obj, langOpt){
	if (langOpt){
		var typ02 = obj.typ02;
		if (typ02!= langOpt){
			var objTransl = $.extend(true, {}, obj);
			objTransl.transl 	= null;
			objTransl.files		= null;
			objTransl.id		= null;
			objTransl.mainId	= obj.id;
			objTransl.lang 		= langOpt;
			objTransl.typ02 	= langOpt;
			
			if (obj.transl){
				for (var t in obj.transl) {
					var o = obj.transl[t];
					if (o.lang == langOpt){
						var oContent = o.cnt;
						try{
							oContent = JSON.parse(oContent);
						}catch(e) {}
						
						req_gl_sort_attr_typArr(objTransl	, 'id');
						req_gl_sort_attr_typArr(oContent	, 'id');
						
						objTransl 			= $.extend(true, objTransl, oContent);	
						
						objTransl.id		= obj.id;
						objTransl.translId	= o.id;
						objTransl.mainId	= obj.id;
						objTransl.lang 		= langOpt;
						objTransl.typ02 	= langOpt;
						break;
					}
				}
			}
			return objTransl;
		}else return obj;
	}else return obj;
}

function req_gl_sort_attr_typArr (obj, byAttrName){
	if (!obj) return;
	
	for(var key in obj){
		if (Array.isArray(obj[key])){
			do_gl_sortByKeyIntegerAsc(obj[key], byAttrName);
		}	
	}
}

function do_gl_sortByKeyIntegerAsc(array, key) {
    return array.sort(function (a, b) {
        var x = parseInt(a[key],10); 
        var y = parseInt(b[key],10);
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function req_gl_Translation_ObjLst(objLst, langOpt){
	var lst = [];
	for (var o in objLst){
		var oN = req_gl_Translation_Obj(objLst[o], langOpt);
		lst.push(oN);
	}
	return lst;
}

function do_gl_Del_ObjAttr (obj, keyName, deep){
	for(var key in obj){
		if (key==keyName){
			delete obj[key];
			continue;
		}
		if(!(obj[key])) {
			delete obj[key]
		}else if (Array.isArray(obj[key])){
			if (obj[key].length==0)
				delete obj[key]
		}else
		if(deep && typeof(obj[key]) === 'object'){
			do_gl_Del_ObjAttr(obj[key], keyName, deep)
		} 		
	}
}

function do_gl_Del_ObjAttrLst (obj, attrFilter, deep){
	if (attrFilter){
		if (attrFilter.constructor === Array){
			for (var attr in attrFilter) do_gl_Del_ObjAttr(obj, attrFilter[attr], deep);
		}else
			do_gl_Del_ObjAttr(obj, attrFilter, deep)
	}
}