var express = require('express'),
    path = require('path'),
    http = require('http'),
    static = require('node-static');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.compress());
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    //app.use(express.static(path.join(__dirname, 'public/')));
});

var file = new static.Server('./public');

http.createServer(function(request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(app.get('port'), function (){
    console.log("Express server listening on port " + app.get('port'));
});

/*http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});*/
