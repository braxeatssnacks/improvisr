// import statements
import fetch from './collections/fetch.js';
import init from './collections/init.js';
import html from './collections/html.js';
import view from './collections/view.js';
import visualizer from './collections/visualizer.js';

function ready() {
  init.all();
}

document.addEventListener('DOMContentLoaded', ready);
