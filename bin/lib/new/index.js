const childProcess = require('child_process')
const fs = require('fs-extra')
const { parseCode, startOra, logger } = require('../utils')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const t = require('@babel/types')
const path = require('path')

module.exports = function (argv) {
    const dest = argv._[1]
    // 检查项目目录是否存在，如果存在则不初始化
    if (fs.pathExistsSync(path.resolve(dest))) {
        return logger.error('无法初始化项目，目录已存在！')
    }
    const startCloneOra = logger.info('项目初始化中，请稍等...')
    const cp = childProcess.spawn('git', ['clone', 'git@github.com:Cinux-Chosan/simple-cli-app.git', dest])
    cp.on('exit', async (code) => {
        if (code) {
            fs.removeSync(path.resolve(dest))
            logger.error(`初始化项目失败，错误代码: ${code}`)
        } else {
            updateProjName(dest)
            await initGit(dest)
            startCloneOra.succeed('项目初始化成功')
        }
    })
}

// 更新项目 package.json 中 name 为项目名
function updateProjName(dest) {
    const filePath = path.resolve(dest, 'package.json')
    const source = fs.readFileSync(filePath)
    const ast = parseCode(`export default ${source}`, { sourceType: 'module' })
    let exportsNode = null
    traverse(ast, {
        ExportDefaultDeclaration(path) {
            exportsNode = path.node.declaration
        }
    })
    const nameProp = exportsNode.properties.filter(prop => prop.key.value === 'name')
    if (nameProp.length) {
        nameProp.forEach(prop => prop.value.value = dest)
    } else {
        exportsNode.properties.unshift(t.objectProperty(t.stringLiteral('name'), t.stringLiteral(dest)))
    }

    fs.writeFileSync(filePath, generator(exportsNode).code)
}

function initGit(dest) {
    return new Promise((res, rej) => {
        fs.remove(path.resolve(dest, '.git/'), (err) => {
            if (!err) {
                childProcess.spawn('git', ['init'])
                res(err)
            } else {
                rej()
            }
        })
    })
}