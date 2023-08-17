const BDE = 'bde'
const BDM = 'bdm'
const RM = 'rm'
var requestFollowupButton = $('#request-followup');
function enableLoader(){
   loaders = document.getElementsByClassName("loader");
   for(loader of loaders){
        loader.style.display="block";
   }
}
function disableLoader(){
   loaders = document.getElementsByClassName("loader");
   for(loader of loaders){
        loader.style.display="none";
   }
}

$('#add_resource_modal').on('show.bs.modal', function(event) {
    var button = $(event.relatedTarget)
    var modal = $(this)
    $('#add_resource_cv_form').attr('action', button.data('url'))
    modal.find('#id_resource_profile_required').val(button.data('resource_id'))
});
$('#edit_resource_modal').on('show.bs.modal', function(event) {
    var button = $(event.relatedTarget)
    var modal = $(this)
    $('#edit_resource_cv_form').attr('action', button.data('url'))
    modal.find('#id_resource_profile_required').val(button.data('resource_id'))
    modal.find('#id_resource_name').val(button.data('resource_name'))
    modal.find('#id_quoted_rate_rm').val(button.data('quoted_rate_rm'))
    modal.find('#id_quoted_rate_bdm').val(button.data('quoted_rate_bdm'))
    modal.find('#id_resume_file').parent().find('label').text('Resume File - current file: ' + button.data('resume_file'))
    modal.find('#id_working_timezone').val(button.data('working_timezone'))
    modal.find('#id_type_of_resource').val(button.data('type_of_resource'))
    $('#delete_resource_cv').attr('href', button.data('delete_url'))

});
$('.cv_row_tr').click(function(event) {
    if ($(this).find('.download_file')[0] === event.target) {
        event.stopPropagation();
    }
});
$('.styled-checkbox-input').click(function(event) {
    event.stopPropagation();
});
$('.delete_confirm_td').on('click', function(event) {
    var button = $(event.relatedTarget)
    event.stopPropagation();
    $('#ResourceDeleteModal').modal('toggle')
    $('#delete_resource_cv').attr('href', this.getAttribute('data-delete_url'))
});
$('#delete_resource_btn').click(function(event) {
    $('#edit_resource_modal').modal('hide')
});


// delete resource from list button disabled when there are only one resource window
function disable_delete_button() {
    $(global_var.class_delete_resource_btn).attr('aria-disabled', 'true');
    $(global_var.class_delete_resource_btn).attr('class', 'btn btn-grey m-1 invisible delete_resource_btn');
}

function updateElementIndex(el, prefix, ndx) {
    var id_regex = new RegExp('(' + prefix + '-\\d+)');
    var replacement = prefix + '-' + ndx;
    if ($(el).attr("for")) $(el).attr("for", $(el).attr("for").replace(id_regex, replacement));
    if (el.id) el.id = el.id.replace(id_regex, replacement);
    if (el.name) el.name = el.name.replace(id_regex, replacement);
}
// delete resource row when button will clicked
function delete_resource_row(resource_row_id) {
    var total_present_resource = $(global_var.class_add_resource).children('div').length;
    var resource_row = document.getElementById(resource_row_id).parentElement.parentElement
    if (total_present_resource <= 1) {
        disable_delete_button();
    } else {
        resource_row.remove();
        var total_present_resource = $(global_var.class_add_resource).children('div').length;
        if (total_present_resource <= 1) {
            disable_delete_button();
        }
    }
    var forms = $(global_var.class_add_resource).children('div')

    for (var i = 0, formCount = total_present_resource; i < formCount; i++) {
        var div_id = 'add_resource_div_id_' + i
        var div_id = 'add_resource_div_id_' + i
        $(forms.get(i)).find(':input').each(function() {
            updateElementIndex(this, 'resource_profiles_required', i);
        });
    }
    var div_id = 0
    $(global_var.class_delete_resource_btn).each(function() {
        $(this).attr('id', div_id);
        div_id++
    });
    $(global_var.id_resource_profile_total_forms).attr('value', total_present_resource--);
}
// remove the required field error
function error_remove(event) {
    if (event.value.length >= 1) {
        $('#' + event.id).parent().parent().find('.error_class').html('')
    }
}

