function do_gl_Key_Del (obj, keyName){
	for(var key in obj){
		if (key==keyName){
			delete obj[key];
			continue;
		}
		
		if(obj[key] !== null && typeof(obj[key]) === 'object'){
			do_gl_Key_Del(obj[key], keyName)

			if(!(obj[key])) {
				delete obj[key]
			}
		} 		
	}
}

