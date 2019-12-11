var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var app = express();
var loki = require('lokijs');
var routes = require('./public/js/routes.js');
var configdb = new loki('config');

app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(__dirname + '/public')); //stylesheets and js
app.use('/', routes); //routes file








// start the server
app.listen(port, (err) => {
    if (err) {
        console.log('there was an error starting the server')
        console.log(err)
        } else {
            console.log('Server started! V2 At http://localhost:' + port);
        }
});
