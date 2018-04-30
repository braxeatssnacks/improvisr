import { getStrTimeFromSeconds } from './util.js';
import {
  $play,
  $progressBar,
  $timePassed as $progress,
  $timeTotal as $duration,
  $title,
  $uploader,
  $video,
  $videoOverlay,
} from './elements.js';

export function PlaylistEntry() {
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
    $duration.innerText = this.dataset.duration;
    $progress.innerText = '0:00';
    // $video.autoplay = true;
  };
}
PlaylistEntry.prototype.activeClass = 'active';

export function VideoPlay() {
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
    if (this.ended) {
      $img.src = self.replayImg;
    } else if (this.paused) {
      $img.src = self.playImg;
    } else {
      $img.src = self.pauseImg;
    }
  };

  this.handleProgress = function() {
    var percent = ($video.currentTime / $video.duration) * 100;
    var timePassed = getStrTimeFromSeconds($video.currentTime);
    $progress.innerText = timePassed;
    $progressBar.style.width = percent+'%';
  };

  this.scrub = function(e) {
    var scrubTime = (e.offsetX / this.offsetWidth) * $video.duration;
    $video.currentTime = scrubTime;
  }
}
VideoPlay.prototype.activeClass = 'playing';
VideoPlay.prototype.playImg = 'images/play_128-128.svg';
VideoPlay.prototype.pauseImg = 'images/pause_128-128.svg';
VideoPlay.prototype.replayImg = 'images/replay_128-128.svg';

export default {
  PlaylistEntry,
  VideoPlay,
};
