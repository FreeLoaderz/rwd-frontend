$(window).scroll(function() {
    var scrollToTop = document.getElementById("scrollTop");
    if ($(".navbar").offset().top > 75) {
        $(".bg-black").removeClass("bg-clear");
        scrollToTop.style.display = "block";
    } else {
        $(".bg-black").addClass("bg-clear");
        scrollToTop.style.display = "none";
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
