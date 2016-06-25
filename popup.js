window.addEventListener("DOMContentLoaded", function() {
  // Grab elements, create settings, etc.
  var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    video = document.getElementById("video"),
    videoObj = { "video": true },
    errBack = function(error) {
      console.log("Video capture error: ", error.code); 
    };

  // Put video listeners into place
  if (navigator.getUserMedia) { // Standard
    navigator.getUserMedia(videoObj, function(stream) {
      video.src = stream;
      video.play();
    }, errBack);
  } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
    navigator.webkitGetUserMedia(videoObj, function(stream){
      video.src = window.webkitURL.createObjectURL(stream);
      video.play();
    }, errBack);
  }
  else if(navigator.mozGetUserMedia) { // Firefox-prefixed
    navigator.mozGetUserMedia(videoObj, function(stream){
      video.src = window.URL.createObjectURL(stream);
      video.play();
    }, errBack);
  }

  document.getElementById("snap").addEventListener("click", function() {
    context.drawImage(video, 0, 0, 640, 480);
  });

  document.getElementById("verify").addEventListener("click", function() {
    var API_KEY = "b067f2e6c5344252b40d9ee0f682fe4f";

    // first get the faceID
    var params = {
      "returnFaceId": "true",
    };

    // get the picture from the canvas before sending it
    var image  = new Image();
    var canvas = document.getElementById("canvas");
    var enc_img = canvas.toDataURL();
    var enc_img = enc_img.replace(/^data:image\/(png|jpg);base64,/, "");

    $.ajax({
      url: "https://api.projectoxford.ai/face/v1.0/detect?" + $.param(params),
      beforeSend: function(xhrObj){
        // Request headers
        xhrObj.setRequestHeader("Content-Type","application/octet-stream");
        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", API_KEY);
      },
      type: "POST",
      // Request body

      data: enc_img,
    })

    .done(function(data) {
      alert(data);
    })

    .fail(function(error) {
      alert(error);
    });

  });

}, false);
