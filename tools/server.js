var server = require('gulp-develop-server');
var started = false;

module.exports = {
    listen: function(){
        server.listen.apply(this.caller, arguments);
        started = true;
    },

    restart: function(){
        server.restart.apply(this.caller, arguments);
    }
};
