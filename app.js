var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var _ = require('underscore')
var bodyParser = require('body-parser')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var mongoStore = require('connect-mongo')(session)

var port = process.env.PORT || 9000
var mongodbUrl = 'mongodb://localhost:27017/movie'
var app = express()

mongoose.connect(mongodbUrl)
var connect = mongoose.connection
connect.on('error', (err) => {
    console.log('mongodb连接失败: ', err)
})
connect.on('open', () => {
    console.log('Mongodb 连接成功', mongodbUrl)
})

console.log(111, process.env.NODE_ENV)

app.set('views', './views/pages')
app.set('view engine', 'jade')
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use(session({
    secret: 'movie',
    store: new mongoStore({
        url: mongodbUrl,
        collection: 'sessions'
    })
}))
app.locals.moment = require('moment')

require('./config/routes')(app)

app.listen(9000)
console.log(`Web app server is start at http://localhost:${port}`)