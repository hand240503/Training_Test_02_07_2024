define(['jquery', 'hnv-secu/HNVEnc'],
		function($){

	var SecuController = function () {	
		var self 			= this;

		var fVar			= App['const'].FUNCT_SCOPE;
		var fName			= App['const'].FUNCT_NAME;
		var fParam			= App['const'].FUNCT_PARAM;

		var res_data_recv	= null;

//		var pwd				= "password123";
		var keysize			= 256;

		var salt			= null;

		this.do_lc_send_secu_layer = function(NetworkController, url, pwd, req_data_json, fSucces, fError, flag) {
			try {
				var req_data_str_init 		= JSON.stringify(req_data_json);
				//var req_data_str_init					= "Hello World!!! ! hg hkh jkhfdufhye u394y349  47389 uuyu love";
				//---------------------------------------------------------------------
				var enc 					= new HNVEnc();
				var sessionID 				=  App.data.session_id;
				salt 						= toBytesInt32(sessionID);
				////salt						= enc.req_lc_gen_salt(keysize);
				enc.do_lc_init_encrypt(pwd,keysize,salt);
				var req_data_str_enc		= enc.req_lc_encrypt(req_data_str_init);


				//---------------------------------------------------------------------
				var refParent				= {};
				refParent['session_id'	]	= App.data.session_id;
				refParent["flag"		]	= flag;	

				refParent["salt"		]	= Base64Binary.encode(salt);

				if		(flag == 0)			refParent["secu_data"	]	= req_data_json;
				else if	(flag == 1)			refParent["secu_data"	]	= req_data_str_enc;

				//---------------------------------------------------------------------
//				var f01 			= {};	
//				f01[fVar]			= null;	f01[fName]		= do_lc_receive_secu_layer;		f01[fParam]		= [res_data_recv];
//				fSucces.push(f01);

				//---------------------------------------------------------------------
				NetworkController.ajaxBackground(App.path.BASE_URL_API_PRIV, url, refParent, 100000, fSucces, fError);

			} catch(e) {
				console.log(e);
			}
		};

		this.do_lc_receive_secu_layer = function(sharedJson, pwd) {
			var res = sharedJson[App['const'].RES_DATA];
			try {
				var dec						= new HNVEnc();
				dec.do_lc_init_decrypt(pwd, keysize, salt);

				var res_data_str_decrypt 	= dec.req_lc_decrypt(res);

				//---------------------------------------------------------------------
				//convert str to JSON object for res_data
//				var res_data_json 			= JSON.parse(res_data_str_decrypt);
			} catch(e) {
				console.log(e);
			}

			return res_data_str_decrypt;
		};

		this.do_lc_read_file = function(inputFiles, outputDiv) {
			inputFiles.on("change", function(event) {				    
				//Check File API support
				if (window.File && window.FileList && window.FileReader) {

					var files = event.target.files; //FileList object
//					var output = document.getElementById("result");

					for (var i = 0; i < files.length; i++) {
						var file = files[i];
						//Only pics
//						if (!file.type.match('image.*')) continue;

						var reader = new FileReader();
						reader.onload = function(e){ 	
							var dataURL 		= e.target.result;

							var fileName		= file.name;
							var fileType		= file.type;

							var index 			= dataURL.indexOf(",");
							var strType			= dataURL.substring(0, index);
							var strDataInit 	= dataURL.substring(index+1);

							var strDataEncrypt	= self.do_lc_encrypt_file(strDataInit);
							var strDataDecrypt	= self.do_lc_decrypt_file(strDataEncrypt);

//							var div = document.createElement("span");
//							div.innerHTML = ["<p" + strDataDecrypt + "/p>"].join("");

//							outputDiv.insertBefore(div, null);
//							outputDiv.html(strDataDecrypt);
//							self.do_lc_write_file(fileName, strType, strDataDecrypt);
						};

						reader.readAsDataURL(file);
					}
				} else {
					console.log("Your browser does not support File API");
				}


			});
		}

		this.do_lc_write_file = function(fileName, strType, strData) {
			window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

			/*	var blob = new Blob([base64]);
				window.saveAs(blob, filename);
			 */

			// Handle errors
			function errorHandler(e) {
				var msg = '';
				switch (e.code) {
				case FileError.QUOTA_EXCEEDED_ERR:
					msg = 'QUOTA_EXCEEDED_ERR';
					break;
				case FileError.NOT_FOUND_ERR:
					msg = 'NOT_FOUND_ERR';
					break;
				case FileError.SECURITY_ERR:
					msg = 'SECURITY_ERR';
					break;
				case FileError.INVALID_MODIFICATION_ERR:
					msg = 'INVALID_MODIFICATION_ERR';
					break;
				case FileError.INVALID_STATE_ERR:
					msg = 'INVALID_STATE_ERR';
					break;
				default:
					msg = 'Unknown Error';
				break;
				};
				console.log('Error: ' + msg);
			}

			// Init and write some data to a file
			function onInitFs(fs) {
				fs.root.getFile(fileName+'.enc', {create: true}, function(fileEntry) {
					fileEntry.isFile === true;
					fileEntry.name == fileName+'.enc';
					fileEntry.fullPath == 'D:/'+fileName+'.enc';
					// Create a FileWriter object for our FileEntry (log.txt).
					fileEntry.createWriter(function(fileWriter) {
						fileWriter.onwriteend = function(e) {
							console.log('Write completed.');
						};
						fileWriter.onerror = function(e) {
							console.log('Write failed: ' + e);
						};
						// Create a new Blob and write it to log.txt.
						if (!window.BlobBuilder && window.WebKitBlobBuilder)
							window.BlobBuilder = window.WebKitBlobBuilder; // in Chrome 12.
						var bb = new BlobBuilder(); 
//						bb.append("some stuff");
						console.log("bb size:"+bb.size);
//						bb.append('put some nice text in our file....');
						bb.append(strData);
//						var ourData = bb.getBlob('text/plain');
						var ourData = bb.getBlob(strType);
						fileWriter.write(ourData); 
					}, errorHandler);
				}, errorHandler);
			}

			// start the party
			$(function() {
//				document.getElementById('hello').innerHTML = 'start the tests';
				window.requestFileSystem(window.PERSISTENT, 5*1024*1024, onInitFs, errorHandler);
			});
		}



		//--------------------------------------------------------

		this.do_lc_encrypt_file = function(strData, pwd) {	
			var strDataEncrypt = null;
			try {
				var enc 		= new HNVEnc();
				salt		= enc.req_lc_gen_salt(keysize);         	
				enc.do_lc_init_encrypt(pwd, keysize, salt);

				strDataEncrypt	= enc.req_lc_encrypt(strData);
			} catch(e) {
				console.log(e);
			}
			return strDataEncrypt;
		};

		this.do_lc_decrypt_file = function(strData, pwd) {
			var strDataDecrypt = null;

			try {
				var dec			= new HNVEnc();
				dec.do_lc_init_decrypt(pwd, keysize, salt);

				strDataDecrypt 	= dec.req_lc_decrypt(strData);

			} catch(e) {
				console.log(e);
			}

			return strDataDecrypt;
		};


		//----------------------------------------------------------
		this.do_lc_encrypt_str = function(strData, sessionID, pwd) {	
			var strDataEncrypt = null;
			try {
				var enc 		= new HNVEnc();
				salt 			= toBytesInt32(sessionID);       	        	
				enc.do_lc_init_encrypt(pwd, keysize, salt);

				strDataEncrypt	= enc.req_lc_encrypt(strData);	
			} catch(e) {
				console.log(e);
			}
			return strDataEncrypt;
		};

		this.do_lc_decrypt_str = function(strData, sessionID, pwd) {
			var strDataDecrypt = null;

			try {
				var dec			= new HNVEnc();
				salt 			= toBytesInt32(sessionID); 
				dec.do_lc_init_decrypt(pwd, keysize, salt);

				strDataDecrypt 	= dec.req_lc_decrypt(strData);

			} catch(e) {
				console.log(e);
			}

			return strDataDecrypt;
		};

		//----------------------------------------------------------
		this.do_lc_encrypt_str_withAES = function(strData, pwd) {	
			const keySize 		= 256;
			const ivSize 		= 128;
			const iterations 	= 100;

			function encrypt (msg, pass) {
				let salt 		= CryptoJS.lib.WordArray.random(128/8);

				let key 		= CryptoJS.PBKDF2(pass, salt, {
					keySize: keySize/32,
					iterations: iterations
				});

				let iv 			= CryptoJS.lib.WordArray.random(128/8);

				let encrypted 	= CryptoJS.AES.encrypt(msg, key, { 
					iv: iv, 
					padding: CryptoJS.pad.Pkcs7,
					mode: CryptoJS.mode.CBC

				});

				// salt, iv will be hex 32 in length
				// append them to the ciphertext for use  in decryption
				let transitmessage = salt.toString()+ iv.toString() + encrypted.toString();
				return transitmessage;
			}
			
			let encrypted = encrypt(strData, pwd);
			
			return encrypted;
		};
		
		this.do_lc_decrypt_str_withAES = function(encrypted, pwd) {	
			const keySize 		= 256;
			const ivSize 		= 128;
			const iterations 	= 100;
			
			function decrypt (transitmessage, pass) {
				let salt 		= CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
				let iv 			= CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
				let encrypted 	= transitmessage.substring(64);

				let key 		= CryptoJS.PBKDF2(pass, salt, {
					keySize: keySize/32,
					iterations: iterations
				});

				let decrypted 	= CryptoJS.AES.decrypt(encrypted, key, { 
					iv: iv, 
					padding: CryptoJS.pad.Pkcs7,
					mode: CryptoJS.mode.CBC

				})
				return decrypted.toString(CryptoJS.enc.Utf8) ;
			}
			
			let decrypted 		= decrypt(encrypted, pwd);

			return decrypted;
		};
		// Code goes here

	};

	return SecuController;
});