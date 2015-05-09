export default {
    // Runs init method of route handler.
    init: async (routes, params) => {
        return Promise.all(routes
            .map(route => route.handler['init'])
            .filter(method => typeof method === 'function')
            .map(method => method(params))
        ).catch(err => console.error(err.stack));
    },
    // Wraps the router.run function in a promise.
    run: async router => {
        return new Promise((resolve, reject) => {
            router.run((Handler, state) => {
                resolve({Handler, state});
            });
        });
    }
};