// function for error checking at the request create time
function is_error(error) {
    $('.add_resource_error').parent().find('.form-control').each(function() {
        var this_param = $(this).attr('name')
        var element_array = ['technology', 'prospect_budget', 'count', 'experience', 'working_timezone']
        if (this_param.includes('working_timezone')) {
            var error_div = '<div class="text-danger error_class mt-2"></div>'
        } else {
            var error_div = '<div class="text-danger error_class"></div>'
        }
        const even = (element) => this_param.includes(element);
        if (this_param != undefined && element_array.some(even)) {
            if ($(this).val().length == 0)

            {
                if ($(this).parent().find('.error_class').length == 0) {
                    $(this).parent().append(error_div)
                }
                $(this).parent().find('.error_class').html('<small>* This field is required.</small>')
                error = true
            }
        }
    })
    return error
}

// add new resource row when button will click
function add_resource_row(data) {
    error = false
    if (is_error(error)) {
        return
    }
    var experience_values = ''
    $(global_var.id_resource_profile_required_section_hidden).children().each(function() {
        experience_values += $(this)[0].outerHTML
    });
    var add_resource_div_length = $('.add_resource').children('div').length;

    const elements = document.getElementsByClassName('delete_resource_btn');
    $(global_var.class_delete_resource_btn).attr('aria-disabled', 'false');
    $(global_var.class_delete_resource_btn).attr('class', 'report-btn  visible add_resource_detail delete_resource_btn');
    var add_resource_id = add_resource_div_length
    $('#id_resource_profiles_required-1000-working_timezone').attr('onchange', "error_remove(this)")
    var working_timezone_div = $('#id_resource_profiles_required-1000-working_timezone').parent().parent().html()
    working_timezone_div = working_timezone_div.replaceAll("resource_profiles_required-1000-working_timezone",
        "resource_profiles_required-" + add_resource_id + "-working_timezone");
//    var city_div = $('#id_resource_profiles_required-1000-city').parent().parent().html()
//    city_div = city_div.replaceAll("resource_profiles_required-1000-city",
//        "resource_profiles_required-" + add_resource_id + "-city");
//    var country_div = $('#id_resource_profiles_required-1000-country').parent().parent().html()
//    country_div = country_div.replaceAll("resource_profiles_required-1000-country",
//        "resource_profiles_required-" + add_resource_id + "-country");
    var notes_div = $('#id_resource_profiles_required-1000-notes').parent().parent().html()
    notes_div = notes_div.replaceAll("resource_profiles_required-1000-notes",
        "resource_profiles_required-" + add_resource_id + "-notes");

    var hostname_1 = window.location.origin
    var hostname_2 = window.location.origin
    var division_code_fraction_start = '<div class="add-resource-content"><div class="row align-items-center"><div class="col-lg-11 col-md-11 col-sm-11 col-12 add_resource_error" id="add_resource_div_id_'
    var add_resource_value = '"><div class="left-add-resource"><div class="row"><div class="col-lg-6 col-md-6 col-sm-12 col-12"><div class="form-group"><label for="id_resource_profiles_required-' + add_resource_id + '-technology">Technology Required</label><input type="text" onchange="error_remove(this)" class="form-control" name="resource_profiles_required-' + add_resource_id + '-technology" maxlength="50" id="id_resource_profiles_required-' + add_resource_id + '-technology" placeholder="Mention Technology Here"></div></div><div class="col-lg-6 col-md-6 col-sm-12 col-12"><div class="form-group"><label for="id_resource_profiles_required-' + add_resource_id + '-experience">Experience</label><select class="form-control" name="resource_profiles_required-' + add_resource_id + '-experience" onchange="error_remove(this)" id="id_resource_profiles_required-' + add_resource_id + '-experience">' + experience_values + '</select></div></div><div class="col-lg-6 col-md-6 col-sm-12 col-12"><div class="form-group"><label for="id_resource_profiles_required-' + add_resource_id + '-prospect_budget">Prospect Budget </label><input type="text" onchange="error_remove(this)" class="form-control" placeholder="Enter Budget" name="resource_profiles_required-' + add_resource_id + '-prospect_budget" maxlength="50" id="id_resource_profiles_required-' + add_resource_id + '-prospect_budget"></div></div><div class="col-lg-6 col-md-6 col-sm-12 col-12"><div class="form-group"><label for="id_resource_profiles_required-' + add_resource_id + '-count">Total Resource </label><input type="text" maxlength="10" class="form-control" placeholder="Enter Total Resource" id="id_resource_profiles_required-' + add_resource_id + '-count" name="resource_profiles_required-' + add_resource_id + '-count" onchange="error_remove(this)" ></div></div><div class="col-lg-12 col-md-12 col-sm-12 col-12">' + working_timezone_div + '</div><div class="col-lg-12 col-md-12 col-sm-12 col-12">' + notes_div + '</div><div class="col-lg-12 col-md-12 col-sm-12 col-12"><div class="form-group"><label for="id_resource_profiles_required-' + add_resource_id + '-job_description">Job Descriptions</label><div class="mb-2 p-3"><textarea class="form-control" id="id_resource_profiles_required-' + add_resource_id + '-job_description" placeholder="Detailed Job Descriptions" cols="10" name="resource_profiles_required-' + add_resource_id + '-job_description"></textarea></div></div></div></div></div></div><!-- Add new resource or delete current resource section starts--><div class="col-lg-1 col-md-1 col-sm-1 col-12"><div class="acordian-btn mb-3"><a onclick="delete_resource_row(' + "'add_resource_div_id_" + add_resource_id
    var add_resource_value_2 = "')" + '"' + "class='report-btn  delete_resource_btn add_resource_detail' >-</a></div><div class='acordian-btn mt-3'><a class='report-btn report-btn1 add_resource_detail' onclick='add_resource_row()' id='add_resource_id_" + add_resource_id
    var division_code_fraction_6 = "'>+</a></div></div></div></div></div></div>"
    var result = division_code_fraction_start.concat(add_resource_id, add_resource_value, add_resource_value_2, division_code_fraction_6)
    $(global_var.class_add_resource).append(result);

    var config = CKEDITOR.instances["id_resource_profiles_required-0-job_description"]
    if (config) {
        var config = config.config
    }
    $('#id_resource_profiles_required-' + add_resource_id + '-job_description').ckeditor(config, function() {})
//    $('#id_resource_profiles_required-' + add_resource_id + '-working_timezone').select2();
//    $('#id_resource_profiles_required-' + add_resource_id + '-city').select2();
//    $('#id_resource_profiles_required-' + add_resource_id + '-country').select2();
    var add_resource_div_length = $(global_var.class_add_resource).children('div').length;
    add_resource_id++;
    $(global_var.id_resource_profile_total_forms).attr('value', add_resource_id);
    // remove button visible for first resource
    var add_resource_div_length = $('.add_resource').children('div').length;
    $('.delete_resource_btn').attr('hidden', false)
    if (add_resource_div_length == 1) {
        $('.delete_resource_btn').attr('hidden', true)
    }
}

