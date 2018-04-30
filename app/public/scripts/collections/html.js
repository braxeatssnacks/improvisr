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
  $volume,
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
  var lastVolumeLevel;

  this.togglePlay = function(e) {
    if ($video.paused) {
      $videoOverlay.classList.add(self.activeClass);
      $video.play();
    } else {
      $videoOverlay.classList.remove(self.activeClass);
      $video.pause();
    }
  };

  this.updatePlayButton = function() {
    var $img = $play.firstElementChild;
    if (this.ended) {
      $img.src = self.replayImg;
    } else if (this.paused) {
      $img.src = self.playImg;
    } else {
      $img.src = self.pauseImg;
    }
  };

  this.toggleSound = function(e) {
    if ($video.muted || $video.volume == 0.0) {
      $video.volume = lastVolumeLevel || 1.0;
    } else {
      $video.volume = 0;
    }
  }

  this.updateVolumeButton = function() {
    var $img = $volume.firstElementChild;
    if (this.muted || this.volume) {
      $img.src = self.volumeImg;
    } else {
      $img.src = self.muteImg;
      lastVolumeLevel = $video.volume;
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
VideoPlay.prototype.volumeImg = 'images/volume_128-128.svg';
VideoPlay.prototype.muteImg = 'images/mute_128-128.svg';

export default {
  PlaylistEntry,
  VideoPlay,
};
