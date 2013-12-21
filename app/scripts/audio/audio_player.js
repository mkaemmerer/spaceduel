!(function(){
  function AudioPlayer(){
  };
  AudioPlayer.prototype.play = function(sound_name){
    var sound = new Howl({urls: ['audio/' + sound_name]});
    sound.play();

    return sound;
  };

  window.AudioPlayer = AudioPlayer;
})();
