var loadDb = require(__dirname + '/loadDBs.js');
var rcn = require(__dirname + '/rcnGet.js');

module.exports = {

rcnSchedule: function(obj) {
    loadDb.loadScheduleCollection('rcn', function(collection, db) {
        let data = collection.findOne({'date': obj.date})
        console.log(data)
        if (data == null) {
            collection.insert({
                'date': obj.date,
                'isSent': false,
                'channelPlan': obj.channelPlan
            })
            db.saveDatabase()
        } else {
                if (!data) {
                    console.log('exec')
                    data.channelPlan = obj
                        collection.update(data);
                            db.saveDatabase();
                } else {
                    for (i = 0; i < obj.channelPlan.length; i++) {
                        data.channelPlan[i].name = obj.channelPlan[i].name,
                        data.channelPlan[i].channel = obj.channelPlan[i].channel,
                        data.channelPlan[i].isHd = obj.channelPlan[i].isHd
                            collection.update(data);
                                db.saveDatabase();
                    }
                }
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