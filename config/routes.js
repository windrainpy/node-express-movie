var Movie = require('../models/movie')
var User = require('../models/user')

module.exports = (app) => {

    // 预处理：把存user到locals的逻辑移出到所有请求里
    app.use((req, res, next) => {
        var user = req.session.user
        if(user) {
            app.locals.user = user
        }
        next()
    })

    /**
     * 首页 列表页
     */
    app.get('/', (req, res) => {
        Movie.fetch((err, movies) => {
            if(err) console.error(err)

            res.render('index', {
                title: 'Movie Home',
                movies: movies
            })
        })
    })

    /**
     * 详情页
     */
    app.get('/movie/:id', (req, res) => {
        var id = req.params.id
        Movie.findById(id, (err, movie) => {
            if(err) console.error(err)

            res.render('detail', {
                title: 'Movie Detail',
                movie: movie
            })
        })
    })

    /**
     * 后台 新增电影页
     */
    app.get('/admin/movie/new', (req, res) => {
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
    })

    /**
     * 后台 新增电影页
     */
    app.get('/admin/movie/update/:id', (req, res) => {
        var id = req.params.id

        Movie.findById(id, (err, movie) => {
            if(err) console.error(err)

            res.render('admin-movie-new', {
                title: 'admin - Update Movie',
                movie: movie
            })
        })
    })

    /**
     * 后台 录入电影
     */
    app.post('/admin/movie/new', (req, res) => {
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
    })

    /**
     * 后台 删除电影
     */
    app.delete('/admin/movie/delete', (req, res) => {
        var id = req.query.id

        Movie.remove({_id: id}, (err, result) => {
            if(err) console.error(err)

            res.json({success: 1})
        })
    })

    /**
     * 后台 列表
     */
    app.get('/admin/movie/list', (req, res) => {
        Movie.fetch(function(err, movies) {
            if(err) console.error(err)

            res.render('admin-movie-list', {
                title: 'Admin - Movie List',
                movies: movies
            })
        })
    })

    /**
     * 后台 用户列表
     */
    app.get('/admin/user/list', (req, res) => {
        var users = User.find({}, (err, users) => {
            if(err) console.log(err)

            res.render('admin-user-list', {
                title: 'Admin - User List',
                users: users
            })
        })
    })

    /**
     * 注册
     */
    app.post('/user/signup', (req, res) => {
        var _user = req.body.user

        User.findOne({name: _user.name}, (err, user) => {
            if(err) console.log(err)

            // user name已经存在
            if(user) {
                res.redirect('/')
            }
            // 保存新用户
            else {
                var newUser = new User(_user)

                newUser.save(function(err, user2) {
                    if(err) console.log(err)
                    
                    res.redirect('/admin/user/list')
                })
            }
        })
    })

    /**
     * 登录
     */
    app.post('/user/login', (req, res) => {
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
                        res.redirect('/')
                    }
                })
            } else {
                res.redirect('/')
            }
        })
    })

    /**
     * 登出
     */
    app.get('/logout', (req, res) => {
        delete req.session.user
        delete app.locals.user
        res.redirect('/')
    })

}