import { $video } from './elements.js';

var PlaylistEntry = function() {
  var self = this;

  this.$video = $video;
  this.activeClass = 'active';

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

    // play video
    self.$video.src = this.dataset.src;
    self.$video.poster = this.dataset.thumb;
    // self.$video.autoplay = true;
  };
};

export default { PlaylistEntry };
