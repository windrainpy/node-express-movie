var Comment = require('../models/comment')

exports.addComment = (req, res) => {
    var params = req.body.comment
    var movieId = params.movie
    var commentId = params.commentId
    var toId = params.toId

    // 更贴
    if(commentId) {
        Comment.findById(commentId, (err, comment) => {
            if(err) console.log(err)

            var reply = {
                from: params.from,
                to: toId,
                content: params.content
            }
            comment.reply.push(reply)

            comment.save((err, data) => {
                if(err) console.log(err)

                console.log('跟帖成功', data)
                res.redirect(`/movie/${movieId}`)
            })
        })
    }
    // 正常回复
    else {
        var newComment = new Comment(params)
        newComment.save((err, data) => {
            if(err) console.log(err)

            res.redirect(`/movie/${movieId}`)
        })
    }
}