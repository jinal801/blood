var statusDict = {
    '': {'colorClass': '', 'text': 'N/A', 'optionLabel': 'Select'},
    'scheduled': {'colorClass': 'bg-green', 'text': "Scheduled", 'optionLabel': 'Scheduled'},
    'next_round': {'colorClass': "bg-dark-green", 'text': "Move to next round", 'optionLabel': 'Move to next round'},
    'rescheduled_needed': {'colorClass': 'bg-dark-blue', 'text': "Rescheduled Needed", 'optionLabel': 'Rescheduled Needed'},
    'selected': {'colorClass': "bg-violet", 'text': "Selected", 'optionLabel': 'Selected'},
    'rejected': {'colorClass': 'bg-pink', 'text': "Rejected", 'optionLabel': 'Rejected'},
    'closed': {'colorClass': "bg-red", 'text': "Closed", 'optionLabel': 'Closed'},
};

function addAllStatusOptions(selected=''){
    var select = $('.tab-pane.active').find('.resource_status');
    select.empty();
    $.each(statusDict, function(key){
        select.append(new Option(statusDict[key]['optionLabel'], key));
    })
    select.val(selected);
}

function set_interviews_data(interview_data, action){
    interview_row_1 = $('.interview_round_div_hidden').clone()
    $('.tab-pane.active').find('.interview_lists').empty()
    $('.tab-pane.active').find('.interview_lists').append('<tr hidden class="interview_round_div_hidden">'+interview_row_1.html()+'</tr>')
    for (let i = 0; i < interview_data.length; i++) {
        interview_row = interview_row_1.clone()
        interview_row.find('.interview_date').append(interview_data[i][0])
        interview_row.find('.interview_time').append(interview_data[i][1])
        interview_row.find('.interview_round').append(interview_data[i][2])
        interview_row.find('.interview_round_status').append(interview_data[i][3])
        if (interview_data[i][7]=='scheduled'){
        var status_class = 'bg-green'
        }else if(interview_data[i][7]=='rejected'){
        var status_class = 'bg-pink'
        }else if(interview_data[i][7]=='rescheduled_needed'){
        var status_class = 'bg-dark-blue'
        }else if(interview_data[i][7]=='next_round'){
        var status_class = 'bg-dark-green'
        }else if(interview_data[i][7]=='selected'){
        var status_class = 'bg-violet'
        }else if(interview_data[i][7]=='closed'){
        var status_class = 'bg-red'
        }
        interview_row.find('.interview_round_status').addClass(status_class)
        interview_row.find('.interview_edit_btn').attr('data-interview_date',interview_data[i][0])
        interview_row.find('.interview_edit_btn').attr('data-interview_time',interview_data[i][1])
        interview_row.find('.interview_edit_btn').attr('data-interview_date_time',interview_data[i][8])
        interview_row.find('.interview_edit_btn').attr('data-interview_round',interview_data[i][9])
        interview_row.find('.interview_edit_btn').attr('data-interview_round_status',interview_data[i][7])
        interview_row.find('.interview_edit_btn').attr('data-interview_round_status_char', statusDict[interview_data[i][7]]['text'])
        interview_row.find('.interview_edit_btn').attr('data-interview_round_number',interview_data[i][6])
        interview_row.find('.interview_edit_btn').attr('data-interview_meeting_link',interview_data[i][5])
        interview_row.find('.table-links').attr('data-target','#user-action-'+i)
        interview_row.find('.list-unstyled').attr('id','user-action-'+i)
        const url = '/interviews/'+interview_data[i][4]+'/update/'
        interview_row.find('.interview_edit_btn').attr('data-interview_url',url)
        interview_row = $('<tr>' + interview_row.html() + '</tr>')
        interview_row.attr('data-toggle', 'modal');
        interview_row.attr('data-target', '#interview_detail_modal');
        interview_row.attr('data-interview_date',interview_data[i][0])
        interview_row.attr('data-interview_time',interview_data[i][1])
        interview_row.attr('data-interview_date_time',interview_data[i][8])
        interview_row.attr('data-interview_round',interview_data[i][9])
        interview_row.attr('data-interview_round_status',interview_data[i][7])
        interview_row.attr('data-interview_round_status_char', statusDict[interview_data[i][7]]['text'])
        interview_row.attr('data-interview_round_number',interview_data[i][6])
        interview_row.attr('data-interview_meeting_link',interview_data[i][5])
        interview_row.attr('data-interview_url',url)
        $('.tab-pane.active').find('.interview_lists').append(interview_row.prop('outerHTML'));
        if(i == 0){
            addAllStatusOptions(selected=interview_data[i][7]);
            hideShowStatusRelatedFields();
            $('.tab-pane.active').find('.response-interview-date-time').val(interview_data[i][8]);
            $('.tab-pane.active').find('.response-interview-date-time').attr('readonly', 'readonly');
            $('.tab-pane.active').find('.response-interview-date-time-div').find('.form-group').addClass('bg-readonly');
            $('.tab-pane.active').find('.response-interview-date-time-div').find('div.form-control').addClass('bg-readonly');


        }
    }
    $('.list-table').attr("hidden",false);
    $('.no-data').attr("hidden",true);
}

