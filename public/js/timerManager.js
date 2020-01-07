var loki = require('lokijs');
var rcn = require(__dirname + '/rcnGet.js');
var dtv = require(__dirname + '/dtvGet.js');
var schedule = require('node-schedule');
var loadDb = require(__dirname + '/loadDBs.js');
const HtmlTableToJson = require('html-table-to-json');





module.exports = {

timedRcnCheck: function() {
    let rule = new schedule.RecurrenceRule();
    rule.second = [new schedule.Range(0, 59, 15)]
    let j = schedule.scheduleJob(rule, function() {
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
            module.exports.rcnTunerDbUpdate()
            } else if (data.enabled == false) {
            //console.log('timer is disabled')
            }
        })
    })
},

timedRtnWebCheck: function() { //timed web update of rcn channels
    let rule = new schedule.RecurrenceRule();
    rule.hour = [new schedule.Range(0, 23, 3)]
    let j = schedule.scheduleJob(rule, function() {
        module.exports.dtvTunerUpdateDb()
    })
},


rcnTunerDbUpdate: function() {
    loadDb.loadRcnCollection('rcn', function (tuners, db) {
        function find1 (stack, callback) {
            console.log('starting stack: ' + stack)
            let filter1 = tuners.find({'stack': stack});
            for (i = 0; i < filter1.length; i++) {
                let ip = filter1[i].ip.toString()
                let data = filter1[i]
                rcn.sendTunerStatusRequest(stack, ip, data, filter1, function(res, data, stack, ip, filter1) {
                    if (res == 'error') {
                        console.log('status returned an error')
                        console.log(ip)
                    } else {
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
    })
  },

dtvTunerUpdateDb: function() {
    loadDb.loadDirectvCollection('tuners', function (tuners, db) {
        for (i = 0; i < tuners.data.length; i++) {
            dtv.sendTunerStatusRequest(tuners.data[i], tuners.data, function(res, data, tuners) {
                if (res == 'error') {
                    console.log('dtv returned an error');
                    //console.log(data.ip)
                } else {
                    data.channelName = res.callsign;
                        data.channelMajor = res.major;
                            data.channeMinor = res.minor;
                                data.program = res.episodeTitle;
                                    tuners.update(data);
                                        db.saveDatabase();
                                            console.log('successfully saved dtv to database')
                }
                
            })
        }
    })

},

rtnWebUpdateDb: function() { //saves rtn simulcast info to database rcn, collection webGet, type: 'rtn'
    rcn.rtnWebGet(function(res) {
        if (res == 'error') {
            console.log('there was a problem contacting rcn\'s servers' )
        } else {
        let regex = /((<table id="MainContent_tblScheduleList)((.|[\r\n])*)(<\/table>))/g
        let table = res.match(regex)
        let jsonTables = new HtmlTableToJson(table.toString())
            loadDb.loadRcnCollection('webGets', function (tuners, db) {
                if (!tuners.findOne({type: 'rtn'})) {
                    console.log('cant find')
                        tuners.insert({type: 'rtn'})
                            db.saveDatabase()
                                updateRtnDb(jsonTables, tuners, db)
                } else {
            updateRtnDb(jsonTables, tuners, db)
            }
                function updateRtnDb(jsonTables, tuners, db) {
                    var data = tuners.findOne({type: 'rtn'})
                    let unfiltered = jsonTables.results;
                    //console.log(unfiltered)
                    unfiltered[0].splice(0, 1);
                        let dateString = unfiltered[0][unfiltered[0].length - 1][1]
                            let regex = /(?:Schedule generated )(.*)(?: Eastern)/g
                            data.lastUpdated = regex.exec(dateString)[1]
                            unfiltered[0].splice(unfiltered[0].length - 1, 1)
                                var arr = []
                    for (i = 0; i < unfiltered[0].length; i++) {
                        //console.log(data.channelInfo[0])
                        let formattedObj = {
                            trackName: unfiltered[0][i]['2'],
                            timeStart: unfiltered[0][i]['3'],
                            timeEnd: unfiltered[0][i]['4'],
                            rtnChan: unfiltered[0][i]['1']
                        }
                        let regex2 = / \(HD\)/g
                        if (regex2.exec(unfiltered[0][i]['2'])) {
                            formattedObj.isHd = true
                            let regex3 = /(.*)(?: \(HD\))/g
                            formattedObj.trackName = regex3.exec(unfiltered[0][i]['2'])[1]
                        } else {
                            formattedObj.isHd = false
                        }
            
                        arr.push(formattedObj)
                    }
                    data.channelInfo = arr
                        //data.channelInfo = jsonTables.results;
                            tuners.update(data);
                                db.saveDatabase()
                                    console.log(data.channelInfo)
                }
            })
        }

            

    }) 


},

formatRtn: function() {
    loadDb.loadRcnCollection('webGets', function (tuners, db) {
        var data = tuners.findOne({type: 'rtn'})
        data.channelInfo[0].splice(0, 1);
            let dateString = data.channelInfo[0][data.channelInfo[0].length - 1][1]
                let regex = /(?:Schedule generated )(.*)(?: Eastern)/g
                data.lastUpdated = regex.exec(dateString)[1]
                        data.channelInfo[0].splice(data.channelInfo[0].length - 1, 1)
                            var arr = []
        for (i = 0; i < data.channelInfo[0].length; i++) {
            //console.log(data.channelInfo[0])
            
            let formattedObj = {
                trackName: data.channelInfo[0][i]['2'],
                timeStart: data.channelInfo[0][i]['3'],
                timeEnd: data.channelInfo[0][i]['4'],
                rtnChan: data.channelInfo[0][i]['1']
            }
            let regex2 = / \(HD\)/g
            if (regex2.exec(data.channelInfo[0][i]['2'])) {
                formattedObj.isHd = true
                let regex3 = /(.*)(?: \(HD\))/g
                formattedObj.trackName = regex3.exec(data.channelInfo[0][i]['2'])[1]
            } else {
                formattedObj.isHd = false
            }

            arr.push(formattedObj)
        }
        data.channelInfo = arr

            console.log(data)
    })
},














}