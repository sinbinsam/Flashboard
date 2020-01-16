var express = require('express');
var moment = require('moment');
var app = express();
var port = process.env.PORT || 8080;
var app = express();
var loki = require('lokijs');
var routes = require(__dirname + '/public/js/routes.js');
var rcn = require(__dirname + '/public/js/rcnGet.js');
var dtv = require(__dirname + '/public/js/dtvGet.js');
var timer = require(__dirname + '/public/js/timerManager.js')
var schedule = require(__dirname + '/public/js/scheduleManager.js')
var pdfGenerator = require(__dirname + '/public/js/pdfGenerator.js')
var rcnGet = rcn.rcnGet;
var rcnTunerInfo = rcn.rcnTunerInfo;


app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(__dirname + '/public')); //stylesheets and js
app.use('/', routes); //routes file


//timer.timedRcnCheck()

//schedule.rcnTunerChangeAll()
let scheduleObj = {
    date: '02/02/2020',
    isSentAll: false,
    channelPlan: [
        {
            name: 'Aqueduct',
            channel: '4,6,9',
            isHd: true,
            isSent: false,
            timeToSend: '5:00 AM'
        },
        {
            name: 'Mahoning Valley',
            channel: '2,3',
            isHd: false,
            isSent: false,
            timeToSend: '5:00 AM'
        },
        {
            name: 'Monticello Raceway',
            channel: '5',
            isHd: false,
            isSent: false,
            timeToSend: '5:00 AM'
        },
        {
            name: 'Drumheller Downs',
            channel: '69',
            isHd: false,
            isSent: false,
            timeToSend: '5:00 AM'
        },
        {
            name: 'Santacaterina Downs',
            channel: '69',
            isHd: false,
            isSent: false,
            timeToSend: '6:00 AM'
        },
        {
            name: 'yes',
            channel: '12,13',
            isHd: false,
            isSent: false,
            timeToSend: '5:00 AM'
        },
    ]
}

//schedule.rcnSchedule(scheduleObj) //stores schedule

//timer.rtnWebUpdateDb() //updates rcn website channels

//timer.dtvTunerUpdateDb() //updates db with dtv tuner info

//dtv.sendTunerStatusRequest() //updates db with rcn tuner info

//schedule.rcnMatchLiveSchedule() //matchs rcn channels with names

//schedule.rcnMatchAuthLiveSchedule() //matches rcn auth with live schedule

//pdfGenerator.generatePdf();



// start the server
app.listen(port, (err) => {
    if (err) {
        console.log('there was an error starting the server')
        console.log(err)
        } else {
            console.log('Server started! V2 At http://localhost:' + port);
        }
});
