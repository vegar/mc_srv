module.exports = (function(){
    var _configuration = {};

    var _get = function(key) {
        return _configuration[key];
    };

    var _set = function(key, value) {
        _configuration[key] = value;
    };

    var configuration =  {
        get: _get,
        set: _set
    };

    Object.defineProperty(configuration, "basePath", { get: function(){ return _get("basePath"); },
                                                       set: function(newValue){ _set("basePath", newValue); }
                                                     });

    return configuration;

})();