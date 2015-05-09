import fluxMixin from 'flummox/mixin';
import React from 'react';

export default React.createClass({
    mixins: [fluxMixin(['UiStore'], ([UiStore]) => ({
        searchValue: UiStore.searchValue
    }))],

    getInitialState: function(){
        return {
            searchValue: ''
        };
    },

    getDefaultProps: function(){
        return {
            placeholder: 'Search...'
        };
    },

    render: function(){
        return (
            <input value={this.state.searchValue} className="search-box" placeholder={this.props.placeholder} />
        );
    }
});
