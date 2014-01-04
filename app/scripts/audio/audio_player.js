(function(){
  'use strict';

  function AudioPlayer(){
  }
  AudioPlayer.prototype.play = function(sound_name){
    var sound = new Howl({urls: ['audio/' + sound_name]});
    sound.play();

    return sound;
  };


  //Exports:
  if (typeof module !== "undefined" && module !== null) {
    module.exports = AudioPlayer;
    module.exports.AudioPlayer = AudioPlayer;
  } else {
    window.AudioPlayer         = AudioPlayer;
  }
})();
