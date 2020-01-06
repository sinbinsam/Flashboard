$( document ).ready(function() {

$( document ).on('focusout', 'input', function() {
    function checkArray(my_arr){
        for(var i=0;i<my_arr.length;i++){
            if(my_arr[i] === "")   
               return false;
        }
        return true;
     }
  let children = $(this).closest('tbody').children('.name')

  console.log(children.length)

    let arr = []
    $(this).parent('td').find('input').each(function() {
        arr.push($(this).val())
        //console.log('yes')
    })
    //console.log(arr)
    if (checkArray(arr) == true) {
        let t = $(this).closest('.cloneItem').clone()
        t.find('.name').val('')
        $(this).closest('tbody').append(t)
        //console.log()
    }
    $('.table').each(function() {
        //console.log($(this).children('tbody').children('tr').children('td').children('input').val())
    })
})



$('#save').on('click', function() {
let sendObj = []
    $('.table').each(function() {
    let arr = []
        $(this).children('tbody').children('tr').children('td').children('input').each(function() {
            arr.push($(this).val())
        })
        
        
        let obj = {
            '$loki': $(this).children('tbody').attr('loki'),
            'auth': arr
        }

        sendObj.push(obj)

        
    });

    console.log(sendObj)

    $.ajax({
        type: "POST",
        url: "/config/rcn/auth",
        data: JSON.stringify(sendObj),
        success: function(){},
        dataType: "json",
        contentType : "application/json"
      });
});

});