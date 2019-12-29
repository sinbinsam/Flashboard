var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var app = express();
var loki = require('lokijs');
var routes = require(__dirname + '/public/js/routes.js');
var rcn = require(__dirname + '/public/js/rcnGet.js');
var timer = require(__dirname + '/public/js/timerManager.js')
var rcnGet = rcn.rcnGet;
var rcnTunerInfo = rcn.rcnTunerInfo;
var dtvTunerStore = require(__dirname + '/public/js/dtvTunerStore.js');


app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(__dirname + '/public')); //stylesheets and js
app.use('/', routes); //routes file


//timer.timedRcnCheck()

timer.rcnTunerDbUpdate()


// start the server
app.listen(port, (err) => {
    if (err) {
        console.log('there was an error starting the server')
        console.log(err)
        } else {
            console.log('Server started! V2 At http://localhost:' + port);
        }
});
