(function(){
  'use strict';

  //Connect to server:
  var server     = new ServerConnection();
  var start      = server.receive
    .filter(messageType('start'))
    .take(1);

  //Create new game instance
  start.onValue(function(message){
      var game    = new Game();
      new GameDisplay(game);
      new GameAudio(game);

      if(message.player === 'red'){
        game.setRedControls(Controls.Keyboard1Controls());
        game.setBlueControls(Controls.ServerControls(server));
      }
      if(message.player === 'blue'){
        game.setRedControls(Controls.ServerControls(server));
        game.setBlueControls(Controls.Keyboard1Controls());
      }
    });

  //Broadcast control values to server
  start.onValue(function(){
      server.send.plug(Controls.Keyboard1Controls().movement
        .map(function(value){
          return {type: 'move', direction: value};
        })
      );
      server.send.plug(Controls.Keyboard1Controls().fire
        .map(function(){
          return {type: 'fire'};
        })
      );
    });

  function messageType(type){ return function(data){ return data.type === type; }; }
})();
