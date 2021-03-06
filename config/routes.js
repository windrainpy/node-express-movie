var multer = require('multer')
var Index = require('../app/controllers/index')
var Movie = require('../app/controllers/movie')
var User = require('../app/controllers/user')
var Comment = require('../app/controllers/comment')
var Category = require('../app/controllers/category')

module.exports = (app) => {
    // 预处理：把存user到locals的逻辑移出到所有请求里
    app.use((req, res, next) => {
        var user = req.session.user
        app.locals.user = user
        next()
    })

    var storage = multer.diskStorage({
        destination: function(req, file, cb) { // 保存路径
            cb(null, 'public/upload')
        },
        filename: function(req, file, cb) { // 保存的文件名
            var newFileName = Date.now() + file.originalname
            req.newFileName = newFileName
            cb(null, newFileName)
        }
    })
    var uploadHandler = multer({storage: storage})

    // 首页
    app.get('/', Index.index) 

    // 电影
    app.get('/movie/detail/:id', Movie.detail)
    app.get('/movie/search', Movie.search)

    // 用户
    app.get('/signup', User.signupPage)
    app.get('/login', User.loginPage)
    app.post('/user/signup', User.signup)
    app.post('/user/login', User.login)
    app.get('/logout', User.logout)
    app.post('/user/comment', User.loginRequired, Comment.addComment)

    // 后台管理 - 电影
    app.get('/admin/movie/new', User.loginRequired, User.adminRequired, Movie.newPage)
    app.get('/admin/movie/update/:id', User.loginRequired, User.adminRequired, Movie.update)
    app.post('/admin/movie/new', User.loginRequired, User.adminRequired, uploadHandler.single('uploadPoster'), Movie.save)
    app.delete('/admin/movie/delete', User.loginRequired, User.adminRequired, Movie.delete)
    app.get('/admin/movie/list', User.loginRequired, User.adminRequired, Movie.list)

    // 后台管理 - 用户
    app.get('/admin/user/list', User.loginRequired, User.adminRequired, User.list)
    app.delete('/admin/user/delete', User.loginRequired, User.adminRequired, User.delete)

    // 后台管理 - 分类
    app.get('/admin/category/list', User.loginRequired, User.adminRequired, Category.list)
    app.get('/admin/category/new', User.loginRequired, User.adminRequired, Category.newPage)
    app.post('/admin/category/save', User.loginRequired, User.adminRequired, Category.save)

}