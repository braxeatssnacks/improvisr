// import statements
import fetch from './collections/fetch.js';
import init from './collections/init.js';
import {
  AudioRecorder as AudioRecorderView,
  VideoPlayer as VideoPlayerView,
} from './collections/html.js';
import view from './collections/view.js';
import {
  $detector,
  $detune,
  $flat,
  $inputAudio,
  $micLevels,
  $music,
  $musicTitle,
  $note,
  $pitch,
  $play,
  $progressBar,
  $sharp,
  $video,
  $videoOverlay as $videoPlayer,
  $volume,
} from './collections/elements.js';

import { AudioVisualizer } from './collections/audio/visualizer.js';
import { PitchDetector } from './collections/audio/pitchdetect.js';
import { SheetMusic } from './collections/audio/sheetmusic.js';

function ready() {
  init.all();

  var audioContext = new (window.AudioContext || window.webkitAudioContext)();
  var audioVisualizer = new AudioVisualizer(audioContext);
  var pitchDetector = new PitchDetector(audioContext);

  var videoPlayerView = new VideoPlayerView();
  var audioRecorderView = new AudioRecorderView(pitchDetector);
  var sheetMusic = new SheetMusic($music);

  /* MICROPHONE */

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
      audioVisualizer.init(stream, $micLevels, {
        color: '#65CEAD',
        stream: true
      });
      pitchDetector.init(stream, {
        detector: $detector,
        detune: $detune,
        flat: $flat,
        note: $note,
        pitch: $pitch,
        sharp: $sharp
      }, {
        stream: true,
      });

      $inputAudio.className += ' live';
    })
    .catch(function(err) {
      console.log('yikes!', err.message);
      // TODO: create modal for allowing mic input
    });

  /* VIDEO */

  // play/pause
  $play.addEventListener('click', videoPlayerView.togglePlay);
  $videoPlayer.addEventListener('click', videoPlayerView.togglePlay);
  document.addEventListener('keydown', function(e) { // spacebar
    if (e.which == 32 && document.activeElement != $musicTitle) {
      e.preventDefault();
      videoPlayerView.togglePlay();
    }
  });
  // icon updates
  $video.addEventListener('play', videoPlayerView.updatePlayButton);
  $video.addEventListener('pause', videoPlayerView.updatePlayButton);
  $video.addEventListener('ended', videoPlayerView.updatePlayButton);
  // playback updates & scrubbing
  $video.addEventListener('timeupdate', videoPlayerView.handleProgress);
  var mousedown = false;
  $progressBar.parentNode.addEventListener('click', videoPlayerView.scrub);
  $progressBar.parentNode.addEventListener('mousemove', function(e) {
    mousedown && videoPlayerView.scrub.bind(this)(e);
  });
  $progressBar.parentNode.addEventListener('mousedown', () => mousedown = true);
  $progressBar.parentNode.addEventListener('mouseup', () => mousedown = false);
  // sound
  $volume.addEventListener('click', videoPlayerView.toggleSound);
  $video.addEventListener('volumechange', videoPlayerView.updateVolumeButton);

  /* AUDIO */
  $inputAudio.addEventListener('click', audioRecorderView.toggleRecording);
}

window.addEventListener('load', ready); // need styles ready
