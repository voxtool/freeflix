const fs = require("fs");
const { Movie } = require('../models');
const { User } = require('../models');
const path = require('path');
const torrentStream = require('torrent-stream');
const TorrentSearchApi = require('torrent-search-api');
TorrentSearchApi.enableProvider('ThePirateBay');
const download = require("download");
const OS = require("opensubtitles-api");
const OpenSubtitles = new OS({ useragent: 'UserAgent' });
const subtitleDir = path.join(__dirname, '../../src/subtitles/');
let magnets = {};
let ids = [];
let imdbId = [];


async function searchMovies(req, res, next) {
    magnets = {};
    ids = [];
    imdbId = [];
    const search = req.params.query;
    try {
        const searchResults = await TorrentSearchApi.search(search, 'Video', 5);
        searchResults.forEach(el => {
            magnets[el.id] = el.magnet;
            ids.push(el.id);
            imdbId.push(el.imdb);
        });
        fs.readdir(subtitleDir, (err, files) => {
            if (err) {
                console.log(err)
                throw err
            }
            for (const file of files) {
                fs.unlink(path.join(subtitleDir, file), err => {
                    if (err) {
                        console.log(err)
                        throw err
                    }
                });
            }
        });
        res.json(ids);
    } catch (error) {
        console.log(error);
    }
}

async function playMovie(req, res, next) {
    const id = req.params.id;
    const engine = torrentStream(magnets[id], { tmp: path.join(__dirname, '../../') });

    engine.on('ready', function () {
        file = engine.files.find(f => path.extname(f.name).includes('.mp4') ||
            path.extname(f.name).includes('.mkv') ||
            path.extname(f.name).includes('.avi') ||
            path.extname(f.name).includes('.xvid') ||
            path.extname(f.name).includes('.divx'));

        if (req.headers.range) {
            const range = req.headers.range;
            const positions = range.replace(/bytes=/, "").split("-");
            const start = parseInt(positions[0], 10);
            const total = file.length;
            const end = positions[1] ? parseInt(positions[1], 10) : total - 1;
            const chunk = (end - start) + 1;

            stream = file.createReadStream({ start: start, end: end });
            stream.pipe(res);
            res.writeHead(206, {
                "Content-Range": "bytes " + start + "-" + end + "/" + total,
                "Accept-Ranges": "bytes",
                "Content-Length": chunk,
                "Content-Type": "video/mp4"
            });
        } else {
            stream = file.createReadStream();
            stream.pipe(res);
        }
    });

    req.on('close', function () {
        engine.remove(() => engine.destroy(() => console.log('closed removed and destoyed')));
    });

    req.on('end', function () {
        engine.remove(() => engine.destroy(() => console.log('ended removed and destoyed')));
    });
}

async function getSubtitles(req, res, next) {
    const movieId = imdbId.find(el => el !== '');
    await OpenSubtitles.search({
        sublanguageid: "eng",
        extensions: ["srt", "vtt"],
        imdbid: movieId
    }).then(async subtitles => {
        let subPath = subtitleDir;
        let subPathEn = undefined;
        if (subtitles.en && subtitles.en.vtt && !fs.existsSync(subPath + movieId + "_" + "en.vtt")) {
            await download(subtitles.en.vtt)
                .then(data => {
                    fs.writeFileSync(subPath + movieId + "_" + "en.vtt", data);
                })
                .catch(err => {
                    console.log("No english subtitles");
                });
            subPathEn = fs.existsSync(subPath + movieId + "_" + "en.vtt")
                ? movieId + "_" + "en.vtt"
                : undefined;
        } else if (fs.existsSync(subPath + movieId + "_" + "en.vtt")) {
            subPathEn = movieId + "_" + "en.vtt";
        }
        return res.status(200).json(subPathEn);
    });
}

async function addMovie(req, res, next) {
    const { imageUrl, title, externalId } = req.body;
    const { _id: userId } = req.user;

    try {
        const movie = await Movie.create({ imageUrl, title, externalId, userId });
        const user = await User.findByIdAndUpdate({ _id: userId }, { $addToSet: { movies: movie._id } }, { new: true }).select(['email', 'movies']).populate('movies');
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

async function deleteMovie(req, res, next) {
    const { movieId } = req.params;
    const { _id: userId } = req.user;

    try {
        const deleted = await Movie.findOneAndDelete({ _id: movieId });
        const user = await User.findByIdAndUpdate({ _id: userId }, { $pull: { movies: movieId } }, { new: true }).select(['email', 'movies']).populate('movies');
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

async function getMovies(req, res, next) {
    const { pageSize, page } = req.params;
    const user = req.user;
    try {
        const movies = await Movie.find({ _id: { $in: user.movies } }).sort({ created_at: -1 }).limit(Number(pageSize)).skip((Number(page) - 1) * Number(pageSize));
        const total = await Movie.countDocuments({ _id: { $in: user.movies } });
        const pages = Math.ceil(total / Number(pageSize));
        res.json({ pages, movies });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    playMovie,
    searchMovies,
    addMovie,
    deleteMovie,
    getMovies,
    getSubtitles
}