function edit_resource(experience, div_resource_id, resource_id, technology, experience, job_description, prospect_budget, count, working_timezone, counter) {
    let element = document.getElementById(div_resource_id);
    element.innerHTML = '<div class="flex-container" id="resource_list"><input type="hidden" name="resource_profiles_required-' + div_resource_id + '-id" value="' + resource_id + '" id="id_resource_profiles_required-' + div_resource_id + '-id"><div class="col-lg-10 col-md-10 col-sm-10 p-2"><div class="form-group p-2"><label for="id_resource_profiles_required-' + counter + '-job_description">Job Descriptions</label><textarea class="form-control mb-4" type="text"name="resource_profiles_required-' + counter + '-job_description" cols="10" id="id_resource_profiles_required-' + counter + '-job_description" >' + job_description + '</textarea></div></div><div class="col-sm-1 col-md-1 col-lg-1 "> <div class=""  data-toggle="tooltip" data-placement="top"title="Save Resource"><span  class="paper-icon"><button class="bg-transparent" type="submit"><img class="extended-paper-icon ml-2"src="' + global_var.save_button_path + '"alt="paper icon"></button></span></div></div><div class="col-md-12 col-lg-12 col-sm-12"><div class="row p-2"><div class="col-lg-6 col-md-12 col-sm-12 p-2"><div class="form-group"><label for="id_resource_profiles_required-' + counter + '-technology">Technology Required</label><input type="text"class="form-control"name="resource_profiles_required-' + counter + '-technology"maxlength="50"id="id_resource_profiles_required-' + counter + '-technology"value="' + technology + '"></div></div><div class="col-lg-6 col-md-12 col-sm-12 p-2"><div class="form-group"><label for="id_resource_profiles_required-' + counter + '-experience">Experience Required</label><select class="form-control"name="resource_profiles_required-' + counter + '-experience" id="id_resource_profiles_required-' + counter + '-experience"><option value="">Select</option><option value="junior">Junior Level (1 – 3 Years of Experience)</option><option value="mid">Mid-Level (3 – 6 Years of Experience)</option><option value="senior">Senior Level (6 – 8 Years of Experience)</option><option value="tl">Team Lead (8+ Years of Experience)</option><option value="solution_architect">Solution / Technology Architect</option></select></div></div><div class="col-lg-6 col-md-12 col-sm-12 p-2"><div class="form-group"><label for="id_resource_profiles_required-' + counter + '-prospect_budget">Prospect Budget</label><input type="text" class="form-control"name="resource_profiles_required-' + counter + '-prospect_budget"maxlength="50"id="id_resource_profiles_required-' + counter + '-prospect_budget"value="' + prospect_budget + '"></div></div><div class="col-lg-6 col-md-12 col-sm-12 p-2"><div class="form-group"><label for="id_resource_profiles_required-' + counter + '-count">Total Resource</label><input type="number" class="form-control" min="1"name="resource_profiles_required-' + counter + '-count"id="id_resource_profiles_required-' + counter + '-count"value="' + count + '"></div></div></div></div></div>'
    var working_timezone_div = $('#id_resource_profiles_required-1000-working_timezone').parent().parent().html()
    working_timezone_div = working_timezone_div.replaceAll("resource_profiles_required-1000-working_timezone",
        "resource_profiles_required-" + counter + "-working_timezone");
//    working_timezone_div = working_timezone_div.replace('value="' + working_timezone + '"', 'value="' + working_timezone + '" selected')
    element.innerHTML = '<div class="flex-container" id="resource_list"><input type="hidden" name="resource_profiles_required-' + div_resource_id + '-id" value="' + resource_id + '" id="id_resource_profiles_required-' + div_resource_id + '-id"><div class="col-lg-10 col-md-10 col-sm-10 p-2"><div class="form-group p-2"><label for="id_resource_profiles_required-' + counter + '-job_description">Job Descriptions:</label><textarea class="form-control mb-4" type="text"name="resource_profiles_required-' + counter + '-job_description" cols="10" id="id_resource_profiles_required-' + counter + '-job_description" >' + job_description + '</textarea></div></div><div class="col-sm-1 col-md-1 col-lg-1 "> <div class=""  data-toggle="tooltip" data-placement="top"title="Save Resource"><span  class="paper-icon"><button class="bg-transparent" type="submit"><img class="extended-paper-icon ml-2"src="' + global_var.save_button_path + '"alt="paper icon"></button></span></div></div><div class="col-md-12 col-lg-12 col-sm-12"><div class="row p-2"><div class="col-lg-6 col-md-12 col-sm-12 p-2"><div class="form-group"><label for="id_resource_profiles_required-' + counter + '-technology">Technology Required:</label><input type="text"class="form-control"name="resource_profiles_required-' + counter + '-technology"maxlength="50"id="id_resource_profiles_required-' + counter + '-technology"value="' + technology + '" placeholder="Mention Technology Here"></div></div><div class="col-lg-6 col-md-12 col-sm-12 p-2"><div class="form-group"><label for="id_resource_profiles_required-' + counter + '-experience">Experience Required:</label><select class="form-control"name="resource_profiles_required-' + counter + '-experience" id="id_resource_profiles_required-' + counter + '-experience"><option value="">Select</option><option value="junior">Junior Level (1 – 3 Years of Experience)</option><option value="mid">Mid-Level (3 – 6 Years of Experience)</option><option value="senior">Senior Level (6 – 8 Years of Experience)</option><option value="tl">Team Lead (8+ Years of Experience)</option><option value="solution_architect">Solution / Technology Architect</option></select></div></div><div class="col-lg-6 col-md-12 col-sm-12 p-2"><div class="form-group"><label for="id_resource_profiles_required-' + counter + '-prospect_budget">Prospect Budget:</label><input type="text" class="form-control"name="resource_profiles_required-' + counter + '-prospect_budget"maxlength="50"id="id_resource_profiles_required-' + counter + '-prospect_budget"value="' + prospect_budget + '" placeholder="Enter Budget"></div></div><div class="col-lg-6 col-md-12 col-sm-12 p-2"><div class="form-group"><label for="id_resource_profiles_required-' + counter + '-count">Total Resource:</label><input type="text" placeholder="Enter Total Resource" maxlength="10" class="form-control" name="resource_profiles_required-' + counter + '-count"id="id_resource_profiles_required-' + counter + '-count"value="' + count + '" "></div></div>' + '<div class="col-lg-6 col-md-12 col-sm-12 p-2">' + working_timezone_div + '</div></div></div></div>'
    select_element = $('#id_resource_profiles_required-' + counter + '-experience option[value="' + experience + '"]').attr("selected", "selected");
    var config = CKEDITOR.instances["id_resource_profiles_required-1000-job_description"].config
    $('#id_resource_profiles_required-' + counter + '-job_description').ckeditor(config, function() {})
//    $('#id_resource_profiles_required-' + counter + '-working_timezone').select2();
}

