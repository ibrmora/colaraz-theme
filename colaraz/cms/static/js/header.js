function makeAnimatedHeader() {
    /**
     * Dynamically add scrolling effect on header of the pages.
     */
    'use strict';
    let documentWindow = $(window);
    let headerHeight = $('.wrapper-header .primary').outerHeight();
    let headerNavigationHeight = $('.header-navigations').outerHeight();

    documentWindow.on('scroll', function() {
        let scrolled = documentWindow.scrollTop();

        if (scrolled > headerHeight) {
            $('#view-top').addClass('fixed');
            $('#view-top').css('padding-bottom', headerNavigationHeight);
        } else {
            $('#view-top').removeClass('fixed');
            $('#view-top').css('padding-bottom', '');
        }
    });
}

$(document).ready(function (){
    makeAnimatedHeader();
});
