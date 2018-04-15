import NowPlaying from './nowplaying'
import Consul from './consul'
import PlayMusic from './playmusic'
import Netflix from './netflix'

console.log("tell consul yo")

//- extract
var Extract = (function(){
  var extractors = {
    "netflix": {"isPlaying": Netflix.isPlaying, "extract": Netflix.extract},
    "play-music": {"isPlaying": PlayMusic.isPlaying, "extract": PlayMusic.extract}
  }

  var addresses = {
    "netflix": /^https:\/\/www.netflix.com\//,
    "play-music": /^https:\/\/play.google.com\/music\//
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
                Consul.publish("now-playing", np).then(function(){console.log("Now playing", np)})
                lastJSON = np.toJson()
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