$(document).on('click', '.delete-resource', function() {
    var id = $(this).data('id');
    $(global_var.class_resource_delete_confirm_show).html($(global_var.class_resource_delete_confirm_hidden).children('button'));
    $(global_var.id_delete_confirm).modal('show');
    var current_url = $(global_var.class_resource_id_modal_url).attr('data-url')
    var current_url = current_url.replace('/1/delete', '/' + id + '/delete')
    $(global_var.class_resource_id_modal_url).attr('data-url', current_url)
});

function delete_resource_func(data) {
    var current_url = $(global_var.class_resource_id_modal_url).attr('data-url')
    window.location = current_url
    document.getElementById("add_more_resource").scrollIntoView();
}

function add_cv_row() {
    resumeTotalForms = document.getElementById("id_resumes-TOTAL_FORMS")
    prefixRegex = '__prefix__';
    $(global_var.id_add_cv_table_last_row).after('<tr>' + $(global_var.id_add_cv_section).html().replaceAll(prefixRegex, resumeTotalForms.value) + '</tr>');
    resumeTotalForms.value = parseInt(resumeTotalForms.value) + 1;
}
$('#ResourceDeleteModal').on('show.bs.modal', function(e) {
    var button = $(e.relatedTarget)
    $('#delete_resource_cv').attr('href', button.data('delete_url'))
})
$('#ResourceDeleteModal').on('click', function(e) {
    var button = $(e.relatedTarget)
    $('#delete_resource_cv').attr('href', button.data('delete_url'))
})

