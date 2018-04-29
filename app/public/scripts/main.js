// import statements
import fetch from './collections/fetch.js';
import init from './collections/init.js';
import { VideoPlay } from './collections/html.js';
import view from './collections/view.js';
import { AudioVisualizer } from './collections/visualizer.js';
import {
  $audio,
  $canvas,
  $play,
  $video,
  $videoOverlay as $videoPlayer,
} from './collections/elements.js';

function ready() {
  /* we outchere */
  init.all();

  var videoPlayer = new VideoPlay();
  var audioVisualizer = new AudioVisualizer($canvas, $audio, {
    color: '#EF9563',
    drawFilled: false,
  });

  /* play/pause */
  $play.addEventListener('click', videoPlayer.togglePlay);
  $videoPlayer.addEventListener('click', videoPlayer.togglePlay);
  document.addEventListener('keydown', function(e) {
    if (e.which == 32) {
      e.preventDefault();
      videoPlayer.togglePlay();
    }
  });

  /* icon updates */
  $video.addEventListener('play', videoPlayer.updateButton);
  $video.addEventListener('pause', videoPlayer.updateButton);
  $video.addEventListener('ended', videoPlayer.updateButton);

}

window.addEventListener('load', ready); // need styles ready
