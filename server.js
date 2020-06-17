const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const port = process.env.PORT || 1337;


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb' , extended: true }));
app.use(cors());

let rooms = {};

app.use(express.static(path.join(__dirname, '/client/build/')));


app.get('/event-stream/', (req, res) => {
    const clientId = uuidv4();
    const { rName, name } = req.query;
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
    });

    if (rooms[rName]) {
        rooms[rName].clients.push({ clientId, name, rName, res });
        let messages = rooms[rName].messages;
        for (let i = 0; i < messages.length; i++) {
            let data = `data: ${JSON.stringify({ ...messages[i] })}\n\n`;
            res.write(data);
        }
    } else {
        rooms[rName] = { clients: [{ clientId, name, rName, res }], messages: [] };
    }
    res.on('close', () => {
        if (rooms[rName]) {
            rooms[rName].clients = (rooms[rName].clients.filter(client => client.clientId !== clientId) || []);
        }
    })
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build/index.html'));
})

app.post('/message', (req, res) => {

    const { rName, name, message } = req.body;
    if (message.trim() === "") {
        return res.status(200, { message: "Message cant be empty." });
    }
    const key = uuidv4();
    let data = `data: ${JSON.stringify({ ...req.body, key, type: 'message' })}\n\n`;
    if (rooms[rName]) {
        rooms[rName].messages.push({ ...req.body, key, type: 'message'});
        rooms[rName].clients.forEach(client => {
            client.res.write(data);
        });
    }
    return res.status(200).send({ message: "Successfully Sent" });
})

app.post('/image', (req, res) => {
    const {rName, name, baseString} = req.body; 
    const key = uuidv4();
    let data = `data: ${JSON.stringify({ ...req.body, key })}\n\n`;
    if (rooms[rName]) {
        rooms[rName].messages.push({ ...req.body, key, type: 'image'});
        rooms[rName].clients.forEach(client => {
            client.res.write(data);
        });
    }
    return res.status(200).send({ message: "Successfully Sent" });
})

const server = app.listen(port, () => {
    console.log('server started on port: 1337');
});
