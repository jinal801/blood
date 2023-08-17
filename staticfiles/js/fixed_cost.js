// Client Request For Fixed Cost JS Code beginning ------>>>>


// Generic function to add or remove a form element at FixedCost Request

var globalDateTimePickerCounter = 0 ; // initialize with zero to keep track of counter

function addMeetingFormSet(response, selector, elementName, action, childLength, dynamicDiv, elementDiv) {
    dynamicDiv.find('#add_meeting_div_id_999').attr('id', `add_${elementName}_div_id_${childLength}`);
            // Static datetimepicker id attr changes according to counter value with +100.
            dynamicDiv.find('.meeting-datetimepicker').attr('id', `meeting-datetimepicker-${globalDateTimePickerCounter + 100}`)
            dynamicDiv.find('.meeting-datetimepicker').datetimepicker({
                format: 'DD-MM-YYYY hh:mm A',
                widgetPositioning: {
                    horizontal: 'auto',
                    vertical: 'bottom'
                },
            });
            dynamicDiv.find('[for="id_fcrs_meetings-999-date_time"]').attr('for', `id_fcrs_meetings-${childLength}-date_time`)
            dynamicDiv.find('[for="id_fcrs_meetings-999-details"]').attr('for', `id_fcrs_meetings-${childLength}-details`)
            // Static datetimepicker toggle attr changes according to counter value with +100.
            dynamicDiv.find('[data-toggle="datetimepicker"]').attr('data-target', `#meeting-datetimepicker-${globalDateTimePickerCounter + 100}`);
            dynamicDiv.find('input[name*=date_time]').attr({'name': `fcrs_meetings-${childLength}-date_time`, 'id': `id_fcrs_meetings-${childLength}-date_time`});
            dynamicDiv.find('input[name*=details]').attr({'name': `fcrs_meetings-${childLength}-details`, 'id': `id_fcrs_meetings-${childLength}-details`});
            dynamicDiv.find('#id_fcrs_meetings-999-details').attr({'name': `fcrs_meetings-${childLength}-details`, 'id': `id_fcrs_meetings-${childLength}-details`});

            $(selector).append(dynamicDiv);
             CKEDITOR.replace(`id_fcrs_meetings-${childLength}-details`, {
              toolbar: 'Basic',
              height: '30%',
              width: '100%',
              extraPlugins: 'codesnippet',
              removePlugins: ['stylesheetparser', 'exportpdf'],

            });

            // Update FormSet Forms input Value after adding Form.
             $('[name="fcrs_meetings-TOTAL_FORMS"]').val($(selector).children('div').length);
}

function removeMeetingFormSet(response, selector, elementName, action, childLength, dynamicDiv, elementDiv) {
     var oldCkinstance = elementDiv.find('.add-meeting-errors').attr('id').match(/\d+$/)[0]
        CKEDITOR.instances[`id_fcrs_meetings-${oldCkinstance}-details`].destroy();

        $('[name="fcrs_meetings-TOTAL_FORMS"]').val($(selector).children('div').length);

        $(selector).find(`.add-${elementName}-errors`).each(function(index) {
            $(this).find('label').first().attr('for', `id_fcrs_meetings-${index}-date_time`)
            $(this).find('label').last().attr('for', `id_fcrs_meetings-${index}-details`)
            $(this).find('input[name*=date_time]').attr({'name': `fcrs_meetings-${index}-date_time`, 'id': `id_fcrs_meetings-${index}-date_time`});
            let currentTriggerCkeditor = $(this).find('textarea').attr('id');
            var initialInstanceValue = CKEDITOR.instances[currentTriggerCkeditor].getData()
            CKEDITOR.instances[currentTriggerCkeditor].destroy();
            $(this).find('textarea').attr({'name': `fcrs_meetings-${index}-details`, 'id': `id_fcrs_meetings-${index}-details`});

            if ($(this).find('.django-ckeditor-widget').length) {
                $(this).find('.django-ckeditor-widget').remove();
                let newTextArea = dynamicDiv.clone().find('#id_fcrs_meetings-999-details');
                $(this).find('label').last().after(newTextArea)
                $(this).find('textarea').attr({'name': `fcrs_meetings-${index}-details`, 'id': `id_fcrs_meetings-${index}-details`});
                CKEDITOR.replace(`id_fcrs_meetings-${index}-details`, {
                  toolbar: 'Basic',
                  height: '30%',
                  width: '100%',
                  extraPlugins: 'codesnippet',
                  removePlugins: ['stylesheetparser', 'exportpdf'],

                });
                CKEDITOR.instances[`id_fcrs_meetings-${index}-details`].setData(initialInstanceValue);
            }
            else {
                $(this).find('textarea').attr({'name': `fcrs_meetings-${index}-details`, 'id': `id_fcrs_meetings-${index}-details`});
                CKEDITOR.replace(`id_fcrs_meetings-${index}-details`, {
                  toolbar: 'Basic',
                  height: '30%',
                  width: '100%',
                  extraPlugins: 'codesnippet',
                  removePlugins: ['stylesheetparser', 'exportpdf'],

                });
            }
            var oldId = $(this).attr('id');
            var newId = oldId.replace(/\d+$/, index); // Changing last digit in ID for formsets
            $(this).attr('id', newId);
        });
}

