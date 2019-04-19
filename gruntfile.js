/**

module.exports = function(grunt) {
    // 初始化grunt配置，定义一些任务
    grunt.initConfig({
        // 添加对文件的增删改的监控，有改动则自动运行grunt任务
        watch: {
            jade: {
                files: ['views/**'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['public/js/**', 'modules/**/*.js', 'schema/*/*.js'],
                options: {
                    livereload: true
                }
            }
        },
        // 实时监控app.js并重启
        nodemon: {
            dev: {
                options: {
                    args: [],
                    ignore: ['README.md', 'node_modules/**', 'DS_Store'],
                    ext: 'js',
                    watch: ['./'],
                    nodeArgs: ['--debug'],
                    delay: 1000,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        }
    })

    // 加载一些task任务
    // 1. 添加对文件的增删改的监控，有改动则自动运行grunt任务
    grunt.loadNpmTasks('grunt-contrib-watch')
    // 2. 实时监控app.js并重启
    grunt.loadNpmTasks('grunt-nodemon')
    // 3. 优化耗时较多的任务的插件
    grunt.loadNpmTasks('grunt-concurrent')

    // 防止有错误时终止grunt服务
    grunt.option('focus', true)
    // 注册默认的任务
    grunt.registerTask('default', ['concurrent'])
}


 */