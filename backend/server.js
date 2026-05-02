const dotenv = require('dotenv')
dotenv.config()
const connectDB = require('./src/config/db')
const { dnsFallBackMechanism } = require('./src/config/dns')
const dns = require('dns');

dns.setDefaultResultOrder('ipv4first')
dnsFallBackMechanism()
connectDB();

const app = require('./src/app')
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})