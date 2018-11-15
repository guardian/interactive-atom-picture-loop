// javascript goes here
var d;
import loadJson from '../components/load-json/'

var pictureLoops = getPictureLoops();
processIfWinner(pictureLoops);

function getPictureLoops() {
  var parentDoc = window.parent.document;

  var allAtoms = [].slice.call(parentDoc.querySelectorAll('.element-atom'));
  return allAtoms.filter(function(atom) {
    if (atom.hasAttribute('data-alt') == true) {
      var atomAlt = atom.getAttribute('data-alt').trim();
      if (atomAlt.indexOf('https://interactive.guim.co.uk/docsdata')==0) {
        return true;
      }
    }
  });
}

function processIfWinner(pictureLoops) {
  var keyAtom = pictureLoops[0];
  if (!keyAtom.classList.contains('processed')) {
    console.log('Processing based on', keyAtom);
    
    // Process all the atoms here
    keyAtom.classList.add('processed');

    var jsonUrl = keyAtom.getAttribute('data-alt').trim();
    
    loadJson(jsonUrl).then((rawSheet) => {
      
      // written this way so they can change the name of the tab and it won't break
      var firstTabName = Object.keys(rawSheet.sheets)[0]
      var data = rawSheet.sheets[firstTabName];
      
      pictureLoops.forEach(function(atom, i) {
        var atomDoc = atom.querySelector('iframe').contentWindow.document;
        if (data[i]) {
          makePictureLoop(atomDoc, atom, data[i]);
        } else {
          
          console.warn('Insufficient data in the google sheet to create ', i+1, ' picure loops . Removing element between',  atom.previousElementSibling, 'and', atom.nextElementSibling);
          atom.remove();
          
        }
      })
    });

  }
}


function makePictureLoop(atom, atomWrapper, data) {
  var videoEl = atom.querySelector('.picture-loop__video');
  var imgEl = atom.querySelector('.picture-loop__image');
  
  imgEl.setAttribute('src', data.photo);
  imgEl.addEventListener('load', function() {
    window.resize();
  })

}




// function fmtMSS(sf){
//   var s = Math.round(sf);
//   return(s-(s%=60))/60+(9<s?':':':0')+s;
// }


// function pauseAllAudio() {
//   var allAudio = document.querySelectorAll('audio');
//   for (var i = 0; i < allAudio.length; ++i) {
//     var audio = allAudio[i];
//     var wrapper = audio.closest('.interactive-audio-player-wrapper').querySelector('.player');
//     if (wrapper && !audio.paused) {
//       audio.pause();
//       wrapper.dataset.paused = 'true';
//     }
//   }
// }
