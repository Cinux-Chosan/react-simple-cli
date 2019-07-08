const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const Handlebars = require('./handlebar')
const babelParser = require('@babel/parser')
const ora = require('ora')

function getSource(fileName, sourceDir = path.resolve(__dirname, '../templates')) {
    return fs.readFileSync(path.resolve(sourceDir, fileName), 'utf8').toString()
}

function writeSource(fileName, source) {
    fs.outputFile(fileName, source)
}

function getCompileResult(fileName, argv) {
    return Handlebars.compile(getSource(fileName))(argv)
}

function removePath(path) {
    fs.remove(path)
}

function compileToDest(fileName, argv, destPath) {
    const result = getCompileResult(fileName, argv)
    return fs.outputFile(destPath, result)
}

const parseCode = (code, options) => {
    return babelParser.parse(code, options)
}

const startOra = msg => ora(chalk.red(msg)).start();

class Logger {
    warn(msg) {
        console.log(chalk.yellow(`Warning: ${msg}\n`)) 
    }
    error(msg) {
        console.log(chalk.red(`Error: ${msg}\n`))
    }
    info(msg) {
        console.log(chalk.whiteBright(`Info: ${msg}\n`))
    }
}

class TextColor {
    succeed(msg) {
        return chalk.green(msg)
    }
    error(msg) {
        return chalk.red(msg)
    }
    info(msg) {
        return chalk.whiteBright(msg)
    } 
    warn(msg) {
        return chalk.yellow(msg)
    }
}


module.exports = {
    getSource,
    writeSource,
    getCompileResult,
    compileToDest,
    parseCode,
    startOra,
    removePath,
    Logger,
    textColor: new TextColor,
    logger: new Logger
}