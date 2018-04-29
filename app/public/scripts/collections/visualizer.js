export var AudioVisualizer = function($canvas, $audio, opts={}) {
  var self = this;

  var displayBins = 512; // NOTE: power of 2
  var floorLevel = 96;
  var magicConstant = 42;
  var multiplier = Math.pow(22050, 1/displayBins) * Math.pow(1/magicConstant, 1/displayBins);

  var audioContext = new (window.AudioContext || window.webkitAudioContext)();
  var audioAnalyserNode = audioContext.createAnalyser();
  var audioBuffer;
  audioAnalyserNode.fftSize = displayBins * 8;

  /* optional parameters */
  this.barColor = opts.hasOwnProperty('color') ? opts['color'] : '#EF9563';
  this.backgroundColor = opts.hasOwnProperty('backgroundColor') ? opts['backgroundColor'] : 'transparent';
  this.drawFilled = opts.hasOwnProperty('drawFilled') ? opts['drawFilled'] : false;

  var initialized = false;
  var canvas = {
    context: $canvas.getContext('2d'),
    element: $canvas,
    height: parseFloat(window.getComputedStyle($canvas, null).height, 10),
    width: parseFloat(window.getComputedStyle($canvas, null).width, 10)
  };
  var finalBins = [];
  var lookupTable = [];
  for (var i=0; i<displayBins; i++) {
    finalBins.push(0);
    lookupTable.push(0);
  }

  var binLengths = [];
  var binWidth = Math.ceil(canvas.width / (displayBins - 1));

  /* methods */

  this.updateBins = function(data) {
    for (var i=0; i<displayBins; i++) {
      finalBins[i] = data[lookupTable[i]];
    }
  };

  this.getBinHeight = function(i) {
    var binValue = finalBins[i];
    // basically any volume will push over [floorLevel] so set = bottom threshold
    var height = Math.max(0, (binValue - floorLevel)); // logarithmic
    // scale to height of bar
    height = (height / (512 - floorLevel) * canvas.height * 0.8);
    return height;
  };

  this.createLookupTable = function(bins) {
    var lastFreq = magicConstant / multiplier;
    var currentLen = 0;
    var lastBinIndex = 0;

    for (var i=0; i<displayBins; i++) {
      var thisFreq = lastFreq * multiplier;
      lastFreq = thisFreq;
      var binIndex = Math.floor(bins * thisFreq / 22050);
      lookupTable[i] = binIndex;
      currentLen++;

      if (binIndex != lastBinIndex) {
        for (var j=0; j<currentLen; j++) {
          binLengths.push(currentLen);
        }
        currentLen = 0; // reset
      }
      lastBinIndex = binIndex;
    }
  };

  this.paint = function() { // who ain't got no bars? ain't scream bih
    window.requestAnimationFrame(self.paint);
    canvas.context.clearRect(0, 0, canvas.width, canvas.height);
    if (!initialized) return console.log('webkit audio context not initialized');

    canvas.context.fillStyle = self.backgroundColor;
  	canvas.context.fillRect(0, 0, canvas.width, canvas.height);

    var bins = audioAnalyserNode.frequencyBinCount;
    var data = new Uint8Array(bins);
    audioAnalyserNode.getByteFrequencyData(data);

    self.updateBins(data); // change bin info on audio

    canvas.context.fillStyle = self.barColor;
    canvas.context.beginPath();
    canvas.context.moveTo(0, canvas.height - self.getBinHeight(0));

    var i;
    for (i=0; i<displayBins-2;) {
      // x
      var thisX = i * binWidth;
      var nextX = (i + binLengths[i]) * binWidth; // first sub-bin of next
      var x = (thisX + nextX) / 2;
      // y
      var thisY = canvas.height - self.getBinHeight(i);
      var nextY = canvas.height - self.getBinHeight(i + binLengths[i]);
      var y = (thisY + nextY) / 2;

      canvas.context.quadraticCurveTo(thisX, thisY, x, y); // connect sub-bins

      i += binLengths[i];
    }
    canvas.context.quadraticCurveTo(
      i * binWidth,
      canvas.height - self.getBinHeight(i),
      (i+1) * binWidth,
      canvas.height - self.getBinHeight(i+1)
    ); // connect bins

    if (self.drawFilled) {
      canvas.context.lineTo(canvas.width, canvas.height);
      canvas.context.lineTo(0, canvas.height);
      canvas.context.fill();
    } else {
      canvas.context.stroke();
    }
  };

  this.init = function() {
    // setup canvas
    canvas.context.strokeStyle = self.barColor;
    window.requestAnimationFrame(self.paint);

    // setup audio element
    var src = audioContext.createMediaElementSource($audio);
    self.createLookupTable(audioAnalyserNode.frequencyBinCount);
    src.connect(audioAnalyserNode);
    audioAnalyserNode.connect(audioContext.destination);

    initialized = true;
  };

  this.init();
};


export default { AudioVisualizer }
