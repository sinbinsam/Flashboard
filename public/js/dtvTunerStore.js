var loki = require('lokijs');

module.exports = {

    dtvStore: function(channel, ip) {
        
        let db = new loki('directv', {
            autoload: true,
            autoloadCallback : databaseInitialize,
            autosave: true, 
            autosaveInterval: 4000
        });
    
        function databaseInitialize() {
            var tuners = db.getCollection("tuners");
            if (tuners === null) {
              tuners = db.addCollection("tuners");
            }



            //tuners.remove({channel: 20})

                        /*tuners.insert( { 
                                        channel: 20,
                                        ip: '10.160.27.30',
                                        online: false
                                    }, function(err) {
                                        if (err) {
                                            console.log(err)
                                        }
                                    })*/

        }



    }


}