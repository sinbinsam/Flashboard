const puppeteer = require('puppeteer');
var moment = require('moment');
var loadDb = require(__dirname + '/loadDBs.js');
var path = require('path')
//var calendarJson = require(path.join(__dirname, '../calendar/calendarObj.json'));
const fs = require('fs');
const didYouMean = require('didyoumean2').default

module.exports = {

generateJsonBatch: function(obj, callback) { //submit obj, with date array and partial channelPlan which will update current
    const objChanPlanDel = []
    function addToMonth (date, calObj, dbObj, objChanPlanDel, callback) {
        objChanPlanDel = []
        for (n = 0; n < obj.channelPlan.length; n++) {
            objChanPlanDel.push(obj.channelPlan[n])
        }
        //console.log(dbObj) //contains all submitted calendar objects
        let revisedCalObj = [];
        let compare = []; //contains all current calendar objects
            for (i = 0; i < calObj.monthly.length; i++) { //adds current month calendar objects from database into array
                    if (calObj.monthly[i].id == date + 'live' && obj.editLive == "false") {
                        compare.push(calObj.monthly[i])//push it through if not editing live
                    } else if (calObj.monthly[i].id == date) {
                        compare.push(calObj.monthly[i])
                    }
            }
                        function search(nameKey, myArray){
                            for (var u=0; u < myArray.length; u++) {
                                if (myArray[u].name === nameKey) {
                                    return myArray[u];
                                }
                            }
                        }
                        let r = 0
                        let e = 0
                    compare.forEach(element => { //finds existing elements and updates them, removes from dbObj once updated
                        let entry = {
                            "id": date,
                            "name": "",
                            "startdate": moment(date, 'MMDDYYYY').format('YYYY-MM-DD'),
                            "enddate": "",
                            "starttime": "",
                            "endtime": "",
                            "color": "#ffffff",
                            "url": "",
                            "sorttime": "",
                            "postTime": ""
                        }

                        let isInList = search(element.name, dbObj.channelPlan)
                        
                        

                            if (isInList) {
                                element.postTime = moment(isInList.postTime, 'hh:mm a').format('h:mm')
                                element.url = isInList.notes
                                element.enddate = ""
                                element.endtime = ""
                                element.starttime = ""
                                element.sorttime = moment(isInList.postTime, 'hh:mm a').format('HH:mm')
                                element.below = isInList.below

                                if (element.below == true) {
                                    let newTimee = '23:0' + JSON.stringify(r)
                                    element.sorttime = newTimee
                                    r++
                                }
                                if (element.sorttime == "Invalid date") {
                                    let newNewTimeee = '22:0' + JSON.stringify(e)
                                    element.sorttime = newNewTimeee
                                    e++
                                }
                                if (element.postTime == 'Invalid date') {
                                    element.postTime = ''
                                }
                                
                                if (obj.delete == false) {
                                    revisedCalObj.push(element)
                                }
                                
                                var removeIndex = objChanPlanDel.map(function(item) { return item.name; }).indexOf(isInList.name);
                                objChanPlanDel.splice(removeIndex, 1);
                            } else if (!isInList) {
                                entry.enddate = ""
                                entry.endtime = ""
                                entry.starttime = ""
                                entry.name = element.name
                                entry.postTime = element.postTime
                                entry.url = element.url
                                entry.sorttime = element.sorttime
                                entry.below = element.below
                                if (element.id == date + 'live') {
                                    entry.id = element.id
                                    revisedCalObj.push(entry)
                                } else if (obj.type == 'add') {
                                    revisedCalObj.push(entry)
                                }
                                
                            }
                    })
                    let newElementArr = []
                    let k = 0
                    let l = 0
                    objChanPlanDel.forEach(element => { //add new elements into newElementArr
                        let entry = {
                            "id": date,
                            "name": "",
                            "startdate": moment(date, 'MMDDYYYY').format('YYYY-MM-DD'),
                            "enddate": "",
                            "starttime": "",
                            "endtime": "",
                            "color": "#ffffff",
                            "url": "",
                            "sorttime": "",
                            "postTime": "",
                            "below": false
                        }
                        entry.name = element.name
                        entry.sorttime = moment(element.postTime, 'hh:mm a').format('HH:mm')
                        entry.postTime = element.postTime.slice(0, -3)
                        entry.below = element.below
                        entry.url = element.notes
                        if (entry.below == true) {
                            let newTime = '23:0' + JSON.stringify(k)
                            entry.sorttime = newTime
                            k++
                        }
                        if (entry.sorttime == 'Invalid date') {
                            let newNewTime = '22:' + JSON.stringify(l)
                            entry.sorttime = newNewTime
                            l++
                        }
                        
                            if (!search(element.name, obj.channelPlan) || obj.delete == false) {
                            newElementArr.push(entry) //DELETE BUG HERE
                            }
                        
                    })

                    Array.prototype.push.apply(revisedCalObj, newElementArr); 
                    callback(revisedCalObj, objChanPlanDel, dbObj)
                    //dbObj.channelPlan

                /*dbObj.channelPlan.forEach(element => {
                    let isInList = compare.find(x => {
                        return x.name === element.name
                    })
                        if (isInList) {
                            isInList.postTime = element.postTime
                            isInList.notes = element.notes
                            revisedCalObj.push(isInList)
                        } else if (!isInList) {
                            revisedCalObj.push(element)
                        }
                        

                    /*
                    for (y = 0; y < dbObj.channelPlan.length; y++) {
                        if (moment(dbObj.date, 'MM/DD/YYYY').format('MMDDYYYY') == element.id && dbObj.channelPlan[y].name == element.name) {
                            element.postTime = dbObj.channelPlan[y].postTime
                            element.notes = dbObj.channelPlan[y].notes
                            console.log('yesyesyes')
                        } else {
                            var entry = {
                                "id": moment(dbObj.date, 'MM/DD/YYYY').format('MMDDYYYY'),
                                "name": dbObj.channelPlan[y].name,
                                "startdate": moment(dbObj.date, 'MM/DD/YYYY').format('YYYY-MM-DD'),
                                "enddate": "",
                                "starttime": "",
                                "endtime": "",
                                "color": "#ffffff",
                                "url": "",
                                "sorttime": ""
                            }
                            compare.push(entry)
                        }
                    }
                })*/


            //console.log(revisedCalObj)
            //callback()
    }

    function eraseMonth(date, calObj, objChanPlanDel, obj, callback) {
        let erasedCalObj = []
        for (i = 0; i < calObj.monthly.length; i++) {
            //console.log(calObj.monthly[i].startdate)
                //console.log(monthNum + yearNum)
                    if (calObj.monthly[i].id !== date && calObj.monthly[i].id !== date + 'live') {
                        
                        erasedCalObj.push(calObj.monthly[i])
                    } 
        }
    
    
        callback(erasedCalObj, objChanPlanDel, obj)
    }
//obj.date.length




        /*for (i = 0; i < obj.channelPlan.length; i++) {
            objChanPlanDel.push(obj.channelPlan[i])
        }*/

addSingleCal(0, objChanPlanDel)
function addSingleCal(i, objChanPlanDel) {




    fs.readFile(path.join(__dirname, '../calendar/calendarObj.json'), (err, data) => {
        if (err) throw err;
        let calJson = JSON.parse(data);
        addToMonth(obj.date[i], calJson, obj, objChanPlanDel, function(revisedCalObj, objChanPlanDel, obj) {
            eraseMonth(obj.date[i], calJson, objChanPlanDel, obj, function(erasedCalObj, objChanPlanDel, obj) {
                //erasedCalObj.push(revisedCalObj)

                function compare(a, b) {
                    const compA = a.sorttime;
                    const compB = b.sorttime;

                  
                    let comparison = 0;
                    if (compA > compB) {
                      comparison = 1;
                    } else if (compA < compB) {
                      comparison = -1;
                    }
                    return comparison;
                  }
                  if (obj.isLive == 'true' && obj.editLive == 'true') { //add live day if there before sorting
                    if (obj.livePostTime == '') {
                        var livePostTime = ''
                        var sortTimeLive = '01:00'
                    } else {
                        var livePostTime = obj.livePostTime.slice(0, -3)
                        var sortTimeLive = moment(obj.livePostTime, 'hh:mm a').format('HH:mm')
                    }
                    let entry = {
                        "id": obj.date[i] + 'live',
                        "name": 'FL Live',
                        "startdate": moment(obj.date[i], 'MMDDYYYY').format('YYYY-MM-DD'),
                        "enddate": "",
                        "starttime": "",
                        "endtime": "",
                        "color": "#ffffff",
                        "url": "",
                        "sorttime": sortTimeLive,
                        "postTime": livePostTime
                    }
                    revisedCalObj.push(entry)
                }
                  if (revisedCalObj.length >= 1) {
                    revisedCalObj[revisedCalObj.length - 1].enddate = obj.subtitles.subtitle2
                    revisedCalObj[revisedCalObj.length - 1].endtime = obj.subtitles.subtitle1
                    revisedCalObj[revisedCalObj.length - 1].starttime = obj.subtitles.subtitle3
                  }

                
                  let sortedArr = erasedCalObj.concat(revisedCalObj).sort(compare)

                let dataToWrite = {
                    "monthly": sortedArr
                }
                    fs.writeFile(path.join(__dirname, '../calendar/calendarObj.json'), JSON.stringify(dataToWrite), (err) => {
                        if (err) throw err;
                        if (i < obj.date.length - 1) {
                            i++
                            addSingleCal(i, objChanPlanDel)
                        } else {

                        }
                    })


            })
        })
    })
}
callback()
},










generateJson: function(date, dbObj) { //updates calendar by DAY, input MMDDYYYY and findOne of day from db
function eraseMonth(date, calObj, callback) {
    let erasedCalObj = []
    for (i = 0; i < calObj.monthly.length; i++) {
        //console.log(calObj.monthly[i].startdate)
            //console.log(monthNum + yearNum)
                if (calObj.monthly[i].id !== date) {
                    
                    erasedCalObj.push(calObj.monthly[i])
                } 
    }


    callback(erasedCalObj)
}

    fs.readFile(path.join(__dirname, '../calendar/calendarObj.json'), (err, data) => {
        if (err) throw err;
        let calJson = JSON.parse(data);
        let arr = []
        if (dbObj.channelPlan.length >= 1) {
        for (i = 0; i < dbObj.channelPlan.length; i++) {

            let postTime = findPostTime()
            
            function findPostTime () {
                if (dbObj.channelPlan[i].postTime) {
                return dbObj.channelPlan[i].postTime
                } else {
                    return ''
                }
            }

            let entry = {
                "id": date,
                "name": dbObj.channelPlan[i].name,
                "startdate": moment(date, 'MMDDYYYY').format('YYYY-MM-DD'),
                "enddate": "",
                "starttime": "",
                "endtime": "",
                "color": "#ffffff",
                "url": dbObj.channelPlan[i].notes,
                "sorttime": moment(dbObj.channelPlan[i].postTime, 'hh:mm a').format('HH:mm'),
                "postTime": ' ' + postTime.slice(0, -3)
            }
            arr.push(entry)
        }
        eraseMonth(date, calJson, function(erasedCalObj) {

            function compare(a, b) {
                const compA = a.sorttime;
                const compB = b.sorttime;
              
                let comparison = 0;
                if (compA > compB) {
                  comparison = 1;
                } else if (compA < compB) {
                  comparison = -1;
                }
                return comparison;
              }
              let sortedArr = arr.sort(compare)
              if (sortedArr.length >= 1) {
                sortedArr[sortedArr.length - 1].enddate = dbObj.subtitles.subtitle2
                sortedArr[sortedArr.length - 1].endtime = dbObj.subtitles.subtitle1
                sortedArr[sortedArr.length - 1].starttime = dbObj.subtitles.subtitle3
              }
            let dataToWrite = {
                "monthly": erasedCalObj.concat(arr).sort(compare)
            }
            fs.writeFile(path.join(__dirname, '../calendar/calendarObj.json'), JSON.stringify(dataToWrite), (err) => {
                if (err) throw err;

            })
        })
    }
    });







},


generatePdf: function(month, year, changes, callback) {



    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('http://localhost:8008/schedule/rcn/calendar/html/' + month + '-' + year, {waitUntil: 'networkidle2'});
        await page.emulateMedia('screen')
        await page.pdf({path: './public/pdf/calendar.pdf',
                        format: 'Letter',
                        printBackground: true,
                        displayHeaderFooter: true,
                        footerTemplate: '<p style = "overflow-wrap: break-word; margin-left: 30px; margin-right: 30px; font-size: 10px; text-align: center; width: 530px;">' + changes + '</p>',
                        margin : {top: '15px',right: '15px',bottom: '60px',left: '15px'},
                    }).then(() => {
                        callback()
                    })
       
        await browser.close();
      })();

}



}