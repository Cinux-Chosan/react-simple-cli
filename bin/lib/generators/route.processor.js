const path = require('path')
const slash = require('slash')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const t = require('@babel/types')
const { getSource, parseCode, compileToDest } = require('../utils')
const { findRoute, createRouteNode } = require('./route.util')

module.exports = class RouteProcessor {
    constructor(code, argv) {
        this.g = generator
        this.code = code
        this.argv = argv
        this._parse()
        this._walk()
    }

    // 将代码转成 ast
    _parse() {
        const ast = parseCode(this.code, { sourceType: 'module', plugins: ['jsx', 'dynamicImport'] })
        this.ast = ast
    }

    // 获取路由节点并保存
    _walk() {
        const { ast } = this
        traverse(ast, {
            ExportDefaultDeclaration: (path) => {
                const declarationPath = path.get('declaration')
                if (declarationPath.isIdentifier()) {
                    const id = declarationPath.node.name
                    this.routeMapNode = path.scope.bindings[id].path.node.init
                } else if (declarationPath.isObjectExpression()) {
                    this.routeMapNode = declarationPath.node
                }
            }
        })
    }


    add(routeName = '', componentPath = '') {
        const { routeMapNode } = this
        this._add(routeName.split('/'), routeMapNode, componentPath)
        return this.ast
    }


    // 找第一级匹配的路由，遇到 switch 则递归到第一层非 switch
    _findMatchRoute(node, pathName) {
        const nodeType = this._getNodeType(node)  // 待实现
        switch (nodeType) {
            case 'switch':
                // 递归
                const routes = this._getRoutes(node)
                return routes.find(route => this._findMatchRoute(route, pathName))
            case 'redirect':
                return
            case 'route':
            default:
                const nodePath = this._getNodePath(node)  // 待实现
                return nodePath === pathName
        }
    }

    _getNodePath(node) {
        const nodePath = this._getPropertyNode(node, 'path')
        if (t.isObjectProperty(nodePath)) {
            return nodePath.value.value
        }
    } 

    _getNodeType(node) {
        const typePropNode = this._getPropertyNode(node, 'type')
        if (t.isObjectProperty(typePropNode)) {
            return typePropNode.value.value
        }
    }

    _createRoutesNode() {
        return t.arrayExpression()
    }

    _createObjectProperty(propertyNode) {
        return t.objectProperty(t.identifier('routes'), propertyNode)
    }

    _getRoutes(node) {
        let routes = this._getPropertyNode(node, 'routes')
        if (!(routes && t.isArrayExpression(routes.value))) {
            routes = this._createRoutesNode()
            node.properties.push(this._createObjectProperty(routes))
        }
        return routes.value.elements
    }

    _getSwitch(node) {
        const nodeType = this._getNodeType(node)
        switch(nodeType) {
            case 'switch':
                return node
            case 'redirect':
                return
            case 'route':
            default: 
                const routes = this._getRoutes(node)
                return routes.find(route => this._getNodeType(route) === 'switch')
        }
    }


    _getPropertyNode(node, propName) {
        return node.properties.find(prop => prop.key.name === propName)
    }

    _createRouteAssets(assetsPath, options) {
        const argv = { ...this.argv, ...options }
        compileToDest('component.hbs', argv, path.resolve(assetsPath, 'index.jsx'))
        compileToDest('reducer.hbs', argv, path.resolve(assetsPath, 'reducer.js'))
        compileToDest('saga.hbs', argv, path.resolve(assetsPath, 'saga.js'))
        compileToDest('style.hbs', argv, path.resolve(assetsPath, 'style.less'))
        compileToDest('action.types.hbs', argv, path.resolve(assetsPath, 'action.types.js'))
    }


    _addNodeToSwitch(parentNode, node) {
        // 查找 switch 节点
        let switchNode = this._getSwitch(parentNode)
        if (!switchNode) {
            switchNode = createRouteNode('switch')
            const parentRoutesNode = this._getRoutes(parentNode)
            parentRoutesNode.push(switchNode)  // 待实现，将 switch 添加到 parent 的 routes 中
        }
        const switchRoutes = this._getRoutes(switchNode)
        switchRoutes.push(node)
    }

    _generateRoutesAndAssets(rootNode, parentPath, routePathName) {
       // 创建 pages 目录中的资源文件，可抽成方法，供 label 处使用
       const pageRootPath = './src/pages'
       const routeMapRootPath = './src/routes'
       const rel =  path.relative(routeMapRootPath, pageRootPath)
       const assetsPath = path.join(pageRootPath, parentPath, routePathName)
       this._createRouteAssets(assetsPath, { name: routePathName })
       const parentRouteNode = createRouteNode('route', { assetsPath: slash(path.join(rel, parentPath, routePathName)) , path: routePathName })
       this._addNodeToSwitch(rootNode, parentRouteNode)
       return parentRouteNode
    }

    _add(routeParts, rootNode, parentPath = '') {
        const [parentRouteName, ...children] = routeParts
        let parentRouteNode = this._findMatchRoute(rootNode, parentRouteName)
        if (!parentRouteNode) {
            // 没有找到第一级路由节点，如果非第一层路由，则返回，否则创建一个节点
            if (parentPath) {
                return false
            }
            parentRouteNode = this._generateRoutesAndAssets(rootNode, parentPath, parentRouteName)
        }

        if (children.length) {
            const subRoutes = this._getRoutes(parentRouteNode)
            const isSubRoutesAddSuccess = subRoutes.some(route => this._add(children, route, path.join(parentPath, parentRouteName)))
            if (!isSubRoutesAddSuccess) {
                children.reduce((parentNode, childPathName, index) => {
                    const parentPathName = path.join(parentPath, parentRouteName, children.slice(0, index).join('/'))
                    return this._generateRoutesAndAssets(parentNode, parentPathName , childPathName)
                }, parentRouteNode)
            }
        }

        // 添加成功
        return true
    }

}