const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.get("/", (req, res) => {
    res.send("Server is running.");
});

app.get("/songs", (req, res) => {

    const file = fs.readFileSync("files.txt");
    const data = file.toString()

    const mapping = [];
    data.split("\n").map(songdata => {
        if (songdata === "") return;
        mapping.push({
            title: songdata.split(":")[0],
            file: songdata.split(":")[1],
            cover: songdata.split(":")[2]
        })
    })

    res.send({ songs: mapping.reverse() })
})

app.post("/upload", async (req, res) => {

    const title = req.body.title;
    const filename = req.body.title.toLowerCase().replaceAll(" ", "_");
    const url = req.body.url;

    const key = req.body.key;
    if (process.env.UPLOAD_KEY !== key) {
        res.send({ error: "Invalid upload key." });
        return;
    }

    const songsFile = fs.readFileSync("files.txt");
    const songsData = songsFile.toString();
    if (songsData.includes(filename)) {
        res.send({ error: "File name already exists" });
        return;
    }

    try {
        const response = await fetch("https://snap-video3.p.rapidapi.com/download", {
            method: 'POST',
            headers: {
                'x-rapidapi-key': process.env.RAPID_API_KEY,
                'x-rapidapi-host': 'snap-video3.p.rapidapi.com',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                url: url
            })
        });
        const result = await response.json();

        for (let i = 0; i < result.medias.length; i++) {
            const mediaType = result.medias[i];
            if (mediaType.extension !== "mp3") {
                continue;
            }

            const downloadUrl = mediaType.url;
            const response = await fetch(downloadUrl);
            const buffer = await response.arrayBuffer();
            fs.writeFileSync(`audio/${filename}.mp3`, Buffer.from(buffer));

            let data = songsFile.toString();
            data += `${title}:${filename}.mp3:\n`
            fs.writeFileSync("files.txt", data)
        }

        res.send({ response: "Song added." });
    } catch (error) {
        res.send({ error });
    }

})

function chunkBuffer(buffer, chunkSize) {
    const chunks = [];
    for (let i = 0; i < buffer.length; i += chunkSize) {
        chunks.push(buffer.slice(i, i + chunkSize));
    }
    return chunks;
}
function sendBufferInChunks(socket, eventName, buffer, chunkSize) {
    const chunks = chunkBuffer(buffer, chunkSize);
    chunks.forEach((chunk, index) => {
        socket.emit(eventName, { index: index, data: chunk, totalChunks: chunks.length });
    });
}
// Handle new socket connections
io.on('connection', (socket) => {
    console.log(socket.id)
    socket.on('playsong', (...data) => {

        const CHUNKSIZE = 8192
        const wav = fs.readFileSync(`audio/${data[0]}`);

        const file = fs.readFileSync("files.txt");
        const songData = file.toString()

        const mapping = [];
        songData.split("\n").map(songdata => {
            if (songdata === "") return;
            mapping.push({
                title: songdata.split(":")[0],
                file: songdata.split(":")[1],
                cover: songdata.split(":")[2]
            })
        })

        const songinfo = mapping.find(obj =>
            obj.file && obj.file.includes(data[0])
        );
        socket.emit("musicinfo", songinfo);

        sendBufferInChunks(socket, "musicdata", wav, CHUNKSIZE);

    })
});

