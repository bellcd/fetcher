const path = require('path');
const express = require('express');
const app = express();
const PORT = 1128;

// console.log(path.join(__dirname, 'client/dist'))
// app.use(express.static());

app.listen(PORT, () => { console.log(`App is running on port ${PORT}`)});