import React from 'react';
import SearchBox from './SearchBox';

export default React.createClass({
    render: function(){
        return (
            <div className="header">
                <div className="header__logo"></div>
                <SearchBox />
            </div>
        );
    }
});
