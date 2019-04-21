var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var SALT_WORK_FACTOR = 10

var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    password: String,
    // 0: 普通用户
    // 1：邮件验证通过的用户
    // 2：专业的用户
    // >10：admin
    // >50：super admin
    role: {
        type: Number,
        default: 0
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

UserSchema.pre('save', function(next) {
    var user = this

    if(this.isNew) {
        this.meta.updateAt = this.meta.createAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if(err) next(err)

        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) next(err)

            user.password = hash
            next()
        })
    })
})

// 实例方法，每个文档实例都有该方法
UserSchema.methods = {
    comparePassword: function(_password, cb) {
        bcrypt.compare(_password, this.password, (err, isMatch) => {
            if(err) return cb(err)

            cb(null, isMatch) //把第一个参数的error设为null
        })
    }
}

// 静态方法
UserSchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function(id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    }
}

module.exports = UserSchema