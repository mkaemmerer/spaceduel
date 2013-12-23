var WebSocketServer = require('ws').Server;
var WebSocket       = require('ws');
var Bacon           = require('baconjs');


WebSocket.prototype.asEventStream = function(){
  var ws = this;

  return Bacon.fromBinder(function(sink){
    ws.onopen    = function(message){
      sink(new Bacon.Next(function(){ return message; }));
    };
    ws.onmessage = function(message){
      sink(new Bacon.Next(function(){ return message; }));
    };
    ws.onerror   = function(error){
      sink(new Bacon.Error(function(){ return error; }));
    };
    ws.onclose   = function(message){
      sink(new Bacon.End(function(){ return message; }));
    };

    return function(){
      ws.onopen = ws.onmessage = ws.onerror = ws.onclose = function(){};
    };
  });
};
function Connection(ws){
  this.receive = ws.asEventStream()
    .map('.data')
    .map(JSON.parse);
  this.send    = new Bacon.Bus();

  this.receive.onEnd(this.send.end.bind(this.send));
  this.send.map(JSON.stringify).onValue(ws.send.bind(ws));
};



WebSocketServer.prototype.asEventStream = function(){
  var wss = this;

  return Bacon.fromBinder(function(sink){
    wss.on('connection', onConnect);
    wss.on('error',      onError);

    function onConnect(connection){
      sink(new Bacon.Next(function(){ return connection; }));
    };
    function onError(error){
      sink(new Bacon.Error(function(){ return error; }));
    };

    return function(){
      wss.removeListener('connection', onConnect);
      wss.removeListener('error',      onError);
    };
  });
};

exports.start = function(){
  var wss = new WebSocketServer({port: 8080});
  var connections = wss.asEventStream();

  var player1, player2;

  // First client to connect is player 1
  connections.take(1)
    .onValue(function(ws){
      player1 = new Connection(ws);
      console.log('player 1 connected');

      player1.receive.onValue(function(message){
        // console.log('player1: %s', message);
      });
    });
  //Second client to connect is player 2
  connections.skip(1).take(1)
    .onValue(function(ws){
      player2 = new Connection(ws);
      console.log('player 2 connected');

      player2.receive.onValue(function(message){
        // console.log('player2: %s', message);
      });

      player1.send.plug(player2.receive);
      player2.send.plug(player1.receive);
    });

  //Echo server:
  // connections
  //   .onValue(function(ws){
  //     var player = new Connection(ws);
  //     player.send.plug(player.receive.delay(500));
  //   });


  function fakeInputs(){
    var fire     = Bacon.interval(1000, {type: 'fire'});
    var movement = Bacon.repeatedly(2000, [
        {type: 'move', direction: {dx: -1, dy: 0}},
        {type: 'move', direction: {dx:  1, dy: 0}}
      ]);

    return {fire: fire, movement: movement};
  }
};
