define([
		'jquery',
		'text!common/tmpl/CMS_Camera.html',
		
		'common/ctrl/MsgboxController'
		],
	function(
			$, 
			TmplCamera,
			
			MsgboxController) {

	var CameraController = function(customSelector) {
		var imageExtension	= "jpg";
		var videoExtension	= "webm";
		
		if (!App.MsgboxController){
			App.MsgboxController  = new MsgboxController();
		}
		
		var tmplName		= App.template.names;
		var tmplCtrl		= App.template.controller;

		var self = this;

		var camera; // Initialized at the end

		var defaultSelector = {};
		defaultSelector["div_audio_input"		]	= "select#audioSource";
		defaultSelector["div_audio_output"		]	= "select#audioOutput";
		defaultSelector["div_video_input"		]	= "select#videoSource";
		defaultSelector["div_video_input_btns"	]	= "div#videoSourceBtns";
		defaultSelector["div_camera"			]	= "video#camera";
		defaultSelector["div_take_snapshot"		]	= "button#take_snapshot";
		defaultSelector["div_record_snapshot"	]	= "button#record_snapshot";
		defaultSelector["div_snapshots"			]	= "div#snapshots";
		defaultSelector["div_discard_snapshot"	]	= "button#discard_snapshot";
		defaultSelector["div_upload_snapshot"	]	= "button#upload_snapshot";
//		defaultSelector["div_camera_info"		]	= "#camera_info";
//		defaultSelector["div_stream_stats"		]	= "#stream_stats";
//		defaultSelector["div_show_stream"		]	= "#show_stream";	
//		defaultSelector["div_api_url"			]	= "#api_url";
//		defaultSelector["div_loader"			]	= "#loader";
//		defaultSelector["div_upload_status"		]	= "#upload_status";
//		defaultSelector["div_upload_result"		]	= "#upload_result";
		
		if(!customSelector)	customSelector = {};
		var selector = $.extend(true, {}, defaultSelector, customSelector);
		
		var videoElement, audioInputSelect, audioOutputSelect, videoSelect, selectors;
		var btn01, btn02, btn03, btn04;
		var snapshots;
		
		//--------------------------------------------------------------------------------
		var mediaSource;
		
		var recordedVideo, playButton, downloadButton;
		
		var mediaRecorder;
		var recordedBlobs;
		var sourceBuffer;

		// window.isSecureContext could be used for Chrome
//		var isSecureOrigin = location.protocol === 'https:' || location.hostname === 'localhost';
//		if (!isSecureOrigin) {
//			alert('getUserMedia() must be run from a secure origin: HTTPS or localhost.' +
//			'\n\nChanging protocol to HTTPS');
//			//location.protocol = 'HTTPS';
//		}

		try {	
			this.do_lc_init = function() {
				tmplCtrl.do_lc_put_tmpl(tmplName.CMS_CAMERA				, TmplCamera);
			}

			this.do_lc_show = function(fileinputObj, avatar) {
				self.do_lc_init();

				App.MsgboxController.do_lc_show({
					title		: "",
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.CMS_CAMERA, {}),
					buttons		: "none",
					autoclose	: false,
					width		: window.innerWidth<500?"95%":"50%",
					height		: window.innerHeight<500?"90%":"60%",
					onClose		: function() {
						stop();
					},
					bindEvent: function() {
						initCamera(fileinputObj, avatar);
					}
				});
			}

			//--------------------------------------------------------------------------------
			function initCamera(fileinputObj, avatar) {
				videoElement		= document.querySelector(selector.div_camera);
				audioInputSelect 	= document.querySelector(selector.div_audio_input);
				audioOutputSelect 	= document.querySelector(selector.div_audio_output);
				videoSelect 		= document.querySelector(selector.div_video_input);
				videoButtons 		= document.querySelector(selector.div_video_input_btns);
				selectors 			= [audioInputSelect, audioOutputSelect, videoSelect];
				snapshots 			= document.querySelector(selector.div_snapshots);
				btn01 				= document.querySelector(selector.div_take_snapshot);
				btn02 				= document.querySelector(selector.div_record_snapshot);
				btn03 				= document.querySelector(selector.div_discard_snapshot);
				btn04 				= document.querySelector(selector.div_upload_snapshot);
				
				//---Devices event-----------------------------------
				audioOutputSelect.disabled = !('sinkId' in HTMLMediaElement.prototype);

				audioInputSelect.onchange = start;
				audioOutputSelect.onchange = changeAudioDestination;
				videoSelect.onchange = start;
				
				$(videoButtons).on("click", "button", function() {
					//event onchange select
					videoSelect.value = $(this).attr("data-value");
					videoSelect.dispatchEvent(new Event('change'));
				});
				
				//---Take snapshot-----------------------------------
				$(btn01).click(function() {takeSnapshot(1,fileinputObj,avatar)});
				
				$(snapshots).on("click", ".itemCamera", function() {
					$(this).toggleClass("selected");
				});
				
				$(btn03).click(function() {discardSnapshot()});
				$(btn04).click(function() {uploadSnapshot(fileinputObj, avatar);});
				
				//---Record snapshot---------------------------------
				mediaSource = new MediaSource();
				mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
				
				
//				recordedVideo 		= document.querySelector('video#recorded');
//				playButton 			= document.querySelector('button#play');
//				downloadButton 		= document.querySelector('button#download');

				$(btn02).click(function() {toggleRecording(fileinputObj, avatar)});
//				playButton.onclick 		= play;
//				downloadButton.onclick 	= download;
				
				//---------------------------------------------------
				start();
			}

			//********************************************************************************
			//--------------------------------------------------------------------------------
			// Attach audio output device to video element using device/sink ID.
			function attachSinkId(element, sinkId) {
				if (typeof element.sinkId !== 'undefined') {
					element.setSinkId(sinkId)
					.then(function() {
//						console.log('Success, audio output device attached: ' + sinkId);
					})
					.catch(function(error) {
						var errorMessage = error;
						if (error.name === 'SecurityError') {
							errorMessage = 'You need to use HTTPS for selecting audio output ' +
							'device: ' + error;
						}
						console.error(errorMessage);
						// Jump back to first output device in the list as it's the default.
						audioOutputSelect.selectedIndex = 0;
					});
				} else {
					console.warn('Browser does not support output device selection.');
				}
			}

			//--------------------------------------------------------------------------------
			function changeAudioDestination() {
				var audioDestination = audioOutputSelect.value;
				attachSinkId(videoElement, audioDestination);
			}

			//--------------------------------------------------------------------------------		
			function start() {
				if (window.stream) {
					window.stream.getTracks().forEach(function(track) {
						track.stop();
					});
				}
				var audioSource = audioInputSelect.value;
				var videoSource = videoSelect.value;
				var constraints = {
						audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
						video: {deviceId: videoSource ? {exact: videoSource} : undefined}
				};
				
//				var targetWidth = targetWidth === -1 ? 50 : targetWidth;
//			    var targetHeight = targetHeight === -1 ? 50 : targetHeight;
//				
//				constraints.video.width = targetWidth;
//				constraints.video.height = targetHeight;
				
				navigator.mediaDevices.getUserMedia(constraints).
				then(handleSuccess).then(handleDevices).catch(handleError);

			}
			
			//--------------------------------------------------------------------------------
			function stop() {
				// stop video stream.
				// Note that MediaStream.stop() is deprecated as of Chrome 47.
				if (window.stream.stop) {
					window.stream.stop();
				} else {
					window.stream.getTracks().forEach(function (track) {
						track.stop();
					});
				}
			}
			
			//--------------------------------------------------------------------------------
			function handleSuccess(stream) {
				window.stream = stream; // make stream available to console
				videoElement.srcObject = stream;
				// Refresh button list in case labels have become available
				
				btn02.disabled = false;
//				console.log('getUserMedia() got stream: ', stream);
				
				return navigator.mediaDevices.enumerateDevices();
			}
			
			//--------------------------------------------------------------------------------
			function handleDevices(deviceInfos) {
				// Handles being called several times to update labels. Preserve values.
				var values = selectors.map(function(select) {
					return select.value;
				});
				selectors.forEach(function(select) {
					while (select.firstChild) {
						select.removeChild(select.firstChild);
					}
				});
				
				//Make empty video source buttons (rebuild)
				if(!$(videoButtons).is(':empty'))	
					$(videoButtons).html('');
				
				for (var i = 0; i !== deviceInfos.length; ++i) {
					var deviceInfo = deviceInfos[i];
					var option = document.createElement('option');
					option.value = deviceInfo.deviceId;
					if (deviceInfo.kind === 'audioinput') {
						option.text = deviceInfo.label || 'microphone ' + (audioInputSelect.length + 1);
						audioInputSelect.appendChild(option);
					} else if (deviceInfo.kind === 'audiooutput') {
						option.text = deviceInfo.label || 'speaker ' 	+ (audioOutputSelect.length + 1);
						audioOutputSelect.appendChild(option);
					} else if (deviceInfo.kind === 'videoinput') {
						option.text = deviceInfo.label || 'camera ' 	+ (videoSelect.length + 1);
						videoSelect.appendChild(option);

						//Build video source buttons
						var btn = $('<button class="btn" style="margin: 0 1% 1%;"><i class="fa fa-exchange"></i></button>');
						btn.attr("data-value", option.value);
						btn.attr("data-text", option.text);
						$(videoButtons).append(btn);	
						
					} else {
//						console.log('Some other kind of source/device: ', deviceInfo);
					}
				}
				selectors.forEach(function(select, selectorIndex) {
					if (Array.prototype.slice.call(select.childNodes).some(function(n) {
						return n.value === values[selectorIndex];
					})) {
						select.value = values[selectorIndex];
					}
				});
				
				//Event video source buttons
				$(selector.div_video_input_btns).find("[data-value='" + videoSelect.value + "']").addClass("btn-danger");
				
			}

			//--------------------------------------------------------------------------------
			function handleError(error) {
				console.log('navigator.getUserMedia error: ', error);
			}
			
			//--------------------------------------------------------------------------------
			function takeSnapshot(count, fileinputObj, avatar) {
				var canvas = document.createElement('canvas');
				
				canvas.width = videoElement.videoWidth;
				canvas.height = videoElement.videoHeight;
				canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);
				
				// convert image stored in canvas to base64 encoded image
				var imageData = null; //canvas.toDataURL('image/png');

				var typeData = 0;

				if(typeData == 0) {	//blob
					addToSnapshot(canvas);
//					canvasBlobToFileInput(canvas, fileinputObj);
				} else {			//base64
					imageData = canvas.toDataURL('image/png');
				}
				
//				stop();
				
				if (count > 1) {
					setTimeout(function() {takeSnapshot(count - 1);}, 500);
				}
				
				$(selector.div_snapshots).hide();
				uploadSnapshot(fileinputObj, avatar);
			}
			
			//**********************************************************************************
			//**********************************************************************************
			//**********************************************************************************
//			function handleSuccess(stream) {
//				btn02.disabled = false;
//				console.log('getUserMedia() got stream: ', stream);
//				window.stream = stream;
//				gumVideo.srcObject = stream;
//			}


			function handleSourceOpen(event) {
//				console.log('MediaSource opened');
				sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
//				console.log('Source buffer: ', sourceBuffer);
			}
	
	//		recordedVideo.addEventListener('error', function(ev) {
	//			console.error('MediaRecording.recordedMedia.error()');
	//			alert('Your browser can not play\n\n' + recordedVideo.src
	//					+ '\n\n media clip. event: ' + JSON.stringify(ev));
	//		}, true);
	
			function handleDataAvailable(event) {
				if (event.data && event.data.size > 0) {
					recordedBlobs.push(event.data);
				}
			}
	
			function handleStop(event) {
//				console.log('Recorder stopped: ', event);
			}
	
			function toggleRecording(fileinputObj, avatar) {	
				if ($(btn02).attr("data-text") !== 'Stop Recording') {
					startRecording();
				} else {
					stopRecording(fileinputObj, avatar);
					$(btn02).attr("data-text", "Start Recording");
					
	//				playButton.disabled = false;
	//				downloadButton.disabled = false;
				}
			}
	
			function startRecording() {
				recordedBlobs = [];
				var options = {mimeType: 'video/webm;codecs=vp9'};
				if (!MediaRecorder.isTypeSupported(options.mimeType)) {
					console.log(options.mimeType + ' is not Supported');
					options = {mimeType: 'video/webm;codecs=vp8'};
					if (!MediaRecorder.isTypeSupported(options.mimeType)) {
						console.log(options.mimeType + ' is not Supported');
						options = {mimeType: 'video/webm'};
						if (!MediaRecorder.isTypeSupported(options.mimeType)) {
							console.log(options.mimeType + ' is not Supported');
							options = {mimeType: ''};
						}
					}
				}
				try {
					mediaRecorder = new MediaRecorder(window.stream, options);
				} catch (e) {
					console.error('Exception while creating MediaRecorder: ' + e);
					alert('Exception while creating MediaRecorder: '
							+ e + '. mimeType: ' + options.mimeType);
					return;
				}
//				console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
				
				$(btn02).attr("data-text", "Stop Recording");
				$(btn02).empty().append('<i class="fa fa-stop"></i>');
				
				btn01.disabled = true;
	//			playButton.disabled = true;
	//			downloadButton.disabled = true;
				
				mediaRecorder.onstop = handleStop;
				mediaRecorder.ondataavailable = handleDataAvailable;
				mediaRecorder.start(10); // collect 10ms of data
//				console.log('MediaRecorder started', mediaRecorder);
			}
	
			function stopRecording(fileinputObj, avatar) {
				mediaRecorder.stop();
//				console.log('Recorded Blobs: ', recordedBlobs);
	//			recordedVideo.controls = true;
				
				$(btn02).empty().append('<i class="fa fa-video-camera"></i>');
				btn01.disabled = false;
	
				var superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
				var video 		= document.createElement('video');
				video.src		= window.URL.createObjectURL(superBuffer);
//				if(!video.bufferValue)	video.bufferValue = null;
				video.bufferValue =	superBuffer;
	
				addToSnapshot(video);
				uploadSnapshot(fileinputObj, avatar);
			}
	
//			function play() {
//				var superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
//				recordedVideo.src = window.URL.createObjectURL(superBuffer);
//				// workaround for non-seekable video taken from
//				// https://bugs.chromium.org/p/chromium/issues/detail?id=642012#c23
//				recordedVideo.addEventListener('loadedmetadata', function() {
//					if (recordedVideo.duration === Infinity) {
//						recordedVideo.currentTime = 1e101;
//						recordedVideo.ontimeupdate = function() {
//							recordedVideo.currentTime = 0;
//							recordedVideo.ontimeupdate = function() {
//								delete recordedVideo.ontimeupdate;
//								recordedVideo.play();
//							};
//						};
//					}
//				});
//			}
	
//			function download() {
//				var blob = new Blob(recordedBlobs, {type: 'video/webm'});
//				var url = window.URL.createObjectURL(blob);
//				var a = document.createElement('a');
//				a.style.display = 'none';
//				a.href = url;
//				a.download = 'test.webm';
//				document.body.appendChild(a);
//				a.click();
//				setTimeout(function() {
//					document.body.removeChild(a);
//					window.URL.revokeObjectURL(url);
//				}, 100);
//			}
			
			//--------------------------------------------------------------------------------
			function addToSnapshot(element) {	
				$(element).addClass("itemCamera");

				var $container = $(selector.div_snapshots).append(element);
				var $camera = $(selector.div_camera);
				var camera_ratio = $camera.innerWidth() / $camera.innerHeight();

				var height = $container.height();
				element.style.height = "" + height + "px";
				element.style.width = "" + Math.round(camera_ratio * height) + "px";

				var scroll = $container[0].scrollWidth - $container.innerWidth();

				$container.animate({
					scrollLeft: scroll
				}, 200);
				
			}
			
			function discardSnapshot() {
				//first element is selected
				var lstEleSelected 	= $(selector.div_snapshots).find(".itemCamera.selected");
				var lstEle 			= $(selector.div_snapshots).find(".itemCamera");
				
				if (lstEleSelected.length <= 0) $(lstEle[0]).addClass("selected");
				
				var element = $(".itemCamera.selected").removeClass("itemCamera selected");

				var next = element.nextAll(".itemCamera").first();

				if (!next.size()) {
					next = element.prevAll(".itemCamera").first();
				}

				if (next.size()) {
					next.addClass("selected");
				}

				element.hide("slow", function() {$(this).remove()});
			};
			
			function uploadSnapshot(fileinputObj, avatar) {
				var lstEleSelected 	= $(selector.div_snapshots).find(".itemCamera.selected");
				var lstEle 			= $(selector.div_snapshots).find(".itemCamera");
				
				if (lstEleSelected.length == 0) {
					// if(avatar == true) {
					// 	alert("Please select only one image to use avatar!");
					// 	return;
					// }
					
					lstEleSelected = lstEle;

				}
				if (lstEle.length == 0) return;
				
				for (var i=0; i<lstEleSelected.length; i++){
					try {
						elementBlobToFileInput(lstEleSelected[i], fileinputObj);
			
					} catch (e) {
						console.log(e);
					}
					
				}
				
//				fileinputObj.refresh();
				App.MsgboxController.close();
//				stop();
			}
			
			//--------------------------------------------------------------------------------
			function elementBlobToFileInput(element, fileinputObj) {
				//Remove drag & drop class style
				fileinputObj.$container.find('.file-drop-zone .' + fileinputObj.dropZoneTitleClass).remove();

				if (typeof element.toBlob !== "undefined") {
					element.toBlob(function(blob) {
						blob.name = (new Date()).getTime() + "."+imageExtension;
						fileinputObj.readFiles([blob]);
					}, "image/jpeg", 0.75);

				} else if (typeof element.msToBlob !== "undefined") {
					var blob = element.msToBlob();
					// send blob
					blob.name = (new Date()).getTime() + "."+imageExtension;
					fileinputObj.readFiles([blob]);
				} else {	//video
					var blob = element.bufferValue;
					blob.name = (new Date()).getTime() + "."+videoExtension;
					fileinputObj.readFiles([blob]);
				}
			}
			
			
		} catch (e) {
			console.log(e);
		}


	}

	return CameraController;

});


