$(window).on('load', function() { 

$('.edit').click(function() { //dropdown config page
    $('#' + $(this).attr('edit')).removeAttr('disabled')
    $(this).addClass('disabled')
})

$('.save').click(function() {
  let id = $(this).attr('id')
    $.post("http://localhost:8080/config/directv/update",
      {
        lokiId: $('.meta' + id).attr('loki'),
        ip: $('.newIp' + id).val(),
        channel: $('#chan' + id).val()
      },
        function(data, status){
          if (status == 'success') {
            console.log('successfully posted data')
            closeTab(id)
            $('div.card.meta' + id).attr({'channel': $('#chan' + id).val(),
                                          'ip': $('.newIp' + id).val()
                                          })
          } else {
            console.log(data + ', ' + status)
          }
        });
})

$('.cancel').click(function() {
  let id = $(this).attr('id')
  closeTab(id)
  $('#chan' + id).val($('.meta' + id).attr('channel'))
  $('.newIp' + id).val($('.meta' + id).attr('ip'))
})

function closeTab (id) {
  $('#edit' + id).removeClass('disabled')
  $('#collapse' + id).removeClass('collapse show').addClass('collapse')
  $('#chan' + id).attr('disabled', '')
}

$('.new').click(() => {
  $('#addTuner').submit()
})

$('.delete').click(() => {
  let id = 4 //$(this).attr('id')
  console.log(id)
  $('#deleteTunerId').attr('lokiid', $('.meta' + id).attr('loki'))
  $('#deleteTuner').submit()
})

})