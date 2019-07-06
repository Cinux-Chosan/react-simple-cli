


const path = require('path')
const traverse = require('@babel/traverse').default
const t = require('@babel/types')
const { getSource, parseCode } = require('../utils')
const { findRoute, createRouteNode } = require('./route.util')


module.exports = class RouteProcessor {
    constructor(code) {
        this.code = code
        this._parse()
        this._walk()
    }

    // 将代码转成 ast
    _parse() {
        const ast = parseCode(this.code, { sourceType: 'module', plugins: ['jsx'] })
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

}