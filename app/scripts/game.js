!(function(){
  'use strict';

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

    //Create controllers:
    this.red_controls  = new Controller();
    this.blue_controls = new Controller();

    //Create ships:
    this.red_ship   = new Ship(this.world, this.collisions, {
      position: P2(200,  50),
      forward:  V2(  0,   1),
      controls: this.red_controls,
      team:     'red'
    });
    this.blue_ship  = new Ship(this.world, this.collisions, {
      position: P2(200, 350),
      forward:  V2(  0,  -1),
      controls: this.blue_controls,
      team:     'blue'
    });
  }
  Game.prototype.setRedControls = function(controls){
    this.red_controls.setControls(controls);
  };
  Game.prototype.setBlueControls = function(controls){
    this.blue_controls.setControls(controls);
  };


  function GameDisplay(game){
    this.stage      = new Stage({
      width:  400,
      height: 400
    });

    new ShipDisplay(game.red_ship, this.stage);
    new ShipDisplay(game.blue_ship, this.stage);
  }


  function GameAudio(game){
    this.audio      = new AudioPlayer();

    new ShipAudio(game.red_ship, this.audio);
    new ShipAudio(game.blue_ship, this.audio);
  }

  window.Game        = Game;
  window.GameDisplay = GameDisplay;
  window.GameAudio   = GameAudio;
})();
