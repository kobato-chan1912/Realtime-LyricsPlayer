$(document).on("click", "#emoji-picker", function (e) {
    e.stopPropagation();
    $('.intercom-composer-emoji-popover').toggleClass("active");
});

$(document).click(function (e) {
    if ($(e.target).attr('class') != '.intercom-composer-emoji-popover' && $(e.target).parents(".intercom-composer-emoji-popover").length == 0) {
        $(".intercom-composer-emoji-popover").removeClass("active");
    }
});


$(document).on("click", ".intercom-emoji-picker-emoji", function (e) {
    var input = $("#message");
    // input.val(input.val() + $(this) + " ");
    input.val($('#message').val() + $(this).html());
    $(".intercom-composer-emoji-popover").removeClass("active");
});

$('.intercom-composer-popover-input').on('input', function () {
    var query = this.value;
    if (query != "") {
        $(".intercom-emoji-picker-emoji:not([title*='" + query + "'])").hide();
    }
    else {
        $(".intercom-emoji-picker-emoji").show();
    }
});