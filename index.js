const express = require('express');
const webTorrent = require('webtorrent');
const serveIndex = require('serve-index');
const bodyParser = require('body-parser');
const cors = require('cors');
const dirTree = require("directory-tree");
const serverless = require('serverless-http');

const client = new webTorrent();
let port = process.env.PORT || 6969;

const app = express();

app.use(cors());

app.use('/file', express.static('file'), serveIndex('file', { 'icons': true }));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.post('/add-magnet', (req, res) => {
    try {
        const magnetURL = req.body.magnet;
        client.add(magnetURL, { path: './file' }, function (torrent) {
            torrent.files.forEach(function (file) {
                console.log(`Download: ${file.name}`);
            });
        });
    } catch (error) {
        res.send(error);
    }

});

app.post('/list-file', (req, res) => {
    const folder = req.body.folder;
    const listFile = dirTree(`./file/${folder}`).children;

    res.send(listFile);
})

// app.post('/upload-url', (req, res) => {
//     const url = req.body.url;
//     const fileStream = express.static('file');
//     fetch(url)
//         .then((response) => {
//             // response.body.pipe(fileStream);
//             // res.send(response);
//         });

// });

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

module.exports.handler = serverless(app);
