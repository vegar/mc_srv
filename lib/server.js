module.exports = (function(){

    var spawn;
    var path = require('path');
    var util = require("util");
    var _ = require("underscore");
    var emitter = require('events').EventEmitter;

    var matchers = [];


    matchers.push({match: /\[INFO\] Done/g,
                   action: function(){ this.setStatus('ready'); }});

    matchers.push({match: /\[INFO\]\s(.*?)\[.*]\slogged in/,
                   action: function(player){ this.emit('player joined', player); }});

    matchers.push({match: /\[INFO\]\s(.*?)\slost connection/,
                   action: function(player){ this.emit('player left', player); }});

    matchers.push({match: /\[INFO\]\s<(.*?)>\s(.*)/,
                   action: function(player, message){ this.emit('chat', player, message); }});

    function Server(serverDefinition, s) {
        spawn = s || require('child_process').spawn;

        this.definition = serverDefinition;
        this.status = 'stopped';
    }

    util.inherits(Server, emitter);

    Server.prototype.setStatus = function(newStatus){
        this.status = newStatus;
        this.emit('status', this.status);
    };

    Server.prototype.start = function () {

        if (!this.stopped()) { return; }

        var dir = path.join(Server.Configuration.basePath, this.definition.name);
        var jar = path.basename(this.definition.jarfile);

        var serverInst = this;

        this.process = spawn('java', ['-jar', jar, 'nogui'],
            {
                cwd: dir,
                env: process.env
            });

        this.setStatus('starting');

        this.process.on('exit', function(code, signal){
            serverInst.setStatus('stopped');
            delete serverInst.process;
        });

        this.process.stderr.on('data', function(data){

            _.each(matchers, function(m){
                var match = data.toString().match(m.match);
                if (match){
                    m.action.apply(this, _.tail(match, 1));
                }
            }, serverInst);


            serverInst.emit('data', data);
        });
    };

    Server.prototype.send = function(message){
        this.process.stdin.write(message + '\r\n');
    };

    Server.prototype.stop = function () {
        this.send('stop');
        this.setStatus('stopping');
    };

    Server.prototype.stopped = function () {
        return 'stopped' === this.status;
    };

    return Server;
})();