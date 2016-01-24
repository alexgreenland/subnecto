var fs = require('fs');
var uglify = require('uglify-js');

var buildDest = './dist/subnecto.js';
var minDest = './dist/subnecto.min.js';

var minified = uglify.minify(buildDest);
fs.writeFile(minDest, minified.code);