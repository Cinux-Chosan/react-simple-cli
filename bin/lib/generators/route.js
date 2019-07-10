const path = require('path')
const generator = require('@babel/generator').default
const RouteProcessor = require('./route.processor')
const { compileToDest, getSource, writeSource } = require('../utils')
const prettier = require('prettier')

module.exports = function (argv) {
    updateRouteConfig(argv)
}

function updateRouteConfig (argv) {
    // 更新 routes.config.js
    const code = getSource('routes.config.js', path.resolve('src/routes'))
    const routeProcessor = new RouteProcessor(code, argv)
    const routeAst = routeProcessor.add(argv.name)
    writeSource(path.resolve('src/routes/routes.config.js'), prettier.format(generator(routeAst).code, { singleQuote: true }))
}