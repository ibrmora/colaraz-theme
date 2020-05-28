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
    setInterval(getAndPopulateNotifications, colarazNotificationsRefreshTime);

    getAndPopulateJobAlerts();
    setInterval(getAndPopulateJobAlerts(), colarazJobAlertsRefreshTime);
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

function getAndPopulateJobAlerts() {
    $.ajax({
        type: "GET",
        url: colarazJobAlertsFetchingUrl,
        success: function (resp) {
            let job_alerts = "";
            if (resp.d.length) {
                resp.d.forEach(element => {
                    job_alerts += createJobAlert(element.Image, element.Heading, element.Message, element.RelativeTime);
                });
            } else {
                job_alerts = "<li><p>No new job alerts</p></li>";
            }

            handleJobAlertsListing(job_alerts);
            handleJobAlertsCount(resp.d.length);

        },
        error: function (resp) {
            console.error(`Job Alerts API gave following error: ${resp.Message}`);
        },
    });

    function handleJobAlertsListing(job_alerts) {
        $("#job-alerts-list").html(job_alerts);
    }
    function handleJobAlertsCount(count) {
        if (count == 0) {
            let countSpan = $("#unread-job-alerts-count");
            countSpan.removeClass("count");
            countSpan.html("");
        } else {
            let countSpan = $("#unread-job-alerts-count");
            countSpan.addClass("count");
            countSpan.html(count);
        }
    }

    function createJobAlert(img_src, heading, message, relativeTime) {
        return `<li>
                    <div class="media">
                        <a href="#">
                            <img src="${img_src ? img_src : "https://placehold.it/34x34"}" alt="">
                        </a>
                    </div>
                    <div style="font-size: 12px;padding: 0;color: #333;" class="description">
                        ${heading} <span style="color: #aaaaaa;font-family: sans-serif;"> at </span> ${message}
                        <p><i class="fa fa-share-square-o"></i> ${relativeTime}</p>
                    </div>
                </li>`;
    }
}

function markJobAlertsAsRead() {
    $.ajax({
        type: "GET",
        url: colarazJobAlertsMarkingUrl
    });
}

function removeJobAlertsCount() {
    let countSpan = $("#unread-job-alerts-count");
    if (countSpan.html() !== "" || countSpan.hasClass("count")) {
        countSpan.removeClass("count");
        countSpan.html("");
        markJobAlertsAsRead();
    }
}
