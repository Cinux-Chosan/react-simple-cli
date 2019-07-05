module.exports = class {
    apply(compiler) {
        compiler.hooks.compilation.tap('MyPlugin', (compilation, entry) => {
            compilation.hooks.dependencyReference.tap('aa', (depRef, dependency, module) => {

            })
        });
    }
}