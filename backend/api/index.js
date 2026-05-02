const dotenv = require('dotenv')
const dns = require('dns')
const connectDB = require('../src/config/db')
const { dnsFallBackMechanism } = require('../src/config/dns')
const app = require('../src/app')

dotenv.config()

dns.setDefaultResultOrder('ipv4first')
dnsFallBackMechanism()
connectDB()

module.exports = app
