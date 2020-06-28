import NowPlaying from './nowplaying'

const Twitch = {
    isPlaying: () => {
        var button = document.querySelector("button[data-a-target=player-play-pause-button]");
        return button != null && button.getAttribute("data-a-player-state") == "playing";
    },

    extract: () => {
        var title = document.querySelector("h2[data-a-target=stream-title]").getAttribute("title");
        return new NowPlaying({"title": title});
    }
}

export default Twitch

