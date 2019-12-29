var loki = require('lokijs');
var axios = require('axios');
var htmlToText = require('html-to-text');
var parser = require('fast-xml-parser');


module.exports = {

rcnGet: function() {



 
},

  rcnTunerInfo: function() {
    console.log(sendTunerInfoRequest('0', '10.160.27.189'))
  }
}



function sendTunerInfoRequest(stack, ip) {
  let reqBody = '<s:Envelope\
    xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"\
    s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">\
      <s:Body>\
        <u:GetChannelInfo\
          xmlns:u="urn:schemas-echostar-com:service:EchoSTB:2">\
          <Tuner>'
            + stack + '\
          </Tuner>\
        </u:GetChannelInfo>\
      </s:Body>\
    </s:Envelope>'

    let config = {
      url: '/upnp/control/EchoSTB2',
      baseURL: 'http://' + ip + ':49200',
      method: 'post',
      data: reqBody,
      responseType: 'text',
      headers: {
        'SOAPACTION': '"urn:schemas-echostar-com:service:EchoSTB:2#GetChannelInfo"',
        'Content-Type': 'text/xml; charset="utf-8"'
      }
    }

      axios.request(config).then((res) => {
        let jsonObj = parser.parse(res.data);
        console.log(jsonObj['s:Envelope'])
        return jsonObj['s:Envelope'];
      }).catch(err => {
        console.log('there was an error processing the request')
        return 'error'
      });
}

function sendTunerStatusRequest(stack, ip) {
  let reqBody = '<s:Envelope\
  xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"\
  s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">\
    <s:Body>\
      <u:GetTunerStatus\
        xmlns:u="urn:schemas-echostar-com:service:EchoSTB:2">\
        <Tuner>'
          + stack + '\
        </Tuner>\
      </u:GetTunerStatus>\
    </s:Body>\
  </s:Envelope>'

  let config = {
    url: '/upnp/control/EchoSTB2',
    baseURL: 'http://' + ip + ':49200',
    method: 'post',
    data: reqBody,
    responseType: 'text',
    headers: {
      'SOAPACTION': '"urn:schemas-echostar-com:service:EchoSTB:2#GetTunerStatus"',
      'Content-Type': 'text/xml; charset="utf-8"'
    }
  }

    axios.request(config).then((res) => {
      let jsonObj = parser.parse(res.data);
      console.log(jsonObj['s:Envelope'])
      return jsonObj['s:Envelope'];
    }).catch(err => {
      console.log('there was an error processing the request')
      return 'error'
    });
}

function sendTunerWakeUpRequest(stack, ip) {
  let reqBody = '<s:Envelope\
  xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"\
  s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">\
    <s:Body>\
      <u:WakeUp\
        xmlns:u="urn:schemas-echostar-com:service:EchoSTB:2">\
        <Tuner>'
          + stack + '\
        </Tuner>\
      </u:WakeUp>\
    </s:Body>\
  </s:Envelope>'

  let config = {
    url: '/upnp/control/EchoSTB2',
    baseURL: 'http://' + ip + ':49200',
    method: 'post',
    data: reqBody,
    responseType: 'text',
    headers: {
      'SOAPACTION': '"urn:schemas-echostar-com:service:EchoSTB:2#WakeUp"',
      'Content-Type': 'text/xml; charset="utf-8"'
    }
  }

  axios.request(config).then((res) => {
    let jsonObj = parser.parse(res.data);
    console.log(jsonObj['s:Envelope'])
    return jsonObj['s:Envelope'];
  }).catch(err => {
    console.log('there was an error processing the request')
    return 'error'
  });

}

  function sendTunerChannelChangeRequest(stack, ip, channel) {
    let reqBody = '<s:Envelope\
    xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"\
    s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">\
      <s:Body>\
        <u:SetChannel\
          xmlns:u="urn:schemas-echostar-com:service:EchoSTB:2">\
          <Tuner>'
            + stack + '\
          </Tuner>\
          <Channel>'
            + channel + '\
          </Channel>\
        </u:SetChannel>\
      </s:Body>\
    </s:Envelope>'

    let config = {
      url: '/upnp/control/EchoSTB2',
      baseURL: 'http://' + ip + ':49200',
      method: 'post',
      data: reqBody,
      responseType: 'text',
      headers: {
        'SOAPACTION': '"urn:schemas-echostar-com:service:EchoSTB:2#SetChannel"',
        'Content-Type': 'text/xml; charset="utf-8"'
      }
  }

  axios.request(config).then((res) => {
    let jsonObj = parser.parse(res.data);
    console.log(jsonObj['s:Envelope'])
    return jsonObj['s:Envelope'];
  }).catch(err => {
    console.log('there was an error processing the request')
    return 'error'
  });
}