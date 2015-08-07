// Preset for the Clockwork engine
// Arcadio Garcia Salvadores

//See http://rjs.azurewebsites.net/ for the original example

var W10API = W10API || [];
W10API.push({
    name: "camera",
    events: [
        {
            name: "takePicture", code: function (event) {

                if (typeof Windows != 'undefined') {

                    //var captureUI = new Windows.Media.Capture.CameraCaptureUI();

                    ////Set the format of the picture that's going to be captured (.png, .jpg, ...)

                    //captureUI.photoSettings.format = Windows.Media.Capture.CameraCaptureUIPhotoFormat.png;

                    //captureUI.photoSettings.croppedAspectRatio.height = 1;
                    //captureUI.photoSettings.croppedAspectRatio.width = 1;

                    ////Pop up the camera UI to take a picture

                    //captureUI.captureFileAsync(Windows.Media.Capture.CameraCaptureUIMode.photo).then(function (capturedItem) {
                    //    event.callback(URL.createObjectURL(capturedItem));
                    //});


                    var mediaCaptureMgr = new Windows.Media.Capture.MediaCapture();

                    var captureInitSettings = null;
                    captureInitSettings =
                        new Windows.Media.Capture.MediaCaptureInitializationSettings();
                    captureInitSettings.audioDeviceId = "";
                    captureInitSettings.videoDeviceId = "";
                    captureInitSettings.photoCaptureSource =
                        Windows.Media.Capture.PhotoCaptureSource.auto;
                    captureInitSettings.streamingCaptureMode =
                        Windows.Media.Capture.StreamingCaptureMode.video;
                    mediaCaptureMgr.initializeAsync(captureInitSettings).done(function (result) {

                        // do we have a camera and a microphone present? 
                        if (mediaCaptureMgr.mediaCaptureSettings.videoDeviceId) {

                            var photoFile = "cameraPic.jpg";
                            // Create the file that will be used to store the picture 
                             Windows.Storage.ApplicationData.current.localFolder.createFileAsync(photoFile,
                                    Windows.Storage.CreationCollisionOption.generateUniqueName).then(function (newFile) {

                                        photoStorage = newFile;
                                        var photoProperties =
                                            Windows.Media.MediaProperties.ImageEncodingProperties.createJpeg();

                                        // Capture the photo 
                                        mediaCaptureMgr.capturePhotoToStorageFileAsync(photoProperties,
                                                photoStorage).done(function (result) {


                                                    event.callback(URL.createObjectURL(photoStorage));

                                                    // Error handling for photo capture 
                                                }, function capturePhotoError(error) {

                                                });

                                        // Error handling for file creation 
                                    }, function (error) {

                                    });
                        }
                    });
                }

            }
        }
    ]
});

