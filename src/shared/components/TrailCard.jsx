import React from 'react';

export default React.createClass({
    getDefaultProps: function(){
        return {
            trail: {}
        };
    },

    render: function(){
        const trail = this.props.trail;
        return (
            <div className="trail-card">
                <h3 className="trail-card__title">{trail.title}</h3>
            </div>
        );
    }
});
