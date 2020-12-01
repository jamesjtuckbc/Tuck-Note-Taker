const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const path = require('path');
const fs = require('fs');
const { v4: uuid } = require('uuid');



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));




// Routes
app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', function (req, res) {
    getNotes(function (err, data) {
        res.json(data);
    });
});

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/api/notes', function (req, res) {
    const note = { ...req.body, id: uuid() };
    postNotes(note, function (err, data) {
        res.json(data);
    });
});

app.delete('/api/notes/:id', function (req, res) {
    deleteNotes(req);
    res.sendFile(path.join(__dirname, '/public/notes.html'));
})


// Functions
function getNotes(cb) {
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', function (err, data) {
        if (err) throw err;
        cb(null, JSON.parse(data));
    })
};

function postNotes(note, cb) {
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', function (err, data) {
        if (err) throw err;
        const notes = JSON.parse(data)
        notes.push(note);
        fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes), function (err, data) {
            if (err) throw err;
            cb(null, notes);
        })
    })
};

function deleteNotes(req) {
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', function (err, data) {
        if (err) throw err;
        const notes = JSON.parse(data)
        const newNotes = notes.filter((item) => item.id != req.params.id);
        fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(newNotes), function () { });
    })
}

app.listen(PORT, function () {
    console.log('App listening on PORT: ' + PORT);
});
