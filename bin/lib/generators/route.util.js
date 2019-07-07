const path = require('path')
const traverse = require('@babel/traverse').default
const t = require('@babel/types')
const generator = require('@babel/generator').default
const { getSource, parseCode } = require('../utils')

const findRoute = (routeName, node) => {
    const nodePaths = []
    traverse(node, {
        ObjectProperty(path) {
            const { node, parent } = path
            if (node.key.name === 'path' && node.value.value === routeName) {
                nodePaths.push(parent)
            }
        }
    })
    return nodePaths
}



const createRouteNode = (type, options = {}) => {
    let node = null
    const { from = '', to = '', path = '', assetsPath = '' } = options
    switch (type) {
        case 'redirect':
            node = t.objectExpression([
                t.objectProperty(t.identifier('type'), t.stringLiteral('redirect')),
                t.objectProperty(t.identifier('from'), t.stringLiteral(from)),
                t.objectProperty(t.identifier('to'), t.stringLiteral(to))
            ])
            break
        case 'switch':
            node = t.objectExpression([
                t.objectProperty(t.identifier('type'), t.stringLiteral('switch')),
                t.objectProperty(t.identifier('routes'), t.arrayExpression()),
            ])
            break
        case 'route':
        default:
            // create route
            node = t.objectExpression([
                t.objectProperty(t.identifier('type'), t.stringLiteral('route')),
                t.objectProperty(t.identifier('path'), t.stringLiteral(path)),
                t.objectProperty(t.identifier('component'), t.arrowFunctionExpression([], t.callExpression(
                    t.identifier('import'),
                    [t.stringLiteral(assetsPath)]
                ))),
                t.objectProperty(t.identifier('routes'), t.arrayExpression()),
            ])
            break
    }
    return node
}


module.exports = {
    findRoute,
    createRouteNode
}