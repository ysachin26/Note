const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.routes')
const noteRoutes = require('./routes/notes.routes')
const shareRoutes = require('./routes/share.routes')

const app = express();

// middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser())

// simple request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`)
    next()
})

app.get('/', (req, res) => {
    res.send('hello')
})

// api routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes)
app.use('/api/share', shareRoutes)

// JSON parse error handler: returns a clear 400 when client sends invalid JSON
app.use((err, req, res, next) => {
    if (err && err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Invalid JSON received:', err.message)
        return res.status(400).json({ message: 'Invalid JSON in request body' })
    }
    return next(err)
})

module.exports = app;