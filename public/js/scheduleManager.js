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
        //callbackForLoop(0)
        for (i = 0; i < obj.date.length; i++) {
            console.log(obj.date.length)
            let data = collection.findOne({'date': moment(obj.date[i], 'MMDDYYYY').format('MM/DD/YYYY')}) //db object of one date
            console.log('Date working on: ' + obj.date[i])
                //console.log(data)
                if (data == null) { //data returns no value
                    collection.insert({
                        'date': moment(obj.date[i], 'MMDDYYYY').format('MM/DD/YYYY'),
                        'isSentAll': false,
                        'channelPlan': obj.channelPlan,
                        'isSent': false
                    })
                    db.saveDatabase(function() {
                        //let data = collection.findOne({'date': moment(obj.date[i], 'MMDDYYYY').format('MM/DD/YYYY')})
                        //console.log(data)
                        //data.subtitles = obj.subtitles
                        //pdfGenerator.generateJsonBatch(obj.date[i], data, function() {
                        //})
                    })
                    
 
                } else { //data returns value
                    let newData = []; //push new channelPlan object to this
                    //console.log(data)



                    

                            if (!data.channelPlan[0]) {
                                console.log('no data found, inserting')
                                data.channelPlan = obj.channelPlan
                                collection.update(data);
                                data.subtitles = obj.subtitles
        
                                db.saveDatabase(function(err) {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            console.log('saved database!')
                                            console.log('channelOBJ after finding no entry: ' + data.channelPlan)
                                        
                                    pdfGenerator.generateJsonBatch(obj.date[i], data, function() {
                                        //console.log(data)
                                        /*if (y < obj.date.length - 1) {
                                            y++
                                            //await sleep(1000)
                                            callbackForLoop(y)
        
                                        }*/
        
        
                                    });


                                        }
                                    })
                            } else {
                                


                            data.channelPlan.map((element, index) => { //loops over every current db entry

                            function isInListe(obj, element) {
                                obj.channelPlan.find(x => {
                                    console.log('comparing "' + x.name + ':' + element.name + '"')
                                    return x.name == element.name
                                })
                            }

                                let entry = {
                                    "name": "",
                                    "channel": "",
                                    "isHd": "",
                                    "timeToSend": "",
                                    "notes": ""
                                }

                                function search(nameKey, myArray){
                                    console.log('search function started')
                                    console.log('NAMEKEY: ' + nameKey)
                                    for (var i=0; i < myArray.length; i++) {
                                        if (myArray[i].name === nameKey) {
                                            return myArray[i];
                                        }
                                    }
                                }

                                let isInList = search(element.name, obj.channelPlan)

                                //let isInList = isInListe(obj, element)
                                /*let isInList = obj.channelPlan.find(x => {
                                    return x.name === element.name
                                })*/
                                console.log('ISINLIST: ' + isInList)
                                console.log('List To Check: ' + element.name)
                                    if (isInList) {
                                        console.log('NEW POST TIME: ' + isInList.postTime)
                                        element.postTime = isInList.postTime
                                        element.notes = isInList.notes
                                        newData.push(element)
                                        var removeIndex = obj.channelPlan.map(function(item) { return item.name; }).indexOf(isInList.name);
                                        obj.channelPlan.splice(removeIndex, 1);
                                    } else if (!isInList) {
                                        entry.postTime = element.postTime
                                        entry.notes = element.notes
                                        entry.name = element.name
                                        newData.push(entry)
                                    }
                                    //console.log(element)
                                    console.log('index: ' + index)
                                    if (index === data.channelPlan.length - 1) {
                                        console.log('finished forEAch!')


                                        Array.prototype.push.apply(newData, obj.channelPlan);
                                        data.channelPlan = newData
                                        console.log('FINAL CHANNELOBJ: ' + JSON.stringify(data.channelPlan))
                                        data.subtitles = obj.subtitles
                                        //console.log(data)
                                        //collection.update(data);
                                        //console.log(data)
                                        //db.saveDatabase(function(err) {
                                                //if (err) {
                                                    //console.log(err)
                                                //} else {
                                                    //console.log('saved database!')
                                                
                                            //pdfGenerator.generateJsonBatch(obj.date[i], data, function() {

                
                
                                            //});


                                                //}
                                            //})
                
                                        




                                        
                                    }
                            })

                        }
                        
                        /*Array.prototype.push.apply(newData, obj.channelPlan);
                        data.channelPlan = newData
                        //console.log(data)
                        collection.update(data);
                        //console.log(data)
                        data.subtitles = obj.subtitles

                        db.saveDatabase(async function(err) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log('saved database!')
                                
                                }
                            })


                            pdfGenerator.generateJsonBatch(obj.date[y], data, function() {
                                //console.log(data)
                                if (y < obj.date.length - 1) {
                                    y++
                                    //await sleep(1000)
                                    callbackForLoop(y)

                                }


                            });*/



                        

                }
        }
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
                        //pdfGenerator.generateJson(moment(obj.date, 'MM/DD/YYYY').format('MMDDYYYY'), data)
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