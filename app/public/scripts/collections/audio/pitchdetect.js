
export function PitchDetector(audioContext) {
  var self = this;
  var initialized = false;
  self.active = false;

  var audioAnalyserNode = audioContext.createAnalyser();
  audioAnalyserNode.fftSize = 2048;

  var bufLen = 1024;
  var buf = new Float32Array(bufLen);
  var MIN_SAMPLES = 0;
  var MAX_SAMPLES = Math.floor(bufLen / 2);

  this.CONFIDENCE_BAR = 0.9; // auto-correlation min confidence

  var noteStrings = {
    sharp: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
    flat: ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B']
  };

  this.noteNumFromPitch = function(freq) {
    var num = 12 * (Math.log(freq / 440) / Math.log(2));
    return Math.round(num) + 69;
  };

  this.noteClassFromPitch = function(freq, opts={}) {
    var num = self.noteNumFromPitch(freq);
    var enharmonic = opts.hasOwnProperty('enharmonic') ? opts['enharmonic'] : 'sharp';
    return [noteStrings[enharmonic][num % 12], Math.floor(num / 12) - 1];
  };

  this.freqFromNoteNum = function(noteNum) {
    var num = 440 * Math.pow(2, (noteNum - 69) / 12);
    return num;
  };

  this.centsOffFromPitch = function(freq, noteNum) {
    var cents = 1200 * Math.log(freq / self.freqFromNoteNum(noteNum)) /  Math.log(2);
    return Math.floor(cents);
  };

  this.autoCorrelate = function(buf, sampleRate) {
    var bestOffset = -1;
    var bestCorrelation = 0;
    var rms = 0;
    var foundGoodCorrelation = false;
    var correlations = new Array(MAX_SAMPLES);

    for (var i=0; i<bufLen; i++) {
      var value = buf[i];
      rms += Math.pow(value, 2);
    }
    rms = Math.sqrt(rms / bufLen);
    if (rms < 0.03) return -1; // not enough signal

    var lastCorrelation = 1;
    for (var offset=MIN_SAMPLES; offset<MAX_SAMPLES; offset++) {
      var correlation = 0;
      for (var i=0; i<MAX_SAMPLES; i++) {
        correlation += Math.abs(buf[i] - buf[offset+i]);
      }
      correlation = 1 - (correlation / MAX_SAMPLES);
      correlations[offset] = correlation; // store for tweaking

      if ((correlation > self.CONFIDENCE_BAR) && (correlation > lastCorrelation)) {
        foundGoodCorrelation = true;
        if (correlation > bestCorrelation) {
          bestCorrelation = correlation;
          bestOffset = offset;
        }
      } else if (foundGoodCorrelation) {
        // found a good correlation -> then a bad one
        var shift = (correlations[bestOffset+1] - correlations[bestOffset-1])/correlations[bestOffset];
        // console.log("f = "+ sampleRate/bestOffset + "Hz (rms: " + rms + " confidence: " + bestCorrelation + ")")
        return sampleRate/(bestOffset+(8*shift))
      }
      lastCorrelation = correlation;
    }

    if (bestCorrelation > 0.01) {
      // console.log("f = "+ sampleRate/bestOffset + "Hz (rms: " + rms + " confidence: " + bestCorrelation + ")")
  		return sampleRate/bestOffset;
    }

    return -1; // no good correlation found
  }

  this.updatePitch = function(time) {
    window.requestAnimationFrame(self.updatePitch);
    if (!initialized) return console.log('webkit audio context not initialized');

    var cycles = new Array();
    audioAnalyserNode.getFloatTimeDomainData(buf);
    var result = self.autoCorrelate(buf, audioContext.sampleRate);

    if (result > 0 && self.active) {
      var pitch = result;
      var note = self.noteNumFromPitch(pitch);
      var noteClass = self.noteClassFromPitch(pitch);
      var detuned = self.centsOffFromPitch(pitch, note);

      self.$detector.className = "confident";
      self.$pitch.innerText = Math.round(pitch);
      self.$note.innerText = noteClass.join('');

      var add = '';
      if (detuned > 0) { // sharp
        add = '#';
    		self.$detune.parentNode.className = 'detune sharp';
        self.$detune.innerText = detuned;
      } else if (detuned < 0) { // flat
        add = '♭';
    		self.$detune.parentNode.className = 'detune flat';
        self.$detune.innerText = detuned;
      } else {
        self.$detune.parentNode.parentNode.className += ' perfect-pitch';
      }
      console.log(noteClass.join('')+' '+add);

    } else {
      self.$detector.className = 'vague';
  	 	self.$pitch.innerText = '--';
  		self.$note.innerText = '--';
      self.$detune.innerText = '--';
      self.$detune.parentNode.classList.remove('flat');
      self.$detune.parentNode.classList.remove('sharp');
      self.$detune.parentNode.parentNode.classList.remove('perfect-pitch');
    }
  };

  this.init = function($audio, $elements, opts={}) {
    /* optional parameters */
    self.stream = opts.hasOwnProperty('stream') ? opts['stream'] : false;

    self.$detector = $elements.detector;
    self.$detune = $elements.detune;
    self.$flat = $elements.flat;
    self.$note = $elements.note;
    self.$pitch = $elements.pitch;
    self.$sharp = $elements.sharp;

    window.requestAnimationFrame(self.updatePitch);

    // setup audio element / stream
    var src = !self.stream ?
      audioContext.createMediaElementSource($audio) :
      audioContext.createMediaStreamSource($audio);

    src.connect(audioAnalyserNode);
    if (!self.stream)
      audioAnalyserNode.connect(audioContext.destination);

    initialized = true;
  };
}

export default { PitchDetector }
