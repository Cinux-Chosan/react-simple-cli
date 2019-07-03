const Handlebars = require('handlebars')
const inflection = require('inflection');
const path = require('path')

// alias inflection.capitalize
Handlebars.registerHelper('capitalize', (str) => {
    return inflection.capitalize(str)
})

Handlebars.registerHelper('getPathName', (str) => {
    const paths = path.normalize(str).split(path.sep)
    return paths ? paths[paths.length - 1] : 'InvalidName'
})

module.exports = Handlebars