const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

const UserModel = require('../src/models/user.model');
const NoteModel = require('../src/models/notes.model');
const { dnsFallBackMechanism } = require('../src/config/dns');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

const argEmail = process.argv.find((arg) => arg.startsWith('--email='))?.split('=')[1];
const targetEmail = (process.env.SEED_EMAIL || argEmail || 'tocontactsy@gmail.com').trim().toLowerCase();

dns.setDefaultResultOrder('ipv4first');
dnsFallBackMechanism();

const notesPayload = [
    {
        title: '[Learn-Seed] Pagination Basics',
        description: [
            'Pagination splits large datasets into pages.',
            '',
            'Code used:',
            'let page = parseInt(req.query.page, 10);',
            'let limit = parseInt(req.query.limit, 10);',
            'const skip = (page - 1) * limit;',
            '',
            'Why: keeps queries fast and UI manageable.'
        ].join('\n')
    },
    {
        title: '[Learn-Seed] Why Limit = 6',
        description: [
            'We fixed page size to 6 for consistent UI.',
            '',
            'Code used:',
            'if (isNaN(limit) || limit < 1) limit = 6;',
            '',
            'Formula:',
            'totalPages = Math.ceil(totalCount / limit);'
        ].join('\n')
    },
    {
        title: '[Learn-Seed] Base Filter Concept',
        description: [
            'Base filter always applies user scope first.',
            '',
            'Code used:',
            'const match = { userId: new Types.ObjectId(userId) };',
            '',
            'Reason: user isolation and security.'
        ].join('\n')
    },
    {
        title: '[Learn-Seed] Scope Filtering',
        description: [
            'Scope controls list type: all/active/archived/bin/important.',
            '',
            'Code used:',
            "const scope = (req.query.scope || 'all').toLowerCase();",
            'switch (scope) { /* add match conditions */ }',
            '',
            'Reason: one endpoint, multiple filtered views.'
        ].join('\n')
    },
    {
        title: '[Learn-Seed] What $ne Means',
        description: [
            '$ne in MongoDB means not equal.',
            '',
            'Code used:',
            'match.isArchived = { $ne: true };',
            'match.isBin = { $ne: true };',
            '',
            'Result: excludes docs where field is true.'
        ].join('\n')
    },
    {
        title: '[Learn-Seed] Active Scope Rule',
        description: [
            'Active scope excludes archived, bin, important.',
            '',
            'Code used:',
            "case 'active':",
            '  match.isArchived = { $ne: true };',
            '  match.isImportant = { $ne: true };',
            '  match.isBin = { $ne: true };'
        ].join('\n')
    },
    {
        title: '[Learn-Seed] API Query Params',
        description: [
            'Frontend sends page/limit/scope as query params.',
            '',
            'Code used:',
            "axiosInstance.get('/notes', {",
            '  params: { page, limit, scope }',
            '});'
        ].join('\n')
    },
    {
        title: '[Learn-Seed] Thunk Payload Shape',
        description: [
            'createAsyncThunk expects one payload object.',
            '',
            'Code used:',
            "dispatch(fetchNotesThunk({ page: Page, limit: 6, scope: 'active' }));",
            '',
            'Wrong old style: fetchNotesThunk(Page, 6)'
        ].join('\n')
    },
    {
        title: '[Learn-Seed] Numbered Page UI',
        description: [
            'Generated page numbers from totalPages.',
            '',
            'Code used:',
            'const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);',
            '',
            'Active class when Page === pageNumber.'
        ].join('\n')
    },
    {
        title: '[Learn-Seed] Prev/Next Behavior',
        description: [
            'Prev/Next guard prevents invalid navigation.',
            '',
            'Code used:',
            'disabled={Page === 1}',
            'disabled={Page === totalPages || totalPages === 0}',
            '',
            'Also handlers clamp: Page > 1 and Page < totalPages.'
        ].join('\n')
    },
    {
        title: '[Learn-Seed] Deletion and Pagination',
        description: [
            'After mutation, refetch current page to sync totals.',
            '',
            'Code used:',
            'const res = await dispatch(updateNoteThunk({ id, data: { isBin: true } }));',
            'if (updateNoteThunk.fulfilled.match(res)) refetchPage(Page);'
        ].join('\n')
    },
    {
        title: '[Learn-Seed] Page Clamp Logic',
        description: [
            'Clamp page when deletion empties current page.',
            '',
            'Code used:',
            'if (!loading && Page > 1 && notes.length === 0) {',
            '  setPage((prev) => prev - 1);',
            '}',
            '',
            'Also guard when Page > totalPages.'
        ].join('\n')
    },
    {
        title: '[Learn-Seed] Soft vs Hard Delete',
        description: [
            'Two delete behaviors:',
            '- Notes page: soft delete (move to bin)',
            '- Bin page: hard delete (permanent)',
            '',
            'Code used:',
            "updateNoteThunk({ id, data: { isBin: true } })",
            'deleteNoteThunk(id)'
        ].join('\n')
    },
    {
        title: '[Learn-Seed] Bin Page Data Source',
        description: [
            'Bin page must fetch bin scope explicitly.',
            '',
            'Code used:',
            "dispatch(fetchNotesThunk({ page: 1, limit: 50, scope: 'bin' }));",
            '',
            'Reason: prevents stale cross-page state.'
        ].join('\n')
    },
    {
        title: '[Learn-Seed] Quick Checklist',
        description: [
            'Checklist of final changes:',
            '1) Backend scope + base filter',
            '2) $ne for active',
            '3) Thunk object payload',
            '4) API params include scope',
            '5) Numbered pagination UI',
            '6) Refetch after mutate',
            '7) Clamp page after delete'
        ].join('\n')
    }
];

async function seedLearningNotes() {
    if (!uri) {
        console.error('Missing MONGODB_URI or MONGO_URI in environment.');
        process.exit(1);
    }

    await mongoose.connect(uri);

    const user = await UserModel.findOne({ email: new RegExp(`^${targetEmail}$`, 'i') }).select('_id email');
    if (!user) {
        console.error(`No user found for email: ${targetEmail}`);
        await mongoose.disconnect();
        process.exit(1);
    }

    await NoteModel.deleteMany({ userId: user._id, title: { $regex: '^\\[Learn-Seed\\]' } });

    const docs = notesPayload.map((item) => ({
        userId: user._id,
        title: item.title,
        description: item.description,
        isPinned: false,
        isArchived: false,
        isImportant: false,
        isBin: false
    }));

    const inserted = await NoteModel.insertMany(docs);

    console.log(`Seeded ${inserted.length} learning notes for user ${user.email || user._id}.`);

    await mongoose.disconnect();
}

seedLearningNotes().catch(async (err) => {
    console.error('Seeding failed:', err.message);
    try {
        await mongoose.disconnect();
    } catch (_) {
        // no-op
    }
    process.exit(1);
});
