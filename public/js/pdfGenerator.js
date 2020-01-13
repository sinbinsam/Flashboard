const puppeteer = require('puppeteer');
var moment = require('moment');
var loadDb = require(__dirname + '/loadDBs.js');
var path = require('path')
//var calendarJson = require(path.join(__dirname, '../calendar/calendarObj.json'));
const fs = require('fs');

module.exports = {

generateJson: function(month, year) { //input MM or 01, and YYYY or 2020



loadDb.loadScheduleCollection('rcn', function(collection, db) {

function eraseMonth(monthNum, yearNum, calObj) {
    let erasedcalObj = []
    for (i = 0; i < calObj.monthly.length; i++) {
        //console.log(calObj.monthly[i].startdate)
        for (x = 1; x < moment(yearNum + monthNum, 'YYYYMM').daysInMonth() + 1; x++) {
                if (calObj.monthly[i].startdate == yearNum + '-' + monthNum + '-' + x) {
                    calObj.monthly.splice(i, 1)
                }


            
        }
        
    }
    console.log(calObj)
}

    fs.readFile(path.join(__dirname, '../calendar/calendarObj.json'), (err, data) => {
        if (err) throw err;
        var calJson = JSON.parse(data);
        eraseMonth('01', '2020', calJson)
    });




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