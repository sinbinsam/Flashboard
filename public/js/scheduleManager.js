var loadDb = require(__dirname + '/loadDBs.js');
var rcn = require(__dirname + '/rcnGet.js');
var moment = require('moment')

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
                          let pushObj = {
                            'name': obj.channelPlan[i].name,
                            'channel': obj.channelPlan[i].channel,
                            'isHd': obj.channelPlan[i].isHd,
                            'isSent': foundEntry.isSent,
                            'postTime': obj.channelPlan[i].isSent,
                            'rcnChan': foundEntry.rcnChan,
                            'timeToSend': obj.channelPlan[i].timeToSend
                          }
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
        for (i = 0; i < input.channelPlan.length; i++) {
            var results = data.channelInfo.find(obj => {
            return obj.trackName == input.channelPlan[i].name
            })
                if (results) {
                    input.channelPlan[i].rcnChan = results.rtnChan
                    arr.push(input.channelPlan[i]);
                } else if (!results) {
                    input.channelPlan[i].rcnChan = undefined
                    arr.push(input.channelPlan[i]);
                }
        }
        callback(arr)
    })
},

rcnMatchLiveSchedule: function() {
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
        let arr = []
        for (i = 0; i < input.length; i++) {
            var results = data.find(obj => {
                return obj.auth.includes(input)
            })
            arr.push(results)
        }
        callback(arr)
    });
},

rcnMatchAuthSchedule: function() {

}







}