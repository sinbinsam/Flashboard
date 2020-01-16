$( document ).ready(function() {

    //$('#picker').val(moment($('#date').attr('unmoment'), 'MMDDYYYY').format('MM/DD/YYYY'))


    $( "#picker" ).datepicker({
        dateFormat:'mmddyy',
        onSelect: function() {
            window.location.replace("http://localhost:8080/schedule/rcn/calendar/" + $(this).val());
        }
    });


        
    

    //$('#date').html(moment($('#date').attr('unmoment'), 'MMDDYYYY').format('MM/DD/YYYY'))


    $('.timepicker2').timepicker({
        timeFormat: 'h:mm p',
        interval: 60,
        minTime: '10:00am',
        maxTime: '11:00pm',
        dropDown: false,
        scrollbar: false
    });

var checkEmptyFun = function() {
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
                let t = $('.cloneItem').clone().removeClass('cloneItem')
                t.find('.name').val('')
                t.find('.time2').val('')
                t.find('.timepicker2').timepicker({
                    timeFormat: 'h:mm p',
                    interval: 60,
                    minTime: '10:00am',
                    maxTime: '11:00pm',
                    dropDown: false,
                    scrollbar: false
                });
                $('#yes').append(t)
            }
 }


$(document).on('focusout', '.name', checkEmptyFun)



$('#save').on('click', function() {
    let obj = []
    $('.name').each(function() {
        if ($(this).val()) {
        obj.push({
            'name': $(this).val(),
            'channel': '',
            'isHd': '',
            'timeToSend': '',
            'postTime': $(this).closest('tr').find('.time2').val(),
            'notes': $(this).closest('tr').find('.notes').val()
        })
        }
    })
        if ($('.name').val()) {
            var subtitles = {
                'subtitle1': $('.subtitle1').val(),
                'subtitle2': $('.subtitle2').val(),
                'subtitle3': $('.subtitle3').val()
            }
        }

    let objSend = {
        'date': $('#date').html(),
        channelPlan: obj,
        subtitles: subtitles
    }
    $('#dateObj').attr('value', objSend)
    console.log(objSend)
    $.ajax({
        type: "POST",
        url: "/schedule/rcn",
        data: JSON.stringify(objSend),
        success: function(){},
        dataType: "json",
        contentType : "application/json"
      });
})



});