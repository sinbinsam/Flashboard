var express = require('express');
var router = express.Router();
var loki = require('lokijs');
var loadDb = require(__dirname + '/loadDBs.js');



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
        })
})

router.get('/rtn', (req, res) => {
    loadDb.loadRcnCollection('webGets', function (tuners, db) {
        let data = tuners.findOne({'type': 'rtn'});
        console.log(data)
            res.render('rtnWeb', {data: data})
    })
})

module.exports = router;