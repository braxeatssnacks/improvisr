import { getAjax } from './fetch.js';
import {
  $playlist,
  $timeTotal,
  $title,
  $uploader,
  $video,
} from './elements.js';

// base api routes
var __videos = 'api/videos';

function _video(opts={}, callback) {
  /* opts = { id: '' } */
  var $elements = {
    video: $video,
    title: $title,
    timeTotal: $timeTotal,
    uploader: $uploader,
    playlist: $playlist
  };
  return getAjax(__videos, opts, $elements, callback);
}

export default { _video }
