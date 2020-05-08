function makeAnimatedHeader() {
    /**
     * Dynamically add scrolling effect on header of the pages.
     */
    'use strict';
    let documentWindow = $('body');
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

function headerToggleDropdown() {
    /**
     * Dynamically toggle dropdown show hide.
     */
    'use strict';
    $('.nav-link').on('click', function (e) {
        e.preventDefault();
        $(this).siblings('.header-dropdown').toggleClass('show');
    });
}

$(document).ready(function (){
    makeAnimatedHeader();
    headerToggleDropdown();
});
