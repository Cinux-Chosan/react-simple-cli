const childProcess = require('child_process')
const fs = require('fs-extra')
const path = require('path')

module.exports = function (argv) {
    const dest = argv._[1]
    
    const cp = childProcess.spawn('git', ['clone', 'git@github.com:Cinux-Chosan/simple-cli-app.git', dest])
    cp.on('exit', (code) => {
        if (code) {
            console.log(`初始化项目失败，错误代码: ${code}`)
        } else {
            const packagePath = path.resolve(dest, 'package.json')
            const packgeJson = fs.readJsonSync(packagePath)
            packgeJson.name = dest
            fs.writeJSONSync(packagePath, packgeJson, { spaces: '\t' })
            fs.remove(path.resolve(dest, '.git/'))
            console.log(`初始化 ${dest} 成功`)
        }
    })
}