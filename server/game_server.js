var Server = require('./sockets').Server;


exports.start = function(){
  var server = new Server();
  var connections = server.connections;

  //Two player server:
  connections.bufferWithCount(2)
    .onValue(function(connections){
      var player1 = connections[0];
      var player2 = connections[1];

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
