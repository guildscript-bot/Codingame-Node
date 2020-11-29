const env = require('dotenv').config()
const Codingame = require('./Source/index.js')
const Client = new Codingame({Password: process.env.PASSWORD, Email: process.env.EMAIL})
setTimeout(()=>{Client.CreateClash().then((handle)=>{console.log(handle)})},5000)