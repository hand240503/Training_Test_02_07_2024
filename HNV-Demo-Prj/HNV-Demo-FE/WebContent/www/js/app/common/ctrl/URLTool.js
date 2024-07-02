function getURLParameter( name, url ) {
	if (!url) url = location.href;
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( url );
	return results == null ? null : results[1];
}
//getURLParameter('q', 'hxxp://example.com/?q=abc')
//It looks like you have some extra escape chars. "\\[" should be "\[". Since those are regular strings, the [ and ] don't need to be escaped

function req_gl_Url_Params(sPageURL){
	if (!sPageURL) sPageURL = App.data.url;

	var sURLVariables 	= sPageURL?sPageURL.split('&'):[];    
	if (!sURLVariables) return {};
	
	var	param			= {};	
	for (i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split('=');
		param[sParameterName[0]] = sParameterName[1];					
	}
	return param;						
}