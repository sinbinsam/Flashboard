const puppeteer = require('puppeteer');
var moment = require('moment');
var loadDb = require(__dirname + '/loadDBs.js');
var path = require('path')
//var calendarJson = require(path.join(__dirname, '../calendar/calendarObj.json'));
const fs = require('fs');
const didYouMean = require('didyoumean2').default

module.exports = {

generateJsonBatch: function(date, dbObj, callback) {
    function addToMonth (date, calObj, dbObj, callback) {
        //console.log(dbObj) //contains all submitted calendar objects
        let revisedCalObj = [];
        let compare = []; //contains all current calendar objects
            for (i = 0; i < calObj.monthly.length; i++) { //adds current month calendar objects from database into array
                    if (calObj.monthly[i].id == date) {
                        compare.push(calObj.monthly[i])
                    }
            }

                    compare.forEach(element => { //finds existing elements and updates them, removes from dbObj once updated
                        let entry = {
                            "id": moment(dbObj.date, 'MM/DD/YYYY').format('MMDDYYYY'),
                            "name": "",
                            "startdate": moment(dbObj.date, 'MM/DD/YYYY').format('YYYY-MM-DD'),
                            "enddate": "",
                            "starttime": "",
                            "endtime": "",
                            "color": "#ffffff",
                            "url": "",
                            "sorttime": "",
                            "postTime": ""
                        }
                        let isInList = dbObj.channelPlan.find(x => {
                            return x.name === element.name
                        })
                            if (isInList) {
                                element.postTime = moment(isInList.postTime, 'hh:mm a').format('hh:mm')
                                element.url = isInList.notes
                                element.enddate = ""
                                element.endtime = ""
                                element.starttime = ""
                                element.sorttime = moment(isInList.postTime, 'hh:mm a').format('HH:mm')
                                revisedCalObj.push(element)
                                var removeIndex = dbObj.channelPlan.map(function(item) { return item.name; }).indexOf(isInList.name);
                                dbObj.channelPlan.splice(removeIndex, 1);
                            } else if (!isInList) {
                                entry.name = element.name
                                entry.postTime = element.postTime
                                entry.url = element.url
                                entry.sorttime = moment(element.postTime, 'hh:mm a').format('HH:mm')
                                revisedCalObj.push(entry)
                            }
                    })
                    let newElementArr = []
                    dbObj.channelPlan.forEach(element => { //add new elements into newElementArr
                        let entry = {
                            "id": moment(dbObj.date, 'MM/DD/YYYY').format('MMDDYYYY'),
                            "name": "",
                            "startdate": moment(dbObj.date, 'MM/DD/YYYY').format('YYYY-MM-DD'),
                            "enddate": "",
                            "starttime": "",
                            "endtime": "",
                            "color": "#ffffff",
                            "url": "",
                            "sorttime": "",
                            "postTime": ""
                        }
                        entry.name = element.name
                        entry.postTime = element.postTime.slice(0, -3)
                        entry.url = element.notes
                        entry.sorttime = moment(element.postTime, 'hh:mm a').format('HH:mm')
                        newElementArr.push(entry)
                    })
                    Array.prototype.push.apply(revisedCalObj, newElementArr); 
                    callback(revisedCalObj)
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
        addToMonth(date, calJson, dbObj, function(revisedCalObj) {
            eraseMonth(moment(date, 'MM/DD/YYYY').format('MMDDYYYY'), calJson, function(erasedCalObj) {
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
                  let sortedArr = revisedCalObj.sort(compare)
                  if (sortedArr.length >= 1) {
                    sortedArr[sortedArr.length - 1].enddate = dbObj.subtitles.subtitle2
                    sortedArr[sortedArr.length - 1].endtime = dbObj.subtitles.subtitle1
                    sortedArr[sortedArr.length - 1].starttime = dbObj.subtitles.subtitle3
                  }
                let dataToWrite = {
                    "monthly": erasedCalObj.concat(revisedCalObj).sort(compare)
                }
                    fs.writeFile(path.join(__dirname, '../calendar/calendarObj.json'), JSON.stringify(dataToWrite), (err) => {
                        if (err) throw err;
                        callback() //callback to shedulemanager
                    })


            })
        })
    })
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
            console.log(arr)
            fs.writeFile(path.join(__dirname, '../calendar/calendarObj.json'), JSON.stringify(dataToWrite), (err) => {
                if (err) throw err;

            })
        })
    }
    });







},


generatePdf: function(callback) {



    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('http://localhost:8080/schedule/rcn/calendar/html', {waitUntil: 'networkidle2'});
        await page.emulateMedia('screen')
        await page.pdf({path: './public/pdf/hn.pdf',
                        format: 'A4',
                        printBackground: true,
                        displayHeaderFooter: true,
                        headerTemplate: '',
                        footerTemplate: '<p style = "overflow-wrap: break-word; margin-left: 30px; margin-right: 30px; font-size: 10px; text-align: center; width: 530px;">This is the changes line, it supports 2 lines of text. This is the changes line, it supports 2 lines of text. This is the changes line, it supports 2 lines of text.</p>',
                        margin : {top: '20px',right: '0px',bottom: '60px',left: '0px' },
                    }).then(() => {
                        callback()
                    })
       
        await browser.close();
      })();

}



}