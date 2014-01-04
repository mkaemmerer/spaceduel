(function(){
  'use strict';

  //Imports:
  var Bacon  = require('baconjs')
    , Vector = require('./core/vector')
    , S      = Vector.S
    , V2     = Vector.V2
    , P2     = Vector.P2
    , Collisions  = require('./game/collisions')
    , World       = require('./game/world')
    , Stage       = require('./graphics/stage')
    , AudioPlayer = require('./audio/audio_player')
    , Controls    = require('./controls')
    , Controller  = Controls.Controller
    , Ship        = require('./ship')
    , ShipAudio   = Ship.ShipAudio
    , ShipDisplay = Ship.ShipDisplay;


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


  //Exports:
  if (typeof module !== "undefined" && module !== null) {
    module.exports = Game;
    module.exports.Game        = Game;
    module.exports.GameDisplay = GameDisplay;
    module.exports.GameAudio   = GameAudio;
  } else {
    window.Game        = Game;
    window.GameDisplay = GameDisplay;
    window.GameAudio   = GameAudio;
  }
})();
