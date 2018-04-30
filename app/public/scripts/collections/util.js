export function getStrTimeFromSeconds(secs) {
  var minutes = Math.floor(secs / 60);
  secs -= minutes * 60;
  secs = Math.floor(secs);
  secs = (secs < 10) ? ('0'+secs.toString()) : secs.toString();
  return minutes.toString()+':'+secs;
}

export default {
  getStrTimeFromSeconds,
}
