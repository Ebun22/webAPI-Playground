const express = require('express');
const app = express();
const path = require('path')
const PORT = 3000;
app.use(express.static(path.join(__dirname, 'client')));
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})