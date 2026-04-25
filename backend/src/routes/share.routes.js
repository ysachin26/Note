//@ts-check
const router = require('express').Router()

const authMiddleware = require('../middleware/auth.middleware')
const shareController = require('../controllers/share.controller')

router.post('/', authMiddleware, shareController.createShare)
router.get('/', authMiddleware, shareController.listShares)
router.get('/note/:noteId/latest', authMiddleware, shareController.getLatestShareForNote)
router.get('/:token', shareController.getSharedNote)
router.patch('/:token/revoke', authMiddleware, shareController.revokeShare)

module.exports = router