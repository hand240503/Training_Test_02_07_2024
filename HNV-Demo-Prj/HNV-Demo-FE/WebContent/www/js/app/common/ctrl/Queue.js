//const FUNCT_SCOPE	= AppCommon['const'].	FUNCT_SCOPE;
//const FUNCT_NAME	= AppCommon['const'].	FUNCT_NAME;
//const FUNCT_PARAM	= AppCommon['const'].	FUNCT_PARAM;

var do_gl_queue = function(fListWhenSucess, fWhenError, fWhenComplete, shareArg, waitingTime) {
	queue(fListWhenSucess, fWhenError, fWhenComplete, shareArg, waitingTime);
}
var do_gl_execute = function (funct, arrayParam){
	execute(funct, arrayParam);
}
//-----------------------------------------------------
var queue=function(a,b,c,d,e){null==e&&(e=50),function f(){if(a.length>0){var g=a.shift(),h=g[FUNCT_NAME];if(!h)return void f();var i=g[FUNCT_SCOPE],j=g[FUNCT_PARAM];setTimeout(function(){0==d.err_code||void 0==d.err_code?(h.apply(i,[d].concat(j)),f()):b&&execute(b)},e)}else c&&execute(c)}()};

var execute = function (funct){
	try{
		if (typeof(funct)== 'function') 
			funct();
		else{
			var fVar 	= funct[FUNCT_SCOPE];
			var fName 	= funct[FUNCT_NAME];
			var fParam	= funct[FUNCT_PARAM];
			fName.apply(fVar, fParam);
		}
	}catch(e){
		console.log('Cannot execute Funct');
	}	
}