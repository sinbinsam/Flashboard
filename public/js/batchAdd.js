$( document ).ready(function() {

    /*
$( "#picker" ).datepicker({
    dateFormat:'mmddyy',
    onSelect: function() {
    }
});
    */


    // Maintain array of dates
var dates = new Array();

function addDate(date) {
    if (jQuery.inArray(date, dates) < 0) 
        dates.push(date);
        console.log(dates)
}

function removeDate(index) {
    dates.splice(index, 1);
}

// Adds a date if we don't have it yet, else remove it
function addOrRemoveDate(date) {
    var index = jQuery.inArray(date, dates);
    if (index >= 0) 
        removeDate(index);
    else 
        addDate(date);
}

// Takes a 1-digit number and inserts a zero before it
function padNumber(number) {
    var ret = new String(number);
    if (ret.length == 1) 
        ret = "0" + ret;
    return ret;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

$('#datepicker').datepicker({
        dateFormat: "mmddyy",
        onSelect: async function (dateText, inst) {
            addOrRemoveDate(dateText);
            await sleep(50)
            $('.ui-state-default').removeClass('ui-state-active')
        },
        beforeShowDay: function (date) {
            var year = date.getFullYear();
            // months and days are inserted into the array in the form, e.g "01/01/2009", but here the format is "1/1/2009"
            var month = padNumber(date.getMonth() + 1);
            var day = padNumber(date.getDate());
            // This depends on the datepicker's date format
            var dateString = month + day + year;
            var gotDate = jQuery.inArray(dateString, dates);
            if (gotDate >= 0) {
                // Enable date so it can be deselected. Set style to be highlighted
                return [true, "ui-state-highlight"];
            }
            // Dates not in the array are left enabled, but with no extra style
            return [true, ""];
        }
    });



    $('#datepicker').datepicker({
        //options
     })
     .find('a.ui-state-highlight')
     .removeClass('ui-state-highlight');










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
            'date': dates,
            channelPlan: obj,
            subtitles: subtitles
        }
        $('#dateObj').attr('value', objSend)
        console.log(objSend)
        $.ajax({
            type: "POST",
            url: "/schedule/rcn/calendar/batch",
            data: JSON.stringify(objSend),
            success: function(){},
            dataType: "json",
            contentType : "application/json"
          });
    })


});