var global_var = {};
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

function hideShowStatusRelatedFields(){
    resourceStatus = $('.tab-pane.active').find('.resource_status');
    resourceStatus.parent().parent().parent().find('.resource_selected').attr('hidden', resourceStatus.val() != 'selected');
    resourceStatus.parent().parent().parent().find('.resource_selected').find('select').prop('selectedIndex', 0);
    resourceStatus.parent().parent().parent().find('.resource_rejected').attr('hidden', resourceStatus.val() != 'rejected');
    resourceStatus.parent().parent().parent().find('.resource_rejected').find('select').prop('selectedIndex', 0);
    resourceStatus.parent().parent().parent().find('.resource_closed').attr('hidden', resourceStatus.val() != 'closed');
    resourceStatus.parent().parent().parent().find('.resource_closed').find('select').prop('selectedIndex', 0);
    resourceStatus.parent().parent().parent().find('.client_unresponsive_reason').attr('hidden', 'hidden');
    resourceStatus.parent().parent().parent().find('.finalized-budget').attr('hidden', resourceStatus.val() != 'selected');
    resourceStatus.parent().parent().parent().find('.payment-term').attr('hidden', resourceStatus.val() != 'selected');
    resourceStatus.parent().parent().parent().find('.payment-term').find('select').prop('selectedIndex', 0);
    resourceStatus.parent().parent().parent().find('.postpaymentdays').attr('hidden', resourceStatus.val() != 'selected' & resourceStatus.val() != 'post');
    resourceStatus.parent().parent().parent().find('.postpaymentdays').find('input').val(null);
    resourceStatus.parent().parent().parent().find('.response-interview-date-time-div').attr('hidden', resourceStatus.val() == '');
//    if(!resourceStatus.val()){
//        resourceStatus.parent().parent().parent().find('.response-interview-date-time-div').find('input').val(null);
//    }

    let selectionProgress = resourceStatus.parent().parent().parent().find('.selection-progress');
    if (resourceStatus.val() != $('#resource_status_selected').val() && selectionProgress.val() != $('#selection_progress_confirmed').val()) {
        resourceStatus.parent().parent().parent().find('.deploymentDateDiv').find('.inputDate').val("");
        resourceStatus.parent().parent().parent().find('.deploymentDateDiv').hide();
     }
}

