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
    const { from = '', to = '', path = ''}
    switch (type) {
        case 'redirect':
            node = t.objectExpression([
                t.objectProperty('type', t.stringLiteral('redirect')),
                t.objectProperty('from', t.stringLiteral(from)),
                t.objectProperty('to', t.stringLiteral(to))
            ])
            break
        case 'switch':
            node = t.objectExpression([
                t.objectProperty('type', t.stringLiteral('switch')),
                t.objectProperty('routes', t.arrayExpression()),
            ])
            break
        default:
            node = t.objectExpression([
                t.objectProperty('path', t.stringLiteral(path)),
                t.objectProperty('routes', t.arrayExpression()),
                // t.objectProperty('component', t.arrayExpression()),
                
            ])
            break
    }
    return node
}


module.exports = {
    findRoute,
    createRouteNode
}