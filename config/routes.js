var Index = require('../app/controllers/index')
var Movie = require('../app/controllers/movie')
var User = require('../app/controllers/user')

module.exports = (app) => {

    // 预处理：把存user到locals的逻辑移出到所有请求里
    app.use((req, res, next) => {
        var user = req.session.user
        app.locals.user = user
        next()
    })

    // 首页
    app.get('/', Index.index)

    // 电影
    app.get('/movie/:id', Movie.detail)

    // 用户
    app.get('/signup', User.signupPage)
    app.get('/login', User.loginPage)
    app.post('/user/signup', User.signup)
    app.post('/user/login', User.login)
    app.get('/logout', User.logout)

    // 后台管理 - 电影
    app.get('/admin/movie/new', Movie.new)
    app.get('/admin/movie/update/:id', Movie.update)
    app.post('/admin/movie/new', Movie.save)
    app.delete('/admin/movie/delete', Movie.delete)
    app.get('/admin/movie/list', Movie.list)

    // 后台管理 - 用户
    app.get('/admin/user/list', User.list)
    app.delete('/admin/user/delete', User.delete)

}