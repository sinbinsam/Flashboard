var loki = require('lokijs');
var axios = require('axios');
var htmlToText = require('html-to-text');
const util = require('util')

module.exports = {

rcnGet: function() {

axios('https://www.rtn.tv/schedule/schedule.aspx')
.then((response) => {
    // handle success
 let texts = htmlToText.fromString(response.data, {
    tables: ['.schedulelist'],
    singleNewLineParagraphs: true,
    wordwrap: false
        });
console.log(typeof response);
console.log(util.inspect(texts))
  })

}

}