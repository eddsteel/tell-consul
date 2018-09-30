import NowPlaying from './nowplaying'

const Youtube = {
  isPlaying: () => {
    var video =  document.querySelector("video");
    return video !== null && video.paused === false;
  },
    
  extract: () => {
    var title = document.querySelector("h1.title > yt-formatted-string").firstChild.data;
      
    return new NowPlaying({"title": title});
  }
}

export default Youtube
