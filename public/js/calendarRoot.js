$( document ).ready(function() {

    $('.monthSelector').MonthPicker({ StartYear: 2020, Disabled: false, SelectedMonth: parseInt(moment().format('MM')) - 2})
    $('.monthSelector').MonthPicker('option', 'MonthFormat', 'MMMM' )

    $('.view').on('click', function() {
        let year = $('.monthSelector').MonthPicker('GetSelectedYear')
        let month = moment($('.monthSelector').MonthPicker('GetSelectedMonth'), 'M').format('MMMM')
        //let changes = $('.changes').val()
        let changes
        if (!$('.changes').val()) {
            changes = 'Finger Lakes Gaming & Racetrack'
        } else {
            changes = $('.changes').val()
        }
        console.log(year, month, changes)
        window.open("/schedule/rcn/calendar/render/" + month + '-' + year + '-' + changes, '_blank');//:month-:year-:changes
    })
    
    $('.download').on('click', function() {
        let year = $('.monthSelector').MonthPicker('GetSelectedYear')
        let month = moment($('.monthSelector').MonthPicker('GetSelectedMonth'), 'M').format('MMMM')
        //let changes = $('.changes').val()
        let changes
        if (!$('.changes').val()) {
            changes = 'Finger Lakes Gaming & Racetrack'
        } else {
            changes = $('.changes').val()
        }
        window.open("/schedule/rcn/calendar/render/" + month + '-' + year + '-' + changes + '/download');
    })
});


