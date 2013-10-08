var should = require("should"),
    path = require('path');


describe('Configuration', function(){
    var mcl = require('..').Configuration;

        it('should contain basePath', function(){
            mcl.should.have.property('basePath');
        });

        it('should contain standardArguments', function(){
       	    mcl.should.have.property('standardArguments', '-Xms1024m -Xmx2G');
        });
});

