/*!
 * 电影模块控制器
 */
var _ = require('underscore')
var Movie = require('../models/movie')
var Comment = require('../models/comment')
var Category = require('../models/category')

/**
 * 后台 列表
 */
exports.list = (req, res) => {
    Movie
        .find({})
        .populate('category', 'name')
        .exec(function(err, movies) {

        if(err) console.error(err)

        res.render('admin-movie-list', {
            title: 'Admin - Movie List',
            movies: movies
        })
    })
}

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
exports.newPage = (req, res) => {
    Category.fetch((err, categories) => {
        if(err) consoloe.log(err)

        res.render('admin-movie-new', {
            title: 'Admin - Add New Movie',
            movie: {},
            categories
        })
    })
}

/**
 * 后台 新增电影页
 */
exports.update = (req, res) => {
    var id = req.params.id

    Movie.findById(id, (err, movie) => {
        if(err) console.error(err)

        Category.fetch((err, categories) => {

            res.render('admin-movie-new', {
                title: 'admin - Update Movie',
                movie: movie,
                categories: categories
            })
        })
    })
}

/**
 * 后台 录入电影
 */
exports.save = (req, res) => {
    var params = req.body.movie
    var id = params._id
    var categoryId= params.category
    var oldCategory = params.oldCategory
    var categoryName= params.categoryName
    var file = req.file

    //如果有上传本地海报，则文件存放在这个file变量里，具体实现看 Movie.uploadFile
    console.log('path: ', req.file)

    // 上传本地海报
    if(req.file) {
        params.poster = `/upload/${req.newFileName}`
    }

    // 修改
    if (id) {
        Movie.findById({_id: id}, (err, movie) => {
            if(err) console.error(err)

            var newMovie = _.extend(movie, params)

            newMovie.save((err, movie) => { //保存电影
                if(err) console.log(err)

                Category.findById(categoryId, (err, category) => { //把电影保存到分类下面
                    if (err) console.log(err)

                    var movies = category.movies

                    movies.push(movie._id)

                    category.save((err, category) => {
                        if (err) console.log(err)

                        if(oldCategory !== categoryId) { //把这部电影从之前的分类中剔除
                            Category.findById(oldCategory, (err, category) => {
                                var movies = category.movies
                                var index = movies.indexOf(oldCategory)
                                movies.splice(index, 1)
                                category.save((err, category) => {
                                    res.redirect(`/admin/movie/list`)
                                })
                            })
                        } else {
                            res.redirect(`/admin/movie/list`)
                        }
                    })
                })
            })
        })
    }
    // 新增
    else {
        var newMovie = new Movie(params)
        newMovie.save((err, movie) => {
            if(err) console.log(err)

            // 选择分类
            if(categoryId) {
                Category.findById(movie.category, (err, category) => {
                    if (err) console.log(err)

                    category.movies.push(movie._id)

                    category.save((err, category) => {
                        if (err) console.log(err)

                        res.redirect(`/admin/movie/list`)
                    })
                })
            }
            // 自定义分类
            else if(categoryName) {
                var newCategory = new Category({
                    name: categoryName,
                    movies: [movie._id]
                })

                newCategory.save((err, category) => {
                    res.redirect(`/admin/movie/list`)
                    
                    movie.category = category._id
                    movie.save((err, movie) => {
                        res.redirect(`/admin/movie/list`)
                    })
                })
            }
            else {
                res.redirect(`/admin/movie/list`)
            }
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
 * 搜索(带分页)
 */
exports.search = (req, res) => {
    var params = req.query
    var pageSize = 10
    var currentPage = parseInt(params.pageNum || 1)
    var index = pageSize * (currentPage - 1)

    // 按分类搜索
    if(params.category) {
        Category
            .find({_id: params.category})
            .populate({
                path: 'movies',
                select: 'title poster'
            })
            .exec((err, categories) => {

            var category = categories[0] || {}
            var movies = category.movies || []
            var results = movies.slice(index, index + pageSize)

            res.render('movie-search', {
                title: 'Movie Search Result',
                query: {
                    keyword: '',
                    categoryName: category.name,
                    categoryId: category._id,
                },
                movies: results,
                currentPage: currentPage,
                totalPage: Math.ceil(movies.length / pageSize),
                totalNum: movies.length,
            })
        })
    }
    // 按关键字搜索
    else {
        Movie
            .find({title: new RegExp(params.keyword + '.*', 'i')})
            .exec((err, movies) => {

            var results = movies.slice(index, index + pageSize)

            res.render('movie-search', {
                title: 'Movie Search Result',
                query: {
                    keyword: params.keyword,
                },
                movies: results,
                currentPage: currentPage,
                totalPage: Math.ceil(movies.length / pageSize),
                totalNum: movies.length,
            })
        })
    }

}
