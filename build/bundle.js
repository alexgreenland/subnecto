var fs = require('fs');
var browserify = require('browserify');

var buildDest = './dist/subnecto.js';

var b = browserify();
b.add('./lib/subnecto.js');
var output = fs.createWriteStream(buildDest);
b.bundle().pipe(output);