var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var express = require('express');
var app = express();
var loki = require('lokijs')
var configdb = new loki('config');

app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(__dirname + '/public')); //stylesheets and js



app.get('/', (req, res) => {
    res.render("index")
})





// start the server
app.listen(port);
console.log('Server started! V2 At http://localhost:' + port);