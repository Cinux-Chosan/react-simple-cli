const glob = require('glob')

const pageReducers = glob.sync('src/pages/**/reducer.js', { absolute: true })
const pageSagas = glob.sync('src/pages/**/saga.js', { absolute: true })

module.exports = function (source) {
    const { rootReducerPath, rootSagaPath } = this.query
    switch (this.resourcePath) {
        case rootReducerPath:
            return pageReducers.reduce((prev, next) => `${prev}export * from "${next}"\n`, '')
        case rootSagaPath:
            let sagaImports = ''
            let yiledImports = ''
            pageSagas.forEach((saga, index) => {
                const importName = `_${index}`
                sagaImports += `import ${importName} from "${saga}"\n`
                yiledImports += `yield * ${importName}()\n`
            })
            return `
                ${sagaImports}
                export default function * rootSaga() {
                    ${yiledImports}
                }
            `
        default:
            return source
    }
}