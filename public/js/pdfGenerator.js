const puppeteer = require('puppeteer');
var moment = require('moment');
var loadDb = require(__dirname + '/loadDBs.js');
var path = require('path')
//var calendarJson = require(path.join(__dirname, '../calendar/calendarObj.json'));
const fs = require('fs');

module.exports = {

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
        for (i = 0; i < dbObj.channelPlan.length; i++) {
            let entry = {
                "id": date,
                "name": dbObj.channelPlan[i].name + ' ' + dbObj.channelPlan[i].postTime.slice(0, -3),
                "startdate": moment(date, 'MMDDYYYY').format('YYYY-MM-DD'),
                "enddate": "",
                "starttime": moment(dbObj.channelPlan[i].postTime, 'hh:mm a').format('HH:mm'),
                "endtime": "",
                "color": "#ffffff",
                "url": ""
            }
            arr.push(entry)
        }
        eraseMonth(date, calJson, function(erasedCalObj) {

            function compare(a, b) {
                const compA = a.starttime;
                const compB = b.starttime;
              
                let comparison = 0;
                if (compA > compB) {
                  comparison = 1;
                } else if (compA < compB) {
                  comparison = -1;
                }
                return comparison;
              }
              let sortedArr = arr.sort(compare)
              sortedArr[sortedArr.length - 1].enddate = dbObj.subtitles.subtitle2
              sortedArr[sortedArr.length - 1].endtime = dbObj.subtitles.subtitle1
            let dataToWrite = {
                "monthly": erasedCalObj.concat(arr).sort(compare)
            }
            fs.writeFile(path.join(__dirname, '../calendar/calendarObj.json'), JSON.stringify(dataToWrite), (err) => {
                if (err) throw err;
            })
        })
    });







},


generatePdf: function() {



    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('http://localhost:8080/schedule/calendar', {waitUntil: 'networkidle2'});
        await page.pdf({path: 'hn.pdf', format: 'A4'});
       
        await browser.close();
      })();

}



}