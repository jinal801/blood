function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    beforeSend: function (xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            var csrftoken = getCookie('csrftoken');
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

;(function ($, window, argument, undefined) {

//    var formErrorText = gettext("Oops. There are some validation issues in the input data. Please check the form errors.");

    var pluginName = 'djParsley';

    function Plugin(options, form) {
        this.options = $.extend({}, $.fn[pluginName].options, options);
        this.form = form;
        this.$form = $(form);

        // parsley the form
        this.parsley = this.$form.parsley();
        /*window.Parsley.on('form:error', function () {
            toastr.error(formErrorText)
        });*/

        // get the submit button
        this.$submitBtn = this.options.submitBtn ? this.options.submitBtn: this.$form.find(':submit');

        this.init();
    }

    Plugin.prototype.init = function () {
        var instance = this;

        var resetBtn = function() {
            //instance.$submitBtn.html(instance.$submitBtn.data('original-text'));
            instance.$submitBtn.prop('disabled', false);
        };

        var performSubmit = function (e) {
            e.preventDefault();

            // reset previous errors, if any.
            // this step is important, to avoid having concatenated
            // error messages
            $(this).parsley().reset();

            // call before submission
            if ($.isFunction(instance.options.beforeSubmission)) instance.options.beforeSubmission(instance.form, instance);

            // disable submit button, so it can't be clicked anymore
            //var loadingText = gettext('loading...');
            //instance.$submitBtn.data('original-text', instance.$submitBtn.html());
            //instance.$submitBtn.html(loadingText);
            instance.$submitBtn.prop('disabled', true);

            // submit the form
            if(instance.options.canSubmit(instance.form, instance)) {
                submit()
            }
        };

        var submit = function () {
            var url = instance.options.action(instance);

            $.ajax({
                url: url,
                type: 'post',
                data: new FormData(instance.form),
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false
            })
            .done(function (payload) {
                // call custom onSuccess
                if ($.isFunction(instance.options.onSuccess)) instance.options.onSuccess(payload, instance);

                if (typeof payload['redirect_url'] === 'undefined') {
                    // reset the button with timeout, to prevent multiple submissions
                    setTimeout(function () {resetBtn();}, instance.options.redirectionTimeout + 250);
                    // reset parsley, remove all possible ui changes done by it.
                    instance.parsley.reset();
                }

                // call custom postSuccess
                if ($.isFunction(instance.options.postSuccess)) instance.options.postSuccess(payload, instance)

            })
            .fail(function (response) {
                if ($.isFunction(instance.options.onFail))
                    instance.options.onFail(response, instance);

                if ($.isFunction(instance.options.postFail))
                    instance.options.postFail(response, instance);

                // reset the button
                resetBtn();
            })
        };

        // listen for form submission event and trigger the plugin actions.
        // instance.options.container.on('submit', instance.$form[0], performSubmit)
        instance.$form.on('submit', performSubmit)

    };

    // register as jquery plugin;
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            var instance = $.data(this, 'plugin_' + pluginName);
            if (!(instance instanceof Plugin)) {
                instance = new Plugin(options, this);
                $.data(this, 'plugin_' + pluginName, instance)
            }
        });
    };

    $.fn[pluginName].options = {
        action: function (instance) {
            return $(instance.form).attr('action');
        },
        // general error message in case of unexpected 500 from server.
        serverErrorMsg: 'Error occurred. Refresh the page and try again',
        // time to wait before redirecting when redirect_url returns from server
        redirectionTimeout: 750,
        // hide form after success submit
        hideForm: false,
        submitBtn: null,
        beforeSubmission: null,
        onSuccess: function (payload, instance) {
            $('.modal').modal('hide');
            if (payload['interviews_data']){
                set_interviews_data(payload['interviews_data'], payload['action'])
            }
            $.each(payload.messages, function (i, m) {
                if (m.extra_tags=='success'){
                    toastr.success(m.message)
                }
                else if (m.extra_tags=='error'){
                    toastr.error(m.message)
                }
            });
            if ($.isFunction(instance.options.successFunc)) instance.options.successFunc(payload['message']);

            if (payload['redirect_url']) {
                // redirect to the url provided in the response
                setTimeout(function() {window.location.href = payload['redirect_url']}, instance.options.redirectionTimeout)
            } else if (instance.options.hideForm) {
                instance.$form.parent().hide('slow')
            }
        },
        postSuccess: null,
        onFail: function (response, instance) {
            var data = response.responseJSON;
            if (response.status==400 && data['errors']) {
                $.map( data['errors'], function( v, k ) {

                    if(k=='error_message'){
                        instance.options.errorFunc(v);
                    }else{
                        if(k=='__all__'){
                            instance.options.errorFunc(v);
                        } else {
                            if (k == 'captcha') {
                                k = 'captcha_1'
                            }
//                            instance.options.errorFunc(formErrorText);
                            var field = instance.$form.find('[name='+k+']');
                            field.parsley().addError('backendError', {message: v[0], updateClass: true})
                            if(k=='interview_round_status'){
                                $('#id_interview_round_status_char').parsley().addError('backendError', {message: v[0], updateClass: true})
                            }
                        }
                    }
                })

            } else if ((response.status==400 || response.status == 406) && data['reason']) {
                instance.options.errorFunc(data['reason']);
            } else instance.options.serverError(response, instance)
        },
        postFail: null,
        // time to wait before redirecting user to another url
        // upon form success submission
        redirectTimeout: 750,
        // function to be called when form submission was success.
        // IE: Profile data updated!
        // successFunc: toastr.success
        // successFunc: alert.bind(window)
        successFunc: null,
        // functions to be called when error is not a field error, ie: on login form user credentials are not good
        // though, it passed the basic validation rules, like mandatory username and password, etc.
        errorFunc: alert.bind(window),
        // general error behaviour on server 500
        serverError: function (response, instance) {
            instance.options.errorFunc(instance.options.serverErrorMsg)
        },
        // hook here to interrupt the submission process
        // useful for static html
        canSubmit: function(form, instance) {
            return true;
        }
    };

})(jQuery, window, document);