var loadDb = require(__dirname + '/loadDBs.js');
var rcn = require(__dirname + '/rcnGet.js');
var moment = require('moment')
const didYouMean = require('didyoumean2').default

module.exports = {

rcnAuthDbUpdate: function(obj) {
    loadDb.loadRcnCollection('rcn', function(tuners, db) {
        for (i = 0; i < obj.length; i++) { 
            let data = tuners.findOne({'$loki': parseInt(obj[i]['$loki'])})
                data.auth = obj[i].auth
                    tuners.update(data);
                        db.saveDatabase();
                        //console.log(tuners.data)
        }
    });
},

rcnSchedule: function(obj) {
    loadDb.loadScheduleCollection('rcn', function(collection, db) {        
        let data = collection.findOne({'date': obj.date})
        if (data == null) {
            collection.insert({
                'date': obj.date,
                'isSentAll': false,
                'channelPlan': obj.channelPlan,
                'isSent': false
            })
            db.saveDatabase()
        } else {
            let data = collection.findOne({'date': obj.date});
            let newData = [];
                for (i = 0; i < obj.channelPlan.length; i++) {
                    function isInList(oldObj) { 
                        return oldObj.name === obj.channelPlan[i].name;
                      }
                    let foundEntry = data.channelPlan.find(isInList, obj.channelPlan[i].name)
                      if (!foundEntry) {
                          let pushObj = {
                            'name': obj.channelPlan[i].name,
                            'channel': obj.channelPlan[i].channel,
                            'isHd': obj.channelPlan[i].isHd,
                            'isSent': false,
                            'postTime': obj.channelPlan[i].postTime,
                            'timeToSend': obj.channelPlan[i].timeToSend
                          }
                          newData.push(pushObj)
                      } else if (foundEntry) {
                          let pushobj = foundEntry
                            pushObj.isSent = foundEntry.isSent
                            pushObj.rcnChan = foundEntry.rcnChan
                            pushObj.authName = foundEntry.authName
                            pushObj.authIp = foundEntry.authIp
                            pushObj.authStack = foundEntry.authStack
                          newData.push(pushObj)
                      }
                }
                data.channelPlan = newData
                collection.update(data);
                    db.saveDatabase();
        }
    })
},

rcnMatchAllChannels: function(input, callback) {
    loadDb.loadRcnCollection('webGets', function (tuners, db) {
        let data = tuners.findOne({type: 'rtn'});
        let arr = []
        for (i = 0; i < input.length; i++) {
            var results = data.channelInfo.find(obj => {
                if(!input[i].officialRtn) {
                    return obj.trackName == input[i].name
                } else {
                    return obj.trackName == input[i].officialRtn
                }
            
            })
                if (results) {
                    input[i].rcnChan = results.rtnChan
                    input[i].isHdChannel = results.isHd
                    arr.push(input[i]);
                } else if (!results) {
                    input[i].rcnChan = ''
                    input[i].isHdChannel = ''
                    arr.push(input[i]);
                }
        }
        callback(input)
    })
},

rcnMatchLiveSchedule: function() { //matches rcn channels to names in live schedule
        let currentDate = moment().format("MM/DD/YYYY")
            loadDb.loadScheduleCollection('rcn', function(collection, db) {
                let data = collection.findOne({date: currentDate})
                    if (data) {
                        module.exports.rcnMatchAllChannels(data, function() {
                            collection.update(data);
                            db.saveDatabase()
                        });
                    }
            });

},

rcnMatchAuth: function(input, callback) {
    loadDb.loadRcnCollection('rcn', function(tuners, db) {
        let data = tuners.data
        let checkArr = []
        for (i = 0; i < data.length; i++) {
            for (x = 0; x < data[i].auth.length; x++) {
                checkArr.push(data[i].auth[x])
            }
        }
        
        let arr = []
        for (z = 0; z < input.length; z++) {
            var results = data.find(obj => {
                return obj.auth.includes(didYouMean(input[z].name, checkArr))
            })
            if (results) {
            input[z].authIp = results.ip
            input[z].authName = results.channel
            input[z].authStack = results.stack
            } else {
            input[z].authIp = undefined
            input[z].authName = undefined
            input[z].authStack = undefined
            }
        }
        callback(input)
    });
},

rcnMatchAuthLiveSchedule: function() { //matches authorized tuners to live schedule
    let currentDate = moment().format("MM/DD/YYYY")
    loadDb.loadScheduleCollection('rcn', function(collection, db) {
        let data = collection.findOne({date: currentDate})
            module.exports.rcnMatchAuth(data.channelPlan, function(arr) {
                for (i = 0; i < data.channelPlan.length; i++) {
                    if (arr[i]) {
                    data.channelPlan[i].authName = arr[i].channel
                    data.channelPlan[i].authIp = arr[i].ip
                    data.channelPlan[i].authStack = arr[i].stack
                    } else {
                    data.channelPlan[i].authName = ''
                    data.channelPlan[i].authIp = ''
                    data.channelPlan[i].authStack = ''
                    }
                }
                collection.update(data);
                    db.saveDatabase()
            })
    });
},

matchClosestRtn: function(input, callback) { //finds official RTN name
    loadDb.loadRcnCollection('webGets', function (tuners, db) {
        let data = tuners.findOne({type: 'rtn'})
        let webArr = []
        for (i = 0; i < data.channelInfo.length; i++) {
            webArr.push(data.channelInfo[i].trackName)
        }
        for (i = 0; i < input.length; i++) {
            input[i].officialRtn = didYouMean(input[i].name, webArr)
        }
        callback(input)
    });
},

matchClosestRtnLive: function() {
    let currentDate = moment().format("MM/DD/YYYY")
    loadDb.loadScheduleCollection('rcn', function(collection, db) {
        let data = collection.findOne({date: currentDate})
            module.exports.matchClosestRtn(data.channelPlan, function(arr) {
                module.exports.rcnMatchAllChannels(arr, function(arr) {
                    module.exports.rcnMatchAuth(arr, function(arr) {
                        data.channelPlan = arr
                        console.log(arr)
                        collection.update(data);
                            db.saveDatabase()
                    })
                    
                })
                
            })
    });
},






}