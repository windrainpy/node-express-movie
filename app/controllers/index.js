/*!
 * 首页控制器
 */
var Movie = require('../models/movie')

/**
 * 首页 列表页
 */
exports.index = (req, res) => {
    Movie.fetch((err, movies) => {
        if(err) console.error(err)

        res.render('index', {
            title: 'Movie Home',
            movies: movies
        })
    })
}