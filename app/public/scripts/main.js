// import statements
import fetch from './collections/fetch.js';
import init from './collections/init.js';
import { VideoPlay } from './collections/html.js';
import view from './collections/view.js';
import { AudioVisualize } from './collections/visualizer.js';
import {
  $audio,
  $canvas,
  $musicTitle,
  $play,
  $progressBar,
  $video,
  $videoOverlay as $videoPlayer,
  $volume,
} from './collections/elements.js';

function ready() {
  init.all();
  var videoPlayer = new VideoPlay();
  var audioVisualizer = new AudioVisualize($canvas, null, {
    color: '#65CEAD',
    stream: true
  });

  /* MICROPHONE */

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
      // window.persistAudioStream = stream;
      audioVisualizer.stream = stream;
      audioVisualizer.init();
    })
    .catch(function(err) {
      console.log('yikes!', err.message);
      // TODO: create modal for allowing mic input
    });

  /* VIDEO */

  // play/pause
  $play.addEventListener('click', videoPlayer.togglePlay);
  $videoPlayer.addEventListener('click', videoPlayer.togglePlay);
  document.addEventListener('keydown', function(e) { // spacebar
    if (e.which == 32 && document.activeElement != $musicTitle) {
      e.preventDefault();
      videoPlayer.togglePlay();
    }
  });
  // icon updates
  $video.addEventListener('play', videoPlayer.updatePlayButton);
  $video.addEventListener('pause', videoPlayer.updatePlayButton);
  $video.addEventListener('ended', videoPlayer.updatePlayButton);
  // playback updates & scrubbing
  $video.addEventListener('timeupdate', videoPlayer.handleProgress);
  var mousedown = false;
  $progressBar.parentNode.addEventListener('click', videoPlayer.scrub);
  $progressBar.parentNode.addEventListener('mousemove', function(e) {
    mousedown && videoPlayer.scrub.bind(this)(e);
  });
  $progressBar.parentNode.addEventListener('mousedown', () => mousedown = true);
  $progressBar.parentNode.addEventListener('mouseup', () => mousedown = false);
  // sound
  $volume.addEventListener('click', videoPlayer.toggleSound);
  $video.addEventListener('volumechange', videoPlayer.updateVolumeButton);
}

window.addEventListener('load', ready); // need styles ready
