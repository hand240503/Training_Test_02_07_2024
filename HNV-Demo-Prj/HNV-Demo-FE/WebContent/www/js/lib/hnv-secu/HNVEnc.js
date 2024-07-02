/* eslint no-redeclare: 0 */
'use strict';


var HNVEnc =  function(){
	this.key ={};
	this.Nb ={};
	this.keys ={};
	this.direct ={};
	this.keySize ={};
	this.bPerBlock ={};
	this.shiftBytes = {};

};



HNVEnc.prototype.req_padding = function(nbperBlock,inp){
		var lenght=0;
		
		var NbyteBlock = nbperBlock;
		var Nblock = Math.floor(inp.length/ NbyteBlock) +1; 	
		
		var padding = new Array(1);
		
		var i;
		lenght = nbperBlock - inp.length % nbperBlock;				
		padding = new Array(lenght);					
		padding[0] =  0x80;
		for (i = 1; i < lenght; i++)				
			padding[i] = 0;
		
		var bData = inp.concat(padding);
		
		return bData;
};

HNVEnc.prototype.do_init_shift_direct = function(a, index, type){
		var _a = a[index];
		
		if(_a < 0) _a = 256 + _a;		
		var div = Math.floor(this.bPerBlock /2);
		this.shiftBytes[index]	= _a % div +1;
		
		if(_a%2 == 0)
			this.direct[index] 		=  -1*type;
		else
			this.direct[index] 		=  type;
};



HNVEnc.prototype.req_new_2DArray = function(row,col){
	var  tmp = new Array(row);
	for(var i=0;i<row;i++)
	     tmp [i] = new Int8Array(col);
	return tmp;
};

HNVEnc.prototype.do_gen_keyArray = function(type){
		this.shiftBytes  	= new Array(this.Nb);
		this.direct 		= new Array(this.Nb);	
		for(var i = 0; i< this.Nb; i ++){
			this.do_init_shift_direct(this.key,i, type);
		}
		console.log("NB:" + this.Nb);
		console.log("shiftbyte:" + this.shiftBytes.toString());
};
HNVEnc.prototype.do_gen_key = function(password, salt){
		var _key = CryptoJS.PBKDF2(password, salt, { keySize: this.keySize/4 }); 
		this.key = convert.words_to_bytes(_key.words);	
		console.log("key:" + this.key.toString());
};
HNVEnc.prototype.req_lc_gen_salt = function(keysize){
	    var salt = CryptoJS.lib.WordArray.random(keysize);
	    return convert.words_to_bytes(salt.words);
};
HNVEnc.prototype.do_lc_init_encrypt = function(password, keysize, salt){
		var _salt = {};
		_salt.sigBytes 	 = salt.length;
		_salt.words		 = convert.to_words(salt);	
		
		this.keySize = keysize;
		this.do_gen_key(password,_salt);
		
		if(this.key[0] < 0 )  this.Nb = (256 + this.key[0]) % 10 + 2;
		else
			this.Nb = (this.key[0] % 10 + 2);
		
		this.bPerBlock =  Math.floor(keysize/ this.Nb); 		
		
		this.do_gen_keyArray(1);
};
HNVEnc.prototype.do_lc_init_decrypt = function(password,keysize,salt){	
		var _salt = {};
		_salt.sigBytes 	 = salt.length;
		_salt.words		 = convert.to_words(salt);	

		
		this.keySize = keysize;		
		this.do_gen_key(password,_salt);
		
		if(this.key[0] < 0 )  this.Nb = (256 + this.key[0]) % 10 + 2;
		else
			this.Nb = (this.key[0] % 10 + 2);
		
		this.bPerBlock =  Math.floor(keysize/ this.Nb); 	
		
		this.do_gen_keyArray(-1);
};

HNVEnc.prototype.req_gen_mask = function(dataSize, blockLen){
		//recheck blockLen : co the blockLen -1
		var mask = new Array(dataSize);
		var nbBlock = Math.floor(dataSize/ blockLen) ;
		var size = nbBlock* blockLen;
		var newBlockLen = nbBlock;
		var pos	 = -1;
		for (var i=0; i<size;i++){
			var k = i%newBlockLen;
			if (k==0) pos++;
			mask[i] = k*blockLen+ pos;
		}
		for (i= size; i< dataSize; i++){
			mask[i] = i;			
		}
		return mask;
};

HNVEnc.prototype.req_mask = function(dataSize,blockLen){
		//recheck blockLen : co the blockLen -1		
		var mask = this.req_new_2DArray(2,dataSize);
		var nbBlock = Math.floor(dataSize/ blockLen) ;
		var newBlockLen = nbBlock;
		mask[0] = this.req_gen_mask(dataSize, blockLen);
		mask[1] = this.req_gen_mask(dataSize, newBlockLen);
		return mask;
};

HNVEnc.prototype.req_vtransform = function(data,mask){		
		var size = data.length;
		var res = new Array(size);
		for (var i=0;i<size; i++){			
			res[i] = data[mask[i]];
		}
		return res;
};

HNVEnc.prototype.req_array_copy = function(src,srcPos,dest,destPos,length){
	var i ;
	if(length > src.length) 
		return null;
	for(i = 0;i<length;i++){
	  dest[destPos + i] = src[srcPos + i]; 
	}
	return dest;	
};

HNVEnc.prototype.do_right_rotate = function(src, dest,begin,end,nbShift){		
		this.req_array_copy(src, end - nbShift  	, dest, begin			, nbShift );
		this.req_array_copy(src, begin				, dest, begin+nbShift	, end - nbShift - begin);		
};

