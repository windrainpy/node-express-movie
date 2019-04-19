/*!
 * 用户模块控制器
 */
var User = require('../models/user')

/**
 * 后台 用户列表
 */
exports.list = (req, res) => {
    var users = User.find({}, (err, users) => {
        if(err) console.log(err)

        res.render('admin-user-list', {
            title: 'Admin - User List',
            users: users
        })
    })
}

/**
 * 注册页面
 */
exports.signupPage = (req, res) => {
    res.render('signup', {
        title: '注册'
    })
}

/**
 * 登录页面
 */
exports.loginPage = (req, res) => {
    res.render('login', {
        title: '登录'
    })
}

/**
 * 注册处理
 */
exports.signup = (req, res) => {
    var _user = req.body.user

    User.findOne({name: _user.name}, (err, user) => {
        if(err) console.log(err)

        // user name已经存在
        if(user) {
            res.redirect('/login')
        }
        // 保存新用户
        else {
            var newUser = new User(_user)

            newUser.save(function(err, user2) {
                if(err) console.log(err)
                
                res.redirect('/login')
            })
        }
    })
}

/**
 * 登录处理
 */
exports.login = (req, res) => {
    var _user = req.body.user
    var name = _user.name
    var password = _user.password

    User.findOne({name: _user.name}, (err, user) => {
        if(err) console.log(err)

        if(user) {
            user.comparePassword(password, (err, isMatch) => {
                if(err) console.log(err)

                if(isMatch) {
                    // 登录状态持久化
                    req.session.user = user
                    console.log('登录成功', user)
                    res.redirect('/')
                } else {
                    console.log('登录失败')
                    res.redirect('/login')
                }
            })
        } else {
            res.redirect('/login')
        }
    })
}

/**
 * 登出
 */
exports.logout = (req, res) => {
    delete req.session.user
    // delete app.locals.user //app哪来??
    res.redirect('/')
}

exports.delete = (req, res) => {
    var id = req.query.id

    User.remove({_id: id}, (err, data) => {
        if(err) console.log(err)

        res.json({success: 1})
    })
}

// 登录验证中间件
exports.loginRequired = (req, res, next) => {
    var user = req.session.user

    if(!user) {
        res.redirect('/login')
    }
    next()
}

// 管理员验证中间件
exports.adminRequired = (req, res, next) => {
    var user = req.session.user

    if(user.role < 10) {
        res.redirect('/login')
    }
    next()
}
