!(function(){
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
    controls: Player2Controls,
    team:     'blue'
  });
  new ShipDisplay(ship2, stage);
  new ShipAudio(ship2, audio);
})();
