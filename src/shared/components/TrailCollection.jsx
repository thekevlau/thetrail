import React from 'react';
import TrailCard from './TrailCard';

export default React.createClass({
    getDefaultProps: function(){
        return {
            trails: {},
            title: 'Trail Collection'
        };
    },

    render: function(){
        const trails = this.props.trails.values().map(trail => <TrailCard trail={trail} />);
        return (
            <div className="trail-collection">
                <h3 className="trail-collection__title">{this.props.title}</h3>
                <div className="trail-collection__box">
                    {trails}
                </div>
            </div>
        );
    }
});
