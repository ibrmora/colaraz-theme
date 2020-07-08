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
