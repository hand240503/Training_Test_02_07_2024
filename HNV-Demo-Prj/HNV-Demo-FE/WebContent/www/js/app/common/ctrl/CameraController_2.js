define([
//'jquery',
'text!common/tmpl/CMS_Camera.html'
],
function(
//		$, 
		TmplCamera) {

	var CameraController = function(customSelector) {
		var tmplName		= App.template.names;
		var tmplCtrl		= App.template.controller;


		var self = this;

		var camera; // Initialized at the end

		var defaultSelector = {};
		defaultSelector["div_camera_info"		]	= "#camera_info";
		defaultSelector["div_stream_stats"		]	= "#stream_stats";
		defaultSelector["div_camera"			]	= "#camera";
		defaultSelector["div_take_snapshots"	]	= "#take_snapshots";
		defaultSelector["div_take_snapshots"	]	= "#take_snapshots";
		defaultSelector["div_show_stream"		]	= "#show_stream";
		defaultSelector["div_snapshots"			]	= "#snapshots";
		defaultSelector["div_discard_snapshot"	]	= "#discard_snapshot";
		defaultSelector["div_upload_snapshot"	]	= "#upload_snapshot";
		defaultSelector["div_api_url"			]	= "#api_url";
		defaultSelector["div-loader"			]	= "#loader";
		defaultSelector["div_upload_status"		]	= "#upload_status";
		defaultSelector["div_upload_result"		]	= "#upload_result";

		var videoElement, audioInputSelect, audioOutputSelect, videoSelect, selectors;
		var btn01, btn02, btn03, btn04;
		var snapshots;


		try {
			this.do_lc_init = function() {
				tmplCtrl.do_lc_put_tmpl(tmplName.CMS_CAMERA				, TmplCamera);
			}



			this.do_lc_show = function(fileinputObj, avatar) {
				self.do_lc_init();

//				var opts = [300, 300, 0];

//				capture (successCallback, errorCallback, opts, fileinputObj);

				App.MsgboxController.do_lc_show({
					title		: "",
					content 	: tmplCtrl.req_lc_compile_tmpl(tmplName.CMS_CAMERA, {}),
					buttons		: "none",
					autoclose	: false,
					width		: "50vw",
					height		: "50vh",
					bindEvent: function() {
					}
				});


				videoElement = document.querySelector('video#camera');
				audioInputSelect = document.querySelector('select#audioSource');
				audioOutputSelect = document.querySelector('select#audioOutput');
				videoSelect = document.querySelector('select#videoSource');
				selectors = [audioInputSelect, audioOutputSelect, videoSelect];
				btn01 = document.querySelector('button#take_snapshot');
				btn02 = document.querySelector('button#record_snapshot');
				btn03 = document.querySelector('button#discard_snapshot');
				btn04 = document.querySelector('button#upload_snapshot');
				snapshots = document.querySelector('div#snapshots');


				audioOutputSelect.disabled = !('sinkId' in HTMLMediaElement.prototype);

				navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

				audioInputSelect.onchange = start;
				audioOutputSelect.onchange = changeAudioDestination;
				videoSelect.onchange = start;
				
				btn01.onclick = function() {
					var canvas = document.createElement('canvas');
					
					canvas.width = videoElement.videoWidth;
					canvas.height = videoElement.videoHeight;
					canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);
					
					// convert image stored in canvas to base64 encoded image
					var imageData = null; //canvas.toDataURL('image/png');

					var typeData = 0;

					if(typeData == 0) {	//blob
						addToSnapShots(canvas);
//						canvasBlobToFileInput(canvas, fileinputObj);
					} else {			//base64
						imageData = canvas.toDataURL('image/png');
					}
					
//					stop();
				};

				start();

			}

			//--------------------------------------------------------------------------------
			function gotDevices(deviceInfos) {
				// Handles being called several times to update labels. Preserve values.
				var values = selectors.map(function(select) {
					return select.value;
				});
				selectors.forEach(function(select) {
					while (select.firstChild) {
						select.removeChild(select.firstChild);
					}
				});
				for (var i = 0; i !== deviceInfos.length; ++i) {
					var deviceInfo = deviceInfos[i];
					var option = document.createElement('option');
					option.value = deviceInfo.deviceId;
					if (deviceInfo.kind === 'audioinput') {
						option.text = deviceInfo.label ||
						'microphone ' + (audioInputSelect.length + 1);
						audioInputSelect.appendChild(option);
					} else if (deviceInfo.kind === 'audiooutput') {
						option.text = deviceInfo.label || 'speaker ' +
						(audioOutputSelect.length + 1);
						audioOutputSelect.appendChild(option);
					} else if (deviceInfo.kind === 'videoinput') {
						option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
						videoSelect.appendChild(option);
					} else {
						console.log('Some other kind of source/device: ', deviceInfo);
					}
				}
				selectors.forEach(function(select, selectorIndex) {
					if (Array.prototype.slice.call(select.childNodes).some(function(n) {
						return n.value === values[selectorIndex];
					})) {
						select.value = values[selectorIndex];
					}
				});
			}

			//--------------------------------------------------------------------------------
			// Attach audio output device to video element using device/sink ID.
			function attachSinkId(element, sinkId) {
				if (typeof element.sinkId !== 'undefined') {
					element.setSinkId(sinkId)
					.then(function() {
						console.log('Success, audio output device attached: ' + sinkId);
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
			function gotStream(stream) {
				window.stream = stream; // make stream available to console
				videoElement.srcObject = stream;
				// Refresh button list in case labels have become available
				return navigator.mediaDevices.enumerateDevices();
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
				then(gotStream).then(gotDevices).catch(handleError);
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
			function handleError(error) {
				console.log('navigator.getUserMedia error: ', error);
			}
			
			//--------------------------------------------------------------------------------
			function addToSnapShots(element) {
				element.classList.add("item");
				
				var container 		= document.getElementById('snapshots').appendChild(element); //snapshots.innerHTML += element;
				var camera 			= videoElement;
				var camera_ratio 	= camera.videoWidth / camera.videoHeight;

				var height 			= container.height;
				element.style.height = "" + height + "px";
				element.style.width = "" + Math.round(camera_ratio * height) + "px";

				var scroll = container.classList[0].scrollWidth - container.innerWidth;

				var id = setInterval(frame, 200);
				function frame() {
//					if (pos == 350) {
//						clearInterval(id);
//					} else {
						container.scrollLeft = scroll; 
//					}
				}
			}
			
			//--------------------------------------------------------------------------------
			function canvasBlobToFileInput(canvas, fileinputObj) {
				if (typeof canvas.toBlob !== "undefined") {
					canvas.toBlob(function(blob) {
						blob.name = (new Date()).getTime() + ".jpeg";
						fileinputObj.readFiles([blob]);    		 
					}, "image/jpeg", 0.75);

				} else if (typeof canvas.msToBlob !== "undefined") {
					var blob = canvas.msToBlob()
					// send blob
					blob.name = (new Date()).getTime() + ".jpeg";
					fileinputObj.readFiles([blob]); 
				}
				
				fileinputObj.refresh();
				App.MsgboxController.do_lc_close();
			}
			
		} catch (e) {
			console.log(e);
		}

	}

	return CameraController;

});


