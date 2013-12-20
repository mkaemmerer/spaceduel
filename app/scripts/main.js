!(function(){
  var stage      = new Stage();
  var collisions = new Collisions();

  var ship1  = new Ship(stage, collisions, {
    position: P2(150,  50),
    forward:  V2(  0,   1),
    controls: Player1Controls
  });
  new ShipDisplay(ship1, stage);

  var ship2  = new Ship(stage, collisions, {
    position: P2(150, 250),
    forward:  V2(  0,  -1),
    controls: Player2Controls
  });
  new ShipDisplay(ship2, stage);
})();
