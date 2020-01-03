/*(function($) {
    $(function() {
        $('input.timepicker').timepicker({
            timeFormat: 'h:mm p',
            interval: 30,
            minTime: '5',
            maxTime: '11:00pm',
            startTime: '5:00',
            dropDown: false,
            scrollbar: true
        });
    });







})(jQuery);*/

$( document ).ready(function() {

    $('.timepicker').timepicker({
        timeFormat: 'h:mm p',
        interval: 30,
        minTime: '5',
        maxTime: '11:00pm',
        startTime: '5:00',
        dropDown: false,
        scrollbar: true
    });

let checkEmpty = []
var checkEmptyFun = function() {
    console.log('activated')
    let checkEmpty = []
        $('.name').each( function() {
            checkEmpty.push($(this).val())
        })
        function checkArray(my_arr){
            for(var i=0;i<my_arr.length;i++){
                if(my_arr[i] === "")   
                   return false;
            }
            return true;
         }
            if (checkArray(checkEmpty) == true) {
                console.log('added')
                let t = $('.cloneItem').clone().removeClass('cloneItem')
                t.find('.name').val('')
                t.find('.time').val('')
                t.find('.timepicker').timepicker({
                    timeFormat: 'h:mm p',
                    interval: 30,
                    minTime: '5',
                    maxTime: '11:00pm',
                    startTime: '5:00',
                    dropDown: false,
                    scrollbar: true
                });
                $('tbody').append(t)
            }
 }


$(document).on('focusout', '.name', checkEmptyFun)


$('#save').on('click', function() {
    let obj = []
    $('.name').each(function() {
        if ($(this).val()) {
        obj.push({
            'name': $(this).val(),
            'channel': $(this).closest('tr').find('.channel').val(),
            'isHd': $(this).closest('tr').find('.hd').val(),
            'timeToSend': $(this).closest('tr').find('.time').val()
        })
        }
    })
    let objSend = {
        'date': $('#date').html(),
        channelPlan: obj
    }
    console.log(objSend)
})




});