const fs = require("fs");
const { Movie } = require('../models');
const { User } = require('../models');
const path = require('path');
const TorrentSearchApi = require('torrent-search-api');
TorrentSearchApi.enableProvider('ThePirateBay');
const download = require("download");
const rmdir = require('rimraf');
const subsrt = require('subsrt');
const WebTorrent = require('webtorrent');
const OS = require("opensubtitles-api");
const client = new WebTorrent();
const OpenSubtitles = new OS({ useragent: 'UserAgent' });
const streamDir = path.join(__dirname, '../../stream');
const subtitleDir = path.join(__dirname, '../../src/subtitles/');
let magnets = {};
let ids = [];
let imdbId = [];
let torId;


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
        res.json(ids);
    } catch (error) {
        console.log(error);
    }
}

async function playMovie(req, res, next) {
    const id = req.params.id;
    if (client.get(magnets[id])) {
        const file = client.get(magnets[id]).files.find(function (file) {
            return file.name.endsWith('.mp4') ||
                file.name.endsWith('.mkv') ||
                file.name.endsWith('.avi') ||
                file.name.endsWith('.xvid') ||
                file.name.endsWith('.divx')
        });
        if (req.headers.range) {
            const range = req.headers.range;
            const positions = range.replace(/bytes=/, "").split("-");
            const start = parseInt(positions[0], 10);
            const total = file?.length;
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
    } else {
        client.add(magnets[id], { path: streamDir }, function (torrent) {
            torId = magnets[id];
            const file = torrent.files.find(function (file) {
                return file.name.endsWith('.mp4') ||
                    file.name.endsWith('.mkv') ||
                    file.name.endsWith('.avi') ||
                    file.name.endsWith('.xvid') ||
                    file.name.endsWith('.divx')
            });
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
        })
    }
}

async function clean(req, res, next) {
    if (client.get(torId)) {
        client.remove(torId, (err) => { })
    }
    rmdir(streamDir, function (error) {
        if (error) {
            console.log(error)
        }
    });
    res.status(200).json('Movies cleaned!')
}

async function subClean(req, res, next) {
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
    res.status(200).json('Subtitles cleaned!');
}

async function getSubtitles(req, res, next) {
    const movieId = imdbId.find(el => el !== '');
    if (movieId) {
        await OpenSubtitles.search({
            sublanguageid: "eng",
            extensions: "srt",
            imdbid: movieId
        }).then(async subtitles => {
            let subPath = subtitleDir;
            let subPathEn = undefined;
            if (subtitles.en) {
                await download(subtitles.en.url)
                    .then(data => {
                        fs.writeFileSync(subPath + movieId + "_" + "en.srt", data);
                    })
                    .catch(err => {
                        console.log("No english subtitles");
                    });
                const srt = fs.readFileSync(subPath + movieId + "_" + "en.srt", 'utf8');
                const vtt = subsrt.convert(srt, { format: 'vtt' });
                fs.writeFileSync(subPath + movieId + "_" + "en.vtt", vtt);
                subPathEn = fs.existsSync(subPath + movieId + "_" + "en.vtt")
                    ? movieId + "_" + "en.vtt"
                    : undefined;
            }
            return res.status(200).json(subPathEn);
        });
    } else {
        return res.status(200).json(undefined);
    }
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
    getSubtitles,
    clean,
    subClean
}