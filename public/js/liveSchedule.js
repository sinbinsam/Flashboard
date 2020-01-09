$( document ).ready(function() {





$('#updateRtnAuth').on('click', function() {
  $.ajax({
      type: "POST",
      url: "/schedule/rcn/live/getAuth",
      success: function(){},
      dataType: "json",
      contentType : "application/json"
    });
})







})