(function(){
  'use strict';

  //Imports:
  var Bacon  = require('baconjs');


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

  function Connection(url){
    var ws = new WebSocket(url);

    this.receive = ws.asEventStream()
      .filter(function(message){ return message.type === 'message'; })
      .map('.data')
      .map(JSON.parse);
    this.send    = new Bacon.Bus();

    this.receive.onEnd(this.send.end.bind(this.send));
    this.send.map(JSON.stringify).onValue(ws.send.bind(ws));
  }


  //Exports:
  window.ServerConnection = function(){
    var host = window.document.location.host.replace(/:.*/, '');
    var url = 'ws://' + host + ':8080';
    return new Connection(url);
  };
})();
