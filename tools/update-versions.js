/**
 *  this script is used to generated the XML manifest for the OWA
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const pJson = require('../package');

const API_VERSION = 0000;

const OWA_VERSION = process.env.BUILD_COUNTER ? `${pJson.version}-${process.env.BUILD_COUNTER}` : pJson.version;
const jsFiles = glob.sync(path.resolve(path.join(__dirname, '..', 'dist', '**','*.js')));

console.log('replace versions');

jsFiles.forEach(file => {
  const contents = fs.readFileSync(file, { encoding : 'UTF-8' });

  fs.writeFileSync(file, contents
    .replace('@@ API_VERSION @@', API_VERSION)
    .replace('@@ OWA_VERSION @@', OWA_VERSION)
  , { encoding : 'UTF-8' });
});
