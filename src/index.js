import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'
import MapRoutes from './routes/mapRoutes'
import store from './redux'

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <MapRoutes />
        </Router>
    </Provider>,
    document.getElementById('root'))