$('.edit-resource-btn').on('click', function(e) {
    $('#' + $(this).data('resource_div')).find('.resource-readonly').hide()
    $('#' + $(this).data('resource_div')).find('.resource-edited').removeAttr('hidden')
    select_div = $($('.request-active-detail .country-add-resource'))
/*
    for (let i = 0; i < select_div.length; i++) {
        var country_url = '/resource_management/cities/?country=' + $(select_div[i]).find('option:selected').val()
        if ($(select_div[i]).find('option:selected').val() != undefined) {
            $.ajax({
                url: country_url,
                method: 'GET',
                dataType: 'json',
                beforeSend: enableLoader,
                success: function(data) {
                    city_select_div_parent = $(select_div[i]).parent().parent().next()
                    var city_val = city_select_div_parent.find('select').data('city_id')
                    timezone_select_div_parent = $(select_div[i]).parent().parent().next().next()
                    var timezone_val = timezone_select_div_parent.find('select').data('working_timezone')
                    city_select_div_parent.find('.city-add-resource').html("");
                    timezone_select_div_parent.find('.working_tz-add-resource').html("");
                    city_select_div_parent.find('.city-add-resource').append($('<option>', {
                        value: '',
                        text: 'Select',
                    }));
                    timezone_select_div_parent.find('.working_tz-add-resource').append($('<option>', {
                        value: '',
                        text: 'Select',
                    }));
                    for (let i = 1; i < data.cities.length; i++) {
                        city_select_div_parent.find('.city-add-resource').append($('<option>', {
                            value: data.cities[i][0],
                            text: data.cities[i][1],
                        }));
                        if (city_val == data.cities[i][0]) {
                            city_select_div_parent.find('.city-add-resource option').attr('selected', true);
                        }
                    }
                    for (let i = 1; i < data.timezones.length; i++) {
                        timezone_select_div_parent.find('.working_tz-add-resource').append($('<option>', {
                            value: data.timezones[i][0],
                            text: data.timezones[i][1]
                        }));
                        if (timezone_val == data.timezones[i][0]) {
                            timezone_select_div_parent.find('.working_tz-add-resource option').attr('selected', true);
                        }
                    }
                    disableLoader();
                },
                error: function(error) {
                    console.log(error)
                },
            });
        }
    }
*/
})

