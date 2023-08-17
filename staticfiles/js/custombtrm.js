var leadSourceElement = '#id_lead_source'
var nameElement = $('input[name="name"]')
var KeyPersonElement = $('input[name="key_person"]')
var SourceLinkElement = $('input[name="source_link"]')
var CityElement = $('input[name="city"]')
var CountryElement = $('input[name="country"]')
var TimeZoneElement = $('input[name="timezone"]')
var EmailElement = $('input[name="email_id"]')
var PhoneNumberElement = $('input[name="phone_number"]')
var LinkedInElement = $('input[name="linkedin_profile"]')
var timeZoneElement = $('input[name="timezone"]')
var SaveElement = $('#save_change')
var CountryIDElement = $('#id_country')
var TimeZoneIDElement = $('#id_timezone')
var CityIDElement = $("#id_city")
var ToolTipElement = $("[data-bs-toggle=tooltip]")
var AddFormElement = $("form#add_client")
var AddClientModal = $('#add_client_modal')
var userTypeField = $('#id_user_type')
var BDMField = $('#id_bdm')
var RPField = $('#id_reporting_person')
//function for elements
function trimValue(element){
    return $(element).val().trim();
}
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
// Create Django Ajax Call for add client
var csrftoken = $("[name=csrfmiddlewaretoken]").val();
$("#add_client").djParsley({}); // parsley call for add client from resource  side
$("#client_update_form").djParsley({}); // parsley call for update client from client  side
$("#add_user").djParsley({}); // parsley call for add user from user's side.
$("#edit_user").djParsley({}); // parsley call for add user from user's side.
$("#add_clients_id").djParsley({}); // parsley call for add client form client's side.
$("#schedule_interview_form").djParsley({}); // parsley call for interview schedule.
$("#add_resource_cv_form").djParsley({}); // parsely call for add cv to resource.
$("#edit_resource_cv_form").djParsley({}); // parsely call for update cv to resource.
/*function for auto city name suggestion after user enter 3 letters for add client from the client side.*/
$( function(){
    if (typeof city_suggestion_url_client != "undefined") {
        $('#id_city').autocomplete({
                source: city_suggestion_url_client,
                select: function( event, ui ) {
                    document.getElementById('id_city').value = ui.item.value.split(',')[0]
                    return false
                }
        });
    }
}
);
/*function for auto city name suggestion after user enter 3 letters for add client from the resource_management side.*/
$("#add_client_modal").on("shown.bs.modal", function(){

    $('#id_city').autocomplete({
        source: city_suggestion_url,
        select: function( event, ui ) {
            document.getElementById('id_city').value = ui.item.value.split(',')[0]
            return false
        }
    });

    $(".ui-menu.ui-widget.ui-widget-content.ui-autocomplete.ui-front").css("z-index", "9999")
})
//country and timezone from the city name function

// $(document).ready(function(){

//     var client_country_bg = document.getElementById('client_bg_country')
//     var client_time_zone_bg = document.getElementById('client_bg_time_zone')
//       CityIDElement.change(function(){
//         var city = this.value  // current city name
//         var data = {
//             'city': city
//                 }
//         timeZoneElement.val('Time-Zone');
//         CountryElement.val('Country');
//         if (document.getElementById("id_city").value.length >= 3){

//             $.ajax({
//                 url: city_url,
//                 method: 'GET',
//                 data: {city: city},
//                 cache: false,
//                 dataType: 'html',
//                 beforeSend: enableLoader,
//                 success: function(response) {
//                     data = JSON.parse(response); // response we are getting string , so convert it into json format
//                     let time_zone = document.querySelector('input[name="timezone"]');  // get time_zone value
//                     let country = document.querySelector('input[name="country"]');

//                     if (data["status"] === 'success'){
//                         timeZoneElement.val(data.time_zone);
//                         CountryElement.val(data.country);
//                         SaveElement.prop('disabled', false);
//                         ToolTipElement.attr('title', data['message']);
//                     }
//                     else {
//                         timeZoneElement.val('Time-Zone');
//                         CountryElement.val('Country');
//                         SaveElement.prop('disabled', true);
//                         ToolTipElement.attr('title', data['message']);
//                         toastr.error(data['message'])
//                     }
//                    disableLoader();
//                 },
//             });
//         }
//       });
// });

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

$('.resource_status').each(function(e){
    $(this).change(function(e){
        if(($(this).val()=="selected") || ($(this).val()=="rejected") || ($(this).val()=="closed")){
            $(this).parent().parent().removeClass("col-lg-12").addClass("col-lg-6");
        }
        else{
            $(this).parent().parent().removeClass("col-lg-6").addClass("col-lg-12");
        }
    });
});

function displayOrHideBDM(e){
    if (userTypeField.val()=="bde"){
        BDMField.prop("required", true)
        BDMField.parent().parent().removeClass("d-none");
    }
    else{
        BDMField.prop("required", false)
        BDMField.parent().parent().addClass("d-none");
    }
}
$(document).ready(displayOrHideBDM);
userTypeField.change(displayOrHideBDM);

function displayOrHideRP(e){
    if (userTypeField.val()=="bde"){
        RPField.parent().parent().removeClass("d-none");
    }
    else{
        RPField.parent().parent().addClass("d-none");
    }
}
$(document).ready(displayOrHideRP);
userTypeField.change(displayOrHideRP);


// show or hide password
$('.eye').click(function(e){
    let eye = $(this);
    eye.toggleClass("psw-show");
    let passInput = eye.prevAll("input")
    if(passInput.attr('type')==='password'){
        passInput.attr('type','text');
    }else{
       passInput.attr('type','password');
    }
})


//select all checked automatically.
function checkAll_check1(id, id2, class_name){
    document.getElementById(id2).checked = document.querySelectorAll(id).length == $(`.${class_name}:checked`).length
}

$('.modal').on('hidden.bs.modal', function (event) {
    $('.modal').find('form').each(function(){$(this).trigger("reset");});
    $('.modal').find('form').each(function(){$(this).parsley().reset();});
    $('.modal .datetimepicker').each(function(){$(this).data('datetimepicker').date(null);});
    $('.modal .select2').each(function(){$(this).val('').trigger('change')})
})
// change password eye code
$( "span.password-eye" ).click(function() {
    $(this).toggleClass("psw-show");
    var password = $(this).prev('input.password-field');
    if (password.attr('type') == 'text'){
        password.attr('type', 'password');
    }
    else{
        password.attr('type', 'text');
    }
});

$(".modal").scroll(function(){
    $(this).find(".ui-autocomplete-input").autocomplete("close");
});

$('.request-submit').click(function(){
    $(this).prop('disabled', true);
    $(this).closest('form').submit();
});