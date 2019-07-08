const { compileToDest, textColor } = require('../utils')
const path = require('path')
const ora = require('ora')

module.exports = async function (argv) {
    const compName = argv.name
    const gComponentOra = ora(textColor.info(`正在创建组件 ${compName}，请稍等...`)).start()
    const destDir = `src/components/${compName}/`
    try {
        await Promise.all([
            compileToDest('component.hbs', argv, path.resolve(destDir, 'index.jsx')),
            compileToDest('style.hbs', argv, path.resolve(destDir, 'style.less'))
        ])
        gComponentOra.succeed(textColor.succeed(`组件 ${compName} 创建成功！`))
    } catch (error) {
        removePath(path.resolve(destDir, 'index.jsx'))
        removePath(path.resolve(destDir, 'style.less'))
        gComponentOra.fail(textColor.error(`创建组件失败，已回退！`))
    }
}