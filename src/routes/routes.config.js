/*
 * @Author: Chosan.Zhangjianjun
 * @Date: 2019-02-21 17:20:55
 * @Last Modified by: Chosan.Zhangjianjun
 * @Last Modified time: 2019-02-21 17:43:22
 */

import React, { lazy } from 'react'
import App from '@pages/home'

// type: switch 则其 routes 中的路由会被封装在 React-Router#Switch 中
// type: redirect 代表 React-Router#Redirect
// type: undeinfed（无 type），代表页面，必须有 path 和 component 属性，用于 React-Router#Route

export default {
  path: '/',
  component: App,
  routes: [
    {
      type: 'switch',
      routes: [
        {
          path: '1',
          component: () => <span>这是路由1</span>
        },
        {
          path: '2',
          component: () => <span>哈哈哈，我是路由2</span>
        }
      ]
    }
    // {
    //   type: 'switch',
    //   routes: [
    //     {
    //       path: 'demo',
    //       component: lazy(() => import('../pages/Demo'))
    //     },
    //     {
    //       path: 'a',
    //       component: props => {
    //         return <>mmmmmm{props.yield}nnnn</>
    //       },
    //       routes: [
    //         {
    //           path: 'c',
    //           component: () => 'ccccc'
    //         }
    //       ]
    //     },
    //     {
    //       path: 'b',
    //       component: () => 'bbbbb'
    //     },
    //     {
    //       path: 'testButton',
    //       component: lazy(() => import('../components/Button'))
    //     },
    //     {
    //       type: 'redirect',
    //       to: 'demo'
    //     }
    //   ]
    // }
  ]
}
