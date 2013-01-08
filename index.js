module.exports = (function () {

    function minecraft() {
    }

    minecraft.Configuration = require('./lib/configuration');
    minecraft.Definition = require('./lib/definition');
    minecraft.Server = require('./lib/server');
    minecraft.Server.Configuration = minecraft.Configuration;

    return minecraft;
})();