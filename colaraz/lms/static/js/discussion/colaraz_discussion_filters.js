var nextUrlAllDiscussions = colarazDiscussionAllThreadsUrl;
var nextUrlAllPostsFollowing = colarazFollowingPostsUrl;

// All Topics
// fetch the topics segregation created by the author
// for now its only non_course_topics
function getAllTopics(reLoad = false) {
    $.ajax({
        type: 'GET',
        url: colarazAllTopicsUrl,
        success: function (resp) {
            resp['non_courseware_topics'].forEach(element => {
                getAndPopulateCertainTopic(element['id'], element['name'], element['thread_list_url'], reLoad);
            });
        },
        error: function (resp) {
            console.error(`All topics in Discussion API gives error: ${resp.Message}`);
        },
    });
}

// fetch and populate the custom topics with discussions and questions
function getAndPopulateCertainTopic(topicId, topicName, url, reLoad) {
    $.ajax({
        type: 'GET',
        url: url,
        success: function (resp) {
            var parentId = '#all-topics-main';
            var loadMoreClassName = topicId + '-topics-loadmore';
            var subTopicDiscussions = '';

            if (reLoad === false) {
                if (resp['results'].length > 0) {
                    $(parentId).append(createMultipleTopicElement(topicId, topicName));
                } else {
                    $(parentId).append(createSingleTopicElement(topicId, topicName));
                }

            }

            resp['results'].forEach(element => {
                subTopicDiscussions += createDiscussionElement(element);
            });

            if (reLoad) {
                $('#cz-' + topicId).html(subTopicDiscussions);
            } else {
                $('#cz-' + topicId).append(subTopicDiscussions);
            }

            if (resp['pagination']['next'] !== null) {
                $('#cz-' + topicId).append(loadMoreButtonAllTopics(resp['pagination']['next']));
            }

        },
        error: function (resp) {
            console.error(`All Topics' Questions in Discussion API gives error: ${resp.Message}`);
        },
    });

    function createSingleTopicElement(id, name) {
        return `<li class="dropdown-submenu" style="position: relative; padding: 5px;">
                   <a href="#" class="cz-submenu-title"> ${name} <span class="caret"></span></a>
                </li>`;
    }

    function createMultipleTopicElement(id, name) {
        return `<li class="dropdown-submenu" style="position: relative; padding: 5px;">
                   <a class="cz-submenu-title dropdown-toggle" href="#"> ${name} </a>
                   <ul id="cz-${id}" class="dropdown-menu" style="top: 0; left: 100%; margin-top: -1px; width: 300px; max-height: 310px; overflow: auto;">
                   </ul>
                </li>`;
    }


}

// load more click button functionality
function loadMoreAllTopics(element) {
    var nextUrl = element.getAttribute('next-url');
    var subDropDownId = $(element).parents('ul')[0].getAttribute('id');
    var loadMoreButton = $(element).parents('.forum-nav-thread')[0];

    if (nextUrl) {
        $.ajax({
            type: 'GET',
            url: nextUrl,
            success: function (resp) {
                var subTopicDiscussions = '';

                resp['results'].forEach(element => {
                    subTopicDiscussions += createDiscussionElement(element);
                });

                $(loadMoreButton).remove();
                $('#' + subDropDownId).append(subTopicDiscussions);

                if (resp['pagination']['next'] != null) {
                    $('#' + subDropDownId).append(loadMoreButtonAllTopics(resp['pagination']['next']));
                }

            },
            error: function (resp) {
                console.error(`All Topics' Questions in Discussion API gives error: ${resp.Message}`);
            },
        });
    }
}

function loadMoreButtonAllTopics(next_url) {
    return `<li class="forum-nav-thread" style="user-select: auto;">
                <a id="cz-loadmore" href="#" class="forum-nav-thread-link" next-url="${next_url}" onclick="loadMoreAllTopics(this)">load more</a>
            </li>`;

}

// on click for multi level dropdown
$(document).on("click", '.dropdown-submenu a.cz-submenu-title', function (e) {

    var allTopicsDropDown = $('#all-topics-main ul');
    for (var i = 0; i < allTopicsDropDown.length; i++) {
        if (allTopicsDropDown[i].style.display === 'block') {
            allTopicsDropDown[i].style.display = 'none';
        }

    }

    $(this).next('ul').toggle();
    e.stopPropagation();
    e.preventDefault();
});

// all topic filter functionality
$(document).ready(function () {
    $("#all-topics-filter").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#all-topics-main > li").filter(function () {
            $(this).toggle($(this).find("> a").text().toLowerCase().indexOf(value) > -1);
        });
    });
});

// prevent multilevel all topics dropdown to collapse on loadmore click
$(document).on("click", '#cz-loadmore', function (e) {
    e.stopPropagation();
    e.preventDefault();
});

