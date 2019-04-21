$(function() {
    $('.btn-reply').click(function() {
        var toId = $(this).data('toid')
        var commentId = $(this).data('commentid')

        if($('#toIdInput').length) {
            $('#toIdInput').val(toId)
        } else {
            var toIdInput = $(`<input type="hidden" id="toIdInput" name="comment[toId]" value="${toId}">`)
            $('#comment_form').append(toIdInput)
        }

        if($('#commentIdInput').length) {
            $('#commentIdInput').val(commentId)
        } else {
            var commentIdInput = $(`<input type="hidden" id="commentIdInput" name="comment[commentId]" value="${commentId}">`)
            $('#comment_form').append(commentIdInput)
        }

        $('#commentInput').focus()
        return false
    })
})