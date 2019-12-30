var loki = require('lokijs');
var rcn = require(__dirname + '/rcnGet.js');
var schedule = require('node-schedule');
var loadDb = require(__dirname + '/loadDBs.js');




module.exports = {

timedRcnCheck: function() {
    var rule = new schedule.RecurrenceRule();
    rule.second = [new schedule.Range(0, 59, 15)]
    var j = schedule.scheduleJob(rule, function() {
        loadDb.loadTimerCollection('timers', function (timers, db) {
            var data = timers.findOne({'group': 'rcn'})
                data.enabled = true;
                    //db.saveDataBase()
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
            module.exports.rcnTunerDbUpdate()
            } else if (data.enabled == false) {
            console.log('timer is disabled')
            }
        })
    })
},

rcnTunerDbUpdate: function() {
    loadDb.loadRcnCollection('rcn', function (tuners, db) {
        function find1 (stack, callback) {
            console.log('starting stack: ' + stack)
            let filter1 = tuners.find({'stack': stack});
            for (i = 0; i < filter1.length; i++) {
                //'0', filter1[i].ip.toString(), filter1[i]
                let ip = filter1[i].ip.toString()
                let data = filter1[i]
                rcn.sendTunerStatusRequest(stack, ip, data, filter1, function(res, data, stack, ip, filter1) {
                    if (res == 'error') {
                        console.log('status returned an error')
                        console.log(ip)
                    } else {
                    //console.log(data)
                        data.channelNumber = res['s:Body']['u:GetTunerStatusResponse']['Channel']
                            data.signalStrength = res['s:Body']['u:GetTunerStatusResponse']['TunerSignalStrength']
                                data.status = res['s:Body']['u:GetTunerStatusResponse']['AV_Status']
                                    tuners.update(data)
                                        db.saveDatabase();
                                            console.log('successfully updated status database');
                    }
                        rcn.sendTunerInfoRequest(stack, ip, data, filter1, function(res, data, stack, ip, filter1) {
                            if (res == 'error') {
                                console.log('info returned an error')
                                console.log(ip)
                                    if (data == filter1[filter1.length - 1]) {
                                        callback()
                                    }
                            } else {
                            //console.log(data)
                                    data.programName = res['s:Body']['u:GetChannelInfoResponse']['Event_Name']
                                        tuners.update(data)
                                            db.saveDatabase();
                                            console.log('successfully updated info database');
                                                if (data == filter1[filter1.length - 1] && stack == '0') {

                                                    callback()
                                                }
                                            
                            }
                            
                        })
                })
            }
            
        }
        find1('0', function() {
            find1('1', function() {
            })
        })
console.log(tuners.data)

    })

    
  }













}