const fs = require('fs-extra')
const path = require('path')
const Handlebars = require('./handlebar')

function getSource(fileName, sourceDir = path.resolve(__dirname, '../templates')) {
    return fs.readFileSync(path.resolve(sourceDir, fileName), 'utf8').toString()
}

function getCompileResult(fileName, argv) {
    return Handlebars.compile(getSource(fileName))(argv)
}

function compileToDest(fileName, argv, destPath) {
    const result = getCompileResult(fileName, argv)
    fs.outputFile(destPath, result)
}

module.exports = {
    getSource,
    getCompileResult,
    compileToDest
}