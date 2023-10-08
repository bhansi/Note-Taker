const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Requests
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => 
    fs.readFile('./db/db.json', (err, data) =>
            err ?
            console.log("Error reading file: " + err) :
            res.json(JSON.parse(data))
    )
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// POST Request
app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if(err) {
            console.log("Error reading file: " + err);
        }
        else {
            const { title, text } = req.body;
            notes = JSON.parse(data);

            const newNote = {
                id: notes.length + 1,
                title: title,
                text: text
            }

            notes.push(newNote);

            fs.writeFile(
                './db/db.json',
                JSON.stringify(notes, null, 4),
                (err) =>
                    err ?
                    console.error(err) :
                    res.json("Note saved successfully.")
            );
        }
    });
});

// DELETE Request
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if(err) {
            console.log("Error reading file: " + err);
        }
        else {
            const index = req.params.id - 1;
            notes = JSON.parse(data);

            // Decrement the id member variable of each note after the note being removed
            notes.slice(index + 1).forEach((note) => note.id--);
            // Remove the note requested to be deleted
            notes.splice(index, 1);

            fs.writeFile(
                './db/db.json',
                JSON.stringify(notes, null, 4),
                (err) =>
                    err ?
                    console.error(err) :
                    res.json("Note saved successfully.")
            );
        }
    });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}\nLink: http://localhost:3001/`));
