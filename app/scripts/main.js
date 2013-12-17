!(function(){
  var width  = 300,
      height = 300,
      dt     = 1000/60;

  var stage = new Kinetic.Stage({
    container: 'canvas',
    width: width,
    height: height
  });

  var kbd1   = Player1Controls.movement.sample(dt);
  var ship1  = new Ship(kbd1);
  
  var kbd2   = Player2Controls.movement.sample(dt);
  var ship2  = new Ship(kbd2);

  stage.add(ship1.sprite.layer);
  stage.add(ship2.sprite.layer);
})();