//- now playing
var NowPlaying = function (params) {
    this.title = params.title;
    this.artist = params.artist;
    this.album = params.album;
    this.station = params.station;
    this.series = params.series;
}

NowPlaying.prototype.toString = function() {
    if (this.title && this.series) return this.series + " - " + this.title;
    else if (this.title) return this.title;
}

NowPlaying.prototype.toJson = function() {
    return JSON.stringify(this);
}
//-


//- consul
var Consul = (function() {
    var consulURL = "https://localhost:8543/v1/kv/"

    var publish = function(key, data) {
        return fetch(consulURL + key, {
            method: 'PUT',
            body: JSON.stringify(data),
        }).then(res => res.json())
            .then(
                function(response) {
                    console.log('Success:', response)
                    return response
                },
                function(error) {console.error('Error:', error)});
    }

    function consulValue(objs){
        var val = objs[0]["Value"]
        var str = atob(val)
        return JSON.parse(str);
    }

    var retrieve = function(key) {
        return fetch(consulURL + key).then(res => res.json())
            .then(function(response) { console.log('Success:', response); return consulValue(response) },
                  function(error) { console.error('Error:', error) });
    }

    return {
        retrieve: retrieve,
        publish: publish
    };
})();
//-

//- extract
var Extract = (function(){
    var extractNetflix = function() {
        var titleBox = document.querySelector(".video-title h4");
        var title;
        if (titleBox !== null) title = titleBox.firstChild.data; else title = undefined;
        var spansBox = document.querySelector(".video-title");
        var spans;
        if (spansBox !== null) spans = spansBox.querySelectorAll("span"); else spans = undefined;

        if (title !== undefined && spans !== undefined && spans.length == 0) {
            return new NowPlaying({"title": title});
        } else if (spans.length == 2) {
            var episode = spans[1].firstChild.data;
            return new NowPlaying({"title": episode, "series": title});
        }
    }

    var isPlayingNetflix = function() {
        return document.querySelector(".button-nfplayerPause") !== null;
    }

    var extractPlayMusic = function() {
        var artist = document.querySelector(".player-artist").firstChild.data;
        var title = document.querySelector("#currently-playing-title").firstChild.data;
        var album = document.querySelector(".player-album").firstChild.data;

        return new NowPlaying({"artist": artist, "title": title, "album": album});
    }

    var isPlayingPlayMusic = function() {
        return document.querySelector("#player-bar-play-pause").title == "Pause";
    }


    var extractors = {
        "netflix": {"isPlaying": isPlayingNetflix, "extract": extractNetflix},
        "play-music": {"isPlaying": isPlayingPlayMusic, "extract": extractPlayMusic}
    }

    var addresses = {
        "netflix": /^https:\/\/www.netflix.com\//,
        "play-music": /^https:\/\/play.google.com\/music\//
    }

    function findExtractor(location) {
        var kv = Object.entries(addresses).find(a => a[1].test(location));
        if (kv !== undefined && kv.length > 0) {
            return extractors[kv[0]];
        } else {
            return null;
        }
    }

    return {
        extractNowPlaying: function() {
            var extractor = findExtractor(window.location);
            if (extractor !== undefined && extractor.isPlaying())
                return extractor.extract();
        }
     }
})();
//-

//- browser
var BrowserAddOn = (function(){

    var lastJSON = "";

    var attach = function() {
        window.setInterval(publishNowPlaying, 10000);
    };

    var publishNowPlaying = function() {
        var np = Extract.extractNowPlaying();
        if (np !== undefined && np.title !== undefined) {
            if (lastJSON !== np.toJson()) {
                Consul.publish("now-playing", np).then(function(){console.log("Now playing", np);})
                lastJSON = np.toJson();
            } else {
                console.log("Still playing", np.title + ".")
            }
        } else {
            console.log("Nothing's playing.")
        }
    };

    return {
        attach: attach,
        publishNowPlaying: publishNowPlaying
    }
})()
//-

BrowserAddOn.attach();
