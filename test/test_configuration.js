var should = require("should"),
    path = require('path');


describe('Configuration', function(){
    var mcl = require('..').Configuration;

        it('should remember values', function(){
            mcl.set('key', 'value');
            mcl.get('key').should.equal('value');
        });

        it('should return undefined for unknown keys', function(){
            should.not.exist(mcl.get('unknown key'));
        });

        it('should have property basePath', function(){
            mcl.should.have.property("basePath");
        });
});

