export default class NowPlaying {

    constructor(params) {
        this.title = params.title;
        this.artist = params.artist;
        this.album = params.album;
        this.station = params.station;
        this.series = params.series;
    }

    now() {
        this.time = new Date().getTime();
        return this;
    }

    toString() {
        if (this.title && this.series) return this.series + " - " + this.title
        else if (this.title) return this.title
    }

    toJson() {
        return JSON.stringify(this)
    }
}
