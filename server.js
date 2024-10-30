const express = require("express");

const path = require('path');
const app = require('./api');

app.use (
    express.static(
        path.join(__dirname, "views") //
    )
)

const port = process.env.PORT || 3003;

app.listen(port);

console.log(`Running: http://localhost:${port}`)

