
var context = new AudioContext();

var audioBuffer;
var source;
var analyser;
var div_visual;
var barWidth;
var bars = [];

function loadSound() {
  var request = new XMLHttpRequest();

  request.open('GET', 'music.mp3', true);
  request.responseType = 'arraybuffer';

  request.onload = function () {
    context.decodeAudioData(request.response, function (decodedData) {
      audioBuffer = decodedData;
      analyser = context.createAnalyser();
      analyser.fftSize = 256;
      createBars(analyser.frequencyBinCount);
      playSound(audioBuffer);
    });
  };
  request.send();
}

function createBars(nb) {
  var fragment = document.createDocumentFragment();
  barWidth = (div_visual.offsetWidth / nb);
  for (var i = 0; i < nb; i++) {
    var bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.left = (barWidth * i) + 'px';
    bar.style.width = barWidth + 'px';
    bars.push(bar);
    fragment.appendChild(bar);
  }
  div_visual.appendChild(fragment);
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

  for (var i = 0; i < dataLength; i++) {
    bars[i].style.height = arrayData[i] + 'px';
  }
  requestAnimationFrame(drawData);
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