var loki = require('lokijs');
var axios = require('axios');

module.exports = {

    sendTunerStatusRequest: function(ip) {
        let config = {
          url: '/tv/getTuned',
          baseURL: 'http://' + ip + ':8080',
          method: 'get',
          timeout: 3000,
          responseType: 'json'
        }

        axios.request(config).then((res) => {
            console.log(res.data)
        }).catch(err => {
            console.log(err)
          });


    }


}