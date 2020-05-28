/**
 * Ensuring collapsible and accessible components on multiple
 * screen sizes for the responsive lms header.
*/

$(window).on('load', function () {
    // show preloader until page content is loaded
    $('#window-wrap').fadeIn(function() {
        $('#preload').fadeOut();
    });

    // Reset nav menu cookie on login
    $(document).find('.login-button').on('click', function () {
        edlyUpdateWpMenuCookie();
    });

    $(document).find('.edx-link li').find('a').click(function() {
        if (this.href.indexOf('logout') !== -1) {
            edlyUpdateWpMenuCookie();
        }
    });
    edlySetupZendeskWidget();
});

function edlyUpdateWpMenuCookie(targetDate, value) {
    /**
     * Clear or Update Edly WordPress Menu Cookie
     */
    let date = new Date();
    let expires = 'expires=';
    let edlyWpMenu = '';

    if (value !== undefined) {
        edlyWpMenu = value;
    }

    // create edly_wp_menu cookie and set nav menu at it's value
    if (targetDate === undefined) {
        targetDate = date.getDate() - 1;
    }
    date.setDate(targetDate);
    expires += date.toUTCString();
    document.cookie = 'edly_wp_menu=' + edlyWpMenu + '; ' + expires + '; domain=.edly.io; path=/;';
}

function edlySetupNavMenu() {
    /**
    * Set Edly WordPress Menu Cookie
    */
    let edlyWpMenuCookie = document.cookie.replace(/(?:(?:^|.*;\s*)edly_wp_menu\s*=\s*([^;]*).*$)|^.*$/, '$1');

    if (edlyWpMenuCookie !== '') {
        // if cookie exist update nav menu
        edlyWpMenuCookie = decodeURIComponent(edlyWpMenuCookie).replace(/\+/g, ' ');
        $('#edly-nav-menu').html(edlyWpMenuCookie);
        edlyNavFocus();
    } else {
        // if cookie doesn't exist fetch nav menu from word-press
        let request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                // parse word-press json response
                let edlyWpMenu = JSON.parse(this.responseText);
                edlyWpMenu = decodeURIComponent(edlyWpMenu).replace(/\\/g, '');

                if (window.location.href.indexOf('login') > -1 || window.location.href.indexOf('register') > -1 || window.location.href.indexOf('password_reset_confirm')) {
                    edlyUpdateWpMenuCookie();
                } else if (edlyWpMenu !== '') {
                    // create edly_wp_menu cookie and set nav menu at it's value
                    let date = new Date();
                    edlyUpdateWpMenuCookie(date.getDate() + 1, encodeURIComponent(edlyWpMenu));
                }

                // update nav menu
                $('#edly-nav-menu').html(edlyWpMenu);
                edlyNavFocus();
            }
        };

        let navURL = $('body').attr('data-nav-menu-url');

        if (navURL !== '' && navURL !== '#') {
            request.open('GET', navURL);
            request.withCredentials = true;
            request.send();
        }
    }
}

function createMobileMenu() {
    /**
     * Dynamically create a mobile menu from all specified mobile links
     * on the page.
     */
    'use strict';
    $('.mobile-nav-item').each(function() {
        var mobileNavItem = $(this).clone().addClass('mobile-nav-link');
        mobileNavItem.removeAttr('role');
        mobileNavItem.find('a').attr('role', 'menuitem');
        // xss-lint: disable=javascript-jquery-append
        $('.mobile-menu').append(mobileNavItem);
    });
}

function makeAnimatedHeader() {
    /**
     * Dynamically add scrolling effect on header of the pages.
     */
    'use strict';
    let documentWindow = $(window);
    let headerHeight = $('.main-header').outerHeight();
    let headerNavigationHeight = $('.global-header').outerHeight();

    documentWindow.scroll(function() {
        let scrolled = documentWindow.scrollTop();

        if (scrolled > headerHeight) {
            $('.global-header').addClass('fixed').css('top', -(headerHeight+1));
            $('.window-wrap').css('padding-top', headerNavigationHeight);
        } else {
            $('.global-header').removeClass('fixed').css('top', '');
            $('.window-wrap').css('padding-top', '');
        }
    });
}

