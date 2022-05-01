$(window).scroll(function() {
    if ($(".navbar").offset().top > 75) {
        $(".bg-dark").removeClass("bg-clear");
    } else {
        $(".bg-dark").addClass("bg-clear");
    }
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});
