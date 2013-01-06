var assert = require("assert"),
 
    launcher = require('..'),
    fakeSpawn = require('./fake_spawn').spawn,
    path = require('path');

describe('MCLaucnher', function(){
    var mcl = require('..').Configuration;

    describe('Configuration', function(){
        it('should remember values', function(){
            mcl.set('key', 'value');
            assert.equal(mcl.get('key'), 'value');
        });

        it('should return undefined for unknown keys', function(){
            assert.equal(typeof mcl.get('unknown key'), 'undefined');
        });
    });
});

describe('Server', function(){
    var definition = { name: "Test Server", jarfile: "test_server.jar" };
    
    beforeEach(function(){
        launcher.Configuration.set('base path', '/minecraft');

        this.server = new launcher.Server(definition, fakeSpawn);
    });

    describe('Initial state', function(){
        it('should have initial status of "stopped"', function(){
            assert.equal(this.server.status, "stopped");
        });

        it('should equal definition', function(){
            assert.equal(this.server.definition, definition);
        });
    });

    describe('start()', function(){
        it('should launch process', function(){
            this.server.start();
            assert(this.server.process);
        });

        it('should start in right directory', function(){
            var expected = path.join('/minecraft', this.server.definition.name);

            this.server.start();
            assert.equal(this.server.process.options.cwd, expected);
        });

        it('should have status "starting"', function(){
            this.server.start();
            assert.equal(this.server.status, "starting");
        });

        it('should have status "ready" when startup completed', function(){
            this.server.start();
            this.server.process.stderr.write('2012-11-14 23:04:40 [INFO] Done (9.382s)! For help, type "help" or "?"');

            assert.equal(this.server.status, "ready");
        });
    });

    describe('stop()', function(){
        it('should have status "stopping"', function(){
            this.server.start();
            this.server.stop();
            assert.equal(this.server.status, "stopping");
        });

        it('should send "stop" to process.stdin', function(done){
            this.server.start();
           this.server.process.stdin.on('data', function(data){
                assert.equal(data, "stop\r\n");
                done();
            });
            this.server.stop();
        });

        it('should have status "stopped" when process exits', function(){
            this.server.start();
            this.server.process.emit('exit');
            assert.equal(this.server.status, "stopped");
        });
    });

    describe('send()', function(){
        it('should write message to stdin, including crlf', function(done){
            this.server.start();
            this.server.process.stdin.on('data', function(data){
                assert.equal(data, "message\r\n");
                done();
            });
            this.server.send("message");
        });
    });
});