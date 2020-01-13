$( document ).ready(function() {
    $('#mycalendar').monthly({
        dataType: 'json',
        jsonUrl: '/js/calendarexample.json'
    });
});