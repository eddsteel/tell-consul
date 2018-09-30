import NowPlaying from './nowplaying'

const Shudder = {
  isPlaying: () => {
    var video = document.querySelector('video');
    return video !== null && video.paused === false;
  },

  extract: () => {
    var title = document.querySelector('div.jw-title').firstChild.firstChild.data
    return new NowPlaying({"title": title})
  }
}

export default Shudder
