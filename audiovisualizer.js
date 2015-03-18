
var context = new AudioContext();

var audioBuffer;
var gainNode;

function loadSound() {
  var request = new XMLHttpRequest();

  request.open('GET', 'Raksat_Atlas.mp3', true);
  request.responseType = 'arraybuffer';

  request.onload = function () {
    context.decodeAudioData(request.response, function (decodedData) {
      audioBuffer = decodedData;
      console.log(audioBuffer.duration / 60);
//      playSound(audioBuffer);
    });
  };
  request.send();
}

function playSound(buffer) {
  var source = context.createBufferSource();
  gainNode = context.createGain();
  source.buffer = buffer;
  source.connect(gainNode);
  gainNode.connect(context.destination);
  source.start(0);
  gainNode.gain.value = .5;
}

window.onload = function () {
  loadSound();
  document.getElementById('volume').value = 50;
  document.getElementById('volume').addEventListener('change', function(event) {
    var vol = event.target.value;
    gainNode.gain.value = vol / 100;
  })
}