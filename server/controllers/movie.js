const path = require('path');
const torrentStream = require('torrent-stream');
const TorrentSearchApi = require('torrent-search-api');
TorrentSearchApi.enableProvider('ThePirateBay');
let magnets = {};
let ids = [];


async function searchMovies(req, res, next) {
    magnets = {};
    ids = [];
    const search = req.params.query;
    try {
        const searchResults = await TorrentSearchApi.search(search, 'Video', 5);
        searchResults.forEach(el => {
            magnets[el.id] = el.magnet;
            ids.push(el.id);
        })
        res.json(ids);
    } catch (error) {
        console.log(error);
    }
}

async function playMovie(req, res, next) {
    const id = req.params.id;
    const engine = torrentStream(magnets[id]);

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
        engine.destroy(() => console.log('closed and destoyed'));
        engine.remove(() => console.log('closed and removed'));
    });

    req.on('end', function () {
        engine.destroy(() => console.log('ended and destoyed'));
        engine.remove(() => console.log('ended and removed'));
    });
}


module.exports = {
    playMovie,
    searchMovies
}