$('#edit-request-btn').on('click', function(e) {
    $('#request-readonly-div').hide()
    $('#request-edited-div').removeAttr('hidden')

})


requestFollowupButton.on('click', function(e) {
    $.ajax({
        url: `/resource_management/request/${this.getAttribute('data-id')}/last-followup-datetime/`,
        method: 'POST',
        error: function(error) {
            console.log(error);
        },
    });
    window.location.href = `${this.getAttribute('data-follow-up-url')}`;
});

    // Update the count down every 1 second
var request_followup = setInterval(function() {
    var strDate = $("#last-request-followup-datetime").html();
    if (strDate != 'N/A') {
        var date = new Date(strDate)
        var countDownDate = date.setHours(date.getHours() + 6)
        // Get today's date and time
        var now = new Date().getTime();

        // Find the difference between now and the count down date
        var difference = countDownDate - now;
        if (difference > 0) {
            // Time calculations for days, hours, minutes and seconds
            var hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((difference % (1000 * 60)) / 1000);

            // Output the result in an element with id="followup-timer"
            $("#followup-timer").html(hours + "h " +
                minutes + "m " + seconds + "s ");
        }
        // If the count down is over, write some text
        else {
            clearInterval(request_followup);
            requestFollowupButton.attr('disabled', false);
            $("#followup-timer").html("");
        }
    }
    else {
        clearInterval(request_followup);
        requestFollowupButton.attr('disabled', false);
        $("#followup-timer").html("");
    }
}, 1000);

