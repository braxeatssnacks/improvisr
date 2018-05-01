export function AudioVisualizer(audioContext) {
  var self = this;
  var initialized = false;

  var displayBins = 512; // NOTE: power of 2
  var floorLevel = 96;
  var magicConstant = 42;
  var multiplier = Math.pow(22050, 1/displayBins) * Math.pow(1/magicConstant, 1/displayBins);

  var audioAnalyserNode = audioContext.createAnalyser();
  audioAnalyserNode.fftSize = displayBins * 8;

  var finalBins = [];
  var lookupTable = [];
  for (var i=0; i<displayBins; i++) {
    finalBins.push(0);
    lookupTable.push(0);
  }

  var binLengths = [];
  var binWidth; // set in init

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
    height = (height / (240 - floorLevel) * self.canvas.height * 0.8);
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
    self.canvas.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
    if (!initialized) return console.log('webkit audio context not initialized');

    self.canvas.context.fillStyle = self.backgroundColor;
  	self.canvas.context.fillRect(0, 0, self.canvas.width, self.canvas.height);

    var bins = audioAnalyserNode.frequencyBinCount;
    var data = new Uint8Array(bins);
    audioAnalyserNode.getByteFrequencyData(data);

    self.updateBins(data); // change bin info on audio

    self.canvas.context.fillStyle = self.strokeColor;
    self.canvas.context.beginPath();
    self.canvas.context.moveTo(0, self.canvas.height - self.getBinHeight(0));

    var i;
    for (i=0; i<displayBins-2;) {
      // x
      var thisX = i * binWidth;
      var nextX = (i + binLengths[i]) * binWidth; // first sub-bin of next
      var x = (thisX + nextX) / 2;
      // y
      var thisY = self.canvas.height - self.getBinHeight(i);
      var nextY = self.canvas.height - self.getBinHeight(i + binLengths[i]);
      var y = (thisY + nextY) / 2;

      self.canvas.context.quadraticCurveTo(thisX, thisY, x, y); // connect sub-bins

      i += binLengths[i];
    }
    self.canvas.context.quadraticCurveTo(
      i * binWidth,
      self.canvas.height - self.getBinHeight(i),
      (i+1) * binWidth,
      self.canvas.height - self.getBinHeight(i+1)
    ); // connect bins

    if (self.drawFilled) {
      self.canvas.context.lineTo(self.canvas.width, self.canvas.height);
      self.canvas.context.lineTo(0, self.canvas.height);
      self.canvas.context.fill();
    } else {
      self.canvas.context.stroke();
    }
  };

  this.init = function($audio, $canvas, opts={}) {
    /* optional parameters */
    self.strokeColor = opts.hasOwnProperty('color') ? opts['color'] : '#EF9563';
    self.backgroundColor = opts.hasOwnProperty('backgroundColor') ? opts['backgroundColor'] : 'transparent';
    self.drawFilled = opts.hasOwnProperty('drawFilled') ? opts['drawFilled'] : false;
    self.stream = opts.hasOwnProperty('stream') ? opts['stream'] : false;

    // setup canvas
    self.canvas = {
      context: $canvas.getContext('2d'),
      element: $canvas,
      height: parseFloat(window.getComputedStyle($canvas, null).height, 10),
      width: parseFloat(window.getComputedStyle($canvas, null).width, 10)
    };
    self.canvas.context.strokeStyle = self.strokeColor;
    binWidth = Math.ceil(self.canvas.width / (displayBins - 1));

    window.requestAnimationFrame(self.paint);

    // setup audio element / stream
    var src = !self.stream ?
      audioContext.createMediaElementSource($audio) :
      audioContext.createMediaStreamSource($audio);

    self.createLookupTable(audioAnalyserNode.frequencyBinCount);
    src.connect(audioAnalyserNode);
    if (!self.stream)
      audioAnalyserNode.connect(audioContext.destination);

    initialized = true;
  };

  // this.init(); // self initialize
};


export default { AudioVisualizer }
