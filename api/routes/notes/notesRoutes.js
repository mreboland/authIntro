const express = require('express')
const { getNotesByUser, createNote, getNoteById, updateNoteById } = require('./notesController');
const { verifyToken } = require("../../middleware/verifyToken");

const router = express.Router();
router.use(verifyToken);
router.route('/')
  .get(async (req, res) => {
    try {
      const notes = await getNotesByUser(req.user.id);
      res.json({ data: notes });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'internal server error' });
    }
  })
  .post(async (req, res) => {
    try {
      const { body } = req;
      if (!body.text || body.text === '') {
        res.status(400).json({ message: 'text must be provided' });
      }
      const newNote = {
        text: body.text,
        user: req.user.id,
      }
      const id = await createNote(newNote)
      res.json({ data: { id } });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'internal server error' });
    }

  });

router.route('/:id')
  .get(async (req, res) => {
    try {
      const { params } = req;
      const note = await getNoteById(params.id);
      res.json({ data: note });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'internal server error' });
    }
  })
  .put(async (req, res) => {
    try {
      const { body, params } = req;
      if (!body.text || body.text === '') {
        res.status(400).json({ message: 'text must be provided' });
      }

      const newNote = await updateNoteById({
        text: body.text,
        id: params.id,
        user: req.user.id
      });

      res.json({ data: newNote });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'internal server error' });
    }
  });

module.exports = router;