const path = require('path')
const RouteProcessor = require('./route.processor')
const { compileToDest, getSource } = require('../utils')

module.exports = function (argv) {
    updateRouteConfig(argv)
    const destPath = path.resolve('src/pages', argv.name)
    compileToDest('component.hbs', argv, path.resolve(destPath, 'index.jsx'))
    compileToDest('reducer.hbs', argv, path.resolve(destPath, 'reducer.js'))
    compileToDest('saga.hbs', argv, path.resolve(destPath, 'saga.js'))
    compileToDest('style.hbs', argv, path.resolve(destPath, 'style.less'))
    compileToDest('action.types.hbs', argv, path.resolve(destPath, 'action.types.js'))
}

function updateRouteConfig (argv) {
    // 更新 routes.config.js
    const code = getSource('routes.config.js', path.resolve('src/routes'))
    const routeProcessor = new RouteProcessor(code)
    routeProcessor.add(argv.name)
}