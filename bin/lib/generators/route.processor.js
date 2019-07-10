const path = require('path')
const slash = require('slash')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const t = require('@babel/types')
const { parseCode, compileToDest, logger } = require('../utils')
const { createRouteNode } = require('./route.util')

module.exports = class RouteProcessor {
    constructor(code, argv) {
        this.g = generator
        this.cliConfig = {}
        this.code = code
        this.argv = argv
        this._initConfig()
        this._parse()
        this._walk()
    }

    _initConfig() {
        try {
            this.cliConfig = require(path.resolve(process.cwd(), './.cli.config'))
        } catch (error) {
            // 没有配置文件
        }
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
                let routeMapNode = null
                if (declarationPath.isIdentifier()) {
                    const id = declarationPath.node.name
                    routeMapNode = path.scope.bindings[id].path.node.init
                    if (!this._getPropertyNode(routeMapNode, 'type')) {
                        routeMapNode = createRouteNode('switch')
                        path.scope.bindings[id].path.replaceWith(t.variableDeclarator(t.identifier(id), routeMapNode))
                    }
                } else if (declarationPath.isObjectExpression()) {
                    routeMapNode = declarationPath.node
                    if (!this._getPropertyNode(routeMapNode, 'type')) {
                        routeMapNode = createRouteNode('switch')
                        declarationPath.replaceWith(routeMapNode)
                    }
                }
                this.routeMapNode = routeMapNode
            }
        })
    }

    _isEmptyObject(node) {
        return node && node.properties && node.properties.length
    }

    add(routeName = '', componentPath = '') {
        const { routeMapNode } = this
        this._add(routeName.split('/'), routeMapNode, componentPath)
        return this.ast
    }

    _keepFind(arr, cb) {
        for(let index = 0, len = arr.length; index < len; ++ index) {
            const item = arr[index] 
            const result = cb(item, index)
            if (result) {
                return result
            }
        }
    }

    // 找第一级匹配的路由，遇到 switch 则递归到第一层非 switch
    _findMatchRoute(node, pathName) {
        const nodeType = this._getNodeType(node)
        const routes = this._getRoutes(node)
        const nodePath = this._getNodePath(node)
        switch (nodeType) {
            case 'switch':
                // 递归
                return this._keepFind(routes, (route) => this._findMatchRoute(route, pathName))
            case 'redirect':
                return
            case 'route':
            default:
                if (nodePath === '/') {
                    return this._keepFind(routes, (route) => this._findMatchRoute(route, pathName))
                } else if (nodePath === pathName) {
                    return node
                }
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

    _createRoutesArray() {
        return t.arrayExpression()
    }

    _createObjectProperty(propertyNode) {
        return t.objectProperty(t.identifier('routes'), propertyNode)
    }

    _getRoutes(node) {
        let routes = this._getPropertyNode(node, 'routes')
        if (!(routes && t.isArrayExpression(routes.value))) {
            const routesArray = this._createRoutesArray()
            routes = this._createObjectProperty(routesArray)
            node.properties.push(routes)
        }
        return routes.value.elements
    }

    // 获取子路由中的 path === '/' 或者 type === 'switch'
    _getSubRootOrSwitch(node) {
        const nodeType = this._getNodeType(node)
        const routes = this._getRoutes(node)
        switch (nodeType) {
            case 'switch':
                return node
            case 'redirect':
                return
            case 'route':
            default:
                return routes.find(route => {
                    const nodePath = this._getNodePath(route)
                    return nodePath === '/' || this._getNodeType(route) === 'switch'
                })
        }
    }

    _getPropertyNode(node, propName) {
        return node.properties.find(prop => prop.key.name === propName)
    }

    async _createRouteAssets(assetsPath, options) {
        const argv = { ...this.argv, ...options }
        await Promise.all([
            compileToDest('component.hbs', argv, path.resolve(assetsPath, 'index.jsx')),
            compileToDest('reducer.hbs', argv, path.resolve(assetsPath, 'reducer.js')),
            compileToDest('saga.hbs', argv, path.resolve(assetsPath, 'saga.js')),
            compileToDest('style.hbs', argv, path.resolve(assetsPath, 'style.less')),
            compileToDest('action.types.hbs', argv, path.resolve(assetsPath, 'action.types.js')),
        ])
        logger.info(`${path.resolve(assetsPath, 'index.jsx')} 创建完成，ctrl + click 点击前往!`)
    }

    _addNodeToSwitch(parentNode, node) {
        // 查找 switch 节点
        let switchNode = this._getSubRootOrSwitch(parentNode)
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
        const { indexDirName = '' } = this.cliConfig
        const pageRootDir = './src/pages'
        const routeConfigDir = './src/routes'
        const rel = path.relative(routeConfigDir, pageRootDir)
        const assetsPath = path.join(pageRootDir, parentPath, routePathName, indexDirName)
        this._createRouteAssets(assetsPath, { name: routePathName })
        const parentRouteNode = createRouteNode('route', { assetsPath: slash(path.join(rel, parentPath, routePathName, indexDirName)), path: routePathName })
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
                    return this._generateRoutesAndAssets(parentNode, parentPathName, childPathName)
                }, parentRouteNode)
            }
        }

        // 添加成功
        return true
    }

}