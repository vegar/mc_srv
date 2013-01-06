module.exports = (function(){ 

    function Definition(name){

        if (!(this instanceof Definition)) {
            return new Definition(name);
        }

        this.name = name;
    }

    Definition.Standard = {
        name: 'vanilla',
        jarfile: 'minecraft_server.jar'
    };

    return Definition; 
})();