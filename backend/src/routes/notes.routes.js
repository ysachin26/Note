//@ts-check
const router = require('express').Router()

const authMiddlware = require('../middleware/auth.middleware')
const noteController = require('../controllers/notes.controller')

// protected routes
router.post('/', authMiddlware, noteController.saveNotes)
router.get('/', authMiddlware, noteController.getNotes)
router.patch('/:id', authMiddlware, noteController.updateNote)
router.delete('/:id', authMiddlware, noteController.deleteNote)
module.exports = router