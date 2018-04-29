import {
  $play,
  $title,
  $uploader,
  $video,
  $videoOverlay,
} from './elements.js';

export var PlaylistEntry = function() {
  var self = this;

  this.onClick = function(e) {
    // grab all <li> siblings
    var siblings = [];
    var node = this.parentNode.firstChild;
    do {
      if (node.nodeType == this.nodeType) siblings.push(node);
    } while (node = node.nextElementSibling)

    siblings.some((node) => {
      if (node.classList.contains(self.activeClass)) {
        node.classList.remove(self.activeClass);
        return true;
      }
    });
    this.className += ' '+self.activeClass;

    $video.pause();

    $video.src = this.dataset.src;
    $video.poster = this.dataset.thumb;
    $title.innerText = this.dataset.title;
    $uploader.innerText = this.dataset.user;
    // $video.autoplay = true;
  };
};
PlaylistEntry.prototype.activeClass = 'active';

export var VideoPlay = function() {
  var self = this;

  this.togglePlay = function(e) {
    if ($video.paused) {
      $videoOverlay.classList.add(self.activeClass);
      $video.play();
    } else {
      $videoOverlay.classList.remove(self.activeClass);
      $video.pause();
    }
  };

  this.updateButton = function() {
    var $img = $play.firstElementChild;
    if (this.paused) {
      $img.src = self.playImg;
    } else if (this.ended) {
      $img.src = self.replayImg;
    } else {
      $img.src = self.pauseImg;
    }
  };
};
VideoPlay.prototype.activeClass = 'playing';
VideoPlay.prototype.playImg = 'images/play_128-128.svg';
VideoPlay.prototype.pauseImg = 'images/pause_128-128.svg';
VideoPlay.prototype.replayImg = 'images/replay_128-128.svg';

export default {
  PlaylistEntry,
  VideoPlay,
};
