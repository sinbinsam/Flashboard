$( document ).ready(function() {

$('#updateRtnChannels').on('click', function() {
    $.ajax({
        type: "POST",
        url: "/schedule/rcn/live/getRtnChannels",
        success: function(){},
        dataType: "json",
        contentType : "application/json"
      });
})



$('#updateRtnAuth').on('click', function() {
  $.ajax({
      type: "POST",
      url: "/schedule/rcn/live/getRtnAuth",
      success: function(){},
      dataType: "json",
      contentType : "application/json"
    });
})







})