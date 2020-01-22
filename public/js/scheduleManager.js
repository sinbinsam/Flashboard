var loadDb = require(__dirname + '/loadDBs.js');
var rcn = require(__dirname + '/rcnGet.js');
var moment = require('moment')
const didYouMean = require('didyoumean2').default
var pdfGenerator = require(__dirname + '/pdfGenerator.js');

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

clearScheduleDb: function() {
    loadDb.loadScheduleCollection('rcn', function(collection, db) {
        collection.clear()
        db.saveDatabase()
        console.log('database hopefully cleared')
    })
},

rcnScheduleBatch: function(obj) {
    loadDb.loadScheduleCollection('rcn', function(collection, db) {
        //callbackForLoop(0) undelete if doesnt work
            function reloadChanPlan(callback) {
                const objChanPlan = []
                const objChanPlanDel = []
                for (i = 0; i < obj.channelPlan.length; i++) {
                    objChanPlan.push(obj.channelPlan[i])
                    objChanPlanDel.push(obj.channelPlan[i])
                }
                callback(objChanPlan, objChanPlanDel)
            }
                

        for (i = 0; i < obj.date.length; i++) { //loops over submitted dates
                const objChanPlan = []
                const objChanPlanDel = []
                for (m = 0; m < obj.channelPlan.length; m++) {
                    objChanPlan.push(obj.channelPlan[m])
                    objChanPlanDel.push(obj.channelPlan[m])
                }



                

      
            let data = collection.findOne({'date': moment(obj.date[i], 'MMDDYYYY').format('MM/DD/YYYY')}) //db object of one date
                //console.log(data)
                if (data == null) { //data returns no value
                    let isLive
                    if (obj.editLive == true) {
                        isLive = false
                    } else if (obj.editLive == false) {
                        isLive = obj.isLive
                    }
                    collection.insert({
                        'date': moment(obj.date[i], 'MMDDYYYY').format('MM/DD/YYYY'),
                        'isLive': isLive,
                        'livePostTime': obj.livePostTime,
                        'isSentAll': false,
                        'channelPlan': obj.channelPlan,
                        'isSent': false
                    })
                    db.saveDatabase(function() {
                        /*let data = collection.findOne({'date': moment(date, 'MMDDYYYY').format('MM/DD/YYYY')})
                        data.subtitles = obj.subtitles
                        console.log('data null before pdfgenerator: ' + data)
                        pdfGenerator.generateJsonBatch(date, data, function() {
                        })*/
                    })
                    
 
                } else { //data returns value
                    let newData = []; //push new channelPlan object to this
                                function checkForExisting(obj, data, objChanPlan, callback) {
                                    for (var q = 0; q < data.channelPlan.length; q++) {
                                let entry = {
                                    "name": "",
                                    "channel": "",
                                    "isHd": "",
                                    "timeToSend": "",
                                    "notes": ""
                                }

                                function search(nameKey, myArray){
                                    for (var u=0; u < myArray.length; u++) {
                                        if (myArray[u].name === nameKey) {
                                            return myArray[u];
                                        }
                                    }
                                }
                                
                                let isInList = search(data.channelPlan[q].name, objChanPlan)
                                //let isInList = isInListe(obj, element)
                                /*let isInList = obj.channelPlan.find(x => {
                                    return x.name === element.name
                                })*/

                                    if (isInList) {
                                        //data.channelPlan[q].postTime = isInList.postTime
                                        //data.channelPlan[q].notes = isInList.notes
                                        if (obj.delete == false) {
                                            newData.push(isInList)
                                        }
                                        var removeIndex = objChanPlanDel.map(function(item) { return item.name; }).indexOf(isInList.name);
                                        objChanPlanDel.splice(removeIndex, 1);
                                    } else if (!isInList) {
                                        /*entry.postTime = obj.channelPlan[q].postTime
                                        entry.notes = obj.channelPlan[q].notes
                                        entry.name = obj.channelPlan[q].name*/
                                        newData.push(data.channelPlan[q])
                                    }
                                    
                                }
                                callback(obj, newData)
                                }

                                checkForExisting(obj, data, objChanPlan, function() {
                                        Array.prototype.push.apply(newData, objChanPlanDel);
                                        if (obj.editLive == "true") {
                                            data.isLive = obj.isLive
                                        }
                                        data.channelPlan = newData
                                        data.livePostTime = obj.livePostTime
                                        data.subtitles = obj.subtitles
                                            db.saveDatabase(function(err) {
                                                if (err) {
                                                    console.log(err)
                                                } else {
                                                

                                        }
                                    })
                                })
                }
            
        }
        
        //end of loops
 


    });
       pdfGenerator.generateJsonBatch(obj, function() {

                
                
        });

},

rcnSchedule: function(obj) {
    //console.log(obj)
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
            let data = collection.findOne({'date': obj.date})
                data.subtitles = obj.subtitles
                pdfGenerator.generateJson(moment(obj.date, 'MM/DD/YYYY').format('MMDDYYYY'), data)
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
                            'timeToSend': obj.channelPlan[i].timeToSend,
                            'notes': obj.channelPlan[i].notes
                          }
                          newData.push(pushObj)
                      } else if (foundEntry && obj.channelPlan[i].rcnChan) {
                          let pushObj = foundEntry
                            pushObj.isSent = obj.channelPlan[i].isSent
                            pushObj.rcnChan = obj.channelPlan[i].rcnChan
                            pushObj.authName = obj.channelPlan[i].authName
                            pushObj.authIp = obj.channelPlan[i].authIp
                            pushObj.authStack = obj.channelPlan[i].authStack
                            pushObj.isHd = obj.channelPlan[i].isHd
                          newData.push(pushObj)
                      } else if (foundEntry) {
                            let pushObj = foundEntry
                            pushObj.channel = obj.channelPlan[i].channel
                            pushObj.postTime = obj.channelPlan[i].postTime
                            pushObj.isHd = obj.channelPlan[i].isHd
                            pushObj.isSent = obj.channelPlan[i].isSent
                            pushObj.postTime = obj.channelPlan[i].postTime
                            pushObj.timeToSend = obj.channelPlan[i].timeToSend
                            pushObj.notes = obj.channelPlan[i].notes

                            newData.push(pushObj)
                      }
                }
                data.channelPlan = newData
                data.subtitles = obj.subtitles
                collection.update(data);
                    db.saveDatabase();
                        pdfGenerator.generateJson(moment(obj.date, 'MM/DD/YYYY').format('MMDDYYYY'), data)
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
                        collection.update(data);
                            db.saveDatabase()
                    })
                    
                })
                
            })
    });
},






}