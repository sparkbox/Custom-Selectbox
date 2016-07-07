'use strict';

let env = process.env.NODE_ENV;
const shell = require('shelljs');

if (env === 'production') {
  console.log('Starting Production...');
  shell.exec('webpack -p && npm test');
} else {
  console.log('Starting Development...');
  shell.exec(`concurrently 'webpack -w' 'npm run scss-watch' 'npm run watch' `);
}
