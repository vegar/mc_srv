# mc_srv


This small package will let you `start`, `stop` and `send` messages to a minecraft server.

### Example ###

  ```javascript
    // require our package
    var mc_srv = require('mc_srv');

    // some configuration
    mc_srv.Configuration.basePath = '~/minecraft';

    // defining server
    var definition = { name: "Test Server", jarfile: "minecraft_server.jar" };
    var server = new mc_srv.Server(definition);

    // start server
    server.start();
  ```


## Configuration ###

There are a couple of global values that can be set.

| Key                 | Default          | Description                            |
| ------------------- | ---------------- | -------------------------------------  |
| `basePath`          |                  | The root folder where your mindcraft servers exists |
| `standardArguments` | -Xms1024m -Xmx2G | Arguments appended to the command line |



## Defining server ###

A server definition consist of a `name` and a `jarfile`. When launching a server, **mc_srv** will look for the `jarfile` inside of the `name` folder.

## Methods ##

The `Server` class provides the following methods

### start(definition) ###

Launces the server. If the server already runs, it will do nothing.  

### stop ###

Stops a running server.

### stopped ###

Returns true if the server i stopped.

### send(message) ###

Sends message to the server. This is the same as writing in the server console on a manually launched server.

## Events ##

A server will emit the following events.

| Event         | Arguments          | Description                        |
| ------------- | ------------------ | ---------------------------------- |
| status        | _status_           | Will signal changes in server status. Possible values are **starting**, **ready**, **stopping** and **stopped** |
| player joined | _player_           | A new player has joined the server |
| player left   | _player_           | A player left the server           |
| chat          | _player_ _message_ | Player sent a message in the chat  |
| data          | _data_             | Minecraft sent data to the console |

## Tests ##

Tests can be run using [Mocha][http://visionmedia.github.io/mocha/]. 