import { getStrTimeFromSeconds } from './util.js';
import {
  $inputAudio,
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

export function AudioRecorder(pitchDetector) {
  var self = this;

  this.toggleRecording = function(e) {
    if (this.classList.contains(self.recordingClass)) {
      // stop recording
      this.classList.remove(self.recordingClass);
      pitchDetector.active = false;
    } else {
      // start recording
      this.classList.add(self.recordingClass);
      pitchDetector.active = true;
    }
  }
}
AudioRecorder.prototype.recordingClass = 'recording';

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
    // reset
    $progress.innerText = '0:00';
    $progressBar.style.width = '0%';
    // $video.autoplay = true;
  };
}
PlaylistEntry.prototype.activeClass = 'active';

export function VideoPlayer() {
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
    $img.style.display = 'none';
    if (this.ended) {
      $img.src = self.replayImg + '?v=' + Date.now(); // caching finesse
    } else if (this.paused) {
      $img.src = self.playImg + '?v=' + Date.now();
    } else {
      $img.src = self.pauseImg + '?v=' + Date.now();
    }
    $img.style.display = 'block';
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
    $img.style.display = 'none';
    if (this.volume) {
      $img.src = self.volumeImg + '?v=' + Date.now();
    } else {
      $img.src = self.muteImg + '?v=' + Date.now();
      lastVolumeLevel = $video.volume;
    }
    $img.style.display = 'block';
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
VideoPlayer.prototype.activeClass = 'playing';
VideoPlayer.prototype.playImg = 'images/play_128-128.svg';
VideoPlayer.prototype.pauseImg = 'images/pause_128-128.svg';
VideoPlayer.prototype.replayImg = 'images/replay_128-128.svg';
VideoPlayer.prototype.volumeImg = 'images/volume_128-128.svg';
VideoPlayer.prototype.muteImg = 'images/mute_128-128.svg';

export default {
  AudioRecorder,
  PlaylistEntry,
  VideoPlayer,
};
