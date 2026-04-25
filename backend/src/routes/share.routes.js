//@ts-check
const router = require('express').Router()

const authMiddleware = require('../middleware/auth.middleware')
const shareController = require('../controllers/share.controller')

router.post('/', authMiddleware, shareController.createShare)
router.get('/:token', shareController.getSharedNote)
router.patch('/:token/revoke', authMiddleware, shareController.revokeShare)

module.exports = router