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

module.exports = router;