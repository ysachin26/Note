//@ts-check
const { Schema, model } = require('mongoose')

const shareSchema = new Schema(
    {
        noteId: {
            type: Schema.Types.ObjectId,
            ref: 'note',
            required: true,
            index: true,
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
            index: true,
        },
        token: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        visibility: {
            type: String,
            enum: ['unlisted', 'public', 'password'],
            default: 'unlisted',
        },
        passwordHash: {
            type: String,
            default: null,
        },
        expiresAt: {
            type: Date,
            default: null,
        },
        revokedAt: {
            type: Date,
            default: null,
        },
        lastViewedAt: {
            type: Date,
            default: null,
        },
        viewCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
)

// Automatically remove share links after expiry when they still exist.
shareSchema.index(
    { expiresAt: 1 },
    {
        expireAfterSeconds: 0,
        partialFilterExpression: { expiresAt: { $type: 'date' } },
    }
)

const shareModel = model('share', shareSchema)

module.exports = shareModel