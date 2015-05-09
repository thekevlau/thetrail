import React from 'react';
import fluxMixin from 'flummox/mixin';

import Header from './Header';
import TrailCollection from './TrailCollection';

export default React.createClass({
    statics: {
        init: async function(){
            const user = await flux.getActions('UserActions').fetchCurrentUser();
            const trails = await flux.getActions('TrailActions').fetchTrailsForUser(user.id);
            return [user, trails];
        }
    },

    mixins: [fluxMixin(['UserStore', 'TrailStore'], ([UserStore, TrailStore]) => {
        const currentUser = UserStore.getCurrentUser();
        return {
            currentUser,
            trails: TrailStore.getTrailsForUser(currentUser.id)
        }
    })],

    render: function(){
        return (
            <div className="home">
                <Header />
                <TrailCollection title="My Trails" />
            </div>
        );
    }
});
