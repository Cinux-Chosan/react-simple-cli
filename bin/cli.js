#!/usr/bin/env node

// Simple React CLI
const argv = require('minimist')(process.argv.slice(2))
const path = require('path')
const { logger } = require('./lib/utils')
const cmd = argv._[0]

function checkCwd() {
    try {
        require(path.resolve(process.cwd(), 'package.json'))
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            return logger.error('请在项目根目录运行命令')
        }
    }
}

function run() {
    switch (cmd) {
        case 'g':
        case 'generate':
            checkCwd()
            require('./lib/generators')(argv)
            break
        case 'new':
            require('./lib/new')(argv)
            break
        default:
            if (argv.help) {
                logger.error('帮助文档暂未实现')
            } else {
                logger.error('参数错误，如需获取帮助请输入 ssr --help')
            }
            break
    }
}

run()