$("#schedule_interview_form").djParsley({});
$("#interview_update_form").djParsley({});

$('.resource_status').on('change', function(){
    // resource_status on change the Deployment Div will be hidden until the selection progress is not confirmed.
    let deploymentDateDiv = $(this).parent().parent().parent().find('.deploymentDateDiv');
    deploymentDateDiv.hide();
    deploymentDateDiv.find('.inputDate').val("");

    let status = $(this).val();
    let interviewStatus =  $('.tab-pane.active').find('.interview_lists tr:nth-of-type(2) .interview_round_status');

    let interviewEditBtn =  $('.tab-pane.active').find('.interview_lists tr:nth-of-type(2) ul li');
    let interviewRow =  $('.tab-pane.active').find('.interview_lists tr:nth-of-type(2)');
    data = {
        'interview_date_time': interviewRow.data('interview_date_time'),
        'interview_round_status': status,
        'meeting_link': interviewRow.data('interview_meeting_link'),
    };
//    $.ajax({
//        url: interviewRow.data('interview_url'),
//        method: 'POST',
//        data: data,
//        dataType: 'json',
//        success: function (data) {
    if ($('.tab-pane.active').find('.interview_lists tr').length > 1){
            interviewStatus.removeClass(statusDict[interviewEditBtn.data('interview_round_status')]['colorClass']);

            let statusColorClass = statusDict[status]['colorClass'];
            let statusText = statusDict[status]['text'];

            interviewStatus.addClass(statusColorClass);
            interviewStatus.html(statusText);

            interviewEditBtn.data('interview_round_status', status);
            interviewEditBtn.data('interview_round_status_char', statusText);

            interviewRow.data('interview_round_status', status);
            interviewRow.data('interview_round_status_char', statusText);
    }
//            toastr.success('Status changed successfully!');
//        },
//        error: function (error) {
//            console.log(error)
//        },
//    });
});


//Interview Resources Selection Progress Choices Handling JS.
 $(document).ready(function() {
        $('.selection-progress').on('change', function() {
        const resourceID = $(this).data('resource_id');
        const deploymentInputField = $(`[data-deploy_date_field="${resourceID}"]`);

        deploymentInputField.val("");
            if ( $(this).val() == $('#selection_progress_confirmed').val() ){
                deploymentInputField.parent().parent().show();

            } else {
                deploymentInputField.parent().parent().hide();
            }
        });
    });


$(document).click(function(e) {
    if (!$(event.target).closest('.datetimepicker').length) {
        $('.response-datetimepicker').datetimepicker('hide');
        $('.interview_dp').datetimepicker('hide');
}
});