function edlySetupZendeskWidget() {
    /**
    * Set Edly Zendesk Widget Cookie
    */
    let zendeskWidgetCookie = document.cookie.replace(/(?:(?:^|.*;\s*)edly_zendesk_widget\s*=\s*([^;]*).*$)|^.*$/, '$1');

    if (zendeskWidgetCookie !== '') {
        let zendeskWidgetScript = document.createElement('script');
        zendeskWidgetScript.setAttribute('id', 'ze-snippet');
        zendeskWidgetScript.setAttribute('src', zendeskWidgetCookie);
        $('#edly-zendesk-widget').html(zendeskWidgetScript);
    } else {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                $('#edly-zendesk-widget').html(JSON.parse(this.responseText));
                let edlyZendeskWidgetCode = $('#ze-snippet').attr('src');
                document.cookie = 'edly_zendesk_widget=' + edlyZendeskWidgetCode + '; domain=.edly.io; path=/;';
            }
        };

        let zendeskWidgetURL = $('body').attr('data-zendesk-widget-url');
        if (zendeskWidgetURL !== '' && zendeskWidgetURL !== '#') {
            request.open('GET', zendeskWidgetURL);
            request.withCredentials = true;
            request.send();
        }
    }
}

function edlyNavFocus() {
    var container, links, menu, i, len;
    container = document.getElementById('edly-nav-menu');
    menu = container.getElementsByTagName('ul')[0];
    if (menu.className.indexOf('nav-menu') === -1) {
        menu.className += ' nav-menu';
    }

    // Get all the link elements within the menu.
    links = menu.getElementsByTagName('a');
    // Each time a menu link is focused or blurred, toggle focus.
    for (i = 0, len = links.length; i < len; i++) {
        links[i].addEventListener('focus', toggleFocus, true);
        links[i].addEventListener('blur', toggleFocus, true);
    }
}

function toggleFocus() {
    /**
     * Sets or removes .focus class on an element.
     */
    var self = this;

    // Move up through the ancestors of the current link until we hit .nav-menu.
    while (self.className.indexOf('nav-menu') === -1) {
        // On li elements toggle the class .focus.
        if (self.tagName.toLowerCase() === 'li') {
            if (self.className.indexOf('focus') !== -1) {
                self.className = self.className.replace(' focus', '');
            } else {
                self.className += ' focus';
            }
        }

        self = self.parentElement;
    }
}

