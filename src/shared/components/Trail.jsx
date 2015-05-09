import React from 'react';
import fluxMixin from 'flummox/mixin';

import Header from './Header';
import Step from './Step';

export default React.createClass({
    statics: {
        init: async function({state, flux}){
            const user = await flux.getActions('UserActions').fetchCurrentUser();
            const trail = await flux.getActions('TrailActions').fetchTrail(state.params.trailId);
            await flux.getActions('UserActions').fetchUser(trail.userId);
            return;
        }
    },

    mixins: [fluxMixin(['UserStore', 'TrailStore'], ([UserStore, TrailStore], props) => {
        const currentUser = UserStore.getCurrentUser();
        const trail = TrailStore.getTrail(props.params.trailId);
        return {
            currentUser,
            trail,
            trailAuthor: UserStore.getUser(trail.userId)
        }
    })],

    render: function(){
        const steps = this.state.trail.steps.map(step => <Step step={step} />);
        return (
            <div className="trail">
                <Header />
                <div className="content">
                    <div className="trail__body">
                        <div className="trail__info">
                            <h3 className="trail__info__title">{this.state.trail.name}</h3>
                            <h5 className="trail__info__author">{this.state.trailAuthor.name}</h5>
                        </div>
                        <div className="trail__steps">
                            <div className="trail__steps__path"></div>
                            {steps}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
