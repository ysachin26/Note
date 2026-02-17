const router = require('express').Router()

const authMiddlware = require('../middleware/auth.middleware')
const noteController = require('../controllers/notes.controller')

// protected routes
router.post('/', authMiddlware, noteController.saveNotes)

module.exports = router