$(document).ready(function () {
    // $('a[data-toggle="pill"]').on('show.bs.tab', function(e) {
    //     localStorage.setItem('activeTab', $(e.target).attr('href'));
    // });
    // var activeTab = localStorage.getItem('activeTab');
    // if(activeTab){
    //     $('#v-pills-tab a[href="' + activeTab + '"]').tab('show');
    // }
    $('.select2').select2({
        closeOnSelect: true
    });
    $('.select2-remove-checkbox').select2({
        closeOnSelect: true,
        theme: 'custom-option select2-container--default',
    });

    const config = {
        attributes: true,
        childList: true,
        subtree: true
    };
    // Select the node that will be observed for mutations
    const countytargetNode = document.getElementById('select2-id_country-container');
    if (countytargetNode){
         // Options for the observer (which mutations to observe)

    // Callback function to execute when mutations are observed
    const country_callback = (mutationList, countyobserver) => {
        var country_url = '/clients/cities/?country=' + $('#id_country').val()
        $.ajax({
            url: country_url,
            method: 'GET',
            dataType: 'json',
            beforeSend: enableLoader,
            success: function (data) {
                var city = data.cities
                $('#id_city').html("");
                for (let i = 0; i < data.cities.length; i++) {
                    $('#id_city').append($('<option>', {
                        value: data.cities[i][0],
                        text: data.cities[i][1]
                    }));
                }
                disableLoader();
            },
            error: function (error) {
                console.log(error)
            },
        });
    };
    // Create an observer instance linked to the callback function
    const countyobserver = new MutationObserver(country_callback);
    // Start observing the target node for configured mutations
    countyobserver.observe(countytargetNode, config);

    }

    // Select the node that will be observed for mutations
    const citytargetNode = document.getElementById('select2-id_city-container');
    if (citytargetNode){
        // Options for the observer (which mutations to observe)
    // Callback function to execute when mutations are observed
    const city_callback = (mutationList, cityobserver) => {
        var city_url = '/clients/timezone/?city=' + $('#id_city').val()
        $.ajax({
            url: city_url,
            method: 'GET',
            dataType: 'json',
            data:{'country':$('#id_country').val()},
            beforeSend: enableLoader,
            success: function (data) {
                var timezone = data.timezone
                $('#id_timezone').html("");
                $('#id_timezone').val(timezone)
                 disableLoader();
            },
            error: function (error) {
                console.log(error)
            },
        });
    };
    //});
    // Create an observer instance linked to the callback function
    const cityobserver = new MutationObserver(city_callback);
    // Start observing the target node for configured mutations
    cityobserver.observe(citytargetNode, config);
    }


    function constants_list() {
        global_var.Hostname = window.location.origin;
        global_var.edit_button_path = window.location.origin + '/static/images/edit_note_black_24dp.svg';
        global_var.save_button_path = window.location.origin + '/static/images/save_black_24dp.svg';
        global_var.class_collapse_toggle = '.collapseToggle'
        global_var.id_detail_work_history = '#detail_work_history'
        global_var.id_client_details_collapse_img = '#client_details_collapse_img'
        global_var.id_request_details_collapse_img = '#request_details_collapse_img'
        global_var.id_add_resource_collapse = '#add_resource_collapse'
        global_var.id_resource_requirement = '#resource_requirement'
        global_var.id_resource_profile_total_forms = '#id_resource_profiles_required-TOTAL_FORMS'
        global_var.class_delete_resource_btn = '.delete_resource_btn'
        global_var.class_add_resource = ".add_resource"
        global_var.class_resource_id_modal_url = '.resource_id_modal_url'
        global_var.id_delete_confirm = '#delete_confirm'
        global_var.class_resource_delete_confirm_hidden = '.resource_delete_confirm_hidden'
        global_var.class_resource_delete_confirm_show = '.resource_delete_confirm_show'
        global_var.class_menu_collapse = '.menu_collapse'
        global_var.class_custom_file_input = ".custom-file-input"
        global_var.class_image_preview = '.imagePreview'
        global_var.class_image_upload = ".imageUpload"
        global_var.id_resource_detail_collapse = '#resource_detail_collapse'
        global_var.id_request_detail_collapse = '#request_detail_collapse'
        global_var.class_form_control_group = '.form-group .form-control'
        global_var.id_resource_profile_required_section_hidden = '#id_resource_profiles_required-1000-experience'
        global_var.id_client_list = '#id_client_list'
        global_var.id_client_list_details = '#id_client_list_details'
        global_var.id_bde_list = '#id_bde_list'
        global_var.id_bde_list_create = '#id_bde_list_create'
        global_var.id_add_cv_section = '#add_cv_section'
        global_var.id_edit_cv_section = '#edit_cv_section'
        global_var.id_resource_delete_btn = '#resource_delete_btn'
        global_var.id_add_cv_table = '#id_add_cv_table'
        global_var.class_check_list = ".checklist"
        global_var.class_check_list_checked = ".checklist:checked"
        global_var.class_resource_cv_row = ".resource_cv_row"
        global_var.double_arrow_up = "/static/images/keyboard_double_arrow_up_black_24dp.svg"
        global_var.double_arrow_down = "/static/images/keyboard_double_arrow_down_black_24dp.svg"
        global_var.id_add_cv_table_last_row = '#id_add_cv_table tr:last'
        global_var.class_resource_edit_row = '.resource_edit_row'
        global_var.class_resource_hide_edit_row = '.resource_hide_edit_row'
        global_var.class_resource_name_value = '.resource_name_value'
        global_var.class_resource_rate_value = '.resource_rate_value'
        global_var.class_resource_type_value = '.resource_type_value'
        global_var.class_resource_resume_file_value = '.resource_resume_file_value'
        global_var.class_resource_id_value = '.resource_id_value'
        global_var.class_interview_details_collapse = '.interview_details_collapse'
        global_var.id_interview_details_collapse = '#interview_details_collapse'
        global_var.class_interview_details_collapse = '.interview_details_collapse'
        global_var.id_interview_details_collapse_img = '#interview_details_collapse_img'
        global_var.class_interview_details_collapse_img = '.interview_details_collapse_img'
        global_var.interview_details = new Map([
            ['#id_interview_date', 'interview_date'],
            ['#id_interview_date_time', 'interview_date_time'],
            ['#id_interview_time', 'interview_time'],
            ['#id_interview_round', 'interview_round'],
            ['#id_interview_round_number', 'interview_round_number'],
            ['#id_interview_round_status', 'interview_round_status'],
            ['#id_interview_meeting_link', 'interview_meeting_link'],
            ['#id_interview_round_status_char', 'interview_round_status_char'],
//            ['#id_interview_remarks', 'interview_remarks'],
//            ['#id_interview_reason', 'interview_reason'],
//            ['#id_interview_feedback', 'interview_feedback'],
        ]);
    }
    constants_list()

    // Sidebar toggle
    $(global_var.class_collapse_toggle).on('click', function () {
        $(".sidebar").toggleClass('sidebar--Collapse');
        $('.main-content').toggleClass('main-slide');
        $('.copyright-section').toggleClass('copyright-toggled');
        $('.toggleIcon').toggleClass('rotate');
    });
    if ($(global_var.id_resource_detail_collapse).attr('class') == 'collapse show add_resource') {
        var url_arrow_up = global_var.Hostname + global_var.double_arrow_up
        $(global_var.id_client_details_collapse_img).attr('src', url_arrow_up);
    }
    $(global_var.id_resource_detail_collapse).on('hide.bs.collapse', function () {
        var url_arrow_down = global_var.Hostname + global_var.double_arrow_down
        $(global_var.id_client_details_collapse_img).attr('src', url_arrow_down);
    })
    $(global_var.id_resource_detail_collapse).on('show.bs.collapse', function () {
        var url_arrow_up = global_var.Hostname + global_var.double_arrow_up
        $(global_var.id_client_details_collapse_img).attr('src', url_arrow_up);
    })
    $(global_var.id_request_detail_collapse).on('hide.bs.collapse', function () {
        var url_arrow_down = global_var.Hostname + global_var.double_arrow_down
        $(global_var.id_request_details_collapse_img).attr('src', url_arrow_down);
    })
    $(global_var.id_request_detail_collapse).on('show.bs.collapse', function () {
        var url_arrow_up = global_var.Hostname + global_var.double_arrow_up
        $(global_var.id_request_details_collapse_img).attr('src', url_arrow_up);
    })
    $(global_var.class_interview_details_collapse).on('hide.bs.collapse', function () {
        var url_arrow_down = global_var.Hostname + global_var.double_arrow_down
        $(this).parent().find(global_var.class_interview_details_collapse_img).attr('src', url_arrow_down);
    })
    $(global_var.class_interview_details_collapse).on('show.bs.collapse', function () {
        var url_arrow_up = global_var.Hostname + global_var.double_arrow_up
        $(this).parent().find(global_var.class_interview_details_collapse_img).attr('src', url_arrow_up);
    })
    $('#client_details_collapse').on('hide.bs.collapse', function () {
        var url_arrow_down = global_var.Hostname + global_var.double_arrow_down
        $(this).parent().find('#client_details_collapse_img').attr('src', url_arrow_down);
    })
    $('#client_details_collapse').on('show.bs.collapse', function () {
        var url_arrow_up = global_var.Hostname + global_var.double_arrow_up
        $(this).parent().find('#client_details_collapse_img').attr('src', url_arrow_up);
    })
    $('#client_work_history_collapse').on('hide.bs.collapse', function () {
        var url_arrow_down = global_var.Hostname + global_var.double_arrow_down
        $(this).parent().find('#work_details_collapse_img').attr('src', url_arrow_down);
    })
    $('#client_work_history_collapse').on('show.bs.collapse', function () {
        var url_arrow_up = global_var.Hostname + global_var.double_arrow_up
        $(this).parent().find('#work_details_collapse_img').attr('src', url_arrow_up);
    })
    $(".resource_status").on('change', hideShowStatusRelatedFields);
    /*$(".rejected_reason").on('change', function () {
        $(this).parent().parent().parent().find('.client_unresponsive_reason').attr('hidden', this.value != 'client_unresponsive');
        $(this).parent().parent().parent().find('.client_unresponsive_reason').find('select').prop('selectedIndex', 0);
    });*/
    $(".closed_reason").on('change', function () {
        $(this).parent().parent().parent().find('.client_unresponsive_reason').attr('hidden', this.value != 'client_unresponsive');
        $(this).parent().parent().parent().find('.client_unresponsive_reason').find('select').prop('selectedIndex', 0);
    });
    $(".postpayment").on('change', function () {
        $(this).parent().parent().parent().find('.postpaymentdays').attr('hidden', this.value != 'post');

    });
    //    //toggleclass on inout focus and blur
    //    $(global_var.class_form_control_group).bind('blur', function () {
    //        $(this).parent().toggleClass('form-click');
    //    });
    //
    //    $(global_var.class_form_control_group).bind('focus', function () {
    //        $(this).parent().toggleClass('form-click');
    //    });

    //custom file
    $(global_var.class_custom_file_input).on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });
    const current_resources = $('.add_resource').children('div').length;
    $(global_var.id_resource_profile_total_forms).attr('value', current_resources);
    const current_resources_editable = $(global_var.id_resource_detail_collapse).children('div').length;
    if (current_resources_editable > 0) {
        $(global_var.id_resource_profile_total_forms).attr('value', current_resources_editable);
    }

    function focus_div_func() {
        $(global_var.id_resource_requirement).scrollIntoView();
        var element = $(global_var.id_resource_requirement)
        element.scrollIntoView();
    }
    $(function () {
        function get_client(event, ui) {
            $('.ui-menu').children().each(function () {
                if ($(this).text() == $('#id_client_list').val()) {

                    data = {
                        'client_name': $(this).text().split('(')[0]
                    }
                    $("#id_client_list").val(data['client_name'])
                    $.ajax({
                        url: '/clients/details/',
                        method: 'GET',
                        cache: false,
                        dataType: 'html',
                        data: data,
                        dataType: 'json',
                        success: function (data) {
                            if (data) {
                                if (event, ui) {
                                    $("#id_client_list").val(ui.item.value.split('(')[0])
                                }
                            }
                            $('#view_client_btn').removeAttr('hidden');
                            var clients_url = '/clients/' + data['id'] + '/update'
                            $('#view_client_btn').find('a').attr('href', clients_url);
                        },
                        error: function (error) {
                            console.log(error)
                        },
                    });
                }
            });
        }
        $(global_var.id_client_list).autocomplete({
            source: "autocomplete",
            select: get_client,
        });
        $('.ui-menu').on('click', function () {
            get_client();
        });
    });
    $(function () {
        $(global_var.id_client_list_details).autocomplete({
            source: "autocomplete_client"
        });
    });
    $(function () {
        function get_bde(event, ui) {
            $('.ui-menu').children().each(function () {
                if ($(this).text() == $('#id_bde_list').val()) {
                    data_dict = {
                        'bde': $(this).text().split('(')[0],
                        'bde_email' : $(this).text().split('(')[1]
                    }
                    if (document.getElementById("id_bde_list").value.length >= 3) {
                        $("#id_bde_list").val(data_dict['bde'])
                        $.ajax({
                            url: 'bdm',
                            method: 'GET',
                            cache: false,
                            data: data_dict,
                            dataType: 'json',
                            success: function (data) {
                                if (data) {
                                    if (event, ui) {
                                        $("#id_bde_list").val(ui.item.value.split('(')[0])
                                    }
                                    $("#id_bdm_val").val(data['bdm'])
                                    $("#id_bde_hidden").val(data_dict['bde_email'])
                                }
                            },
                            error: function (error) {
                                console.log(error)
                            },
                        });
                    }
                }
            });
        }
        $(global_var.id_bde_list).autocomplete({
            source: "autocomplete_bde",
            select: get_bde,
        });
        $('.ui-menu').on('click', function () {
            get_bde();
        });
    });
   $(function () {
        function get_bde_create(event, ui){
            $('.ui-menu').children().each(function () {
                    if ( $(this).text() == $('#id_bde_list_create').val()) {
                    data_dict = {
                        'bde': $(this).text().split('(')[0],
                        'bde_email' : $(this).text().split('(')[1]
                    }
                    if (document.getElementById("id_bde_list_create").value.length >= 3){
                        $("#id_bde_list_create").val(data_dict['bde'])
                        $.ajax({
                            url: '/clients/create/bdm_create_url',
                            method: 'GET',
                            cache: false,
                            data: data_dict,
                            dataType: 'json',
                            success: function (data) {
                                if (data) {
                                    if(event, ui){
                                        $("#id_bde_list_create").val(ui.item.value.split('(')[0])
                                        }
                                    $("#id_bdm_val").val(data['bdm_create'])
                                    $("#id_bde_hidden").val(data_dict['bde_email'])
                                }
                            },
                            error: function (error) {
                                console.log(error)
                            },
                        });
                    }
                }
            });
        }
        $(global_var.id_bde_list_create).autocomplete({
            source: "autocomplete_search_create_bde",
            select: get_bde_create,
        });
        $('.ui-menu').on('click', function () {
            get_bde_create();
        });
    });
    // WHEN BDE FIELD CHANGE THE VALUE SHOULD BE BLANK- CREATE^M
    $(global_var.id_bde_list_create).on("input propertychange",function() {
      $("#id_bde_hidden").val("")
    });
    // WHEN BDE FIELD CHANGE THE VALUE SHOULD BE BLANK- UPDATE^M
    $(global_var.id_bde_list).on("input propertychange",function() {
      $("#id_bde_hidden").val("")
    });

    $(global_var.id_add_cv_table).on("click", global_var.class_resource_cv_row, function () {
        $(this).closest("tr").remove();
        document.getElementById("id_resumes-TOTAL_FORMS").value = parseInt(document.getElementById("id_resumes-TOTAL_FORMS").value) - 1;
    });
    $(global_var.class_check_list).click(function () {
        if ($(global_var.class_check_list_checked).length) {
            if ($(global_var.id_resource_delete_btn).attr("hidden")) {
                $(global_var.id_resource_delete_btn).attr("hidden", false)
            }
        } else $(global_var.id_resource_delete_btn).attr("hidden", true)

    });
    $(global_var.class_resource_edit_row).click(function () {
        var before_var = $(this).parent().parent().parent();
        before_var.addClass('d-none');
        before_var.next().removeClass('d-none');
    });
    $(global_var.class_resource_hide_edit_row).click(function () {
        var before_var = $(this).parent().parent().parent();
        before_var.addClass('d-none');
        before_var.prev().removeClass('d-none');
    });
    $('#interview_schedule').on('show.bs.modal', function (event) {
        $(this).find('.parsley-errors-list').remove()
        var button = $(event.relatedTarget) // Button that triggered the modal
        var recipient = button.data('interview') // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this)
        modal.find('.modal-title').text(recipient)
        modal.find('#modal_date').text(button.data('interview_date'))
        modal.find('#modal_time').text(button.data('interview_time'))
        modal.find('#id_round').val(button.data('interview_round'))
        modal.find('#id_resource').val(button.data('resource_id'))
        modal.find('#id_remarks').html(button.data('interview_remarks'))
        modal.find('#id_feedback').text(button.data('interview_feedback'))
        modal.find('#id_reason').text(button.data('interview_reason'))
        modal.find('#id_meeting_link').text(button.data('interview_meeting_link'))
        $('#schedule_interview_form').attr('action', button.data('resource_url'))
    });
    $('#interview_detail_modal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        var modal = $(this)
        var interview_date_time = modal.find('#id_interview_date_time')
        var interview_meeting_link = modal.find('#id_interview_meeting_link')
        var interview_round_status = modal.find('#id_interview_round_status')
        var interview_round_status_char = modal.find('#id_interview_round_status_char')
        var recipient = button.data('interview')
        var interviewSaveBtn = $('#interview-save-btn');
        modal.find('.modal-title').text(recipient)
        global_var.interview_details.forEach(function (value, key) {
            modal.find(key).val(button.data(value))
        })
        $('#interview_update_form').attr('action', button.data('interview_url'))
        interview_round_status.parent().addClass('d-none');
        interview_round_status_char.parent().removeClass('d-none');
        interview_round_status.parent().addClass('interview_date_time');
        // if interview round status is Reschedule needed then and then only user can able to edit the datetime.
        if (modal.find('#id_interview_round_status').val() == 'rescheduled_needed')
        {
            interview_date_time.prop('readonly', 0);
            interview_date_time.parent().removeClass('interview_date_time');
            interview_date_time.parent().parent().parent().removeClass('interview_date_time');

            interview_meeting_link.prop('readonly', 0);
            interview_meeting_link.parent().removeClass('interview_date_time');

            interviewSaveBtn.removeClass('d-none');
        }
        else{
            interview_date_time.prop('readonly', 1);
            interview_date_time.parent().addClass('interview_date_time');
            interview_date_time.parent().parent().parent().addClass('interview_date_time');

            interview_meeting_link.prop('readonly', 1);
            interview_meeting_link.parent().addClass('interview_date_time');

            interviewSaveBtn.addClass('d-none');
        }
    });
    $(function () {
        $('#datetimepicker1').datetimepicker({
            maxDate: new Date(),
            maxTime: (new Date()).getTime(),
            widgetPositioning: {
                horizontal: 'auto',
                vertical: 'bottom'
            }
        });
        $('#datetimepicker2').datetimepicker({
            maxDate: new Date(),
            maxTime: new Date().getTime(),
            widgetPositioning: {
                horizontal: 'auto',
                vertical: 'bottom'
            }
        });
        $('#datetimepicker3').datetimepicker({
        });

        $('.response-datetimepicker').each(function(i, obj){
            $(this).datetimepicker({
                format: 'DD-MM-YYYY hh:mm A',
                widgetPositioning: {
                    horizontal: 'auto',
                    vertical: 'bottom'
                },
            });
        });
        $('.meeting-datetimepicker').each(function(i, obj){
            $(this).datetimepicker({
                format: 'DD-MM-YYYY hh:mm A',
                widgetPositioning: {
                    horizontal: 'auto',
                    vertical: 'bottom'
                },
            });
        });

    });
    $('.resource_form_save_btn').click(function () {
        $(this).parents('form').submit()
    });
    $("input").keyup(function () {
        $(this).parent().find('.parsley-backendError').html('')
        $(this).parent().parent().find('.error_class').html('')
    });
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    $('.btn').click(function () {
        async function sett() {
            await sleep(2);
            $('.parsley-required').parent().find('.parsley-backendError').html('')
        }
        sett()
        $('.parsley-errors-list').attr('hidden', false)
        $('.error_class').attr('hidden', false)
    });
    $('.input-group-append').click(function () {
        $(this).parent().find('.parsley-backendError').html('')
    });
    $("select").change(function () {
        $(this).parent().find('.parsley-errors-list').html('')
        $(this).parent().parent().find('.error_class').html('')
    });
    $('.interview_dp').each(function (i, obj) {
        $(this).datetimepicker({
//            minDate: new Date(),
//            minTime: (new Date).getTime(),
            format: 'DD-MM-YYYY hh:mm A',
            widgetPositioning: {
                horizontal: 'auto',
                vertical: 'bottom'
            }
        });
    });

    CKEDITOR.replace('editor', {
        skin: 'moono',
        enterMode: CKEDITOR.ENTER_BR,
        shiftEnterMode: CKEDITOR.ENTER_P,
        toolbar: [{
                name: 'basicstyles',
                groups: ['basicstyles'],
                items: ['Bold', 'Italic', 'Underline', "-", 'TextColor', 'BGColor']
            },
            {
                name: 'styles',
                items: ['Format', 'Font', 'FontSize']
            },
            {
                name: 'scripts',
                items: ['Subscript', 'Superscript']
            },
            {
                name: 'paragraph',
                groups: ['list', 'indent'],
                items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent']
            },
            {
                name: 'links',
                items: ['Link', 'Unlink']
            },
            {
                name: 'insert',
                items: ['Image']
            },
            {
                name: 'spell',
                items: ['jQuerySpellChecker']
            },
            {
                name: 'table',
                items: ['Table']
            }
        ],
    });
    CKEDITOR.replace('editor1', {
        skin: 'moono',
        enterMode: CKEDITOR.ENTER_BR,
        shiftEnterMode: CKEDITOR.ENTER_P,
        toolbar: [{
                name: 'basicstyles',
                groups: ['basicstyles'],
                items: ['Bold', 'Italic', 'Underline', "-", 'TextColor', 'BGColor']
            },
            {
                name: 'styles',
                items: ['Format', 'Font', 'FontSize']
            },
            {
                name: 'scripts',
                items: ['Subscript', 'Superscript']
            },
            {
                name: 'paragraph',
                groups: ['list', 'indent'],
                items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent']
            },
            {
                name: 'links',
                items: ['Link', 'Unlink']
            },
            {
                name: 'insert',
                items: ['Image']
            },
            {
                name: 'spell',
                items: ['jQuerySpellChecker']
            },
            {
                name: 'table',
                items: ['Table']
            }
        ],
    });
    CKEDITOR.replace('editor2', {
        skin: 'moono',
        enterMode: CKEDITOR.ENTER_BR,
        shiftEnterMode: CKEDITOR.ENTER_P,
        toolbar: [{
                name: 'basicstyles',
                groups: ['basicstyles'],
                items: ['Bold', 'Italic', 'Underline', "-", 'TextColor', 'BGColor']
            },
            {
                name: 'styles',
                items: ['Format', 'Font', 'FontSize']
            },
            {
                name: 'scripts',
                items: ['Subscript', 'Superscript']
            },
            {
                name: 'paragraph',
                groups: ['list', 'indent'],
                items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent']
            },
            {
                name: 'links',
                items: ['Link', 'Unlink']
            },
            {
                name: 'insert',
                items: ['Image']
            },
            {
                name: 'spell',
                items: ['jQuerySpellChecker']
            },
            {
                name: 'table',
                items: ['Table']
            }
        ],
    });

    function openNav2() {
        $("#mySidenav2").addClass("width-menu");
        $("#cd-shadow-layer").css("display", "flex");
        $(".closebtn2").css("position", "fixed");
        // clone menu
    }

    function closeNav2() {
        $("#mySidenav2").removeClass("width-menu");
        $("#cd-shadow-layer").css("display", "none");
        $(".closebtn2").css("position", "relative");
    }


    //Set height of sidebar
    // contentHeight = $(".main-content").height();
    // console.log(contentHeight);
    // $(".sidebar").height(contentHeight);

    //toggleclass on inout focus and blur
    $('.form-group .form-control').bind('blur', function () {
        $(this).parent().toggleClass('form-click');
    });

    $('.form-group .form-control').bind('focus', function () {
        $(this).parent().toggleClass('form-click');
    });
    //datepicker
    $('.inputDate').datepicker({
        dateFormat: 'dd-mm-yy',
    });
    $('.datepicker').datepicker({
        format: 'dd-mm-yy',
    });

    //custom file
    $(".custom-file-input").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });

    //multiselect
    // $('.custom-dropdown').dropdown();
    $(".custom-dropdown").chosen();

    $('.country-add-resource').on('change', function (e) {
    var optionSelected = $("option:selected", this);
    select_div = $(this)
    select_div_parent = select_div.parent().parent().parent()
    var valueSelected = this.value;
    var country_url = '/resource_management/cities/?country=' + select_div.find('option:selected').val()
        $.ajax({
            url: country_url,
            method: 'GET',
            dataType: 'json',
            beforeSend: enableLoader,
            success: function (data) {
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
            error: function (error) {
                console.log(error)
            },
        });
});

    $('.city-add-resource').on('change', function (e) {
    var optionSelected = $("option:selected", this);
    select_div = $(this)
    select_div_parent = select_div.parent().parent().parent()

    var valueSelected = this.value;
    var country_url = '/resource_management/timezone/?city=' + select_div.find('option:selected').val()
        $.ajax({
            url: country_url,
            method: 'GET',
            dataType: 'json',
            beforeSend: enableLoader,
            data:{'country':select_div_parent.find('.country-add-resource').find('option:selected').val()},
            success: function (data) {
                select_div_parent.find('.working_tz-add-resource').html("");
                for (let i = 0; i < data.timezones.length; i++) {
                    select_div_parent.find('.working_tz-add-resource').append($('<option>', {
                        value: data.timezone_key[i],
                        text: data.timezones[i]
                    }));
                }
                disableLoader();
            },
            error: function (error) {
                console.log(error)
            },
        });
});
});