/*
if ($('.error_class').length > 1) {
    select_div = $($('.add-resource-content .country-add-resource'))
    if (!select_div.length) {
        select_div = $($('.resource-div-length .country-add-resource'))
        for (let i = 0; i < select_div.length; i++) {
            var country_url = '/resource_management/cities/?country=' + $(select_div[i]).find('option:selected').val()
            if ($(select_div[i]).find('option:selected').val() != undefined) {
                $.ajax({
                    url: country_url,
                    method: 'GET',
                    dataType: 'json',
                    beforeSend: enableLoader,
                    success: function(data) {
                        city_select_div_parent = $(select_div[i]).parent().closest('div').parent().next()
                        var city_val = city_select_div_parent.find('select').data('city_id')
                        timezone_select_div_parent = $(select_div[i]).parent().closest('div').parent().next().next()
                        var timezone_val = timezone_select_div_parent.find('select').data('working_timezone')
                        city_select_div_parent.find('.city-add-resource').html("");
                        timezone_select_div_parent.find('.working_tz-add-resource').html("");
                         city_select_div_parent.find('.city-add-resource').append($('<option>', {
                             value: '',
                             text: 'Select',
                         }));
                         timezone_select_div_parent.find('.working_tz-add-resource').append($('<option>', {
                             value: '',
                             text: 'Select',
                         }));
                        for (let i = 1; i < data.cities.length; i++) {
                            city_select_div_parent.find('.city-add-resource').append($('<option>', {
                                value: data.cities[i][0],
                                text: data.cities[i][1],
                            }));
                            if (city_val == data.cities[i][0]) {
                                city_select_div_parent.find('.city-add-resource option').attr('selected', true);
                            }
                        }
                        for (let i = 1; i < data.timezones.length; i++) {
                            timezone_select_div_parent.find('.working_tz-add-resource').append($('<option>', {
                                value: data.timezones[i][0],
                                text: data.timezones[i][1]
                            }));
                            if (timezone_val == data.timezones[i][0]) {
                                timezone_select_div_parent.find('.working_tz-add-resource option').attr('selected', true);
                            }
                        }
                        disableLoader();
                    },
                    error: function(error) {
                        console.log(error)
                    },
                });
            }
        }
    } else {
        for (let i = 1; i < select_div.length; i++) {
            var country_url = '/resource_management/cities/?country=' + $(select_div[i]).find('option:selected').val()
            if ($(select_div[i]).find('option:selected').val() != undefined) {
                $.ajax({
                    url: country_url,
                    method: 'GET',
                    dataType: 'json',
                    beforeSend: enableLoader,
                    success: function(data) {
                        city_select_div_parent = $(select_div[i]).parent().closest('div').parent().next()
                        var city_val = city_select_div_parent.find('select').data('city_id')
                        timezone_select_div_parent = $(select_div[i]).parent().closest('div').parent().next().next()
                        var timezone_val = timezone_select_div_parent.find('select').data('working_timezone')
                        city_select_div_parent.find('.city-add-resource').html("");
                        timezone_select_div_parent.find('.working_tz-add-resource').html("");
                         city_select_div_parent.find('.city-add-resource').append($('<option>', {
                             value: '',
                             text: 'Select',
                         }));
                         timezone_select_div_parent.find('.working_tz-add-resource').append($('<option>', {
                             value: '',
                             text: 'Select',
                         }));
                        for (let i = 1; i < data.cities.length; i++) {
                            city_select_div_parent.find('.city-add-resource').append($('<option>', {
                                value: data.cities[i][0],
                                text: data.cities[i][1],
                            }));
                            if (city_val == data.cities[i][0]) {
                                city_select_div_parent.find('.city-add-resource option').attr('selected', true);
                            }
                        }
                        for (let i = 1; i < data.timezones.length; i++) {
                            timezone_select_div_parent.find('.working_tz-add-resource').append($('<option>', {
                                value: data.timezones[i][0],
                                text: data.timezones[i][1]
                            }));
                            if (timezone_val == data.timezones[i][0]) {
                                timezone_select_div_parent.find('.working_tz-add-resource option').attr('selected', true);
                            }
                        }
                        disableLoader();
                    },
                    error: function(error) {
                        console.log(error)
                    },
                });
            }
        }
    }
}
*/

