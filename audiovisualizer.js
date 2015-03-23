
var context = new AudioContext();

var audioBuffer;
var source;
var analyser;
var div_visual;
var barWidth;

function loadSound() {
  var request = new XMLHttpRequest();

  request.open('GET', 'Raksat_Atlas.mp3', true);
  request.responseType = 'arraybuffer';

  request.onload = function () {
    context.decodeAudioData(request.response, function (decodedData) {
      audioBuffer = decodedData;
      analyser = context.createAnalyser();
      analyser.fftSize = 256;
      playSound(audioBuffer);
    });
  };
  request.send();
}

function playSound(buffer) {
  source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(analyser);
  analyser.connect(context.destination);
  source.start(0);
  requestAnimationFrame(drawData);
}

function drawData() {
  var dataLength = analyser.frequencyBinCount;
  var arrayData = new Uint8Array(dataLength);
  analyser.getByteTimeDomainData(arrayData);

  barWidth = (div_visual.offsetWidth / dataLength);// * 2.5;
  barWidth -= (barWidth/10);
  console.log(div_visual.offsetWidth)
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < dataLength; i++) {
    var bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.width = barWidth + 'px';
    bar.style.height = arrayData[i] + 'px';
    fragment.appendChild(bar);
  }
  div_visual.innerHTML = '';
  div_visual.appendChild(fragment);
//  requestAnimationFrame(drawData);
}

function pause() {
  source.stop();
}

function play() {
  source.start();
}

window.onload = function () {
  div_visual = document.getElementById("visualization");
  loadSound();
};