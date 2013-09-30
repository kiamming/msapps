var express = require('express'),
    path = require('path'),
    http = require('http'),
    static = require('node-static');

var app = express();
// Cache for one day
var oneDay = 86400000;

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.compress());
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    // Uncomment the last section of the line below to enable caching.
    // Disabling caching helps in production
    app.use(express.static(path.join(__dirname, 'public/')), { maxAge: oneDay });
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
