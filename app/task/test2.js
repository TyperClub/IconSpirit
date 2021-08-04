const {execSync} = require('child_process')
const path = require('path')

execSync(`node ${path.resolve(__dirname, './main.js')} ll a`)