HNVEnc.prototype.do_left_rotate = function(src, dest, begin, end, nbShift){	
		this.req_array_copy(src, begin + nbShift	, dest, begin		, end-begin -nbShift );		
		this.req_array_copy(src, begin 			, dest, end-nbShift	, nbShift );
};


HNVEnc.prototype.req_xor = function( a,  b) {	
		var length = a.length;
		if(length > b.length)
			length = b.length;
		var  out =[];
		for (var i = 0; i < a.length; i++) {
			out[i] =  (a[i] ^ b[i]);
		}
		return out;
};

HNVEnc.prototype.req_rotate = function(data, lenBlock, shiftBytes, direction){
		var maxLen = data.length;
		//block cuoi cung khong xoay
		var nbBlock = Math.floor(maxLen/lenBlock);
		var begin	= 0;
		var end		= lenBlock;
		var res	= data.slice();
		for (var i=0;i<nbBlock;i++){		
			if (direction[i] > 0) 
				this.do_right_rotate(data, res, begin, end, shiftBytes[i]);
			else 
				this.do_left_rotate(data, res, begin, end, shiftBytes[i]);
			begin 	+= lenBlock;
			end 	+= lenBlock;
		}		
		
		return res;
}

HNVEnc.prototype.req_lc_encrypt =function(data){

		var plaintext 	= String(data).utf8Encode();
		var inp = this.req_lc_covert_to_CharCode(plaintext);
		
		var cipher = this.req_padding(this.keySize,inp);
		var mask = this.req_mask(this.keySize, this.bPerBlock)
		
		var a = new Array(this.keySize);
		var pos = 0;				
		while (pos<cipher.length){
			this.req_array_copy(cipher, pos, a, 0, this.keySize);			
			var b = this.req_rotate(a,this.bPerBlock,this.shiftBytes,this.direct);
			var c = this.req_vtransform(b, mask[0]);
			var d = this.req_rotate(c,this.bPerBlock,this.shiftBytes,this.direct);	
			var e = this.req_xor(d,this.key);
			this.req_array_copy(e , 0, cipher, pos, this.keySize);			
			pos+=this.keySize;
		}	
		return Base64Binary.encode(cipher);
};

HNVEnc.prototype.req_lc_decrypt =function(data){
		
		var inp = Base64Binary.decode(data);
		
		var mask = this.req_mask(this.keySize, this.bPerBlock);
		var e = new Array(this.keySize);
		var pos = 0;
		while (pos<inp.length){
			this.req_array_copy(inp, pos, e, 0, this.keySize);
			var d = this.req_xor(e,this.key);
			var c = this.req_rotate(d,this.bPerBlock,this.shiftBytes,this.direct);
			var b = this.req_vtransform(c, mask[1]);						
			var a = this.req_rotate(b,this.bPerBlock,this.shiftBytes,this.direct);
			this.req_array_copy(a, 0, inp, pos, this.keySize);
			pos+=this.keySize;
		}
		inp = this.req_lc_unpadding(inp);
		return this.req_lc_covert_to_CodeChar(inp); 
		//return inp;
};

HNVEnc.prototype.req_lc_unpadding = function(data){
	
	var length = data.length;
	var i = length -1;
	while(i>0){
		if(data[i] == 0){
			if(data[i-1] == 128)
				break;
			else
			   i -= 1;
		}else
		break;
	}
	var res = [];
	if(i > 1)
		this.req_array_copy(data, 0, res, 0, i-1);
	else
		res = null;
	
	return res;
};

HNVEnc.prototype.req_lc_covert_to_CharCode = function(input){
	var result = [];
	for(var i = 0, length = input.length; i < length; i++) {
		var code = input.charCodeAt(i);
		// Since charCodeAt returns between 0~65536, simply save every character as 2-bytes
		result.push(code & 0xff);
	}
	return result;
}
HNVEnc.prototype.req_lc_covert_to_CodeChar = function(input){
		var result = [];
	for(var i = 0, length = input.length; i < length; i++) {
		var code = String.fromCharCode(input[i]);
		result.push(code);
	}
	return result.join("");
}


function req_gl_uintToString(uintArray) {
	var encodedString = String.fromCharCode.apply(String,uintArray);
	return encodedString;
}
	
function req_gl_stringToUint(string) {
		var string = btoa(unescape(encodeURIComponent(string))),
			charList = string.split(''),
			uintArray = [];
		for (var i = 0; i < charList.length; i++) {
			uintArray.push(charList[i].charCodeAt(0)& 255);
		}
		return uintArray;
}

		
if (typeof String.prototype.utf8Encode == 'undefined') {
	String.prototype.utf8Encode = function() {
		return unescape( encodeURIComponent( this ) );
	};
}

/* Extend String object with method to decode utf8 string to multi-byte */
if (typeof String.prototype.utf8Decode == 'undefined') {
	String.prototype.utf8Decode = function() {
		try {
			return decodeURIComponent( escape( this ) );
		} catch (e) {
			return this; // invalid UTF-8? return as-is
		}
	};
}

function toBytesInt32 (num) {
    var arr = new Uint8Array([
         (num & 0xff000000) >> 24,
         (num & 0x00ff0000) >> 16,
         (num & 0x0000ff00) >> 8,
         (num & 0x000000ff)
    ]);
    return arr;
}