function addMilestoneFormSet(response, selector, elementName, action, childLength, dynamicDiv, elementDiv) {
        // Event listener for input fields
            elementDiv.parent().find('input').on('input', function() {
                let input = $(this);
                if (input.val().trim() !== '') {
                    input.next('.error_class').remove(); // Remove the error message
                }
            });
        // Check if any input field is blank
            let hasBlankInput = false;
            elementDiv.parent().children('div:not([hidden])').find('input').not("input[type='hidden']").each(function() {
                let input = $(this);
                if (input.val().trim() === '') {
                    hasBlankInput = true;
                    input.after('<div class="text-danger error_class"><small>* This field is required.</small></div>'); // Insert the error message
                }
            });
            if (hasBlankInput) {
            return; // Exit the function without adding the new form element
            }
            dynamicDiv.find('#add_milestone_div_id_999').attr('id', `add_${elementName}_div_id_${childLength}`);
            dynamicDiv.find('[for="id_fcrs_milestones-999-title"]').attr('for', `id_fcrs_milestones-${childLength}-title`)
            dynamicDiv.find('[for="id_fcrs_milestones-999-amount"]').attr('for', `id_fcrs_milestones-${childLength}-amount`)
            dynamicDiv.find('input[name*=title]').attr({'name': `fcrs_milestones-${childLength}-title`, 'id': `id_fcrs_milestones-${childLength}-title`});
            dynamicDiv.find('input[name*=amount]').attr({'name': `fcrs_milestones-${childLength}-amount`, 'id': `id_fcrs_milestones-${childLength}-amount`});
            $(selector).append(dynamicDiv);

            // Update FormSet Forms input Value after adding Form.
            $('[name="fcrs_milestones-TOTAL_FORMS"]').val($(selector).children('div').length);
}

function removeMilestoneFormSet(response, selector, elementName, action, childLength, dynamicDiv, elementDiv) {
         $('[name="fcrs_milestones-TOTAL_FORMS"]').val($(selector).children('div').length);
            $(selector).find(`.add-${elementName}-errors`).each(function(index) {
            $(this).find('label[for$="amount"]').attr('for', `id_fcrs_milestones-${index}-amount`)
            $(this).find('label[for$="title"]').attr('for', `id_fcrs_milestones-${index}-title`)
            $(this).find('input[name*=title]').attr({'name': `fcrs_milestones-${index}-title`, 'id': `id_fcrs_milestones-${index}-title`});
            $(this).find('input[name*=amount]').attr({'name': `fcrs_milestones-${index}-amount`, 'id': `id_fcrs_milestones-${index}-amount`});
            var oldId = $(this).attr('id');
            var newId = oldId.replace(/\d+$/, index); // Changing last digit in ID for formsets
            $(this).attr('id', newId);
        });
}

function createFormElement(response, selector, elementName, action) {
    globalDateTimePickerCounter++ ; // each time +1 on function call
    let childLength = $(selector).children('div').length;
    let dynamicDiv = $(`#${elementName}-dynamic-div`).clone().removeAttr('id hidden');
    let elementDiv = $(response).parent().parent().parent().parent();
    // Remove existing error divs
    elementDiv.parent().find('.error_class').remove();

    if (action === 'add') {

        if (selector == '.add_meetings') {
            addMeetingFormSet(response, selector, elementName, action, childLength, dynamicDiv, elementDiv)
        }
        else {
            addMilestoneFormSet(response, selector, elementName, action, childLength, dynamicDiv, elementDiv)
        }

        if ($(selector).children('div').length === 2) {
            $(selector).find(`.${elementName}-negative-btn-div`).removeAttr('hidden');
        }

    } else if (action === 'remove') {
        elementDiv.remove();

        if ($(selector).children('div').length === 1) {
            $(selector).find(`.${elementName}-negative-btn-div`).attr('hidden', true);
        }

        if (selector == '.add_meetings') {
            removeMeetingFormSet(response, selector, elementName, action, childLength, dynamicDiv, elementDiv);
        }
        else {
            removeMilestoneFormSet(response, selector, elementName, action, childLength, dynamicDiv, elementDiv);
        }

    }
}


