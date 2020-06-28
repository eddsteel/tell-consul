import Consul from './consul'
import Crave from './crave'
import Netflix from './netflix'
import NowPlaying from './nowplaying'
import PlayMusic from './playmusic'
import Shudder from './shudder'
import Twitch from './twitch'
import Youtube from './youtube'

console.log("tell consul yo")

//- extract
var Extract = (function(){
  var extractors = {
    "crave": {"isPlaying": Crave.isPlaying, "extract": Crave.extract},
    "netflix": {"isPlaying": Netflix.isPlaying, "extract": Netflix.extract},
    "play-music": {"isPlaying": PlayMusic.isPlaying, "extract": PlayMusic.extract},
    "shudder": {"isPlaying": Shudder.isPlaying, "extract": Shudder.extract},
    "twitch": {"isPlaying": Twitch.isPlaying, "extract": Twitch.extract},
    "youtube": {"isPlaying": Youtube.isPlaying, "extract": Youtube.extract},
  }

  var addresses = {
    "crave": /^https:\/\/www.crave.ca\//,
    "netflix": /^https:\/\/www.netflix.com\//,
    "play-music": /^https:\/\/play.google.com\/music\//,
    "shudder": /^https:\/\/www.shudder.com\/play\//,
    "twitch": /^https:\/\/www.twitch.tv\//,
    "youtube": /^https:\/\/www.youtube.com\//,
  }

  function findExtractor(location) {
    var kv = Object.entries(addresses).find(a => a[1].test(location))
    if (kv !== undefined && kv.length > 0) {
      return extractors[kv[0]]
    } else {
      return null
    }
  }

  return {
    extractNowPlaying: function() {
      var extractor = findExtractor(window.location)
      if (extractor !== undefined && extractor.isPlaying())
        return extractor.extract()
    }
  }
})()
//-

//- browser
var BrowserAddOn = (function(){

    var lastJSON = ""

    var attach = function() {
        window.setInterval(publishNowPlaying, 10000)
    }

    var publishNowPlaying = function() {
        var np = Extract.extractNowPlaying()
        if (np !== undefined && np.title !== undefined) {
            if (lastJSON !== np.toJson()) {
                lastJSON = np.toJson()
                Consul.publish("now-playing", np.now()).then(function(){console.log("Now playing", np)})
            } else {
                console.log("Still playing", np.title + ".")
            }
        } else {
            console.log("Nothing's playing.")
        }
    }

    return {
        attach: attach,
        publishNowPlaying: publishNowPlaying
    }
})()
//-

BrowserAddOn.attach()
