import NowPlaying from './nowplaying'

const PlayVideo = {
    isPlaying: () => {
        let button = document.querySelector("button.ytp-play-button");
        button !== null && button.title === "Pause (k)"
    }

    extract: () => {
        if (title !== undefined) {
            if (series !== undefined) {
                return new NowPlaying({"title": title, "series": series})
            } else {
                return new NowPlaying({"title": title})
            }
        }
    }
}

export default PlayVideo