$(document).ready(function() {
    'use strict';
    var $hamburgerMenu;
    var $mobileMenu;
    var $mobileMainMenu;
    // Toggling visibility for the user dropdown
    $('.global-header .toggle-user-dropdown, .global-header .toggle-user-dropdown span').click(function(e) {
        var $dropdownMenu = $('.global-header .nav-item .dropdown-user-menu');
        var $userDropdown = $('.global-header .toggle-user-dropdown');
        if ($dropdownMenu.is(':visible')) {
            $dropdownMenu.addClass('hidden');
            $userDropdown.attr('aria-expanded', 'false');
        } else {
            $dropdownMenu.removeClass('hidden');
            $dropdownMenu.find('.dropdown-item')[0].focus();
            $userDropdown.attr('aria-expanded', 'true');
        }
        $('.global-header .toggle-user-dropdown').toggleClass('open');
        e.stopPropagation();
    });

    // Hide user dropdown on click away
    if ($('.global-header .nav-item .dropdown-user-menu').length) {
        $(window).click(function(e) {
            var $dropdownMenu = $('.global-header .nav-item .dropdown-user-menu');
            var $userDropdown = $('.global-header .toggle-user-dropdown');
            if ($userDropdown.is(':visible') && !$(e.target).is('.dropdown-item, .toggle-user-dropdown')) {
                $dropdownMenu.addClass('hidden');
                $userDropdown.attr('aria-expanded', 'false');
            }
        });
    }

    // Toggling menu visibility with the hamburger menu
    $('.global-header .hamburger-menu').click(function() {
        $hamburgerMenu = $('.global-header .hamburger-menu');
        $mobileMenu = $('.mobile-menu');
        $mobileMainMenu = $('.main-navigation');
        if ($mobileMenu.is(':visible')) {
            $mobileMenu.addClass('hidden');
            $hamburgerMenu.attr('aria-expanded', 'false');
        } else {
            $mobileMenu.removeClass('hidden');
            $hamburgerMenu.attr('aria-expanded', 'true');
        }
        $hamburgerMenu.toggleClass('open');
        if ($hamburgerMenu.hasClass('open')) {
            $mobileMainMenu.addClass('menu-open');
            $hamburgerMenu.attr('aria-expanded', 'true');
            $mobileMainMenu.closest('.global-header').addClass('menuOpened');
        } else {
            $mobileMainMenu.removeClass('menu-open');
            $hamburgerMenu.attr('aria-expanded', 'false');
            $mobileMainMenu.closest('.global-header').removeClass('menuOpened');
        }
    });

    // Toggling menu visibility
    $('.global-header .navmenu-toggle').on('click', function() {
        $hamburgerMenu = $(this);
        $mobileMenu = $hamburgerMenu.siblings('ul');
        $hamburgerMenu.toggleClass('menu-open');
        if ($hamburgerMenu.hasClass('menu-open')) {
            $mobileMenu.slideDown();
            $hamburgerMenu.attr('aria-expanded', 'true');
        } else {
            $mobileMenu.slideUp();
            $hamburgerMenu.attr('aria-expanded', 'false');
        }
    });

    // Hide hamburger menu if no nav items (sign in and register pages)
    if ($('.mobile-nav-item').size() === 0) {
        $('.global-header .hamburger-menu').addClass('hidden');
    }

    createMobileMenu();
    makeAnimatedHeader();
    edlySetupNavMenu();

    getAndPopulateNotifications();
    setInterval(getAndPopulateNotifications, colarazNotificationsRefreshTime);

    getAndPopulateJobAlerts();
    setInterval(getAndPopulateJobAlerts, colarazJobAlertsRefreshTime);
});

