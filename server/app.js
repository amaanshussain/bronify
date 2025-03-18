const express = require('express');
const cors = require('cors')
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs')

const app = express();
app.use(cors());
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

const SONGMAPPING = [
    {
        title: "Lebron James RnB",
        file: "lebronjames.wav",
        cover: ""
    },
    {
        title: "Lebron that I used to know",
        file: "lebronthatiusedtoknow.mp3",
        cover: ""
    },
    {
        title: "Thinking about Lebron",
        file: "thinkingaboutlebron.mp3",
        cover: ""
    },
    {
        title: "",
        file: "towardsthebron.mp3",
        cover: ""
    },
    {
        title: "Lebrons Rooms",
        file: "lebronsroom.mp3",
        cover: ""
    },
    {
        title: "Slow Dancing with Lebron",
        file: "slowdancingwithlebron.mp3",
        cover: ""
    },
    {
        title: "Die with Lebron",
        file: "diewithlebron.mp3",
        cover: ""
    },
    {
        title: "Lebrons Hour",
        file: "lebronshour.mp3",
        cover: ""
    },
    {
        title: "Lenade",
        file: "lenade.mp3",
        cover: ""
    },
    {
        title: "Heartbreak Broniversary",
        file: "heartbreakbroniversary.mp3",
        cover: ""
    },
    {
        title: "Am I Lebron",
        file: "amilebron.mp3",
        cover: ""
    },
    {
        title: "Lebron Fashion",
        file: "lebronfashion.mp3",
        cover: ""
    },
    {
        title: "Hey There Bronny",
        file: "heytherebronny.mp3",
        cover: ""
    },
    {
        title: "The Perfect Bron",
        file: "theperfectbron.mp3",
        cover: ""
    },
    {
        title: "Lebron Matter",
        file: "lebronmatter.mp3",
        cover: ""
    },
    {
        title: "Promiscuobron",
        file: "promiscuobron.mp3",
        cover: ""
    },
    {
        title: "A Thousand Brons",
        file: "athousandbrons.mp3",
        cover: ""
    },
    {
        title: "California Bron",
        file: "californiabron.mp3",
        cover: ""
    },
    {
        title: "My Lebron",
        file: "mybron.mp3",
        cover: ""
    },
]

app.get("/songs", (req, res) => {

    const newArray = SONGMAPPING.map(obj => ({...obj}));
    newArray.reverse();

    res.send({ songs: newArray })
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
        const buf = chunkBuffer(wav, CHUNKSIZE);

        const songinfo = SONGMAPPING.find(obj =>
            obj.file && obj.file.includes(data[0])
        );
        socket.emit("musicinfo", songinfo);

        sendBufferInChunks(socket, "musicdata", buf, CHUNKSIZE);

    })
});

