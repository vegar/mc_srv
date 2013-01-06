exports.spawn = function(command, arguments, options){
	var events = require('events'),
		stream = require('stream');
	
	var fakeProcess = new events.EventEmitter();

    fakeProcess.command = command;
    fakeProcess.arguments = arguments;
    fakeProcess.options = options;


	fakeProcess.stderr = new stream.Stream();
	fakeProcess.stderr.write = function(data){
		this.emit('data', data);
	};
	
	fakeProcess.stdin = new stream.Stream();
	fakeProcess.stdin.writeable = true;
	fakeProcess.stdin.write = function(data){
	   this.emit('data', data);
	};
	
	return fakeProcess;
};