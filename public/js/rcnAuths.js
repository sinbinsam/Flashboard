$( document ).ready(function() {

$( document ).on('focusout', 'input', function() {
    $('.table').each(function() {
        console.log($(this).children('tbody').children('tr').children('input').val())
    })
})



$('#save').on('click', function() {
let sendObj = []



    $.ajax({
        type: "POST",
        url: "/schedule/rcn/auth",
        data: JSON.stringify(objSend),
        success: function(){},
        dataType: "json",
        contentType : "application/json"
      });
});

});