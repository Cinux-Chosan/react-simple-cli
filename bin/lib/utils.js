const fs = require('fs-extra')
const ora = require('ora')
const path = require('path')
const chalk = require('chalk')
const babelParser = require('@babel/parser')
const Handlebars = require('./handlebar')

function getSource(fileName, sourceDir = path.resolve(__dirname, '../templates')) {
    return fs.readFileSync(path.resolve(sourceDir, fileName), 'utf8').toString()
}

function writeSource(fileName, source) {
    fs.outputFile(fileName, source)
}

function getCompileResult(fileName, context) {
    return Handlebars.compile(getSource(fileName))(context)
}

function removePath(path) {
    fs.remove(path)
}

function compileToDest(fileName, context, destPath) {
    const result = getCompileResult(fileName, context)
    return fs.outputFile(destPath, result)
}

const parseCode = (code, options) => {
    return babelParser.parse(code, options)
}

const startOra = msg => ora(chalk.red(msg)).start();

const TextColor = {
    succeed: (msg) => chalk.green(msg),
    error: (msg) => chalk.red(msg),
    info: (msg) => chalk.whiteBright(msg), 
    warn: (msg) => chalk.yellow(msg)
}

class Logger {
    warn(msg) {
        console.log(TextColor.warn(`Warning: ${msg}`)) 
    }
    error(msg) {
        console.log(TextColor.error(`Error: ${msg}`))
    }
    info(msg) {
        console.log(TextColor.info(`Info: ${msg}`))
    }
}

class Ora {
    constructor(msg) {
        this.ora = ora(TextColor.info(msg)).start()
    }

    info(msg) {
        this.ora.info(TextColor.info(msg))
    }

    succeed(msg) {
        this.ora.succeed(TextColor.succeed(msg))
    }

    warn(msg) {
        this.ora.warn(TextColor.warn(msg))
    }

    error(msg) {
        this.ora.error(TextColor.error(msg))
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
    Ora,
    TextColor,
    logger: new Logger
}