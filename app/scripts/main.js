!(function(){
  //Create global context objects:
  var collisions = new Collisions({
    'red_lasers':  ['blue_ships'],
    'red_ships':   ['blue_lasers'],

    'blue_lasers': ['red_ships'],
    'blue_ships':  ['red_lasers']
  });
  var world      = new World({
    width:  400,
    height: 400
  });
  var stage      = new Stage({
    width:  400,
    height: 400
  });
  var audio      = new AudioPlayer();

  //Connect to server:
  var server     = ServerConnection();
  window.setTimeout(function(){
    server.send.plug(Player1Controls.movement
      .map(function(value){
        return {type: 'move', direction: value};
      })
    );
    server.send.plug(Player1Controls.fire
      .map(function(value){
        return {type: 'fire'};
      })
    );
  }, 500);

  //Create ships:
  var ship1  = new Ship(world, collisions, {
    position: P2(200,  50),
    forward:  V2(  0,   1),
    controls: Player1Controls,
    team:     'red'
  });
  new ShipDisplay(ship1, stage);
  new ShipAudio(ship1, audio);

  var ship2  = new Ship(world, collisions, {
    position: P2(200, 350),
    forward:  V2(  0,  -1),
    controls: ServerControls(server),
    team:     'blue'
  });
  new ShipDisplay(ship2, stage);
  new ShipAudio(ship2, audio);
})();
