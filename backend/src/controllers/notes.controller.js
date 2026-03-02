const noteModel = require('../models/notes.model')

const saveNotes = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user.id;
        const note = await noteModel.create({ userId, title, description });

        return res.status(201).json({
            message: 'notes saved successfully',
            notes: { _id: note._id, title, description }
        })
    } catch (error) {
        console.error('saveNotes error:', error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

const getNotes = async (req, res) => {
    try {

        const userId = req.user.id;
        const allNotes = await noteModel.find({ userId: req.user.id })
        return res.status(200).json({
            message: 'notes fetched successfully',
            notes: allNotes
        })
    } catch (error) {
        console.error('fetched Note:', error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

const updateNote = async (req, res) => {

    try {
        const id = req.params.id;
        const updatedNote = await noteModel.findOneAndUpdate({ _id: id, userId: req.user.id }, req.body,
            { new: true })
        return res.status(200).json({
            message: 'notes updated successfully',
            notes: updatedNote
        })
    }
    catch (error) {
        console.error('update Note:', error)
        return res.status(500).json({ message: 'Internal Server Error', error })
    }
}

const deleteNote = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedNotes = await noteModel.findOneAndDelete({ _id: id, userId: req.user.id }
        )
        return res.status(200).json({
            message: 'notes deleted successfully',
            deletedNotes: deletedNotes
        })
    }
    catch (error) {
        console.error('delete Note:', error)
        return res.status(500).json({ message: 'Internal Server Error', error })
    }

}
module.exports = { saveNotes, getNotes, updateNote, deleteNote }