function makeAnimatedHeader() {
    /**
     * Dynamically add scrolling effect on header of the pages.
     */
    'use strict';
    let documentWindow = $(window);
    let headerHeight = $('.wrapper-header .primary').outerHeight();
    let headerNavigationHeight = $('#view-top').outerHeight();

    documentWindow.on('scroll', function() {
        let scrolled = documentWindow.scrollTop();

        if (scrolled > headerHeight) {
            $('#view-top').addClass('fixed').css('top', -(headerHeight+2));
            $('.wrapper.wrapper-view').css('padding-top', headerNavigationHeight);
        } else {
            $('#view-top').removeClass('fixed').css('top','');
            $('.wrapper.wrapper-view').css('padding-top', '');
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
    getAndPopulateNotifications();
    setInterval(getAndPopulateNotifications, notificationsRefreshTime);
});

function getAndPopulateNotifications() {
    $.ajax({
        type: "GET",
        url: colarazNotificationsFetchingUrl,
        success: function (resp) {
            let notifications = "";
            let unreadNotificationsCount = 0;

            resp.result.forEach(element => {
                if (element.read == 0) unreadNotificationsCount += 1;
                notifications += createNotification(element.image, element.description, element.time, element.read);
            });

            handleNotificationsListing(notifications);
            handleNotificationsCount(unreadNotificationsCount);

        },
        error: function (resp) {
            console.error(`Notifications API gave following error: ${resp.message}`);
        },
    });

    function handleNotificationsListing(notifications) {
        $("#notifications-list").html(notifications);
    }
    function handleNotificationsCount(count) {
        if (count == 0) {
            let countSpan = $("#unread-notifications-count");
            countSpan.removeClass("count");
            countSpan.html("");
        } else {
            let countSpan = $("#unread-notifications-count");
            countSpan.addClass("count");
            countSpan.html(count);
        }
    }

    function createNotification(img_src, description, days_count, read) {
        return `<li class="${read ? 'read' : 'unread'}" >` +
            `<div class="media">` +
            `<a href="#"><img src="${img_src}" alt=""></a>` +
            `</div>` +
            `<div class="description">` +
            `${description}` +
            `<p>${days_count}</p>` +
            `</div>` +
            `</li>`;
    }
}

function markNotificationsAsRead() {
    $.ajax({
        type: "GET",
        url: colarazNotificationsMarkingUrl
    });
}

function removeNotificationsCount() {
    let countSpan = $("#unread-notifications-count");
    if (countSpan.html() !== "" || countSpan.hasClass("count")) {
        countSpan.removeClass("count");
        countSpan.html("");
        markNotificationsAsRead();
    }
}
