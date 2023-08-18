var userTypeField = $('#id_user_type')
var BloodGroupField = $('#id_blood_group')
var BloodGroupFieldLabel = $('label[for="id_blood_group"]')

// display or hide blood group field according user type
function displayOrHideBloodGroup(e){
console.log(userTypeField.val());
    if (userTypeField.val()=="blood_receiver" || userTypeField.val()=="blood_donor"){
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