import { takeLatest, put } from 'redux-saga/effects'
import { SAGA_ACTION_DEMO, SET_DATA_DEMO } from './action.types'

function* sagaDemo() {
    const payload = 'this is a redux saga demo'
    yield put({ type: SET_DATA_DEMO, payload })
}

export default function* () {
    yield takeLatest(SAGA_ACTION_DEMO, sagaDemo)
}
