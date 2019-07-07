/*
 * @Author: Chosan.Zhangjianjun
 * @Date: 2019-02-21 17:20:55
 * @Last Modified by: Chosan.Zhangjianjun
 * @Last Modified time: 2019-02-21 17:43:22
 */
import React, { lazy } from 'react'; // import App from '@pages/home'; // type: switch 则其 routes 中的路由会被封装在 React-Router#Switch 中
// type: redirect 代表 React-Router#Redirect
// type: undeinfed（无 type），代表页面，必须有 path 和 component 属性，用于 React-Router#Route

const routeMap = {
  type: 'switch',
  routes: [{
    type: "route",
    path: "aaa",
    component: () => import("../pages/aaa"),
    routes: [{
      type: "switch",
      routes: [{
        type: "route",
        path: "b2",
        component: () => import("../pages/aaa/b2"),
        routes: [{
          type: "switch",
          routes: [{
            type: "route",
            path: "c3",
            component: () => import("../pages/aaa/b2/c3"),
            routes: [{
              type: "switch",
              routes: [{
                type: "route",
                path: "d2",
                component: () => import("../pages/aaa/b2/c3/d2"),
                routes: []
              }]
            }]
          }]
        }]
      }]
    }]
  }, {
    type: "route",
    path: "bbb",
    component: () => import("../pages/bbb"),
    routes: [{
      type: "switch",
      routes: [{
        type: "route",
        path: "ccc",
        component: () => import("../pages/bbb/ccc"),
        routes: []
      }]
    }]
  }]
};
export default routeMap;