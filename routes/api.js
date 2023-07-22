// create express, fs, path, and uuidv4 objects using require, connecting to modules. 
// Will allow router (for express), join (for path), fs (for fs) and uuidv4() (for uuid) modules.
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// create api object using express.Router to manage notes.
const api = express.Router();
// This function gets all the notes from the database.
api.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: 'Failed! Unable to read notes. Please check routes.' });
        }
        // Parse the notes from JSON into an array.
    const notes = JSON.parse(data);

    // Return the notes to the client.
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
            return res.status(400).json({ error: 'Failed! Unable to read notes.' });
        }

        const notes = JSON.parse(data);

        notes.push(inputNote);

        fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(notes), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed! Unable to save notes.' });
            }

            res.json(inputNote);
        });
    });
});

// function to delete notes from database
api.delete('/api/notes/:id', (req, res) => {
    // gets the uuid for the note being deleted.
    const deleteId = req.params.id;
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: 'Failed! Unable to read notes.' });
        }

        const notes = JSON.parse(data);
        // creates new array of notes without the note of specified ID
        const newNotes = notes.filter((db) => db.id !== deleteId);
        // If the new array is the same length as the original array, then the note was not found.
        if (notes.length === newNotes.length) {
            return res.status(404).json({ oops: 'Can not find id in database! Please check id carefully!' })
        }
        // Write the new array of notes to the database.
        fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(newNotes), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed! Note was not deleted' });
            }
            res.status(200).json({ wow: 'Note Deleted!' })
        });
    });
});
module.exports = api;