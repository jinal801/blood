var socket = null;

function getSocketScheme() {
    var scheme = "ws://"
    if (location.protocol.toLowerCase() == "https:") {
        scheme = "wss://"
    }
    return scheme
}


function connect() {
    /** Create WebSocket connection  */
    socket = new WebSocket(getSocketScheme() + window.location.host + "/ws/socket-server/"); // activities websocket URL
    /** Connection opened */
    socket.onopen = function(e) {
        console.log("Successfully connected to the WebSocket.");
        // Fetch Default Log-Activities Data
        $.ajax({
            url: '/activities/list/',
            method: 'GET',
            cache: false,
            dataType: 'json',
            success: function(data) {
                // format data
                const activities_data = $(data)[0].activities_data

                // check if the current live activity present in the page
                // then perform visibility operation
                is_live_feed_activity(activities_data.length)

                if ($('.li_class').length != 0) {
                    $('.li_class').remove();
                }
                for (let i = 0; i < activities_data.length; i++) {
                    let onClick = '"return false;"';
                    if (activities_data[i]['url']){
                        onClick = '"' + "window.open('" + activities_data[i]['url'] + "','_blank')" + '"';
                    }
                    tbody = "<a onclick=" + onClick + "><li class='li_class clickable'><h6>" + activities_data[i]['activities_msg'] +
                        "</h6><p>" + activities_data[i]['date_time'] + "</p></li></a>"
                    $('#myList').append(tbody);
                }
            },
            error: function(error) {
                console.log(error)
            },
        });
    }
    /** Closes the WebSocket connection */
    socket.onclose = function(e) {
        console.log("WebSocket connection closed unexpectedly. Trying to reconnect in 2s...");
        setTimeout(function() {
            console.log("Reconnecting...");
            connect();
        }, 2000);
    };

    function is_live_feed_activity(data) {
        // arguments : data -> on-open or on-message activities
        // visibility operation
        if (!data) {
            $('.live-feeds-box').addClass("live_feed_content")
            $('.live-feeds-box').parents().find('.no-user-page').removeClass("live_feed_content")
        } else {
            $('.live-feeds-box').removeClass("live_feed_content")
            $('.live-feeds-box').parents().find('.no-user-page').addClass("live_feed_content")
        }
    }

    function displayInfoToaster(msg) {
        toastr.options.timeOut = 5000; // 5s
        toastr.options.closeButton = true
        toastr.options.debug = true
        toastr.options.newestOnTop = true
        toastr.options.progressBar = true
        toastr.options.positionClass = "toast-top-right"
        toastr.options.preventDuplicates = true
        toastr.options.onclick = null
        toastr.options.showDuration = "300"
        toastr.options.hideDuration = "1000"
        toastr.options.extendedTimeOut = "1000"
        toastr.options.showEasing = "swing"
        toastr.options.hideEasing = "linear"
        toastr.options.showMethod = "fadeIn"
        toastr.options.hideMethod = "fadeOut"
        toastr.info(msg, "Information");
    }
    /**  message is received from the server */
    socket.onmessage = function(e) {
        const data = JSON.parse(e.data);

        if ('is_notification_counter_update' in data['payload'] && data['payload']['is_notification_counter_update'] == true) { 
            notification_counter()
        }
        else {
            const user_id = JSON.parse(document.getElementById('user_id').textContent);
            let is_admin_user = Object.values(data['payload']['admin_user']).includes(user_id);

            // check if the current live activity present in the page
            // then perform visibility operation
            is_live_feed_activity(data)

            if (is_admin_user | user_id == data['payload']['reporting_manager']) {
                // message toaster trigger point
                displayInfoToaster(data['payload']['activities_msg'])
                // trigger notification counter data
                notification_counter()
                // appending data to the tabl
                let onClick = '"return false;"';
                if (data['payload']['url']){
                    onClick = '"' + "window.open('" + data['payload']['url'] + "','_blank')" + '"';
                }
                const tbody = "<a onclick=" + onClick + "><li class='li_class clickable'><h6>" + data['payload']['activities_msg'] +
                    "</h6><p>" + data['payload']['date_time'] + "</p></li></a>"

                const notification_tbody = "<tr class='clickable' data-auditlog_id='" + data['payload']['auditlog_id'] + "' data-url='" + data['payload']['url'] + "'>" +
                    "<td class='text-truncate clickable notification_rows'>" +
                    data['payload']['activities_msg'] + " " +
                    data['payload']['date_time'] +
                    "</td>" +
                    "<td class='clickable'>" +
                    "<button class='btn btn-primary mark_as_read'>Mark as read</button>" +
                    "</td>" +
                    "</tr>";
                if ($('.li_class').length == 0) {
                    $('#myList').append(tbody);
                } else {
                    $('.li_class:first').parent().before(tbody);
                }
                if ($('#notifications_tbody').length == 0) {
                    $('#notifications_tbody').append(notification_tbody);
                } else {
                    $('#notifications_tbody').prepend(notification_tbody);
                }
            }
        }
    };
    /** socket error */
    socket.onerror = function(err) {
        console.log("WebSocket encountered an error: " + err.message);
        console.log("Closing the socket.");
        socket.close();
    }
}
connect();