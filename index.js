module.exports = (function () {

    function minecraft() {
    }

    minecraft.Configuration = function () {
        var configuration = {};

        return {
            get: function (key) {
                return configuration[key];
            },
            set: function (key, value) {
                configuration[key] = value;
            }
        };
    }();

    minecraft.Definition = require('./lib/definition');
    minecraft.Server = require('./lib/server');
    minecraft.Server.Configuration = minecraft.Configuration;

    return minecraft;
})();