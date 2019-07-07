import Loadable from 'react-loadable';

export default (asyncComp) => {
    const LoadableComponent = Loadable({
        loader: asyncComp,
        loading: () => 'loading',
    });
    return LoadableComponent
}