jQuery(document).ready(function($) {
    var original_message = "";
    $(".ig-global-form").on("click", ".ig-global-form_reset", function(event) {
        var thisForm = $(this)[0].form;
        $(thisForm).find(".ig-global-form_message").fadeOut(300, function() {
            $(thisForm).find(".ig-global-form_message p").show();
            $(thisForm).find(".ig-global-form_message .ig-global-form_error").remove();
            $(thisForm).find(".ig-global-form_message .ig-global-form_reset").remove();
            $(thisForm).find(":input[type=submit]").prop("disabled", false);
            $(thisForm).find(".ig-global-form_group").fadeTo("slow", 1)
        })
    });
    $(".ig-global-form").on("submit", function(event) {
        event.preventDefault();
        var thisForm = $(this);
        thisForm.find(":input[type=submit]").prop("disabled", true);
        $.ajax({ type: "POST", url: IG_FORM_URL, data: $(this).serialize() + "&site_id=" + IG_SITE_ID }).done(function(response) {
            if (response.success) { thisForm.find(".ig-global-form_group").fadeTo("slow", 0, function() { thisForm.find(".ig-global-form_message").fadeIn() }) }
            else {
                original_message = thisForm.find(".ig-global-form_message p").text();
                thisForm.find(".ig-global-form_message p").hide();
                switch (response.error.code) {
                    case 0:
                        thisForm.find(".ig-global-form_message").append('<p class="ig-global-form_error">' + response.error.message + "</p>");
                        thisForm.find(".ig-global-form_group").fadeTo("slow", 0, function() { thisForm.find(".ig-global-form_message").fadeIn() });
                        break;
                    case 1:
                        thisForm.find(".ig-global-form_message").append('<p class="ig-global-form_error">' + response.error.message + "</p>");
                        thisForm.find(".ig-global-form_message").append('<button class="ig-global-form_reset" type="reset">Try Again!</button>');
                        thisForm.find(".ig-global-form_group").fadeTo("slow", 0, function() { thisForm.find(".ig-global-form_message").fadeIn() });
                        break;
                    default:
                }
            }
        })
    });
    $(".ig-event-manager-form").on("click", ":input[type=submit]", function(event) {
        event.preventDefault();
        var thisForm = $(event.delegateTarget);
        thisForm.find(":input[type=submit]").prop("disabled", true);
        $.ajax({ type: "POST", url: IG_FORM_URL, data: thisForm.serialize() + "&approved=" + event.target.value }).done(function(response) { window.location.href = response.redirect })
    })
});
