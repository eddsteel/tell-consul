import NowPlaying from './nowplaying'

const Crave = {
    isPlaying: () => {
        var player = document.querySelector("video-player div.jw-icon-playback")
        return player != null && player.getAttribute("aria-label") == "Pause"
    },

    extract: () => {
        var title = document.querySelector("div.jw-title-primary").firstChild.data
        return new NowPlaying({"title": title})
    }
}

export default Crave
