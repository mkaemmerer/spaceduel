!(function(){
  var stage      = new Stage();
  var audio      = new AudioPlayer();
  var collisions = new Collisions({
    'red_bullets':  ['blue_ships'],
    'red_ships':    ['blue_bullets'],

    'blue_bullets': ['red_ships'],
    'blue_ships':   ['red_bullets']
  });

  var ship1  = new Ship(stage, collisions, {
    position: P2(150,  50),
    forward:  V2(  0,   1),
    controls: Player1Controls,
    team:     'red'
  });
  new ShipDisplay(ship1, stage);
  new ShipAudio(ship1, audio);

  var ship2  = new Ship(stage, collisions, {
    position: P2(150, 250),
    forward:  V2(  0,  -1),
    controls: Player2Controls,
    team:     'blue'
  });
  new ShipDisplay(ship2, stage);
  new ShipAudio(ship2, audio);
})();
