var assert = require("assert"),
    should = require("should"),

    launcher = require('..'),
    fakeSpawn = require('./fake_spawn').spawn,
    path = require('path');

describe('Server', function(){
    var definition = { name: "Test Server", jarfile: "test_server.jar" };
    
    beforeEach(function(){
        launcher.Configuration.basePath = '/minecraft';
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
            assert.equal(this.server.process.arguments[1], this.server.definition.jarfile);
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

    describe('notifications', function(){
        beforeEach(function(){
           this.server.start();
        });

        it("should emit 'data' event on output", function(done){
            var expectedData = 'some data';

            this.server.on('data', function(data){
                data.should.equal(expectedData);
                done();
            });

            this.server.process.stderr.write(expectedData);
        });

        it("should emit 'player joined' on connection", function(done){
            this.server.on('player joined', function(player){
                player.should.equal('vvikan');
                done();
            });

            this.server.process.stderr.write('2012-10-10 22:15:12 [INFO] vvikan[/192.168.18.190:51347] logged in with entity id 632 at ([world] -763.8980643569004, 63.0, -281.469472670575)');
        });

        it("should emit 'player left' on disconnect", function(done){
            this.server.on('player left', function(player){
                player.should.equal('vvikan');
                done();
            });

            this.server.process.stderr.write('2012-10-10 22:16:00 [INFO] vvikan lost connection: disconnect.quitting');
        })

        it("should emit 'chat' on chat message", function(done){
            this.server.on('chat', function(player, message){
                player.should.equal('vvikan');
                message.should.equal('some message');
                done();
            });

            this.server.process.stderr.write('2012-12-16 14:10:36 [INFO] <vvikan> some message');
        });
    });
});