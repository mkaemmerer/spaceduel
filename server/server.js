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
function Server(){
  var wss = new WebSocketServer({port: 8080});
  this.connections = wss.asEventStream()
    .map(function(ws){
      return new Connection(ws);
    });
};


exports.Server = Server;