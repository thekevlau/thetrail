import React from 'react';
import fluxMixin from 'flummox/mixin';

import Header from './Header';
import TrailCollection from './TrailCollection';

export default React.createClass({
    statics: {
        init: async function({state, flux}){
            const user = await flux.getActions('UserActions').fetchCurrentUser();
            await flux.getActions('TrailActions').fetchTrailsForUser(user.id);
            return;
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
                <div className="content">
                    <TrailCollection className="home__trail-collection" title="My Trails" trails={this.state.trails} />
                    <TrailCollection className="home__trail-collection" color="#f9ad18" width="60%" title="Trails in Progress" trails={this.state.trails} />
                </div>
            </div>
        );
    }
});
