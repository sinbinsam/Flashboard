var express = require('express');
var router = express.Router();
var loki = require('lokijs');


var rcnDecoder1 = {
    ip : '192.168.1.2',
    stack : 1,
    online : true,
    channel : 9753,
    

}


router.get('/', (req, res) => {
    res.render("index")
});

router.get('/config/rcn', (req, res) => {


    res.render('rcn-config')
});

router.get('/config/directv', (req, res) => {
    let db = new loki('directv', {
        autoload: true,
        autoloadCallback : databaseInitialize,
        autosave: true, 
        autosaveInterval: 4000
    });



    function databaseInitialize() {
        const tuners = db.getCollection("tuners");
        if (tuners === null) {
        const tuners = db.addCollection("tuners");
        }
    
    
        res.render("directv-config", {tuners: tuners})

       }
})

router.post('/config/directv/update/add', (req,res) => {
    var db = new loki('directv');

    function loadCollection(colName, callback) {
        db.loadDatabase({}, function () {
            var _collection = db.getCollection(colName);
    
            if (!_collection) {
                console.log("Collection %s does not exit. Creating ...", colName);
                _collection = db.addCollection('users');
            }
    
            callback(_collection);
        });
    }

    loadCollection('tuners', function (tuners) {
        tuners.insert({})
        db.saveDatabase()
        console.log(tuners.data)
        res.redirect('/config/directv')
    
    })

})

router.post('/config/directv/update/delete', (req, res) => {
    //var lokiId = parseInt(req.body.lokiId, 10)
    console.log(req.body)
    var db = new loki('directv', {
        autoload: true,
        autoloadCallback : databaseInitialize,
        autosave: true, 
        autosaveInterval: 4000
    });
        res.redirect('/config/directv')
            function databaseInitialize() {
                const tuners = db.getCollection("tuners");
                if (tuners === null) {
                const tuners = db.addCollection("tuners");
                }
                    //let data = tuners.findOne({'$loki': lokiId})
                    //tuners.remove(data)
                    //res.redirect('/config/directv')
                    console.log('hopefully removed')
            }
})

router.post('/config/directv/update', (req, res) => {
    var lokiId = parseInt(req.body.lokiId, 10)
    var ip = req.body.ip
    var channel = req.body.channel
    var db = new loki('directv', {
        autoload: true,
        autoloadCallback : databaseInitialize,
        autosave: true, 
        autosaveInterval: 4000
    });
        res.send('recieved')
            function databaseInitialize() {
                const tuners = db.getCollection("tuners");
                if (tuners === null) {
                const tuners = db.addCollection("tuners");
                }

                    let data = tuners.findOne({'$loki': lokiId})
                    data.ip = ip
                    data.channel = channel
                    tuners.update(data)
                    console.log(tuners.data)
                        
            }

})


module.exports = router;