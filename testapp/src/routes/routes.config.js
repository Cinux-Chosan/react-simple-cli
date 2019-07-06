{
  type: 'switch',
  routes: [{
    type: "route",
    path: "zhangjianjun",
    routes: [{
      type: "switch",
      routes: [{
        type: "route",
        path: "bbbbb",
        routes: [{
          type: "switch",
          routes: [{
            type: "route",
            path: "ccc",
            routes: [{
              type: "switch",
              routes: [{
                type: "route",
                path: "ddd",
                routes: [{
                  type: "switch",
                  routes: [{
                    type: "route",
                    path: "eee",
                    routes: []
                  }]
                }]
              }]
            }]
          }]
        }]
      }]
    }, {
      type: "switch",
      routes: [{
        type: "route",
        path: "bbbbb",
        routes: [{
          type: "switch",
          routes: [{
            type: "route",
            path: "ccc",
            routes: [{
              type: "switch",
              routes: [{
                type: "route",
                path: "ddd",
                routes: [{
                  type: "switch",
                  routes: [{
                    type: "route",
                    path: "eee",
                    routes: [],
                    component: () => import("")
                  }]
                }],
                component: () => import("")
              }]
            }],
            component: () => import("")
          }]
        }],
        component: () => import("")
      }]
    }]
  }] //  {
  //   path: 'zhangjianjun',
  // component: App,
  // routes: [
  //   {
  //     type: 'switch',
  //     routes: [
  //       {
  //         path: '1',
  //         component: () => <span>这是路由1</span>
  //       },
  //       {
  //         path: '2',
  //         component: () => <span>哈哈哈，我是路由2</span>
  //       }
  //     ]
  //   }
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
  // ]
  // }

}