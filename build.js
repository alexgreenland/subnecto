var browserify = require('browserify');
var b = browserify();
b.add('./lib/subnecto.js');
b.bundle().pipe(process.stdout);
