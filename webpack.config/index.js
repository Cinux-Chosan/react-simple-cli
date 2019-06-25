const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const devConfig = require('./webpack.config.dev')
const prodConfig = require('./webpack.config.prod')

module.exports = (env, argv) => merge.smart(baseConfig, argv.mode === 'development' ? devConfig : prodConfig) 
