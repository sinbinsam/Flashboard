var loki = require('lokijs');

module.exports = {

loadDirectvCollection: function(colName, callback) {
            var db = new loki('directv');
            db.loadDatabase({}, function () {
                var _collection = db.getCollection(colName);
                if (!_collection) {
                    console.log("Collection %s does not exit. Creating ...", colName);
                    _collection = db.addCollection('tuners');
                }
                callback(_collection, db);
            });
},
loadRcnCollection: function(colName, callback) {
    var db = new loki('rcn');
    db.loadDatabase({}, function () {
        var _collection = db.getCollection(colName);

        if (!_collection) {
            console.log("Collection %s does not exit. Creating ...", colName);
            _collection = db.addCollection(colName);
        }
        callback(_collection, db);
    });
},
loadTimerCollection(colName, callback) {
    var db = new loki('timers');
    db.loadDatabase({}, function () {
        var _collection = db.getCollection(colName);

        if (!_collection) {
            console.log("Collection %s does not exit. Creating ...", colName);
            _collection = db.addCollection('timers');
        }
        callback(_collection, db);
    });
},
loadScheduleCollection(colName, callback) {
    var db = new loki('schedule');
    db.loadDatabase({}, function() {
        var _collection = db.getCollection('rcn');
        if (!_collection) {
            console.log('Collection %s does not exist. Creating...', colName);
            _collection = db.addCollection('rcn')
            db.saveDatabase();
            callback(_collection, db)
        } else {
           callback(_collection, db) 
        }
    })
}

}