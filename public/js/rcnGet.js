var loki = require('lokijs');
var axios = require('axios');
var htmlToText = require('html-to-text');
var parser = require('fast-xml-parser');
var loadDb = require(__dirname + '/loadDBs.js');



module.exports = {

rtnWebGet: function(callback) {
  axios.get('https://www.rtn.tv/schedule/schedule.aspx').then((res) => {
      callback(res.data)
  }).catch(err => {
    console.log(err)
  })
},






sendTunerInfoRequest: function(stack, ip, data, filter1, callback) { //['s:Body']['u:GetChannelInfoResponse']Event_Name, Event_Description, Start, End
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
      timeout: 3000,
      data: reqBody,
      responseType: 'text',
      headers: {
        'SOAPACTION': '"urn:schemas-echostar-com:service:EchoSTB:2#GetChannelInfo"',
        'Content-Type': 'text/xml; charset="utf-8"'
      }
    }

      axios.request(config).then((res) => {
        let jsonObj = parser.parse(res.data);
        //console.log(jsonObj['s:Envelope'])
        callback(jsonObj['s:Envelope'], data, stack, ip, filter1);
      }).catch(err => {
        //console.log(err)
        //callback('error')
        callback('error', data, stack, ip, filter1);
      });
},

sendTunerStatusRequest: function(stack, ip, data, filter1, callback) { //['s:Body']['u:GetTunerStatusResponse']TunerStatus, TunerSignalStrength, Channel
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
    timeout: 3000,
    data: reqBody,
    responseType: 'text',
    headers: {
      'SOAPACTION': '"urn:schemas-echostar-com:service:EchoSTB:2#GetTunerStatus"',
      'Content-Type': 'text/xml; charset="utf-8"'
    }
  }
    axios.request(config).then((res) => {
      let jsonObj = parser.parse(res.data);
      //console.log(jsonObj['s:Envelope'])
      callback(jsonObj['s:Envelope'], data, stack, ip, filter1);
    }).catch(err => {
      //console.log(err)
      callback('error', data, stack, ip, filter1);
      //callback('error')
    });
},

sendTunerWakeUpRequest: function(stack, ip) { //irrelevant response
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
    console.log('RCN tuner error')
    return 'error'
  });

},

  sendTunerChannelChangeRequest: function(stack, ip, channel) { //['s:Body']['u:SetChannelResponse']['New_Channel']
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
    console.log('RCN tuner error')
    return 'error'
  });
}

}