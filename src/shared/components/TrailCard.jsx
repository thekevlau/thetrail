import React from 'react';
import { Navigation } from 'react-router';

export default React.createClass({
    mixins: [Navigation],

    getDefaultProps: function(){
        return {
            trail: {}
        };
    },

    clickCard: function(trailId){
        this.transitionTo('test', {trailId});
    },

    render: function(){
        const trail = this.props.trail;
        let style = {width: '100px', height: '150px'};
        if (trail.image){
            style.backgroundImage = `url(${trail.image || 'https://s3.amazonaws.com/images.dailydabbles.com/artwork/skull-link5243b4c783a87-crop-260x260-medium.png'})`;
        }
        let className = 'trail-card';
        if (this.props.className){
            className += ` ${this.props.className}`;
        }

        return (
            <div onClick={this.clickCard.bind(this, trail.id)} className={className}>
                <div style={style} className="hexagon trail-collection__card__hexagon"></div>
                <h3 className="trail-card__title">{trail.name}</h3>
            </div>
        );
    }
});
