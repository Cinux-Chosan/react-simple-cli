import { SET_DATA_DEMO } from './action.types'

export const reducerDemo = (state = 'this is a redux reducer demo', action) => {
    const { type, payload } = action
    switch(type) {
        case SET_DATA_DEMO:
            return payload
        default:
            return state
    }
}