function set_client_data(data){
$('#client_detail_div').removeAttr('hidden');
    $('#client_since').text(data['created'])
    $('#client_key_person').text(data['key_person'])
    $('#client_email').text(data['email_id'])
    $('#client_phone').text(data['phone_number'])
    $('#client_linked_in').text(data['linkedin_profile'])
    let history_div_sample = $('#work_history_sample')
    let work_history_list = data['work_history']
    $('#client_work_history_collapse').empty()
    if (work_history_list.length==0){
        $('#client_work_history_collapse').html('No work history found !')
    }

    for (var work = 0; work < work_history_list.length; work++) {
        let history_div = history_div_sample;
        history_div.find('#resource_name').text(work_history_list[work]['resource_name'])
        history_div.find('#resource_type').text(work_history_list[work]['type_of_resource'])
        history_div.find('#resource_technology').text(work_history_list[work]['technology'])
        history_div.find('#resource_billing').text(work_history_list[work]['billing'])
        history_div.find('#resource_start_date').text(work_history_list[work]['start_date'])
        history_div.find('#resource_end_date').text(work_history_list[work]['end_date'] ? work_history_list[work]['end_date'] : '---')
        history_div.find('#resource_status').text(work_history_list[work]['status'])
        history_div.find('#resource_coordinator').text(work_history_list[work]['project_coordinator'])
        $('#client_work_history_collapse').append(history_div.html())
    }

}

// fix for parsely errors showing before select2
$(document).bind('DOMSubtreeModified',function(){
    parsleyErrors = $('#parsley-id-19');
    if(parsleyErrors && (parsleyErrors.index() < parsleyErrors.siblings('.select2-container').index())){
        parsleyErrors.siblings('.country-error-code').first().append(parsleyErrors);
    }
});