// Accessibility keyboard controls for user dropdown and mobile menu
$('.mobile-menu, .global-header').on('keydown', function(e) {
    'use strict';
    var isNext;
    var nextLink;
    var loopFirst;
    var loopLast;
    var $curTarget = $(e.target);
    var isLastItem = $curTarget.parent().is(':last-child');
    var isToggle = $curTarget.hasClass('toggle-user-dropdown');
    var isHamburgerMenu = $curTarget.hasClass('hamburger-menu');
    var isMobileOption = $curTarget.parent().hasClass('mobile-nav-link');
    var isDropdownOption = !isMobileOption && $curTarget.parent().hasClass('dropdown-item');
    var $userDropdown = $('.global-header .user-dropdown');
    var $hamburgerMenu = $('.global-header .hamburger-menu');
    var $toggleUserDropdown = $('.global-header .toggle-user-dropdown');

    // Open or close relevant menu on enter or space click and focus on first element.
    if ((e.key === 'Enter' || e.key === 'Space') && (isToggle || isHamburgerMenu)) {
        e.preventDefault();
        e.stopPropagation();

        $curTarget.click();
        if (isHamburgerMenu) {
            if ($('.mobile-menu').is(':visible')) {
                $hamburgerMenu.attr('aria-expanded', true);
                $('.mobile-menu .mobile-nav-link a').first().focus();
            } else {
                $hamburgerMenu.attr('aria-expanded', false);
            }
        } else if (isToggle) {
            if ($('.global-header .nav-item .dropdown-user-menu').is(':visible')) {
                $userDropdown.attr('aria-expanded', 'true');
                $('.global-header .dropdown-item a:first').focus();
            } else {
                $userDropdown.attr('aria-expanded', false);
            }
        }
    }

    // Enable arrow functionality within the menu.
    if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && (isDropdownOption || isMobileOption ||
        (isHamburgerMenu && $hamburgerMenu.hasClass('open')) || (isToggle && $toggleUserDropdown.hasClass('open')))) {
        isNext = e.key === 'ArrowDown';
        if (isNext && !isHamburgerMenu && !isToggle && isLastItem) {
            // Loop to the start from the final element
            nextLink = isDropdownOption ? $toggleUserDropdown : $hamburgerMenu;
        } else if (!isNext && (isHamburgerMenu || isToggle)) {
            // Loop to the end when up arrow pressed from menu icon
            nextLink = isHamburgerMenu ? $('.mobile-menu .mobile-nav-link a').last()
                : $('.global-header .dropdown-user-menu .dropdown-nav-item').last().find('a');
        } else if (isNext && (isHamburgerMenu || isToggle)) {
            // Loop to the first element from the menu icon
            nextLink = isHamburgerMenu ? $('.mobile-menu .mobile-nav-link a').first()
                : $('.global-header .dropdown-user-menu .dropdown-nav-item').first().find('a');
        } else {
            // Loop up to the menu icon if first element in menu
            if (!isNext && $curTarget.parent().is(':first-child') && !isHamburgerMenu && !isToggle) {
                nextLink = isDropdownOption ? $toggleUserDropdown : $hamburgerMenu;
            } else {
                nextLink = isNext
                    ? $curTarget.parent().next().find('a') // eslint-disable-line newline-per-chained-call
                    : $curTarget.parent().prev().find('a'); // eslint-disable-line newline-per-chained-call
            }
        }
        nextLink.focus();

        // Don't let the screen scroll on navigation
        e.preventDefault();
        e.stopPropagation();
    }

    // Escape clears out of the menu
    if (e.key === 'Escape' && (isDropdownOption || isHamburgerMenu || isMobileOption || isToggle)) {
        if (isDropdownOption || isToggle) {
            $('.global-header .nav-item .dropdown-user-menu').addClass('hidden');
            $toggleUserDropdown.focus()
                .attr('aria-expanded', 'false');
            $('.global-header .toggle-user-dropdown').removeClass('open');
        } else {
            $('.mobile-menu').addClass('hidden');
            $hamburgerMenu.focus()
                .attr('aria-expanded', 'false')
                .removeClass('open');
        }
    }

    // Loop when tabbing and using arrows
    if ((e.key === 'Tab') && ((isDropdownOption && isLastItem) || (isMobileOption && isLastItem) || (isHamburgerMenu &&
        $hamburgerMenu.hasClass('open')) || (isToggle && $toggleUserDropdown.hasClass('open')))) {
        nextLink = null;
        loopFirst = isLastItem && !e.shiftKey && !isHamburgerMenu && !isToggle;
        loopLast = (isHamburgerMenu || isToggle) && e.shiftKey;
        if (!(loopFirst || loopLast)) {
            return;
        }
        e.preventDefault();
        if (isDropdownOption || isToggle) {
            nextLink = loopFirst ? $toggleUserDropdown
                : $('.global-header .dropdown-user-menu .dropdown-nav-item a').last();
        } else {
            nextLink = loopFirst ? $hamburgerMenu : $('.mobile-menu .mobile-nav-link a').last();
        }
        nextLink.focus();
    }
});

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

    function handleNotificationsListing(notifications){
        $("#notifications-list").html(notifications);
    }
    function handleNotificationsCount(count){
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

    function createNotification(img_src, description, days_count, read){
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

function removeNotificationsCount(){
    let countSpan = $("#unread-notifications-count");
    if (countSpan.html() !== "" || countSpan.hasClass("count")){
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
