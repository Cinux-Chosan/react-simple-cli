const fs = require('fs-extra')
const path = require('path')
const Handlebars = require('./handlebar')
const babelParser = require('@babel/parser')

function getSource(fileName, sourceDir = path.resolve(__dirname, '../templates')) {
    return fs.readFileSync(path.resolve(sourceDir, fileName), 'utf8').toString()
}

function writeSource(fileName, source) {
    fs.outputFile(fileName, source)
}

function getCompileResult(fileName, argv) {
    return Handlebars.compile(getSource(fileName))(argv)
}

function compileToDest(fileName, argv, destPath) {
    const result = getCompileResult(fileName, argv)
    fs.outputFile(destPath, result)
}

const parseCode = (code, options) => {
    return babelParser.parse(code, options)
}

module.exports = {
    getSource,
    writeSource,
    getCompileResult,
    compileToDest,
    parseCode
}