const noteModel = require('../models/notes.model')
const { Types } = require('mongoose')

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
    const userId = req.user.id;
const scope = req.query;
    try {
        let page = parseInt(req.query.page ?? req.params.page, 10);
        let limit = parseInt(req.query.limit ?? req.params.limit, 10);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 6;
     let skip = (page - 1) * limit;
        //base filter
        const match = {userId:new Types.ObjectId(userId)};

        //scope filter
        switch(scope)
        {
            case 'active':
            match.isArchived = {$ne:true};
            match.isImportant = {$ne:true};
              match.isBin = { $ne: true };
              break;

              case 'archived':
                 match.isArchived = true;
        break; case 'bin':
        match.isBin = true;
        break; case 'important':
        match.isImportant = true;
        break; case 'all':
      default:
        // no extra filter
        break;
        }

   

        const allNotes = await noteModel.aggregate([
            {
                $match: match
            },
            {
                $facet: {
                    metadata: [{ $count: "totalNotes" }],
                    data: [
                        { $sort: { createdAt: -1 } },
                        { $skip: skip },
                        { $limit: limit }
                    ]
                }
            }
        ]);

        const metadata = allNotes?.[0]?.metadata?.[0] || { totalNotes: 0 }
        const data = allNotes?.[0]?.data || []

        return res.status(200).json({
            message: "notes fetched successfully",
            page,
            limit,
            totalCount: metadata.totalNotes,
            notes: data,
            result: allNotes
        });

    } catch (error) {
        console.error("fetch Note:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

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