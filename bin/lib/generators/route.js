const path = require('path')
const { compileToDest } = require('../utils')

module.exports = function (argv) {
    const destPath = path.resolve('src/pages', argv.name)
    compileToDest('component.hbs', argv, path.resolve(destPath, 'index.jsx'))
    compileToDest('reducer.hbs', argv, path.resolve(destPath, 'reducer.js'))
    compileToDest('saga.hbs', argv, path.resolve(destPath, 'saga.js'))
    compileToDest('style.hbs', argv, path.resolve(destPath, 'style.less'))
    compileToDest('action.types.hbs', argv, path.resolve(destPath, 'action.types.js'))
}

function updateRouteConfig () {
    // 更新 routes.config.js
    // const config = require(path.resolve('src/routes/routes.config.js'))
}