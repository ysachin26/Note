const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const authRoutes = require('./src/routes/auth.routes')
const noteRoutes = require('./src/routes/notes.routes')
const connectDB = require('./src/config/db')

connectDB();
const app = require('./src/app')
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})

app.use('/api/auth/', authRoutes);
app.use('/api/notes', noteRoutes)