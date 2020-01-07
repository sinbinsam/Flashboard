$( document ).ready(function() {

$( document ).on('keydown', 'input', function() {
    function checkArray(my_arr){
        for(var i=0;i<my_arr.length;i++){
            if(my_arr[i] === "")   
               return false;
        }
        return true;
     }
  let children = $(this).closest('tbody').find('.name')


    let arr = []
    for (i = 0; i < children.length; i++) {
            arr.push(children[i].value)
    }
    
    
    if (checkArray(arr) == true) {
        let t = $(this).closest('.cloneItem').clone()
        t.find('.name').val('')
        $(this).closest('tbody').append(t)
        //console.log()
    }
    

})



$('#save').on('click', function() {
let sendObj = []
    $('.table').each(function() {
    let arr = []
        $(this).children('tbody').children('tr').children('td').children('input').each(function() {
            if ($(this).val()) {
            arr.push($(this).val())
            }
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