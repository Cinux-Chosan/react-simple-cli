const path = require('path')
const traverse = require('@babel/traverse').default
const t = require('@babel/types')
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
        // this._checkTopRoute()
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
        return this.routesMapNode
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

    checkAndGetRoutes(node) {
        let routesPropNode = this._getObjNodeProperty(node, 'routes')
        if (t.isArrayExpression(routesPropNode.value)) {
            // 
        } else {
            routesPropNode = t.objectProperty(t.identifier('routes'), t.arrayExpression())
            node.properties.push(routesPropNode)
        }
        return routesPropNode
    }

    // 如果当前路由 path 匹配，则返回当前结点，如果当前节点为 switch 节点，则检查其 routes 中的节点
    findMatchRoute(node, path) {
        const typePropNode = this._getObjNodeProperty(node, 'type')
        switch (typePropNode.value.value) {
            case 'switch':
                const routesPropNode = this.checkAndGetRoutes(node, 'routes')
                return routesPropNode.value.elements.find(route => this.findMatchRoute(route, path))
            case 'redirect':
                break
            case 'route':
            default:
                const pathPropNode = this._getObjNodeProperty(node, 'path')
                if (pathPropNode.value.value === path) {
                    return node
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
        let parentNode = this.findMatchRoute(rootNode, parentName)
        if (!parentNode) {
            // 没有找到父级，创建一个 switch 并将路由放进 switch 的 routes 中
            const rootNodeType = this._getObjNodeProperty(rootNode, 'type').value.value
            // 如果 rootNode 是 switch 类型，则在其 routes 中添加新建项
            switch (rootNodeType) {
                case 'switch': {
                    const routeNode = createRouteNode('route', { path: parentName, componentPath })
                    const switchRoutesNode = this.checkAndGetRoutes(rootNode)
                    switchRoutesNode.value.elements.push(routeNode)
                    parentNode = routeNode
                    break
                }
                case 'redirect':
                    break
                // 如果 rootNode 是 route 类型，则在 rootNode 的 routes 中新建一项
                default: {
                    const switchNode = createRouteNode('switch')
                    const routeNode = createRouteNode('route', { path: parentName, componentPath })
                    const switchRoutesNode = this.checkAndGetRoutes(switchNode)
                    const rootRoutesNode = this.checkAndGetRoutes(rootNode)
                    switchRoutesNode.value.elements.push(routeNode)
                    rootRoutesNode.value.elements.push(switchNode)
                    parentNode = routeNode
                    break;
                }
            }

        }
        if (children.length) {
            this._add(children, parentNode, componentPath)
        }
    }

}

module.exports = RouteProcesser