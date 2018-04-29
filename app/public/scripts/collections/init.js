// import statements
import html from './html.js';
import view from './view.js';
import { $video } from './elements.js';

function populatePlaylist($parent, videos) {
  var $fragment = document.createDocumentFragment();
  var videoPlay = new html.VideoPlay();

  videos.forEach((elem, i) => {
    var $li = document.createElement('li');

    var active = i == 0 ? 'active' : '';
    $li.className = 'rounded video-card '+active;
    // add meta info
    $li.dataset.id = elem.data.id;
    $li.dataset.src = elem.data.fpath;
    $li.dataset.thumb = elem.data.thumb;
    // $li.dataset.descr = elem.data.descr;
    $li.dataset.dur = elem.data.duration;
    $li.dataset.title = elem.data.title;
    $li.dataset.user = elem.data.uploader;
    $li.dataset.url = elem.data.url;

    // add event listeners
    var entry = new html.PlaylistEntry();
    $li.addEventListener('click', function(e) {
      entry.onClick.bind($li)(e);
      videoPlay.updateButton.bind($video)();
    });

    // visual elements
    var $thumbnailContainer = document.createElement('div');
    $thumbnailContainer.className = 'relative rounded-top thumbnail-container';
    var $overlay = document.createElement('div');
    $overlay.className = 'overlay';
    var $thumbnail = document.createElement('div');
    $thumbnail.className = 'thumbnail';
    $thumbnail.style.backgroundImage = 'url("'+elem.data.thumb+'")';

    $thumbnailContainer.appendChild($overlay);
    $thumbnailContainer.appendChild($thumbnail);
    $li.appendChild($thumbnailContainer);

    var $content = document.createElement('div');
    $content.className = 'relative card__content';
    var $title = document.createElement('h3');
    $title.className = 'truncate video-title';
    $title.dataset.link = true;
    var $uploader = document.createElement('h4');
    $uploader.className = 'truncate video-uploader';

    $title.appendChild(document.createTextNode(elem.data.title));
    $uploader.appendChild(document.createTextNode(elem.data.uploader));
    $content.appendChild($title);
    $content.appendChild($uploader);
    $li.appendChild($content);

    $fragment.appendChild($li);
  });

  $parent.appendChild($fragment);
}

function all() {
  view._video({}, (err, $elements, data) => {
    var defaultVideo = data[0];
    $elements.video.src = defaultVideo.data.fpath;
    $elements.video.poster = defaultVideo.data.thumb;
    $elements.title.innerText = defaultVideo.data.title;
    $elements.uploader.innerText = defaultVideo.data.uploader;
    populatePlaylist($elements.playlist, data);
  });
}

export default { all }
