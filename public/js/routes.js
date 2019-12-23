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
    
    
        console.log(tuners)
        res.render("directv-config", {tuners: tuners})

       }
})

router.post('/config/directv/update', (req, res) => {
    var lokiId = parseInt(req.body.lokiId, 10)
    var ip = {ip: req.body.ip}
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

        tuners.findOne({'$loki': lokiId}, (err) => {
            if (err) {
                console.log(err)
            } else {
                tuners.updateOne({'$loki': lokiId}, {'$set': ip}, () => {
                    console.log(tuners)
                })
            }
        });


        let single = tuners.find({ '$loki' : lokiId });

        //replaceObjectWith({$loki: single.$loki, ip: ip}, tuners);
        
        console.log(tuners)



       }

})


module.exports = router;