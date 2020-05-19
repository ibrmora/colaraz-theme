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

function openInviteFriendPopup(inviteFriendUrl) {
    let width = 802;
    let height = 554;
    let screenWidth = this.window.screen.width;
    let screenHeight = this.window.screen.height;
    let windowSize = `width=${width}, height=${height}`;
    if (screenWidth < width || screenHeight < height) {
        windowSize = `width=${screenWidth}, height=${screenHeight}`;
    }
    let windowTitle = 'Colaraz - Invite Friends';
    let newWindow = window.open(inviteFriendUrl, 'Invite Friend', windowSize);
    setTimeout(() => newWindow.document.title = windowTitle, 0);
}

$(document).ready(function (){
    makeAnimatedHeader();
});
