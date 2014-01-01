var Server = require('./sockets').Server;


exports.start = function(){
  var server = new Server();
  var connections = server.connections;

  //Two player server:
  connections.bufferWithCount(2)
    .onValue(function(connections){
      var red_player  = connections[0];
      var blue_player = connections[1];

      red_player.send.push({type: 'start', player: 'red'});
      blue_player.send.push({type: 'start', player: 'blue'});

      red_player.send.plug(blue_player.receive);
      blue_player.send.plug(red_player.receive);
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
