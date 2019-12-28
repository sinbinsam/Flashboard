var express = require('express');
var router = express.Router();
var loki = require('lokijs');




router.get('/', (req, res) => {
    res.render("index")
});


router.get('/config/directv', (req, res) => {
    var db = new loki('directv');
        function loadCollection(colName, callback) {
            db.loadDatabase({}, function () {
                var _collection = db.getCollection(colName);
        
                if (!_collection) {
                    console.log("Collection %s does not exit. Creating ...", colName);
                    _collection = db.addCollection('tuners');
                }
                callback(_collection);
            });
        }
        loadCollection('tuners', function (tuners) {
            res.render("directv-config", {tuners: tuners})
        })
})

router.post('/config/directv/update/add', (req,res) => {
    var db = new loki('directv');
        function loadCollection(colName, callback) {
            db.loadDatabase({}, function () {
                var _collection = db.getCollection(colName);
        
                if (!_collection) {
                    console.log("Collection %s does not exit. Creating ...", colName);
                    _collection = db.addCollection('tuners');
                }
                callback(_collection);
            });
        }
        loadCollection('tuners', function (tuners) {
            tuners.insert({})
                db.saveDatabase()
                    res.redirect('/config/directv')
        })
})

router.post('/config/directv/update/delete', (req, res) => {
    var lokiId = parseInt(req.body.deleteTunerId, 10)
    var db = new loki('directv');
        function loadCollection(colName, callback) {
            db.loadDatabase({}, function () {
                var _collection = db.getCollection(colName);
        
                if (!_collection) {
                    console.log("Collection %s does not exit. Creating ...", colName);
                    _collection = db.addCollection('tuners');
                }
                callback(_collection);
            });
        }
        loadCollection('tuners', function (tuners) {
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
    var db = new loki('directv');
    function loadCollection(colName, callback) {
        db.loadDatabase({}, function () {
            var _collection = db.getCollection(colName);
    
            if (!_collection) {
                console.log("Collection %s does not exit. Creating ...", colName);
                _collection = db.addCollection('tuners');
            }
            callback(_collection);
        });
    }
    loadCollection('tuners', function (tuners) {
        let data = tuners.findOne({'$loki': lokiId})
            data.ip = ip
                data.channel = channel
                    tuners.update(data)
                        db.saveDatabase()
                            res.send('recieved')
    })
})

router.get('/config/rcn', (req, res) => {
    var db = new loki('rcn');
        function loadCollection(colName, callback) {
            db.loadDatabase({}, function () {
                var _collection = db.getCollection(colName);
        
                if (!_collection) {
                    console.log("Collection %s does not exit. Creating ...", colName);
                    _collection = db.addCollection('rcn');
                }
                callback(_collection);
            });
        }
        loadCollection('rcn', function (tuners) {
            res.render("rcn-config", {tuners: tuners})
        })
})

router.post('/config/rcn/update/add', (req,res) => {
    var db = new loki('rcn');
        function loadCollection(colName, callback) {
            db.loadDatabase({}, function () {
                var _collection = db.getCollection(colName);
        
                if (!_collection) {
                    console.log("Collection %s does not exit. Creating ...", colName);
                    _collection = db.addCollection('rcn');
                }
                callback(_collection);
            });
        }
        loadCollection('rcn', function (tuners) {
            tuners.insert({})
                db.saveDatabase()
                    res.redirect('/config/rcn')
        })
})

router.post('/config/rcn/update/delete', (req, res) => {
    var lokiId = parseInt(req.body.deleteTunerId, 10)
    var db = new loki('rcn');
        function loadCollection(colName, callback) {
            db.loadDatabase({}, function () {
                var _collection = db.getCollection(colName);
        
                if (!_collection) {
                    console.log("Collection %s does not exit. Creating ...", colName);
                    _collection = db.addCollection('rcn');
                }
                callback(_collection);
            });
        }
        loadCollection('rcn', function (tuners) {
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
    var db = new loki('rcn');
    function loadCollection(colName, callback) {
        db.loadDatabase({}, function () {
            var _collection = db.getCollection(colName);
    
            if (!_collection) {
                console.log("Collection %s does not exit. Creating ...", colName);
                _collection = db.addCollection('rcn');
            }
            callback(_collection);
        });
    }
    loadCollection('rcn', function (tuners) {
        let data = tuners.findOne({'$loki': lokiId})
            data.ip = ip
                data.channel = channel
                    data.stack = stack
                        tuners.update(data)
                            db.saveDatabase()
                                res.send('recieved')
                                    console.log(tuners)
    })
})

module.exports = router;