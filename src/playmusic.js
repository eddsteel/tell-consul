import NowPlaying from './nowplaying'

const PlayMusic = {
  isPlaying: () => document.querySelector("#player-bar-play-pause").title == "Pause",
  extract: () => {
    let artist = document.querySelector(".player-artist").firstChild.data
    let title = document.querySelector("#currently-playing-title").firstChild.data
    let album = document.querySelector(".player-album").firstChild.data

    return new NowPlaying({"artist": artist, "title": title, "album": album})
  }
}

export default PlayMusic
