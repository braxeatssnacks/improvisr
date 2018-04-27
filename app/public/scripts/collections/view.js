import fetch from './fetch.js';
import { $video, $title, $uploader, $playlist } from './elements.js';

// base api routes
var __videos = 'api/videos';

function _video(opts={}, callback=_videoDefaultAjax) {
  /* opts = { id: '' } */
  fetch.getAjax(
    __videos,
    opts,
    { video: $video, title: $title, uploader: $uploader, playlist: $playlist },
    callback
  );
}

function _videoDefaultAjax(err, $elements, data) {
  if (err) return console.error(err);
  console.log(data);
}

export default { _video }
