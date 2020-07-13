$(document).on('click', 'button.action-vote', function(event) {

    if ($(this).closest('article.discussion-article').length <= 0) {
      return;
    }

    let isVotingDisabled = $(this).closest('li.actions-item').hasClass('is-disabled');

    if (isVotingDisabled) {
      console.log('Voting is disabled. An author can\'t vote his own post or comment.');
      return;
    }

    let voteType = '';
    if ($(this).attr('aria-checked') == 'true') {
      voteType = 'unvote';
    } else {
      voteType = 'upvote';
    }
    castVote(this, voteType);
});


function castVote(currentElement, voteType) {
    let threadID = $(currentElement).closest('article.discussion-article').attr('data-id')
    let threadVoteUrl = 'courses/${course.id}/discussion/threads/' + threadID + '/' + voteType + '?ajax=1';

    $.ajax({
        type: 'POST',
        url: threadVoteUrl,
        success: function (data) {
            if (voteType == 'upvote') {
                $(currentElement).attr('aria-checked', 'true');
            } else {
                $(currentElement).attr('aria-checked', 'false');
            }

            let outputString = '';
            if (data.votes.up_count != 1) {
                outputString = data.votes.up_count + ' Votes';
            } else {
                outputString = '1 Vote';
            }

            $(currentElement)
            .find('span.vote-count')
            .html(outputString);
        },

        error: function (error) {
            console.error(error);
        }
    });
}


$(document).on('click', 'button.action-follow', function(event) {
    let subscriptionStatus = $(this).attr('aria-checked') == 'true' ? 'unfollow' : 'follow';
    togglePostFollowing(this, subscriptionStatus);
});


function togglePostFollowing(currentElement, subscriptionStatus) {
    let threadID = $(currentElement).closest('article.discussion-article').attr('data-id');
    let threadVoteUrl = 'courses/${course.id}/discussion/threads/' + threadID + '/' + subscriptionStatus + '?ajax=1';

    $.ajax({
        type: 'POST',
        url: threadVoteUrl,
        success: function () {
            if (subscriptionStatus == 'follow') {
                $(currentElement).attr('aria-checked', 'true');
            } else {
                $(currentElement).attr('aria-checked', 'false');
            }
            $(currentElement).toggleClass('is-checked');
            rePopulatePostsFollowingList(threadID, subscriptionStatus);
        },

        error: function (error) {
            console.error(error);
        }
    });
}


function rePopulatePostsFollowingList(threadID, subscriptionStatus) {
    let selector = '#posts-following-main li[data-id="' + threadID + '"]';

    // Don't fetch data from API, if it is already present in the list.
    if ($(selector).length == 1) {
        if (subscriptionStatus == 'follow') {
            $(selector).css('display', 'block');
            delNoPostsElement();
        } else {
            $(selector).css('display', 'none');
        }

        if ($('#posts-following-main li').length == 1 && $(selector).css('display') == 'none') {
            $('#posts-following-main').append(noPostsElementAdd());
        }

    } else {
        getSingleThread(threadID);
    }
}


function getSingleThread(threadID) {
    let singleThreadUrl = colarazSinglePostUrl;
    singleThreadUrl = singleThreadUrl.replace('WILL_BE_POPULATED', threadID);
    $.ajax({
        type: 'GET',
        url: singleThreadUrl,
        success: function(data) {
            let element = createDiscussionElement(data);
            $('#posts-following-main').prepend(element);
            delNoPostsElement();
        },
        error: function(error) {
            console.error(error);
        }
    });
}
