var loadDb = require(__dirname + '/loadDBs.js');
var rcn = require(__dirname + '/rcnGet.js');

module.exports = {

rcnAuthDbUpdate: function(obj) {
    loadDb.loadRcnCollection('rcn', function(tuners, db) {
        for (i = 0; i < obj.length; i++) { 
            let data = tuners.findOne({'$loki': parseInt(obj[i]['$loki'])})
                data.auth = obj[i].auth
                    tuners.update(data);
                        db.saveDatabase();
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
                            'timeToSend': obj.channelPlan[i].timeToSend
                          }
                          newData.push(pushObj)
                      } else if (foundEntry) {
                          let pushObj = {
                            'name': obj.channelPlan[i].name,
                            'channel': obj.channelPlan[i].channel,
                            'isHd': obj.channelPlan[i].isHd,
                            'isSent': foundEntry.isSent,
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


rcnTunerChangeAll: function(dateObj) {
    rcn.sendTunerStatusRequest('0', '10.160.27.189', null, null, function(res) {
        if (res == 'error') {
            console.log('there was an error')
        } else {
            console.log(res)
        }
        
    })


}








}