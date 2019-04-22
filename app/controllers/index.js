/*!
 * 首页控制器
 */
var Category = require('../models/category')

/**
 * 首页 列表页
 */
exports.index = (req, res) => {
    Category
        .find({})
        .populate('movies')
        .exec((err, categories) => {
        
        if(err) console.log(err)

        res.render('index', {
            title: 'Movie Home',
            categories
        })
    })
}