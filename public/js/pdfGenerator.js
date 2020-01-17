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
        //console.log(dbObj)
        let revisedCalObj = [];
        let compare = [];
            for (i = 0; i < calObj.monthly.length; i++) {
                    if (calObj.monthly[i].id == date) {
                        compare.push(calObj.monthly[i])
                    }
            }
            for (i = 0; i < compare.length; i++) {
                for (y = 0; y < dbObj.channelPlan.length; y++) {
                    if (dbObj.channelPlan[y].id == compare[i].id && dbObj.channelPlan[y].name == compare[i].name) {
                        compare[i].postTime = dbObj.channelPlan[y].postTime
                        compare[i].notes = dbObj.channelPlan[y].notes
                    } else {
                        var entry = {
                            "id": moment(dbObj.date, 'MM/DD/YYYY').format('MMDDYYYY'),
                            "name": dbObj.channelPlan[y].name,
                            "startdate": moment(dbObj.date, 'MM/DD/YYYY').format('MMDDYYYY'),
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
            }


            console.log('yes')
            //callback()
    }

    fs.readFile(path.join(__dirname, '../calendar/calendarObj.json'), (err, data) => {
        if (err) throw err;
        let calJson = JSON.parse(data);
        addToMonth(date, calJson, dbObj, function() {
        
        })
        let arr = []
        var entry = {
            "id": "",
            "name": "",
            "startdate": "",
            "enddate": "",
            "starttime": "",
            "endtime": "",
            "color": "#ffffff",
            "url": "",
            "sorttime": ""
        }

        for (i = 0; i < dbObj.channelPlan.length; i++) {

        if (dbObj.channelPlan.length >= 1) {
            //console.log(dbObj.channelPlan)

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
                "name": dbObj.channelPlan[i].name + ' ' + postTime.slice(0, -3),
                "startdate": moment(date, 'MMDDYYYY').format('YYYY-MM-DD'),
                "enddate": "",
                "starttime": "",
                "endtime": "",
                "color": "#ffffff",
                "url": dbObj.channelPlan[i].notes,
                "sorttime": moment(dbObj.channelPlan[i].postTime, 'hh:mm a').format('HH:mm')
            }
            arr.push(entry)



        }

    }


        //console.log(arr)






    })

    


    //addToMonth(date, dateObj, function() {

    //})

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
                "name": dbObj.channelPlan[i].name + ' ' + postTime.slice(0, -3),
                "startdate": moment(date, 'MMDDYYYY').format('YYYY-MM-DD'),
                "enddate": "",
                "starttime": "",
                "endtime": "",
                "color": "#ffffff",
                "url": dbObj.channelPlan[i].notes,
                "sorttime": moment(dbObj.channelPlan[i].postTime, 'hh:mm a').format('HH:mm')
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