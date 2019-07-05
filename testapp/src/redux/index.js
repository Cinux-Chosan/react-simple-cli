import { createStore, combineReducers, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import * as reducers from './reducers'
import mySaga from './sagas'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()
// mount it on the Store
const store = createStore(
    combineReducers(reducers),
    applyMiddleware(sagaMiddleware)
)

// then run the saga
sagaMiddleware.run(mySaga)

export default store