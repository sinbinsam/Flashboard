var loki = require('lokijs');
var rcn = require(__dirname + '/rcnGet.js');
var schedule = require('node-schedule');
var loadDb = require(__dirname + '/loadDBs.js');




module.exports = {

timedRcnCheck: function() {
    var rule = new schedule.RecurrenceRule();
    rule.second = [new schedule.Range(0, 59, 5)]
    var j = schedule.scheduleJob(rule, function() {
        loadDb.loadTimerCollection('timers', function (timers, db) {
            var data = timers.findOne({'group': 'rcn'})
            if (!data) {
                console.log('rcn timer group not found, inserting')
                timers.insert({'group': 'rcn',
                                'enabled': false,
                                'last checked': ''
                                })
                db.saveDatabase()
            }
            if (data.enabled == true) {
            console.log('timer is enabled')
            } else if (data.enabled == false) {
            console.log('timer is disabled')
            }
        })
    })
},

rcnTunerDbUpdate: function() {
    loadDb.loadRcnCollection('rcn', function (tuners, db) {
        function find1 (callback) {
            let filter1 = tuners.find({'stack': '0'});
            for (i = 0; i < filter1.length; i++) {
                rcn.sendTunerStatusRequest('0', filter1[i].ip.toString(), filter1[i],  function(res, data) {
                    if (res == 'error') {
                        console.log('returned an error')
                    } else {
                    //console.log(data)
                        data.channelNumber = res['s:Body']['u:GetTunerStatusResponse']['Channel']
                            tuners.update(data)
                                db.saveDatabase();
                    }
                })
            }
            callback()
        }
        function find2 () {
            let filter2 = tuners.find({'stack': '1'});
            for (i = 0; i < filter2.length; i++) {
                rcn.sendTunerStatusRequest('1', filter2[i].ip.toString(), filter2[i], function(res, data) {
                    if (res == 'error') {
                        console.log('returned an error')
                    } else {
                    //console.log(data)
                        data.channelNumber = res['s:Body']['u:GetTunerStatusResponse']['Channel']
                            tuners.update(data)
                                db.saveDatabase();
                    }
                    console.log(tuners)
                })
            }
        }

        find1(find2)


        
        
    })
  }













}