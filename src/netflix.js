import NowPlaying from './nowplaying'

const Netflix = {
  // we pretty much never have netflix paused in another tab while
  // watching/listening to something else I guess?
  isPlaying: () => document.querySelector(".button-nfplayerPause") !== null,

  extract: () => {
    var titleBox = document.querySelector(".video-title h4")
    var title = undefined

    if (titleBox !== null) {
      title = titleBox.firstChild.data
    }

    var spansBox = document.querySelector(".video-title")
    var spans = undefined
    if (spansBox !== null) {
      spans = spansBox.querySelectorAll("span")
    }

    if (title !== undefined && spans !== undefined && spans.length == 0) {
      return new NowPlaying({"title": title})
    } else if (spans.length == 2) {
      var episode = spans[1].firstChild.data
      return new NowPlaying({"title": episode, "series": title})
    }
  }
}

export default Netflix
