!(function(){
  function Game(){
    //Create global context objects:
    this.collisions = new Collisions({
      'red_lasers':  ['blue_ships'],
      'red_ships':   ['blue_lasers'],

      'blue_lasers': ['red_ships'],
      'blue_ships':  ['red_lasers']
    });
    this.world      = new World({
      width:  400,
      height: 400
    });
    this.stage      = new Stage({
      width:  400,
      height: 400
    });
    this.audio      = new AudioPlayer();
  };
  Game.prototype.addRedPlayer = function(controls){
    var red_ship  = new Ship(this.world, this.collisions, {
      position: P2(200,  50),
      forward:  V2(  0,   1),
      controls: controls,
      team:     'red'
    });
    new ShipDisplay(red_ship, this.stage);
    new ShipAudio(red_ship, this.audio);
  };
  Game.prototype.addBluePlayer = function(controls){
    var blue_ship  = new Ship(this.world, this.collisions, {
      position: P2(200, 350),
      forward:  V2(  0,  -1),
      controls: controls,
      team:     'blue'
    });
    new ShipDisplay(blue_ship, this.stage);
    new ShipAudio(blue_ship, this.audio);
  };



  //Connect to server:
  var server     = ServerConnection();
  var start      = server.receive
    .filter(messageType('start'))
    .take(1);

  //Create new game instance
  start.onValue(function(message){
      var game = new Game();

      if(message.player === 'red'){
        game.addRedPlayer(Keyboard1Controls);
        game.addBluePlayer(ServerControls(server));
      }
      if(message.player === 'blue'){
        game.addRedPlayer(ServerControls(server));
        game.addBluePlayer(Keyboard1Controls);
      }
    });

  //Broadcast control values to server
  start.onValue(function(message){
      server.send.plug(Keyboard1Controls.movement
        .map(function(value){
          return {type: 'move', direction: value};
        })
      );
      server.send.plug(Keyboard1Controls.fire
        .map(function(value){
          return {type: 'fire'};
        })
      );
    });

  function messageType(type){ return function(data){ return data.type == type; }; };
})();
