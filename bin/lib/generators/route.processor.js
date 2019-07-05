const path = require('path')
const traverse = require('@babel/traverse').default
const t = require('@babel/types')
const generator = require('@babel/generator').default
const { getSource, parseCode } = require('../utils')
const { findRoute, createRouteNode } = require('./route.util')

const findRoutesProperty = (node) => {
    return node.properties.find(prop => prop.key.name === 'routes')
}

const createRoutesProperty = (node) => {
    const routesNode = t.ObjectProperty(
        t.identifier('routes'),
        t.arrayExpression()
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
        this._checkTopRoute()
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
                this.routesMapNode = node
            }
        })
    }

    // 判断节点是否是 route 
    _isRoute(objNode) {
        const typeNode = this._getObjNodeProperty(objNode, 'type')
        return !typeNode || (t.isStringLiteral(typeNode.value) && !typeNode.value || typeNode.value === 'route')
    }

    add(routeName = '', componentPath) {
        const { routesMapNode } = this
        this._add(routeName.split('/'), routesMapNode, componentPath)
    }

    _checkEmptyObject(objNode) {
        if (objNode.properties.length) {
            this.routesMapNode = createRouteNode('switch')
        }
    }

    _findRoute(path, rootObjNode) {
        const typePropNode = this._getObjNodeProperty(rootObjNode, 'type')
        if (typePropNode.value.value === 'switch') {
            // 如果是 switch 类型的节点，则对 routes 中的每一项进行比对
            const routesPropNode = this._getObjNodeProperty(rootObjNode, 'routes')
            routesPropNode.value.elements.find(el => {
                return this._isRoute(el) && this._getObjNodeProperty(el, 'path').value.value === path
            })
        } else {
            // 如果不是 switch 则直接比对
            const pathPropNode = this._getObjNodeProperty(rootObjNode, 'path')
            if (pathPropNode.value.value === path) {
                return rootObjNode
            }
        }
    }

    _getObjNodeProperty(node, propName) {
        return node.properties.find(({ key }) => {
            return t.isIdentifier(key, { name: propName })
        })
    }

    _add(routeParts, rootNode, componentPath) {
        const parentName = routeParts[0]
        const children = routeParts.slice(1)
        // 寻找第一层路由
        let [parentNode] = this._findRoute(parentName, rootNode)
        if (!parentNode) {
            // 没有找到父级，创建一个 switch 并将路由放进 switch 的 routes 中
            const switchNode = createRouteNode('switch')
            const routeNode = createRouteNode('route', { path: parent, componentPath })
            const switchRoutesNode = switchNode.properties.find(prop => prop.key.name === 'routes')
            switchRoutesNode.elements.push(routeNode)
            rootNode.push(switchNode)
        }
        if (children.length) {
            this._add(children)
        }
    }

}

module.exports = RouteProcesser