// All Discussion
// fetch and populate the All Discussion Dropdown
function getAndPopulateAllDiscussions(reLoad = false) {
    $.ajax({
        type: 'GET',
        url: nextUrlAllDiscussions,
        success: function (resp) {
            var parentId = '#all-discussions-main';
            var loadMoreClassName = 'all-discussions-loadmore';
            var allDiscussionDropDown = '';
            nextUrlAllDiscussions = resp['pagination']['next'];

            resp['results'].forEach(element => {
                allDiscussionDropDown += createDiscussionElement(element);
            });

            if (allDiscussionDropDown) {
                delNoPostsElement();
            }

            $('li .' + loadMoreClassName).remove();

            if (reLoad) {
                $(parentId).html(allDiscussionDropDown);
            } else {
                $(parentId).append(allDiscussionDropDown);
            }


            if (resp['pagination']['next'] != null) {
                $(parentId).append(loadMoreButtonElement(loadMoreClassName));
            }

        },
        error: function (resp) {
            console.error(`All Discussions in Discussion API gives error: ${resp.Message}`);
        },
    });

}

// load more click button functionality
$(document).on("click", '.all-discussions-loadmore', function (e) {
    if (nextUrlAllDiscussions) {
        getAndPopulateAllDiscussions();
        e.stopPropagation();
    }
});

// Posts I'm following
// fetch followed posts and populate the Posts I'm Following dropdown
function getAndPopulateFollowingPosts(reLoad = false) {
    $.ajax({
        type: 'GET',
        url: nextUrlAllPostsFollowing,
        success: function (resp) {
            var parentId = '#posts-following-main';
            var loadMoreClassName = 'posts-following-loadmore';
            var followingPostsDropDown = '';
            nextUrlAllPostsFollowing = resp['pagination']['next'];

            resp['results'].forEach(element => {
                followingPostsDropDown += createDiscussionElement(element);
            });

            if (followingPostsDropDown) {
                delNoPostsElement();
            }

            $('li .' + loadMoreClassName).remove();

            if (reLoad) {
                $(parentId).html(followingPostsDropDown);
            } else {
                $(parentId).append(followingPostsDropDown);
            }

            if (resp['pagination']['next'] != null) {
                $(parentId).append(loadMoreButtonElement(loadMoreClassName));
            }
        },
        error: function (resp) {
            console.error(`Candidate followed posts in Discussion API gives error: ${resp.Message}`);
        },
    });
}

// load more click button functionality
$(document).on("click", '.posts-following-loadmore', function (e) {
    if (nextUrlAllPostsFollowing) {
        getAndPopulateFollowingPosts();
        e.stopPropagation();
    }
});

// element of dropdown with question/dicussion symbol, title and comments count
function createDiscussionElement(element) {
    return `<li data-id="${element['id']}" class="forum-nav-thread ${element['read'] ? '' : 'never-read'}" style="user-select: auto;">
                  <a href="/courses/${element['course_id']}/discussion/forum/course/threads/${element['id']}" class="forum-nav-thread-link" style="user-select: auto;">
                    <div class="forum-nav-thread-wrapper-0" style="user-select: auto;">
                      <span class="sr" style="user-select: auto;">unanswered question</span>
                      <span class="icon fa ${typeClassName(element['type'])}" aria-hidden="true" style="user-select: auto;"></span>
                    </div>
                    <div class="forum-nav-thread-wrapper-1" style="user-select: auto;">
                      <span class="forum-nav-thread-title" style="user-select: auto;">${element['title']}</span>
                    </div>
                    <div class="forum-nav-thread-wrapper-2" style="user-select: auto;">
                      <span class="forum-nav-thread-votes-count" style="display: none; user-select: auto;">
                        +0<span class="sr" style="user-select: auto;"> votes </span>
                      </span>
                      <span class="forum-nav-thread-comments-count" style="display: inline-block; user-select: auto;">
                        ${element['comment_count']}<span class="sr" style="user-select: auto;">comments </span>
                      </span>
                    </div>
                  </a>
                </li>`;
}

// generic load more element with className
function loadMoreButtonElement(className) {
    return `<li class="forum-nav-thread" style="user-select: auto;">
                <a id="cz-loadmore" href="#" class="forum-nav-thread-link ${className}">load more</a>
            </li>`;
}

// icon type for element of dropdown
function typeClassName(type) {
    if (type === 'question') {
        return 'fa-question';
    } else if (type === 'discussion') {
        return 'fa-comment';
    }
}

function delNoPostsElement() {
    $('#ca-no-posts').remove();
}


$(window).on('load', function () {
    getAndPopulateAllDiscussions();
    getAndPopulateFollowingPosts();
    getAllTopics();
});

function reLoadDropDowns() {
    nextUrlAllDiscussions = colarazDiscussionAllThreadsUrl;
    nextUrlAllPostsFollowing = colarazFollowingPostsUrl;

    setTimeout(function () {
        getAndPopulateAllDiscussions(true);
        getAndPopulateFollowingPosts(true);
        getAllTopics(true);
    }, 2000);
}

$(document).on('click', '.forum-new-post-form .submit', function () {
    reLoadDropDowns();
});