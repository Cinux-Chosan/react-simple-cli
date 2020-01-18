const Handlebars = require('handlebars')
const inflection = require('inflection');
const path = require('path')

// alias inflection.capitalize
Handlebars.registerHelper('capitalize', (str) => {
    return inflection.capitalize(str)
})

Handlebars.registerHelper('getPathName', (str) => {
    const paths = path.normalize(str).split(path.sep)
    let last = paths[paths.length - 1]
    last = last.match(/^[^a-zA-Z_$]+/) ? `Comp_${last}` : last
    return paths ? last : 'InvalidName'
})

module.exports = Handlebars