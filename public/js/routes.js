var express = require('express');
var router = express.Router();
var loki = require('lokijs');
var loadDb = require(__dirname + '/loadDBs.js');
var moment = require('moment')
var schedule = require(__dirname + '/scheduleManager.js');



router.get('/', (req, res) => {
    res.render("index")
});


router.get('/config/directv', (req, res) => {
        loadDb.loadDirectvCollection('tuners', function (tuners, db) {
            res.render("directv-config", {tuners: tuners})
        })
})

router.post('/config/directv/update/add', (req,res) => {
        loadDb.loadDirectvCollection('tuners', function (tuners, db) {
            tuners.insert({})
                db.saveDatabase()
                    res.redirect('/config/directv')
        })
})

router.post('/config/directv/update/delete', (req, res) => {
    var lokiId = parseInt(req.body.deleteTunerId, 10)
        loadDb.loadDirectvCollection('tuners', function (tuners, db) {
            let data = tuners.findOne({'$loki': lokiId})
                tuners.remove(data)
                    db.saveDatabase()
                        res.redirect('/config/directv')
        })

})

router.post('/config/directv/update', (req, res) => {
    var lokiId = parseInt(req.body.lokiId, 10)
    var ip = req.body.ip
    var channel = req.body.channel
    loadDb.loadDirectvCollection('tuners', function (tuners, db) {
        let data = tuners.findOne({'$loki': lokiId})
            data.ip = ip
                data.channel = channel
                    tuners.update(data)
                        db.saveDatabase()
                            res.send('recieved')
    })
})

router.get('/config/rcn', (req, res) => {
    loadDb.loadRcnCollection('rcn', function (tuners, db) {
            res.render("rcn-config", {tuners: tuners})
        })
})

router.post('/config/rcn/update/add', (req,res) => {
    loadDb.loadRcnCollection('rcn', function (tuners,db) {
        tuners.insert({})
            db.saveDatabase()
                res.redirect('/config/rcn')
    })
})

router.post('/config/rcn/update/delete', (req, res) => {
    var lokiId = parseInt(req.body.deleteTunerId, 10)
        loadDb.loadRcnCollection('rcn', function (tuners, db) {
            let data = tuners.findOne({'$loki': lokiId})
                tuners.remove(data)
                    db.saveDatabase()
                        res.redirect('/config/rcn')
        })
})

router.post('/config/rcn/update', (req, res) => {
    var lokiId = parseInt(req.body.lokiId, 10)
    var ip = req.body.ip
    var channel = req.body.channel
    var stack = req.body.stack
        loadDb.loadRcnCollection('rcn', function (tuners, db) {
            let data = tuners.findOne({'$loki': lokiId})
                data.ip = ip
                    data.channel = channel
                        data.stack = stack
                            tuners.update(data)
                                db.saveDatabase()
                                    res.send('recieved')
                                    console.log(tuners.data)
        })
});

router.get('/config/rcn/auth', (req, res) => {
    loadDb.loadRcnCollection('rcn', function (tuners, db) {
        //console.log(tuners.data)
        res.render('rcnAuths', {tuners: tuners.data})
    })
})

router.post('/config/rcn/auth', (req, res) => {
    console.log(req.body)
    res.send('success')
    schedule.rcnAuthDbUpdate(req.body)

})

router.get('/rtn', (req, res) => {
    loadDb.loadRcnCollection('webGets', function (tuners, db) {
        let data = tuners.findOne({'type': 'rtn'});
            res.render('rtnWeb', {data: data})
    })
})

router.get('/schedule', (req, res) => {
    res.render('scheduleEdit', {date: undefined, schedule: undefined})
})

router.get('/schedule/rcn/live', (req, res) => {
    loadDb.loadScheduleCollection('rcn', function(collection, db) {
        let data = collection.findOne({date: (moment().format("MM/DD/YYYY"))})
        if (!data) {
            let data = {}
            data.date = (moment().format("MM/DD/YYYY"))
            res.render('liveSchedule', {data: data})
        } else {
            res.render('liveSchedule', {data: data})
        }
        
    })
}),

router.post('/schedule/rcn/live/getRtnChannels', (req, res) => {
    schedule.rcnMatchLiveSchedule()
    res.send('success')
})

router.get('/schedule/rcn/:date', (req, res) => {
    var date = moment(req.params.date, 'MMDDYYYY').format('MM/DD/YYYY')
    //if (date == moment().format("MM/DD/YYYY")) {
    //    res.redirect('/schedule/rcn/live')
    //} else {
    loadDb.loadScheduleCollection('rcn', function(collection, db) {
        //console.log(collection)
        let data = collection.findOne({'date': date})
            res.render('scheduleEdit', {schedule: data, date: date})
    })
    //}
})

router.post('/schedule/rcn', (req, res) => {
        let date = req.body.date
        let obj = req.body
        schedule.rcnSchedule(obj)
        res.send('success')
})






module.exports = router;