$( document ).ready(function() {

$('#updateRtnChannels').on('click', function() {
    $.ajax({
        type: "POST",
        url: "/schedule/rcn/live/getRtnChannels",
        success: function(){console.log('success')},
        dataType: "json",
        contentType : "application/json"
      });
})











})