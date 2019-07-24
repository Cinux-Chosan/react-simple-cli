/*
 * @Author: Chosan.Zhangjianjun
 * @Date: 2019-02-21 17:20:55
 * @Last Modified by: Chosan.Zhangjianjun
 * @Last Modified time: 2019-02-21 17:43:22
 */
import React, { lazy } from 'react'; // type: switch 则其 routes 中的路由会被封装在 React-Router#Switch 中
// type: redirect 代表 React-Router#Redirect
// type: undeinfed（无 type），代表页面，必须有 path 和 component 属性，用于 React-Router#Route

const route = {
  type: 'route',
  component: () => import('../pages/home'),
  path: '/',
  routes: [
    {
      type: 'switch',
      routes: [
        {
          type: 'route',
          path: 'z',
          component: () => import('../pages/z'),
          routes: [
            {
              type: 'switch',
              routes: [
                {
                  type: 'route',
                  path: 'b',
                  component: () => import('../pages/z/b'),
                  routes: [
                    {
                      type: 'switch',
                      routes: [
                        {
                          type: 'route',
                          path: 'myFirst',
                          component: () => import('../pages/z/b/myFirst'),
                          routes: [
                            {
                              type: 'switch',
                              routes: [
                                {
                                  type: 'route',
                                  path: '3',
                                  component: () =>
                                    import('../pages/z/b/myFirst/3'),
                                  routes: []
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
export default route;
