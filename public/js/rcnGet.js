var loki = require('lokijs');
var axios = require('axios');
var htmlToText = require('html-to-text');
const util = require('util')

module.exports = {

rcnGet: function() {

/*
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
*/

let config = {
  baseURL: 'http://10.160.1.1:49200/upnp/control/EchoSTB2',
  method: 'post',
  responseType: 'text',
  
}

axios.request(config)


function sendGhettoRequest(url, port, headers, body, callback) {
  var htmlBody = [].concat(headers);
  htmlBody.push('Content-Length: ' + body.length); // might have to add 2 to this if rosstalk adds linebreak
  htmlBody.push(''); // empty line is required before post body
  htmlBody.push(body);
  
  console.log('sending request: ' + JSON.stringify({
   url: url,
   port: port,
   body: htmlBody.join('\r\n'),
  }, null, true));
 
  axios(url, port, htmlBody.join('\r\n'), 'EricIsASillyGoose', callback);
 }

 sendGhettoRequest(location, 49200, [
  'POST /upnp/control/EchoSTB2 HTTP/1.1',
  'Content-Type: text/xml; charset="utf-8"',
  'SOAPACTION: "urn:schemas-echostar-com:service:EchoSTB:2#GetTunerStatus"',
 ], [
  '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">',
   '<s:Body>',
    '<u:GetTunerStatus xmlns:u="urn:schemas-echostar-com:service:EchoSTB:2">',
     '<Tuner>',
      tunern,
     '</Tuner>',
    '</u:GetTunerStatus>',
   '</s:Body>',
  '</s:Envelope>',
 ].join(''), function () {
 console.log('yes hello I have been called');

 Status = JSON.stringify(arguments);
 if (callback) { callback(Status) }
 });
 
}

}

