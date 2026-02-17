const notesModel = require('../models/notes.model')

const saveNotes = async (req, res) => {
    try {
        const { title, description } = req.body;
        const note = await notesModel.create({ title, description });

        return res.status(201).json({
            message: 'notes saved successfully',
            notes: { _id: note._id, title, description }
        })
    } catch (error) {
        console.error('saveNotes error:', error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = { saveNotes }