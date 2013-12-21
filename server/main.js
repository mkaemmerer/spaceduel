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


exports.start = function(){
  wss = new WebSocketServer({port: 8080});

  wss.on('connection', function(ws) {
    var stream = ws.asEventStream();
    var closed = stream.withHandler(function(e){
        if(e.isEnd())
          return this.push(new Bacon.Next());
      })
      .take(1);

    var fire = Bacon.interval(1000, "fire")
      .takeUntil(closed);


    //Side effects
    stream.onValue(function(message) {
      console.log('received: %s', message);
    });

    fire.onValue(function(value){
      ws.send(value);
    });
  });
};
