const path = require('path')
const traverse = require('@babel/traverse').default
const types = require('@babel/types')
const generator = require('@babel/generator').default
const { getSource, parseCode } = require('../utils')
const { findRoute } = require('./route.util')

const findRoutesProperty = (node) => {
    return node.properties.find(prop => prop.key.name === 'routes')
}

const createRoutesProperty = (node) => {
    const routesNode = types.ObjectProperty(
        types.identifier('routes'),
        types.arrayExpression()
    )
    node.properties.push(routesNode)
    return routesNode
}

class RouteProcesser {
    constructor(code) {
        // const source = getSource('routes.config.js', path.resolve('src/routes'))
        this.code = code
        this._parse()
        this._walk()
    }

    // 将代码转成 ast
    _parse() {
        const ast = parseCode(this.code, { sourceType: 'module', plugins: ["jsx"] })
        this.ast = ast
    }

    // 获取路由节点并保存
    _walk() {
        const { ast } = this
        traverse(ast, {
            ExportDefaultDeclaration: (path) => {
                const { node } = path.get('declaration')
                this.routesNode = node
            }
        })
    }

    add(routeName = '') {
        this._add(routeName.split('/'), this.routesNode)
    }

    _add(routeParts, routes) {
        const parentName = routeParts[0]
        const children = routeParts.slice(1)
        const [ parentNode ] = findRoute(parentName, routes)
        if (parentNode) {
            // 找到父级 route
            let routesPropertyNode = findRoutesProperty(parentNode)
            if (!routesPropertyNode) {
                // 创建一个 routes 添加到 ast 中
                routesPropertyNode = createRoutesProperty(parentNode)
            }
        } else {
            // 没有找到父级，创建一个对象
        }
        if (children.length) {
            this._add(children, )
        }
    }

}

module.exports = RouteProcesser