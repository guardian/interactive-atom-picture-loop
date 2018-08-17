// javascript goes here

import loadJson from '../components/load-json/'

loadJson("https://interactive.guim.co.uk/docsdata-test/1BKSKfM9hmF6H-q_YP38_KxMcuHLopKFPBj0n7iQKEbw.json")
  .then((rawSheet) => {
    

    var data = rawSheet.sheets.Sheet1;
    
    var embeds = document.querySelectorAll('.interactive-audio-player-wrapper');
    
    for (var i = 0; i < embeds.length; ++i) {
      var embed = embeds[i];
      if (embed && data[i] && !embed.classList.contains('processed')) {
        embed.classList.add('processed');
        embed.querySelector('.caption-wrapper__text').innerText = data[i]['Caption'];
        
        var audio = new Audio(data[i]['MP3']);
        embed.appendChild(audio);

        
        setupAudio(embed);

        window.resize();
      }
    }
  });


function setupAudio(embed) {
  var wrapper = embed.querySelector('.player');
  var playButton = wrapper.querySelector('.player__play-pause');
  var audio = embed.querySelector('audio');
  var ellipseFull = embed.querySelector('.circle.full ellipse');

  audio.addEventListener('timeupdate', function() {
    var playRatio = audio.currentTime/audio.duration;
    var playStroke = Math.round(playRatio*100);
    if (playRatio) {
      ellipseFull.setAttribute('stroke-dasharray', '0 '+playStroke+' 100');
      
    }
  })

  // Play events
  audio.addEventListener('playing', function() { wrapper.dataset.paused = 'false'; });
  audio.addEventListener('play', function() { wrapper.dataset.paused = 'false'; });

  // Pause events
  audio.addEventListener('pause', function() { wrapper.dataset.paused = 'true'; });
  audio.addEventListener('stalled', function() { wrapper.dataset.paused = 'true'; });
  audio.addEventListener('waiting', function() { wrapper.dataset.paused = 'true'; });
  audio.addEventListener('ended', function() {
    wrapper.dataset.paused = 'true';
    ellipseFull.setAttribute('stroke-dasharray', '0 0 100');
  });

  playButton.addEventListener('click', function() {
    if (audio.paused) {
      pauseAllAudio();
      audio.play();
      wrapper.dataset.paused = 'false';
    } else {
      audio.pause();
      wrapper.dataset.paused = 'true';
    }
  });
}


function pauseAllAudio() {
  var allAudio = document.querySelectorAll('audio');
  for (var i = 0; i < allAudio.length; ++i) {
    var audio = allAudio[i];
    var wrapper = audio.closest('.interactive-audio-player-wrapper').querySelector('.player');
    if (wrapper && !audio.paused) {
      audio.pause();
      wrapper.dataset.paused = 'true';
    }
  }
}
