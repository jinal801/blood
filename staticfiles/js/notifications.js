function notification_counter(e) {
    // Fetch the User notification details.
    $.ajax({
        url: '/notifications/counter',
        method: 'GET',
        cache: false,
        dataType: 'json',
        success: function(data) {
            // format data
            $.each(data['read_notifications'], function(key, value) {
                const $notification_rows = $('#notifications_table #notifications_tbody tr[data-auditlog_id=' + value + ']')
                $notification_rows.remove();
            });
            $($('.notification')[0].lastElementChild)[0].innerText = data['counter']
            showEmptyIconIfNoNotifications();
        },
        error: function(error) {
            console.log(error)
        },
    });
}
notification_counter()

function showEmptyIconIfNoNotifications(){
    const $notification_rows = $('#notifications_table #notifications_tbody tr');
    if ($notification_rows.length == 0){
        $('.notifications-box').addClass("d-none")
        $('.notifications-box').parents().find('.no-user-page').removeClass("d-none")
    }
    else{
        $('.notifications-box').removeClass("d-none")
        $('.notifications-box').parents().find('.no-user-page').addClass("d-none")
    }
}


$(document).ready(function() {

    $(document).on('click', '.mark_all_as_read', function() {
        // All Notification's peform as Mark as all read.
        const auditlog_ids = []
        const $notification_rows = $('#notifications_table #notifications_tbody tr')
        for (let i = 0; i < $notification_rows.length; i++) {
            var dataID = parseInt($($notification_rows[i]).attr("data-auditlog_id"))
            auditlog_ids.push(dataID)
        }
        notification_read(auditlog_ids)
        // notification_counter()
    });

    $(document).on('click', '.mark_as_read', function() {
        // Single Notification perform as Mark as read.
        const $notification_row = $(this).closest('tr')[0].dataset['auditlog_id']
        const dataID = Array($notification_row).map(Number)
        notification_read(dataID)
        // notification_counter()
    });


    function notification_read(auditlog_ids) {
        // API call to store notification ID as read.
        $.ajax({
            url: '/notifications/read/',
            method: 'POST',
            cache: false,
            dataType: 'json',
            data: { 'auditlog_ids': JSON.stringify(auditlog_ids) },
            success: function(data) {
                // if mark_all_as_read button clicked remove the entire rows of table.
                if (data['auditlog_ids'].length > 1) {
                    $('#notifications_table #notifications_tbody').html('') ;
                }
                // after notification read, remove the single row for the table
                else{
                    const $notification_row = $('#notifications_table #notifications_tbody tr[data-auditlog_id=' + data['auditlog_ids'][0] + ']');
                    $notification_row.remove();
                }

            },
            error: function(error) {
                console.log(error)
            },
        });
    }
    $(document).on('click', '.notification_rows', function(e) {
        // row(tr) click perform notification consider as read.
        var $current_row = $(this).parent();
        $current_row.find('.mark_as_read').click();
        var $url = $(this).parent().data('url');
        if ($url){
            window.open($url);
        }
        e.preventDefault();
    });


});