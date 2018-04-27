const _ = require('lodash');

const schemas = require(`${__dirname}/schemas.js`);

/* video class wrapper */

const Video = function(data) {
  // create appropriate struct
  this.data = this.sanitize(data);
};

Video.prototype.data = {};

// retrieve object property
Video.prototype.get = (prop) => {
  return this.data[prop];
};

// sanitize Video struct
Video.prototype.sanitize = (data) => {
  let r_data = data || {};
  let v_schema = schemas.video;
  return _.pick(_.defaults(r_data, v_schema), _.keys(v_schema));
};

/* static methods */

Video.findById = (videoDb, id, callback) => {
  return (typeof videoDb[id] != 'undefined') ?
    callback(null, new Video(videoDb[id])) :
    callback('id not found', null);
};

Video.all = (videoDb, callback) => {
  let results = [];
  for (let id in videoDb) {
    results.push(new Video(videoDb[id]));
  }
  return callback(null, results);
};

module.exports = Video;
