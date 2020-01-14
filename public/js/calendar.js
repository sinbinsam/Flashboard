$( document ).ready(function() {
    $('#mycalendar').monthly({
        dataType: 'json',
        jsonUrl: '/calendar/calendarObj.json',
        eventList: false
        
    });
});//jsonUrl: '/calendar/calendarObj.json'