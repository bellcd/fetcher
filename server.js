const path = require('path');
const express = require('express');
const app = express();
const PORT = 1128;

app.use(express.static(path.join(__dirname, 'client/dist')));

app.listen(PORT, () => { console.log(`App is running on port ${PORT}`)});