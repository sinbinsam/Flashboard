var axios = require('axios');

module.exports = {

    sendTunerStatusRequest: function(tuners, data) { //callsign(ESPN),date,duration,episodeTitle,isOffAir,isPclocked,isPpv,isRecording,isVod,major(channelnum),minor,
        let config = {
          url: '/tv/getTuned',
          baseURL: 'http://' + tuners.ip + ':8080',
          method: 'get',
          timeout: 3000,
          responseType: 'json'
        }

        axios.request(config).then((res) => {
            callback(res.data, data, tuners)
        }).catch(err => {
            //console.log(err)
            callback('error', data)
          });


    }


}