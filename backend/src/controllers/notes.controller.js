//@ts-check

const noteModel = require('../models/notes.model')
const { Types } = require('mongoose')

/**
 * @typedef {{ title: string, description: string }} CreateNoteBody
 * @typedef {{ title?: string, description?: string, isArchived?: boolean, isImportant?: boolean, isBin?: boolean, binAt?: Date | null }} UpdateNoteBody
 * @typedef {{ id: string }} IdParams
 * @typedef {{ page?: string, limit?: string, scope?: string ,q?:string, from?:string,to?:string}} NotesQuery
 * @typedef {{ id: string }} AuthUser
 * @typedef {import('express').Request & { user?: AuthUser }} AuthenticatedRequest
 */

/**
 * @param {AuthenticatedRequest} req
 * @param {import('express').Response} res
 *  
 *@returns {Promise<import('express').Response | void>}
 */

const saveNotes = async (req, res) => {

    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'login first' })
        }

        const { title, description } = /** @type {CreateNoteBody} */ (req.body);
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
/**
 * @param {AuthenticatedRequest} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response | void>}
 */

const getNotes = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'login first' })
    }

    const userId = req.user.id;
    const query = /** @type {NotesQuery} */ (req.query)
    const scope = (query.scope || 'all').toLowerCase();

    const searchText = (query.q || '').trim();
    const fromDate = (query.from || '').trim();
    const toDate = (query.to || '').trim();

    try {
        let page = parseInt(query.page ?? '1', 10);
        let limit = parseInt(query.limit ?? '6', 10);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 6;

        let skip = (page - 1) * limit;
        //base filter
        /**  @type {{ userId: import('mongoose').Types.ObjectId, isArchived?: boolean | { $ne: true }, isImportant?: boolean | { $ne: true }, isBin?: boolean | { $ne: true }, $text?: { $search: string }, createdAt?: { $gte?: Date, $lte?: Date } }} */

        const match = { userId: new Types.ObjectId(userId) };
        //scope filter
        switch (scope) {
            case 'active':
                match.isArchived = { $ne: true };
                match.isImportant = { $ne: true };
                match.isBin = { $ne: true };
                break;

            case 'archived':
                match.isArchived = true;
                break;

            case 'bin':
                match.isBin = true;
                break;

            case 'important':
                match.isImportant = true;
                break;

            case 'all':


            default:
                // no extra filter
                break;
        }


        if (searchText) {
            match.$text = { $search: searchText };
        }

        if (fromDate || toDate) {
            match.createdAt = {};
            if (fromDate) {
                //$gte: Stands for "greater than or equal to" (>=)
                match.createdAt.$gte = new Date(fromDate);
            }
            if (toDate) {
                const endDate = new Date(toDate);
                endDate.setHours(23, 59, 59, 999);
                match.createdAt.$lte = endDate;
            }
        }
        const totalCount = await noteModel.countDocuments(match);
        const queryBuilder = noteModel.find(match);

        //pagination and sorting
        const notes = await (searchText
            ? queryBuilder.sort({ score: { $meta: 'textScore' } })
            : queryBuilder.sort({ createdAt: -1 }))
            .skip(skip)
            .limit(limit)
            .lean();

        return res.status(200).json({
            message: 'notes fetched successfully',
            page,
            limit,
            totalCount,
            notes
        });
    } catch (error) {
        console.error('fetch Note:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
/**
 * @param {AuthenticatedRequest} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response | void>}
 */
const updateNote = async (req, res) => {

    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'login first' })
        }

        const { id } = /** @type {IdParams} */ (req.params);
        const payload = { .../** @type {UpdateNoteBody} */ (req.body) }

        // Maintain binAt for TTL auto-deletion logic.
        if (Object.prototype.hasOwnProperty.call(payload, 'isBin')) {
            if (payload.isBin) {
                payload.binAt = new Date();
            } else {
                payload.binAt = null;
            }
        }

        const updatedNote = await noteModel.findOneAndUpdate({ _id: id, userId: req.user.id }, payload,
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
/**
 * @param {AuthenticatedRequest} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response | void>}
 */
const deleteNote = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'login first' })
        }

        const { id } = /** @type {IdParams} */ (req.params);
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