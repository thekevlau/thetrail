import 'babel/polyfill';

import AppRoutes from '../shared/Routes';
import Flux from '../shared/Flux';
import RouteUtils from '../shared/utils/RouteUtils';

const flux = new Flux();

const router = Router.create({
    routes: AppRoutes,
    location: Router.HistoryLocation
});

RouteUtils.run(router).then(async ({Handler, state}) => {
    await RouteUtils.init(state.routes, {state, flux});

    React.render(
        <FluxComponent flux={flux}>
            <Handler {...state} />
        </FluxComponent>,
        document.getElementById('app')
    );
});
