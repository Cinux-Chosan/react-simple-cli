const { compileToDest, TextColor } = require('../utils')
const path = require('path')
const ora = require('ora')

module.exports = async function (argv) {
    const compName = argv.name
    const args = { ...argv, isComponent: true }
    const gComponentOra = ora(TextColor.info(`正在创建组件 ${compName}，请稍等...`)).start()
    let destDir = ''
    if (compName.split('/').length > 1) {
        destDir = path.resolve('src/pages', compName)
    } else {
        destDir = path.resolve('src/components', compName)
    }
    try {
        await Promise.all([
            compileToDest('component.hbs', args, path.resolve(destDir, 'index.jsx')),
            compileToDest('style.hbs', args, path.resolve(destDir, 'style.less'))
        ])
        gComponentOra.succeed(TextColor.succeed(`组件 ${compName} 创建成功！`))
    } catch (error) {
        removePath(path.resolve(destDir, 'index.jsx'))
        removePath(path.resolve(destDir, 'style.less'))
        gComponentOra.fail(TextColor.error(`创建组件失败，已回退！`))
    }
}