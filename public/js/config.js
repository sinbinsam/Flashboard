$(window).on('load', function() { 

$('.edit').click(function() { //dropdown config page
    $('#' + $(this).attr('edit')).removeAttr('disabled')
    $(this).addClass('disabled')
})

$('.save').click(function() {
    console.log($('.meta' + $(this).attr('id')).attr('loki'))
    console.log($('.meta' + $(this).attr('id')).attr('ip'))
    $.post("http://localhost:8080/config/directv/update",
  {
    lokiId: $('.meta' + $(this).attr('id')).attr('loki'),
    ip: $('.meta' + $(this).attr('id')).attr('ip')
  },
  function(data, status){
    alert("Data: " + data + "\nStatus: " + status);
  });
})

})