function updateFormElement(response, selector, elementName, action) {
    globalDateTimePickerCounter++ ; // each time +1 on function call
    let childLength = $(selector).children('div').length;
    let dynamicDiv = $(`#${elementName}-dynamic-div`).clone().removeAttr('id hidden');
    let elementDiv = $(response).parent().parent().parent().parent();
    // Remove existing error divs
    elementDiv.parent().find('.error_class').remove();

    if (action === 'add') {

        if (selector == '.add_meetings') {
            dynamicDiv.find('.meeting-remove').attr('onclick', "updateFormElement(this, '.add_meetings', 'meeting', 'remove')");
            dynamicDiv.find('.meeting-add').attr('onclick', "updateFormElement(this, '.add_meetings', 'meeting', 'add')");
            addMeetingFormSet(response, selector, elementName, action, childLength, dynamicDiv, elementDiv)
        }
        else {
            dynamicDiv.find('.milestone-remove').attr('onclick', "updateFormElement(this, '.add_milestones', 'milestone', 'remove')");
            dynamicDiv.find('.milestone-add').attr('onclick', "updateFormElement(this, '.add_milestones', 'milestone', 'add')");
            addMilestoneFormSet(response, selector, elementName, action, childLength, dynamicDiv, elementDiv)
        }

        if ($(selector).children('div:not([hidden])').length === 2) {
            $(selector).find(`.${elementName}-negative-btn-div`).removeAttr('hidden');
        }

    } else if (action === 'remove') {
        elementDiv.attr('hidden', true);
        $(response).prev().prop("checked", true);  // Checking The Checkbox will delete the records.

        if ($(selector).children('div:not([hidden])').length === 1) {
            $(selector).find(`.${elementName}-negative-btn-div`).attr('hidden', true);
        }

    }
}


//Fixed Cost Request Status Handling JS
$(document).ready(function() {
  $('#id_request_status_checkbox').change(function() {
    if ($(this).is(':checked')) {
      $('#id_status').val(1); // Set id_status value to 1 if checkbox is checked
      $('#id_status_readonly').val('Active')


    } else {
      $('#id_status').val(0); // Set id_status value to 0 if checkbox is unchecked
      $('#id_status_readonly').val('Inactive')
    }
  });
});

$(document).ready(function() {
  $('#id_current_status').change(function() {
    var selectedValue = $(this).val();

    // Reset the visibility of elements
    $('#id_reason').parent().parent().hide(); // Hide id_reason div
    $('#id_reason').val(''); // Clear reason Input
    $('#id_sub_reason_dropped_by_trootech').parent().parent().hide(); // Hide id_reason div
    $('#id_sub_reason_dropped_by_trootech').val(''); // Clear reason Input
    $('#id_project_lost_reason').parent().parent().hide(); //Hide id_project_lost_reason div
    $('#id_project_lost_reason').val(''); // clear project lost reason Input
    $('.milestone-label-div, .add_milestone_content, .project-label-div').hide();
    $('.add_milestone_content').find("input[type='text']").val('');
    $('#id_final_budget, #id_timeline, #id_expected_timeline, #id_expected_client_budget, #id_project_start_date, #id_project_end_date, #id_tech_stack, #id_project_manager').parent().parent().hide();
    $('#id_final_budget, #id_timeline, #id_expected_timeline, #id_expected_client_budget, #id_project_start_date, #id_project_end_date, #id_project_manager').val('');
    $('#id_tech_stack').val(null).trigger("change") // select2 library has this special method to clear select tag, normal val('') will not work.

    if (selectedValue == 'closed_lost') {
        $('#id_project_lost_reason').parent().parent().show(); // Show id_reason div
    }
    else if (selectedValue == 'closed_won') {
        $('.milestone-label-div, .add_milestone_content, .project-label-div').show();
        $('#id_final_budget, #id_timeline, #id_project_start_date, #id_project_end_date, #id_tech_stack, #id_project_manager').parent().parent().show();
    }
    else if (selectedValue == 'estimation' || selectedValue == 'proposal') {
        $('#id_expected_timeline, #id_expected_client_budget').parent().parent().show()

    }

  });
  $('#id_project_lost_reason').change(function() {
        var selectedValueReason = $(this).val();

        $('#id_sub_reason_dropped_by_trootech').parent().parent().hide(); // Hide id_reason div
        $('#id_sub_reason_dropped_by_trootech').val(''); // Clear reason Input
        $('#id_reason').parent().parent().hide(); // Hide id_reason div
//        $('#id_reason').val(''); // Clear reason Input
        if (selectedValueReason == 'DROPPED_BY_TROOTECH'  && $('#id_current_status').val() == 'closed_lost') {
        $('#id_sub_reason_dropped_by_trootech').parent().parent().show(); // Show id_reason div
        $('#id_reason').parent().parent().show(); // Show id_reason div
    }
        if(selectedValueReason){
            $('#id_reason').parent().parent().show(); // Show id_reason div
        }
  })
});



$(document).click(function(e) {
    if (!$(event.target).closest('.datetimepicker').length) {
        $('.meeting-datetimepicker').datetimepicker('hide');
}
});