/*
function CntryFromCity(e) {
    var optionSelected = $("option:selected", e);
    select_div = $(e)
    select_div_parent = select_div.parent().parent().parent()
    var valueSelected = e.value;
    var country_url = '/resource_management/cities/?country=' + select_div.find('option:selected').val()
    $.ajax({
        url: country_url,
        method: 'GET',
        dataType: 'json',
        beforeSend: enableLoader,
        success: function(data) {
            var city = data.cities
            select_div_parent.find('.city-add-resource').html("");
            select_div_parent.find('.working_tz-add-resource').html("");
            for (let i = 0; i < data.cities.length; i++) {
                select_div_parent.find('.city-add-resource').append($('<option>', {
                    value: data.cities[i][0],
                    text: data.cities[i][1]
                }));
            }
            for (let i = 0; i < data.timezones.length; i++) {
                select_div_parent.find('.working_tz-add-resource').append($('<option>', {
                    value: data.timezones[i][0],
                    text: data.timezones[i][1]
                }));
            }
            disableLoader();
        },
        error: function(error) {
            console.log(error)
        },
    });
}
*/

/*
function TzFromCity(e) {
    var optionSelected = $("option:selected", e);
    select_div = $(e)
    select_div_parent = select_div.parent().parent().parent()
    var valueSelected = e.value;
    var country_url = '/resource_management/timezone/?city=' + select_div.find('option:selected').val()
    $.ajax({
        url: country_url,
        method: 'GET',
        dataType: 'json',
        data: { 'country': select_div_parent.find('.country-add-resource').find('option:selected').val() },
        beforeSend: enableLoader,
        success: function(data) {
            select_div_parent.find('.working_tz-add-resource').html("");
            for (let i = 0; i < data.timezones.length; i++) {
                select_div_parent.find('.working_tz-add-resource').append($('<option>', {
                    value: data.timezone_key[i],
                    text: data.timezones[i]
                }));
            }
            disableLoader();
        },
        error: function(error) {
            console.log(error)
        },
    });
}
*/

/*  Request Resources Inner Update Button - redirect same page */
$('.request-detail-inner-update-btn').click(function(){
    $('#request_detail_form').attr('action', "?");
    $('#request_detail_form').submit();
});


/*  Request Resources Outer Update Button - redirect listing page */
$('.request-detail-outer-update-btn').click(function(){
    $('#request_detail_form').attr('action', "?update_btn=request-detail-outer-update-btn");
    $('#request_detail_form').submit();

});

// Client Request Closed Status Handling JS.
 $(document).ready(function() {
        $('#id_status').on('change', function() {
        $('#id_contract_end_reason').val("");
        $('#id_contract_ending_date').val("");
            if ($(this).val() == $('#request_status_closed').val()) {
                $('#contract-end-reason-choice-div').show();

            } else {
                $('#contract-end-reason-choice-div').hide();
                $('#contract-ending-date-div').hide();
            }
        });
    });


// Client Request Contract Ending Reason Choice Handling JS.
 $(document).ready(function() {
        $('#id_contract_end_reason').on('change', function() {
        $('#id_contract_ending_date').val("");
            if ($(this).val() == $('#request_contract_end_reason-1').val() ||
                $(this).val() == $('#request_contract_end_reason-2').val() ) {
                $('#contract-ending-date-div').show();

            } else {
                $('#contract-ending-date-div').hide();
            }
        });
    });
