!(function(){
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
})();
