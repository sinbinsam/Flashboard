var loadDb = require(__dirname + '/loadDBs.js');
var rcn = require(__dirname + '/rcnGet.js');

module.exports = {

rcnSchedule: function(obj) {
    loadDb.loadScheduleCollection('rcn', function(collection, db) {
        /*collection.insert(obj)
        //console.log(data)
            collection.insert({
                'date': obj.date,
                'isSentAll': false,
                'channelPlan': obj.channelPlan,
                'isSent': false
            })
            console.log('dont execute this function')
            db.saveDatabase()
            console.log(collection)*/
        
        let data = collection.findOne({'date': obj.date})
        //console.log(data)
        if (data == null) {
            collection.insert({
                'date': obj.date,
                'isSentAll': false,
                'channelPlan': obj.channelPlan,
                'isSent': false
            })
            console.log('dont execute this function')
            db.saveDatabase()
        } else {
            let data = collection.findOne({'date': obj.date});
            let newData = [];
            //console.log(data)
                for (i = 0; i < obj.channelPlan.length; i++) {
                    function isInList(oldObj) { 
                        return oldObj.name === obj.channelPlan[i].name;
                      }
                    let foundEntry = data.channelPlan.find(isInList, obj.channelPlan[i].name)
                    //console.log(foundEntry.isSent)
                      if (!foundEntry) {
                          let pushObj = {
                            'name': obj.channelPlan[i].name,
                            'channel': obj.channelPlan[i].channel,
                            'isHd': obj.channelPlan[i].isHd,
                            'isSent': false
                          }
                          newData.push(pushObj)
                      } else if (foundEntry) {
                          let pushObj = {
                            'name': obj.channelPlan[i].name,
                            'channel': obj.channelPlan[i].channel,
                            'isHd': obj.channelPlan[i].isHd,
                            'isSent': foundEntry.isSent
                          }
                          newData.push(pushObj)
                      }
                }
                data.channelPlan = newData
                collection.update(data);
                    db.saveDatabase();
                        console.log(data)
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