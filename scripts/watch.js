var chokidar = require('chokidar');
var shell = require('shelljs');

chokidar.watch('spec/*spec.js').on('all', (event, path) => {
  shell.exec('jasmine');
});
