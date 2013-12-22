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
    .filter(function(message){ return message.type == 'message'; })
    .map('.data')
    .map(JSON.parse);
  this.send    = new Bacon.Bus();

  this.receive.onEnd(this.send.end.bind(this.send));
  this.send.map(JSON.stringify).onValue(ws.send.bind(ws));
};



exports.start = function(){
  wss = new WebSocketServer({port: 8080});

  wss.on('connection', function(ws) {
    var connection = new Connection(ws);
    var fire       = Bacon.interval(1000, {type: 'fire'});
    var move       = Bacon.repeatedly(1000, [
        {type: 'move', direction: {dx: -1, dy: 0}},
        {type: 'move', direction: {dx:  1, dy: 0}}
      ]);

    connection.receive
      .onValue(function(message){
        console.log('received: %s', message);
      });

    connection.send.plug(fire);
    connection.send.plug(move);
  });
};
