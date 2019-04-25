/*!
 * 分类模块控制器
 */
var Category = require('../models/category')

/**
 * 后台 分类列表
 */
exports.list = (req, res) => {
    Category
        .find({})
        .populate('movie')
        .exec(function(err, categories) {

        if(err) console.error(err)

        res.render('admin-category-list', {
            title: 'Admin - Category List',
            categories: categories
        })
    })
}

/**
 * 后台 分类录入页
 */
exports.newPage = (req, res) => {
    res.render('admin-category-new', {
        title: 'Admin - Add New Category',
        category: {
            name: ''
        }
    })
}

/**
 * 后台 新增分类
 */
exports.save = (req, res) => {
    var _category = req.body.category

    var newCategory = new Category(_category)

    newCategory.save((err, data) => {
        if(err) console.log(err)

        res.redirect('/admin/category/list')
    })
}