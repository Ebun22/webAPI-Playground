const express = require('express');
const http = require('http')
const app = express();
const server = http.createServer(app)
const path = require('path')
const PORT = 3000;
app.use(express.static(path.join(__dirname, 'client')));
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})