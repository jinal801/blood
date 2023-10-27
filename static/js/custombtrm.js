var userTypeField = $('#id_user_type')
var BloodGroupField = $('#id_blood_group')
var BloodGroupFieldLabel = $('label[for="id_blood_group"]')
var CityFieldLabel = $('label[for="id_city"]')
var CountryFieldLabel = $('label[for="id_country"]')
var CityField = $('#id_city')
var CountryField = $('#id_country')

// display or hide blood group field according user type
function displayOrHideCityCountry(e){
    if (userTypeField.val()=="blood_donor"){
        CityField.prop("required", true)
        CountryField.prop("required", true)
        CityField.show();
        CountryField.show();
        CountryFieldLabel.removeClass("d-none");
        CityFieldLabel.removeClass("d-none");
    }
    else{
        CityField.prop("required", false)
        CountryField.prop("required", false)
        CountryFieldLabel.addClass("d-none");
        CityFieldLabel.addClass("d-none");
        CityField.hide();
        CountryField.hide();
    }
}
$(document).ready(displayOrHideCityCountry);
userTypeField.change(displayOrHideCityCountry);


// city and country fields required if use rtype is donor.
function displayOrHideBloodGroup(e){
    if (userTypeField.val()=="blood_donor" || userTypeField.val()=="blood_receiver"){
        BloodGroupField.prop("required", true)
        BloodGroupFieldLabel.show();
        BloodGroupField.parent().removeClass("d-none");
    }
    else{
        BloodGroupField.prop("required", false)
        BloodGroupField.parent().addClass("d-none");
        BloodGroupFieldLabel.hide();
    }
}
$(document).ready(displayOrHideBloodGroup);
userTypeField.change(displayOrHideBloodGroup);

// city and country fields required if use rtype is donor.
function displayOrHideCity(e){
    if (CountryField.val()){
        CityField.prop("required", true)
        CityFieldLabel.show();
        CityField.parent().removeClass("d-none");
    }
    else{
        CityField.prop("required", false)
        CityField.parent().addClass("d-none");
        CityFieldLabel.hide();
    }
}
$(document).ready(displayOrHideCity);
CountryField.change(displayOrHideCity);

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

// form submit for the blood group and filter data accordingly
document.getElementById("id_blood_group_value").addEventListener("change", function(){
    document.getElementById("id_donor").innerHTML = "";
    $.ajax({
        type: "GET",
        url: "get_donors/",
        data:{
            blood_group_value: $("#id_blood_group_value").val(),
        },
        dataType: 'json',
        success:function(response){
            console.log("Success", response.donors);
             $("#id_donor").html(response.donors);
            var select = document.getElementById("id_donor");
            for(var i=0; i<response.donors.length; i++)
            {
                var option = document.createElement("option");
                option.value = response.donors[i][1];
                option.innerHTML = response.donors[i][0];
                select.appendChild(option);
            }
        }
    });
});