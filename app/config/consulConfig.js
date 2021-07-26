
const {execSync} = require('child_process')
const path = require('path')

let result = execSync(`node ${path.resolve(__dirname, './consul.js')}`)

module.exports.consulConfig = JSON.parse(result.toString())