//User image upload
function readimageURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $(global_var.class_image_preview).css('background-image', 'url(' + e.target.result + ')');
            $(global_var.class_image_preview).hide();
            $(global_var.class_image_preview).fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$(global_var.class_image_upload).change(function () {
    readimageURL(this);
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
$('.form_sbmt_btn').click(function () {
    async function sett() {
        await sleep(2);
        $('.form_sbmt_btn').attr('disabled', 'disabled');
    }
    sett()
});

$(document).ready(function(){
    $("#id_to_date").datepicker("option", "minDate", $("#id_from_date").datepicker('getDate'));
});
$("#id_from_date").change(function(){
    $("#id_to_date").datepicker("option", "minDate", $(this).datepicker('getDate'));
});
$(document).ready(function() {
$('.custom-select2').select2({
        closeOnSelect : false,
        placeholder : "Select",
        allowHtml: true,
        tags: false
});

});





// Fixed Cost and Dedicated Graph Manipulation

function total_graph_manipulation(graph_selector) {
     var $FixedCostTotalAnalysisChart = $(graph_selector);
        dataFixedTotal = {
            'from_date': $('#id_from_date_first').val(),
            'to_date': $('#id_to_date_first').val(),
        }
        if(window.ChartFixedCostTotalAnalysis != undefined ){
            window.ChartFixedCostTotalAnalysis.destroy();
        }
        $.ajax({
            url: $FixedCostTotalAnalysisChart.data("url"),
            data: dataFixedTotal,
            success: function (data) {
                var ctx_fixed_cost_total_analysis = $FixedCostTotalAnalysisChart[0].getContext("2d");
                window.ChartFixedCostTotalAnalysis = new Chart(ctx_fixed_cost_total_analysis, {
                    type: 'bar',
                        data: {
                        labels: data.interview_label,
                        datasets: [{
                            barPercentage: 0.9,//thickness
                            categoryPercentage: 0.2,//space between two bars

                            label: 'Clients',
                            backgroundColor: '#6754C1',
                            data: data.interview_total_status_final[0],
                            borderRadius: 20,
                        },
                        {
                            barPercentage: 0.9,//thickness
                            categoryPercentage: 0.2,//space between two bars

                            label: 'Dedicated Request',
                            backgroundColor: '#1C9DB9',
                            data: data.interview_total_status_final[1],
                            borderRadius: 20,
                        },
                        {
                            barPercentage: 0.9,//thickness
                            categoryPercentage: 0.2,//space between two bars

                            label: 'Fixed Cost Request',
                            backgroundColor: '#49B854',
                            data: data.interview_total_status_final[2],
                            borderRadius: 20,
                        }]
                    },
                    options: {
                    maintainAspectRatio: false,
                        responsive: true,
                        legend: {
                            position: 'top',
                            align: 'start',
                        },
                        title: {
                            display: false,
                            text: 'Monthly Interviews scheduled'
                        },
                         interaction: {
                          intersect: false,
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function(value) {if (value % 1 === 0) {return value;}}
                                },
//                                stacked: true
                            }],
                            xAxes: [{
//                                stacked: true
                              }],
                        },
                        onClick: handleClickAllChart
                    }
                });
                function handleClickAllChart(evt)
                {
                    var activeElement = ChartFixedCostTotalAnalysis.getElementAtEvent(evt);
                    if (activeElement[0]._datasetIndex==0){
                        url = '/clients/list/?'
                    } else if (activeElement[0]._datasetIndex==1){
                        url = '/resource_management/request/list/?'
                    } else{
                        url = '/fixed_cost/list/?'
                    }
                       if (!(dataFixedTotal.from_date || dataFixedTotal.to_date) && (data.start_end_date_time_list.length==activeElement[0]._index+1)){
                            url += '&from_date=' + data.start_end_date_time_list[activeElement[0]._index][0] + '&to_date=' + data.to_date
                        } else if(!(dataFixedTotal.from_date || dataFixedTotal.to_date)){
                            url += '&from_date=' + data.start_end_date_time_list[activeElement[0]._index][0] + '&to_date=' + data.start_end_date_time_list[activeElement[0]._index][1]
                        } else{
                            url += '&from_date=' + dataFixedTotal.from_date + '&to_date=' + dataFixedTotal.to_date
                        }
                    if (data.bde_url){
                        url += '&' + data.bde_url
                    }
                    window.location.href = url
                }

            }
        });

};