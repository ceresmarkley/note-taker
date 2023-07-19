const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const api = express.Router();
api.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: 'Failed to read notes, please check the routes or there is no saved note' });
        }
        const notes = JSON.parse(data);
        res.json(notes);
    });
});

api.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    const inputNote = {
        id: uuidv4(),
        title: title,
        text: text,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
    };

    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: 'Failed to read notes' });
        }

        const notes = JSON.parse(data);

        notes.push(inputNote);

        fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(notes), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to save note' });
            }

            res.json(inputNote);
        });
    });
});

api.delete('/api/notes/:id', (req, res) => {
    const deleteId = req.params.id;
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: 'Failed to read notes' });
        }

        const notes = JSON.parse(data);
        // use array.filter() to find matched id, array here is notes
        const newNotes = notes.filter((db) => db.id !== deleteId);
        // same length means notes and newNotes are no difference
        if (notes.length === newNotes.length) {
            return res.status(404).json({ oops: 'Can not find id in database! Please check id carefully!' })
        }

        fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(newNotes), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to delete note' });
            }
            res.status(200).json({ wow: 'You just delete a note.' })
        });
    });
});
module.exports = api;