
var context = new AudioContext();

var audioBuffer;

var request = new XMLHttpRequest();

request.open('GET', 'Raksat_Atlas.mp3', true);
request.responseType = 'arraybuffer';

request.onload = function() {
  context.decodeAudioData(request.response, function(decodedData) {
    audioBuffer = decodedData;
  });
};

request.send();