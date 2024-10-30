const express = require("express");

const app = express();

app.use(express.json());

let buttonData = ["red", "green", "red"];

app.get("/api/buttons/data", function (req, res) {
    res.status(200).json(buttonData);
});

app.post("/api/buttons/data/new", function (req, res) {
    // checking if the body have values. If not throw a 400 status error. 
    if (!req.body.value || !req.body.value.label) {
        return res.status(400).json({ error: "Valid label and numeric value are required." });
    }
    // if it does have a value, push it into the buttonData array
    buttonData.push(req.body.value.label); 
    res.status(200).json(buttonData);
});

app.delete("/api/buttons/data/delete", function (req, res) {
    // const for index of the value in the body
    const index = buttonData.indexOf(req.body.value);
    
    // if the index is found. It removes it from button Data. Returns an error if the index is not found. 
    if (index !== -1) {
        buttonData.splice(index, 1);
        res.status(200).json(buttonData);
    } else {
        res.status(400).json({ error: "Data point not found" });
    }
});

module.exports = app;