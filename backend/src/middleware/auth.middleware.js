const jwt = require('jsonwebtoken')

function authMiddlware(req, res, next) {
    // try Authorization header first, then cookie `token`
    const authHeader = req.get('Authorization') || req.get('authorization')
    const cookieToken = req.cookies && req.cookies.token

    let token = null
    if (authHeader && typeof authHeader === 'string') {
        token = authHeader.replace(/^Bearer\s+/i, '')
    } else if (cookieToken) {
        token = cookieToken
    }

    if (!token) {
        return res.status(401).json({ message: 'login first' })
    }

    try {
        const secret = process.env.JWT_SECRET || process.env.TOKEN_SECRET
        if (!secret) {
            console.warn('JWT secret not set; using fallback secret in development')
        }
        const decoded = jwt.verify(token, secret || 'dev_secret')
        req.user = decoded
        return next()
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' })
    }
}

module.exports = authMiddlware