module.exports = (function(){

    var configuration =  { };

    Object.defineProperty(configuration, "basePath", { value: "", writable: true, enumerable: true, configurable: false });
    Object.defineProperty(configuration, "standardArguments", { value: "-Xms1024m -Xmx2G", writable: true, enumerable: true, configurable: false });

    return configuration;

})();