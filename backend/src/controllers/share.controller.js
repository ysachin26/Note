//@ts-check

const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const noteModel = require('../models/notes.model')
const shareModel = require('../models/share.model')
const { Types } = require('mongoose')

/**
 * @typedef {{ noteId: string, visibility?: 'unlisted' | 'public' | 'password', password?: string, expiresAt?: string | null }} CreateShareBody
 * @typedef {{ password?: string }} SharedNoteQuery
 * @typedef {{ token: string }} ShareParams
 * @typedef {import('express').Request & { user?: { id: string } }} AuthenticatedRequest
 * @typedef {import('express').Response} Response
 */

/**
 * @param {AuthenticatedRequest} req
 * @param {Response} res
 */
const createShare = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'login first' })
        }

        const body = /** @type {CreateShareBody} */ (req.body)
        const note = await noteModel.findOne({ _id: body.noteId, userId: req.user.id })
        if (!note) {
            return res.status(404).json({ message: 'note not found' })
        }

        const token = crypto.randomBytes(18).toString('hex')
        const visibility = body.visibility || 'unlisted'

        let passwordHash = null
        if (visibility === 'password') {
            if (!body.password) {
                return res.status(400).json({ message: 'password is required for password-protected shares' })
            }
            passwordHash = await bcrypt.hash(body.password, 10)
        }

        const share = await shareModel.create({
            noteId: note._id,
            ownerId: new Types.ObjectId(req.user.id),
            token,
            visibility,
            passwordHash,
            expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        })

        return res.status(201).json({
            message: 'share link created',
            share: {
                token: share.token,
                visibility: share.visibility,
                expiresAt: share.expiresAt,
                url: `${process.env.PUBLIC_APP_URL || 'http://localhost:5173'}/share/${share.token}`,
            },
        })
    } catch (error) {
        console.error('createShare error:', error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

/**
 * @param {import('express').Request} req
 * @param {Response} res
 */
const getSharedNote = async (req, res) => {
    try {
        const { token } = /** @type {ShareParams} */ (req.params)
        const query = /** @type {SharedNoteQuery} */ (req.query)
        const share = await shareModel.findOne({ token }).lean()

        if (!share) {
            return res.status(404).json({ message: 'share link not found' })
        }

        if (share.revokedAt) {
            return res.status(410).json({ message: 'share link revoked' })
        }

        if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
            return res.status(410).json({ message: 'share link expired' })
        }

        if (share.visibility === 'password') {
            if (!share.passwordHash) {
                return res.status(401).json({ message: 'password required' })
            }

            if (!query.password) {
                return res.status(401).json({ message: 'password required' })
            }

            const isPasswordValid = await bcrypt.compare(query.password, share.passwordHash)
            if (!isPasswordValid) {
                return res.status(403).json({ message: 'invalid password' })
            }
        }

        const note = await noteModel.findOne({ _id: share.noteId }).lean()
        if (!note) {
            return res.status(404).json({ message: 'note not found' })
        }

        const safeNote = {
            _id: note._id,
            title: note.title,
            description: note.description,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
            visibility: share.visibility,
        }

        await shareModel.updateOne({ token }, { $set: { lastViewedAt: new Date() } })

        return res.status(200).json({
            message: 'shared note fetched',
            share: {
                token: share.token,
                visibility: share.visibility,
                expiresAt: share.expiresAt,
            },
            note: safeNote,
        })
    } catch (error) {
        console.error('getSharedNote error:', error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

/**
 * @param {AuthenticatedRequest} req
 * @param {Response} res
 */
const revokeShare = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'login first' })
        }

        const { token } = /** @type {ShareParams} */ (req.params)
        const share = await shareModel.findOneAndUpdate(
            { token, ownerId: req.user.id },
            { revokedAt: new Date() },
            { new: true }
        )

        if (!share) {
            return res.status(404).json({ message: 'share link not found' })
        }

        return res.status(200).json({
            message: 'share link revoked',
            share: { token: share.token, revokedAt: share.revokedAt },
        })
    } catch (error) {
        console.error('revokeShare error:', error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = {
    createShare,
    getSharedNote,
    revokeShare,
}