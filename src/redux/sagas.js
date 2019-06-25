import homePageSaga from '@pages/home/saga'

export default function * rootSaga() {
    yield *homePageSaga()
}
