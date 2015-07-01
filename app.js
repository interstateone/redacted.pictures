var express = require('express');
var app = express();
var unredact = require('./unredact').unredact;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile('/index.html');
});

app.get('/:words', function(req, res) {
    var stream = unredact(req.params.words.split('+')).createPNGStream();
    stream.on('error', function(error) {
        console.log(error);
        res.send(error);
    });
    stream.once('data', function() {
        res.writeHead(200, { 'Content-Type': 'image/png' });
    });
    stream.on('data', function(chunk) {
        res.write(chunk);
    });
    stream.on('end', function() {
        res.end();
    });
});

app.set('port', (process.env.PORT || 5000))
var server = app.listen(app.get('port'), function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});

