var express = require('express');
var router = express.Router();
var loki = require('lokijs');
var configdb = new loki('config');

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
    var rcn = configdb.addCollection('rcn');


    res.render("rcnconfig")
});

module.exports = router;