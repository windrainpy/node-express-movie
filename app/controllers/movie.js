/*!
 * 电影模块控制器
 */
var _ = require('underscore')
var Movie = require('../models/movie')
var Comment = require('../models/comment')

/**
 * 详情页
 */
exports.detail = (req, res) => {
    var id = req.params.id
    Movie.findById(id, (err, movie) => {
        if(err) console.error(err)

        Comment
            .find({movie: id})
            .populate('from', 'name')
            .populate('reply.from', 'name')
            .populate('reply.to', 'name')
            .exec((err, comments) => {
                if(err) console.log(err)

                res.render('detail', {
                    title: 'Movie Detail',
                    movie: movie,
                    comments
                })
            })
    })
}

/**
 * 后台 新增电影页
 */
exports.new = (req, res) => {
    res.render('admin-movie-new', {
        title: 'Admin - Add New Movie',
        movie: {
            title: "",
            year: "",
            doctory: "",
            country: "",
            poster: "",
            language: "",
            flash: "",
            summary: "",
        }
    })
}

/**
 * 后台 新增电影页
 */
exports.update = (req, res) => {
    var id = req.params.id

    Movie.findById(id, (err, movie) => {
        if(err) console.error(err)

        res.render('admin-movie-new', {
            title: 'admin - Update Movie',
            movie: movie
        })
    })
}

/**
 * 后台 录入电影
 */
exports.save = (req, res) => {
    var newMovie = req.body.movie
    var id = newMovie._id

    // 修改
    if (id !== 'undefined') {
        Movie.findById({_id: id}, (err, movie) => {
            if(err) console.error(err)

            var _movie = _.extend(movie, newMovie)
            _movie.save((err, movie) => {
                if(err) console.log(err)

                res.redirect(`/admin/movie/list`)
            })
        })
    }
    // 新增
    else {
        var _movie = new Movie({
            title: newMovie.title,
            year: newMovie.year,
            doctory: newMovie.doctory,
            country: newMovie.country,
            poster: newMovie.poster,
            language: newMovie.language,
            flash: newMovie.flash,
            summary: newMovie.summary,
        })
        _movie.save((err, movie) => {
            if(err) console.log(err)

            res.redirect(`/admin/movie/list`)
        })
    }
}

/**
 * 后台 删除电影
 */
exports.delete = (req, res) => {
    var id = req.query.id

    Movie.remove({_id: id}, (err, result) => {
        if(err) console.error(err)

        res.json({success: 1})
    })
}

/**
 * 后台 列表
 */
exports.list = (req, res) => {
    Movie.fetch(function(err, movies) {
        if(err) console.error(err)

        res.render('admin-movie-list', {
            title: 'Admin - Movie List',
            movies: movies
        })
    })
}