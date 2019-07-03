const { compileToDest } = require('../utils')
const path = require('path')

module.exports = function (argv) {
    const destDir = `src/components/${argv.name}/`
    compileToDest('component.hbs', argv, path.resolve(destDir, 'index.jsx'))
    compileToDest('style.hbs', argv, path.resolve(destDir, 'style.less'))
}